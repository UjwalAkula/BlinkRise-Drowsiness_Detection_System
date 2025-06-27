import cv2
import time
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Annotated, Literal
import controller

router = APIRouter()

camera = None
camera_lock = asyncio.Lock()

async def generate_video_stream():
    global camera
    while True:
        async with camera_lock:
            if not camera or not camera.isOpened():
                break
            success, frame = camera.read()
        
        if not success:
            break

        processed_frame = controller.process_frame(frame)
        ret, buffer = cv2.imencode('.jpg', processed_frame)
        if not ret:
            break
        
        frame_bytes = buffer.tobytes()
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
        )
        await asyncio.sleep(0.03)

@router.post("/camera_control")
async def camera_control(
    action: Annotated[Literal['start', 'stop'], Query()]
):
    global camera
    async with camera_lock:
        if action == "start":
            if not camera or not camera.isOpened():
                camera = cv2.VideoCapture(0)
                if camera.isOpened():
                    for _ in range(5):
                        success, _ = camera.read()
                        if not success:
                            camera.release()
                            camera = None
                            return JSONResponse(
                                status_code=500,
                                content={"status": "failed", "message": "Failed to warm up camera."}
                            )
                        await asyncio.sleep(0.05)
                    
                    if camera.isOpened():
                        return {"status": "success", "message": "Camera stream started."}
                else:
                    camera = None
                    return JSONResponse(
                        status_code=500,
                        content={"status": "failed", "message": "Failed to open camera device."}
                    )
            else:
                return {"status": "info", "message": "Camera already running."}

        elif action == "stop":
            if camera and camera.isOpened():
                camera.release()
                camera = None
                controller.drowsiness_state.update({
                    "ear": 0.0,
                    "blink": 0,
                    "status": "Video Off",
                    "probability": 0.0,
                    "alarm_on": False
                })
                return {"status": "success", "message": "Camera stopped and state reset."}
            else:
                return {"status": "info", "message": "Camera already stopped or not active."}

@router.get("/video_feed")
async def video_feed():
    global camera
    async with camera_lock:
        if not camera or not camera.isOpened():
            return JSONResponse(
                status_code=503,
                content={"message": "Camera not active or unavailable. Please start it first via /camera_control?action=start."}
            )
    return StreamingResponse(generate_video_stream(), media_type="multipart/x-mixed-replace; boundary=frame")

@router.websocket("/ws/drowsiness")
async def drowsiness_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(controller.drowsiness_state)
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")

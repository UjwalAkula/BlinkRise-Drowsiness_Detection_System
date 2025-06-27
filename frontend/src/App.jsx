import React, { useState, useEffect, useRef, useCallback } from 'react';
import VideoPart from './components/VideoPart';
import MetricBoxes from './components/MetricBoxes';

const App = () => {
    const [drowsinessData, setDrowsinessData] = useState({
        ear: 0.00,
        blink: 0,
        status: "Loading...",
        probability: 0.00,
        alarm_on: false
    });
    const [backendError, setBackendError] = useState(null);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [streamKey, setStreamKey] = useState(0);
    const wsRef = useRef(null);

    const API_BASE_URL = 'http://127.0.0.1:8000';
    const cameraControlUrl = `${API_BASE_URL}/camera_control`;
    const drowsinessWsUrl = `ws://127.0.0.1:8000/ws/drowsiness`;

    const sendCameraControl = useCallback(async (action) => {
        try {
            const response = await fetch(`${cameraControlUrl}?action=${action}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (!response.ok) {
                return { status: "failed", message: data.message || "Unknown error from backend" };
            }
            return { status: data.status, message: data.message };
        } catch (error) {
            return { status: "error", message: `Network error: ${error.message}` };
        }
    }, [cameraControlUrl]);

    const handleToggleVideo = async () => {
    if (isVideoOn) {
        // Turn off video and reset camera
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        await sendCameraControl('stop');

        // Reload page after brief delay to ensure backend finishes
        setTimeout(() => {
            window.location.reload();
        }, 300);
    } else {
        // Turn ON video
        setVideoLoading(true);
        setBackendError(null);
        setStreamKey(prev => prev + 1);

        const controlResponse = await sendCameraControl('start');
        if (controlResponse.status === "success") {
            setIsVideoOn(true);
            wsRef.current = new WebSocket(drowsinessWsUrl);
            wsRef.current.onopen = () => {
                console.log("WebSocket connected for drowsiness data.");
            };
            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setDrowsinessData(data);
                } catch (e) {
                    console.error("WebSocket message parse error:", e);
                    setBackendError("Invalid data from backend.");
                }
            };
            wsRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setBackendError("Connection lost.");
                setIsVideoOn(false);
                setVideoLoading(false);
                if (wsRef.current) wsRef.current.close();
            };
            wsRef.current.onclose = () => {
                console.log("WebSocket closed.");
            };
        } else {
            setIsVideoOn(false);
            setVideoLoading(false);
            setBackendError(`Camera start failed: ${controlResponse.message}`);
        }
    }
};


    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            sendCameraControl('stop').catch(e => console.error("Error stopping camera on unmount:", e));
        };
    }, [sendCameraControl]);

    useEffect(() => {
        if (!isVideoOn) {
            setVideoLoading(false);
            setDrowsinessData({
                ear: 0.00,
                blink: 0,
                status: "Video Off",
                probability: 0.00,
                alarm_on: false
            });
        }
    }, [isVideoOn]);

    return (
        <div className="p-4 max-w-screen-xl mx-auto mt-2 md:mt-0 md:h-screen flex flex-col min-h-screen">
            {/* Header */}
            <div className="flex flex-col mb-3 shadow-md py-2 px-6 rounded-lg bg-white">
                <h1 className="text-4xl text-left font-bold text-blue-800">
                    BlinkRise
                </h1>
                <span className="text-left font-bold text-sm text-blue-400">
                    Drowsiness Detection System
                </span>
            </div>

            {/* Error Message */}
            {backendError && (
                <div className="p-4 mb-4 bg-red-100 border border-red-500 rounded-lg text-center">
                    <p className="text-red-700 font-medium">Error: {backendError}</p>
                </div>
            )}

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row gap-4 flex-grow mb-2">
                <div className="flex-1">
                    <VideoPart
                        videoStreamUrl={API_BASE_URL + '/video_feed'}
                        backendError={backendError}
                        isVideoOn={isVideoOn}
                        videoLoading={videoLoading}
                        setVideoLoading={setVideoLoading}
                        drowsinessData={drowsinessData}
                        streamKey={streamKey}
                        handleToggleVideo={handleToggleVideo} // pass button handler here
                    />
                </div>
                <div className="pt-0.5 flex-1 md:max-w-xs">
                    <MetricBoxes drowsinessData={drowsinessData} />
                </div>
            </div>
        </div>
    );
};

export default App;

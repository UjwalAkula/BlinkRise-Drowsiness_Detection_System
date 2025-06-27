import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import pickle
import scipy.spatial

# ───── Load SVM Model ─────
try:
    with open('svm_model.pkl', 'rb') as file:
        model = pickle.load(file)
        print("SVM Model loaded successfully.")
except FileNotFoundError:
    model = None
    print("[ERROR] SVM model file not found.")
except Exception as e:
    model = None
    print(f"[Error] An error occurred while loading the SVM model: {e}")

# ───── Initialize MediaPipe Face Mesh ─────
mp_fac_mesh = mp.solutions.face_mesh
face_mesh = mp_fac_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# ───── Global State ─────
drowsiness_state = {
    "ear": 0.0,
    "blink": 0,
    "status": "No Face",
    "probability": 0.0,
    "alarm_on": False
}

# ───── EAR Calculation ─────
def calculate_ear(eye):
    A = scipy.spatial.distance.euclidean(eye[1], eye[5])
    B = scipy.spatial.distance.euclidean(eye[2], eye[4])
    C = scipy.spatial.distance.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)

# ───── Get Eye Points ─────
def get_eye_points(landmarks, frame_shape):
    h, w = frame_shape[:2]
    left_indices = [33, 160, 158, 133, 153, 144]
    right_indices = [263, 387, 385, 362, 380, 373]
    left_eye = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in left_indices]
    right_eye = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in right_indices]
    return left_eye, right_eye

# ───── Process Each Frame ─────
def process_frame(frame):
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    ear = 0.0
    blink = 0
    status = "No Face"
    prob = 0.0
    alarm = False

    if results.multi_face_landmarks:
        landmarks = results.multi_face_landmarks[0].landmark
        left_eye_points, right_eye_points = get_eye_points(landmarks, frame.shape)

        ear_left = calculate_ear(left_eye_points)
        ear_right = calculate_ear(right_eye_points)
        ear_avg = (ear_left + ear_right) / 2.0
        ear = ear_avg
        blink = 1 if ear < 0.2 else 0

        if model:
            features = pd.DataFrame([[ear, blink]], columns=["EAR", "Blink"])
            try:
                prob = model.predict_proba(features)[0][1]
                status = "Drowsy" if prob > 0.6 else "Non_Drowsy"
                alarm = True if status == "Drowsy" else False
            except Exception as e:
                print(f"[ERROR] SVM prediction failed: {e}")
                status = "Prediction Error"
                alarm = False
        else:
            status = "Eyes Closed (No Model)" if ear < 0.2 else "Eyes Open (No Model)"
            alarm = False

    drowsiness_state["ear"] = ear
    drowsiness_state["blink"] = blink
    drowsiness_state["status"] = status
    drowsiness_state["probability"] = prob
    drowsiness_state["alarm_on"] = alarm

    return frame
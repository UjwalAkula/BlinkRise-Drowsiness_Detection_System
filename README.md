# BlinkRise - Drowsiness Detection System

## Overview

This repository contains the full-stack implementation of **BlinkRise**, an intelligent drowsiness detection system. BlinkRise aims to enhance driver safety by monitoring driver alertness in real-time. It leverages advanced computer vision techniques to analyze eye blink patterns and facial landmarks, detecting early signs of drowsiness and fatigue to help prevent accidents caused by inattention. The system comprises a Python Flask backend for video processing and AI inference, and a React frontend for the user interface and alerts.

---

## Features

### 🎯 Core Functionality

* **Real-time Eye Tracking:** Continuous monitoring of eye movements and blink patterns via webcam.
* **Facial Landmark Detection:** Utilizes MediaPipe for accurate facial feature recognition, focusing on eye regions.
* **Drowsiness Classification:** Employs a pre-trained **Support Vector Machine (SVM)** model to classify states as 'Drowsy' or 'Non_Drowsy'.
* **Intelligent Blink Analysis:** Analyzes Eye Aspect Ratio (EAR) to quantify eye openness/closure and detect prolonged blinks.
* **Multi-modal Alerts:** Triggers visual warnings directly on the video feed and an accompanying audio alarm played on the frontend.

---

## 🛠️ Technologies Used

### Backend (Python FastAPI)

* **Python 3.8+**
* **FastAPI:** Asynchronous web framework for high-performance API endpoints and serving video stream.
* **OpenCV (`opencv-python`):** For camera interaction and image processing.
* **MediaPipe:** For robust facial landmark detection.
* **Scikit-learn:** For the Support Vector Machine (SVM) model.
* **NumPy & Pandas:** For numerical operations and data handling.

### Frontend (React)

* **React:** JavaScript library for building the user interface.
* **Vite:** Fast development build tool.
* **Tailwind :** A utility-first CSS framework for rapid and responsive UI development.
* **JavaScript (ES6+)**
* **CSS**

---

## Getting Started

Follow these instructions to set up and run BlinkRise locally on your machine.

### Prerequisites

* **Node.js** (LTS recommended) and **npm** (comes with Node.js)
* **Python 3.8+**
* A **webcam** connected to your computer for live detection.

### Installation

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/UjwalAkula/BlinkRise-Drowsiness_Detection_System])
    cd BlinkRise-Drowsiness_Detection_System
    ```

2.  **Set up Backend (Python):**

    * Navigate into the `backend` directory:
        ```bash
        cd backend
        ```
    * Create and activate a Python virtual environment:
        ```bash
        python -m venv myvenv
        # On Windows: myvenv\Scripts\Activate.ps1
        # On macOS/Linux: source myvenv/bin/activate
        ```
    * Install Python dependencies:
        ```bash
        pip install -r requirements.txt
        ```

3.  **Set up Frontend (React):**

    * Navigate back to the project root, then into the `frontend` directory:
        ```bash
        cd frontend
        ```
    * Install Node.js dependencies:
        ```bash
        npm install
        ```
    * Ensure the alarm sound file `frontend/public/alarm.mp3` is present.
    * **Adjust `App.jsx` API URL:** Open `frontend/src/App.jsx` and ensure `API_BASE_URL` is set to `http://localhost:5000` for local development.

### Usage

To run BlinkRise locally:

1.  **Start the Backend Server:**

    * Open a **new terminal or PowerShell window.**
    * Navigate to your `backend` directory:
        ```bash
        cd backend
        ```
    * Activate your virtual environment:
        ```bash
        myvenv\Scripts\Activate.ps1  # Windows example
        # OR: source myvenv/bin/activate  # macOS/Linux example
        ```
    * Run the Flask application:
        ```bash
        uvicorn app:app --reload
        ```
    * Keep this terminal running.

2.  **Start the Frontend Development Server:**

    * Open **another new terminal or PowerShell window.**
    * Navigate to your `frontend` directory:
        ```bash
        cd frontend
        ```
    * Start the React application:
        ```bash
        npm run dev
        ```
    * Your default web browser should automatically open to `http://localhost:5173` (or a similar port).
    * Click the "Turn On Video" button in the browser to begin the drowsiness detection.

---

## 💡 Inspiration

Drowsy driving causes thousands of preventable accidents every year. BlinkRise was born from the idea that combining machine learning, computer vision, and web technologies can create accessible safety solutions.

---

**Stay Alert, Stay Safe! 🚗💤**
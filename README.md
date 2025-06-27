
# BlinkRise - Drowsiness Detection System

## Overview

This repository contains the full-stack implementation of **BlinkRise**, an intelligent drowsiness detection system. BlinkRise aims to enhance driver safety by monitoring driver alertness in real-time. It leverages advanced computer vision techniques to analyze eye blink patterns and facial landmarks, detecting early signs of drowsiness and fatigue to help prevent accidents caused by inattention. The system comprises a Python **FastAPI** backend for video processing and AI inference, and a React + Tailwind frontend for the user interface and alerts.

---

## Features

### 🎯 Core Functionality

- **Real-time Eye Tracking:** Continuous monitoring of eye movements and blink patterns via webcam.
- **Facial Landmark Detection:** Utilizes MediaPipe for accurate facial feature recognition, focusing on eye regions.
- **Drowsiness Classification:** Employs a pre-trained **Support Vector Machine (SVM)** model to classify states as 'Drowsy' or 'Non_Drowsy'.
- **Intelligent Blink Analysis:** Analyzes Eye Aspect Ratio (EAR) to quantify eye openness/closure and detect prolonged blinks.
- **Multi-modal Alerts:** Triggers visual warnings directly on the video feed and an accompanying audio alarm played on the frontend.

---

## 🛠️ Technologies Used

### Backend (Python FastAPI)

- **Python 3.8+**
- **FastAPI:** Asynchronous web framework for high-performance API endpoints and serving video stream.
- **OpenCV (`opencv-python`):** For camera interaction and image processing.
- **MediaPipe:** For robust facial landmark detection.
- **Scikit-learn:** For the Support Vector Machine (SVM) model.
- **NumPy & Pandas:** For numerical operations and data handling.

### Frontend (React + Tailwind CSS)

- **React:** JavaScript library for building the user interface.
- **Vite:** Fast development build tool.
- **Tailwind CSS:** Utility-first CSS framework for responsive design.
- **JavaScript (ES6+)**
- **CSS**

---

## Getting Started

Follow these instructions to set up and run BlinkRise locally on your machine.

### Prerequisites

- **Node.js** (LTS recommended) and **npm** (comes with Node.js)
- **Python 3.8+**
- A **webcam** connected to your computer for live detection

---

### 🚀 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/UjwalAkula/BlinkRise-Drowsiness_Detection_System.git
cd BlinkRise-Drowsiness_Detection_System
````

2. **Set up Backend (Python + FastAPI)**

```bash
cd backend
python -m venv myvenv
# On Windows:
myvenv\Scripts\Activate.ps1
# On macOS/Linux:
source myvenv/bin/activate

pip install -r requirements.txt
```

3. **Set up Frontend (React + Tailwind CSS)**

```bash
cd ../frontend
npm install
```

```js
const API_BASE_URL = "http://localhost:8000";
```

---

### 💻 Running the Application

#### 1. Start the Backend Server

```bash
cd backend
myvenv\Scripts\Activate.ps1  # or source myvenv/bin/activate
uvicorn app:app --reload
```

> The backend API will be available at [http://localhost:8000](http://localhost:8000)

#### 2. Start the Frontend Development Server

```bash
cd ../frontend
npm run dev
```

> Your browser should open at [http://localhost:5173](http://localhost:5173)

Click the **"Turn On Video"** button to begin the drowsiness detection.

---

## 💡 Inspiration

Drowsy driving causes thousands of preventable accidents every year. BlinkRise was born from the idea that combining machine learning, computer vision, and web technologies can create accessible safety solutions.

---
---

**Stay Alert, Stay Safe! 🚗💤**

```
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies (needed by numpy, opencv, etc.)
RUN apt-get update && apt-get install -y \
    libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first to improve build caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY app.py .
COPY controller.py .
COPY router.py .
COPY svm_model.pkl .

# Ensure myenv and notebook folders are NOT copied
# (COPY . .) would copy them → DON'T use that line

# Railway dynamically assigns PORT → use it here
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]

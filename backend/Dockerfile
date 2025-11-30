FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for Pillow / PDF processing
RUN apt-get update && apt-get install -y gcc libgl1 poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Environment variable to see logs in real-time
ENV PYTHONUNBUFFERED=1

# Default command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
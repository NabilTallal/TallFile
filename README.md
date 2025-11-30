# TallFile

A simple, fast, and modern file-processing pipeline.

Upload a file → TallFile stores it → processes it asynchronously → and gives you useful outputs like thumbnails, extracted text, and file hashes.

## 🚀 Features

### Backend
- Upload any file to MinIO
- Asynchronous processing using Celery
- PDF → Automatically extracts text
- Images → Automatically generates thumbnails
- Computes SHA-256 for all files
- Endpoint to download both original and processed outputs

### Frontend
- Clean React + Vite app
- Upload files from the browser
- Shows task status in real time
- Displays download links for processed files
- Fully styled with TailwindCSS

## 🧠 How TallFile Works

1. You upload a file from the frontend
2. FastAPI sends it to MinIO
3. A Celery worker processes it in the background
4. Depending on the file type, TallFile may:
   - Extract text (PDF)
   - Generate a thumbnail (images)
   - Compute SHA-256 (all files)
5. You retrieve the results using the job ID
6. Download everything from MinIO through the backend

## 🏗️ Tech Stack

### Backend
- FastAPI
- Celery
- Redis (broker + backend)
- MinIO
- Python 3.10+

### Frontend
- React
- Vite
- TailwindCSS

## 📡 API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload` | POST | Uploads a file. Returns `job_id` and `object_name` |
| `/status/{job_id}` | GET | Check if processing is done. Returns final results when finished |
| `/download/{object_name}` | GET | Download original or processed files |

## 📁 Directory Structure
```bash
backend/
├── app/
│ ├── routes/
│ ├── services/
│ ├── workers/
│ └── config.py

frontend/
├── src/
│ ├── App.jsx
│ ├── components/
│ └── styles/
```

## ⚙️ Environment Variables

```bash
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=
BROKER_URL=
```
## 💡 Example Output
###Upload a PDF → TallFile returns:

SHA-256

Extracted text (.txt)

### Upload an image → TallFile returns:

SHA-256

Generated thumbnail (.thumb.jpg)

## 🔧 Running Locally
### Backend
```bash
Start MinIO

Start Redis

Run FastAPI

Run Celery worker

```

Frontend
```bash
npm install
npm run dev
```
## 📌 Future Improvements

 - Multi-file upload
 - Drag & drop interface
 - Automatic preview of processed outputs
 - User accounts / history

## 📄 License

MIT License

Copyright (c) 2025 TallFile

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

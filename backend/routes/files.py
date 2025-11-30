from fastapi import APIRouter, UploadFile, File
from services.storage import upload_file, get_presigned_url
from workers.tasks import process_file_task
import uuid, io, mimetypes
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from services.storage import client, MINIO_BUCKET
import io

router = APIRouter()

@router.post("/upload", status_code=202)
async def upload(file: UploadFile = File(...)):
    content = await file.read()
    object_name = f"{uuid.uuid4().hex}_{file.filename}"
    upload_file(io.BytesIO(content), object_name, content_type=file.content_type or mimetypes.guess_type(file.filename)[0] or "application/octet-stream")
    job = process_file_task.apply_async(args=[object_name, file.filename, file.content_type or "application/octet-stream"])
    return {"job_id": job.id, "object_name": object_name}

@router.get("/status/{job_id}")
async def status(job_id: str):
    res = process_file_task.AsyncResult(job_id)
    if res.state == "SUCCESS":
        return {"status": "finished", "result": res.result}
    return {"status": res.state.lower()}


@router.get("/download/{object_name}")
async def download(object_name: str):
    try:
        # Get the object from MinIO
        response = client.get_object(MINIO_BUCKET, object_name)

        # Read the content into a BytesIO buffer
        file_like = io.BytesIO(response.read())

        # Return a streaming response
        return StreamingResponse(
            file_like,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={object_name}"}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"File not found: {str(e)}")
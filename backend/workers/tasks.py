from celery import Celery
from config import BROKER_URL
from services import storage, processor
import io

celery = Celery(
    "workers",
    broker=BROKER_URL,
    backend=BROKER_URL,
)

@celery.task(bind=True, queue="file_tasks")
def process_file_task(self, object_name: str, filename: str, content_type: str):
    client = storage.client
    data = client.get_object(storage.MINIO_BUCKET, object_name).read()

    result = {
        "object_name": object_name,
        "filename": filename,
        "content_type": content_type
    }

    result["sha256"] = processor.sha256_bytes(data)

    if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
        text = processor.extract_text_from_pdf_bytes(data)
        txt_name = f"{object_name}.txt"
        storage.upload_file(io.BytesIO(text.encode()), txt_name, content_type="text/plain")
        result["text_object"] = txt_name

    if content_type.startswith("image/") or filename.lower().endswith((".png", ".jpg", ".jpeg")):
        thumb = processor.generate_thumbnail_from_image_bytes(data)
        thumb_name = f"{object_name}.thumb.jpg"
        storage.upload_file(io.BytesIO(thumb), thumb_name, content_type="image/jpeg")
        result["thumbnail_object"] = thumb_name

    return result
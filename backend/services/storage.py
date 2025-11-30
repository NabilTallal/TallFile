from minio import Minio
from config import MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
from datetime import timedelta

client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

# Ensure bucket exists
if not client.bucket_exists(MINIO_BUCKET):
    client.make_bucket(MINIO_BUCKET)

def upload_file(file_obj, object_name: str, content_type: str = "application/octet-stream"):
    file_obj.seek(0, 2)  # go to the end
    length = file_obj.tell()
    file_obj.seek(0)     # go back to start

    client.put_object(
        bucket_name=MINIO_BUCKET,
        object_name=object_name,
        data=file_obj,
        length=length,
        part_size=10*1024*1024,
        content_type=content_type
    )
    return object_name


def get_presigned_url(object_name: str, expires=3600):
    expires_td = timedelta(seconds=expires)  # convert int -> timedelta
    return client.presigned_get_object(MINIO_BUCKET, object_name, expires=expires_td)
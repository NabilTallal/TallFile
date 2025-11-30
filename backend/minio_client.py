from minio import Minio
import os
from datetime import timedelta

client = Minio(
    os.environ["MINIO_ENDPOINT"],
    access_key=os.environ["MINIO_ACCESS_KEY"],
    secret_key=os.environ["MINIO_SECRET_KEY"],
    secure=False
)

def get_presigned_url(object_name: str, expires=3600):
    bucket = os.environ["MINIO_BUCKET"]
    expires_td = timedelta(seconds=expires)
    return client.presigned_get_object(bucket, object_name, expires=expires_td)
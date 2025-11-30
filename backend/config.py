import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "files")

BROKER_URL = os.getenv("BROKER_URL", REDIS_URL)
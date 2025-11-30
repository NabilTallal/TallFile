import io
import uuid
import pytest


def test_upload_endpoint(client):
    # Prepare a fake file
    filename = "test.txt"
    content = b"Hello, FastAPI!"

    response = client.post(
        "/files/upload",
        files={"file": (filename, io.BytesIO(content), "text/plain")}
    )

    assert response.status_code == 202
    data = response.json()
    assert "job_id" in data
    assert "object_name" in data


def test_status_endpoint_pending(client):
    # Generate a fake job ID
    fake_job_id = str(uuid.uuid4())
    response = client.get(f"/files/status/{fake_job_id}")
    assert response.status_code == 200
    assert response.json()["status"] in ["pending", "processing", "failed"]

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend folder to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.main import app  # fully qualified import

@pytest.fixture(scope="session")
def client():
    """TestClient for FastAPI."""
    with TestClient(app) as test_client:
        yield test_client
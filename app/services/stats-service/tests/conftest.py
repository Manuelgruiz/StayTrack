import sys, pathlib
import pytest
from fastapi.testclient import TestClient
import respx
from httpx import Response

# --- añadir ruta del servicio ---
SERVICE_ROOT = pathlib.Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.main import app
from app.config import TRACKER_SVC

client = TestClient(app)

@pytest.fixture
def api():
    return client

# Mock global para httpx
@pytest.fixture
def mock_http():
    with respx.mock(base_url=TRACKER_SVC) as mock:
        yield mock

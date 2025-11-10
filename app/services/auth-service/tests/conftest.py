# --- path del servicio primero ---
import os, sys, pathlib
SERVICE_ROOT = pathlib.Path(__file__).resolve().parents[1]  # .../app/services/auth-service
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

# --- variables de entorno para tests (antes de importar app) ---
os.environ.setdefault("JWT_SECRET", "testsecret")
os.environ.setdefault("JWT_ALG", "HS256")
os.environ.setdefault("JWT_TTL_SECONDS", "3600")
os.environ.setdefault("USER_SVC", "http://localhost:8001")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import respx

from app.main import app
from app.db import Base, get_db
from app import models           # <-- registra tablas en Base
from app.config import USER_SVC  # para el mock base_url

# DB en memoria COMPARTIDA
engine = create_engine(
    "sqlite+pysqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture
def api():
    return client

# Mock httpx para llamadas al user-service
@pytest.fixture
def mock_user_service():
    with respx.mock(base_url=USER_SVC) as mock:
        yield mock

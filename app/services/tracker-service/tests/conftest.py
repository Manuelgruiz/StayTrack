# --- debe ir primero: path del servicio ---
import sys, pathlib
SERVICE_ROOT = pathlib.Path(__file__).resolve().parents[1]  # .../app/services/tracker-service
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db import Base, get_db
from app import models  # <-- registrar tablas antes de create_all

# BD en memoria compartida
engine = create_engine(
    "sqlite+pysqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # <-- clave para compartir la misma memoria
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

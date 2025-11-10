# --- poner el path del servicio primero ---
import sys, pathlib
SERVICE_ROOT = pathlib.Path(__file__).resolve().parents[1]  # .../app/services/goals-service
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db import Base, get_db
from app import models  # <-- IMPORTA MODELOS ANTES DE create_all

# SQLite en memoria COMPARTIDA
engine = create_engine(
    "sqlite+pysqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # <-- clave para compartir una sola conexión
)
TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

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

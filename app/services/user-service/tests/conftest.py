# app/services/user-service/tests/conftest.py
import sys, pathlib, os

# 1) Asegurar que el servicio está en sys.path
SERVICE_ROOT = pathlib.Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

# 2) Forzar SQLite SOLO SI no hay otra variable ya definida (evita conflictos en CI)
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db import Base, get_db
from app import models   # <- Necesario para registrar todas las tablas

# 3) Engine SQLite en memoria, compartido entre hilos
engine = create_engine(
    os.environ["DATABASE_URL"],
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# 4) Crear y destruir tablas
@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# 5) Override get_db
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# 6) client
client = TestClient(app)

@pytest.fixture
def api():
    return client

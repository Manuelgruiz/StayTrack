
import sys, pathlib, os

SERVICE_ROOT = pathlib.Path(__file__).resolve().parents[1]  
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# 3) Ahora ya puedes importar la app y la DB del servicio
from app.main import app
from app.db import Base, get_db
from app import models  # importa modelos para registrar tablas en Base

# 4) Engine compartido en memoria (mismo proceso/hilos)
engine = create_engine(
    os.environ["DATABASE_URL"],
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
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

# 5) Override de la dependencia de DB
app.dependency_overrides[get_db] = override_get_db

# 6) Cliente de test
client = TestClient(app)

@pytest.fixture
def api():
    return client

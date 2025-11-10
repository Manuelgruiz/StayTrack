from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import schemas
from .db import get_db
from .service_auth import register as svc_register, login as svc_login

router = APIRouter(prefix="/v1/auth", tags=["auth"])

@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
async def register(body: schemas.Register, db: Session = Depends(get_db)):
    try:
        token = await svc_register(db, body)
        return {"access_token": token}
    except ValueError as e:
        if str(e) == "EMAIL_EXISTS":
            raise HTTPException(status_code=409, detail="Email already registered")
        raise
    except RuntimeError as e:
        if str(e) == "USER_SERVICE_ERROR":
            raise HTTPException(status_code=502, detail="User service error")
        raise

@router.post("/login", response_model=schemas.Token)
def login(body: schemas.Login, db: Session = Depends(get_db)):
    try:
        token = svc_login(db, body)
        return {"access_token": token}
    except PermissionError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

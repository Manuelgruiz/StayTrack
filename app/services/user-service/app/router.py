from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from . import schemas
from .db import get_db
from .logger import logger
from .service import (
    create_user as svc_create_user, 
    get_user as svc_get_user, 
    list_users as svc_list_users,
    update_user as svc_update_user
)

router = APIRouter(prefix="/v1/users", tags=["users"])

@router.post("", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
async def create_user(request: Request, body: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info("create_user_request", extra={"body": body.model_dump()})
        return svc_create_user(db, body)
    except ValidationError as e:
        logger.error("validation_error", extra={"error": str(e)})
        raise HTTPException(status_code=422, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Email already exists")

@router.put("/{user_id}", response_model=schemas.User)
def update_user(user_id: int, body: schemas.UserCreate, db: Session = Depends(get_db)):
    u = svc_update_user(db, user_id, body)
    if not u:
        raise HTTPException(404, "User not found")
    return u

@router.get("/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    u = svc_get_user(db, user_id)
    if not u:
        raise HTTPException(404, "User not found")
    return u

@router.get("", response_model=list[schemas.User])
def list_users(db: Session = Depends(get_db)):
    return svc_list_users(db)

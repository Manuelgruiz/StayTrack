from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from . import schemas
from .db import get_db
from .service_foods import add_food as svc_add_food, list_foods as svc_list_foods

router = APIRouter(prefix="/v1/users/{user_id}/foods", tags=["foods"])

@router.post("", response_model=schemas.FoodLog, status_code=status.HTTP_201_CREATED)
def add_food(user_id: int, body: schemas.FoodLogCreate, db: Session = Depends(get_db)):
    return svc_add_food(db, user_id, body)

@router.get("", response_model=list[schemas.FoodLog])
def list_foods(user_id: int, limit: int = Query(50, le=200), offset: int = 0, db: Session = Depends(get_db)):
    return svc_list_foods(db, user_id, limit, offset)

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import schemas
from .db import get_db
from .service_catalog import (
    create_food as svc_create_food,
    list_foods as svc_list_foods,
    get_food as svc_get_food,
    add_serving as svc_add_serving,
)

router = APIRouter(prefix="/v1/foods", tags=["catalog"])

@router.post("", response_model=schemas.Food, status_code=status.HTTP_201_CREATED)
def create_food(body: schemas.FoodCreate, db: Session = Depends(get_db)):
    try:
        return svc_create_food(db, body)
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Food name already exists")

@router.get("", response_model=list[schemas.Food])
def list_foods(
    q: str | None = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return svc_list_foods(db, q, limit, offset)

@router.get("/{food_id}", response_model=schemas.Food)
def get_food(food_id: int, db: Session = Depends(get_db)):
    f = svc_get_food(db, food_id)
    if not f:
        raise HTTPException(404, "Food not found")
    return f

@router.post("/{food_id}/servings", response_model=schemas.Serving, status_code=status.HTTP_201_CREATED)
def add_serving(food_id: int, body: schemas.ServingCreate, db: Session = Depends(get_db)):
    s = svc_add_serving(db, food_id, body)
    if s is None:
        raise HTTPException(404, "Food not found")
    return s

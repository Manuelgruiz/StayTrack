from sqlalchemy.orm import Session
from . import models, schemas
from .logger import logger

def add_food(db: Session, user_id: int, body: schemas.FoodLogCreate) -> models.FoodLog:
    obj = models.FoodLog(user_id=user_id, **body.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    logger.info("food_created", extra={"user_id": user_id, "food_id": obj.id, "date": str(obj.date)})
    return obj

def list_foods(db: Session, user_id: int, limit: int, offset: int) -> list[models.FoodLog]:
    q = (db.query(models.FoodLog)
           .filter(models.FoodLog.user_id == user_id)
           .order_by(models.FoodLog.date.desc()))
    items = q.limit(limit).offset(offset).all()
    logger.info("foods_listed", extra={"user_id": user_id, "count": len(items), "limit": limit, "offset": offset})
    return items

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import models, schemas
from .logger import logger

def create_food(db: Session, body: schemas.FoodCreate) -> models.Food:
    f = models.Food(**body.model_dump())
    db.add(f)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        logger.warning("food_name duplicate", extra={"food_name": body.name})
        raise
    db.refresh(f)
    logger.info("food_created", extra={"food_id": f.id, "food_name": f.name})
    return f

def list_foods(db: Session, q: str | None, limit: int, offset: int) -> list[models.Food]:
    query = db.query(models.Food)
    if q:
        q = q.strip()
        if q:
            query = query.filter(models.Food.name.ilike(f"%{q}%"))
    items = (query.order_by(models.Food.name.asc())
                  .limit(limit).offset(offset).all())
    logger.info("foods_listed", extra={"q": q or "", "count": len(items), "limit": limit, "offset": offset})
    return items

def get_food(db: Session, food_id: int) -> models.Food | None:
    f = db.get(models.Food, food_id)
    logger.info("food_fetched", extra={"food_id": food_id, "found": bool(f)})
    return f

def add_serving(db: Session, food_id: int, body: schemas.ServingCreate) -> models.Serving:
    if not db.get(models.Food, food_id):
        logger.info("food_not_found_add_serving", extra={"food_id": food_id})
        return None  # el router lo convertirá en 404
    s = models.Serving(food_id=food_id, **body.model_dump())
    db.add(s); db.commit(); db.refresh(s)
    logger.info("serving_created", extra={"food_id": food_id, "serving_id": s.id, "label": s.label})
    return s

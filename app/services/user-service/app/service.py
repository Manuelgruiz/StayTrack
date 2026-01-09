from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import models, schemas
from .logger import logger

def create_user(db: Session, body: schemas.UserCreate) -> models.User:
    user = models.User(**body.model_dump())
    db.add(user)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        logger.warning("Email duplicado al crear usuario", extra={"email": body.email})
        raise
    db.refresh(user)
    logger.info("Usuario creado", extra={"user_id": user.id, "email": user.email})
    return user

def get_user(db: Session, user_id: int) -> models.User | None:
    user = db.get(models.User, user_id)
    logger.info("Consulta de usuario", extra={"user_id": user_id, "found": bool(user)})
    return user

def list_users(db: Session) -> list[models.User]:
    users = db.query(models.User).all()
    logger.info("Listado de usuarios", extra={"count": len(users)})
    return users

def update_user(db: Session, user_id: int, body: schemas.UserCreate) -> models.User | None:
    user = db.get(models.User, user_id)
    if not user:
        return None
    
    user.name = body.name
    user.email = body.email
    user.age = body.age
    user.weight = body.weight
    user.height = body.height
    
    db.commit()
    db.refresh(user)
    logger.info("Usuario actualizado", extra={"user_id": user_id})
    return user

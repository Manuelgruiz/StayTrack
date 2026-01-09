from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import httpx, time, jwt
from passlib.context import CryptContext
from . import models, schemas
from .config import USER_SVC, JWT_SECRET, JWT_ALG, JWT_TTL_SECONDS
from .logger import logger

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _make_token(user_id: int) -> str:
    now = int(time.time())
    payload = {"sub": str(user_id), "iat": now, "exp": now + JWT_TTL_SECONDS}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

async def register(db: Session, body: schemas.Register) -> str:
    # 1) valida duplicado local primero (rápido)
    if db.query(models.Account).filter(models.Account.email == body.email).first():
        logger.info("register_email_exists", extra={"email": body.email})
        raise ValueError("EMAIL_EXISTS")

    # 2) crea usuario en User Service
    async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as c:
        payload = {
            "name": body.name, "email": body.email,
            "age": body.age, "weight": body.weight, "height": body.height
        }
        logger.info("calling_user_service", extra={"payload": payload})
        r = await c.post(f"{USER_SVC}/v1/users", json=payload)
        if r.status_code not in (200, 201):
            logger.warning("user_service_error", extra={"status": r.status_code, "text": r.text, "payload": payload})
            raise RuntimeError("USER_SERVICE_ERROR")
        user = r.json()

    # 3) guarda cuenta local
    acc = models.Account(
        user_id=user["id"],
        email=body.email,
        password_hash=pwd_ctx.hash(body.password)
    )
    db.add(acc)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        logger.warning("register_integrity_error", extra={"email": body.email})
        # si se coló una carrera, indicamos duplicado
        raise ValueError("EMAIL_EXISTS")
    db.refresh(acc)

    # 4) token
    token = _make_token(user["id"])
    logger.info("register_ok", extra={"user_id": user["id"], "email": body.email})
    return token

def login(db: Session, body: schemas.Login) -> str:
    acc = db.query(models.Account).filter(models.Account.email == body.email).first()
    if not acc or not pwd_ctx.verify(body.password, acc.password_hash):
        logger.info("login_fail", extra={"email": body.email})
        raise PermissionError("INVALID_CREDENTIALS")
    token = _make_token(acc.user_id)
    logger.info("login_ok", extra={"user_id": acc.user_id, "email": body.email})
    return token

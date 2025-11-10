import time, jwt
from .config import JWT_SECRET, JWT_ALG, JWT_TTL_SECONDS

def make_token(user_id: int) -> str:
    now = int(time.time())
    payload = {"sub": str(user_id), "iat": now, "exp": now + JWT_TTL_SECONDS}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

import os
from dotenv import load_dotenv
load_dotenv()

USER_SVC = os.getenv("USER_SVC", "http://localhost:8001")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
JWT_TTL_SECONDS = int(os.getenv("JWT_TTL_SECONDS", "86400"))

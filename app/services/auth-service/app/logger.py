import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | auth-service | %(message)s"
)
logger = logging.getLogger("auth-service")

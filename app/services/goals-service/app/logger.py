import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | goals-service | %(message)s"
)
logger = logging.getLogger("goals-service")

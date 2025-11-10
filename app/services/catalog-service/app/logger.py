import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | catalog-service | %(message)s"
)
logger = logging.getLogger("catalog-service")

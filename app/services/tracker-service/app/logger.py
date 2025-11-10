import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | tracker-service | %(message)s"
)
logger = logging.getLogger("tracker-service")

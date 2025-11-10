import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | stats-service | %(message)s"
)
logger = logging.getLogger("stats-service")

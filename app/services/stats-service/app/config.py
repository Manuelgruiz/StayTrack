import os
from dotenv import load_dotenv
load_dotenv()
TRACKER_SVC = os.getenv("TRACKER_SVC", "http://localhost:8002")
GOALS_SVC   = os.getenv("GOALS_SVC", "http://localhost:8004")  # por si comparas con metas

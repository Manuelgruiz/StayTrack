from datetime import date, timedelta
from collections import defaultdict
from typing import List
import httpx
from .config import TRACKER_SVC
from .schemas import DailyStat
from .logger import logger

async def fetch_user_logs(user_id: int) -> tuple[list[dict], list[dict]]:
    async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as c:
        rf = await c.get(f"{TRACKER_SVC}/v1/users/{user_id}/foods",
                         params={"limit": 10000, "offset": 0})
        re = await c.get(f"{TRACKER_SVC}/v1/users/{user_id}/exercises",
                         params={"limit": 10000, "offset": 0})

    # Manejo explícito de errores HTTP
    try:
        rf.raise_for_status()
        re.raise_for_status()
    except httpx.HTTPStatusError as e:
        logger.warning("error llamando tracker-service", extra={
            "status": e.response.status_code, "url": str(e.request.url)
        })
        raise

    return rf.json(), re.json()

def aggregate_daily(foods: list[dict], exs: list[dict]) -> dict[str, dict]:
    agg = defaultdict(lambda: {
        "kcal_in": 0.0, "protein": 0.0, "fat": 0.0, "carbs": 0.0,
        "kcal_out": 0.0, "exercise_min": 0.0
    })
    for f in foods:
        d = f["date"]
        agg[d]["kcal_in"] += f["calories"]
        agg[d]["protein"] += f["protein"]
        agg[d]["fat"]     += f["fat"]
        agg[d]["carbs"]   += f["carbs"]
    for e in exs:
        d = e["date"]
        agg[d]["kcal_out"]     += e["calories_burned"]
        agg[d]["exercise_min"] += e["duration_min"]
    return agg

def fill_range(agg: dict[str, dict], start: date, end: date) -> List[DailyStat]:
    out: list[DailyStat] = []
    cur = start
    while cur <= end:
        k = cur.isoformat()
        a = agg.get(k, {"kcal_in":0,"protein":0,"fat":0,"carbs":0,"kcal_out":0,"exercise_min":0})
        out.append(DailyStat(date=cur, **a))
        cur += timedelta(days=1)
    return out

async def compute_daily(user_id: int, start: date, end: date) -> list[DailyStat]:
    foods, exs = await fetch_user_logs(user_id)
    agg = aggregate_daily(foods, exs)
    result = fill_range(agg, start, end)
    # Log útil (volumen controlado)
    if result:
        logger.info("stats_daily_ok", extra={
            "user_id": user_id, "from": str(start), "to": str(end), "days": len(result)
        })
    return result

async def compute_summary(user_id: int, day: date) -> DailyStat:
    return (await compute_daily(user_id, day, day))[0]

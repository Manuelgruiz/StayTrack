from fastapi import APIRouter, Query, HTTPException
from datetime import date
import httpx
from .schemas import DailyStat
from .services_stats import compute_daily, compute_summary

router = APIRouter(prefix="/v1/users/{user_id}/stats", tags=["stats"])

@router.get("/daily", response_model=list[DailyStat])
async def daily(
    user_id: int,
    from_: date = Query(..., alias="from"),
    to: date = Query(...)
):
    if from_ > to:
        raise HTTPException(400, "'from' must be <= 'to'")
    try:
        return await compute_daily(user_id, from_, to)
    except httpx.HTTPStatusError as e:
        # Translate errores del tracker
        status = e.response.status_code
        msg = f"tracker-service error ({status})"
        raise HTTPException(502, msg)

@router.get("/summary", response_model=DailyStat)
async def summary(
    user_id: int,
    day: date
):
    return await compute_summary(user_id, day)

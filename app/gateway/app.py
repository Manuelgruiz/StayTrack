from fastapi import FastAPI, HTTPException, Query, Header, Depends
import httpx, os, jwt
from fastapi.middleware.cors import CORSMiddleware

USER_SVC = os.getenv("USER_SVC", "http://localhost:8001")
TRACKER_SVC = os.getenv("TRACKER_SVC", "http://localhost:8002")
GOALS_SVC = os.getenv("GOALS_SVC", "http://localhost:8004")
STATS_SVC = os.getenv("STATS_SVC", "http://localhost:8005")
CATALOG_SVC = os.getenv("CATALOG_SVC", "http://localhost:8006")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = os.getenv("JWT_ALG", "HS256")

app = FastAPI(title="StayTrack Gateway")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,          
    allow_methods=["*"],             
    allow_headers=["*"],             
)


def auth_user(user_id: int, authorization: str | None = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        raise HTTPException(401, "Invalid token")
    if str(user_id) != payload.get("sub"):
        raise HTTPException(403, "Forbidden for this user")
    return True

@app.get("/health")
def health(): return {"status":"ok","gateway":True}

# ---------- Auth passthrough ----------
@app.post("/v1/auth/register")
async def gw_register(body: dict):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{os.getenv('AUTH_SVC','http://localhost:8003')}/v1/auth/register", json=body)
        r.raise_for_status(); return r.json()

@app.post("/v1/auth/login")
async def gw_login(body: dict):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{os.getenv('AUTH_SVC','http://localhost:8003')}/v1/auth/login", json=body)
        r.raise_for_status(); return r.json()

# ---------- Users (crear sin auth; leer con auth si quieres) ----------
@app.post("/v1/users")
async def gw_create_user(body: dict):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{USER_SVC}/v1/users", json=body, timeout=10.0)
        r.raise_for_status(); return r.json()

@app.get("/v1/users/{user_id}")
async def gw_get_user(user_id: int, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{USER_SVC}/v1/users/{user_id}", timeout=10.0)
        r.raise_for_status(); return r.json()

# ---------- Tracker ----------
@app.post("/v1/users/{user_id}/foods")
async def gw_add_food(user_id: int, body: dict, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        rf = await c.post(f"{TRACKER_SVC}/v1/users/{user_id}/foods", json=body, timeout=10.0)
        rf.raise_for_status(); return rf.json()

@app.get("/v1/users/{user_id}/foods")
async def gw_list_foods(user_id: int, limit: int = Query(50, le=200), offset: int = 0, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{TRACKER_SVC}/v1/users/{user_id}/foods", params={"limit":limit,"offset":offset}, timeout=10.0)
        r.raise_for_status(); return r.json()

# ---------- Goals ----------
@app.put("/v1/users/{user_id}/goals")
async def gw_upsert_goals(user_id: int, body: dict, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.put(f"{GOALS_SVC}/v1/users/{user_id}/goals", json=body)
        r.raise_for_status(); return r.json()

@app.get("/v1/users/{user_id}/goals")
async def gw_get_goals(user_id: int, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{GOALS_SVC}/v1/users/{user_id}/goals")
        r.raise_for_status(); return r.json()

# ---------- Stats ----------
@app.get("/v1/users/{user_id}/stats/daily")
async def gw_stats_daily(user_id: int, _from: str, to: str, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{STATS_SVC}/v1/users/{user_id}/stats/daily", params={"_from":_from, "to":to})
        r.raise_for_status(); return r.json()

@app.get("/v1/users/{user_id}/stats/summary")
async def gw_stats_summary(user_id: int, day: str, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{STATS_SVC}/v1/users/{user_id}/stats/summary", params={"day":day})
        r.raise_for_status(); return r.json()

# ---------- Catalog passthrough ----------
@app.post("/v1/foods")
async def gw_catalog_create(body: dict, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{CATALOG_SVC}/v1/foods", json=body)
        r.raise_for_status(); return r.json()

@app.get("/v1/foods")
async def gw_catalog_list(q: str | None = None, limit: int = 50, offset: int = 0, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{CATALOG_SVC}/v1/foods", params={"q":q,"limit":limit,"offset":offset})
        r.raise_for_status(); return r.json()

@app.get("/v1/foods/{food_id}")
async def gw_catalog_get(food_id: int, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{CATALOG_SVC}/v1/foods/{food_id}")
        r.raise_for_status(); return r.json()
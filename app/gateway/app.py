from fastapi import FastAPI, HTTPException, Query, Header, Depends
import httpx, os, jwt
from fastapi.middleware.cors import CORSMiddleware
from schemas import Register, Login, Token, UserCreate, User, FoodLogCreate, FoodLog, ExerciseLogCreate, ExerciseLog, GoalUpsert, Goal, FoodCreate, Food

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

def verify_token(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        raise HTTPException(401, "Invalid token")
    return True

@app.get("/health")
def health(): return {"status":"ok","gateway":True}

# ... (rest of file)

# ---------- Catalog passthrough ----------
@app.post("/v1/foods", response_model=Food)
async def gw_catalog_create(body: FoodCreate, auth=Depends(verify_token)):
    """Add a new food to the catalog"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{CATALOG_SVC}/v1/foods", json=body.model_dump())
        r.raise_for_status(); return r.json()

@app.get("/v1/foods", response_model=list[Food])
async def gw_catalog_list(q: str | None = Query(None), limit: int = Query(50), offset: int = Query(0), auth=Depends(verify_token)):
    print(f"DEBUG: gw_catalog_list q={q} limit={limit}")
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{CATALOG_SVC}/v1/foods", params={"q":q,"limit":limit,"offset":offset})
        r.raise_for_status(); return r.json()

@app.get("/v1/foods/{food_id}")
async def gw_catalog_get(food_id: int, auth=Depends(verify_token)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{CATALOG_SVC}/v1/foods/{food_id}")
        r.raise_for_status(); return r.json()

# ---------- Auth passthrough ----------
@app.post("/v1/auth/register", response_model=Token)
async def gw_register(body: Register):
    """Register a new user and get authentication token"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{os.getenv('AUTH_SVC','http://localhost:8003')}/v1/auth/register", json=body.model_dump())
        r.raise_for_status(); return r.json()

@app.post("/v1/auth/login", response_model=Token)
async def gw_login(body: Login):
    """Login with email and password to get authentication token"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{os.getenv('AUTH_SVC','http://localhost:8003')}/v1/auth/login", json=body.model_dump())
        r.raise_for_status(); return r.json()

# ---------- Users (crear sin auth; leer con auth si quieres) ----------
@app.post("/v1/users", response_model=User)
async def gw_create_user(body: UserCreate):
    """Create a new user"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{USER_SVC}/v1/users", json=body.model_dump(), timeout=10.0)
        r.raise_for_status(); return r.json()

@app.get("/v1/users/{user_id}", response_model=User)
async def gw_get_user(user_id: int, auth=Depends(auth_user)):
    """Get user details by ID (requires authentication)"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{USER_SVC}/v1/users/{user_id}", timeout=10.0)
        r.raise_for_status(); return r.json()

@app.put("/v1/users/{user_id}", response_model=User)
async def gw_update_user(user_id: int, body: UserCreate, auth=Depends(auth_user)):
    """Update user details (requires authentication)"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.put(f"{USER_SVC}/v1/users/{user_id}", json=body.model_dump(), timeout=10.0)
        r.raise_for_status(); return r.json()

# ---------- Tracker ----------
@app.post("/v1/users/{user_id}/foods", response_model=FoodLog)
async def gw_add_food(user_id: int, body: FoodLogCreate, auth=Depends(auth_user)):
    """Log a food entry for the user"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        rf = await c.post(f"{TRACKER_SVC}/v1/users/{user_id}/foods", json=body.model_dump(mode='json'), timeout=10.0)
        rf.raise_for_status(); return rf.json()

@app.get("/v1/users/{user_id}/foods")
async def gw_list_foods(user_id: int, limit: int = Query(50, le=200), offset: int = 0, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{TRACKER_SVC}/v1/users/{user_id}/foods", params={"limit":limit,"offset":offset}, timeout=10.0)
        r.raise_for_status(); return r.json()

@app.post("/v1/users/{user_id}/exercises", response_model=ExerciseLog)
async def gw_add_exercise(user_id: int, body: ExerciseLogCreate, auth=Depends(auth_user)):
    """Log an exercise entry for the user"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.post(f"{TRACKER_SVC}/v1/users/{user_id}/exercises", json=body.model_dump(mode='json'), timeout=10.0)
        r.raise_for_status(); return r.json()

@app.get("/v1/users/{user_id}/exercises", response_model=list[ExerciseLog])
async def gw_list_exercises(user_id: int, limit: int = Query(50, le=200), offset: int = 0, auth=Depends(auth_user)):
    """Get list of user exercises"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{TRACKER_SVC}/v1/users/{user_id}/exercises", params={"limit":limit,"offset":offset}, timeout=10.0)
        r.raise_for_status(); return r.json()

# ---------- Goals ----------
@app.put("/v1/users/{user_id}/goals", response_model=Goal)
async def gw_upsert_goals(user_id: int, body: GoalUpsert, auth=Depends(auth_user)):
    """Create or update user's nutrition and exercise goals"""
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.put(f"{GOALS_SVC}/v1/users/{user_id}/goals", json=body.model_dump())
        r.raise_for_status(); return r.json()

@app.get("/v1/users/{user_id}/goals")
async def gw_get_goals(user_id: int, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{GOALS_SVC}/v1/users/{user_id}/goals")
        r.raise_for_status(); return r.json()

# ---------- Stats ----------
@app.get("/v1/users/{user_id}/stats/daily")
async def gw_stats_daily(user_id: int, _from: str = Query(..., alias="from"), to: str = Query(...), auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{STATS_SVC}/v1/users/{user_id}/stats/daily", params={"from":_from, "to":to})
        r.raise_for_status(); return r.json()

@app.get("/v1/users/{user_id}/stats/summary")
async def gw_stats_summary(user_id: int, day: str, auth=Depends(auth_user)):
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(f"{STATS_SVC}/v1/users/{user_id}/stats/summary", params={"day":day})
        r.raise_for_status(); return r.json()

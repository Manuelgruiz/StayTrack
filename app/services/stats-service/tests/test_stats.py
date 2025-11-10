import respx
from httpx import Response

def test_daily_stats(api):
    with respx.mock:
        respx.get("http://localhost:8002/v1/users/1/foods").mock(
            return_value=Response(200, json=[{
                "date":"2025-01-01","food_name":"Broccoli",
                "calories":50,"protein":4,"fat":0.5,"carbs":10
            }])
        )
        respx.get("http://localhost:8002/v1/users/1/exercises").mock(
            return_value=Response(200, json=[{
                "date":"2025-01-01","exercise_name":"Run",
                "duration_min":30,"calories_burned":250
            }])
        )
        r = api.get("/v1/users/1/stats/daily?from=2025-01-01&to=2025-01-01")
        assert r.status_code == 200
        day = r.json()[0]
        assert day["kcal_in"] == 50
        assert day["kcal_out"] == 250

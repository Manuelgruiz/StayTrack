def test_upsert_and_get_goals(api):
    body = {
        "kcal_per_day":2000, "protein_g":120, "fat_g":60, "carbs_g":220,
        "exercise_min_per_week":150, "target_weight":58
    }
    r = api.put("/v1/users/1/goals", json=body)
    assert r.status_code == 200
    r2 = api.get("/v1/users/1/goals")
    assert r2.status_code == 200
    assert r2.json()["kcal_per_day"] == 2000

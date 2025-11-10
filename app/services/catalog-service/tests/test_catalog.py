def test_add_serving_not_found(api):
    r = api.post("/v1/foods/999/servings", json={"label":"cup","grams":85})
    assert r.status_code == 404

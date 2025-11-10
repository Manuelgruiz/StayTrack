def test_add_and_list_foods(api):
    r = api.post("/v1/users/1/foods", json={
        "date":"2025-01-01","food_name":"Broccoli",
        "calories":55,"protein":3.7,"fat":0.6,"carbs":11.2
    })
    assert r.status_code == 201
    r = api.get("/v1/users/1/foods")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1 and data[0]["food_name"] == "Broccoli"

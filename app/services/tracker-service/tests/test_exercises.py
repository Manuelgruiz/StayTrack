def test_add_and_list_exercises(api):
    r = api.post("/v1/users/1/exercises", json={
        "date":"2025-01-02","exercise_name":"Running",
        "duration_min":30,"calories_burned":250
    })
    assert r.status_code == 201
    r = api.get("/v1/users/1/exercises")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1 and data[0]["exercise_name"] == "Running"

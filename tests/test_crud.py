from datetime import date

def test_create_user(client):
    response = client.post(
        "/users/",
        json={"name": "Alice", "email": "alice@example.com", "age": 30, "weight": 60, "height": 170},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Alice"
    assert data["email"] == "alice@example.com"
    assert "id" in data

def test_list_users(client):
    response = client.get("/users/")
    assert response.status_code == 200
    users = response.json()
    assert isinstance(users, list)
    assert len(users) > 0

def test_add_food(client):
    # first, create a user
    user_resp = client.post(
        "/users/",
        json={"name": "Bob", "email": "bob@example.com", "age": 25, "weight": 70, "height": 175},
    )
    user_id = user_resp.json()["id"]

    food_payload = {
        "date": str(date.today()),
        "food_name": "Broccoli",
        "calories": 50,
        "protein": 4.0,
        "fat": 0.3,
        "carbs": 10.0,
    }
    response = client.post(f"/users/{user_id}/foods/", json=food_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["food_name"] == "Broccoli"
    assert data["calories"] == 50

def test_add_exercise(client):
    # first, create a user
    user_resp = client.post(
        "/users/",
        json={"name": "Charlie", "email": "charlie@example.com", "age": 28, "weight": 75, "height": 180},
    )
    user_id = user_resp.json()["id"]

    exercise_payload = {
        "date": str(date.today()),
        "exercise_name": "Running",
        "duration_min": 30,
        "calories_burned": 300,
    }
    response = client.post(f"/users/{user_id}/exercises/", json=exercise_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["exercise_name"] == "Running"

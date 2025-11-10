from httpx import Response

def test_register_ok_and_token(api, mock_user_service):
    # Mock del User Service: crear usuario
    mock_user_service.post("/v1/users").respond(
        201,
        json={"id": 1, "name": "Ana", "email": "ana@x.com", "age": 30, "weight": 60, "height": 165},
    )

    r = api.post("/v1/auth/register", json={
        "name": "Ana", "email": "ana@x.com", "password": "1234",
        "age": 30, "weight": 60, "height": 165
    })
    assert r.status_code == 201, r.text
    token = r.json().get("access_token")
    assert isinstance(token, str) and len(token) > 10

def test_register_duplicate_email(api, mock_user_service):
    # Primer registro
    mock_user_service.post("/v1/users").respond(
        201,
        json={"id": 2, "name": "Bob", "email": "bob@x.com", "age": 28, "weight": 75, "height": 180},
    )
    r1 = api.post("/v1/auth/register", json={
        "name": "Bob", "email": "bob@x.com", "password": "abcd",
        "age": 28, "weight": 75, "height": 180
    })
    assert r1.status_code == 201

    # Segundo registro mismo email (mock otra vez OK, pero auth debe rechazar por duplicado local)
    mock_user_service.post("/v1/users").respond(
        201,
        json={"id": 3, "name": "Bob", "email": "bob@x.com", "age": 28, "weight": 75, "height": 180},
    )
    r2 = api.post("/v1/auth/register", json={
        "name": "Bob", "email": "bob@x.com", "password": "abcd",
        "age": 28, "weight": 75, "height": 180
    })
    assert r2.status_code == 409

def test_login_ok_and_invalid(api, mock_user_service):
    # Registrar primero
    mock_user_service.post("/v1/users").respond(
        201,
        json={"id": 10, "name": "Carol", "email": "carol@x.com", "age": 26, "weight": 55, "height": 165},
    )
    r = api.post("/v1/auth/register", json={
        "name": "Carol", "email": "carol@x.com", "password": "s3cret",
        "age": 26, "weight": 55, "height": 165
    })
    assert r.status_code == 201

    # Login correcto
    r_ok = api.post("/v1/auth/login", json={"email": "carol@x.com", "password": "s3cret"})
    assert r_ok.status_code == 200
    assert "access_token" in r_ok.json()

    # Login con pass mala
    r_bad = api.post("/v1/auth/login", json={"email": "carol@x.com", "password": "wrong"})
    assert r_bad.status_code == 401

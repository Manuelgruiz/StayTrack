def test_create_and_get_user(api):
    body = {"name":"Ana","email":"ana@x.com","age":30,"weight":60,"height":165}
    r = api.post("/v1/users", json=body)
    assert r.status_code == 201, r.text
    user = r.json()
    uid = user["id"]

    r = api.get(f"/v1/users/{uid}")
    assert r.status_code == 200
    assert r.json()["email"] == "ana@x.com"

def test_list_users(api):
    r = api.get("/v1/users")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

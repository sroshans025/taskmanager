import pytest
from fastapi.testclient import TestClient

@pytest.fixture(scope="module")
def user_token(client: TestClient):
    # Register user
    client.post(
        "/api/auth/register",
        json={"username": "taskuser", "email": "task@example.com", "password": "taskpassword"}
    )
    # Login user
    response = client.post(
        "/api/auth/login",
        data={"username": "taskuser", "password": "taskpassword"}
    )
    return response.json()["access_token"]

@pytest.fixture(scope="module")
def auth_headers(user_token):
    return {"Authorization": f"Bearer {user_token}"}

def test_create_task(client: TestClient, auth_headers):
    response = client.post(
        "/api/tasks/",
        headers=auth_headers,
        json={"title": "My first task", "description": "Doing something"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My first task"
    assert data["completed"] == False

def test_read_tasks(client: TestClient, auth_headers):
    response = client.get("/api/tasks/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["title"] == "My first task"

def test_update_task(client: TestClient, auth_headers):
    # Get tasks
    tasks = client.get("/api/tasks/", headers=auth_headers).json()
    task_id = tasks[0]["id"]
    
    # Update task
    response = client.put(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
        json={"completed": True}
    )
    assert response.status_code == 200
    assert response.json()["completed"] == True

def test_delete_task(client: TestClient, auth_headers):
    tasks = client.get("/api/tasks/", headers=auth_headers).json()
    task_id = tasks[0]["id"]
    
    response = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 204
    
    # Verify deletion
    verify_response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
    assert verify_response.status_code == 404

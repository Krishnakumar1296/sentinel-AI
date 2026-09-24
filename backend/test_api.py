"""Automated test suite for Sentinel AI FastAPI Backend."""

import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["service"] == "Sentinel AI"
    print("[PASS] GET /")


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print("[PASS] GET /health")


def test_auth_login():
    res = client.post("/api/auth/login", json={"email": "krishna", "password": "password123"})
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    assert "token" in data
    assert data["user"]["role"] == "admin"
    print("[PASS] POST /api/auth/login")
    return data["token"]


def test_auth_me(token):
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == "krishna@company.com"
    print("[PASS] GET /api/auth/me")


def test_documents(token):
    headers = {"Authorization": f"Bearer {token}"}
    # List documents
    res = client.get("/api/documents", headers=headers)
    assert res.status_code == 200
    docs = res.json()
    assert len(docs) > 0
    doc_id = docs[0]["id"]
    print(f"[PASS] GET /api/documents ({len(docs)} documents)")

    # Get single document
    res = client.get(f"/api/documents/{doc_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["id"] == doc_id
    print(f"[PASS] GET /api/documents/{doc_id}")

    # Patch document
    res = client.patch(
        f"/api/documents/{doc_id}",
        headers=headers,
        json={
            "name": "Updated Handbook",
            "department": "HR",
            "description": "Testing update",
            "content": "Updated content text",
        },
    )
    assert res.status_code == 200
    assert res.json()["name"] == "Updated Handbook"
    print(f"[PASS] PATCH /api/documents/{doc_id}")

    # Delete document
    res = client.delete(f"/api/documents/{doc_id}", headers=headers)
    assert res.status_code == 204
    print(f"[PASS] DELETE /api/documents/{doc_id}")


def test_search_and_history(token):
    headers = {"Authorization": f"Bearer {token}"}
    # Search
    res = client.post("/api/search", headers=headers, json={"query": "What is the remote work policy?"})
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "confidence" in data
    print(f"[PASS] POST /api/search (confidence: {data['confidence']}%)")

    # History
    res = client.get("/api/search/history", headers=headers)
    assert res.status_code == 200
    items = res.json()
    assert len(items) > 0
    print(f"[PASS] GET /api/search/history ({len(items)} items)")

    # Delete history
    res = client.delete("/api/search/history", headers=headers)
    assert res.status_code == 204
    print("[PASS] DELETE /api/search/history")


def test_chats(token):
    headers = {"Authorization": f"Bearer {token}"}
    # List chats
    res = client.get("/api/chats", headers=headers)
    assert res.status_code == 200
    print(f"[PASS] GET /api/chats")

    # Create chat
    res = client.post("/api/chats", headers=headers)
    assert res.status_code == 201
    chat = res.json()
    chat_id = chat["id"]
    print(f"[PASS] POST /api/chats (id: {chat_id})")

    # Append message
    res = client.post(
        f"/api/chats/{chat_id}/messages",
        headers=headers,
        json={
            "query": "What are the hours?",
            "result": {
                "id": "sr-test",
                "query": "What are the hours?",
                "answer": "Working hours are 10am to 3pm.",
                "confidence": 95,
                "sources": [],
                "timestamp": "Now",
                "status": "verified",
                "responseTime": 1.2,
            },
        },
    )
    assert res.status_code == 200
    assert len(res.json()["messages"]) == 2
    print(f"[PASS] POST /api/chats/{chat_id}/messages")

    # Delete chat
    res = client.delete(f"/api/chats/{chat_id}", headers=headers)
    assert res.status_code == 204
    print(f"[PASS] DELETE /api/chats/{chat_id}")


def test_notifications_and_audit(token):
    headers = {"Authorization": f"Bearer {token}"}
    # Get notifications
    res = client.get("/api/notifications", headers=headers)
    assert res.status_code == 200
    notifs = res.json()
    assert len(notifs) > 0
    notif_id = notifs[0]["id"]
    print(f"[PASS] GET /api/notifications ({len(notifs)} items)")

    # Mark single read
    res = client.patch(f"/api/notifications/{notif_id}/read", headers=headers)
    assert res.status_code == 200
    assert res.json()["success"] is True
    print(f"[PASS] PATCH /api/notifications/{notif_id}/read")

    # Mark all read
    res = client.post("/api/notifications/read-all", headers=headers)
    assert res.status_code == 200
    assert res.json()["success"] is True
    print("[PASS] POST /api/notifications/read-all")

    # Get audit logs
    res = client.get("/api/audit-logs", headers=headers)
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0
    print(f"[PASS] GET /api/audit-logs ({len(logs)} audit entries recorded)")


def test_users(token):
    headers = {"Authorization": f"Bearer {token}"}
    # List users
    res = client.get("/api/users", headers=headers)
    assert res.status_code == 200
    users = res.json()
    assert len(users) > 0
    print(f"[PASS] GET /api/users ({len(users)} users)")

    # Create user
    res = client.post(
        "/api/users",
        headers=headers,
        json={
            "name": "Alex Smith",
            "email": "alex.smith@company.com",
            "username": "alex",
            "password": "password123",
            "department": "Engineering",
            "role": "employee",
        },
    )
    assert res.status_code == 201
    user_id = res.json()["id"]
    print(f"[PASS] POST /api/users (created: {user_id})")

    # Update role
    res = client.patch(f"/api/users/{user_id}/role", headers=headers, json={"role": "manager"})
    assert res.status_code == 200
    assert res.json()["role"] == "manager"
    print(f"[PASS] PATCH /api/users/{user_id}/role")

    # Delete user
    res = client.delete(f"/api/users/{user_id}", headers=headers)
    assert res.status_code == 204
    print(f"[PASS] DELETE /api/users/{user_id}")


def test_analytics_and_knowledge(token):
    headers = {"Authorization": f"Bearer {token}"}
    # Analytics
    res = client.get("/api/analytics", headers=headers)
    assert res.status_code == 200
    assert "totalQueries" in res.json()
    print("[PASS] GET /api/analytics")

    # Knowledge gaps
    res = client.get("/api/knowledge/gaps", headers=headers)
    assert res.status_code == 200
    print(f"[PASS] GET /api/knowledge/gaps ({len(res.json())} gaps)")

    # Knowledge requests
    res = client.get("/api/knowledge/requests", headers=headers)
    assert res.status_code == 200
    print(f"[PASS] GET /api/knowledge/requests ({len(res.json())} requests)")


def main():
    print("=== Running Sentinel AI Backend API Test Suite ===")
    test_root()
    test_health()
    token = test_auth_login()
    test_auth_me(token)
    test_documents(token)
    test_search_and_history(token)
    test_chats(token)
    test_notifications_and_audit(token)
    test_users(token)
    test_analytics_and_knowledge(token)
    print("\n=== ALL TESTS PASSED SUCCESSFULLY! ===")


if __name__ == "__main__":
    main()

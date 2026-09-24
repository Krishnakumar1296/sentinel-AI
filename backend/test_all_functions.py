"""Comprehensive End-to-End Verification of Sentinel AI Functions."""

import sys
import httpx
import json

BASE_URL = "http://127.0.0.1:8000"
ADMIN_EMAIL = "admin@sentinel.ai"
ADMIN_PASS = "AdminPassword123!"

results = []

def record(test_name: str, passed: bool, details: str = ""):
    status = "PASS" if passed else "FAIL"
    results.append((test_name, status, details))
    print(f"[{status}] {test_name}: {details}")

def run_tests():
    with httpx.Client(base_url=BASE_URL, timeout=30.0) as client:
        # 1. Health check
        try:
            r = client.get("/health")
            record("1. System Health Check (/health)", r.status_code == 200, f"HTTP {r.status_code}")
        except Exception as e:
            record("1. System Health Check (/health)", False, str(e))
            return

        # 2. Negative Auth Test
        try:
            r = client.post("/api/auth/login", json={"email": "wrong@test.com", "password": "wrong"})
            record("2. Auth Protection (Reject Invalid Login)", r.status_code == 401, f"HTTP {r.status_code}")
        except Exception as e:
            record("2. Auth Protection (Reject Invalid Login)", False, str(e))

        # 3. Real Admin Login
        token = None
        user_info = None
        try:
            r = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
            if r.status_code == 200:
                data = r.json()
                token = data.get("token")
                user_info = data.get("user")
                record(
                    "3. Admin Login (/api/auth/login)",
                    True,
                    f"Logged in as {user_info.get('email')} (Role: {user_info.get('role')})"
                )
            else:
                record("3. Admin Login (/api/auth/login)", False, f"HTTP {r.status_code} - {r.text}")
                return
        except Exception as e:
            record("3. Admin Login (/api/auth/login)", False, str(e))
            return

        headers = {"Authorization": f"Bearer {token}"}

        # 4. Profile Check (/api/auth/me)
        try:
            r = client.get("/api/auth/me", headers=headers)
            passed = r.status_code == 200 and r.json().get("email") == ADMIN_EMAIL
            record("4. Profile Verification (/api/auth/me)", passed, f"HTTP {r.status_code} - Role: {r.json().get('role')}")
        except Exception as e:
            record("4. Profile Verification (/api/auth/me)", False, str(e))

        # 5. Document Management (/api/documents)
        first_doc_id = None
        try:
            r = client.get("/api/documents", headers=headers)
            docs = r.json() if r.status_code == 200 else []
            passed = r.status_code == 200 and isinstance(docs, list)
            if docs:
                first_doc_id = docs[0].get("id")
            record("5. Document List Retrieval (/api/documents)", passed, f"HTTP {r.status_code} - Total Docs: {len(docs)}")
        except Exception as e:
            record("5. Document List Retrieval (/api/documents)", False, str(e))

        # 6. Single Document Access (/api/documents/{id})
        if first_doc_id:
            try:
                r = client.get(f"/api/documents/{first_doc_id}", headers=headers)
                passed = r.status_code == 200
                record(f"6. Single Document Inspection (/api/documents/{first_doc_id})", passed, f"HTTP {r.status_code} - Title: {r.json().get('name')}")
            except Exception as e:
                record("6. Single Document Inspection", False, str(e))

        # 7. AI Search & Vector RAG Pipeline (/api/search)
        try:
            r = client.post(
                "/api/search",
                headers=headers,
                json={"query": "What are the security guidelines and annual leave policies?"}
            )
            passed = r.status_code == 200
            if passed:
                res_data = r.json()
                answer_snippet = (res_data.get("answer") or "")[:80] + "..."
                confidence = res_data.get("confidence")
                citations = len(res_data.get("citations", []))
                record("7. AI Vector Search & RAG Generation (/api/search)", True, f"HTTP 200 - Citations: {citations}, Confidence: {confidence}%, Answer: {answer_snippet}")
            else:
                record("7. AI Vector Search & RAG Generation (/api/search)", False, f"HTTP {r.status_code} - {r.text}")
        except Exception as e:
            record("7. AI Vector Search & RAG Generation (/api/search)", False, str(e))

        # 8. Search History (/api/search/history)
        try:
            r = client.get("/api/search/history", headers=headers)
            passed = r.status_code == 200 and isinstance(r.json(), list)
            record("8. Search History Retrieval (/api/search/history)", passed, f"HTTP {r.status_code} - Entries: {len(r.json() if passed else [])}")
        except Exception as e:
            record("8. Search History Retrieval (/api/search/history)", False, str(e))

        # 9. Chat Session Lifecycle (/api/chats)
        try:
            r = client.post("/api/chats", headers=headers)
            passed = r.status_code == 201
            session_id = r.json().get("id") if passed else None
            record("9. Chat Session Creation (/api/chats)", passed, f"HTTP {r.status_code} - Session: {session_id}")

            if session_id:
                r_list = client.get("/api/chats", headers=headers)
                record("10. Chat Session Listing (/api/chats)", r_list.status_code == 200, f"HTTP {r_list.status_code} - Chats: {len(r_list.json())}")
        except Exception as e:
            record("9. Chat Session Management", False, str(e))

        # 11. User Management (/api/users) - Admin Only
        try:
            r = client.get("/api/users", headers=headers)
            passed = r.status_code == 200 and isinstance(r.json(), list)
            users_count = len(r.json()) if passed else 0
            record("11. User Management Directory (/api/users)", passed, f"HTTP {r.status_code} - Total Users: {users_count}")
        except Exception as e:
            record("11. User Management Directory (/api/users)", False, str(e))

        # 12. RAG Analytics & Intelligence (/api/analytics)
        try:
            r = client.get("/api/analytics", headers=headers)
            passed = r.status_code == 200
            data = r.json() if passed else {}
            record("12. RAG Analytics Engine (/api/analytics)", passed, f"HTTP {r.status_code} - Faithfulness: {data.get('faithfulnessScore')}%, Total Queries: {data.get('totalQueries')}")
        except Exception as e:
            record("12. RAG Analytics Engine (/api/analytics)", False, str(e))

        # 13. Knowledge Gaps Analysis (/api/knowledge/gaps)
        try:
            r = client.get("/api/knowledge/gaps", headers=headers)
            passed = r.status_code == 200 and isinstance(r.json(), list)
            record("13. Knowledge Gaps Analysis (/api/knowledge/gaps)", passed, f"HTTP {r.status_code} - Gaps: {len(r.json() if passed else [])}")
        except Exception as e:
            record("13. Knowledge Gaps Analysis (/api/knowledge/gaps)", False, str(e))

        # 14. Knowledge Requests (/api/knowledge/requests)
        try:
            r = client.get("/api/knowledge/requests", headers=headers)
            passed = r.status_code == 200 and isinstance(r.json(), list)
            record("14. Knowledge Requests Queue (/api/knowledge/requests)", passed, f"HTTP {r.status_code} - Requests: {len(r.json() if passed else [])}")
        except Exception as e:
            record("14. Knowledge Requests Queue (/api/knowledge/requests)", False, str(e))

        # 15. Compliance Audit Logs (/api/audit-logs) - Admin Only
        try:
            r = client.get("/api/audit-logs", headers=headers)
            passed = r.status_code == 200 and isinstance(r.json(), list)
            record("15. Security Audit Logging (/api/audit-logs)", passed, f"HTTP {r.status_code} - Audit Entries: {len(r.json() if passed else [])}")
        except Exception as e:
            record("15. Security Audit Logging (/api/audit-logs)", False, str(e))

        # 16. Notifications (/api/notifications)
        try:
            r = client.get("/api/notifications", headers=headers)
            passed = r.status_code == 200 and isinstance(r.json(), list)
            record("16. Notification Feed (/api/notifications)", passed, f"HTTP {r.status_code} - Notifications: {len(r.json() if passed else [])}")
            
            # Read all
            r_post = client.post("/api/notifications/read-all", headers=headers)
            record("17. Mark Notifications Read (/api/notifications/read-all)", r_post.status_code == 200, f"HTTP {r_post.status_code}")
        except Exception as e:
            record("16. Notification System", False, str(e))

    print("\n" + "="*70)
    passed_count = sum(1 for _, s, _ in results if s == "PASS")
    total_count = len(results)
    print(f"VERIFICATION SUMMARY: {passed_count}/{total_count} CHECKS PASSED")
    print("="*70)

if __name__ == "__main__":
    run_tests()

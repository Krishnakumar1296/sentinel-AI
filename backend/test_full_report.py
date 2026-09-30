"""Sentinel AI — Comprehensive Function Test Suite"""
import asyncio, sys, time

GREEN  = "\033[92m"; RED = "\033[91m"; YELLOW = "\033[93m"
CYAN   = "\033[96m"; BOLD = "\033[1m"; RESET = "\033[0m"
results = []

def ok(name, detail=""):
    results.append(("PASS", name, detail))
    print(f"  {GREEN}PASS{RESET}  {name}" + (f"  -- {detail}" if detail else ""))

def fail(name, err):
    results.append(("FAIL", name, str(err)))
    print(f"  {RED}FAIL{RESET}  {name}  -- {err}")

def section(title):
    print(f"\n{BOLD}{CYAN}=== {title} ==={RESET}")

# ── 1. IMPORTS ──────────────────────────────────────────────────────────────
section("1 · Module Imports")
_mods = {}
def try_import(label, fn):
    try: _mods[label] = fn(); ok(f"import {label}")
    except Exception as e: fail(f"import {label}", e)

try_import("app.config",           lambda: __import__("app.config", fromlist=["settings"]))
try_import("app.dependencies",     lambda: __import__("app.dependencies", fromlist=["is_supabase_ready"]))
try_import("app.rag.embedder",     lambda: __import__("app.rag.embedder", fromlist=["embed_query"]))
try_import("app.rag.generator",    lambda: __import__("app.rag.generator", fromlist=["is_conversational"]))
try_import("app.rag.pipeline",     lambda: __import__("app.rag.pipeline", fromlist=["search"]))
try_import("app.rag.chunker",      lambda: __import__("app.rag.chunker", fromlist=["chunk_text"]))
try_import("app.models.search",    lambda: __import__("app.models.search", fromlist=["SearchResult"]))
try_import("app.models.user",      lambda: __import__("app.models.user", fromlist=["User"]))
try_import("app.services.search_service",       lambda: __import__("app.services.search_service", fromlist=["execute_search"]))
try_import("app.services.chat_service",         lambda: __import__("app.services.chat_service", fromlist=["send_message"]))
try_import("app.services.document_service",     lambda: __import__("app.services.document_service", fromlist=["get_documents"]))
try_import("app.services.user_service",         lambda: __import__("app.services.user_service", fromlist=["get_all_users"]))
try_import("app.services.analytics_service",    lambda: __import__("app.services.analytics_service", fromlist=["get_analytics"]))
try_import("app.services.notification_service", lambda: __import__("app.services.notification_service", fromlist=["get_notifications"]))
try_import("app.main",             lambda: __import__("app.main", fromlist=["app"]))

# ── 2. CONFIG ────────────────────────────────────────────────────────────────
section("2 · Config / Settings")
try:
    from app.config import settings
    ok("settings.OLLAMA_BASE_URL", settings.OLLAMA_BASE_URL)
    ok("settings.OLLAMA_MODEL",    settings.OLLAMA_MODEL)
    ok("settings.cors_origin_list", f"{len(settings.cors_origin_list)} origins")
    ok("settings.is_ollama_configured", str(settings.is_ollama_configured))
    ok("settings.is_supabase_configured", str(settings.is_supabase_configured))
    ok("settings.is_firebase_configured", str(settings.is_firebase_configured))
except Exception as e: fail("settings", e)

# ── 3. DEPENDENCIES ──────────────────────────────────────────────────────────
section("3 · Dependencies")
try:
    from app.dependencies import is_supabase_ready, is_firebase_ready
    ok("is_supabase_ready()", str(is_supabase_ready()))
    ok("is_firebase_ready()",  str(is_firebase_ready()))
except Exception as e: fail("dependencies", e)

# ── 4. EMBEDDER ──────────────────────────────────────────────────────────────
section("4 · RAG - Embedder")
try:
    from app.rag.embedder import embed_texts, embed_query, EMBEDDING_DIMENSION
    assert embed_texts([]) == []
    ok("embed_texts([]) returns []")
    t0 = time.time()
    vec = embed_query("what is the leave policy?")
    elapsed = round(time.time()-t0, 2)
    assert isinstance(vec, list) and len(vec) == EMBEDDING_DIMENSION
    is_zero = all(v==0.0 for v in vec)
    ok("embed_query()", f"{len(vec)} dims, {'zero-vec (Ollama down)' if is_zero else 'real embed'}, {elapsed}s")
    vecs = embed_texts(["hello", "policy"])
    assert len(vecs) == 2
    ok("embed_texts(['a','b'])", f"2x{len(vecs[0])} dim vectors")
except Exception as e: fail("embedder", e)

# ── 5. CHUNKER ───────────────────────────────────────────────────────────────
section("5 · RAG - Chunker")
try:
    from app.rag.chunker import chunk_text
    chunks = chunk_text("word " * 600)
    assert len(chunks) > 0
    ok("chunk_text(long_text)", f"{len(chunks)} chunks")
    ok("chunk_text('short')", f"{len(chunk_text('short'))} chunk")
    ok("chunk_text('')", f"{len(chunk_text(''))} chunks (empty)")
except Exception as e: fail("chunker", e)

# ── 6. is_conversational ─────────────────────────────────────────────────────
section("6 · RAG - is_conversational()")
try:
    from app.rag.generator import is_conversational
    conv_cases = [("hi",True),("hello",True),("thanks",True),("bye",True),
                  ("how are you",True),("who are you",True),("ok",True)]
    doc_cases  = [("what is the leave policy?",False),("explain data retention",False),
                  ("how many vacation days?",False)]
    fc = [q for q,e in conv_cases if is_conversational(q)!=e]
    fd = [q for q,e in doc_cases  if is_conversational(q)!=e]
    if not fc: ok(f"conversational phrases ({len(conv_cases)-len(fc)}/{len(conv_cases)} correct)")
    else: fail("conversational phrases", f"wrong: {fc}")
    if not fd: ok(f"document queries ({len(doc_cases)-len(fd)}/{len(doc_cases)} correct)")
    else: fail("document queries", f"wrong: {fd}")
except Exception as e: fail("is_conversational", e)

# ── 7. generate_chat_response ────────────────────────────────────────────────
section("7 · RAG - generate_chat_response()")
async def t7():
    from app.rag.generator import generate_chat_response
    try:
        r = await generate_chat_response("hi", history=[])
        assert r.get("answer"), "empty answer"
        ok("generate_chat_response('hi')", r["answer"][:60])
    except Exception as e: fail("generate_chat_response('hi')", e)
    try:
        hist = [{"role":"user","content":"hi"},{"role":"assistant","content":"Hello!"}]
        r = await generate_chat_response("how are you?", history=hist)
        assert r.get("answer")
        ok("generate_chat_response with history", f"{len(r['answer'])} chars")
    except Exception as e: fail("generate_chat_response with history", e)
asyncio.run(t7())

# ── 8. generate_answer ───────────────────────────────────────────────────────
section("8 · RAG - generate_answer()")
async def t8():
    from app.rag.generator import generate_answer
    try:
        r = await generate_answer("test", [])
        assert r["status"]=="no_answer" and r["answer"]==""
        ok("generate_answer(q, []) -> no_answer")
    except Exception as e: fail("generate_answer(q,[])", e)
    try:
        chunks = [{"content":"Employees get 24 days of paid leave.",
                   "document_name":"Employee Handbook","page_number":5,
                   "document_id":"d1","similarity":0.9}]
        t0=time.time()
        r = await generate_answer("How many leave days?", chunks)
        elapsed = round(time.time()-t0, 2)
        assert "answer" in r and "status" in r
        ok("generate_answer(q, chunks)", f"status={r['status']} conf={r['confidence']} ({elapsed}s)")
    except Exception as e: fail("generate_answer(q,chunks)", e)
asyncio.run(t8())

# ── 9. PIPELINE end-to-end ───────────────────────────────────────────────────
section("9 · RAG - Pipeline search() end-to-end")
async def t9():
    from app.rag.pipeline import search
    from app.models.search import SearchResult
    cases = [
        ("hi",                            "employee", "conversational"),
        ("thanks",                        "employee", "thanks"),
        ("what is the leave policy?",     "employee", "doc query employee"),
        ("explain data security policy",  "admin",    "doc query admin"),
        ("xyzzy nonsense gibberish 9999", "employee", "no-doc fallback"),
    ]
    for query, role, label in cases:
        try:
            t0=time.time()
            r = await search(query=query, user_access_level=role)
            elapsed = round(time.time()-t0, 2)
            assert isinstance(r, SearchResult)
            assert r.answer, f"empty answer for {query!r}"
            ok(f"search({label})", f"status={r.status} conf={r.confidence}% src={len(r.sources)} {elapsed}s")
        except Exception as e: fail(f"search({label})", e)
asyncio.run(t9())

# ── 10. MODELS ───────────────────────────────────────────────────────────────
section("10 · Models - Pydantic Validation")
try:
    from app.models.search import SearchResult, SearchSource
    sr = SearchResult(id="t1",query="q",answer="a",confidence=80,sources=[],citations=[],
                      timestamp="2026-01-01T00:00:00Z",status="verified",responseTime=1.0)
    assert sr.id=="t1"; ok("SearchResult model")
    ss = SearchSource(id="s1",documentId="d1",documentName="Doc",page=1,totalPages=5,relevance=90,excerpt="ex")
    assert ss.documentId=="d1"; ok("SearchSource model")
except Exception as e: fail("models.search", e)
try:
    from app.models.user import User
    u = User(id="u1",email="a@b.com",name="Alice",role="employee",department="Eng",status="active")
    assert u.role=="employee"; ok("User model")
except Exception as e: fail("models.user", e)

# ── 11. search_service ────────────────────────────────────────────────────────
section("11 · Services - search_service")
async def t11():
    from app.models.user import User
    from app.services.search_service import execute_search, get_search_history, get_search_conversation
    user = User(id="u1",email="a@b.com",name="Alice",role="employee",department="Eng",status="active")
    try:
        r = await execute_search("hi", user, history=[])
        assert r.answer; ok("execute_search('hi')", f"status={r.status}")
    except Exception as e: fail("execute_search", e)
    try:
        hist = await get_search_history(user)
        assert isinstance(hist, list); ok("get_search_history", f"{len(hist)} items")
    except Exception as e: fail("get_search_history", e)
    try:
        conv = await get_search_conversation("h1")
        ok("get_search_conversation('h1')", "found" if conv else "not in dev seed")
    except Exception as e: fail("get_search_conversation", e)
asyncio.run(t11())

# ── 12. document_service ──────────────────────────────────────────────────────
section("12 · Services - document_service")
async def t12():
    from app.models.user import User
    from app.services.document_service import get_documents, get_document
    user = User(id="u1",email="a@b.com",name="Alice",role="employee",department="Eng",status="active")
    try:
        docs = await get_documents(user)
        assert isinstance(docs, list); ok("get_documents(user)", f"{len(docs)} docs")
    except Exception as e: fail("get_documents", e)
    try:
        doc = await get_document("d1", user)
        ok("get_document('d1')", "found" if doc else "not found")
    except Exception as e: fail("get_document", e)
asyncio.run(t12())

# ── 13. chat_service ──────────────────────────────────────────────────────────
section("13 · Services - chat_service")
async def t13():
    from app.models.user import User
    from app.services.chat_service import get_chat_sessions, send_message
    user = User(id="u1",email="a@b.com",name="Alice",role="employee",department="Eng",status="active")
    try:
        sessions = await get_chat_sessions(user)
        assert isinstance(sessions, list); ok("get_chat_sessions", f"{len(sessions)} sessions")
    except Exception as e: fail("get_chat_sessions", e)
    try:
        r = await send_message(user_id="u1", session_id="s1", content="hello", user=user)
        ok("send_message('hello')", "reply received")
    except Exception as e: fail("send_message", e)
asyncio.run(t13())

# ── 14. analytics_service ─────────────────────────────────────────────────────
section("14 · Services - analytics_service")
async def t14():
    from app.services.analytics_service import get_analytics
    try:
        data = await get_analytics()
        assert isinstance(data, dict); ok("get_analytics()", f"keys: {list(data.keys())}")
    except Exception as e: fail("get_analytics", e)
asyncio.run(t14())

# ── 15. notification_service ──────────────────────────────────────────────────
section("15 · Services - notification_service")
async def t15():
    from app.models.user import User
    from app.services.notification_service import get_notifications, log_audit
    user = User(id="u1",email="a@b.com",name="Alice",role="employee",department="Eng",status="active")
    try:
        n = await get_notifications(user)
        assert isinstance(n, list); ok("get_notifications", f"{len(n)} notifications")
    except Exception as e: fail("get_notifications", e)
    try:
        await log_audit(user=user, action="Test", resource="r", status="success", details="unit test")
        ok("log_audit()", "no exception")
    except Exception as e: fail("log_audit", e)
asyncio.run(t15())

# ── 16. FASTAPI routes ────────────────────────────────────────────────────────
section("16 · FastAPI App - Route Registration")
try:
    from app.main import app
    routes = [r.path for r in app.routes]
    ok("FastAPI app imported", f"{len(routes)} routes registered")
    expected_prefixes = ["/", "/health", "/api/auth", "/api/users", "/api/documents",
                         "/api/search", "/api/chats", "/api/knowledge", "/api/analytics", "/api/notifications"]
    for ep in expected_prefixes:
        if any(r == ep or r.startswith(ep+"/") or r.startswith(ep+"{") for r in routes):
            ok(f"route prefix {ep}")
        else:
            fail(f"route prefix {ep}", "not found in registered routes")
except Exception as e: fail("FastAPI app", e)

# ── SUMMARY ───────────────────────────────────────────────────────────────────
passed  = [r for r in results if r[0]=="PASS"]
failed  = [r for r in results if r[0]=="FAIL"]
skipped = [r for r in results if r[0]=="SKIP"]
print(f"\n{'='*60}")
print(f"  SENTINEL AI - FUNCTION TEST REPORT")
print(f"{'='*60}")
print(f"\n  PASSED : {len(passed)}")
print(f"  FAILED : {len(failed)}")
print(f"  SKIPPED: {len(skipped)}")
print(f"  TOTAL  : {len(results)}")
if failed:
    print(f"\n  FAILURES:")
    for _,name,err in failed:
        print(f"    FAIL  {name}")
        print(f"          {err}")
status = "ALL TESTS PASSED" if not failed else f"{len(failed)} TEST(S) FAILED"
print(f"\n  >>> {status} <<<\n")
sys.exit(0 if not failed else 1)

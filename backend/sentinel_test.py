import sys

G = "\033[92m"
R = "\033[91m"
C = "\033[96m"
B = "\033[1m"
X = "\033[0m"
results = []


def ok(n, d=""):
    results.append(("PASS", n, d))
    suffix = ("  -- " + d) if d else ""
    print("  " + G + "PASS" + X + "  " + n + suffix, flush=True)


def fail(n, e):
    msg = str(e)[:120]
    results.append(("FAIL", n, msg))
    print("  " + R + "FAIL" + X + "  " + n + "  -- " + msg, flush=True)


def sec(t):
    print("\n" + B + C + "=== " + t + " ===" + X, flush=True)


# ─── 1. MODULE IMPORTS ────────────────────────────────────────────────────────
sec("1. Module Imports")
mods = {}


def imp(label, fn):
    try:
        mods[label] = fn()
        ok("import " + label)
    except Exception as e:
        fail("import " + label, e)


imp("app.config",                        lambda: __import__("app.config", fromlist=["s"]))
imp("app.dependencies",                  lambda: __import__("app.dependencies", fromlist=["s"]))
imp("app.rag.embedder",                  lambda: __import__("app.rag.embedder", fromlist=["s"]))
imp("app.rag.generator",                 lambda: __import__("app.rag.generator", fromlist=["s"]))
imp("app.rag.pipeline",                  lambda: __import__("app.rag.pipeline", fromlist=["s"]))
imp("app.rag.chunker",                   lambda: __import__("app.rag.chunker", fromlist=["s"]))
imp("app.models.search",                 lambda: __import__("app.models.search", fromlist=["s"]))
imp("app.models.user",                   lambda: __import__("app.models.user", fromlist=["s"]))
imp("app.models.chat",                   lambda: __import__("app.models.chat", fromlist=["s"]))
imp("app.models.document",               lambda: __import__("app.models.document", fromlist=["s"]))
imp("app.models.analytics",              lambda: __import__("app.models.analytics", fromlist=["s"]))
imp("app.models.notification",           lambda: __import__("app.models.notification", fromlist=["s"]))
imp("app.services.search_service",       lambda: __import__("app.services.search_service", fromlist=["s"]))
imp("app.services.chat_service",         lambda: __import__("app.services.chat_service", fromlist=["s"]))
imp("app.services.document_service",     lambda: __import__("app.services.document_service", fromlist=["s"]))
imp("app.services.user_service",         lambda: __import__("app.services.user_service", fromlist=["s"]))
imp("app.services.analytics_service",    lambda: __import__("app.services.analytics_service", fromlist=["s"]))
imp("app.services.notification_service", lambda: __import__("app.services.notification_service", fromlist=["s"]))
imp("app.main",                          lambda: __import__("app.main", fromlist=["s"]))

# ─── 2. CONFIG ────────────────────────────────────────────────────────────────
sec("2. Config / Settings")
try:
    from app.config import settings
    ok("OLLAMA_BASE_URL",        settings.OLLAMA_BASE_URL)
    ok("OLLAMA_MODEL",           settings.OLLAMA_MODEL)
    ok("OLLAMA_EMBED_MODEL",     settings.OLLAMA_EMBED_MODEL)
    ok("cors_origin_list",       str(len(settings.cors_origin_list)) + " origins")
    ok("is_ollama_configured",   str(settings.is_ollama_configured))
    ok("is_supabase_configured", str(settings.is_supabase_configured))
    ok("is_firebase_configured", str(settings.is_firebase_configured))
    ok("DEV_MODE",               str(settings.DEV_MODE))
except Exception as e:
    fail("config.settings", e)

# ─── 3. DEPENDENCIES ─────────────────────────────────────────────────────────
sec("3. Dependencies")
try:
    from app.dependencies import is_supabase_ready, is_firebase_ready
    ok("is_supabase_ready", str(is_supabase_ready()))
    ok("is_firebase_ready", str(is_firebase_ready()))
except Exception as e:
    fail("dependencies", e)

# ─── 4. EMBEDDER (static — no Ollama call) ───────────────────────────────────
sec("4. Embedder  (static checks)")
try:
    from app.rag.embedder import embed_texts, embed_query, EMBEDDING_DIMENSION
    assert embed_texts([]) == [], "empty list should return []"
    ok("embed_texts empty list returns []")
    ok("EMBEDDING_DIMENSION", str(EMBEDDING_DIMENSION))
    ok("embed_query is callable", str(callable(embed_query)))
    ok("embed_texts is callable", str(callable(embed_texts)))
except Exception as e:
    fail("embedder", e)

# ─── 5. CHUNKER ──────────────────────────────────────────────────────────────
sec("5. Chunker")
try:
    from app.rag.chunker import chunk_pages
    # chunk_pages takes List[tuple[int, str]] — (page_number, text)
    long_text = "word " * 600
    c = chunk_pages([(1, long_text)])
    assert len(c) > 0, "expected at least 1 chunk"
    ok("chunk_pages long input", str(len(c)) + " chunks produced")
    short = chunk_pages([(1, "hello world")])
    ok("chunk_pages short input", str(len(short)) + " chunk(s)")
    empty = chunk_pages([])
    ok("chunk_pages empty pages", str(len(empty)) + " chunks")
    # Verify chunk dict structure
    assert "content" in c[0] and "page_number" in c[0] and "chunk_index" in c[0]
    ok("chunk_pages dict keys", "content, page_number, chunk_index present")
except Exception as e:
    fail("chunker", e)

# ─── 6. IS_CONVERSATIONAL ────────────────────────────────────────────────────
sec("6. is_conversational()")
try:
    from app.rag.generator import is_conversational
    CONV = ["hi", "hello", "hey", "thanks", "thank you", "bye", "goodbye",
            "how are you", "who are you", "ok", "cool", "great", "lol"]
    DOC  = ["what is the leave policy?", "explain data retention",
            "how many vacation days?", "expense reimbursement steps"]

    fc = [q for q in CONV if not is_conversational(q)]
    fd = [q for q in DOC  if is_conversational(q)]

    if not fc:
        ok("conversational phrases " + str(len(CONV)) + "/" + str(len(CONV)) + " correct")
    else:
        fail("conversational phrases " + str(len(CONV) - len(fc)) + "/" + str(len(CONV)),
             "wrongly classified as document: " + str(fc))

    if not fd:
        ok("document queries " + str(len(DOC)) + "/" + str(len(DOC)) + " correct")
    else:
        fail("document queries " + str(len(DOC) - len(fd)) + "/" + str(len(DOC)),
             "wrongly classified as chat: " + str(fd))
except Exception as e:
    fail("is_conversational", e)

# ─── 7. GENERATOR INTERNALS ──────────────────────────────────────────────────
sec("7. Generator internals")
try:
    from app.rag.generator import (
        CHAT_SYSTEM_PROMPT, RAG_SYSTEM_PROMPT,
        _build_context, _extractive_fallback,
        _CONVERSATIONAL_PATTERNS, _ALL_CONVERSATIONAL,
        GENERATION_MODEL,
    )
    ok("CHAT_SYSTEM_PROMPT defined", str(len(CHAT_SYSTEM_PROMPT)) + " chars")
    ok("RAG_SYSTEM_PROMPT defined",  str(len(RAG_SYSTEM_PROMPT)) + " chars")
    ok("_CONVERSATIONAL_PATTERNS",
       str(len(_CONVERSATIONAL_PATTERNS)) + " categories, " + str(len(_ALL_CONVERSATIONAL)) + " phrases")
    ok("GENERATION_MODEL", GENERATION_MODEL)

    sample_chunks = [
        {"content": "Employees get 24 days of paid leave.",
         "document_name": "Handbook", "page_number": 5,
         "document_id": "d1", "similarity": 0.9}
    ]
    ctx = _build_context(sample_chunks)
    assert "Source 1" in ctx and "Handbook" in ctx
    ok("_build_context", str(len(ctx)) + " chars, doc name present")

    fb = _extractive_fallback(sample_chunks)
    assert fb["answer"] and fb["confidence"] > 0
    ok("_extractive_fallback",
       "conf=" + str(fb["confidence"]) + " status=" + str(fb["status"]))
except Exception as e:
    fail("generator internals", e)

# ─── 8. PYDANTIC MODELS ──────────────────────────────────────────────────────
sec("8. Pydantic Models")
try:
    from app.models.search import SearchResult, SearchSource
    sr = SearchResult(
        id="t1", query="q", answer="a", confidence=80,
        sources=[], citations=[], timestamp="2026-01-01T00:00:00Z",
        status="verified", responseTime=1.0,
    )
    assert sr.id == "t1" and sr.confidence == 80
    ok("SearchResult", "id=" + sr.id + " conf=" + str(sr.confidence))

    ss = SearchSource(
        id="s1", documentId="d1", documentName="Doc",
        page=1, totalPages=5, relevance=90, excerpt="ex",
    )
    ok("SearchSource", "docId=" + ss.documentId)
except Exception as e:
    fail("models.search", e)

try:
    from app.models.user import User
    u = User(id="u1", email="a@b.com", name="Alice",
             role="employee", department="Eng", status="active")
    assert u.role == "employee"
    ok("User model", "role=" + u.role)
except Exception as e:
    fail("models.user", e)

# ─── 9. PIPELINE INTERNALS (no Ollama) ───────────────────────────────────────
sec("9. Pipeline internals  (no Ollama)")
try:
    from app.rag.pipeline import _get_accessible_levels, _build_sources, _no_answer_result

    a = _get_accessible_levels("admin")
    assert "admin" in a and "manager" in a and "employee" in a
    ok("_get_accessible_levels admin",    str(a))

    m = _get_accessible_levels("manager")
    assert "manager" in m and "admin" not in m
    ok("_get_accessible_levels manager", str(m))

    e = _get_accessible_levels("employee")
    assert e == ["employee"]
    ok("_get_accessible_levels employee", str(e))

    chunks = [{
        "content": "test content", "document_name": "Doc A",
        "page_number": 1, "document_id": "d1",
        "total_pages": 10, "similarity": 0.85,
    }]
    src = _build_sources(chunks, [])
    assert len(src) == 1 and src[0].documentName == "Doc A"
    ok("_build_sources", str(len(src)) + " source, doc=" + src[0].documentName)

    r = _no_answer_result("r1", "test query", 1.5)
    assert r.status == "no_answer" and r.answer == ""
    ok("_no_answer_result", "status=" + r.status)
except Exception as e:
    fail("pipeline internals", e)

# ─── 10. SERVICES — DEV SEED DATA ────────────────────────────────────────────
sec("10. Services — Dev Seed Data")

try:
    from app.services.search_service import _DEV_SEARCH_HISTORY
    assert len(_DEV_SEARCH_HISTORY) > 0
    ok("_DEV_SEARCH_HISTORY", str(len(_DEV_SEARCH_HISTORY)) + " seeded records")
except Exception as e:
    fail("search_service._DEV_SEARCH_HISTORY", e)

try:
    from app.services.document_service import _DEV_DOCUMENTS
    assert len(_DEV_DOCUMENTS) > 0
    ok("_DEV_DOCUMENTS", str(len(_DEV_DOCUMENTS)) + " seeded docs")
except Exception as e:
    fail("document_service._DEV_DOCUMENTS", e)

try:
    from app.services.notification_service import _DEV_NOTIFICATIONS
    assert len(_DEV_NOTIFICATIONS) > 0
    ok("_DEV_NOTIFICATIONS", str(len(_DEV_NOTIFICATIONS)) + " seeded notifications")
except Exception as e:
    fail("notification_service._DEV_NOTIFICATIONS", e)

try:
    from app.services.chat_service import _DEV_CHATS, _DEV_MESSAGES
    ok("_DEV_CHATS",    str(len(_DEV_CHATS))    + " seeded chats")
    ok("_DEV_MESSAGES", str(len(_DEV_MESSAGES)) + " seeded messages")
except Exception as e:
    fail("chat_service._DEV_CHATS/_DEV_MESSAGES", e)

# ─── 11. FASTAPI ROUTES ──────────────────────────────────────────────────────
sec("11. FastAPI — Route Registration")
try:
    from app.main import app
    routes = [r.path for r in app.routes]
    ok("FastAPI app created", str(len(routes)) + " total routes")

    checks = [
        ("root",          "/"),
        ("health",        "/health"),
        ("auth",          "auth"),
        ("users",         "users"),
        ("documents",     "document"),
        ("search",        "search"),
        ("chats",         "chat"),
        ("knowledge",     "knowledge"),
        ("analytics",     "analytic"),
        ("notifications", "notification"),
    ]
    for name, kw in checks:
        found = [r for r in routes if kw in r]
        if found:
            ok("route/" + name, str(len(found)) + " endpoint(s) e.g. " + found[0])
        else:
            fail("route/" + name, "no route containing '" + kw + "' found")
except Exception as e:
    fail("FastAPI app", e)

# ─── SUMMARY ─────────────────────────────────────────────────────────────────
passed  = [r for r in results if r[0] == "PASS"]
failed  = [r for r in results if r[0] == "FAIL"]

sep = "=" * 62
print("\n" + sep)
print("  SENTINEL AI  --  FUNCTION TEST REPORT")
print(sep)
print("  PASSED  : " + str(len(passed)))
print("  FAILED  : " + str(len(failed)))
print("  TOTAL   : " + str(len(results)))

if failed:
    print("\n  FAILURES:")
    for _, n, e in failed:
        print("    FAIL  " + n)
        print("          " + str(e))

verdict = "ALL TESTS PASSED" if not failed else str(len(failed)) + " TEST(S) FAILED"
print("\n  STATUS: " + verdict + "\n")
sys.exit(0 if not failed else 1)

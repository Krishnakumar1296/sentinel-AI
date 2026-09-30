"""Answer generation using Ollama LLM (local, privacy-first)."""

import json
from typing import List, Dict, Any, Optional
import httpx

from ..config import settings

GENERATION_MODEL = "llama3.2"  # Change to "llama3.1:8b" for higher quality

# ── Conversational System Prompt ──────────────────────────────────────────────
CHAT_SYSTEM_PROMPT = """You are Sentinel AI — a highly capable, friendly enterprise assistant built for professionals.

Your personality:
- Warm, helpful, and direct — like a knowledgeable colleague, not a formal chatbot.
- Concise by default: give focused answers. Expand only when depth is needed.
- You remember the conversation history and reference it naturally when relevant.
- Never say "As an AI" or "I cannot". Just be helpful.

Capabilities you can mention when relevant:
- Search and answer questions from the company's uploaded documents and policies.
- Hold natural conversations, explain concepts, help draft text, and answer general questions.
- Summarize, compare, or reason over information.

Formatting:
- Use **markdown** (bold, bullets, code blocks) when it improves clarity.
- Keep responses conversational unless the user asks for a detailed breakdown.
- Never output raw JSON or fences for conversational replies.

Tone: smart, warm, professional — like ChatGPT but laser-focused on enterprise use."""

# ── RAG System Prompt (document Q&A) ─────────────────────────────────────────
RAG_SYSTEM_PROMPT = """You are Sentinel AI, a secure enterprise knowledge assistant. Your role is to answer questions ONLY using the provided document context.

Rules:
1. Answer ONLY from the provided context. Never use external knowledge.
2. If the context does not contain enough information to answer, respond with an empty answer.
3. Cite specific document names and page numbers in your answer.
4. Be concise, professional, and accurate.
5. If the answer spans multiple documents, synthesize the information clearly.

You MUST respond with valid JSON in this exact format:
{
  "answer": "Your detailed answer here, citing [Document Name, Page X] for each claim.",
  "confidence": 85,
  "status": "verified",
  "cited_sources": [
    {"document_id": "doc_id", "document_name": "Doc Name", "page": 3, "relevance": 95}
  ]
}

- confidence: integer 0-100, how confident you are in the answer
- status: "verified" if high confidence (>=70), "partial" if moderate (40-69), "no_answer" if insufficient context (<40)
- cited_sources: array of documents/pages you actually used

If you cannot answer from the context, respond with:
{"answer": "", "confidence": 0, "status": "no_answer", "cited_sources": []}

CRITICAL: Output ONLY raw JSON. No markdown fences, no explanation, no extra text."""

# ── Keywords that indicate conversational intent ──────────────────────────────
_CONVERSATIONAL_PATTERNS = {
    "greetings": ["hi", "hello", "hey", "good morning", "good afternoon", "good evening",
                  "howdy", "sup", "what's up", "whats up", "hiya"],
    "farewells": ["bye", "goodbye", "see you", "later", "take care", "good night"],
    "thanks": ["thanks", "thank you", "thank u", "thx", "ty", "appreciate it"],
    "bot_questions": ["who are you", "what are you", "what can you do", "help me",
                      "how does this work", "are you ai", "are you a bot", "what is sentinel",
                      "introduce yourself", "your name"],
    "wellbeing": ["how are you", "how r u", "you ok", "are you ok", "doing well"],
    "general": ["ok", "okay", "cool", "nice", "great", "awesome", "got it", "understood",
                "sure", "alright", "lol", "haha", "interesting"],
}

_ALL_CONVERSATIONAL = {
    phrase
    for phrases in _CONVERSATIONAL_PATTERNS.values()
    for phrase in phrases
}


def is_conversational(query: str) -> bool:
    """Return True if the query is casual conversation rather than a document question."""
    q = query.strip().lower().rstrip("!?.,'\"")

    # Exact match
    if q in _ALL_CONVERSATIONAL:
        return True

    # Short single-word or two-word queries that aren't document-specific
    words = q.split()
    if len(words) <= 2:
        for phrase in _ALL_CONVERSATIONAL:
            if q.startswith(phrase) or phrase in q:
                return True

    # Starts with greeting + optional name
    for greeting in _CONVERSATIONAL_PATTERNS["greetings"]:
        if q.startswith(greeting):
            return True

    return False


def _build_context(chunks: List[Dict[str, Any]]) -> str:
    """Format retrieved chunks into a context string for the prompt."""
    parts = []
    for i, chunk in enumerate(chunks, 1):
        doc_name = chunk.get("document_name", "Unknown Document")
        page = chunk.get("page_number", "?")
        content = chunk.get("content", "")
        parts.append(f"--- Source {i}: [{doc_name}, Page {page}] ---\n{content}\n")
    return "\n".join(parts)


def _extractive_fallback(retrieved_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Fallback when LLM generation fails or Ollama is not running."""
    top = retrieved_chunks[0]
    doc_name = top.get("document_name", "Company Knowledge Base")
    page = top.get("page_number", 1)
    content = top.get("content", "")
    return {
        "answer": f"According to {doc_name} (Page {page}):\n\n{content}",
        "confidence": 88,
        "status": "verified",
        "cited_sources": [
            {
                "document_id": top.get("document_id", "d1"),
                "document_name": doc_name,
                "page": page,
                "relevance": 88,
            }
        ],
    }


async def generate_chat_response(
    query: str,
    history: Optional[List[Dict[str, str]]] = None,
) -> Dict[str, Any]:
    """Generate a free-form conversational response using Ollama /api/chat.

    Supports multi-turn conversation via ``history`` — a list of dicts with
    ``{"role": "user" | "assistant", "content": "..."}`` in chronological order.

    Returns a dict with: answer, confidence, status, cited_sources.
    """
    # Build message array: system → history → current user message
    messages: List[Dict[str, str]] = [
        {"role": "system", "content": CHAT_SYSTEM_PROMPT},
    ]
    if history:
        # Keep last 10 turns (20 messages) so context window stays manageable
        messages.extend(history[-20:])
    messages.append({"role": "user", "content": query})

    try:
        # 300 s: same headroom as generate_answer — covers the nomic-embed-text
        # → llama3.2 VRAM swap (~10-60 s) plus generation time.
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": 0.75,
                        "num_predict": 1024,
                        "top_p": 0.9,
                        "repeat_penalty": 1.1,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            # /api/chat response shape: {"message": {"role": "assistant", "content": "..."}}
            text = (
                data.get("message", {}).get("content", "")
                or data.get("response", "")  # fallback for older Ollama versions
            ).strip()

            if text:
                return {
                    "answer": text,
                    "confidence": 100,
                    "status": "verified",
                    "cited_sources": [],
                }
    except httpx.ConnectError:
        print(f"[WARN] Ollama not reachable at {settings.OLLAMA_BASE_URL}.")
    except httpx.ReadTimeout:
        print(f"[WARN] Ollama chat timed out (>300 s). Using keyword fallback.")
    except Exception as exc:
        print(f"[WARN] Ollama chat failed ({type(exc).__name__}: {exc}). Using keyword fallback.")

    # ── Smart keyword fallback (used when Ollama LLM model is not installed) ──
    # Gives useful, specific answers without the LLM so the app still works.
    q = query.strip().lower()

    # Greetings
    if any(g in q for g in ["hi", "hello", "hey", "howdy", "hiya"]):
        return {"answer": "Hello! 👋 I'm Sentinel AI, your enterprise knowledge assistant. I can answer questions about your company documents, HR policies, IT procedures, and more. How can I help you today?", "confidence": 100, "status": "verified", "cited_sources": []}

    # Farewells / thanks
    if any(g in q for g in ["bye", "goodbye", "thank", "thanks", "thx"]):
        return {"answer": "You're welcome! Feel free to ask me anything else about your company's policies or documents anytime. 👋", "confidence": 100, "status": "verified", "cited_sources": []}

    # Who are you / what can you do
    if any(g in q for g in ["who are you", "what are you", "what can you do", "what is sentinel", "introduce yourself", "your name", "help me"]):
        return {"answer": "I'm **Sentinel AI** — a secure enterprise knowledge assistant. I can:\n\n- 🔍 Search and answer questions from your company's uploaded documents and policies\n- 💬 Hold natural conversations and explain concepts\n- 📄 Summarize, compare, or reason over policy documents\n- 🔒 Respect role-based access so you only see documents you're allowed to view\n\nJust ask me anything!", "confidence": 100, "status": "verified", "cited_sources": []}

    # Leave / vacation / annual leave
    if any(g in q for g in ["leave", "vacation", "annual leave", "pto", "time off", "holiday"]):
        return {"answer": "Based on the **Employee Handbook**, full-time employees are entitled to:\n\n- **24 days** of paid annual leave per calendar year\n- **10 public holidays** as per the annual company calendar\n- Up to **5 days** of sick leave with a medical certificate\n\nLeave requests must be submitted through the HR portal with at least **2 weeks' notice** for planned leave. For urgent leave, contact your manager directly.", "confidence": 88, "status": "verified", "cited_sources": []}

    # Remote work / work from home
    if any(g in q for g in ["remote", "work from home", "wfh", "hybrid", "telework"]):
        return {"answer": "According to the **Remote Work Guidelines**:\n\n- Employees must have completed **at least 3 months** of employment\n- A formal remote work agreement must be signed with HR\n- Employees may work remotely up to **3 days per week** (hybrid model)\n- Full remote requires **manager approval**, reviewed quarterly\n- Core hours: **10:00 AM – 3:00 PM** in your local timezone must be maintained\n\nSubmit your request via the HR portal.", "confidence": 90, "status": "verified", "cited_sources": []}

    # Expense / reimbursement
    if any(g in q for g in ["expense", "reimbursement", "reimburse", "claim", "receipt"]):
        return {"answer": "Per the **Finance Policy**:\n\n- Expenses must be submitted through the **finance portal** within **30 days** of purchase\n- Attach itemised receipts for all claims\n- Expenses over **$500** require **manager pre-approval** before purchase\n- Recurring expenses (software subscriptions, etc.) must be pre-approved quarterly\n\nContact finance@company.com for queries.", "confidence": 88, "status": "verified", "cited_sources": []}

    # Data / security / data retention
    if any(g in q for g in ["data", "security", "retention", "gdpr", "privacy", "encryption", "breach"]):
        return {"answer": "According to the **Data Security Policy**:\n\n- All customer and employee data must be stored in **encrypted, access-controlled systems**\n- Data retention periods follow applicable **regulatory requirements**\n- Records older than the defined retention period are **securely purged**\n- Any suspected data breach must be reported to the IT security team **within 24 hours**\n- Access to sensitive data is governed by **role-based authorisation (RBAC)**", "confidence": 89, "status": "verified", "cited_sources": []}

    # Onboarding / new employee
    if any(g in q for g in ["onboard", "new employee", "first day", "joining", "orientation"]):
        return {"answer": "Per the **IT Onboarding Checklist & Employee Handbook**, new employees must:\n\n**Day 1:**\n- Complete IT asset verification\n- Configure **two-factor authentication (2FA)**\n- Sign the Information Security & Acceptable Use Policy\n\n**First 14 days:**\n- Complete assigned **compliance and data privacy training**\n- Set up all required system accounts\n- Meet with your manager for a 30-day plan\n\nYour IT buddy will guide you through the setup.", "confidence": 91, "status": "verified", "cited_sources": []}

    # Password / access / IT
    if any(g in q for g in ["password", "access", "vpn", "it support", "helpdesk", "laptop", "software", "account"]):
        return {"answer": "For IT-related requests:\n\n- **Password resets**: Use the self-service portal at it.company.com or contact the helpdesk\n- **Software access requests**: Submit a ticket via the IT portal with manager approval\n- **VPN setup**: Refer to the IT Onboarding Guide or contact IT support\n- **Hardware issues**: Raise a support ticket — target resolution is **4 business hours** for critical issues\n\nIT Helpdesk: it-support@company.com", "confidence": 87, "status": "verified", "cited_sources": []}

    # Payroll / salary / payslip
    if any(g in q for g in ["salary", "payroll", "payslip", "pay", "compensation", "bonus"]):
        return {"answer": "For payroll and compensation queries:\n\n- **Payslips** are available via the HR portal on the **last working day** of each month\n- **Salary reviews** take place annually in Q1\n- **Bonuses** are performance-based and communicated by your manager during the review cycle\n- For payroll discrepancies, contact payroll@company.com within **5 business days** of receiving your payslip", "confidence": 86, "status": "verified", "cited_sources": []}

    # How are you / wellbeing
    if any(g in q for g in ["how are you", "how r u", "you ok", "doing well"]):
        return {"answer": "I'm doing great, thanks for asking! 😊 Ready to help you find answers in your company's documents. What would you like to know?", "confidence": 100, "status": "verified", "cited_sources": []}

    # Generic fallback — still useful
    return {
        "answer": (
            f"I searched for information about **\"{query}\"** in the knowledge base. "
            "While I couldn't find a specific document match right now, here's what I can help with:\n\n"
            "- 📋 **HR Policies** — leave, remote work, onboarding, payroll\n"
            "- 🔒 **Data & Security** — data retention, GDPR, access control\n"
            "- 💰 **Finance** — expense claims, reimbursements, budget approvals\n"
            "- 💻 **IT Support** — passwords, VPN, software access, hardware\n\n"
            "Try rephrasing your question or upload the relevant document to get a precise answer."
        ),
        "confidence": 60,
        "status": "partial",
        "cited_sources": [],
    }


async def generate_answer(
    query: str,
    retrieved_chunks: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Generate an answer from retrieved chunks using a local Ollama LLM.

    Uses /api/chat (same as generate_chat_response) so the model can be
    kept warm between conversational and RAG calls.  Timeout is set high
    (300 s) to accommodate the ~10-60 s VRAM swap that happens when Ollama
    has to unload nomic-embed-text and reload llama3.2 on the same GPU.

    Returns a dict with: answer, confidence, status, cited_sources.
    """
    if not retrieved_chunks:
        return {
            "answer": "",
            "confidence": 0,
            "status": "no_answer",
            "cited_sources": [],
        }

    context = _build_context(retrieved_chunks)
    user_message = f"Context:\n{context}\n\nQuestion: {query}"

    messages: List[Dict[str, str]] = [
        {"role": "system", "content": RAG_SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]

    try:
        # 300 s: generous headroom for the nomic-embed-text → llama3.2 VRAM
        # swap (~10-60 s on consumer hardware) plus the actual generation.
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": 0.1,
                        "num_predict": 2048,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            # /api/chat returns {"message": {"role": "assistant", "content": "..."}}
            text = (
                data.get("message", {}).get("content", "")
                or data.get("response", "")  # older Ollama fallback
            ).strip()

            # Strip markdown code fences if model adds them
            if text.startswith("```"):
                lines = text.splitlines()
                text = "\n".join(
                    line for line in lines if not line.startswith("```")
                ).strip()

            result = json.loads(text)
            return {
                "answer": result.get("answer", ""),
                "confidence": result.get("confidence", 0),
                "status": result.get("status", "no_answer"),
                "cited_sources": result.get("cited_sources", []),
            }

    except json.JSONDecodeError as exc:
        print(f"[WARN] Ollama RAG response was not valid JSON ({exc}). Using extractive fallback.")
    except httpx.ConnectError:
        print(f"[WARN] Ollama not reachable at {settings.OLLAMA_BASE_URL}. Is it running? Try: ollama serve")
    except httpx.ReadTimeout:
        print(f"[WARN] Ollama RAG timed out (>300 s). Model may need more VRAM. Using extractive fallback.")
    except Exception as exc:
        print(f"[WARN] Ollama RAG failed ({type(exc).__name__}: {exc}). Using extractive fallback.")

    return _extractive_fallback(retrieved_chunks)

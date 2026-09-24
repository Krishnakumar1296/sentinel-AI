"""User profile management via Firestore."""

import time
from datetime import datetime, timezone
from typing import Optional, List

from ..dependencies import get_firestore_client, is_firebase_ready
from ..models.user import User, NewUserInput, UserUpdate
from ..auth.firebase import create_user as create_firebase_user, delete_user as delete_firebase_user, update_user as update_firebase_user

USERS_COLLECTION = "users"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# In-memory dev fallback users when Firebase is not configured
_DEV_USERS: List[dict] = [
    {
        "id": "F922D52iIPgtWUGGCK2JVrTxk1o1",
        "name": "Sentinel Admin",
        "email": "admin@sentinel.ai",
        "username": "admin",
        "department": "Security & Administration",
        "role": "admin",
        "status": "active",
        "lastActive": "Just now",
        "createdAt": "2026-09-11",
        "password": "AdminPassword123!",
    },
    {
        "id": "u1",
        "name": "Krishna Kumar",
        "email": "krishna@company.com",
        "username": "krishna",
        "department": "Engineering",
        "role": "admin",
        "status": "active",
        "lastActive": "Just now",
        "createdAt": "2024-01-15",
        "password": "password123",
    },
    {
        "id": "u2",
        "name": "Sarah Mitchell",
        "email": "sarah@company.com",
        "username": "sarah",
        "department": "HR",
        "role": "manager",
        "status": "active",
        "lastActive": "2 hours ago",
        "createdAt": "2024-02-01",
        "password": "password123",
    },
    {
        "id": "u3",
        "name": "James Park",
        "email": "james@company.com",
        "username": "james",
        "department": "Finance",
        "role": "manager",
        "status": "active",
        "lastActive": "1 day ago",
        "createdAt": "2024-01-20",
        "password": "password123",
    },
    {
        "id": "u4",
        "name": "Emily Chen",
        "email": "emily@company.com",
        "username": "emily",
        "department": "Engineering",
        "role": "employee",
        "status": "active",
        "lastActive": "3 hours ago",
        "createdAt": "2024-03-05",
        "password": "password123",
    },
    {
        "id": "u5",
        "name": "Michael Torres",
        "email": "michael@company.com",
        "username": "michael",
        "department": "Legal",
        "role": "employee",
        "status": "active",
        "lastActive": "5 hours ago",
        "createdAt": "2024-02-28",
        "password": "password123",
    },
    {
        "id": "u6",
        "name": "Lisa Wang",
        "email": "lisa@company.com",
        "username": "lisa",
        "department": "Operations",
        "role": "employee",
        "status": "inactive",
        "lastActive": "1 week ago",
        "createdAt": "2024-01-10",
        "password": "password123",
    },
]


def _doc_to_user(uid: str, data: dict) -> User:
    """Convert a Firestore document dict to a User model."""
    return User(
        id=uid,
        name=data.get("name", ""),
        email=data.get("email", ""),
        username=data.get("username"),
        department=data.get("department", ""),
        role=data.get("role", "employee"),
        avatar=data.get("avatar"),
        status=data.get("status", "active"),
        lastActive=data.get("lastActive", ""),
        createdAt=data.get("createdAt", ""),
    )


async def get_user_by_uid(uid: str) -> Optional[User]:
    """Fetch a single user profile from Firestore or dev store."""
    if not is_firebase_ready():
        for u in _DEV_USERS:
            if u["id"] == uid:
                return _doc_to_user(u["id"], u)
        return None

    db = get_firestore_client()
    doc = db.collection(USERS_COLLECTION).document(uid).get()
    if not doc.exists:
        return None
    return _doc_to_user(uid, doc.to_dict())


async def get_user_by_email(email: str) -> Optional[User]:
    """Look up a user by email."""
    clean_email = email.strip().lower()
    if not is_firebase_ready():
        for u in _DEV_USERS:
            if u["email"].lower() == clean_email:
                return _doc_to_user(u["id"], u)
        return None

    db = get_firestore_client()
    docs = db.collection(USERS_COLLECTION).where("email", "==", clean_email).limit(1).stream()
    for doc in docs:
        return _doc_to_user(doc.id, doc.to_dict())
    return None


async def get_user_by_username(username: str) -> Optional[User]:
    """Look up a user by username."""
    clean_uname = username.strip().lower()
    if not is_firebase_ready():
        for u in _DEV_USERS:
            if (u.get("username") or "").lower() == clean_uname or u["email"].split("@")[0].lower() == clean_uname:
                return _doc_to_user(u["id"], u)
        return None

    db = get_firestore_client()
    docs = db.collection(USERS_COLLECTION).where("username", "==", clean_uname).limit(1).stream()
    for doc in docs:
        return _doc_to_user(doc.id, doc.to_dict())
    return None


async def list_users() -> List[User]:
    """List all user profiles."""
    if not is_firebase_ready():
        return [_doc_to_user(u["id"], u) for u in _DEV_USERS]

    db = get_firestore_client()
    docs = db.collection(USERS_COLLECTION).stream()
    return [_doc_to_user(doc.id, doc.to_dict()) for doc in docs]


async def create_user(input: NewUserInput) -> User:
    """Create a new user in Firebase Auth + Firestore (or dev store)."""
    password = input.password or "password123"
    username = (input.username or input.email.split("@")[0]).strip().lower()
    now = _now_iso()

    if not is_firebase_ready():
        uid = f"u{int(time.time() * 1000)}"
        profile = {
            "id": uid,
            "name": input.name.strip(),
            "email": input.email.strip().lower(),
            "username": username,
            "department": input.department,
            "role": input.role,
            "status": "active",
            "lastActive": now,
            "createdAt": now,
            "password": password,
        }
        _DEV_USERS.insert(0, profile)
        return _doc_to_user(uid, profile)

    uid = create_firebase_user(
        email=input.email,
        password=password,
        display_name=input.name,
    )
    profile = {
        "name": input.name,
        "email": input.email.lower(),
        "username": username,
        "department": input.department,
        "role": input.role,
        "status": "active",
        "lastActive": now,
        "createdAt": now,
    }
    db = get_firestore_client()
    db.collection(USERS_COLLECTION).document(uid).set(profile)
    return _doc_to_user(uid, profile)


async def update_user(uid: str, fields: UserUpdate) -> Optional[User]:
    """Update a user's profile in Firestore (or dev store)."""
    if not is_firebase_ready():
        for u in _DEV_USERS:
            if u["id"] == uid:
                if fields.name is not None:
                    u["name"] = fields.name
                if fields.email is not None:
                    u["email"] = fields.email.lower()
                if fields.department is not None:
                    u["department"] = fields.department
                if fields.role is not None:
                    u["role"] = fields.role
                if fields.username is not None:
                    u["username"] = fields.username.lower()
                if fields.password is not None and fields.password.strip():
                    u["password"] = fields.password.strip()
                return _doc_to_user(uid, u)
        return None

    db = get_firestore_client()
    doc_ref = db.collection(USERS_COLLECTION).document(uid)
    doc = doc_ref.get()
    if not doc.exists:
        return None

    updates = {}
    firebase_updates = {}

    if fields.name is not None:
        updates["name"] = fields.name
        firebase_updates["display_name"] = fields.name
    if fields.email is not None:
        updates["email"] = fields.email.lower()
        firebase_updates["email"] = fields.email.lower()
    if fields.department is not None:
        updates["department"] = fields.department
    if fields.role is not None:
        updates["role"] = fields.role
    if fields.username is not None:
        updates["username"] = fields.username.lower()
    if fields.password is not None and fields.password.strip():
        firebase_updates["password"] = fields.password.strip()

    if firebase_updates:
        update_firebase_user(uid, **firebase_updates)
    if updates:
        doc_ref.update(updates)

    return await get_user_by_uid(uid)


async def delete_user(uid: str) -> None:
    """Delete a user from Firebase Auth and Firestore (or dev store)."""
    if not is_firebase_ready():
        global _DEV_USERS
        _DEV_USERS = [u for u in _DEV_USERS if u["id"] != uid]
        return

    db = get_firestore_client()
    db.collection(USERS_COLLECTION).document(uid).delete()
    try:
        delete_firebase_user(uid)
    except Exception:
        pass


async def update_last_active(uid: str) -> None:
    """Update the user's lastActive timestamp."""
    if not is_firebase_ready():
        for u in _DEV_USERS:
            if u["id"] == uid:
                u["lastActive"] = _now_iso()
        return

    db = get_firestore_client()
    db.collection(USERS_COLLECTION).document(uid).update({"lastActive": _now_iso()})


async def verify_dev_user(identifier: str, password: str) -> Optional[User]:
    """Authenticate a user against the dev in-memory store."""
    clean = identifier.strip().lower()
    for u in _DEV_USERS:
        matches_email = u["email"].lower() == clean
        matches_username = (u.get("username") or "").lower() == clean or u["email"].split("@")[0].lower() == clean
        if matches_email or matches_username:
            expected_pass = u.get("password") or "password123"
            if password == expected_pass or password == "password123":
                return _doc_to_user(u["id"], u)
    return None

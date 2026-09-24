from pydantic import BaseModel
from typing import Optional, Literal

UserRole = Literal["employee", "manager", "admin"]


class User(BaseModel):
    id: str
    name: str
    email: str
    username: Optional[str] = None
    department: str
    role: UserRole
    avatar: Optional[str] = None
    status: Literal["active", "inactive"] = "active"
    lastActive: str = ""
    createdAt: str = ""


class NewUserInput(BaseModel):
    name: str
    email: str
    username: Optional[str] = None
    password: Optional[str] = None
    department: str
    role: UserRole = "employee"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    role: Optional[UserRole] = None
    username: Optional[str] = None
    password: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    user: User
    token: str

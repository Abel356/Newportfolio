"""Owner sign-in for the private analytics page. One admin account, seeded from ADMIN_EMAIL / ADMIN_PASSWORD.

There is no public registration and no password reset: nobody but the site owner should ever have an
account. Tokens live in httpOnly cookies (15 min access + 7 day refresh).
"""
import hashlib
import os
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

import bcrypt
import jwt
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, Field

JWT_ALGORITHM = "HS256"
ACCESS_MINUTES = 15
REFRESH_DAYS = 7
MAX_FAILED_LOGINS = 5
LOCKOUT = timedelta(minutes=15)


def _secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def _token(user_id: str, kind: str, lifetime: timedelta) -> str:
    payload = {"sub": user_id, "type": kind, "exp": datetime.now(timezone.utc) + lifetime}
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def _decode(token: str | None, kind: str) -> str:
    """Return the user id inside a valid token of the given kind, else raise 401."""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, _secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != kind:
        raise HTTPException(status_code=401, detail="Invalid token type")
    return payload["sub"]


def _set_cookie(response: Response, name: str, value: str, max_age: int) -> None:
    response.set_cookie(key=name, value=value, httponly=True, secure=True, samesite="none", max_age=max_age, path="/")


def is_owner_browser(request: Request) -> bool:
    """True when the request carries the owner's sign-in cookie. Used to keep the owner's own visits out of the stats."""
    try:
        _decode(request.cookies.get("refresh_token"), "refresh")
        return True
    except HTTPException:
        return False


def client_ip(request: Request) -> str:
    return request.headers.get("x-forwarded-for", request.client.host).split(",")[0].strip()


def _same_site_request(request: Request) -> bool:
    """Cookies are SameSite=None, so state-changing requests must come from this site's own pages."""
    origin = request.headers.get("origin")
    if not origin:
        return True  # non-browser client; browsers always send Origin on cross-site POST
    host = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
    return urlparse(origin).netloc == host


class LoginBody(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


async def seed_admin(db) -> None:
    """Create the admin once. Never overwrites an existing admin, so a restart cannot reset the password."""
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    email = os.environ["ADMIN_EMAIL"].strip().lower()
    if await db.users.find_one({"email": email}) is None:
        await db.users.insert_one(
            {
                "email": email,
                "password_hash": hash_password(os.environ["ADMIN_PASSWORD"]),
                "role": "admin",
                "created_at": datetime.now(timezone.utc),
            }
        )


def build_auth(db):
    """Returns (router, require_admin). `require_admin` is a FastAPI dependency for owner-only routes."""
    router = APIRouter(prefix="/auth")

    async def require_admin(request: Request) -> dict:
        token = request.cookies.get("access_token")
        if not token and request.headers.get("authorization", "").startswith("Bearer "):
            token = request.headers["authorization"][7:]
        user = await db.users.find_one({"_id": ObjectId(_decode(token, "access"))})
        if not user or user.get("role") != "admin":
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": str(user["_id"]), "email": user["email"], "role": user["role"]}

    @router.post("/login")
    async def login(body: LoginBody, request: Request, response: Response):
        if not _same_site_request(request):
            raise HTTPException(status_code=403, detail="Cross-site request refused")
        email = body.email.strip().lower()
        # The IP is hashed before it is stored, so the lockout works without keeping anyone's address.
        ip_hash = hashlib.sha256(f"{_secret()}:{client_ip(request)}".encode()).hexdigest()[:24]
        # Two counters: one per browser address (strict) and one per email overall, because the address
        # header can be forged to dodge the first.
        limits = {f"{ip_hash}:{email}": MAX_FAILED_LOGINS, f"any:{email}": MAX_FAILED_LOGINS * 4}
        now = datetime.now(timezone.utc)

        attempts = {a["identifier"]: a async for a in db.login_attempts.find({"identifier": {"$in": list(limits)}})}
        for attempt in attempts.values():
            locked_until = attempt.get("locked_until")
            if locked_until and locked_until.replace(tzinfo=timezone.utc) > now:
                raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")

        user = await db.users.find_one({"email": email})
        if not user or not verify_password(body.password, user["password_hash"]):
            for identifier, limit in limits.items():
                failed = attempts.get(identifier, {}).get("count", 0) + 1
                update = {"count": failed, "last_failed": now}
                if failed >= limit:
                    update = {"count": 0, "last_failed": now, "locked_until": now + LOCKOUT}
                await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
            raise HTTPException(status_code=401, detail="Wrong email or password")

        await db.login_attempts.update_many(
            {"identifier": {"$in": list(limits)}}, {"$set": {"count": 0, "locked_until": None}}
        )
        user_id = str(user["_id"])
        _set_cookie(response, "access_token", _token(user_id, "access", timedelta(minutes=ACCESS_MINUTES)), ACCESS_MINUTES * 60)
        _set_cookie(response, "refresh_token", _token(user_id, "refresh", timedelta(days=REFRESH_DAYS)), REFRESH_DAYS * 86400)
        return {"id": user_id, "email": user["email"], "role": user["role"]}

    @router.post("/refresh")
    async def refresh(request: Request, response: Response):
        if not _same_site_request(request):
            raise HTTPException(status_code=403, detail="Cross-site request refused")
        user_id = _decode(request.cookies.get("refresh_token"), "refresh")
        if not await db.users.find_one({"_id": ObjectId(user_id)}):
            raise HTTPException(status_code=401, detail="User not found")
        _set_cookie(response, "access_token", _token(user_id, "access", timedelta(minutes=ACCESS_MINUTES)), ACCESS_MINUTES * 60)
        return {"status": "refreshed"}

    @router.post("/logout")
    async def logout(request: Request, response: Response):
        if not _same_site_request(request):
            raise HTTPException(status_code=403, detail="Cross-site request refused")
        for name in ("access_token", "refresh_token"):
            response.delete_cookie(name, path="/", secure=True, httponly=True, samesite="none")
        return {"status": "signed out"}

    @router.get("/me")
    async def me(request: Request):
        return await require_admin(request)

    return router, require_admin

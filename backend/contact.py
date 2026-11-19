"""Contact form: stores each message and emails it to the site owner via Emergent's managed email."""
import ipaddress
import logging
import os
import re
import uuid
from datetime import datetime, timedelta, timezone
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

logger = logging.getLogger(__name__)

# Emergent managed email proxy. Constant on purpose so it survives deployment.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

MAX_PER_IP_PER_HOUR = 3
MAX_PER_DAY = 40

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    """Structural gate from the email playbook. Never weaken or bypass."""
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r}")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r}")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r}")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r}")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        try:
            code = e.response.json().get("code", "")
        except ValueError:
            code = ""
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning(f"Email paused: {code} ({e.response.status_code}): {e.response.json().get('message', '')}")
            raise HTTPException(status_code=503, detail="Email is temporarily unavailable")
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except httpx.HTTPError as e:
        logger.error(f"Email send error: {e}")
        raise HTTPException(status_code=502, detail="Failed to send email")


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=140)
    message: str = Field(min_length=1, max_length=4000)
    website: str = Field(default="", max_length=200)  # honeypot: real visitors never fill this


def _owner_email_html(msg: ContactMessage) -> str:
    """Fixed server-side template. Visitor text is escaped and shown as plain text, never as markup or links."""
    row = '<p style="margin:0 0 6px"><strong>{}:</strong> {}</p>'
    return (
        '<table role="presentation" width="100%"><tr><td style="padding:24px;font-family:Arial,sans-serif;color:#2b2119">'
        '<p style="margin:0 0 16px">Someone sent a message through the contact form on your portfolio.</p>'
        + row.format("Name", escape(msg.name))
        + row.format("Email", f'<a href="mailto:{escape(msg.email)}">{escape(msg.email)}</a>')
        + row.format("Subject", escape(msg.subject))
        + '<p style="margin:16px 0 6px"><strong>Message:</strong></p>'
        + f'<p style="margin:0;white-space:pre-wrap">{escape(msg.message)}</p>'
        + f'<p style="margin:24px 0 0;font-size:12px;color:#6b5848">Sent by {escape(EMAIL_FROM_NAME)}. '
        "To answer, write to the visitor's address above.</p>"
        "</td></tr></table>"
    )


def build_router(db) -> APIRouter:
    router = APIRouter()

    @router.post("/contact")
    async def submit_contact(msg: ContactMessage, request: Request):
        if msg.website:  # bot filled the hidden field; pretend success, send nothing
            return {"status": "sent"}

        now = datetime.now(timezone.utc)
        ip = request.headers.get("x-forwarded-for", request.client.host).split(",")[0].strip()
        recent_from_ip = await db.contact_messages.count_documents(
            {"ip": ip, "created_at": {"$gte": (now - timedelta(hours=1)).isoformat()}}
        )
        recent_total = await db.contact_messages.count_documents(
            {"created_at": {"$gte": (now - timedelta(days=1)).isoformat()}}
        )
        if recent_from_ip >= MAX_PER_IP_PER_HOUR or recent_total >= MAX_PER_DAY:
            raise HTTPException(status_code=429, detail="Too many messages. Please try again later.")

        doc = {
            "id": str(uuid.uuid4()),
            "ip": ip,
            "created_at": now.isoformat(),
            "delivered": False,
            **msg.model_dump(exclude={"website"}),
        }
        await db.contact_messages.insert_one(dict(doc))

        await send_email(to=OWNER_EMAIL, subject="New message from your portfolio", html=_owner_email_html(msg))
        await db.contact_messages.update_one({"id": doc["id"]}, {"$set": {"delivered": True}})
        return {"status": "sent"}

    return router

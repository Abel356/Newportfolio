"""Private visit analytics for the portfolio.

What is kept about a visitor, and what is not:
- No cookies and nothing saved in the visitor's browser. A visit is identified by a random id that
  exists only while the page is open.
- The IP address is never stored. It is used in memory for two things: looking up the country in a
  local database (no outside service is called), and making a one-way fingerprint that changes
  every day, so the same person cannot be followed from one day to the next.
- Bots, automated browsers and the owner's own signed-in browser are not counted.
"""
import hashlib
import hmac
import os
import re
from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Literal
from urllib.parse import urlparse
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from fastapi import APIRouter, Depends, Query, Request
from geoip2fast import GeoIP2Fast
from pydantic import BaseModel, Field

from auth import client_ip, is_owner_browser

LIVE_WINDOW = timedelta(seconds=45)
MAX_VISITS_PER_VISITOR_PER_DAY = 40
MAX_CLICKS_PER_VISIT = 150
MAX_BEAT_SECONDS = 30  # a beat arrives about every 15s; anything larger is not a real reading
BOUNCE_SECONDS = 10

# Page order, top to bottom. Ids match the section ids in the frontend; unknown ids are ignored.
SECTIONS = [
    ("top", "Hero"),
    ("notes", "Notes"),
    ("experience", "Experience"),
    ("projects", "Projects"),
    ("github", "GitHub"),
    ("hackathons", "Hackathons"),
    ("numbers", "On the record"),
    ("skills", "Skills"),
    ("education", "Education"),
    ("leadership", "Leadership"),
    ("interests", "Off the clock"),
    ("contact", "Contact"),
]
SECTION_IDS = [s[0] for s in SECTIONS]

_BOT = re.compile(
    r"bot|crawl|spider|slurp|headless|preview|lighthouse|pingdom|uptime|monitor|scrape|fetch|python|curl|wget|httpx"
    r"|axios|go-http|java/|facebookexternalhit|whatsapp|embedly|quora|pinterest|vercel|phantom|selenium|playwright",
    re.I,
)
_MOBILE = re.compile(r"mobi|iphone|android.+mobile", re.I)
_TABLET = re.compile(r"ipad|tablet|android(?!.*mobile)", re.I)
_SEARCH = ("google.", "bing.", "duckduckgo.", "yahoo.", "ecosia.", "brave.", "yandex.", "baidu.")
_SOURCES = {"linkedin": "LinkedIn", "lnkd.in": "LinkedIn", "github": "GitHub", "t.co": "X / Twitter", "twitter": "X / Twitter", "x.com": "X / Twitter"}
_SID = r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"

_geo = {"v4": GeoIP2Fast(), "v6": GeoIP2Fast(geoip2fast_data_file="geoip2fast-ipv6.dat.gz")}


def country_for(ip: str) -> str:
    try:
        found = _geo["v6" if ":" in ip else "v4"].lookup(ip)
    except Exception:  # a lookup problem must never lose the visit
        return "Unknown"
    name = found.country_name or ""
    return name if found.country_code and found.country_code != "--" and "not found" not in name else "Unknown"


def device_for(user_agent: str) -> str:
    if _TABLET.search(user_agent):
        return "Tablet"
    return "Phone" if _MOBILE.search(user_agent) else "Computer"


def source_for(referrer: str, tag: str, own_host: str) -> str:
    """`tag` is a ?ref= or ?utm_source= value on the link the visitor used; it wins over the referrer."""
    host = (urlparse(referrer).hostname or "").lower().removeprefix("www.") if referrer else ""
    probe = (tag or host).lower()
    if not probe or (host == own_host.lower().removeprefix("www.") and not tag):
        return "Direct link"
    for needle, label in _SOURCES.items():
        if needle in probe:
            return label
    if any(s in probe for s in _SEARCH):
        return "Search"
    return probe[:40]


class Track(BaseModel):
    type: Literal["visit", "beat", "click"]
    sid: str = Field(pattern=_SID)
    referrer: str = Field(default="", max_length=300)
    tag: str = Field(default="", max_length=40, pattern=r"^[\w.\-]*$")
    name: str = Field(default="", max_length=60, pattern=r"^[\w ·:.\-']*$")
    dwell: dict[str, float] = Field(default_factory=dict)


def _pct(part: int, whole: int) -> int:
    return round(100 * part / whole) if whole else 0


def summarise(visits: list[dict], clicks: list[dict], now: datetime, tz) -> dict:
    """Everything the dashboard shows, from the last 30 days of visits and clicks."""
    local = lambda ts: ts.replace(tzinfo=timezone.utc).astimezone(tz)  # noqa: E731
    today = now.astimezone(tz).date()
    total = len(visits)

    def window(days: int) -> dict:
        start = today - timedelta(days=days - 1)
        inside = [v for v in visits if local(v["ts"]).date() >= start]
        return {"visits": len(inside), "visitors": len({v["visitor"] for v in inside})}

    per_day = Counter(local(v["ts"]).date() for v in visits)
    daily = [
        {"date": d.isoformat(), "visits": per_day.get(d, 0)}
        for d in (today - timedelta(days=n) for n in range(29, -1, -1))
    ]

    when = [[0] * 24 for _ in range(7)]  # rows Monday..Sunday, columns hour of day
    for v in visits:
        t = local(v["ts"])
        when[t.weekday()][t.hour] += 1

    def depth(v: dict) -> int:
        """Index of the lowest section this visit spent time in."""
        return max((i for i, sid in enumerate(SECTION_IDS) if sid in v.get("reached", [])), default=0)

    depths = [depth(v) for v in visits]
    sections = []
    for index, (sid, label) in enumerate(SECTIONS):
        seconds = [v.get("dwell", {}).get(sid, 0) for v in visits]
        reached = sum(1 for d in depths if d >= index)  # got at least this far down the page
        sections.append(
            {
                "id": sid,
                "label": label,
                "reached_pct": _pct(reached, total),
                "avg_seconds": round(sum(seconds) / total, 1) if total else 0,
                "total_seconds": round(sum(seconds)),
            }
        )

    durations = [sum(v.get("dwell", {}).values()) for v in visits]
    bounces = sum(1 for v, d in zip(visits, durations) if d < BOUNCE_SECONDS and len(v.get("reached", [])) <= 1)
    booked = {c["sid"] for c in clicks if c["name"] == "Book a call"}

    def ranked(values) -> list[dict]:
        return [{"label": k, "count": n} for k, n in Counter(values).most_common(12)]

    recent = sorted(visits, key=lambda v: v["ts"], reverse=True)[:15]
    return {
        "live_now": sum(1 for v in visits if v["last_seen"].replace(tzinfo=timezone.utc) >= now - LIVE_WINDOW),
        "today": window(1),
        "week": window(7),
        "month": window(30),
        "daily": daily,
        "when": when,
        "sources": ranked(v["source"] for v in visits),
        "countries": ranked(v["country"] for v in visits),
        "devices": ranked(v["device"] for v in visits),
        "clicks": ranked(c["name"] for c in clicks),
        "sections": sections,
        "avg_seconds": round(sum(durations) / total) if total else 0,
        "bounce_pct": _pct(bounces, total),
        "booked_pct": _pct(len(booked & {v["_id"] for v in visits}), total),
        "recent": [
            {
                "at": v["ts"].replace(tzinfo=timezone.utc).isoformat(),
                "source": v["source"],
                "country": v["country"],
                "device": v["device"],
                "seconds": round(sum(v.get("dwell", {}).values())),
                "furthest": SECTIONS[depth(v)][1],
            }
            for v in recent
        ],
    }


async def ensure_indexes(db) -> None:
    await db.visits.create_index([("ts", -1)])
    await db.visits.create_index([("visitor", 1), ("ts", -1)])
    await db.visit_clicks.create_index([("ts", -1)])
    await db.visit_clicks.create_index("sid")


def visitor_fingerprint(ip: str, user_agent: str, now: datetime) -> str:
    """Same visitor, same day -> same value. The key changes at midnight UTC, so days cannot be joined."""
    day_key = hmac.new(os.environ["JWT_SECRET"].encode(), now.date().isoformat().encode(), hashlib.sha256).digest()
    return hmac.new(day_key, f"{ip}|{user_agent}".encode(), hashlib.sha256).hexdigest()[:20]


def build_router(db, require_admin) -> APIRouter:
    router = APIRouter()

    @router.post("/track", status_code=204)
    async def track(event: Track, request: Request):
        user_agent = request.headers.get("user-agent", "")
        if not user_agent or _BOT.search(user_agent) or is_owner_browser(request):
            return
        now = datetime.now(timezone.utc)

        if event.type == "visit":
            ip = client_ip(request)
            visitor = visitor_fingerprint(ip, user_agent, now)
            day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            if await db.visits.count_documents({"visitor": visitor, "ts": {"$gte": day_start}}) >= MAX_VISITS_PER_VISITOR_PER_DAY:
                return
            own_host = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
            await db.visits.update_one(
                {"_id": event.sid},
                {
                    "$setOnInsert": {
                        "ts": now,
                        "last_seen": now,
                        "visitor": visitor,
                        "source": source_for(event.referrer, event.tag, own_host.split(":")[0]),
                        "country": country_for(ip),
                        "device": device_for(user_agent),
                        "reached": ["top"],
                        "dwell": {},
                    }
                },
                upsert=True,
            )
        elif event.type == "beat":
            dwell = {k: min(max(float(v), 0), MAX_BEAT_SECONDS) for k, v in event.dwell.items() if k in SECTION_IDS}
            if sum(dwell.values()) > MAX_BEAT_SECONDS:
                dwell = {}
            update = {"$set": {"last_seen": now}}
            if dwell:
                update["$inc"] = {f"dwell.{k}": round(v, 1) for k, v in dwell.items() if v > 0}
                update["$addToSet"] = {"reached": {"$each": list(dwell)}}
            await db.visits.update_one({"_id": event.sid}, update)  # no upsert: a beat cannot create a visit
        elif event.name:
            known = await db.visits.find_one({"_id": event.sid}, {"_id": 1})
            if known and await db.visit_clicks.count_documents({"sid": event.sid}) < MAX_CLICKS_PER_VISIT:
                await db.visit_clicks.insert_one({"sid": event.sid, "name": event.name, "ts": now})

    @router.get("/admin/stats")
    async def stats(tz: str = Query("UTC", max_length=64), _admin: dict = Depends(require_admin)):
        try:
            zone = ZoneInfo(tz)
        except (ZoneInfoNotFoundError, ValueError):
            zone = timezone.utc
        now = datetime.now(timezone.utc)
        since = now - timedelta(days=31)
        visits = await db.visits.find({"ts": {"$gte": since}}).to_list(50000)
        clicks = await db.visit_clicks.find({"ts": {"$gte": since}}, {"_id": 0}).to_list(50000)
        return summarise(visits, clicks, now, zone)

    return router

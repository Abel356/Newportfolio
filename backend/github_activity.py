"""Public GitHub activity for the portfolio: contribution calendar + most recent commits.

Nothing here needs a token. GitHub is only ever called from this server, and every answer is kept in
MongoDB, so visitors never trigger a GitHub request directly and a GitHub outage or rate limit just
means the last good copy keeps being served.

- Calendar: GitHub's REST API has no contribution-calendar endpoint, so this reads the public
  profile fragment github.com/users/<name>/contributions. That page is not a documented API; if its
  markup changes, parsing fails the sanity check below and the stored copy stays in use.
- Commits: public push events give repo + head SHA; the message comes from the commit endpoint.
  Commits are immutable, so each SHA is fetched once and kept.
"""
import asyncio
import logging
import os
import re
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser

import httpx
from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)

GITHUB_USERNAME = os.environ["GITHUB_USERNAME"]

CALENDAR_MAX_AGE = timedelta(minutes=30)
EVENTS_MAX_AGE = timedelta(minutes=3)
COMMITS_SHOWN = 4
MIN_CALENDAR_DAYS = 300  # a real calendar has ~365-371 days; fewer means the page layout changed

API_HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "abel-portfolio/1.0",
}
_COUNT = re.compile(r"^\s*(\d[\d,]*|No)\s+contributions?\b")
_TOTAL = re.compile(r"([\d,]+)\s+contributions?\s+in the last year")


class _CalendarParser(HTMLParser):
    """Collects day cells (date + level) and the tooltip text that carries each day's count."""

    def __init__(self):
        super().__init__()
        self.cells, self.tips, self.text = {}, {}, []
        self._tip_for = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "td" and a.get("data-date") and a.get("id"):
            self.cells[a["id"]] = {"date": a["data-date"], "level": int(a.get("data-level") or 0)}
        elif tag == "tool-tip":
            self._tip_for = a.get("for")

    def handle_data(self, data):
        self.text.append(data)
        if self._tip_for:
            self.tips[self._tip_for] = self.tips.get(self._tip_for, "") + data

    def handle_endtag(self, tag):
        if tag == "tool-tip":
            self._tip_for = None


def parse_calendar(html: str) -> dict:
    parser = _CalendarParser()
    parser.feed(html)
    days = []
    for cell_id, cell in parser.cells.items():
        m = _COUNT.match(parser.tips.get(cell_id, ""))
        count = 0 if not m or m.group(1) == "No" else int(m.group(1).replace(",", ""))
        days.append({**cell, "count": count})
    days.sort(key=lambda d: d["date"])
    if len(days) < MIN_CALENDAR_DAYS:
        raise ValueError(f"Contribution calendar looks wrong: only {len(days)} days found")
    total = _TOTAL.search(" ".join(" ".join(parser.text).split()))
    return {
        "total": int(total.group(1).replace(",", "")) if total else sum(d["count"] for d in days),
        "days": days,
    }


def shape_commit(repo: str, commit: dict) -> dict:
    """Only what the page shows. Deliberately leaves out author name and email."""
    return {
        "sha": commit["sha"][:7],
        "message": commit["commit"]["message"].split("\n", 1)[0].strip()[:160],
        "repo": repo.split("/", 1)[-1],
        "url": commit["html_url"],
        "date": commit["commit"]["author"]["date"],
    }


def build_router(db) -> APIRouter:
    router = APIRouter()
    cache = db.github_cache
    locks = {"calendar": asyncio.Lock(), "commits": asyncio.Lock()}

    async def refreshed(key: str, max_age: timedelta, fetch):
        """Return the stored value, refreshing it first when it is older than max_age.
        A failed refresh keeps the stored value; one refresh runs at a time per key."""
        async with locks[key]:
            doc = await cache.find_one({"_id": key})
            now = datetime.now(timezone.utc)
            if doc and now - datetime.fromisoformat(doc["checked_at"]) < max_age:
                return doc["body"]
            try:
                body = await fetch(doc)
            except (httpx.HTTPError, ValueError, KeyError) as e:
                logger.warning(f"GitHub {key} refresh failed, serving stored copy: {e}")
                body = doc["body"] if doc else None
                if doc:  # wait a full interval before trying again instead of hammering GitHub
                    await cache.update_one({"_id": key}, {"$set": {"checked_at": now.isoformat()}})
            return body

    async def fetch_calendar(_doc):
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(
                f"https://github.com/users/{GITHUB_USERNAME}/contributions",
                headers={"User-Agent": API_HEADERS["User-Agent"]},
            )
        resp.raise_for_status()
        body = parse_calendar(resp.text)
        await cache.replace_one(
            {"_id": "calendar"},
            {"_id": "calendar", "body": body, "checked_at": datetime.now(timezone.utc).isoformat()},
            upsert=True,
        )
        return body

    async def commit_for(client: httpx.AsyncClient, repo: str, sha: str) -> dict | None:
        key = f"commit:{sha}"
        doc = await cache.find_one({"_id": key})
        if doc:
            return doc["body"]
        resp = await client.get(f"https://api.github.com/repos/{repo}/commits/{sha}", headers=API_HEADERS)
        if resp.status_code in (404, 409, 422):  # force-pushed away or empty repo: skip it for good
            body = None
        else:
            resp.raise_for_status()
            body = shape_commit(repo, resp.json())
        await cache.replace_one({"_id": key}, {"_id": key, "body": body}, upsert=True)
        return body

    async def fetch_commits(doc):
        now = datetime.now(timezone.utc).isoformat()
        headers = dict(API_HEADERS)
        if doc and doc.get("etag"):
            headers["If-None-Match"] = doc["etag"]  # a 304 answer does not use up rate limit
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"https://api.github.com/users/{GITHUB_USERNAME}/events/public?per_page=50", headers=headers
            )
            if resp.status_code == 304:
                await cache.update_one({"_id": "commits"}, {"$set": {"checked_at": now}})
                return doc["body"]
            resp.raise_for_status()
            commits, seen = [], set()
            for event in resp.json():
                sha = event.get("payload", {}).get("head")
                if event.get("type") != "PushEvent" or not sha or sha in seen:
                    continue
                seen.add(sha)
                commit = await commit_for(client, event["repo"]["name"], sha)
                if commit:
                    commits.append(commit)
                if len(commits) == COMMITS_SHOWN:
                    break
        await cache.replace_one(
            {"_id": "commits"},
            {"_id": "commits", "body": commits, "etag": resp.headers.get("etag"), "checked_at": now},
            upsert=True,
        )
        return commits

    @router.get("/github/activity")
    async def github_activity():
        calendar, commits = await asyncio.gather(
            refreshed("calendar", CALENDAR_MAX_AGE, fetch_calendar),
            refreshed("commits", EVENTS_MAX_AGE, fetch_commits),
        )
        if calendar is None and commits is None:
            raise HTTPException(status_code=503, detail="GitHub activity is unavailable right now")
        return {
            "username": GITHUB_USERNAME,
            "profile_url": f"https://github.com/{GITHUB_USERNAME}",
            "calendar": calendar,
            "commits": commits or [],
        }

    return router

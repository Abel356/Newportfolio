"""Regression tests for visit analytics. Run: cd /app/backend && python -m pytest tests -q"""
import os
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

os.environ.setdefault("JWT_SECRET", "test-secret")

import analytics  # noqa: E402

NOW = datetime(2026, 11, 20, 18, 0, tzinfo=timezone.utc)
IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148 Safari/604.1"
MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0 Safari/537.36"


def visit(sid, minutes_ago, **kw):
    ts = (NOW - timedelta(minutes=minutes_ago)).replace(tzinfo=None)  # Mongo returns naive UTC
    base = {"_id": sid, "ts": ts, "last_seen": ts, "visitor": sid, "source": "Direct link",
            "country": "Canada", "device": "Computer", "reached": ["top"], "dwell": {}}
    return {**base, **kw}


def test_source_labels():
    own = "abel.example.com"
    assert analytics.source_for("", "", own) == "Direct link"
    assert analytics.source_for("https://abel.example.com/admin", "", own) == "Direct link"
    assert analytics.source_for("https://www.linkedin.com/feed/", "", own) == "LinkedIn"
    assert analytics.source_for("https://lnkd.in/abc", "", own) == "LinkedIn"
    assert analytics.source_for("https://github.com/Abel356", "", own) == "GitHub"
    assert analytics.source_for("https://www.google.com/", "", own) == "Search"
    assert analytics.source_for("https://news.example.org/post", "", own) == "news.example.org"
    assert analytics.source_for("", "linkedin", own) == "LinkedIn"  # ?ref= tag wins when there is no referrer


def test_device_and_bots():
    assert analytics.device_for(IPHONE) == "Phone"
    assert analytics.device_for(MAC) == "Computer"
    assert analytics.device_for("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)") == "Tablet"
    for bot in ["Googlebot/2.1", "python-requests/2.31", "curl/8.0", "HeadlessChrome/126", "LinkedInBot/1.0"]:
        assert analytics._BOT.search(bot), bot
    assert not analytics._BOT.search(MAC) and not analytics._BOT.search(IPHONE)


def test_country_lookup_is_local_and_safe():
    assert analytics.country_for("8.8.8.8") == "United States"
    assert analytics.country_for("10.0.0.1") == "Unknown"
    assert analytics.country_for("not-an-ip") == "Unknown"


def test_fingerprint_same_day_stable_and_changes_next_day():
    a = analytics.visitor_fingerprint("1.2.3.4", MAC, NOW)
    assert a == analytics.visitor_fingerprint("1.2.3.4", MAC, NOW + timedelta(hours=2))
    assert a != analytics.visitor_fingerprint("1.2.3.4", MAC, NOW + timedelta(days=1))
    assert a != analytics.visitor_fingerprint("1.2.3.5", MAC, NOW)
    assert "1.2.3.4" not in a


def test_summary_numbers():
    visits = [
        visit("a", 0, reached=["top", "notes", "projects"], dwell={"top": 10, "notes": 20, "projects": 60}, source="LinkedIn"),
        visit("b", 30, dwell={"top": 4}, device="Phone"),                    # bounce: under 10s, never scrolled
        visit("c", 60 * 24 * 3, reached=["top", "notes"], dwell={"top": 5, "notes": 25}, visitor="a"),
        visit("d", 60 * 24 * 20, dwell={"top": 30}, country="India"),
    ]
    clicks = [{"sid": "a", "name": "Book a call"}, {"sid": "a", "name": "Repo: Triage"}, {"sid": "c", "name": "Repo: Triage"}]
    s = analytics.summarise(visits, clicks, NOW, ZoneInfo("America/Toronto"))

    assert s["live_now"] == 1                       # only "a" was seen in the last 45 seconds
    assert s["today"] == {"visits": 2, "visitors": 2}
    assert s["week"] == {"visits": 3, "visitors": 2}  # "c" is the same person as "a"
    assert s["month"] == {"visits": 4, "visitors": 3}
    assert len(s["daily"]) == 30 and sum(d["visits"] for d in s["daily"]) == 4 and s["daily"][-1]["visits"] == 2
    assert sum(map(sum, s["when"])) == 4 and s["when"][4][13] == 1   # Fri 18:00 UTC is 13:00 in Toronto
    assert s["bounce_pct"] == 25 and s["booked_pct"] == 25
    assert s["avg_seconds"] == round((90 + 4 + 30 + 30) / 4)
    by_id = {x["id"]: x for x in s["sections"]}
    assert by_id["top"]["reached_pct"] == 100 and by_id["notes"]["reached_pct"] == 50 and by_id["projects"]["reached_pct"] == 25
    assert by_id["projects"]["avg_seconds"] == 15.0 and by_id["contact"]["avg_seconds"] == 0
    assert s["clicks"][0] == {"label": "Repo: Triage", "count": 2}
    assert s["sources"][0] == {"label": "Direct link", "count": 3}
    assert s["recent"][0]["furthest"] == "Projects" and s["recent"][0]["seconds"] == 90


def test_summary_with_no_visits():
    s = analytics.summarise([], [], NOW, timezone.utc)
    assert s["month"] == {"visits": 0, "visitors": 0} and s["bounce_pct"] == 0 and s["recent"] == []

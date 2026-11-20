"""Regression tests for the GitHub activity block. Run: cd /app/backend && python -m pytest tests -q"""
import os
from pathlib import Path

os.environ.setdefault("GITHUB_USERNAME", "Abel356")

from github_activity import parse_calendar, shape_commit  # noqa: E402
import pytest  # noqa: E402

FIXTURE = (Path(__file__).parent / "contributions_fixture.html").read_text()


def test_calendar_parses_real_page():
    cal = parse_calendar(FIXTURE)
    assert cal["total"] == 695
    assert 364 <= len(cal["days"]) <= 372
    assert cal["days"] == sorted(cal["days"], key=lambda d: d["date"])
    assert all(0 <= d["level"] <= 4 and d["count"] >= 0 for d in cal["days"])
    # a day with level 0 has no contributions, and the reverse
    assert all((d["level"] == 0) == (d["count"] == 0) for d in cal["days"])
    assert sum(d["count"] for d in cal["days"]) == 695


def test_calendar_rejects_changed_markup():
    with pytest.raises(ValueError):
        parse_calendar("<html><body>GitHub changed this page</body></html>")


def test_commit_keeps_first_line_and_drops_author_details():
    raw = {
        "sha": "e382f56dfb7f37ff8d93a827b22d62f4471616a4",
        "html_url": "https://github.com/Abel356/CareTrace/commit/e382f56",
        "commit": {
            "message": "Add PRD\n\nLonger body that should not be shown",
            "author": {"name": "Someone", "email": "private@example.com", "date": "2026-11-19T23:09:55Z"},
        },
    }
    out = shape_commit("Abel356/CareTrace", raw)
    assert out == {
        "sha": "e382f56",
        "message": "Add PRD",
        "repo": "CareTrace",
        "url": "https://github.com/Abel356/CareTrace/commit/e382f56",
        "date": "2026-11-19T23:09:55Z",
    }
    assert "private@example.com" not in str(out)

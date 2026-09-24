from django.contrib import admin
from django.template.response import TemplateResponse

from analytics.stats import TREND_DAYS, daily_trend, summarize

PERIODS = [(None, "전체 기간"), (30, "최근 30일"), (7, "최근 7일"), (1, "최근 24시간")]


def stats_view(request):
    """관리자 통계 화면. 로그인한 스태프만 볼 수 있다(urls.py에서 admin_view로 감싼다)."""
    try:
        days = int(request.GET.get("days", ""))
    except ValueError:
        days = None
    if days not in {d for d, _ in PERIODS}:
        days = None

    summary = summarize(days)
    survey = [
        ("성별", summary["genders"]),
        ("연령대", summary["age_ranges"]),
        ("가 보고 싶은 곳", summary["countries"]),
    ]
    context = {
        **admin.site.each_context(request),
        "title": "반응 통계",
        "periods": [{"days": d, "label": label, "active": d == days} for d, label in PERIODS],
        "s": summary,
        "survey": [
            {"title": title, "rows": _with_share(rows, summary["signups"])} for title, rows in survey
        ],
        "clicks": _with_share(summary["clicks_by_label"], summary["cta_clicks"]),
        "trend": daily_trend(),
        "trend_days": TREND_DAYS,
    }
    return TemplateResponse(request, "analytics/stats.html", context)


def _with_share(rows, total):
    """막대 길이를 위해 각 항목의 비율(%)을 붙인다."""
    return [{**row, "pct": round(row["n"] / total * 100) if total else 0} for row in rows]

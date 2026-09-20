"""반응 요약 집계. `stats` 명령과 관리자 통계 화면이 함께 쓴다."""

from collections import Counter
from datetime import datetime, time, timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone

from analytics.models import Event
from signups.models import PreRegistration

TREND_DAYS = 14


def rate(part, whole):
    return f"{part / whole * 100:.1f}%" if whole else "-"


def _ranked(counter, labels):
    return [{"label": labels.get(code, code), "n": n} for code, n in counter.most_common()]


def _choice_counts(signups, field, choices):
    counts = dict(signups.exclude(**{field: ""}).values_list(field).annotate(n=Count("id")))
    return [{"label": label, "n": counts[code]} for code, label in choices if counts.get(code)]


def summarize(days=None):
    events = Event.objects.all()
    signups = PreRegistration.objects.all()
    period = "전체 기간"
    if days:
        since = timezone.now() - timedelta(days=days)
        events = events.filter(created_at__gte=since)
        signups = signups.filter(created_at__gte=since)
        period = f"최근 {days}일"

    page_views = events.filter(event_type=Event.Type.PAGE_VIEW)
    cta_clicks = events.filter(event_type=Event.Type.CTA_CLICK)
    visitors = page_views.values("visitor_id").distinct().count()
    clickers = cta_clicks.values("visitor_id").distinct().count()
    signup_count = signups.count()

    countries, features = Counter(), Counter()
    for row in signups.values("countries", "features"):
        countries.update(row["countries"])
        features.update(row["features"])

    return {
        "period": period,
        "visitors": visitors,
        "page_views": page_views.count(),
        "cta_clicks": cta_clicks.count(),
        "clickers": clickers,
        "click_rate": rate(clickers, visitors),
        "signups": signup_count,
        "signup_rate": rate(signup_count, visitors),
        "clicks_by_label": [
            {"label": row["label"] or "(없음)", "n": row["n"]}
            for row in cta_clicks.values("label").annotate(n=Count("id")).order_by("-n")
        ],
        "age_ranges": _choice_counts(signups, "age_range", PreRegistration.AgeRange.choices),
        "countries": _ranked(countries, PreRegistration.COUNTRY_CHOICES),
        "stay_types": _choice_counts(signups, "stay_type", PreRegistration.StayType.choices),
        "timings": _choice_counts(signups, "timing", PreRegistration.Timing.choices),
        "features": _ranked(features, PreRegistration.FEATURE_CHOICES),
        "budgets": _choice_counts(signups, "budget_range", PreRegistration.Budget.choices),
    }


def daily_trend(days=TREND_DAYS):
    """최근 N일의 날짜별 방문자 수와 가입 수 (서울 시간 기준)."""
    today = timezone.localdate()
    start = today - timedelta(days=days - 1)
    since = timezone.make_aware(datetime.combine(start, time.min))

    visitors = dict(
        Event.objects.filter(event_type=Event.Type.PAGE_VIEW, created_at__gte=since)
        .annotate(day=TruncDate("created_at"))
        .values_list("day")
        .annotate(n=Count("visitor_id", distinct=True))
    )
    signups = dict(
        PreRegistration.objects.filter(created_at__gte=since)
        .annotate(day=TruncDate("created_at"))
        .values_list("day")
        .annotate(n=Count("id"))
    )
    rows = []
    for offset in range(days):
        day = start + timedelta(days=offset)
        v, s = visitors.get(day, 0), signups.get(day, 0)
        rows.append({"day": day, "visitors": v, "signups": s, "signup_rate": rate(s, v)})
    return rows

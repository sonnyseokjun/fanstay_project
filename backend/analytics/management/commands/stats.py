from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db.models import Count
from django.utils import timezone

from analytics.models import Event
from signups.models import PreRegistration


class Command(BaseCommand):
    help = "방문자 수, 사전가입 버튼 클릭 수, 사전가입 수를 요약해 출력한다."

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, help="최근 N일만 집계 (생략 시 전체 기간)")

    def handle(self, *args, days=None, **options):
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

        def rate(part, whole):
            return f"{part / whole * 100:.1f}%" if whole else "-"

        self.stdout.write(f"[FANSTAY 반응 요약 · {period}]")
        self.stdout.write(f"방문자 수(중복 제거)      {visitors}")
        self.stdout.write(f"페이지 조회 수            {page_views.count()}")
        self.stdout.write(f"사전가입 버튼 클릭 수     {cta_clicks.count()}  (클릭한 방문자 {clickers}, {rate(clickers, visitors)})")
        self.stdout.write(f"사전가입 완료 수          {signup_count}  (방문자 대비 {rate(signup_count, visitors)})")

        by_label = cta_clicks.values("label").annotate(n=Count("id")).order_by("-n")
        if by_label:
            self.stdout.write("\n버튼 위치별 클릭 수")
            for row in by_label:
                self.stdout.write(f"  {row['label'] or '(없음)':<12} {row['n']}")

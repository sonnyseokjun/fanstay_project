from django.core.management.base import BaseCommand

from analytics.stats import summarize


class Command(BaseCommand):
    help = "방문자 수, 사전가입 버튼 클릭 수, 사전가입 수를 요약해 출력한다."

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, help="최근 N일만 집계 (생략 시 전체 기간)")

    def handle(self, *args, days=None, **options):
        s = summarize(days)
        self.stdout.write(f"[FANSTAY 반응 요약 · {s['period']}]")
        self.stdout.write(f"방문자 수(중복 제거)      {s['visitors']}")
        self.stdout.write(f"페이지 조회 수            {s['page_views']}")
        self.stdout.write(
            f"사전가입 버튼 클릭 수     {s['cta_clicks']}  (클릭한 방문자 {s['clickers']}, {s['click_rate']})"
        )
        self.stdout.write(f"사전가입 완료 수          {s['signups']}  (방문자 대비 {s['signup_rate']})")

        if s["clicks_by_label"]:
            self.stdout.write("\n버튼 위치별 클릭 수")
            for row in s["clicks_by_label"]:
                self.stdout.write(f"  {row['label']:<12} {row['n']}")

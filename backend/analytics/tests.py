import json
from io import StringIO

from django.contrib.auth.models import User
from django.core.cache import cache
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APITestCase

from signups.models import PreRegistration

from .models import Event

URL = "/api/events/"


class EventApiTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_records_json_event(self):
        res = self.client.post(
            URL, {"event_type": "cta_click", "visitor_id": "v1", "label": "hero"}, format="json"
        )
        self.assertEqual(res.status_code, 204)
        self.assertEqual(Event.objects.get().label, "hero")

    def test_accepts_send_beacon_text_plain(self):
        body = json.dumps({"event_type": "page_view", "visitor_id": "v1"})
        res = self.client.post(URL, body, content_type="text/plain;charset=UTF-8")
        self.assertEqual(res.status_code, 204)

    def test_rejects_unknown_event(self):
        res = self.client.post(URL, {"event_type": "scroll", "visitor_id": "v1"}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_stats_command_counts_unique_visitors(self):
        for visitor in ["v1", "v1", "v2"]:
            Event.objects.create(event_type="page_view", visitor_id=visitor)
        Event.objects.create(event_type="cta_click", visitor_id="v1", label="hero")
        out = StringIO()
        call_command("stats", stdout=out)
        self.assertRegex(out.getvalue(), r"방문자 수\(중복 제거\)\s+2")
        self.assertRegex(out.getvalue(), r"사전가입 버튼 클릭 수\s+1")


class AdminStatsViewTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_superuser("staff", "staff@example.com", "pw-for-tests-only")

    def test_requires_staff_login(self):
        res = self.client.get("/admin/stats/")
        self.assertEqual(res.status_code, 302)
        self.assertIn("/admin/login/", res["Location"])

    def test_shows_summary_and_survey(self):
        Event.objects.create(event_type="page_view", visitor_id="v1")
        Event.objects.create(event_type="page_view", visitor_id="v2")
        Event.objects.create(event_type="cta_click", visitor_id="v1", label="hero")
        PreRegistration.objects.create(
            email="a@example.com", consent=True,
            countries="태국, 일본", budget_range="150_200", stay_type="remote_work",
        )
        self.client.force_login(self.staff)
        res = self.client.get("/admin/stats/?days=7")
        self.assertEqual(res.status_code, 200)
        s = res.context["s"]
        self.assertEqual((s["visitors"], s["cta_clicks"], s["signups"]), (2, 1, 1))
        self.assertEqual(s["signup_rate"], "50.0%")
        self.assertContains(res, "태국")
        self.assertContains(res, "150~200만 원")
        self.assertContains(res, "원격근무·프리랜서")

    def test_ignores_unknown_period(self):
        self.client.force_login(self.staff)
        res = self.client.get("/admin/stats/?days=abc")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.context["s"]["period"], "전체 기간")

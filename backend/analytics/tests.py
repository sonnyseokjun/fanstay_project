import json
from io import StringIO

from django.core.cache import cache
from django.core.management import call_command
from rest_framework.test import APITestCase

from .models import Event

URL = "/api/events/"


class EventApiTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_records_json_event(self):
        res = self.client.post(
            URL, {"event_type": "cta_click", "visitor_id": "v1", "label": "hero", "language": "zh"}, format="json"
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

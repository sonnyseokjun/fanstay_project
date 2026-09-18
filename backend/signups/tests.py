from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import PreRegistration

URL = "/api/signups/"


class PreRegistrationApiTests(APITestCase):
    def setUp(self):
        cache.clear()

    def payload(self, **overrides):
        data = {
            "contact_type": "email",
            "contact": "Test@Example.com",
            "name": "小林",
            "age_range": "25_29",
            "city": "上海",
            "visit_timing": "3_6_months",
            "stay_days": 45,
            "interest_areas": ["seongsu", "hannam"],
            "interest_services": ["k_beauty", "cooking_class"],
            "budget_range": "8k_12k",
            "consent": True,
            "language": "zh",
        }
        data.update(overrides)
        return data

    def test_creates_signup_and_returns_position(self):
        res = self.client.post(URL, self.payload(), format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.json(), {"position": 1, "created": True})
        signup = PreRegistration.objects.get()
        self.assertEqual(signup.contact, "test@example.com")
        self.assertEqual(signup.interest_areas, ["seongsu", "hannam"])

    def test_contact_only_is_enough(self):
        res = self.client.post(
            URL, {"contact_type": "wechat", "contact": "fanstay_fan", "consent": True}, format="json"
        )
        self.assertEqual(res.status_code, 201)

    def test_duplicate_contact_returns_existing_position(self):
        self.client.post(URL, self.payload(), format="json")
        self.client.post(URL, self.payload(contact="second@example.com"), format="json")
        res = self.client.post(URL, self.payload(contact="TEST@example.com "), format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"position": 1, "created": False})
        self.assertEqual(PreRegistration.objects.count(), 2)

    def test_requires_consent(self):
        res = self.client.post(URL, self.payload(consent=False), format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("consent", res.json())

    def test_rejects_invalid_contact(self):
        res = self.client.post(URL, self.payload(contact="not-an-email"), format="json")
        self.assertEqual(res.status_code, 400)
        res = self.client.post(URL, self.payload(contact_type="wechat", contact="a b"), format="json")
        self.assertEqual(res.status_code, 400)

    def test_rejects_unknown_choices(self):
        res = self.client.post(URL, self.payload(interest_areas=["busan"]), format="json")
        self.assertEqual(res.status_code, 400)
        res = self.client.post(URL, self.payload(stay_days=0), format="json")
        self.assertEqual(res.status_code, 400)

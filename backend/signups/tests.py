from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import PreRegistration

URL = "/api/signups/"


class PreRegistrationApiTests(APITestCase):
    def setUp(self):
        cache.clear()

    def payload(self, **overrides):
        data = {
            "email": "Test@Example.com",
            "gender": "female",
            "age_range": "25_29",
            "countries": "제주, 일본",
            "consent": True,
            "visitor_id": "v1",
        }
        data.update(overrides)
        return data

    def test_creates_signup_and_returns_position(self):
        res = self.client.post(URL, self.payload(), format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.json(), {"position": 1, "created": True})
        signup = PreRegistration.objects.get()
        self.assertEqual(signup.email, "test@example.com")
        self.assertEqual((signup.gender, signup.age_range, signup.countries), ("female", "25_29", "제주, 일본"))

    def test_email_and_consent_are_enough(self):
        res = self.client.post(URL, {"email": "solo@example.com", "consent": True}, format="json")
        self.assertEqual(res.status_code, 201)

    def test_duplicate_email_returns_existing_position(self):
        self.client.post(URL, self.payload(), format="json")
        self.client.post(URL, self.payload(email="second@example.com"), format="json")
        res = self.client.post(URL, self.payload(email="TEST@example.com "), format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"position": 1, "created": False})
        self.assertEqual(PreRegistration.objects.count(), 2)

    def test_requires_consent(self):
        res = self.client.post(URL, self.payload(consent=False), format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("consent", res.json())

    def test_rejects_invalid_email(self):
        res = self.client.post(URL, self.payload(email="not-an-email"), format="json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()["email"], ["invalid_email"])

    def test_rejects_unknown_choices(self):
        res = self.client.post(URL, self.payload(gender="other"), format="json")
        self.assertEqual(res.status_code, 400)

    def test_trims_country_text(self):
        self.client.post(URL, self.payload(countries="  베트남  "), format="json")
        self.assertEqual(PreRegistration.objects.get().countries, "베트남")

    def test_ignores_removed_fields(self):
        """이름·설문은 더 이상 받지 않는다. 예전 화면이 보내도 저장하지 않는다."""
        res = self.client.post(URL, self.payload(name="김팬스", budget_range="150_200", features=["escrow"]), format="json")
        self.assertEqual(res.status_code, 201)
        signup = PreRegistration.objects.get()
        self.assertEqual((signup.name, signup.budget_range, signup.features), ("", "", []))

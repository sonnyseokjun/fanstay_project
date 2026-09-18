import re

from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import PreRegistration

WECHAT_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{5,40}$")


class PreRegistrationSerializer(serializers.ModelSerializer):
    interest_areas = serializers.ListField(
        child=serializers.ChoiceField(choices=PreRegistration.AREA_CHOICES),
        required=False,
        max_length=len(PreRegistration.AREA_CHOICES),
    )
    interest_services = serializers.ListField(
        child=serializers.ChoiceField(choices=PreRegistration.SERVICE_CHOICES),
        required=False,
        max_length=len(PreRegistration.SERVICE_CHOICES),
    )
    stay_days = serializers.IntegerField(required=False, allow_null=True, min_value=1, max_value=365)

    class Meta:
        model = PreRegistration
        fields = [
            "contact_type",
            "contact",
            "name",
            "age_range",
            "city",
            "visit_timing",
            "stay_days",
            "interest_areas",
            "interest_services",
            "budget_range",
            "consent",
            "language",
            "visitor_id",
        ]
        # 중복 연락처는 에러 대신 기존 가입을 돌려주므로 모델 유니크 검증은 뷰에서 처리한다.
        validators = []

    def validate_consent(self, value):
        if value is not True:
            raise serializers.ValidationError("consent_required")
        return value

    def validate_interest_areas(self, value):
        return list(dict.fromkeys(value))

    def validate_interest_services(self, value):
        return list(dict.fromkeys(value))

    def validate(self, attrs):
        contact_type = attrs.get("contact_type")
        contact = attrs.get("contact", "").strip()

        if contact_type == PreRegistration.ContactType.EMAIL:
            contact = contact.lower()
            try:
                validate_email(contact)
            except DjangoValidationError:
                raise serializers.ValidationError({"contact": "invalid_email"})
        elif contact_type == PreRegistration.ContactType.WECHAT:
            if not WECHAT_ID_PATTERN.match(contact):
                raise serializers.ValidationError({"contact": "invalid_wechat"})

        attrs["contact"] = contact
        return attrs

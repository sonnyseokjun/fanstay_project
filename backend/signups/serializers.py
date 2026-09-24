from rest_framework import serializers

from .models import PreRegistration


class PreRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=254, error_messages={"invalid": "invalid_email", "blank": "invalid_email"})

    class Meta:
        model = PreRegistration
        # 이름·설문 4개는 2026-09-24부터 받지 않는다(보내도 무시된다).
        fields = [
            "email",
            "gender",
            "age_range",
            "countries",
            "consent",
            "visitor_id",
        ]

    def validate_email(self, value):
        return value.strip().lower()

    def validate_consent(self, value):
        if value is not True:
            raise serializers.ValidationError("consent_required")
        return value

    def validate_countries(self, value):
        return value.strip()

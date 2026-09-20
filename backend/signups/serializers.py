from rest_framework import serializers

from .models import PreRegistration


class PreRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=254, error_messages={"invalid": "invalid_email", "blank": "invalid_email"})
    countries = serializers.ListField(
        child=serializers.ChoiceField(choices=list(PreRegistration.COUNTRY_CHOICES)),
        required=False,
        max_length=len(PreRegistration.COUNTRY_CHOICES),
    )
    features = serializers.ListField(
        child=serializers.ChoiceField(choices=list(PreRegistration.FEATURE_CHOICES)),
        required=False,
        max_length=len(PreRegistration.FEATURE_CHOICES),
    )

    class Meta:
        model = PreRegistration
        fields = [
            "email",
            "name",
            "age_range",
            "countries",
            "stay_type",
            "timing",
            "features",
            "budget_range",
            "consent",
            "visitor_id",
        ]

    def validate_email(self, value):
        return value.strip().lower()

    def validate_name(self, value):
        return value.strip()

    def validate_consent(self, value):
        if value is not True:
            raise serializers.ValidationError("consent_required")
        return value

    def validate_countries(self, value):
        return list(dict.fromkeys(value))

    def validate_features(self, value):
        return list(dict.fromkeys(value))

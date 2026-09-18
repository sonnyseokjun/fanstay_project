from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["event_type", "visitor_id", "label", "language", "path", "referrer"]

    def validate_referrer(self, value):
        return value[:500]

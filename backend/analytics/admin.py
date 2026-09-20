from django.contrib import admin

from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["id", "event_type", "label", "visitor_id", "created_at"]
    list_filter = ["event_type", "label"]
    readonly_fields = ["created_at"]

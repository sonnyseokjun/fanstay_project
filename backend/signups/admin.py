from django.contrib import admin

from .models import PreRegistration


@admin.register(PreRegistration)
class PreRegistrationAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "contact_type",
        "contact",
        "name",
        "age_range",
        "city",
        "visit_timing",
        "stay_days",
        "budget_range",
        "language",
        "created_at",
    ]
    list_filter = ["contact_type", "age_range", "visit_timing", "budget_range", "language"]
    search_fields = ["contact", "name", "city"]
    readonly_fields = ["created_at"]

from django.contrib import admin

from .models import PreRegistration


@admin.register(PreRegistration)
class PreRegistrationAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "name", "age_range", "countries", "stay_type", "timing", "budget_range", "created_at"]
    list_filter = ["age_range", "stay_type", "timing", "budget_range"]
    search_fields = ["email", "name"]
    readonly_fields = ["created_at"]

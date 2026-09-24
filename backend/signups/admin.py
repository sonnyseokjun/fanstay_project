from django.contrib import admin

from .models import PreRegistration


@admin.register(PreRegistration)
class PreRegistrationAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "gender", "age_range", "countries", "created_at"]
    list_filter = ["gender", "age_range"]
    search_fields = ["email", "countries"]
    readonly_fields = ["created_at"]

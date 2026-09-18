from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

from analytics.views import EventCreateView
from signups.views import PreRegistrationCreateView

admin.site.site_header = "HANSTAY 사전가입 관리"
admin.site.site_title = "HANSTAY 관리"


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/signups/", PreRegistrationCreateView.as_view()),
    path("api/events/", EventCreateView.as_view()),
]

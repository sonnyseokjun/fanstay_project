from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

from analytics.views import EventCreateView
from analytics.views_admin import stats_view
from signups.views import PreRegistrationCreateView

admin.site.site_header = "한달다움 사전가입 관리"
admin.site.site_title = "한달다움 관리"
admin.site.index_template = "admin/fanstay_index.html"


def health(request):
    return JsonResponse({"status": "ok"})


# 사이트 화면(index.html, /assets/...)은 URL이 아니라 WhiteNoise가 frontend 빌드 폴더에서 바로 제공한다.
urlpatterns = [
    path("admin/stats/", admin.site.admin_view(stats_view), name="admin-stats"),
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/signups/", PreRegistrationCreateView.as_view()),
    path("api/events/", EventCreateView.as_view()),
]

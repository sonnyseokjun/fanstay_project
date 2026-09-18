from django.db import models


class Event(models.Model):
    """랜딩 페이지 반응 측정용 이벤트. 개인정보는 저장하지 않는다.

    visitor_id는 브라우저에서 만든 무작위 ID로, 방문자 수(중복 제거) 계산에만 쓴다.
    """

    class Type(models.TextChoices):
        PAGE_VIEW = "page_view", "페이지 방문"
        CTA_CLICK = "cta_click", "사전가입 버튼 클릭"

    event_type = models.CharField("이벤트", max_length=20, choices=Type.choices)
    visitor_id = models.CharField("방문자 ID", max_length=64)
    label = models.CharField("버튼 위치", max_length=40, blank=True)
    language = models.CharField("언어", max_length=2, blank=True)
    path = models.CharField("경로", max_length=200, blank=True)
    referrer = models.CharField("유입 경로", max_length=500, blank=True)
    created_at = models.DateTimeField("발생 일시", auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = "이벤트"
        verbose_name_plural = "이벤트 목록"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["event_type", "visitor_id"])]

    def __str__(self):
        return f"{self.event_type} {self.label or ''}".strip()

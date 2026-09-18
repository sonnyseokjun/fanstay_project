from django.db import models


class PreRegistration(models.Model):
    """사전가입 1건. 연락처는 필수, 설문 항목은 모두 선택."""

    class ContactType(models.TextChoices):
        EMAIL = "email", "이메일"
        WECHAT = "wechat", "위챗 ID"

    class AgeRange(models.TextChoices):
        UNDER_20 = "under_20", "20세 미만"
        AGE_20_24 = "20_24", "20~24세"
        AGE_25_29 = "25_29", "25~29세"
        AGE_30_34 = "30_34", "30~34세"
        AGE_35_39 = "35_39", "35~39세"
        AGE_40_PLUS = "40_plus", "40세 이상"

    class VisitTiming(models.TextChoices):
        WITHIN_1_MONTH = "within_1_month", "1개월 이내"
        MONTHS_1_3 = "1_3_months", "1~3개월 후"
        MONTHS_3_6 = "3_6_months", "3~6개월 후"
        MONTHS_6_12 = "6_12_months", "6~12개월 후"
        UNDECIDED = "undecided", "미정"

    class BudgetRange(models.TextChoices):
        UNDER_5K = "under_5k", "¥5,000 미만"
        CNY_5K_8K = "5k_8k", "¥5,000~8,000"
        CNY_8K_12K = "8k_12k", "¥8,000~12,000"
        CNY_12K_16K = "12k_16k", "¥12,000~16,000"
        OVER_16K = "over_16k", "¥16,000 이상"
        NOT_SURE = "not_sure", "잘 모르겠음"

    class Language(models.TextChoices):
        ZH = "zh", "중국어 간체"
        KO = "ko", "한국어"

    AREA_CHOICES = ["seongsu", "hongdae", "gangnam", "hannam"]
    SERVICE_CHOICES = [
        "k_beauty",
        "hair_salon",
        "fitness",
        "spa_wellness",
        "cooking_class",
        "local_community",
        "airport_transfer",
        "sim_data",
        "cleaning_laundry",
        "medical_support",
    ]

    contact_type = models.CharField("연락처 종류", max_length=10, choices=ContactType.choices)
    contact = models.CharField("연락처", max_length=254)
    name = models.CharField("이름", max_length=50, blank=True)
    age_range = models.CharField("연령대", max_length=20, choices=AgeRange.choices, blank=True)
    city = models.CharField("거주 도시", max_length=50, blank=True)

    visit_timing = models.CharField("예상 방한 시기", max_length=20, choices=VisitTiming.choices, blank=True)
    stay_days = models.PositiveSmallIntegerField("희망 체류 기간(일)", null=True, blank=True)
    interest_areas = models.JSONField("관심 지역", default=list, blank=True)
    interest_services = models.JSONField("관심 서비스", default=list, blank=True)
    budget_range = models.CharField("30일 패키지 지불 의향", max_length=20, choices=BudgetRange.choices, blank=True)

    consent = models.BooleanField("개인정보 수집 동의", default=False)
    language = models.CharField("가입 시 언어", max_length=2, choices=Language.choices, default=Language.ZH)
    visitor_id = models.CharField("방문자 ID", max_length=64, blank=True)
    created_at = models.DateTimeField("가입 일시", auto_now_add=True)

    class Meta:
        verbose_name = "사전가입"
        verbose_name_plural = "사전가입 목록"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["contact_type", "contact"], name="unique_contact"),
        ]

    def __str__(self):
        return f"#{self.pk} {self.contact}"

    @property
    def position(self):
        """대기 순번: 이 가입자보다 먼저(또는 같이) 가입한 인원 수."""
        return PreRegistration.objects.filter(pk__lte=self.pk).count()

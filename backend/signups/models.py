from django.db import models


class PreRegistration(models.Model):
    """사전가입 1건. 이메일과 동의만 필수, 나머지는 모두 선택.

    선택지 코드는 frontend/src/content/ko.ts의 value와 같아야 한다.
    2026-09-24부터 폼에서 받는 항목: 이메일, 성별, 연령대, 가 보고 싶은 곳, 동의.
    이름과 설문 4개(체류 형태·이용 시기·관심 기능·한 달 예산)는 받지 않지만,
    이미 저장된 답을 지우지 않으려고 칸은 남겨 둔다.
    """

    class Gender(models.TextChoices):
        FEMALE = "female", "여성"
        MALE = "male", "남성"
        NO_ANSWER = "no_answer", "밝히지 않음"

    class AgeRange(models.TextChoices):
        UNDER_20 = "under_20", "20세 미만"
        AGE_20_24 = "20_24", "20~24세"
        AGE_25_29 = "25_29", "25~29세"
        AGE_30_34 = "30_34", "30~34세"
        AGE_35_39 = "35_39", "35~39세"
        AGE_40_49 = "40_49", "40대"
        AGE_50_PLUS = "50_plus", "50대 이상"

    class StayType(models.TextChoices):
        REMOTE_WORK = "remote_work", "원격근무·프리랜서"
        WORKING_HOLIDAY = "working_holiday", "워킹홀리데이·어학연수"
        FAMILY = "family", "가족·자녀 동반"
        LONG_STAY = "long_stay", "은퇴·롱스테이"
        BREAK = "break", "휴직·쉼"
        OTHER = "other", "기타"

    class Timing(models.TextChoices):
        WITHIN_3_MONTHS = "within_3_months", "3개월 안"
        MONTHS_3_6 = "3_6_months", "3~6개월 후"
        MONTHS_6_12 = "6_12_months", "6개월~1년 후"
        AFTER_1_YEAR = "after_1_year", "1년 이후"
        UNDECIDED = "undecided", "아직 모르겠음"

    class Budget(models.TextChoices):
        UNDER_100 = "under_100", "100만 원 미만"
        KRW_100_150 = "100_150", "100~150만 원"
        KRW_150_200 = "150_200", "150~200만 원"
        KRW_200_300 = "200_300", "200~300만 원"
        OVER_300 = "over_300", "300만 원 이상"
        NOT_SURE = "not_sure", "잘 모르겠음"

    FEATURE_CHOICES = {
        "monthly_stay": "월 단위 숙소",
        "escrow": "에스크로 안전 결제",
        "city_match": "도시 추천",
        "cost_estimate": "한 달 비용 계산",
        "checklist": "출국 준비 체크리스트",
        "infra_map": "생활 인프라 지도",
        "community": "체류자 커뮤니티",
        "stay_review": "한 달 거주 후기",
    }

    email = models.EmailField("이메일", max_length=254, unique=True)
    gender = models.CharField("성별", max_length=20, choices=Gender.choices, blank=True)
    age_range = models.CharField("연령대", max_length=20, choices=AgeRange.choices, blank=True)
    countries = models.CharField("가 보고 싶은 곳", max_length=100, blank=True)

    # 2026-09-24 수집 중단. 이전 가입자의 답을 보존하는 용도.
    name = models.CharField("이름", max_length=50, blank=True)
    stay_type = models.CharField("체류 형태", max_length=20, choices=StayType.choices, blank=True)
    timing = models.CharField("이용 시기", max_length=20, choices=Timing.choices, blank=True)
    features = models.JSONField("관심 기능", default=list, blank=True)
    budget_range = models.CharField("한 달 예산", max_length=20, choices=Budget.choices, blank=True)

    consent = models.BooleanField("개인정보 수집·이용 동의", default=False)
    visitor_id = models.CharField("방문자 ID", max_length=64, blank=True)
    created_at = models.DateTimeField("가입 일시", auto_now_add=True)

    class Meta:
        verbose_name = "사전가입"
        verbose_name_plural = "사전가입 목록"
        ordering = ["-created_at"]

    def __str__(self):
        return f"#{self.pk} {self.email}"

    @property
    def position(self):
        """대기 순번: 이 가입까지 몇 번째인지."""
        return PreRegistration.objects.filter(pk__lte=self.pk).count()

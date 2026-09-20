from django.db import migrations, models


class Migration(migrations.Migration):
    """가 보고 싶은 나라: 선택지 목록(JSON) → 직접 입력(문자열).

    사전가입 공개 전 단계라 기존 값은 보존하지 않고 컬럼을 새로 만든다.
    """

    dependencies = [("signups", "0001_initial")]

    operations = [
        migrations.RemoveField(model_name="preregistration", name="countries"),
        migrations.AddField(
            model_name="preregistration",
            name="countries",
            field=models.CharField(blank=True, max_length=100, verbose_name="가 보고 싶은 나라"),
        ),
    ]

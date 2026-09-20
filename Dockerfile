# FANSTAY 백엔드 컨테이너 (Google Cloud Run, 서울 리전)
# Django API(/api)와 관리자(/admin)만 담는다. 사이트 화면은 Firebase Hosting이 제공한다.
#
#   docker build -t fanstay-api .
#   docker run --rm -p 8080:8080 -e DJANGO_SECRET_KEY=local-test -e DJANGO_ALLOWED_HOSTS=localhost fanstay-api
#
# 배포 순서는 docs/deploy.md 참고.

FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_DEBUG=false \
    PORT=8080
WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

# 관리자 페이지 정적 파일 수집. 빌드 전용 임시 키를 쓰고, 실행 시에는 환경변수의 키를 쓴다.
RUN DJANGO_SECRET_KEY=collectstatic-only python manage.py collectstatic --noinput

RUN useradd --create-home --uid 10001 app
USER app

# Cloud Run이 PORT(기본 8080)를 넣어 준다.
CMD ["sh", "-c", "exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT} --workers 2 --threads 4 --timeout 60 --access-logfile - --error-logfile -"]

# FANSTAY 사전가입 사이트 컨테이너 (알리바바 클라우드 Function Compute 커스텀 컨테이너용)
# 사이트 화면(React 빌드)과 API·관리자(Django)를 한 컨테이너, 한 도메인에서 제공한다.
#
#   docker build -t fanstay .
#   docker run --rm -p 9000:9000 -e DJANGO_SECRET_KEY=local-test -e DJANGO_ALLOWED_HOSTS=localhost fanstay
#
# 자세한 배포 순서는 docs/deploy.md 참고.

# 1) 프론트엔드 빌드
FROM node:22-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) Django 실행 이미지
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_DEBUG=false \
    FRONTEND_DIST=/app/frontend_dist \
    PORT=9000
WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend /frontend/dist ./frontend_dist

# 관리자 페이지 정적 파일 수집. 빌드 전용 임시 키를 쓰고, 실행 시에는 환경변수의 키를 쓴다.
RUN DJANGO_SECRET_KEY=collectstatic-only python manage.py collectstatic --noinput

RUN useradd --create-home --uid 10001 app
USER app

# Function Compute 커스텀 컨테이너는 0.0.0.0:9000(기본 포트)으로 요청을 보낸다.
EXPOSE 9000
CMD ["sh", "-c", "exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT} --workers 2 --threads 4 --timeout 60 --access-logfile - --error-logfile -"]

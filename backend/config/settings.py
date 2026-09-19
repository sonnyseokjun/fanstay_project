"""
FANSTAY 사전가입 백엔드 설정.

로컬에서는 환경변수 없이 바로 실행된다(SQLite, DEBUG=True).
배포 시에는 아래 환경변수로 값을 주입한다.

- DJANGO_SECRET_KEY      필수(운영)
- DJANGO_DEBUG           "true" / "false"
- DJANGO_ALLOWED_HOSTS   콤마 구분 (예: "api.fanstay.com")
- CORS_ALLOWED_ORIGINS   콤마 구분 (예: "https://fanstay.com"). 프론트와 API가 같은 도메인이면 불필요
- CSRF_TRUSTED_ORIGINS   콤마 구분 (예: "https://fanstay.com"). 운영 관리자 로그인에 필요
- DATABASE_URL           미지정 시 로컬 SQLite (예: "postgres://user:pass@host:5432/db?sslmode=require")
- FRONTEND_DIST          프론트 빌드 폴더. 있으면 사이트 화면을 이 서버가 함께 제공 (컨테이너에서는 /app/frontend_dist)
"""

import os
from pathlib import Path

import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name, default=""):
    return [item.strip() for item in os.environ.get(name, default).split(",") if item.strip()]


DEBUG = os.environ.get("DJANGO_DEBUG", "true").lower() == "true"

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "")
if not SECRET_KEY:
    if not DEBUG:
        raise RuntimeError("DJANGO_SECRET_KEY must be set when DJANGO_DEBUG is false.")
    SECRET_KEY = "django-insecure-local-dev-only"

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "signups",
    "analytics",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# 서버리스는 요청마다 인스턴스가 바뀔 수 있어 연결을 재사용하지 않는다(conn_max_age=0).
DATABASES = {
    "default": dj_database_url.parse(
        os.environ.get("DATABASE_URL") or f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=0,
    )
}
# Neon 등 연결 풀러(pgbouncer)를 거치는 주소에서도 안전하게 동작하도록 한다.
DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True


AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


LANGUAGE_CODE = "ko-kr"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# 관리자 페이지의 CSS·JS는 WhiteNoise가 제공한다 (collectstatic 필요).
if not DEBUG:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
    }

# 사이트 화면: 프론트 빌드 결과(index.html, /assets/...)를 도메인 루트에서 제공한다.
# 로컬 개발에서는 Vite(5173)를 쓰므로 비워 둔다.
FRONTEND_DIST = os.environ.get("FRONTEND_DIST", "")
if FRONTEND_DIST:
    WHITENOISE_ROOT = FRONTEND_DIST
    WHITENOISE_INDEX_FILE = True
    # /assets/ 파일은 이름에 해시가 붙어 있어 오래 캐시해도 된다.
    WHITENOISE_IMMUTABLE_FILE_TEST = r"^/assets/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# 프론트엔드는 개발 시 Vite 프록시(/api)로 같은 출처에서 호출한다.
# 배포 후 프론트와 API 도메인이 다르면 CORS_ALLOWED_ORIGINS에 프론트 주소를 넣는다.
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS")
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_THROTTLE_RATES": {
        "signup": "20/hour",
        "event": "300/hour",
    },
}

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# 서버리스 환경에서는 표준 출력이 곧 로그다. 운영(DEBUG=false)에서도 오류가 로그에 남도록 한다.
# 오류 알림은 이 로그를 기준으로 건다 (docs/deploy.md 참고).
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"plain": {"format": "{levelname} {name} {message}", "style": "{"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "plain"}},
    "root": {"handlers": ["console"], "level": "WARNING"},
    "loggers": {
        "django": {"handlers": ["console"], "level": "WARNING", "propagate": False},
    },
}

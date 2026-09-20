#!/usr/bin/env bash
# FANSTAY 배포 스크립트 — Cloud Run(서울, API·관리자) + Firebase Hosting(사이트 화면)
#
#   ./deploy.sh secrets   .env.deploy의 SECRET_KEY·DATABASE_URL을 Secret Manager에 등록(처음 1회, 값을 바꿀 때)
#   ./deploy.sh migrate   운영 DB에 테이블 생성·변경 반영 (로컬에서 실행)
#   ./deploy.sh api       백엔드를 Cloud Run에 배포
#   ./deploy.sh web       프론트를 빌드해 Firebase Hosting에 배포
#   ./deploy.sh all       api → web 순서로 모두 배포
#
# 준비: gcloud·firebase CLI 로그인, .env.deploy (deploy.env.example 참고). 자세한 순서는 docs/deploy.md.
set -euo pipefail
cd "$(dirname "$0")"

SERVICE=fanstay-api
REGION=asia-northeast3

if [ ! -f .env.deploy ]; then
  echo "❌ .env.deploy 가 없습니다. cp deploy.env.example .env.deploy 후 값을 채우세요." >&2
  exit 1
fi
set -a
# shellcheck disable=SC1091
source .env.deploy
set +a

require() {
  for name in "$@"; do
    if [ -z "${!name:-}" ]; then
      echo "❌ .env.deploy 에 $name 값이 비어 있습니다." >&2
      exit 1
    fi
  done
}

put_secret() { # 이름, 값 — 없으면 만들고 있으면 새 버전을 추가한다
  if gcloud secrets describe "$1" --project "$GCP_PROJECT" >/dev/null 2>&1; then
    printf '%s' "$2" | gcloud secrets versions add "$1" --data-file=- --project "$GCP_PROJECT"
  else
    printf '%s' "$2" | gcloud secrets create "$1" --data-file=- --replication-policy=automatic --project "$GCP_PROJECT"
  fi
}

deploy_api() {
  require GCP_PROJECT
  echo "▶ Cloud Run 배포 ($SERVICE, $REGION)"
  gcloud run deploy "$SERVICE" \
    --source . \
    --region "$REGION" \
    --project "$GCP_PROJECT" \
    --allow-unauthenticated \
    --min-instances 0 \
    --max-instances 3 \
    --memory 512Mi \
    --cpu 1 \
    --set-env-vars "DJANGO_ALLOWED_HOSTS=.run.app" \
    --set-secrets "DJANGO_SECRET_KEY=fanstay-django-secret:latest,DATABASE_URL=fanstay-database-url:latest"
}

deploy_web() {
  require GCP_PROJECT
  echo "▶ 프론트 빌드"
  (cd frontend && VITE_META_PIXEL_ID="${META_PIXEL_ID:-}" npm run build)
  echo "▶ Firebase Hosting 배포"
  firebase deploy --only hosting --project "$GCP_PROJECT"
}

case "${1:-}" in
  secrets)
    require GCP_PROJECT DJANGO_SECRET_KEY DATABASE_URL
    put_secret fanstay-django-secret "$DJANGO_SECRET_KEY"
    put_secret fanstay-database-url "$DATABASE_URL"
    echo "✅ 비밀값 등록 완료"
    ;;
  migrate)
    require DATABASE_URL
    py=backend/.venv/Scripts/python
    [ -x "$py" ] || py=backend/.venv/bin/python
    echo "▶ 운영 DB migrate"
    (cd backend && "../$py" manage.py migrate)
    ;;
  api) deploy_api ;;
  web) deploy_web ;;
  all) deploy_api && deploy_web ;;
  *)
    echo "사용법: ./deploy.sh [secrets|migrate|api|web|all]" >&2
    exit 1
    ;;
esac

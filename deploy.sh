#!/usr/bin/env bash
# FANSTAY 배포 스크립트: 이미지 빌드 → ACR(홍콩) 업로드 → Function Compute 배포
#
#   ./deploy.sh              현재 커밋으로 빌드해서 배포
#   ./deploy.sh <이미지태그>   이미 올려 둔 이미지로 다시 배포 (롤백)
#
# 준비: .env.deploy (deploy.env.example 참고), docker login, s config add
# 자세한 순서는 docs/deploy.md 참고.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env.deploy ]; then
  echo "❌ .env.deploy 가 없습니다. cp deploy.env.example .env.deploy 후 값을 채우세요." >&2
  exit 1
fi
set -a
# shellcheck disable=SC1091
source .env.deploy
set +a

for name in ACR_IMAGE_REPO DJANGO_SECRET_KEY DJANGO_ALLOWED_HOSTS CSRF_TRUSTED_ORIGINS DATABASE_URL; do
  if [ -z "${!name:-}" ]; then
    echo "❌ .env.deploy 에 $name 값이 비어 있습니다." >&2
    exit 1
  fi
done

if [ $# -ge 1 ]; then
  TAG="$1"
  echo "▶ 기존 이미지로 배포(롤백): $ACR_IMAGE_REPO:$TAG"
else
  if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 커밋하지 않은 변경이 있습니다. 배포할 코드를 먼저 커밋하세요 (이미지 태그 = 커밋 번호)." >&2
    exit 1
  fi
  TAG="$(git rev-parse --short HEAD)"
  echo "▶ 이미지 빌드: $ACR_IMAGE_REPO:$TAG"
  docker build --platform linux/amd64 -t "$ACR_IMAGE_REPO:$TAG" .
  echo "▶ 이미지 업로드"
  docker push "$ACR_IMAGE_REPO:$TAG"
fi

export FANSTAY_IMAGE="$ACR_IMAGE_REPO:$TAG"
echo "▶ Function Compute 배포"
s deploy -y

echo "✅ 배포 완료: $FANSTAY_IMAGE"
echo "   확인: https://${DJANGO_ALLOWED_HOSTS%%,*}/api/health/"

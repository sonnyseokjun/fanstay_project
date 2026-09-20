# FANSTAY 팬스테이 — 사전가입 웹사이트

> 여행 말고, 한 달 살아 보기

## 어떤 서비스인가

**FANSTAY(팬스테이)**는 해외에서 **한 달 살기**를 준비하는 한국인을 위한 **숙소 · 체류정보 · 생활 인프라 통합 플랫폼**입니다.

- **월 단위 전용 숙소:** 28박 이상 매물만 모으고, 보증금·공과금·최소 계약 기간을 계약 전에 보여 줍니다.
- **에스크로 안전 결제:** 대금을 팬스테이가 보관하고, 체크인이 확인된 뒤 호스트에게 정산합니다.
- **도시 추천 · 한 달 비용 계산:** 예산·비자·기후로 도시를 추천하고 한 달 예상 비용을 계산합니다.
- **생활 지도 · 체류자 커뮤니티:** 도시별 유심·병원·코워킹 정보를 모으고, 같은 도시 체류자를 연결합니다.

치앙마이 · 다낭 · 발리 · 후쿠오카 4개 도시부터 시작합니다. 자세한 내용은 [`plan.md`](plan.md)에 있습니다.

## 무엇을 만들었나

정식 서비스 전에 **메타 광고로 들어온 한국인 20~30대가 팬스테이에 얼마나 관심을 보이는지 측정하고 사전가입을 받는 웹사이트**입니다.

- **원페이지 랜딩 (한국어):** 섹션 순서는 다음과 같습니다.
  1. 히어로
  2. 문제 공감
  3. 솔루션(서비스 비교표)
  4. 주요 기능과 첫 도시
  5. 이용 흐름
  6. 4개 도시 한 달 예상 비용
  7. 사전가입
  8. FAQ
- **사전가입 폼**
  - 필수: 이메일, 개인정보 동의
  - 선택: 이름, 연령대, 가 보고 싶은 나라(직접 입력), 체류 형태, 이용 시기, 관심 기능, 한 달 예산
- **가입 완료 화면:** 대기 순번과 친구 공유 버튼. 공유 기능이 없는 브라우저에서는 링크를 복사합니다.
- **반응 측정**
  - 자체 수집: 방문자 수, 사전가입 버튼 클릭 수(위치별), 가입 전환율
  - 메타 픽셀: `PageView`, 가입 완료 시 `Lead`
- **관리 화면:** Django 관리자에서 가입 목록과 **반응 통계 화면**(`/admin/stats/`)을 봅니다. 통계 화면은 전환율, 설문 응답 분포, 최근 14일 추이를 보여 줍니다.
- **디자인 — "한 달 체류 달력"**
  - 히어로의 11월 치앙마이 달력에 체크인부터 체크아웃까지 형광펜이 칠해지고, 날짜마다 생활 일정이 적혀 있습니다.
  - 색은 남색(글자·버튼)과 형광 노랑(강조) 두 가지입니다.
  - 글꼴은 고운바탕(제목)과 Pretendard(본문)입니다.

## 기술 스택

| 구분 | 기술 | 사용 방식 |
|------|------|-----------|
| 프론트엔드 | React 19, TypeScript, Vite | 원페이지 랜딩. 문구는 `frontend/src/content/ko.ts` 한 곳에 모음 |
| 백엔드 | Django 5.2, Django REST Framework | 사전가입·반응 이벤트 API, 관리자, 통계 화면 |
| DB | SQLite(로컬) / Neon PostgreSQL(운영) | `DATABASE_URL` 환경변수로 교체 |
| 배포 | Firebase Hosting + Google Cloud Run(서울) | 화면은 Firebase CDN, `/api`는 Cloud Run 컨테이너. `./deploy.sh` |
| 측정 | 자체 수집 + 메타 픽셀 | 픽셀 ID는 빌드 환경변수 `VITE_META_PIXEL_ID` |

### API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/signups/` | 사전가입 저장, 대기 순번 반환 (같은 이메일이면 기존 순번) |
| POST | `/api/events/` | 방문(`page_view`), 버튼 클릭(`cta_click`) 기록 |
| GET | `/api/health/` | 상태 확인 |

## 로컬에서 실행하기

터미널 두 개에서 각각 실행합니다(Git Bash 기준. macOS/Linux는 `.venv/Scripts/`를 `.venv/bin/`으로).

```bash
# 1. 백엔드 → http://127.0.0.1:8000/admin/
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt
.venv/Scripts/python manage.py migrate
.venv/Scripts/python manage.py createsuperuser   # 관리자 계정 (처음 1회)
.venv/Scripts/python manage.py runserver

# 2. 프론트엔드 → http://localhost:5173
cd frontend
npm install
npm run dev
```

| 목적 | 명령 |
|------|------|
| 백엔드 테스트 | `cd backend && .venv/Scripts/python manage.py test` |
| 프론트 빌드 | `cd frontend && npm run build` |
| 반응 요약 | `cd backend && .venv/Scripts/python manage.py stats` |
| 배포 | `./deploy.sh all` (처음에는 [`docs/deploy.md`](docs/deploy.md) 순서대로) |

## 정해야 할 사항

- [ ] **도메인:** 후보 `fanstay.kr` 등(`plan.md` 16번). 없어도 `https://<프로젝트>.web.app`으로 먼저 공개할 수 있습니다.
- [ ] **메타 픽셀 ID:** 메타 광고 계정에서 발급
- [ ] **사전가입 혜택 문구:** 현재 비워 둠(`ko.ts`의 `signup.benefits`)
- [ ] **개인정보 문의 연락처(이메일)**
- [ ] **가격 예시 수치 확정:** 현재는 공개 후기 기반 추정치(`plan.md` 12번)

## 개선이 필요한 사항

- **공유 미리보기 이미지:** 카카오톡·인스타그램에 링크를 공유할 때 보일 이미지(`og:image`)가 아직 없습니다.
- **개인정보 처리방침 페이지:** 정식 광고 집행 전에 별도 페이지(수탁사: Google Cloud·Neon, 메타 픽셀 포함)를 두는 것이 좋습니다.
- **스팸 방지:** 지금은 요청 횟수 제한(스로틀)만 있습니다. 광고 유입이 커지면 추가 대책이 필요할 수 있습니다.
- **A/B 테스트:** 히어로 문구나 가격 예시 유무에 따른 전환율 비교는 아직 없습니다.
- **다국어:** 지금은 한국어만 지원합니다. 문구가 `ko.ts` 한 곳에 모여 있어 언어를 추가하기 쉽습니다.

## 문서

- [`plan.md`](plan.md): 서비스 계획서(PDF 요약)와 사전가입 사이트 요구사항·디자인·배포 계획
- [`CLAUDE.md`](CLAUDE.md): 개발 규칙과 폴더 구조 (Claude Code용)
- [`prompt_template.md`](prompt_template.md): 작업 지시 양식
- [`docs/deploy.md`](docs/deploy.md): Cloud Run + Firebase Hosting 배포 가이드
- `.github/`: 이슈·PR 템플릿

# FANSTAY 프로젝트

해외에서 **한 달 살기**를 준비하는 한국인을 위한 숙소 · 체류정보 · 생활 인프라 통합 플랫폼.
지금 단계는 메타 광고로 들어온 한국인 20~30대의 반응을 측정하는 **사전가입 웹사이트**다.

- 2026-09-19 주제 변경: 이전 "중국인 대상 서울 한 달 살기" → 현재 "한국인 대상 해외 한 달 살기". 서비스 이름 FANSTAY는 그대로다.
- 저장소·폴더 이름(`hanstay_project`)은 예전 이름 그대로 둔다.
- 서비스 정의·요구사항·미정 사항: `plan.md` (작업 전에 먼저 읽을 것)
- 작업 지시 양식: `prompt_template.md`

## 폴더 구조

```
hanstay_project/
├── .github/                 이슈 템플릿(ISSUE_TEMPLATE/), PR 템플릿
├── docs/deploy.md           Cloud Run + Firebase Hosting 배포 가이드
├── Dockerfile               Django(API·관리자) 컨테이너 (Cloud Run, 포트 $PORT)
├── firebase.json            Firebase Hosting: 화면 제공 + /api/** → Cloud Run
├── deploy.sh                배포 스크립트 (값은 .env.deploy, 양식은 deploy.env.example)
├── plan.md                  서비스 계획서 + 사전가입 사이트 요구사항
├── prompt_template.md       작업 지시 양식
├── frontend/                React 19 + TypeScript + Vite (원페이지 랜딩, 한국어)
│   └── src/
│       ├── content/         화면 문구 전부 (ko.ts, 구조는 types.ts)
│       ├── components/      섹션별 컴포넌트 (Hero, Problems, Solution, Features, Flow, Pricing, SignupForm, Faq, ThankYou)
│       ├── illustrations/   StayCalendar(히어로 달력), icons
│       ├── lib/             api.ts(가입 API), track.ts(자체 반응 측정), pixel.ts(메타 픽셀)
│       └── styles.css       디자인 토큰과 전체 스타일
└── backend/                 Django 5.2 + DRF
    ├── config/              설정(환경변수 기반), URL
    ├── signups/             사전가입 모델·API·관리자
    └── analytics/           page_view / cta_click 이벤트, `stats` 명령, 관리자 통계 화면(/admin/stats/)
```

## 로컬 실행

```bash
# 백엔드 (http://127.0.0.1:8000, 관리자 /admin/)
cd backend
python -m venv .venv                            # 최초 1회
.venv/Scripts/pip install -r requirements.txt   # 최초 1회 (macOS/Linux는 .venv/bin/)
.venv/Scripts/python manage.py migrate
.venv/Scripts/python manage.py createsuperuser  # 관리자 페이지를 쓸 때 1회
.venv/Scripts/python manage.py runserver

# 프론트엔드 (http://localhost:5173, /api 요청은 8000으로 프록시)
cd frontend
npm install
npm run dev
```

## 자주 쓰는 명령

| 목적 | 명령 |
|------|------|
| 백엔드 테스트 | `cd backend && .venv/Scripts/python manage.py test` |
| 프론트 타입 검사 + 빌드 | `cd frontend && npm run build` |
| 반응 요약 (방문자·CTA 클릭·가입 수) | `cd backend && .venv/Scripts/python manage.py stats [--days 7]` |
| 모델 변경 후 | `.venv/Scripts/python manage.py makemigrations && .venv/Scripts/python manage.py migrate` |

Windows 콘솔에서 한글 출력이 깨지면 `PYTHONIOENCODING=utf-8`을 앞에 붙인다.

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/signups/` | 사전가입 저장. 응답 `{position, created}`. 같은 이메일이면 기존 순번과 `created: false` |
| POST | `/api/events/` | `page_view` / `cta_click` 기록 (sendBeacon의 text/plain도 받음). 204 |
| GET | `/api/health/` | 상태 확인 |

## 개발 규칙

### 문구
- 화면 문구는 컴포넌트에 직접 쓰지 않고 `frontend/src/content/ko.ts`에 둔다. 구조는 `types.ts`가 정한다. 나중에 언어를 추가할 때 같은 구조로 파일을 더한다.
- 폼 선택지의 `value` 코드는 백엔드 `signups/models.py`의 choices(`COUNTRY_CHOICES`, `FEATURE_CHOICES` 포함)와 반드시 같아야 한다. 한쪽을 바꾸면 다른 쪽과 테스트, `plan.md` 11번을 함께 바꾼다.
- 문구는 쉬운 말, 능동형, 존댓말(해요체 위주)로 쓴다. 버튼 이름과 결과 문구를 맞춘다(예: "사전가입하기" → "사전가입이 완료됐어요").
- 가격 예시는 추정치다. 화면에 추정치임을 밝히는 문구(`pricing.note`)를 지우지 않는다.

### 디자인
- 디자인 작업에는 `frontend-design` 스킬(`.claude/skills/frontend-design`)을 따른다.
- 컨셉은 **"한 달 체류 달력"**이다. 토큰은 `styles.css` 맨 위 `:root`에 있다. 새 색을 즉흥적으로 추가하지 않는다.
- 색: 남색 `--ink`(글자·버튼), 형광 노랑 `--marker`(강조), `--paper`/`--sheet`(배경·종이 면), `--grid`(선), `--sea`(링크·포커스).
- 강조는 형광펜(`--marker`) 하나로만 한다: 달력의 체류 기간, 선택된 칩, 비교표의 팬스테이 행, 합계 금액, 대기 순번.
- 글꼴: 제목 `Gowun Batang`, 본문 `Pretendard`(둘 다 npm 번들). 번호는 실제 순서가 있는 이용 흐름에만 쓴다.
- 자동 애니메이션은 히어로 달력의 형광펜 칠하기 하나뿐이다. 섹션 등장 효과를 넣지 않는다. `prefers-reduced-motion`을 지킨다.
- 모바일 우선. 변경 후 390px과 1440px 폭에서 가로 스크롤이 생기지 않는지 확인한다.

### 측정과 개인정보
- 자체 수집(`track.ts`)은 방문과 버튼 클릭만 기록하고 개인정보를 저장하지 않는다.
- 메타 픽셀은 `VITE_META_PIXEL_ID`가 있을 때만 불러온다. 표준 이벤트는 `PageView`, 가입 완료 시 `Lead`만 쓴다. 폼 입력값(이메일 등)을 픽셀로 보내지 않는다.
- 픽셀·수집 항목을 바꾸면 동의 안내문(`signup.consent.notice`)과 푸터 고지(`footer.notice`)도 함께 고친다.

### 백엔드
- 설정값은 환경변수로 받는다 (`config/settings.py` 상단 주석 참고). 비밀값을 코드에 넣지 않는다.
- 가입·이벤트 API는 인증 없이 열려 있으므로 입력 검증과 스로틀(`DEFAULT_THROTTLE_RATES`)을 유지한다.

### 범위
- 로그인, 결제, 실제 예약 기능은 만들지 않는다 (사전가입 단계).
- 가입 혜택 문구, 도메인, 메타 픽셀 ID, 개인정보 문의 연락처는 아직 미정이다. `plan.md` 17번을 확인하고 임의로 정하지 않는다.
- 비용이 발생하는 작업(유료 서비스 구매, 도메인 구입, 최소 인스턴스 유지, 사양 상향 등)은 사용자 허락 없이 하지 않는다.

## GitHub 작업 방식

- 작업은 GitHub 이슈 단위로 하고, 이슈마다 브랜치를 만든다. `main`에 직접 커밋하지 않는다.
- 이슈를 만들 때는 `.github/ISSUE_TEMPLATE/`의 `feature.md`(기능) 또는 `bug.md`(버그) 형식을 따른다.
- PR 본문은 `.github/pull_request_template.md` 형식을 채운다. `closes #이슈번호`로 이슈를 연결한다.
- 커밋과 push는 사용자가 요청할 때만 한다.

## 배포

- **서버리스만 사용:** Firebase Hosting(화면, 무료 CDN·HTTPS) + Google Cloud Run 서울 `asia-northeast3`(서비스 `fanstay-api`, Django) + Neon PostgreSQL.
- Firebase Hosting이 `/api/**`만 Cloud Run으로 넘긴다(`firebase.json`). 서비스 이름·리전을 바꾸면 `firebase.json`과 `deploy.sh`를 함께 고친다.
- 관리자 페이지는 Cloud Run 주소(`…run.app/admin/`)로 쓴다. Firebase Hosting은 `__session` 외 쿠키를 전달하지 않는다.
- 배포: `./deploy.sh [secrets|migrate|api|web|all]`. 전체 절차는 `docs/deploy.md`.
- `.env.deploy`(git 제외): `GCP_PROJECT`, `DJANGO_SECRET_KEY`, `DATABASE_URL`, `META_PIXEL_ID`. 운영의 비밀값은 Secret Manager(`fanstay-django-secret`, `fanstay-database-url`)에 있다.
- 모델을 바꾸면 배포 전에 `./deploy.sh migrate`를 실행한다.

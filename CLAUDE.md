# 한달다움 프로젝트

제주와 해외에서 **한 달 살기**를 준비하는 한국인을 위한 숙소 · 체류정보 · 생활 인프라 통합 플랫폼.
지금 단계는 메타 광고로 들어온 한국인 20~30대의 반응을 측정하는 **사전가입 웹사이트**다.

- 2026-09-19 주제 변경: 이전 "중국인 대상 서울 한 달 살기" → "한국인 대상 해외 한 달 살기". 당시 서비스 이름은 FANSTAY였다.
- 2026-09-24 서비스 이름 변경: FANSTAY(팬스테이) → **한달다움**. 화면·문서·관리자 제목만 바꿨고, 사이트 주소(`fanstay-app-2026.web.app`), GCP·Firebase 프로젝트, Cloud Run 서비스(`fanstay-api`), 비밀값 이름, 브라우저 저장 키(`fanstay.visitor`), 저장소 이름은 그대로 둔다(바꾸면 주소·배포가 달라진다).
- 2026-09-24 범위 확장: "제주부터 해외까지". 첫 도시는 네이버 검색량 기반 순위대로 제주 · 후쿠오카(일본) · 치앙마이(태국) · 다낭(베트남). 근거는 README "도시 선정 근거". 도시·순위를 바꾸면 README 근거 표도 함께 고친다.
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
│       ├── components/      섹션별 컴포넌트 (Hero(+SignupForm), Problems, Features, Flow, Pricing, Faq, ThankYou)
│       ├── assets/photos/   사진(WebP). 출처·라이선스는 CREDITS.md
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
- 폼은 이메일(필수), 성별, 연령대, 가 보고 싶은 곳, 동의(필수)만 받는다(2026-09-24). 이름·설문 4개의 DB 칸은 기존 데이터 보존용으로만 남아 있다.
- 폼 선택지의 `value` 코드(성별 `Gender`, 연령대 `AgeRange`)는 백엔드 `signups/models.py`의 choices와 반드시 같아야 한다. "가 보고 싶은 곳"(백엔드 필드 `countries`)은 선택지 없이 직접 입력받는 문자열이다. 한쪽을 바꾸면 다른 쪽과 테스트, `plan.md` 11번을 함께 바꾼다.
- 문구는 쉬운 말, 능동형, 존댓말(해요체 위주)로 쓴다. 버튼 이름과 결과 문구를 맞춘다(예: "사전가입하기" → "사전가입이 완료됐어요").
- 가격 예시는 추정치다. 화면에 추정치임을 밝히는 문구(`pricing.note`)를 지우지 않는다.

### 디자인
- 디자인 작업에는 `design-taste-frontend` 스킬(`.claude/skills/design-taste-frontend`, AI가 만든 티가 나는 패턴 금지 목록)을 따른다.
- 방향: **파스텔 브라운 메인 컬러의 따뜻한 여행 준비 도구 + 캐릭터.** 사전가입 폼은 첫 화면(히어로 오른쪽, 모바일은 제목 바로 아래)에 있다.
- **라이트 모드 고정**(2026-09-24). 다크 모드와 전환 버튼은 없다.
- 토큰은 `styles.css` 맨 위 `:root`에 있다. 새 색을 즉흥적으로 추가하지 않는다.
  - 면: `--bg`(크림), `--surface`(카드·폼), `--surface-2`(옅은 구획), `--band`(파스텔 브라운: 히어로 띠, 가격 섹션 띠, 숙소 기능 칸)
  - 글자: `--text` / `--text-2` / `--text-3`(진한 브라운 계열, 모두 WCAG AA 4.5:1 이상)
  - 강조색은 `--accent`(브라운) 하나다: 버튼, 필수 표시, 이용 흐름 번호, 합계 금액, 대기 순번. 옅은 면은 `--accent-soft`.
- 캐릭터(등에 집을 진 초록 거북이)는 `assets/character/turtle.webp`(흰 배경을 지운 파일, 원본은 `original.jpg`). 지금은 히어로 제목 옆에만 쓴다.
- 페이지 제목·설명·공유 미리보기 문구는 `ko.ts`의 `meta`에만 쓴다. 빌드 때 `vite.config.ts`가 `index.html`에 채운다.
- 글꼴은 `Pretendard` 하나(npm 번들). 명조·세리프를 쓰지 않는다.
- 모서리: 입력·버튼 12px(`--r-sm`), 카드·사진 22px(`--r-lg`), 칩만 알약형.
- 아이콘은 `@phosphor-icons/react`만 쓴다. SVG 아이콘·그림을 직접 그리지 않는다.
- 사진은 라이선스를 확인한 것만 `assets/photos/`에 WebP로 넣고 `CREDITS.md`에 적는다. CC BY 사진은 푸터(`footer.photoCredit`)에 작가를 표시한다.
- 금지: 긴 대시(—, –), 섹션 제목 위 작은 영문 라벨(eyebrow), 섹션 번호, 스크롤 안내 문구, 같은 모양 카드 3개 나열. 번호는 실제 순서가 있는 이용 흐름·에스크로 단계에만 쓴다.
- 움직임은 버튼·칩 hover/active 전환과 FAQ 아이콘 회전뿐이다. 섹션 등장 효과를 넣지 않는다. `prefers-reduced-motion`을 지킨다.
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

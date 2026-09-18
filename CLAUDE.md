# HANSTAY 프로젝트

중국 본토 20~30대를 대상으로 한 "서울 한 달 살기(30일 리빙팩)" 서비스.
지금 단계는 샤오홍슈 광고 유입자의 반응을 측정하는 **사전가입 웹사이트**다.

- 서비스 정의·요구사항·미정 사항: `plan.md` (작업 전에 먼저 읽을 것)
- 작업 지시 양식: `prompt_template.md`

## 폴더 구조

```
hanstay_project/
├── plan.md                  서비스 계획서 + 사전가입 사이트 요구사항
├── prompt_template.md       작업 지시 양식
├── frontend/                React 19 + TypeScript + Vite (원페이지 랜딩)
│   └── src/
│       ├── content/         화면 문구 전부 (zh.ts 중국어, ko.ts 한국어, types.ts 구조)
│       ├── components/      섹션별 컴포넌트 (Hero, Problems, ..., SignupForm, ThankYou)
│       ├── illustrations/   인라인 SVG 일러스트와 아이콘
│       ├── i18n/            언어 전환 (기본 중국어)
│       ├── lib/             api.ts(가입 API), track.ts(반응 측정)
│       └── styles.css       디자인 토큰과 전체 스타일
└── backend/                 Django 5.2 + DRF
    ├── config/              설정(환경변수 기반), URL
    ├── signups/             사전가입 모델·API·관리자
    └── analytics/           page_view / cta_click 이벤트, `stats` 명령
```

## 로컬 실행

```bash
# 백엔드 (http://127.0.0.1:8000, 관리자 /admin/)
cd backend
python -m venv .venv                       # 최초 1회
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
| POST | `/api/signups/` | 사전가입 저장. 응답 `{position, created}`. 같은 연락처면 기존 순번과 `created: false` |
| POST | `/api/events/` | `page_view` / `cta_click` 기록 (sendBeacon의 text/plain도 받음). 204 |
| GET | `/api/health/` | 상태 확인 |

## 개발 규칙

### 중국 본토 접속 (가장 중요)
- **구글 계열 서비스와 중국에서 막히는 CDN을 쓰지 않는다.** Google Fonts, Google Analytics, reCAPTCHA, Google Forms, YouTube 임베드, unpkg/jsdelivr 런타임 로드 등.
- 폰트는 기기 기본 서체 스택을 쓰고, 추가 폰트는 npm(@fontsource)으로 번들에 포함한다.
- 이미지·일러스트는 인라인 SVG나 `frontend/public`에 직접 둔다. 외부 이미지 URL을 쓰지 않는다.
- 브라우저는 자체 프론트/API 도메인 외의 곳에 요청하지 않아야 한다.

### 문구와 다국어
- 화면 문구는 컴포넌트에 직접 쓰지 않고 `frontend/src/content/zh.ts`, `ko.ts`에 둔다. 두 파일은 `types.ts`의 같은 구조를 채운다.
- 중국어 간체가 기본 언어다. 문구를 추가하거나 바꿀 때는 두 언어를 함께 수정한다.
- 폼 선택지의 `value` 코드는 백엔드 `signups/models.py`의 choices와 반드시 같아야 한다. 한쪽을 바꾸면 다른 쪽과 테스트도 함께 바꾼다.

### 디자인
- 디자인 작업에는 `frontend-design` 스킬(`.claude/skills/frontend-design`)을 따른다.
- 컨셉은 "서울 생활 지도"(지도 + 지하철 2호선). 토큰은 `styles.css` 맨 위 `:root`에 있다. 새 색을 즉흥적으로 추가하지 않는다.
- 자동 애니메이션은 히어로 지도 하나뿐이다. 섹션마다 등장 효과를 넣지 않는다. `prefers-reduced-motion`을 지킨다.
- 모바일 우선. 변경 후 390px과 1440px 폭에서 가로 스크롤이 생기지 않는지 확인한다.

### 백엔드
- 설정값은 환경변수로 받는다 (`config/settings.py` 상단 주석 참고). 비밀값을 코드에 넣지 않는다.
- 가입·이벤트 API는 인증 없이 열려 있으므로 입력 검증과 스로틀(`DEFAULT_THROTTLE_RATES`)을 유지한다.
- 이벤트에는 개인정보를 저장하지 않는다.

### 범위
- 로그인, 결제, 실제 예약 기능은 만들지 않는다 (사전가입 단계).
- 가입 혜택 문구, 호스팅, 도메인, 분석 도구는 아직 미정이다. `plan.md` 17번을 확인하고 임의로 정하지 않는다.

## 배포 (미정)

- 서버리스 배포 예정. 후보와 중국 본토 접속 고려사항은 `plan.md` 16번 참고.
- 프론트는 `npm run build` 결과(`frontend/dist`)를 정적 호스팅에 올린다. API 도메인이 다르면 빌드 시 `VITE_API_BASE`를 지정한다.
- 백엔드 운영 환경변수: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `DATABASE_URL`

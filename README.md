# FANSTAY 사전가입 웹사이트

> 방은 예약할 수 있지만, 한국에서의 생활은 예약할 수 없습니다.

## 어떤 서비스인가

**FANSTAY**는 한국에서 2주~3개월 머물려는 **중국 본토 20~30대 개별 여행객**을 위한 "서울 한 달 살기" 서비스입니다.
숙소만 중개하는 대신 **30일 생활권을 하나의 상품(리빙팩)** 으로 묶어 판매합니다.

- **주거 (HOME)**: 보증금 없는 30일 풀옵션 집
- **생활권 (DAILY)**: 도보 15분 안의 마트·빨래방·약국·병원 안내와 제휴 혜택
- **한국형 라이프스타일 (K-LIFE)**: 성수·홍대·강남 등 동네별 K-뷰티, 로컬 문화, 커뮤니티 경험

서비스 정의, 시장, 수익 모델 등 자세한 내용은 [`plan.md`](plan.md)를 참고하세요.

## 무엇을 만들었나

정식 서비스 전에 **샤오홍슈(小红书) 광고로 들어온 중국 사용자가 "한 달 살기 패키지"에 얼마나 관심을 보이는지 측정하는 사전가입 웹사이트**입니다.

- **원페이지 랜딩**: 히어로 → 문제 공감 → 솔루션 → 생활권 소개 → 사용자 여정 → 리빙팩 예시 → 사전가입 폼 → FAQ
- **다국어**: 중국어 간체 기본, 한국어 전환 (`?lang=ko`)
- **사전가입 폼**
  - 필수 항목: 연락처(이메일 또는 위챗 ID)와 개인정보 동의
  - 선택 설문: 연령대, 거주 도시, 방한 시기, 체류 일수, 관심 지역·서비스, 지불 의향 금액
- **가입 완료 화면**: 대기 순번 표시와 친구 공유 버튼. 위챗 내장 브라우저처럼 공유 기능이 없으면 링크를 복사합니다.
- **반응 측정**: 방문자 수, 사전가입 버튼 클릭 수(위치별), 가입 전환율을 자체 백엔드에 기록합니다.
- **관리**: Django 관리자 페이지에서 가입 목록과 **반응 통계 화면**(`/admin/stats/`: 방문자·클릭·전환율, 설문 응답 분포, 최근 14일 추이)을 봅니다. `stats` 명령으로도 요약을 볼 수 있습니다.
- **디자인**: "서울 생활 지도" 컨셉을 기준으로 했습니다.
  - 메인 컬러는 빨강입니다.
  - 히어로에 도보 15분 생활권 지도, 생활권 소개에 지하철 역명판 카드, 사용자 여정에 노선도를 넣었습니다.
  - 일러스트는 모두 코드로 그렸습니다(인라인 SVG).

## 기술 스택

| 구분 | 기술 | 사용 방식 |
|------|------|-----------|
| 프론트엔드 | React 19, TypeScript, Vite | 원페이지 랜딩. 화면 문구는 `frontend/src/content/`(zh.ts, ko.ts)에 모아 관리 |
| 백엔드 | Django 5.2, Django REST Framework | 사전가입 저장 API, 반응 이벤트 기록 API, 관리자 페이지 |
| DB | SQLite (로컬) / Neon PostgreSQL (운영) | `DATABASE_URL` 환경변수로 교체 |
| 배포 | 알리바바 클라우드 Function Compute (홍콩, 서버리스) | Docker 컨테이너 하나(React 화면 + Django)를 ACR에 올리고 Serverless Devs(`s.yaml`)로 배포. `./deploy.sh` |
| 폰트 | 기기 기본 서체 + Bricolage Grotesque(npm 번들) | 중국에서 막히는 구글 폰트를 쓰지 않음 |

**중국 본토 접속을 위한 원칙**: 구글 폰트, 구글 애널리틱스, 구글 폼 같은 외부 서비스를 쓰지 않습니다. 브라우저는 자체 프론트엔드와 API 주소에만 요청합니다.

### API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/signups/` | 사전가입 저장, 대기 순번 반환 (같은 연락처면 기존 순번) |
| POST | `/api/events/` | 방문(`page_view`), 버튼 클릭(`cta_click`) 기록 |
| GET | `/api/health/` | 상태 확인 |

## 로컬에서 실행하기

터미널 두 개에서 각각 실행합니다. 아래는 Git Bash 기준이며, macOS/Linux에서는 `.venv/Scripts/`를 `.venv/bin/`으로 바꾸면 됩니다.

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
| 반응 요약 보기 | `cd backend && .venv/Scripts/python manage.py stats` |
| 백엔드 테스트 | `cd backend && .venv/Scripts/python manage.py test` |
| 프론트 빌드 | `cd frontend && npm run build` |

## 정해야 할 사항

- [x] **호스팅**: 알리바바 클라우드 Function Compute(홍콩, 서버리스)로 결정. 배포 순서는 [`docs/deploy.md`](docs/deploy.md)에 있습니다.
- [x] **DB**: Neon 무료 플랜(서버리스 PostgreSQL, 싱가포르)으로 결정.
- [ ] **도메인**: 알리바바 클라우드에서 `.com` 구입 예정. 이름은 미정입니다.
- [ ] **사전가입 혜택 문구**: 현재 비워 둠. `zh.ts`, `ko.ts`의 `signup.benefits`에 넣으면 폼 위에 표시됩니다.
- [ ] **리빙팩 가격**: 현재는 평균 결제액 150만 원 기준 예시 가격입니다.
- [ ] **분석 도구 추가 여부**: 현재 자체 수집만 합니다. 후보는 Baidu Tongji, 자체 호스팅 Umami입니다.
- [ ] **개인정보 삭제 요청 연락처**

## 개선이 필요한 사항

- **배포 전 확인**
  - 오픈 전에 중국 본토에서 실제 접속 속도를 측정합니다.
  - 샤오홍슈 광고에 외부 링크를 넣을 수 있는지 확인합니다.
  - 중국 개인정보보호법(PIPL)상 해외 서버 저장에 대한 추가 고지·동의가 필요한지 검토합니다.
- **공유 미리보기 이미지**: 위챗·샤오홍슈에 링크를 공유할 때 보일 이미지(`og:image`)가 아직 없습니다.
- **HTTPS 인증서 갱신 자동화**: Let's Encrypt 인증서를 약 60일마다 수동으로 갱신합니다(`docs/deploy.md` 11번). 반복되면 자동화가 필요합니다.
- **A/B 테스트**: `plan.md`의 검증 축 02(숙소 단독 vs 생활권 패키지 페이지 비교)는 아직 구현하지 않았습니다.
- **스팸 방지**: 지금은 요청 횟수 제한(스로틀)만 있습니다. 광고 유입이 커지면 추가 대책이 필요할 수 있습니다. reCAPTCHA는 중국에서 막히므로 다른 방법을 검토해야 합니다.

## 문서

- [`plan.md`](plan.md): 서비스 계획서와 사전가입 사이트 요구사항
- [`CLAUDE.md`](CLAUDE.md): 개발 규칙과 폴더 구조 (Claude Code용)
- [`prompt_template.md`](prompt_template.md): 작업 지시 양식
- [`docs/deploy.md`](docs/deploy.md): 알리바바 클라우드 서버리스 배포 가이드
- `.github/`: 이슈·PR 템플릿

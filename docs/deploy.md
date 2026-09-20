# FANSTAY 배포 가이드 — Cloud Run(서울) + Firebase Hosting

사전가입 사이트를 **서버리스로만** 배포하는 전체 과정입니다. 처음에는 0단계부터 순서대로 하고, 이후 업데이트는 [9. 운영](#9-운영-업데이트롤백db-변경)만 보면 됩니다.

- 👤 = 사용자가 직접 할 일 (계정 가입, 결제, 콘솔 설정)
- 🤖 = Claude Code에게 맡길 수 있는 일 (명령 실행, 코드·설정 수정)
- 💳 = 비용이 생길 수 있는 단계

> 콘솔 메뉴 이름과 위치는 바뀔 수 있습니다. 문서와 다르면 콘솔 상단 검색창에서 서비스 이름(예: `Cloud Run`)을 검색하세요.

---

## 0. 전체 구성

```
한국 방문자 (메타 광고)
   │  https://<도메인>  (또는 https://<프로젝트>.web.app)
   ▼
Firebase Hosting ─ 사이트 화면(React 빌드), 무료 CDN·HTTPS
   │  /api/** 요청만 넘김
   ▼
Cloud Run 서울(asia-northeast3) ─ fanstay-api 컨테이너 (Django: /api, /admin)
   │
   ▼
Neon PostgreSQL (서버리스, 무료 플랜)
```

| 구성 요소 | 서비스 | 비용 |
|-----------|--------|------|
| 사이트 화면 | Firebase Hosting | 무료 사용량 안(저장 10GB, 전송 하루 360MB) |
| API·관리자 | Cloud Run (서울) | 무료 사용량(월 200만 요청 등) 안에서 거의 0원. 요청이 없으면 0대 |
| 이미지 빌드 | Cloud Build + Artifact Registry | 무료 사용량 안. 오래된 이미지는 정리 권장(9단계) |
| 비밀값 | Secret Manager | 무료 사용량 안(비밀 버전 6개) |
| DB | Neon 무료 플랜 | 무료 (저장 0.5GB) |
| 도메인 | 가비아 등 | 💳 연 1~3만 원 (선택) |

- Google Cloud는 무료 사용량 안에서도 **결제 계정(카드) 연결이 필수**입니다. 💳 예산 알림(8단계)을 꼭 설정하세요.
- **관리자 페이지는 Cloud Run 주소로 접속합니다** (`https://fanstay-api-…run.app/admin/`). Firebase Hosting은 `__session` 외의 쿠키를 전달하지 않아 자체 도메인에서는 관리자 로그인이 안 되기 때문입니다.

---

## 1. Google Cloud 프로젝트와 결제 👤💳

1. [console.cloud.google.com](https://console.cloud.google.com)에 Google 계정으로 로그인합니다.
2. 상단 프로젝트 선택 → **새 프로젝트**를 누릅니다.
   - 이름: `fanstay`
   - **프로젝트 ID**를 메모합니다(예: `fanstay-123456`). `.env.deploy`의 `GCP_PROJECT`에 넣습니다.
3. **결제(Billing)** 메뉴에서 결제 계정을 만들고 카드를 등록한 뒤 프로젝트에 연결합니다.
   - 신규 가입 무료 크레딧이 제공될 수 있습니다.

## 2. 로컬 도구 준비 👤🤖

Git Bash 기준입니다.

1. **gcloud CLI**를 설치합니다. [설치 안내](https://cloud.google.com/sdk/docs/install)의 Windows 설치 파일을 쓰고, 설치 후 Git Bash를 다시 엽니다.
2. 로그인하고 프로젝트를 지정합니다. 👤 브라우저 로그인 창이 열립니다.
   ```bash
   gcloud auth login
   gcloud config set project <프로젝트 ID>
   ```
3. **Firebase CLI**를 설치하고 로그인합니다. 👤
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
4. 🤖 필요한 API를 켜고, 소스 배포용 권한을 줍니다. `<프로젝트 번호>`는 콘솔 첫 화면(대시보드)의 숫자 ID입니다.
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
   gcloud projects add-iam-policy-binding <프로젝트 ID> \
     --member=serviceAccount:<프로젝트 번호>-compute@developer.gserviceaccount.com --role=roles/run.builder
   gcloud projects add-iam-policy-binding <프로젝트 ID> \
     --member=serviceAccount:<프로젝트 번호>-compute@developer.gserviceaccount.com --role=roles/secretmanager.secretAccessor
   ```
   - `run.builder`: 소스 코드로 컨테이너를 빌드합니다.
   - `secretAccessor`: 실행 중인 서비스가 비밀값(SECRET_KEY, DB 주소)을 읽습니다.
   - 권한이 반영되는 데 몇 분 걸릴 수 있습니다.
5. 👤 [Firebase 콘솔](https://console.firebase.google.com)에서 **프로젝트 추가 → 기존 Google Cloud 프로젝트 선택 → `fanstay`**를 고릅니다.
   - Google 애널리틱스는 **사용 안 함**을 권장합니다. 방문 통계는 자체 수집과 메타 픽셀로 봅니다.
   - 결제 계정이 연결된 프로젝트라 Blaze(종량제) 요금제로 표시됩니다. 무료 사용량은 그대로 적용됩니다.

## 3. 운영 DB — Neon 👤🤖

1. 👤 [neon.tech](https://neon.tech)에 가입합니다. GitHub 계정으로 가입할 수 있고 카드는 필요 없습니다.
2. 👤 **Create project**를 누릅니다.
   - 이름: `fanstay`
   - Region: 목록에 서울이 있으면 서울, 없으면 **AWS Asia Pacific (Singapore)** 또는 도쿄처럼 가장 가까운 곳
3. 👤 **Connect** 화면에서 **Connection pooling을 켠 주소**를 복사합니다.
   - 호스트에 `-pooler`가 들어갑니다.
   - `?sslmode=require`가 붙어 있어야 합니다.

## 4. 배포 설정 파일 🤖👤

```bash
cp deploy.env.example .env.deploy
```

`.env.deploy`는 git에 올라가지 않습니다. 값을 채웁니다.

| 값 | 어디서 |
|----|--------|
| `GCP_PROJECT` | 1단계 프로젝트 ID |
| `DJANGO_SECRET_KEY` | `python -c "import secrets; print(secrets.token_urlsafe(50))"` 결과 |
| `DATABASE_URL` | 3단계 Neon 주소 |
| `META_PIXEL_ID` | 메타 이벤트 관리자 → 데이터 소스 → 픽셀 ID. 없으면 비워 둡니다(나중에 넣고 `./deploy.sh web`만 다시 실행) |

## 5. 첫 배포 🤖

```bash
./deploy.sh secrets    # SECRET_KEY·DB 주소를 Secret Manager에 등록
./deploy.sh migrate    # 운영 DB에 테이블 생성 (로컬에서 Neon에 접속)
./deploy.sh api        # Cloud Run에 백엔드 배포 (첫 빌드는 3~5분)
./deploy.sh web        # 프론트 빌드 후 Firebase Hosting에 배포
```

- `./deploy.sh api`가 끝나면 **Service URL**(`https://fanstay-api-….run.app`)이 출력됩니다. 관리자 주소로 쓰니 메모해 둡니다.
- `./deploy.sh web`이 끝나면 **Hosting URL**(`https://<프로젝트 ID>.web.app`)이 출력됩니다. 이 주소가 바로 공개 사이트입니다.
- 첫 배포 때 "Artifact Registry 저장소를 만들까요?"라고 물으면 `Y`로 답합니다.

**관리자 계정 만들기** 👤 (운영 DB는 비어 있으므로 새로 만듭니다)
```bash
cd backend
set -a; source ../.env.deploy; set +a
.venv/Scripts/python manage.py createsuperuser
```

**확인**
```bash
curl https://<프로젝트 ID>.web.app/api/health/     # {"status": "ok"}
```
- 브라우저에서 `https://<프로젝트 ID>.web.app`을 열고 테스트 가입을 1건 해 봅니다.
- 관리자 `https://fanstay-api-….run.app/admin/` → **반응 통계**에서 방문·가입이 기록됐는지 확인합니다.

## 6. 자체 도메인 연결 👤💳 (선택)

1. 도메인을 구입합니다.
   - 후보는 `plan.md` 16번에 있습니다. `.kr`/`.co.kr`은 가비아·후이즈, `.com` 등은 Cloudflare·Namecheap에서 살 수 있습니다.
2. Firebase 콘솔 → **Hosting → 커스텀 도메인 추가** → 도메인 입력(예: `fanstay.kr`)
   - `www.fanstay.kr`도 추가하고, 한쪽을 다른 쪽으로 리디렉션하도록 설정합니다.
3. 화면에 나온 **TXT·A 레코드**를 도메인 구입처의 DNS 관리 화면에 그대로 등록합니다.
4. 연결과 HTTPS 인증서 발급은 자동입니다. 몇 분에서 최대 24시간 걸리고, 인증서 갱신도 자동입니다.
5. 메타 광고의 랜딩 URL을 자체 도메인으로 바꿉니다.

## 7. 메타 픽셀 확인 👤

1. 메타 이벤트 관리자에서 픽셀을 만들고 ID를 `.env.deploy`의 `META_PIXEL_ID`에 넣습니다.
2. `./deploy.sh web`을 다시 실행합니다.
3. 이벤트 관리자 → **테스트 이벤트**에서 사이트를 열어 `PageView`가, 사전가입을 1건 해서 `Lead`가 들어오는지 확인합니다.
4. 광고 캠페인의 전환 이벤트를 `Lead`로 지정하면 가입 전환 기준으로 광고가 최적화됩니다.

## 8. 비용 알림과 오류 알림 👤

### 예산 알림 💳
**결제 → 예산 및 알림 → 예산 만들기**
- 월 예산 예: 1만 원
- 50%, 90%, 100%에서 이메일 알림

### 오류 알림
**Monitoring → 알림 → 정책 만들기**
- 측정항목: Cloud Run 버전 → **Request count**
- 필터: `service_name = fanstay-api`, `response_code_class = 5xx`
- 조건: 5분 동안 0 초과
- 알림 채널: 이메일

오류 내용은 **Cloud Run → fanstay-api → 로그** 탭에서 봅니다(`ERROR`, `Traceback` 검색).

### 비용 폭주 방지
`deploy.sh`는 최대 인스턴스를 3개로 제한해 배포합니다(`--max-instances 3`).

## 9. 운영: 업데이트·롤백·DB 변경

| 작업 | 방법 |
|------|------|
| 코드 업데이트 | `git checkout main && git pull` 후 `./deploy.sh all` (화면만 바뀌었으면 `web`, 백엔드만이면 `api`) |
| 모델(DB 구조) 변경 | 배포 전에 `./deploy.sh migrate` |
| 백엔드 롤백 | Cloud Run → fanstay-api → **버전** 탭에서 이전 버전에 트래픽 100% |
| 화면 롤백 | Firebase 콘솔 → Hosting → 출시 기록에서 이전 버전 **롤백** |
| 비밀값 변경 | `.env.deploy` 수정 → `./deploy.sh secrets` → `./deploy.sh api` |
| 반응 확인 | 관리자 `…run.app/admin/stats/` 또는 로컬에서 `.env.deploy`를 불러온 뒤 `manage.py stats` |
| 이미지 정리 | Artifact Registry → `cloud-run-source-deploy` 저장소에 정리 정책(최근 5개만 유지) 설정 |

## 10. 문제 해결

| 증상 | 원인과 해결 |
|------|-------------|
| `./deploy.sh api`에서 권한(`PERMISSION_DENIED`) 오류 | 2단계 4번 권한을 주고 몇 분 뒤 다시 실행합니다 |
| Cloud Run 시작 실패, 로그에 `DJANGO_SECRET_KEY must be set` | `./deploy.sh secrets`를 먼저 실행했는지, `secretAccessor` 권한이 있는지 확인합니다 |
| 사이트는 뜨는데 가입 시 "저장하지 못했습니다" | `https://<사이트>/api/health/`로 확인합니다. 404면 `firebase.json`의 서비스 이름·리전이 Cloud Run과 같은지, 500이면 Cloud Run 로그를 봅니다 |
| 가입 시 500, 로그에 DB 연결 오류 | `DATABASE_URL`, `sslmode=require`, `./deploy.sh migrate` 실행 여부를 확인합니다 |
| 관리자 로그인에서 403 CSRF | 관리자 페이지를 자체 도메인이 아니라 Cloud Run 주소(`…run.app/admin/`)로 엽니다 |
| 첫 요청이 몇 초 느림 | 서버리스 콜드 스타트입니다. 화면은 Firebase CDN이 바로 보여 주므로 가입 버튼을 누를 때만 영향이 있습니다. 광고 기간에 최소 인스턴스 1개를 두면 사라지지만 💳 비용이 생깁니다 |

## 11. 보안 체크리스트

- [ ] `.env.deploy`, 비밀번호, 키가 저장소·채팅·문서에 없다
- [ ] 운영 관리자 비밀번호는 로컬과 다른 강한 비밀번호다
- [ ] Google 계정에 2단계 인증을 켰다
- [ ] 개인정보 안내문(폼 동의 문구, 푸터 메타 픽셀 고지)이 실제 운영과 맞다. 문의 이메일이 정해지면 추가한다 (`plan.md` 17번)

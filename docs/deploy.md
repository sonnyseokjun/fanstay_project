# FANSTAY 배포 가이드 — 알리바바 클라우드 서버리스 (홍콩)

사전가입 사이트를 **서버리스로만** 배포하는 전체 과정입니다. 처음 배포할 때는 0단계부터 순서대로 진행하고, 이후 업데이트는 [11. 운영](#11-운영-업데이트롤백인증서-갱신)만 보면 됩니다.

- 👤 = 사용자가 직접 할 일 (계정 가입, 결제, 콘솔 설정)
- 🤖 = Claude Code에게 맡길 수 있는 일 (명령 실행, 코드·설정 수정)
- 💳 = 비용이 발생하는 단계

> 알리바바 클라우드 콘솔의 메뉴 이름과 위치는 자주 바뀝니다. 이 문서의 메뉴 경로와 다르면 콘솔 상단 검색창에서 서비스 이름(예: `Function Compute`)을 검색하세요.

---

## 0. 전체 구성

```
중국 사용자 (샤오홍슈 광고)
   │  https://<도메인>
   ▼
알리바바 DNS ── CNAME ──▶ Function Compute (홍콩, 서버리스)
                           └ 컨테이너 1개: React 화면 + Django API·관리자
                                 │                       │
                   이미지: ACR 개인판(홍콩)       로그: Log Service(SLS) → 오류 알림 메일
                                 │
                                 ▼
                           Neon PostgreSQL (싱가포르, 서버리스)
```

| 구성 요소 | 서비스 | 서버리스 | 비용 |
|-----------|--------|----------|------|
| 사이트 + API | Function Compute 3.0 커스텀 컨테이너 | ✅ 요청 없으면 0대 | 사용량 과금. 사전가입 규모면 월 몇 달러 이하로 예상 |
| 이미지 저장소 | Container Registry(ACR) 개인판 | 관리형 | 무료 (공개 미리보기, SLA 없음) |
| DB | Neon 무료 플랜 | ✅ 쓰지 않으면 자동 정지 | 무료 (저장 0.5GB) |
| 도메인 | 알리바바 클라우드 Domains (.com) | - | 💳 연 1~2만 원 |
| HTTPS 인증서 | Let's Encrypt | - | 무료 (약 60일마다 갱신) |
| 로그·오류 알림 | Log Service(SLS) | 관리형 | 무료 사용량 초과 시 소액 |
| CDN | **쓰지 않음** | - | - |

**CDN을 쓰지 않는 이유**
- Function Compute 홍콩 리전은 중국 본토에서 바로 접속됩니다. 다만 Google Cloud Run은 그렇지 않습니다.
- 사이트 파일도 작습니다(압축 후 약 100KB).
- CDN은 비용과 설정만 늘어나므로 처음에는 쓰지 않습니다. [10단계](#10-중국-본토-접속-검증) 측정에서 느린 지역이 많을 때 알리바바 CDN(가속 지역: 중국 본토 제외)을 추가합니다.

**ICP 비안이 필요 없는 이유**
- 홍콩 리전에 연결하는 도메인은 ICP 비안(중국 인터넷 사업자 등록)이 필요 없습니다.
- 중국 본토 리전(`cn-hangzhou`, `cn-shanghai` 등)은 쓰지 않습니다.

---

## 1. 알리바바 클라우드 국제판 가입과 결제 수단 👤

1. [alibabacloud.com](https://www.alibabacloud.com)에서 **Sign Up**(Free Account)을 누릅니다.
   - 반드시 **국제판**(alibabacloud.com)입니다. 중국판 aliyun.com이 아닙니다.
   - 이메일, 비밀번호, 국가(대한민국)를 입력하고 이메일 인증을 합니다.
   - 계정 유형은 **Individual(개인)**로 해도 됩니다. 사업자로 운영할 예정이면 Enterprise를 고릅니다.
2. 로그인한 뒤 결제 수단을 등록합니다.
   - 우측 상단 계정 메뉴에서 **Billing → Payment Methods**로 갑니다.
   - 해외 결제가 되는 Visa/Mastercard를 등록합니다.
   - 카드 확인용으로 소액이 결제됐다가 취소될 수 있습니다.
3. 도메인 구입 같은 일부 서비스에서 **본인 인증**(여권 등)을 요구할 수 있습니다. 요청이 오면 화면 안내에 따라 제출합니다.
4. **루트 계정 보안**을 설정합니다.
   - 계정 메뉴에서 **Security Settings**로 갑니다.
   - **MFA(2단계 인증)**를 켭니다. Google Authenticator 같은 OTP 앱을 쓰면 됩니다.

> 이후 모든 작업은 루트 계정이 아니라 2단계의 작업용 계정(RAM 사용자)으로 합니다.

## 2. 작업용 계정(RAM 사용자)과 AccessKey 👤

배포 명령이 알리바바 클라우드에 접근할 때 쓸 전용 계정입니다. 필요한 권한만 줍니다.

1. 콘솔 검색창에 `RAM`을 입력하고 **Resource Access Management**로 들어갑니다.
2. **Identities → Users → Create User**를 누릅니다.
   - Logon Name: `fanstay-deployer`
   - Access Mode: **Using permanent AccessKey to access**(OpenAPI 접근)에 체크합니다.
3. 생성되면 **AccessKey ID와 AccessKey Secret**이 한 번만 표시됩니다.
   - 비밀번호 관리자에 저장하거나 CSV로 내려받아 안전한 곳에 둡니다.
   - **채팅, 코드, 깃허브에 절대 붙여 넣지 마세요.**
4. 만든 사용자에서 **Add Permissions**를 누르고 아래 권한을 추가합니다.
   - `AliyunFCFullAccess`: Function Compute 배포
   - `AliyunContainerRegistryFullAccess`: 이미지 저장소
   - `AliyunLogFullAccess`: 로그(SLS)
   - `AliyunDNSFullAccess`: HTTPS 인증서 발급(8단계)
5. 콘솔 우측 상단 계정 메뉴에서 **계정 ID(Account ID, 숫자 16자리 정도)**를 확인해 메모합니다.
6. **루트 계정으로** 콘솔에서 **Function Compute**를 한 번 열어 둡니다.
   - 리전은 **China (Hong Kong)**을 고릅니다.
   - 처음 열 때 나오는 서비스 권한 승인(Authorize) 안내를 모두 승인합니다.
   - 이미지 가져오기와 로그 저장에 필요한 서비스 역할이 이때 만들어집니다.

## 3. 로컬 도구 준비 👤🤖

Git Bash 기준입니다.

1. **Docker Desktop**을 실행합니다(이미 설치돼 있음). 작업 표시줄의 고래 아이콘이 "Engine running"이 될 때까지 기다립니다.
   ```bash
   docker info --format '{{.ServerVersion}}'    # 버전이 나오면 준비 완료
   ```
2. **Serverless Devs**(알리바바 Function Compute 배포 도구)를 설치합니다.
   ```bash
   npm install -g @serverless-devs/s
   s -v
   ```
3. AccessKey를 등록합니다. 👤 키 값은 직접 입력합니다.
   ```bash
   s config add
   ```
   - 순서대로 나오는 질문에 답합니다.
     - 클라우드: **Alibaba Cloud (alibaba)**
     - AccountID: 2단계에서 메모한 계정 ID
     - AccessKeyID / AccessKeySecret: 2단계 값
     - alias: **`fanstay`**. `s.yaml`의 `access: fanstay`와 같아야 합니다
   - 키는 사용자 PC의 `~/.s/access.yaml`에만 저장되고 저장소에는 들어가지 않습니다.

## 4. 이미지 저장소 ACR 개인판 만들기 👤

1. 콘솔에서 **Container Registry**를 열고 리전을 **China (Hong Kong)**으로 고릅니다.
2. **Instance → Personal Edition**을 만들거나 엽니다. 무료입니다.
3. **Access Credential** 메뉴에서 레지스트리 로그인 비밀번호(Registry password)를 설정합니다.
4. **Namespace**를 만듭니다.
   - 이름은 예를 들어 `fanstay`로 합니다.
   - **Automatically Create Repository**는 끕니다.
5. **Repository → Create Repository**로 저장소를 만듭니다.
   - Namespace: `fanstay`
   - Repository Name: `fanstay`
   - Repository Type: **Private**
   - Code Source: **Local Repository**
6. 저장소 상세 화면의 로그인 명령을 복사해 실행합니다. 비밀번호는 3번에서 정한 값입니다.
   ```bash
   docker login --username=<화면에 표시된 사용자 이름> registry.cn-hongkong.aliyuncs.com
   ```
7. 이미지 주소는 `registry.cn-hongkong.aliyuncs.com/fanstay/fanstay` 형태입니다. 7단계의 `ACR_IMAGE_REPO`에 넣습니다.

## 5. 운영 DB — Neon 만들기 👤🤖

1. 👤 [neon.tech](https://neon.tech)에 가입합니다. GitHub 계정으로 가입할 수 있고, 카드는 필요 없습니다.
2. 👤 **Create project**를 누릅니다.
   - Project name: `fanstay`
   - Region: **AWS Asia Pacific (Singapore)**. 홍콩 Function Compute와 가장 가깝습니다
   - PostgreSQL 버전: 기본값
3. 👤 **Connect** 화면에서 연결 주소를 복사합니다.
   - **Connection pooling을 켠 주소**를 씁니다. 호스트에 `-pooler`가 들어갑니다.
   - 형태: `postgresql://<사용자>:<비밀번호>@<호스트>-pooler.<지역>.aws.neon.tech/<DB이름>?sslmode=require`
   - 이 주소가 `DATABASE_URL`입니다. 7단계에서 `.env.deploy`에 넣습니다.
4. 🤖 **테이블 생성과 관리자 계정**을 만듭니다. 로컬 PC에서 운영 DB에 직접 연결해 실행합니다.
   ```bash
   cd backend
   set -a; source ../.env.deploy; set +a      # DATABASE_URL을 불러옴
   .venv/Scripts/python manage.py migrate
   .venv/Scripts/python manage.py createsuperuser   # 👤 아이디·비밀번호는 직접 입력
   ```
   > 로컬의 관리자 계정은 로컬 SQLite에만 있습니다. **운영 DB에는 관리자 계정을 새로 만들어야 합니다.** 로컬 테스트 데이터는 옮기지 않습니다.

**백업:** Neon은 변경 기록으로 특정 시점 복구를 기본 제공합니다. 무료 플랜은 복구 가능 기간이 짧습니다(프로젝트 설정 → History retention에서 확인). 광고 기간에는 관리자 페이지의 가입 목록을 주기적으로 확인합니다.

## 6. 도메인 구입 👤💳

1. 콘솔에서 **Domains**(Domain Names)를 열고 원하는 이름을 검색합니다(예: `fanstay` 계열 `.com`).
2. 처음 구입하면 **도메인 소유자 정보 템플릿(Registrant Profile)**을 만들고 이메일 인증을 해야 합니다.
   - 영문 이름, 주소, 연락처를 입력합니다.
   - ICANN 규정에 따라 인증 메일을 확인해야 합니다.
3. 결제합니다. `.com`은 연 1~2만 원이고, 자동 갱신을 켜 두는 것을 권장합니다.
4. 도메인 상태가 **Normal**이 되면 **Alibaba Cloud DNS**에 자동으로 등록됩니다. 콘솔에서 `DNS`를 검색해 확인합니다.

> `.cn` 도메인은 중국 실명 인증이 필요하므로 고르지 않습니다.

## 7. 첫 배포 🤖

1. 배포 설정 파일을 만듭니다.
   ```bash
   cp deploy.env.example .env.deploy
   ```
   `.env.deploy`는 git에 올라가지 않습니다. 값을 채웁니다.
   | 값 | 어디서 |
   |----|--------|
   | `ACR_IMAGE_REPO` | 4단계. 예: `registry.cn-hongkong.aliyuncs.com/fanstay/fanstay` |
   | `DJANGO_SECRET_KEY` | `python -c "import secrets; print(secrets.token_urlsafe(50))"` 결과 |
   | `DJANGO_ALLOWED_HOSTS` | `<도메인>,www.<도메인>` |
   | `CSRF_TRUSTED_ORIGINS` | `https://<도메인>,https://www.<도메인>` |
   | `DATABASE_URL` | 5단계 Neon 주소 |
2. 배포할 코드가 모두 커밋된 상태에서 실행합니다.
   ```bash
   ./deploy.sh
   ```
   스크립트는 아래 순서로 실행됩니다.
   1. 이미지를 빌드합니다. 태그는 현재 커밋 번호입니다.
   2. ACR에 업로드합니다.
   3. `s deploy`로 Function Compute 함수 `fanstay-web`과 HTTP 트리거, 로그 설정을 만들거나 갱신합니다.
3. 콘솔의 **Function Compute → Functions → fanstay-web**에서 함수가 만들어졌는지 확인합니다.
   - 처음 배포한 뒤 이미지 가속 준비에 약 5분 걸릴 수 있습니다.

> **기본 주소(`*.fcapp.run`)로는 사이트 화면이 보이지 않습니다.** 보안 정책상 브라우저가 HTML을 파일로 내려받습니다. 정상 동작이고, 9단계에서 자체 도메인을 연결하면 해결됩니다. 기본 주소는 테스트용으로만 씁니다.

## 8. HTTPS 인증서 발급 (Let's Encrypt) 🤖👤

Docker로 [acme.sh](https://github.com/acmesh-official/acme.sh)를 실행합니다. 알리바바 DNS에 확인용 레코드를 자동으로 추가·삭제하며 인증서를 받습니다.

1. 👤 인증서 발급용 키 파일을 만듭니다. `.env.acme`는 git에 올라가지 않습니다.
   ```bash
   printf 'Ali_Key=%s\nAli_Secret=%s\n' '<AccessKey ID>' '<AccessKey Secret>' > .env.acme
   ```
2. 🤖 발급합니다. `<도메인>`을 실제 도메인으로 바꿔 실행합니다.
   ```bash
   mkdir -p certs
   MSYS_NO_PATHCONV=1 docker run --rm --env-file .env.acme -v "$(pwd -W)/certs:/acme.sh" \
     neilpang/acme.sh --issue --server letsencrypt --keylength 2048 --dns dns_ali \
     -d <도메인> -d www.<도메인>
   ```
3. 결과 파일이 만들어집니다. `certs/`도 git에 올라가지 않습니다.
   - 인증서: `certs/<도메인>/fullchain.cer`
   - 개인 키: `certs/<도메인>/<도메인>.key`

## 9. 자체 도메인 연결 👤

1. **DNS 레코드를 추가합니다.** 콘솔에서 **Alibaba Cloud DNS → 도메인 → Add Record**로 갑니다.
   | Type | Host | Value |
   |------|------|-------|
   | CNAME | `@` | `<계정ID>.cn-hongkong.fc.aliyuncs.com` |
   | CNAME | `www` | `<계정ID>.cn-hongkong.fc.aliyuncs.com` |
   - `@`(루트 도메인)에 CNAME을 추가할 수 없다는 오류가 나면 `www`만 먼저 연결합니다. 그 경우 `DJANGO_ALLOWED_HOSTS`의 첫 번째 값을 `www.<도메인>`으로 바꿉니다.
2. **Function Compute에 도메인을 연결합니다.** 홍콩 리전에서 **Function Compute → Custom Domains → Add Custom Domain**으로 갑니다.
   - Domain Name: `<도메인>`
   - Protocol: **HTTP, HTTPS**
   - HTTPS Certificate: **Manual Upload(직접 입력)**
     - 인증서(PEM): `certs/<도메인>/fullchain.cer`의 내용 전체
     - 개인 키(PEM): `certs/<도메인>/<도메인>.key`의 내용 전체
   - TLS: 기본값
   - Route
     - Path: `/*`
     - Function: `fanstay-web`
     - Version/Alias: `LATEST`
   - `www.<도메인>`도 같은 방법으로 한 번 더 추가합니다.
3. **확인합니다.**
   ```bash
   curl -I https://<도메인>/                 # 200, content-type: text/html
   curl https://<도메인>/api/health/          # {"status": "ok"}
   ```
   브라우저에서 `https://<도메인>`을 열어 중국어 화면과 `?lang=ko` 한국어 화면을 확인합니다.

## 10. 중국 본토 접속 검증 👤🤖

오픈 전에 반드시 합니다.

1. 👤 아래 두 사이트에 `https://<도메인>/`을 입력하고 측정합니다.
   - [17CE](https://www.17ce.com): HTTP 측정을 고르고 전국 노드로 설정합니다.
   - [ITDOG](https://www.itdog.cn/http/): HTTP 측정입니다.
2. 👤 결과 화면의 지역별 응답 코드와 시간을 캡처하거나 복사해 Claude Code에 전달합니다.
3. 🤖 결과를 정리해 보고합니다.
   - 판단 기준: 대부분 지역에서 응답 코드 **200**, 전체 로딩 **3초 이내**
   - 느린 지역이 많으면 알리바바 CDN 추가를 검토합니다.
4. 가능하면 중국에 있는 지인이 위챗과 샤오홍슈 앱 안의 브라우저로 **실제 가입 1건**을 해 봅니다. 그 가입이 관리자 페이지에 저장됐는지 확인합니다.

## 11. 운영: 업데이트·롤백·인증서 갱신

### 관리자와 통계
- 관리자 페이지: `https://<도메인>/admin/` (5단계에서 만든 계정)
- **반응 통계 화면:** `https://<도메인>/admin/stats/`. 관리자 첫 화면에도 링크가 있습니다.
  - 방문자 수, 사전가입 버튼 클릭 수, 가입 수와 전환율을 보여줍니다.
  - 버튼 위치별 클릭, 설문 응답 분포, 최근 14일 추이도 볼 수 있습니다.
  - 기간은 전체, 30일, 7일, 24시간 중에서 고릅니다.

### 코드 업데이트
```bash
git checkout main && git pull      # 머지된 코드로
./deploy.sh
```

### 롤백 (이전 버전으로 되돌리기)
```bash
git log --oneline                  # 되돌릴 커밋 번호 확인 (예: a1b2c3d)
./deploy.sh a1b2c3d                # 이미 올려 둔 그 이미지로 다시 배포
```

### DB 구조가 바뀐 경우 (모델 변경)
배포 전에 5단계 4번처럼 로컬에서 `DATABASE_URL`을 불러와 `manage.py migrate`를 실행합니다.

### HTTPS 인증서 갱신 (약 60일마다) 👤🤖
- Let's Encrypt 인증서는 유효 기간이 짧습니다. 캘린더에 **발급일 + 60일** 알림을 등록해 두세요.
- 갱신 방법
  1. 8단계 2번 명령에서 `--issue`를 `--renew`로 바꿔 실행합니다.
  2. 9단계 2번 화면(Custom Domains → 도메인 → Edit)에서 새 인증서와 키를 다시 붙여 넣습니다.
- 여러 번 반복하게 되면 자동화(GitHub Actions 예약 실행)를 추가합니다.

## 12. 오류 알림과 비용 관리 👤

### 오류 알림 (Log Service)
`s.yaml`의 `logConfig: auto` 설정으로 로그 저장소가 자동으로 만들어집니다. 저장되는 로그는 다음과 같습니다.
- 요청 기록(gunicorn access log)
- Django 오류(`ERROR ...`, `Traceback`)

1. **로그를 확인합니다.** **Function Compute → fanstay-web → Logs** 탭에서 볼 수 있습니다. 또는 **Log Service** 콘솔에서 자동 생성된 Project와 Logstore를 엽니다.
2. **알림 규칙을 만듭니다.** Log Service → Logstore에서 다음을 설정합니다.
   - 검색어: `ERROR or Traceback or "WORKER TIMEOUT"`
   - 검색 뒤 **Save as Alert**
     - 확인 주기: 5분
     - 조건: 결과 건수 > 0
     - 알림: 이메일 (알림 받을 연락처를 먼저 등록)
3. 테스트는 로그에 오류가 한 번 찍힌 뒤 메일이 오는지로 확인합니다.

### 비용 알림 💳
1. **Billing → Cost Management(Expenses and Costs) → Budgets**에서 월 예산을 만듭니다. 예: USD 10.
2. 예산의 80%와 100%에서 이메일 알림을 받도록 설정합니다.
3. (선택) Function Compute 함수 설정에서 **최대 인스턴스 수**를 제한합니다. 예: 10. 비정상 트래픽으로 비용이 폭주하는 것을 막습니다.

## 13. 문제 해결

| 증상 | 원인과 해결 |
|------|-------------|
| `./deploy.sh`: `커밋하지 않은 변경이 있습니다` | 이미지 태그를 커밋 번호로 정하므로 커밋 후 실행합니다 |
| `docker push` 권한 오류 | 4단계 6번 `docker login`을 다시 합니다 |
| `s deploy`에서 권한(Forbidden/NoPermission) 오류 | RAM 사용자 권한을 확인합니다(2단계 4번). 역할 관련 오류(`PassRole`, `role`)는 2단계 6번의 서비스 권한 승인을 루트 계정으로 다시 확인합니다 |
| 사이트에서 **400 Bad Request** | `DJANGO_ALLOWED_HOSTS`에 접속한 도메인이 없습니다 |
| 관리자 로그인에서 **403 CSRF** | `CSRF_TRUSTED_ORIGINS`에 `https://<도메인>`이 없습니다 |
| 가입 시 **500** 오류, 로그에 DB 연결 오류 | `DATABASE_URL`, `sslmode=require` 여부, Neon 프로젝트 상태를 확인합니다 |
| 첫 접속이 몇 초 느림 | 서버리스 콜드 스타트입니다(함수 인스턴스와 Neon이 모두 쉬고 있을 때). 광고 기간에만 최소 인스턴스 1개를 두는 방법이 있으나 💳 비용이 생깁니다 |
| 브라우저에서 HTML이 내려받아짐 | 기본 `*.fcapp.run` 주소로 접속한 경우입니다. 자체 도메인으로 접속합니다 |

## 14. 보안 체크리스트
- [ ] 루트 계정 MFA를 켰다
- [ ] AccessKey, DB 비밀번호, SECRET_KEY가 저장소, 채팅, 문서에 없다. `.env.deploy`, `.env.acme`, `certs/`는 git에서 제외돼 있다
- [ ] 운영 관리자 비밀번호는 로컬과 다른 강한 비밀번호다
- [ ] 개인정보(PIPL): 중국 거주자 연락처를 해외(싱가포르 DB)에 저장한다. 오픈 전 동의 안내문 보완 여부를 검토한다 (`plan.md` 16번)

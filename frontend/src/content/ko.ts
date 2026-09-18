import type { Content } from './types'

const ko: Content = {
  meta: {
    title: 'FANSTAY｜서울 한 달 살기 리빙팩 사전가입',
    description: '방은 예약할 수 있지만 한국에서의 생활은 예약할 수 없습니다. FANSTAY는 서울에서의 30일을 하나의 상품으로 만듭니다. 지금 사전가입을 받고 있습니다.',
    htmlLang: 'ko',
  },
  header: { cta: '사전가입', switchTo: 'zh', switchLabel: '中文', home: 'FANSTAY 홈', skipToForm: '사전가입 양식으로 건너뛰기' },

  hero: {
    headline: ['방은 예약할 수 있지만', '한국에서의 생활은', '예약할 수 없습니다.'],
    body: 'FANSTAY는 숙소를 중심으로 서울에서의 30일을 하나의 상품으로 만듭니다. 보증금 없는 풀옵션 집, 걸어서 15분 안의 생활 편의, 살아봐야 알 수 있는 한국식 라이프스타일까지 함께 담았습니다.',
    cta: '사전가입하기',
    note: '무료로 가입하고, 오픈 소식을 가장 먼저 받아보세요',
    map: {
      home: '내 집',
      radius: '도보 15분',
      mart: '마트',
      laundry: '빨래방',
      pharmacy: '약국',
      gym: '피트니스',
      cafe: '카페',
      clinic: '피부과',
      line: '2호선',
      alt: '숙소를 중심으로 도보 15분 반경 안에 마트, 빨래방, 약국, 피트니스, 카페, 피부과가 있는 서울 동네 지도 일러스트',
    },
  },

  problems: {
    title: '서울에서 한 달 살기, 무엇이 어려울까요?',
    intro: '한국에서 2주에서 3개월을 지내려는 사람이라면 한 번쯤 검색해 본 질문들입니다.',
    items: [
      {
        query: '서울 호텔 한 달 너무 비쌈',
        title: '호텔에서 한 달, 예산이 버티지 못합니다',
        body: '장기 투숙 호텔 비용은 개인 여행 예산을 크게 넘습니다. 취사도 세탁도 어려워 지낼수록 지칩니다.',
      },
      {
        query: '외국인 한국 월세 보증금',
        title: '월세를 구하려 해도 문턱이 높습니다',
        body: '일반 월세는 보증금이 크고 계약 절차가 복잡합니다. 외국인등록증이 없고 말이 잘 통하지 않으면 중개사무소를 통한 계약은 사실상 어렵습니다.',
      },
      {
        query: '서울 분리수거 방법',
        title: '여행 정보에는 실제 생활 정보가 없습니다',
        body: '기존 플랫폼은 관광지 정보가 대부분입니다. 분리배출, 동네 장보기, 심야 약국처럼 매일 부딪히는 문제는 알려주지 않습니다.',
      },
      {
        query: '서울 장기체류 앱 추천',
        title: '검색부터 정착까지 앱을 여러 번 옮겨 다녀야 합니다',
        body: '샤오홍슈에서 찾아보고, 여행 플랫폼에서 예약하고, 지도 앱으로 길을 찾는 모든 단계가 따로 놉니다.',
      },
    ],
  },

  solution: {
    title: '숙소를 중심으로, 30일 생활권을 하나로 묶었습니다',
    intro: '집만 찾아주는 것이 아니라 주거, 일상, 한국식 경험을 하나의 리빙팩에 담습니다.',
    ringAlt: '세 겹의 동심원: 가운데는 집, 두 번째는 도보 15분 생활권, 가장 바깥은 동네의 한국식 라이프스타일',
    layers: [
      {
        key: 'home',
        name: '주거 공간',
        ringLabel: '집',
        title: '30일 바로 입주하는 풀옵션 집',
        points: ['가전, 가구, 초고속 인터넷 완비', '보증금 없이, 복잡한 임대차 계약 없이'],
      },
      {
        key: 'daily',
        name: '생활권',
        ringLabel: '도보 15분',
        title: '걸어서 15분 안의 생활 필수 거점',
        points: ['마트, 빨래방, 피트니스 제휴 할인', '외국인 친화 병의원과 약국 안내'],
      },
      {
        key: 'klife',
        name: '한국형 라이프스타일',
        ringLabel: '동네',
        title: '살아봐야 경험할 수 있는 서울',
        points: ['피부과, 헤어살롱, 웰니스 프로그램 바우처', '트렌드 상권의 로컬 문화, 미식, 커뮤니티'],
      },
    ],
  },

  neighborhoods: {
    title: '어떤 서울에서 살고 싶은지부터 고르세요',
    intro: '먼저 세 곳의 생활권으로 시작합니다. 모두 지하철 2호선 역입니다.',
    lineName: '2호선',
    items: [
      {
        code: 'seongsu',
        stationNo: '211',
        nameKo: '성수',
        nameLocal: '圣水',
        nameEn: 'Seongsu',
        theme: '붉은 벽돌 공장 사이의 크리에이티브 동네',
        body: '오래된 공장이 카페, 편집숍, 팝업 공간으로 바뀐 곳. 매일 새로운 가게를 둘러보며 영감을 얻고 싶은 사람에게 맞습니다.',
        tags: ['카페', '팝업스토어', '디자인'],
      },
      {
        code: 'hongdae',
        stationNo: '239',
        nameKo: '홍대입구',
        nameLocal: '弘大',
        nameEn: 'Hongik Univ.',
        theme: '젊은 인디 문화의 동네',
        body: '버스킹, 독립서점, 밤 문화가 모여 있는 곳. 새 친구를 사귀고 취미 커뮤니티에 참여하고 싶은 사람에게 맞습니다.',
        tags: ['버스킹', '독립서점', '취미 커뮤니티'],
      },
      {
        code: 'gangnam',
        stationNo: '222',
        nameKo: '강남',
        nameLocal: '江南',
        nameEn: 'Gangnam',
        theme: '뷰티와 웰니스의 중심',
        body: '피부과, 헤어살롱, 피트니스가 가장 밀집한 곳. 피부 관리와 몸 관리에 집중하고 싶은 사람에게 맞습니다.',
        tags: ['피부과', '헤어', '피트니스'],
      },
    ],
  },

  journey: {
    title: '샤오홍슈에서 발견하고, 서울에 자리 잡기까지',
    intro: '방 하나를 고르는 게 아니라, 서울에서 어떤 생활을 할지 고릅니다.',
    steps: [
      { title: '발견', body: '샤오홍슈 등에서 동네별 서울 라이프스타일을 둘러봅니다.' },
      { title: 'AI 리빙 컨시어지', body: 'AI Living Concierge가 나이, 예산, 취향을 바탕으로 나에게 맞는 조건을 정리합니다.' },
      { title: '생활권 매칭', body: '성수, 홍대, 한남 등에서 나에게 맞는 집과 생활 인프라를 연결합니다.' },
      { title: '리빙팩 선택과 예약', body: '집과 생활 서비스가 묶인 리빙팩을 한 번에 예약합니다.' },
      { title: '입주 가이드', body: '예약하면 바로 나만의 로컬 가이드와 생활권 혜택이 열립니다.' },
    ],
  },

  packs: {
    title: '리빙팩 예시',
    intro: '오픈 전 예시 구성과 가격대입니다. 실제 가격은 오픈할 때 공개합니다. 위안화 금액은 환율로 환산한 추정치입니다.',
    perPeriod: '/ 30일',
    includesLabel: '포함 내역',
    cta: '이 리빙팩으로 사전가입',
    items: [
      {
        area: 'seongsu',
        name: '성수 크리에이티브 리빙팩',
        forWhom: '카페, 디자인, 새로운 가게를 좋아한다면',
        pricePrimary: '₩1,400,000–1,800,000',
        priceSecondary: '약 ¥7,200–9,200',
        includes: ['30일 풀옵션 집, 보증금 없음', '마트, 빨래방 제휴 할인', '성수 카페·팝업 지도', '디자인 워크숍 1회'],
      },
      {
        area: 'hongdae',
        name: '홍대 커뮤니티 리빙팩',
        forWhom: '친구를 사귀고 모임에 나가고 싶다면',
        pricePrimary: '₩1,300,000–1,600,000',
        priceSecondary: '약 ¥6,700–8,200',
        includes: ['30일 풀옵션 집, 보증금 없음', '마트, 빨래방 제휴 할인', '취미 커뮤니티 모임 2회', '한식 쿠킹 클래스 1회'],
      },
      {
        area: 'gangnam',
        name: '강남 뷰티 리빙팩',
        forWhom: '피부 관리와 운동에 집중하고 싶다면',
        pricePrimary: '₩1,800,000–2,300,000',
        priceSecondary: '약 ¥9,200–11,800',
        includes: ['30일 풀옵션 집, 보증금 없음', '피트니스 30일 회원권', '피부과, 헤어 바우처', '중국어 병원·약국 안내'],
      },
    ],
  },

  signup: {
    title: 'FANSTAY 사전가입',
    intro: '연락처를 남기면 오픈 소식을 가장 먼저 알려드립니다. 아래 질문은 모두 선택이며, 리빙팩을 더 잘 만드는 데 쓰입니다.',
    benefits: [],
    required: '필수',
    optional: '선택',
    contactLegend: '연락처',
    contactTypes: [
      { value: 'email', label: '이메일' },
      { value: 'wechat', label: '위챗 ID' },
    ],
    contactPlaceholder: { email: 'name@example.com', wechat: '위챗 ID' },
    name: { label: '이름', placeholder: '어떻게 불러드릴까요' },
    age: {
      label: '연령대',
      placeholder: '선택하세요',
      options: [
        { value: 'under_20', label: '20세 미만' },
        { value: '20_24', label: '20–24세' },
        { value: '25_29', label: '25–29세' },
        { value: '30_34', label: '30–34세' },
        { value: '35_39', label: '35–39세' },
        { value: '40_plus', label: '40세 이상' },
      ],
    },
    city: { label: '거주 도시', placeholder: '예: 상하이' },
    surveyLegend: '몇 가지 질문',
    surveyIntro: '건너뛰어도 괜찮습니다.',
    visit: {
      label: '언제쯤 한국에 올 예정인가요?',
      placeholder: '선택하세요',
      options: [
        { value: 'within_1_month', label: '1개월 이내' },
        { value: '1_3_months', label: '1–3개월 후' },
        { value: '3_6_months', label: '3–6개월 후' },
        { value: '6_12_months', label: '6–12개월 후' },
        { value: 'undecided', label: '아직 모르겠음' },
      ],
    },
    stay: { label: '며칠 머물 계획인가요?', unit: '일', quick: [14, 30, 60, 90], hint: '직접 입력하거나 자주 고르는 일수를 누르세요' },
    areas: {
      label: '관심 있는 동네 (복수 선택)',
      options: [
        { value: 'seongsu', label: '성수' },
        { value: 'hongdae', label: '홍대' },
        { value: 'gangnam', label: '강남' },
        { value: 'hannam', label: '한남' },
      ],
    },
    services: {
      label: '경험하고 싶은 서비스 (복수 선택)',
      options: [
        { value: 'k_beauty', label: '피부과·K-뷰티' },
        { value: 'hair_salon', label: '헤어살롱' },
        { value: 'fitness', label: '피트니스' },
        { value: 'spa_wellness', label: '스파·웰니스' },
        { value: 'cooking_class', label: '한식 쿠킹 클래스' },
        { value: 'local_community', label: '취미 커뮤니티' },
        { value: 'airport_transfer', label: '공항 픽업·샌딩' },
        { value: 'sim_data', label: '유심·데이터' },
        { value: 'cleaning_laundry', label: '청소·세탁 대행' },
        { value: 'medical_support', label: '중국어 병원 이용 지원' },
      ],
    },
    budget: {
      label: '30일 리빙팩에 얼마까지 낼 수 있나요?',
      placeholder: '선택하세요',
      options: [
        { value: 'under_5k', label: '¥5,000 미만' },
        { value: '5k_8k', label: '¥5,000–8,000' },
        { value: '8k_12k', label: '¥8,000–12,000' },
        { value: '12k_16k', label: '¥12,000–16,000' },
        { value: 'over_16k', label: '¥16,000 이상' },
        { value: 'not_sure', label: '아직 모르겠음' },
      ],
    },
    consent: {
      label: 'FANSTAY가 위 정보를 수집하고 이용하는 데 동의합니다',
      notice:
        '이 페이지에 입력한 연락처와 설문 응답만 수집하며, 오픈 알림과 서비스 조사에만 사용하고 제3자에게 제공하지 않습니다. 언제든 삭제를 요청할 수 있습니다.',
    },
    submit: '사전가입 완료하기',
    submitting: '가입하는 중…',
    errors: {
      contactRequired: '이메일 또는 위챗 ID를 입력하세요',
      invalidEmail: '이메일 형식이 올바르지 않습니다. 다시 확인해 주세요',
      invalidWechat: '위챗 ID는 영문, 숫자, 밑줄(_), 하이픈(-)으로 5–40자입니다',
      stayDays: '1–365 사이의 숫자로 입력하세요',
      consentRequired: '동의에 체크한 뒤 사전가입을 완료하세요',
      throttled: '요청이 너무 많습니다. 잠시 후 다시 시도하세요',
      network: '가입이 완료되지 않았습니다. 네트워크를 확인한 뒤 다시 시도하세요',
    },
  },

  thanks: {
    title: '사전가입이 완료되었습니다',
    position: (n) => `${n}번째 사전가입자입니다`,
    already: (n) => `이미 사전가입하셨습니다. ${n}번째 가입자입니다`,
    body: 'FANSTAY가 오픈하면 남겨주신 연락처로 가장 먼저 알려드립니다.',
    shareTitle: '서울 한 달 살기, 같이 갈 친구가 있나요?',
    shareButton: '친구에게 공유하기',
    shareText: '방은 예약할 수 있지만 한국에서의 생활은 예약할 수 없습니다. FANSTAY에서 서울 한 달 살기 사전가입을 받고 있어요:',
    copied: '링크를 복사했습니다. 위챗이나 샤오홍슈에 붙여넣으세요',
    copyFailed: '자동 복사에 실패했습니다. 주소창의 링크를 직접 복사하세요',
    back: '처음으로 돌아가기',
  },

  faq: {
    title: '자주 묻는 질문',
    items: [
      { q: '사전가입에 비용이 드나요?', a: '들지 않습니다. 사전가입은 무료이며 예약이나 결제가 발생하지 않습니다.' },
      { q: '언제 오픈하나요?', a: '오픈 일정이 정해지면 남겨주신 이메일이나 위챗 ID로 알려드립니다.' },
      { q: '얼마나 머물 수 있나요?', a: 'FANSTAY는 2주에서 3개월의 중장기 체류를 위한 서비스이며, 리빙팩은 30일 단위로 구성합니다.' },
      {
        q: '보증금이나 복잡한 계약이 필요한가요?',
        a: '보증금은 없습니다. 집과 생활 서비스를 하나의 상품으로 묶어, 일반 월세처럼 복잡한 임대차 계약을 하지 않아도 됩니다.',
      },
      {
        q: '외국인등록증이 없어도 머물 수 있나요?',
        a: 'FANSTAY는 한국에 중단기로 머무는 외국인을 위해 설계했으며, 직접 중개사무소를 통해 계약할 필요가 없습니다. 입주에 필요한 서류는 오픈 시 안내합니다.',
      },
      { q: '중국어로 이용할 수 있나요?', a: '네. 중국어 페이지와 중국어 고객센터, 중국에서 많이 쓰는 결제 수단을 지원할 계획입니다.' },
      { q: '페이지의 가격이 최종 가격인가요?', a: '아닙니다. 현재는 예시 가격대이며, 실제 가격은 동네, 집 형태, 입주 시기에 따라 오픈 시 공개합니다.' },
    ],
  },

  footer: {
    tagline: '서울에서, 머무는 것을 넘어 살아보기.',
    note: '이 페이지는 FANSTAY 오픈 전 사전가입 페이지입니다.',
    copyright: '© 2026 FANSTAY',
  },
}

export default ko

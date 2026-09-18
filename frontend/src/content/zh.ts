import type { Content } from './types'

const zh: Content = {
  meta: {
    title: 'FANSTAY｜首尔一个月生活包 预注册',
    description: '房间订得到，在韩国的生活却订不到。FANSTAY 把30天的首尔生活打包成一个产品，现在开放预注册。',
    htmlLang: 'zh-CN',
  },
  header: { cta: '预注册', switchTo: 'ko', switchLabel: '한국어', home: 'FANSTAY 首页', skipToForm: '跳到预注册表单' },

  hero: {
    headline: ['房间订得到，', '在韩国的生活', '却订不到。'],
    body: 'FANSTAY 以住处为中心，把30天的首尔生活打包成一个产品：免押金的整套住房、步行15分钟内的生活所需，再加上只有住下来才能体验的韩式生活。',
    cta: '立即预注册',
    note: '免费预注册，上线后第一时间通知你',
    map: {
      home: '你的家',
      radius: '步行15分钟',
      mart: '超市',
      laundry: '自助洗衣',
      pharmacy: '药店',
      gym: '健身房',
      cafe: '咖啡馆',
      clinic: '皮肤科',
      line: '2号线',
      alt: '以住处为中心、步行15分钟范围内有超市、自助洗衣店、药店、健身房、咖啡馆和皮肤科的首尔街区地图插画',
    },
  },

  problems: {
    title: '在首尔住上一个月，难在哪里？',
    intro: '想在韩国住2周到3个月的你，大概也搜过这些问题。',
    items: [
      {
        query: '首尔 酒店 住一个月 太贵',
        title: '住酒店一个月，预算撑不住',
        body: '长住酒店的费用远超个人旅行预算。而且没法做饭、洗衣，越住越累。',
      },
      {
        query: '外国人 韩国租房 押金',
        title: '想租房，门槛却太高',
        body: '普通月租要交高额押金、签复杂合同。没有外国人登录证、语言又不通，很难通过中介直接签约。',
      },
      {
        query: '首尔 垃圾分类 怎么扔',
        title: '攻略里找不到真实的生活信息',
        body: '现有平台大多只讲景点。垃圾怎么分类、去哪里买菜、深夜哪家药店开门，这些日常问题没人告诉你。',
      },
      {
        query: '首尔长住 用什么app',
        title: '从种草到落地，要在好几个App之间来回切换',
        body: '在小红书找灵感、在旅行平台订房、再用本地地图App找路，每一步都是断开的。',
      },
    ],
  },

  solution: {
    title: '以住处为中心，把30天生活圈打包给你',
    intro: '不只是帮你找房，而是把住处、日常生活和韩式体验放进同一个生活包。',
    ringAlt: '三层同心圆：中心是住处，第二层是步行15分钟生活圈，最外层是街区里的韩式生活',
    layers: [
      {
        key: 'home',
        name: '住处',
        ringLabel: '家',
        title: '30天拎包入住的整套房',
        points: ['家电、家具、高速网络一应俱全', '免押金，不用签复杂的租房合同'],
      },
      {
        key: 'daily',
        name: '生活圈',
        ringLabel: '步行15分钟',
        title: '步行15分钟内的生活所需',
        points: ['超市、自助洗衣店、健身房合作优惠', '对外国人友好的医院和药店指南'],
      },
      {
        key: 'klife',
        name: '韩式生活',
        ringLabel: '街区',
        title: '只有住下来才能体验的首尔',
        points: ['皮肤科、美发沙龙、身心疗愈项目券', '潮流街区里的本地文化、美食和社群'],
      },
    ],
  },

  neighborhoods: {
    title: '先选你想过哪一种首尔生活',
    intro: '我们先从这三个生活圈开始，它们都在地铁2号线上。',
    lineName: '2号线',
    items: [
      {
        code: 'seongsu',
        stationNo: '211',
        nameKo: '성수',
        nameLocal: '圣水',
        nameEn: 'Seongsu',
        theme: '红砖工厂里的创意街区',
        body: '老工厂改造成咖啡馆、买手店和快闪空间。适合想每天逛新店、找灵感的你。',
        tags: ['咖啡馆', '快闪店', '设计'],
      },
      {
        code: 'hongdae',
        stationNo: '239',
        nameKo: '홍대입구',
        nameLocal: '弘大',
        nameEn: 'Hongik Univ.',
        theme: '年轻人的独立文化街区',
        body: '街头演出、独立书店和夜生活都在这里。适合想认识新朋友、参加兴趣社群的你。',
        tags: ['街头演出', '独立书店', '兴趣社群'],
      },
      {
        code: 'gangnam',
        stationNo: '222',
        nameKo: '강남',
        nameLocal: '江南',
        nameEn: 'Gangnam',
        theme: '美容与健康管理中心',
        body: '皮肤科、美发沙龙和健身房最密集的地方。适合想认真护肤、好好管理身体的你。',
        tags: ['皮肤科', '美发', '健身'],
      },
    ],
  },

  journey: {
    title: '从刷到小红书，到在首尔安顿下来',
    intro: '你选的不是一间房，而是想在首尔过怎样的生活。',
    steps: [
      { title: '发现', body: '在小红书等平台，看到不同街区的首尔生活方式。' },
      { title: 'AI 生活顾问', body: 'AI Living Concierge 根据你的年龄、预算和喜好，整理出适合你的条件。' },
      { title: '匹配生活圈', body: '在圣水、弘大、汉南等街区，匹配适合你的住处和生活设施。' },
      { title: '选择生活包并预订', body: '住处和生活服务打包在一起，一次完成预订。' },
      { title: '入住指南', body: '预订后立即开启专属本地指南，生活圈优惠同步到手。' },
    ],
  },

  packs: {
    title: '生活包示例',
    intro: '以下为上线前的示例内容和价格区间，正式价格以上线时公布为准。人民币金额按汇率估算。',
    perPeriod: '/ 30天',
    includesLabel: '包含',
    cta: '预注册这个生活包',
    items: [
      {
        area: 'seongsu',
        name: '圣水创意生活包',
        forWhom: '适合喜欢咖啡馆、设计和新店的你',
        pricePrimary: '¥7,200–9,200',
        priceSecondary: '约 ₩1,400,000–1,800,000',
        includes: ['30天整套公寓，免押金', '超市、自助洗衣店合作优惠', '圣水咖啡馆与快闪店地图', '设计工作坊体验1次'],
      },
      {
        area: 'hongdae',
        name: '弘大社群生活包',
        forWhom: '适合想交朋友、参加活动的你',
        pricePrimary: '¥6,700–8,200',
        priceSecondary: '约 ₩1,300,000–1,600,000',
        includes: ['30天整套公寓，免押金', '超市、自助洗衣店合作优惠', '兴趣社群活动2次', '韩式料理烹饪课1次'],
      },
      {
        area: 'gangnam',
        name: '江南美容生活包',
        forWhom: '适合想护肤、健身、调整状态的你',
        pricePrimary: '¥9,200–11,800',
        priceSecondary: '约 ₩1,800,000–2,300,000',
        includes: ['30天整套公寓，免押金', '健身房30天会员', '皮肤科、美发项目券', '中文就医与药店指南'],
      },
    ],
  },

  signup: {
    title: '预注册 FANSTAY',
    intro: '留下联系方式，上线后第一时间通知你。下面的问题都是选填，能帮我们把生活包做得更适合你。',
    benefits: [],
    required: '必填',
    optional: '选填',
    contactLegend: '联系方式',
    contactTypes: [
      { value: 'email', label: '邮箱' },
      { value: 'wechat', label: '微信号' },
    ],
    contactPlaceholder: { email: 'name@example.com', wechat: '你的微信号' },
    name: { label: '称呼', placeholder: '怎么称呼你' },
    age: {
      label: '年龄段',
      placeholder: '请选择',
      options: [
        { value: 'under_20', label: '20岁以下' },
        { value: '20_24', label: '20–24岁' },
        { value: '25_29', label: '25–29岁' },
        { value: '30_34', label: '30–34岁' },
        { value: '35_39', label: '35–39岁' },
        { value: '40_plus', label: '40岁及以上' },
      ],
    },
    city: { label: '现居城市', placeholder: '例如：上海' },
    surveyLegend: '几个小问题',
    surveyIntro: '都可以跳过。',
    visit: {
      label: '预计什么时候来韩国？',
      placeholder: '请选择',
      options: [
        { value: 'within_1_month', label: '1个月内' },
        { value: '1_3_months', label: '1–3个月后' },
        { value: '3_6_months', label: '3–6个月后' },
        { value: '6_12_months', label: '6–12个月后' },
        { value: 'undecided', label: '还没确定' },
      ],
    },
    stay: { label: '打算住多少天？', unit: '天', quick: [14, 30, 60, 90], hint: '可以直接输入，或点选常见天数' },
    areas: {
      label: '对哪些街区感兴趣？（可多选）',
      options: [
        { value: 'seongsu', label: '圣水' },
        { value: 'hongdae', label: '弘大' },
        { value: 'gangnam', label: '江南' },
        { value: 'hannam', label: '汉南' },
      ],
    },
    services: {
      label: '想体验哪些服务？（可多选）',
      options: [
        { value: 'k_beauty', label: '皮肤科与韩式护肤' },
        { value: 'hair_salon', label: '美发沙龙' },
        { value: 'fitness', label: '健身房' },
        { value: 'spa_wellness', label: '水疗与身心疗愈' },
        { value: 'cooking_class', label: '韩式料理烹饪课' },
        { value: 'local_community', label: '兴趣社群活动' },
        { value: 'airport_transfer', label: '机场接送' },
        { value: 'sim_data', label: '电话卡与流量' },
        { value: 'cleaning_laundry', label: '保洁与洗衣代办' },
        { value: 'medical_support', label: '中文就医协助' },
      ],
    },
    budget: {
      label: '一个30天生活包，你愿意付多少？',
      placeholder: '请选择',
      options: [
        { value: 'under_5k', label: '¥5,000 以下' },
        { value: '5k_8k', label: '¥5,000–8,000' },
        { value: '8k_12k', label: '¥8,000–12,000' },
        { value: '12k_16k', label: '¥12,000–16,000' },
        { value: 'over_16k', label: '¥16,000 以上' },
        { value: 'not_sure', label: '还不确定' },
      ],
    },
    consent: {
      label: '我同意 FANSTAY 收集和使用以上信息',
      notice:
        '我们只收集你在本页面填写的联系方式和问卷回答，仅用于上线通知和服务调研，不会提供给第三方。你可以随时要求删除这些信息。',
    },
    submit: '提交预注册',
    submitting: '正在提交…',
    errors: {
      contactRequired: '请填写邮箱或微信号',
      invalidEmail: '邮箱格式不正确，请检查后重新填写',
      invalidWechat: '微信号需为5–40位字母、数字、下划线或减号',
      stayDays: '天数请填写1–365之间的数字',
      consentRequired: '请先勾选同意，再提交预注册',
      throttled: '提交次数太多，请稍后再试',
      network: '提交没有成功。请检查网络后再试一次',
    },
  },

  thanks: {
    title: '预注册完成',
    position: (n) => `你是第 ${n} 位预注册用户`,
    already: (n) => `你之前已经预注册过了，是第 ${n} 位`,
    body: 'FANSTAY 上线时，我们会通过你留下的联系方式第一时间通知你。',
    shareTitle: '想找人一起来首尔住一个月？',
    shareButton: '分享给朋友',
    shareText: '房间订得到，在韩国的生活却订不到。FANSTAY 把30天的首尔生活打包成一个产品，一起来预注册吧：',
    copied: '链接已复制，可以粘贴到微信或小红书',
    copyFailed: '没能自动复制，请手动复制浏览器地址栏里的链接',
    back: '返回首页',
  },

  faq: {
    title: '常见问题',
    items: [
      { q: '预注册需要付费吗？', a: '不需要。预注册完全免费，也不会产生任何预订。' },
      { q: '什么时候正式上线？', a: '上线时间确定后，我们会通过你留下的邮箱或微信号通知你。' },
      { q: '可以住多久？', a: 'FANSTAY 面向2周到3个月的中长期居住，生活包以30天为基本单位设计。' },
      {
        q: '需要交押金、签复杂的合同吗？',
        a: '不需要押金。住处和生活服务打包成一个产品，不用像普通月租那样签复杂的租房合同。',
      },
      {
        q: '没有外国人登录证也能住吗？',
        a: 'FANSTAY 专为来韩国中短期居住的外国人设计，不需要自己通过中介签租房合同。入住所需的具体材料会在上线时公布。',
      },
      { q: '有中文服务吗？', a: '有。我们计划提供中文页面和中文客服，并支持中国用户常用的支付方式。' },
      { q: '页面上的价格是最终价格吗？', a: '不是。目前是示例区间，实际价格会按街区、房型和入住时间，在上线时公布。' },
    ],
  },

  footer: {
    tagline: '在首尔，不只是住下，而是生活。',
    note: '本页面为 FANSTAY 上线前的预注册页面。',
    copyright: '© 2026 FANSTAY',
  },
}

export default zh

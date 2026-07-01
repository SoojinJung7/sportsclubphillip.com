// ---------------------------------------------------------------------------
// Central site data: navigation, contact/footer, social links, image sources.
// Editing anything here updates it across all 14 pages at once.
// ---------------------------------------------------------------------------

export const SITE = {
  name: '스포츠클럽필립',
  nameEn: 'Sports Club Phillip',
  tagline: '분당 최대 토탈 휘트니스',
  ceo: '정승만',
  address: '경기도 성남시 내정로58',
  bizNo: '207-81-50319',
  phone: '031-728-7777',
  fax: '031.728.7723',
  email: 'master@ballykorea.co.kr',
  hours: [
    { d: '평일', t: 'AM 09:00 - PM 10:00' },
    { d: '토요일', t: 'AM 09:00 - PM 09:00' },
    { d: '일요일', t: 'PM 12:00 - PM 18:00' },
    { d: '휴관일', t: '상담 불가' },
  ],
};

// External links
export const EXTERNAL = {
  naverBooking: 'https://m.booking.naver.com/booking/6/bizes/330673/items/3359134',
  kakao: 'https://pf.kakao.com/_TLeGu',
  instagram: 'https://www.instagram.com/sportsclub_phillip/',
  facebook: 'https://www.facebook.com/sportsclubphillip',
  naverBlog: 'https://blog.naver.com/ballydesign',
  naverMap: 'https://naver.me/5A3IVUZi',
};

// Primary navigation with dropdowns (mirrors the original Wix menu)
export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };
export const NAV: NavItem[] = [
  { label: 'HOME', href: '/' },
  {
    label: 'ABOUT',
    href: '/about',
    children: [
      { label: '회사소개', href: '/about' },
      { label: '운영시간 / 오시는길', href: '/operating' },
    ],
  },
  {
    label: 'PROGRAMS / FACILITIES',
    href: '/projects',
    children: [{ label: '프로그램 / 시설 둘러보기', href: '/projects' }],
  },
  {
    label: 'PROMOTION / SCHEDULE',
    href: '/promotion',
    children: [
      { label: '이달의 프로모션', href: '/promotion' },
      { label: '운영일 안내 / GX스케줄', href: '/schedule' },
      { label: '수영 강습 스케줄', href: '/swimminglesson' },
    ],
  },
  {
    label: 'ACADEMY',
    href: '/academy',
    children: [
      { label: 'ACADEMY', href: '/academy' },
      { label: '사단법인대한필라테스협회', href: '/kpa' },
      { label: '발리유소년스포츠클럽', href: '/bally' },
      { label: '더스파이럴분당', href: '/thespiralbundang' },
    ],
  },
];

export const SOCIALS = [
  { key: 'kakao', label: 'KakaoTalk', href: EXTERNAL.kakao, img: 'iconKakao' as const },
  { key: 'instagram', label: 'Instagram', href: EXTERNAL.instagram, img: 'iconInstagram' as const },
  { key: 'facebook', label: 'Facebook', href: EXTERNAL.facebook, img: 'iconFacebook' as const },
  { key: 'naverBlog', label: 'Naver Blog', href: EXTERNAL.naverBlog, img: 'iconNaverBlog' as const },
  { key: 'naverMap', label: 'Naver Map', href: EXTERNAL.naverMap, img: 'iconNaverMap' as const },
];

// ---------------------------------------------------------------------------
// Image sources.
// Currently the original brand/facility assets are served from the Wix CDN.
// After you run `bash scripts/download-images.sh` (needs network approval) the
// files land in /public/images — then set USE_LOCAL_IMAGES = true below and the
// whole site switches to the local copies. That's the only change needed
// before you cancel Wix.
// ---------------------------------------------------------------------------
export const USE_LOCAL_IMAGES = false;
const WIX = 'https://static.wixstatic.com/media/';

type ImgDef = { wix: string; local: string; alt: string };
const D = (wix: string, local: string, alt: string): ImgDef => ({ wix, local, alt });

export const IMAGES = {
  logo: D('6f7ec1_373ab57f32cd47309dd8f17b13bc2b96~mv2.png', 'logo-main.png', '스포츠클럽필립'),
  // home
  homeAiWide: D('6f7ec1_0b3ec96462a2449ea8e5e1d82f1d48d3~mv2.jpg', 'home-ai-circuit-wide.jpg', 'AI 서킷 트레이닝룸'),
  homeAiTall: D('6f7ec1_347a878ba06d495db94a00b7b18917ee~mv2.jpg', 'home-ai-circuit-tall.jpg', 'AI 서킷 트레이닝룸'),
  promoCurrent: D('6f7ec1_d64ec402a8dd4a67b4d1211581ad60ec~mv2.jpg', 'promo-current.jpg', '이달의 프로모션'),
  homeFeatureFitness: D('6f7ec1_67c088c6c79b45f6a5212653a9ce779c~mv2.jpg', 'home-feature-fitness.jpg', 'GYM & FITNESS'),
  homeGxIcon: D('6f7ec1_93315331483248beb23b4d3b2a07df79~mv2.jpg', 'home-gx-icon.jpg', 'GROUP EXERCISE'),
  homeKpaIcon: D('6f7ec1_e4df173498994d86808d72e45713bcb8~mv2.jpg', 'home-kpa-icon.jpg', '대한필라테스협회'),
  homeAcademyIcon: D('6f7ec1_bc86130531ee44f3a95271db08a1b662~mv2.jpg', 'home-academy-icon.jpg', 'ACADEMY'),
  homeWellnessHero: D('84770f_a9f7042c46864cf3ac62bbdae7ffbad5~mv2.jpg', 'home-wellness-hero.jpg', 'Total Wellness'),
  // facilities
  facilityHealth: D('6f7ec1_732afa698a9a42d0b323ec3288697c51~mv2.jpg', 'facility-health.jpg', '헬스 / PT'),
  facilityGolf: D('6f7ec1_0455032c454e4d20b1f26d19e249fb59~mv2.jpg', 'facility-golf.jpg', '스크린 골프'),
  facilitySwim: D('6f7ec1_dfb4c3e7baaf41759e0edcb3d75e593d~mv2.jpg', 'facility-swim.jpg', '수영 / 아쿠아'),
  facilityGx: D('6f7ec1_447d81b14a594df296e5b1e0d723d0a6~mv2.jpg', 'facility-gx.jpg', 'GX'),
  facilityAiCircuit: D('6f7ec1_7582796142ec4322b1a670773d96865c~mv2.jpg', 'facility-aicircuit.jpg', 'AI 서킷 트레이닝'),
  facilityPilates: D('6f7ec1_fa75302454fd4f9580f2389576ec533a~mv2.jpg', 'facility-pilates.jpg', '필라테스 / 자이로토닉'),
  facilityYouth: D('6f7ec1_05372ada15864abc9ca0bdc901825904~mv2.jpg', 'facility-youth.jpg', '유소년스포츠'),
  facilitySauna: D('6f7ec1_8b83f197098a4aeb9a164cdfcdbfc8f6~mv2.jpg', 'facility-sauna.jpg', '사우나'),
  // about / brand
  brandStory: D('6f7ec1_0301992c81d84844804c9cc29fd65de3~mv2.png', 'brand-story.png', '필립 브랜드 스토리'),
  brandBally: D('6f7ec1_e781ea446c2a4ba797f57494871c4d79~mv2.png', 'brand-bally.png', '발리토탈휘트니스'),
  brandPivot: D('6f7ec1_19221d3d788640228df7573d3e53eb6b~mv2.png', 'brand-pivot.png', '아카데미 피봇'),
  brandWellnesphilia: D('6f7ec1_53e32ffbbb464346bbc1c56b526eb3bc~mv2.png', 'brand-wellnesphilia.png', '웰니스필리아'),
  // schedule / swimming posters
  scheduleOperating: D('6f7ec1_ae337347292c4353b71e107a1eeb3797~mv2.jpg', 'schedule-operating.jpg', '영업 안내 스케줄'),
  scheduleGx: D('6f7ec1_5ab0948d4586497d8995050c161b0e78~mv2.jpg', 'schedule-gx.jpg', 'GX 강습 스케줄'),
  swimmingNotice: D('6f7ec1_4d19e4f305c94991947be32068548ca9~mv2.png', 'swimming-notice.png', '수영 강습 안내'),
  swimmingSchedule: D('6f7ec1_a50bff1f08e444ad832fc0e409607871~mv2.jpg', 'swimming-schedule.jpg', '수영 강습 스케줄'),
  // academy divisions
  academyPivot: D('6f7ec1_19221d3d788640228df7573d3e53eb6b~mv2.png', 'academy-pivot.png', '아카데미 피봇'),
  academyKpa: D('6f7ec1_de1873af2f9f48db913c94757f29809b~mv2.png', 'academy-kpa.png', '사단법인대한필라테스협회'),
  academySfm: D('6f7ec1_15af58fae75543849580a362cfc7328e~mv2.png', 'academy-sfm.png', 'SFM 스포츠과학센터'),
  academySpiral: D('6f7ec1_8ccec0e29440492db3057fa2b02bbe27~mv2.png', 'academy-spiral.png', '더스파이럴분당'),
  academyKcpt: D('6f7ec1_9a33f9939f7045e897c6e10a7725e7ef~mv2.png', 'academy-kcpt.png', 'SFM_KCPT 트레이너 아카데미'),
  academyBally: D('6f7ec1_fc42e7993eed414ab4093e750855387e~mv2.png', 'academy-bally.png', '발리유소년스포츠클럽'),
  academyPilatesInPhillip: D('6f7ec1_390b601f65b24a0c917929dc46886400~mv2.png', 'academy-pilatesinphillip.png', '필라인필립'),
  // brand pages
  kpaAssociation: D('6f7ec1_de1873af2f9f48db913c94757f29809b~mv2.png', 'kpa-association.png', '사단법인대한필라테스협회'),
  ballyLogo: D('6f7ec1_fc42e7993eed414ab4093e750855387e~mv2.png', 'bally-logo.png', '발리유소년스포츠클럽'),
  spiralLogo: D('6f7ec1_8ccec0e29440492db3057fa2b02bbe27~mv2.png', 'spiral-logo.png', '더스파이럴분당'),
  challenge: D('6f7ec1_9315f88f5ef64a30a0fcd97aacde7a17~mv2.png', 'challenge.png', '프로그램'),
  // social icons
  iconKakao: D('6f7ec1_aa96ba9ba225435ab42f85fea20be33a~mv2.png', 'icon-kakao.png', 'KakaoTalk'),
  iconInstagram: D('6f7ec1_76a4c4135d7b44e6857951589d8383a2~mv2.png', 'icon-instagram.png', 'Instagram'),
  iconFacebook: D('6f7ec1_36b8dc8e803d424692aafce15ef0e935~mv2.png', 'icon-facebook.png', 'Facebook'),
  iconNaverBlog: D('6f7ec1_72d51dd8069d45f58c3e20d57d832a81~mv2.png', 'icon-naver-blog.png', 'Naver Blog'),
  iconNaverMap: D('6f7ec1_9946421d5b414f39a0c0ca23d4bbad6a~mv2.png', 'icon-naver-map.png', 'Naver Map'),
} satisfies Record<string, ImgDef>;

export type ImgKey = keyof typeof IMAGES;

export function imgSrc(key: ImgKey): string {
  const d = IMAGES[key];
  return USE_LOCAL_IMAGES ? `/images/${d.local}` : WIX + d.wix;
}
export function imgAlt(key: ImgKey): string {
  return IMAGES[key].alt;
}

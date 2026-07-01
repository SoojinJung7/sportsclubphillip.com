// Common UI strings shared across pages/components.
import type { Lang, L } from './utils';

export const ui = {
  'nav.booking': { ko: '온라인예약', en: 'Book Online' },
  'cta.viewFacilities': { ko: '시설 둘러보기', en: 'Explore Facilities' },
  'cta.viewAll': { ko: '시설 / 프로그램 전체 보기', en: 'View All Facilities & Programs' },
  'cta.learnMore': { ko: '자세히 보기', en: 'Learn More' },
  'cta.back': { ko: '돌아가기', en: 'Back' },
  'cta.viewPromotion': { ko: '프로모션 보기', en: 'See Promotion' },
  'cta.call': { ko: '전화문의', en: 'Call Us' },
  'cta.directions': { ko: '네이버 지도로 길찾기', en: 'Get Directions (Naver Map)' },
  'footer.contact': { ko: 'CONTACT US', en: 'CONTACT US' },
  'footer.customer': { ko: 'CUSTOMER CENTER', en: 'CUSTOMER CENTER' },
  'footer.hours': { ko: '상담시간', en: 'Consultation Hours' },
  'footer.ceo': { ko: '대표이사', en: 'CEO' },
  'footer.address': { ko: '주소', en: 'Address' },
  'footer.bizNo': { ko: '사업자등록번호', en: 'Business Reg. No.' },
  'popup.title': { ko: '이달의 프로모션', en: 'This Month' },
  'popup.hideToday': { ko: '오늘 하루 보지 않기', en: "Don't show today" },
  'notfound.title': { ko: '페이지를 찾을 수 없습니다', en: 'Page not found' },
  'notfound.desc': { ko: '요청하신 페이지가 이동되었거나 존재하지 않습니다.', en: 'The page you requested has moved or no longer exists.' },
  'notfound.home': { ko: '홈으로 돌아가기', en: 'Back to Home' },
} satisfies Record<string, L>;

export type UIKey = keyof typeof ui;
export function useT(lang: Lang) {
  return (key: UIKey): string => ui[key][lang] ?? ui[key].ko;
}

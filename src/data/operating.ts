// 운영 캘린더 — 휴관일 · 공휴일 · 시설별 운영시간의 단일 출처.
// 값은 content/operating-calendar.json 에서만 고치면 됩니다 (Pages CMS "운영 캘린더" 항목).
//
// 이 모듈은 서버(빌드)와 브라우저 양쪽에서 씁니다. LiveToday / FacilityStatus 의
// 클라이언트 스크립트가 그대로 import 하므로, 휴관일 판정 로직은 여기 한 곳에만 존재합니다.
import cfg from '../../content/operating-calendar.json';

export type When = 'weekday' | 'sat' | 'sun';
export type Facility = (typeof cfg.facilities)[number];

export const operating = cfg;
export const facilities = cfg.facilities;

/** 지금 시각을 KST 로 환산한 Date */
export function kstNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}

const pad = (n: number) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' */
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "HH:MM" → 자정 기준 분 */
export function toMin(t: string): number {
  const [h, m] = t.split(':');
  return +h * 60 + +m;
}

function monthEntry(d: Date) {
  const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  return cfg.months.find((m) => m.month === key);
}

/** 공휴일 여부 (해당 월이 설정돼 있을 때만) */
export function isHoliday(d: Date): boolean {
  const key = ymd(d);
  return (monthEntry(d)?.holidays ?? []).some((h) => h.date === key);
}

/**
 * 휴관일 여부.
 * 해당 월이 설정돼 있으면 그 목록이 절대 기준(특별영업일이 휴관일보다 우선).
 * 설정이 없는 달만 defaultClosedRule(추정 규칙)로 넘어갑니다.
 */
export function isClosedDay(d: Date): boolean {
  const m = monthEntry(d);
  const key = ymd(d);
  if (m) {
    if ((m.specialOpen ?? []).includes(key)) return false;
    return (m.closed ?? []).includes(key);
  }
  const rule = cfg.defaultClosedRule;
  if (!rule?.enabled) return false;
  const nth = Math.ceil(d.getDate() / 7);
  return d.getDay() === rule.weekday && rule.nths.includes(nth);
}

/** 요일 프로필 — 공휴일은 일요일 시간표를 따릅니다. */
export function whenOf(d: Date): When {
  if (isHoliday(d)) return 'sun';
  const day = d.getDay();
  return day === 0 ? 'sun' : day === 6 ? 'sat' : 'weekday';
}

/** 해당 날짜에 적용되는 시설 운영시간 */
export function hoursOf(f: Facility, d: Date) {
  const w = whenOf(d);
  return f.hours.find((h) => h.when === w) ?? f.hours.find((h) => h.when === 'weekday') ?? null;
}

/** 지금 이 시설이 영업 중인지 */
export function isFacilityOpen(f: Facility, d: Date): boolean {
  if (isClosedDay(d) && !f.openOnClosedDay) return false;
  const h = hoursOf(f, d);
  if (!h) return false;
  const now = d.getHours() * 60 + d.getMinutes();
  return now >= toMin(h.open) && now < toMin(h.close);
}

/** 시설 중 하나라도 열려 있으면 클럽은 영업 중 */
export function isClubOpen(d: Date): boolean {
  return facilities.some((f) => isFacilityOpen(f, d));
}

/**
 * 빌드 시점(=배포한 달)의 실제 휴관일·공휴일 안내 문구.
 * 해당 월이 operating-calendar.json 에 없으면 null → 페이지는 기존 일반 문구로 폴백합니다.
 * 월을 문구에 함께 넣으므로("9월 휴관일 …") 다음 달에 재배포가 늦어도 오해 소지가 없습니다.
 *
 * 운영안내 포스터가 '정기 휴관'(흰색)과 '명절휴관'(빨강)을 구분해 표기하므로 여기서도
 * closed 를 세 갈래로 나눕니다 — 추석처럼 휴관이면서 공휴일인 날이 '정기 휴관'으로
 * 묶여 버리면 안 되기 때문입니다.
 *   regular       휴관이지만 공휴일은 아닌 날      → 정기 휴관
 *   holidayClosed 휴관이면서 공휴일인 날            → 명절·공휴일 휴관 (라벨 표기)
 *   openHolidays  공휴일이지만 휴관은 아닌 날       → 영업하되 GX·수영 강습 미운영
 */
export function closedNotice(): {
  month: string;
  regular: string;
  holidayClosed: string;
  openHolidays: string;
} | null {
  const d = kstNow();
  const m = monthEntry(d);
  if (!m) return null;
  const day = (iso: string) => `${Number(iso.slice(8, 10))}일`;
  const closedDates = m.closed ?? [];
  const holidays = m.holidays ?? [];
  const holidayDates = new Set(holidays.map((h) => h.date));

  const regular = closedDates.filter((x) => !holidayDates.has(x)).map(day).join(' · ');
  const withLabel = (h: { date: string; label: string }) => `${day(h.date)}(${h.label})`;
  const holidayClosed = holidays.filter((h) => closedDates.includes(h.date)).map(withLabel).join(' · ');
  const openHolidays = holidays.filter((h) => !closedDates.includes(h.date)).map(withLabel).join(' · ');

  if (!regular && !holidayClosed && !openHolidays) return null;
  return { month: `${d.getMonth() + 1}월`, regular, holidayClosed, openHolidays };
}

/** 라벨로 시설 찾기 (사우나 배지 등) */
export function facilityBy(label: string): Facility | undefined {
  return facilities.find((f) => f.label === label);
}

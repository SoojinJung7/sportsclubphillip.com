// Builds content/swimming-schedule.json from the 9월 수영 강습 스케줄,
// and refreshes the swimming_schedule block in .pages.yml.
// Run: node scripts/build-swim.mjs
//
// 출처 (두 개를 합친 것):
//  1) 포스터 `9월 수영스케줄.png` — 시간 · 요일 · **반 이름**의 확정본 (회원 공지용).
//  2) `9월 성인,어린이예상.xlsx` — **강사 배정**의 확정본 (내부용, 반 이름은
//     구 명칭이 일부 남아 있음).
// 두 자료는 시간대별 행 수와 순서가 일치하므로, **반 이름은 포스터 / 강사는 엑셀의 같은 순번**
// 으로 맞췄습니다. 이름이 엇갈리는 칸(엑셀이 구 명칭을 쓰는 곳)은 포스터를 따릅니다:
//    월수금 07:00  포스터 연수·교정·초급~중급        ↔ 엑셀 연수·교정1·교정2
//    화목  09:00  포스터 연수·상급·신규~중급        ↔ 엑셀 연수·상급·초급~상급
//    화목  19:30  포스터 연수·교정1·교정2·초급~중급  ↔ 엑셀 연수·교정·상급·초급~중급
// 아쿠아로빅은 엑셀에 '싱크로빅'(구 명칭)으로 적혀 있습니다.
// 9월에는 엑셀 배정이 모두 채워져 **강사 미배정 칸이 없습니다**.
import { readFileSync, writeFileSync } from 'node:fs';

// slot -> [[반(level), 강사], ...]   강사 '' = 배정표에 없음
const adultMWF = {
  '06:00': [['연수', '정종화'], ['교정', '주재인'], ['초급~중급', '윤형민']],
  '07:00': [['연수', '정종화'], ['교정', '주재인'], ['초급~중급', '윤형민']],
  '09:00': [['연수', '윤형민'], ['교정1', '정종화'], ['교정2', '주재인']],
  '10:00': [['연수', '윤형민'], ['교정1', '주재인'], ['교정2', '정종화'], ['교정3', '홍진호']],
  '11:00': [['연수', '윤형민'], ['교정1', '홍진호'], ['교정2', '정종화'], ['초급~중급', '주재인']],
  '19:30': [['연수', '최윤정'], ['교정', '안기범'], ['초급~상급', '한인수']],
  '20:30': [['연수1', '최윤정'], ['연수2', '강솔'], ['상급', '안기범'], ['초급~중급', '한인수']],
  '21:30': [['연수', '한인수'], ['교정', '안기범'], ['상급', '강솔'], ['초급~중급', '최윤정']],
};
const adultTT = {
  '06:00': [['연수', '윤형민'], ['교정', '정종화'], ['초급~상급', '주재인']],
  '07:00': [['연수', '주재인'], ['교정', '윤형민'], ['초급~상급', '정종화']],
  '09:00': [['연수', '정종화'], ['상급', '주재인'], ['신규~중급', '윤형민']],
  '10:00': [['연수', '정종화'], ['교정1', '주재인'], ['교정2', '윤형민']],
  '19:30': [['연수', '한인수'], ['교정1', '강솔'], ['교정2', '최윤정'], ['초급~중급', '안기범']],
  '20:30': [['연수', '최윤정'], ['교정', '안기범'], ['초급~상급', '강솔'], ['초급', '한인수']],
  '21:30': [['연수1', '한인수'], ['연수2', '강솔'], ['상급', '최윤정'], ['초급~중급', '안기범']],
};

// 아쿠아로빅 (포스터 분홍 띠) — 엑셀에는 '싱크로빅' 으로 표기
const aquaMWF = { '14:00': [['', '김은영']] };
const aquaTT = { '11:00': [['', '최영규']], '12:00': [['', '최영규']] };
const aquaSat = { '11:00': [['', '최영규']] };

// 성인 수영 건강반 (포스터 우측 상단 표)
const wellMW = { '15:00': [['건강반', '한인수'], ['건강반', '안기범']] };
const wellTT = { '15:00': [['건강반', '한인수'], ['건강반', '안기범']], '16:00': [['초급', '최윤정'], ['초급', '강솔']] };
const wellF = { '15:00': [['소수반', '강솔']] };

// 어린이 수영 (8세~13세)
const childMW = {
  '16:00': [['연수', '최윤정'], ['상급', '강솔']],
  '17:00': [['연수', '강솔'], ['교정', '안기범']],
};
const childTT = { '17:00': [['연수', '강솔'], ['상급', '최윤정'], ['중급', '안기범']] };
const childF = { '16:00': [['연수', '강솔'], ['상급', '최윤정']], '17:00': [['연수', '최윤정'], ['상급', '강솔']] };

function add(out, slots, name) {
  for (const [start, rows] of Object.entries(slots))
    for (const [level, instructor] of rows) out.push({ start, name, level, instructor });
}
function day(sets) {
  const out = [];
  for (const [slots, name] of sets) add(out, slots, name);
  return out.sort((a, b) => a.start.localeCompare(b.start));
}

const ADULT = '성인 수영';
const WELL = '성인 건강반';
const CHILD = '어린이 수영';
const AQUA = '아쿠아로빅';

const days = {
  mon: day([[adultMWF, ADULT], [aquaMWF, AQUA], [wellMW, WELL], [childMW, CHILD]]),
  tue: day([[adultTT, ADULT], [aquaTT, AQUA], [wellTT, WELL], [childTT, CHILD]]),
  wed: day([[adultMWF, ADULT], [aquaMWF, AQUA], [wellMW, WELL], [childMW, CHILD]]),
  thu: day([[adultTT, ADULT], [aquaTT, AQUA], [wellTT, WELL], [childTT, CHILD]]),
  fri: day([[adultMWF, ADULT], [aquaMWF, AQUA], [wellF, WELL], [childF, CHILD]]),
  sat: day([[aquaSat, AQUA]]),
  sun: [],
};

writeFileSync('content/swimming-schedule.json',
  JSON.stringify({ month: '9월', note: '수영장 시설 및 프로그램은 멤버십만 이용 가능합니다.', days }, null, 2) + '\n');

// refresh the swimming_schedule block in .pages.yml (it is the last block)
let yml = readFileSync('.pages.yml', 'utf8');
const marker = '\n  - name: swimming_schedule';
const idx = yml.indexOf(marker);
if (idx !== -1) yml = yml.slice(0, idx).replace(/\s*$/, '\n');
// 들여쓰기 주의: 요일 항목은 `days` 의 `fields:`(8칸) 아래이므로 10칸이어야 합니다.
const dayField = (k, l) => `          - name: ${k}
            label: ${l}
            type: object
            list: true
            fields:
              - { name: start, label: 시작시간, type: string }
              - { name: name, label: 구분, type: string }
              - { name: level, label: 반, type: string }
              - { name: instructor, label: 강사, type: string }`;
const dayFields = [['mon', '월'], ['tue', '화'], ['wed', '수'], ['thu', '목'], ['fri', '금'], ['sat', '토'], ['sun', '일']]
  .map(([k, l]) => dayField(k, l)).join('\n');
yml += `
  - name: swimming_schedule
    label: 수영 강습 스케줄 (오늘의 라이브)
    type: file
    path: content/swimming-schedule.json
    fields:
      - { name: month, label: 월, type: string }
      - { name: note, label: 안내, type: string }
      - name: days
        label: 요일별 강습
        type: object
        fields:
${dayFields}
`;
writeFileSync('.pages.yml', yml);

const total = Object.values(days).reduce((n, d) => n + d.length, 0);
const blank = Object.values(days).flat().filter((e) => !e.instructor).length;
console.log('swim entries:', total, '| 강사 미배정:', blank,
  '| per day:', Object.fromEntries(Object.entries(days).map(([k, v]) => [k, v.length])));

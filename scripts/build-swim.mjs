// Builds content/swimming-schedule.json from the 8월 수영 강습 스케줄 포스터,
// and refreshes the swimming_schedule block in .pages.yml.
// Run: node scripts/build-swim.mjs
//
// 출처: 포스터 `_8월-수영강습스케줄.png` (시간 · 반 · 요일의 확정본).
// 강사명은 포스터에 없어서 내부 배정 시트(8월 성인,어린이)에서 **반 이름과 시간이
// 정확히 일치하는 칸만** 채웠습니다. 일치하지 않는 칸은 빈 값으로 두어
// 잘못된 강사명이 노출되지 않게 합니다 (사이트는 강사가 비어도 정상 표시).
import { readFileSync, writeFileSync } from 'node:fs';

// slot -> [[반(level), 강사], ...]   강사 '' = 확정 정보 없음
const adultMWF = {
  '06:00': [['연수', '정종화'], ['교정', '주재인'], ['초급~중급', '윤형민']],
  '07:00': [['연수', '정종화'], ['교정', ''], ['초급~중급', '']],
  '09:00': [['연수', '윤형민'], ['교정1', '정종화'], ['교정2', '주재인']],
  '10:00': [['연수', '윤형민'], ['교정1', '주재인'], ['교정2', '정종화'], ['교정3', '홍진호']],
  '11:00': [['연수', '윤형민'], ['교정1', '홍진호'], ['교정2', '정종화'], ['초급~중급', '주재인']],
  '19:30': [['연수', '최윤정'], ['교정', '안기범'], ['초급~상급', '한인수']],
  '20:30': [['연수1', '최윤정'], ['연수2', '강솔'], ['교정', ''], ['초급~중급', '한인수']],
  '21:30': [['연수', '한인수'], ['교정', '안기범'], ['상급', '강솔'], ['초급~중급', '최윤정']],
};
const adultTT = {
  '06:00': [['연수', '윤형민'], ['교정', '정종화'], ['초급~상급', '주재인']],
  '07:00': [['연수', '주재인'], ['교정', '윤형민'], ['초급~상급', '정종화']],
  '09:00': [['연수', '정종화'], ['중상급', ''], ['신규~중급', '']],
  '10:00': [['연수', '정종화'], ['교정1', '주재인'], ['교정2', '윤형민']],
  '19:30': [['연수', '한인수'], ['교정1', ''], ['교정2', ''], ['초급~중급', '안기범']],
  '20:30': [['연수', '최윤정'], ['교정', '안기범'], ['초급~상급', '강솔'], ['초급', '한인수']],
  '21:30': [['연수1', '한인수'], ['연수2', '강솔'], ['상급', '최윤정'], ['초급~중급', '안기범']],
};

// 아쿠아로빅 (포스터 하단 파란 띠)
const aquaMWF = { '14:00': [['', '김은영']] };
const aquaTT = { '11:00': [['', '최영규']], '12:00': [['', '최영규']] };
const aquaSat = { '11:00': [['', '최영규']] };

// 성인 건강반
const wellMW = { '15:00': [['', '한인수'], ['', '안기범']] };
const wellTT = { '15:00': [['', '한인수'], ['', '안기범']] };

// 어린이 수영 (8세~13세)
const childMW = {
  '16:00': [['연수', '최윤정'], ['상급', '강솔']],
  '17:00': [['연수', '강솔'], ['교정', '안기범']],
};
const childTT = {
  '16:00': [['초급', '강솔'], ['초급', '최윤정']],
  '17:00': [['연수', '강솔'], ['상급', '최윤정'], ['중급', '']],
};
const childF = {
  '15:00': [['초급', '']],
  '16:00': [['연수', ''], ['상급', '']],
  '17:00': [['연수', ''], ['상급', '']],
};

function add(out, slots, name) {
  for (const [start, rows] of Object.entries(slots))
    for (const [level, instructor] of rows) out.push({ start, name, level, instructor });
}
function day(sets) {
  const out = [];
  for (const [slots, name] of sets) add(out, slots, name);
  return out.sort((a, b) => a.start.localeCompare(b.start));
}

const days = {
  mon: day([[adultMWF, '성인 수영'], [aquaMWF, '아쿠아로빅'], [wellMW, '성인 건강반'], [childMW, '어린이 수영']]),
  tue: day([[adultTT, '성인 수영'], [aquaTT, '아쿠아로빅'], [wellTT, '성인 건강반'], [childTT, '어린이 수영']]),
  wed: day([[adultMWF, '성인 수영'], [aquaMWF, '아쿠아로빅'], [wellMW, '성인 건강반'], [childMW, '어린이 수영']]),
  thu: day([[adultTT, '성인 수영'], [aquaTT, '아쿠아로빅'], [wellTT, '성인 건강반'], [childTT, '어린이 수영']]),
  fri: day([[adultMWF, '성인 수영'], [aquaMWF, '아쿠아로빅'], [childF, '어린이 수영']]),
  sat: day([[aquaSat, '아쿠아로빅']]),
  sun: [],
};

writeFileSync('content/swimming-schedule.json',
  JSON.stringify({ month: '8월', note: '수영장 시설 및 프로그램은 멤버십만 이용 가능합니다.', days }, null, 2) + '\n');

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
console.log('swim entries:', total, '| per day:', Object.fromEntries(Object.entries(days).map(([k, v]) => [k, v.length])));

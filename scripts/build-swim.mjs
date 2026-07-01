// Builds content/swimming-schedule.json from the July 성인/어린이 수영 tables,
// and refreshes the swimming_schedule block in .pages.yml.
import { readFileSync, writeFileSync } from 'node:fs';

// slot -> [[반(level), 강사], ...]
const adultMWF = {
  '06:00': [['연수', '정종화'], ['교정', '주재인'], ['초급~중급', '윤형민']],
  '07:00': [['연수', '정종화'], ['교정1', '주재인'], ['교정2', '윤형민']],
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
  '09:00': [['연수', '윤형민'], ['상급', '주재인'], ['초급~상급', '윤형민']],
  '10:00': [['연수', '정종화'], ['교정1', '주재인'], ['교정2', '윤형민']],
  '19:30': [['연수', '한인수'], ['교정', '강솔'], ['상급', '최윤정'], ['초급~중급', '안기범']],
  '20:30': [['연수', '최윤정'], ['교정', '안기범'], ['초급~상급', '강솔']],
  '21:30': [['연수1', '한인수'], ['연수2', '강솔'], ['상급', '최윤정'], ['초급~중급', '안기범']],
};
const synchroMWF = { '14:00': [['', '김은영']] };
const synchroTT = { '11:00': [['', '최영규']], '12:00': [['', '최영규']] };
const synchroSat = { '11:00': [['', '최영규']] };
const childMW = { '16:00': [['연수', '최윤정'], ['상급', '강솔']], '17:00': [['연수', '강솔'], ['교정', '안기범']] };
const childTT = { '16:00': [['초급', '강솔']], '17:00': [['연수', '강솔'], ['상급', '최윤정'], ['중급', '안기범']] };
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

const days = {
  mon: day([[adultMWF, '성인 수영'], [synchroMWF, '싱크로빅'], [childMW, '어린이 수영']]),
  tue: day([[adultTT, '성인 수영'], [synchroTT, '싱크로빅'], [childTT, '어린이 수영']]),
  wed: day([[adultMWF, '성인 수영'], [synchroMWF, '싱크로빅'], [childMW, '어린이 수영']]),
  thu: day([[adultTT, '성인 수영'], [synchroTT, '싱크로빅'], [childTT, '어린이 수영']]),
  fri: day([[adultMWF, '성인 수영'], [synchroMWF, '싱크로빅'], [childF, '어린이 수영']]),
  sat: day([[synchroSat, '싱크로빅']]),
  sun: [],
};

writeFileSync('content/swimming-schedule.json',
  JSON.stringify({ month: '7월', note: '수영장 시설 및 프로그램은 멤버십만 이용 가능합니다.', days }, null, 2) + '\n');

// refresh the swimming_schedule block in .pages.yml (it is the last block)
let yml = readFileSync('.pages.yml', 'utf8');
const marker = '\n  - name: swimming_schedule';
const idx = yml.indexOf(marker);
if (idx !== -1) yml = yml.slice(0, idx).replace(/\s*$/, '\n');
const dayField = (k, l) => `      - name: ${k}
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

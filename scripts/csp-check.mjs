// CSP 위반 점검 (선택적 개발 도구)
// 빌드된 사이트를 실제 브라우저(Playwright Chromium)로 열어 모든 페이지에서
// CSP 위반이 발생하는지 확인한다. 언어 토글·채팅 위젯 열기까지 눌러본다.
//
// 사용법:
//   npm run build && npx astro preview --port 4321 &
//   NODE_PATH=<playwright 가 설치된 node_modules> node scripts/csp-check.mjs
//
// playwright 는 이 프로젝트의 의존성이 아니다 (테스트 전용).

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const PAGES = [
  '/', '/about/', '/operating/', '/career/', '/projects/', '/promotion/', '/pilates/',
  '/schedule/', '/swimminglesson/', '/academy/', '/kpa/', '/bally/', '/thespiralbundang/',
  '/challenges/', '/blog/', '/book-online/', '/this-page-does-not-exist/',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => {
  window.__cspv = [];
  document.addEventListener('securitypolicyviolation', (e) => {
    window.__cspv.push({ directive: e.violatedDirective, blocked: e.blockedURI, line: e.lineNumber, sample: (e.sample || '').slice(0, 80) });
  });
});

let total = 0;
for (const path of PAGES) {
  const page = await ctx.newPage();
  const consoleErrs = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => consoleErrs.push('pageerror: ' + String(e).slice(0, 160)));
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 }).catch((e) => consoleErrs.push('goto: ' + e.message));

  // 언어 토글 → EN
  const en = page.locator('[data-lang-btn="en"]').first();
  let langOk = 'n/a';
  if (await en.count()) {
    await en.click();
    await page.waitForTimeout(300);
    langOk = (await page.evaluate(() => document.documentElement.lang)) === 'en' ? 'ok' : 'FAIL';
    await page.locator('[data-lang-btn="ko"]').first().click();
  }
  // 채팅 위젯 열기 (백엔드 상태 조회 fetch 발생)
  let chatOk = 'n/a';
  const toggle = page.locator('#scp-chat-toggle');
  if (await toggle.count()) {
    await toggle.click();
    await page.waitForTimeout(2500);
    chatOk = (await page.locator('#scp-chat-panel').isVisible()) ? 'ok' : 'FAIL';
  }
  await page.waitForTimeout(1500);

  const v = await page.evaluate(() => window.__cspv);
  total += v.length;
  console.log(`${path.padEnd(28)} lang=${langOk.padEnd(4)} chat=${chatOk.padEnd(4)} cspViolations=${v.length} consoleErrors=${consoleErrs.length}`);
  for (const x of v) console.log('   CSP:', JSON.stringify(x));
  for (const c of consoleErrs.slice(0, 5)) console.log('   ERR:', c);
  await page.close();
}
await browser.close();
console.log(total === 0 ? '\nRESULT: no CSP violations' : `\nRESULT: ${total} CSP violation(s)`);
process.exit(total === 0 ? 0 : 1);

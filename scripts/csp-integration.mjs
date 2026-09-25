// Astro 통합: 빌드가 끝난 뒤 dist/**/*.html 마다
// <meta http-equiv="Content-Security-Policy"> 를 주입한다.
//
// - 인라인 <script> 는 페이지별로 SHA-256 해시를 계산해 허용 (내용이 바뀌면 빌드 때 자동 갱신)
// - 외부 자원(폰트·유튜브·구글지도·필립톡 API)은 아래 ALLOW 목록으로 관리
// - frame-ancestors 는 meta 에서 지원되지 않으므로 Cloudflare 헤더에서 별도 설정
//
// 새 외부 서비스를 붙일 때는 ALLOW 의 해당 항목에 도메인을 추가하면 된다.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ALLOW = {
  // 외부 스타일시트 (Pretendard 폰트 CSS)
  style: ['https://cdn.jsdelivr.net'],
  // 폰트 파일
  font: ['https://cdn.jsdelivr.net', 'data:'],
  // 이미지: CMS 업로드(self) + 외부 https 이미지 허용
  img: ['data:', 'blob:', 'https:'],
  // 자체 호스팅 영상
  media: ['blob:'],
  // fetch/XHR 대상 (필립톡 채팅 백엔드)
  connect: ['https://to-philip.vercel.app'],
  // iframe 임베드
  frame: ['https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://www.google.com'],
};

export function buildPolicy(scriptHashes) {
  const q = (arr) => arr.join(' ');
  return [
    `default-src 'self'`,
    `script-src 'self' ${scriptHashes.map((h) => `'${h}'`).join(' ')}`.trim(),
    `style-src 'self' 'unsafe-inline' ${q(ALLOW.style)}`,
    `font-src 'self' ${q(ALLOW.font)}`,
    `img-src 'self' ${q(ALLOW.img)}`,
    `media-src 'self' ${q(ALLOW.media)}`,
    `connect-src 'self' ${q(ALLOW.connect)}`,
    `frame-src ${q(ALLOW.frame)}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ');
}

const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

export function inlineScriptHashes(html) {
  const hashes = new Set();
  for (const m of html.matchAll(SCRIPT_RE)) {
    const [, attrs, body] = m;
    if (/\ssrc\s*=/i.test(attrs)) continue; // 외부 파일은 'self' 로 허용
    if (/type\s*=\s*["'](application\/(ld\+)?json|text\/template)["']/i.test(attrs)) continue; // 실행되지 않는 데이터 블록
    if (!body) continue;
    hashes.add('sha256-' + createHash('sha256').update(body, 'utf8').digest('base64'));
  }
  return [...hashes];
}

export function injectMeta(html) {
  const cleaned = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/i, '');
  const policy = buildPolicy(inlineScriptHashes(cleaned));
  const tag = `<meta http-equiv="Content-Security-Policy" content="${policy.replace(/"/g, '&quot;')}">`;
  // <meta charset> 바로 뒤에 넣는다 (charset 은 문서 앞부분에 있어야 함)
  if (/<meta charset=[^>]*>/i.test(cleaned)) return cleaned.replace(/<meta charset=[^>]*>/i, (m) => m + tag);
  return cleaned.replace(/<head[^>]*>/i, (m) => m + tag);
}

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export async function injectDir(dir) {
  const files = await htmlFiles(dir);
  for (const f of files) {
    const html = await readFile(f, 'utf8');
    await writeFile(f, injectMeta(html));
  }
  return files.length;
}

export default function csp() {
  return {
    name: 'scp-csp',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const n = await injectDir(fileURLToPath(dir));
        logger.info(`CSP meta injected into ${n} HTML files`);
      },
    },
  };
}

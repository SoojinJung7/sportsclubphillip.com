// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import csp from './scripts/csp-integration.mjs';

// Custom domain (apex) served by GitHub Pages → base is '/'
export default defineConfig({
  site: 'https://www.sportsclubphillip.com',
  base: '/',
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: false, // Korean at /, English at /en/
    },
  },
  integrations: [
    // sitemap-index.xml + sitemap-0.xml 자동 생성 (검색엔진 등록용). 404 는 자동 제외,
    // /book-online 은 네이버 예약으로 넘기는 리다이렉트 페이지라 목록에서 뺀다.
    sitemap({ filter: (page) => !page.includes('/book-online') }),
    // 빌드 후 각 HTML 에 Content-Security-Policy meta 주입 (scripts/csp-integration.mjs)
    csp(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

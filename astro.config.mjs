// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
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
  // 빌드 후 각 HTML 에 Content-Security-Policy meta 주입 (scripts/csp-integration.mjs)
  integrations: [csp()],
  vite: {
    plugins: [tailwindcss()],
  },
});

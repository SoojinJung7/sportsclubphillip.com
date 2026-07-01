// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Custom domain (apex) served by GitHub Pages → base is '/'
export default defineConfig({
  site: 'https://sportsclubphillip.com',
  base: '/',
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: false, // Korean at /, English at /en/
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

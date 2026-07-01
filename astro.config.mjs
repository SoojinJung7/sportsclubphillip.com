// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Custom domain (apex) served by GitHub Pages → base is '/'
export default defineConfig({
  site: 'https://sportsclubphillip.com',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
  },
});

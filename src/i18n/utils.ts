// ---------------------------------------------------------------------------
// i18n helpers. Korean is the default (served at /), English at /en/.
// ---------------------------------------------------------------------------
export const LOCALES = ['ko', 'en'] as const;
export type Lang = (typeof LOCALES)[number];

/** A bilingual value. Use pick(v, lang) to render. */
export type L = { ko: string; en: string };

/** Detect the language from a URL pathname. */
export function getLang(url: URL): Lang {
  return url.pathname.split('/')[1] === 'en' ? 'en' : 'ko';
}

/** Render a bilingual value (or plain string) in the given language. */
export function pick(v: L | string, lang: Lang): string {
  if (typeof v === 'string') return v;
  return v[lang] ?? v.ko;
}

/** Strip any /en prefix → the canonical Korean-root path. */
export function toBasePath(path: string): string {
  const p = path.replace(/^\/en(?=\/|$)/, '');
  return p === '' ? '/' : p;
}

/** Turn a Korean-root path into the path for the given language. */
export function localizePath(path: string, lang: Lang): string {
  const base = toBasePath(path);
  if (lang === 'ko') return base;
  return base === '/' ? '/en/' : `/en${base}`;
}

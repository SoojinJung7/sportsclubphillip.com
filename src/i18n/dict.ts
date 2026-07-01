// KO → EN dictionary for the client-side language toggle.
// The wording is CMS-edited in content/translations.json (a list of {ko, en}).
import translations from '../../content/translations.json';

export const EN: Record<string, string> = Object.fromEntries(
  (translations as { ko: string; en: string }[]).map((t) => [t.ko, t.en]),
);

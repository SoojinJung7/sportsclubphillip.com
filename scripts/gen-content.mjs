// Generates CMS-editable JSON content files from the existing data modules.
// Run once: `node scripts/gen-content.mjs`
import { writeFileSync, mkdirSync } from 'node:fs';
import { SITE, EXTERNAL, IMAGES } from '../src/data/site.ts';
import { EN } from '../src/i18n/dict.ts';

mkdirSync('content', { recursive: true });
const WIX = 'https://static.wixstatic.com/media/';

// 1) settings — contact, hours, socials, booking
const settings = {
  site: {
    name: SITE.name, nameEn: SITE.nameEn, tagline: SITE.tagline,
    ceo: SITE.ceo, address: SITE.address, bizNo: SITE.bizNo,
    phone: SITE.phone, fax: SITE.fax, email: SITE.email,
  },
  hours: SITE.hours,
  external: EXTERNAL,
};
writeFileSync('content/settings.json', JSON.stringify(settings, null, 2) + '\n');

// 2) media — every image key → { src, alt }. src defaults to the current Wix URL;
//    replace via CMS upload (writes to /public/images) at any time.
const media = {};
for (const [key, def] of Object.entries(IMAGES)) {
  media[key] = { src: WIX + def.wix, alt: def.alt };
}
writeFileSync('content/media.json', JSON.stringify(media, null, 2) + '\n');

// 3) translations — KO → EN as an editable list
const translations = Object.entries(EN).map(([ko, en]) => ({ ko, en }));
writeFileSync('content/translations.json', JSON.stringify(translations, null, 2) + '\n');

// 4) popup
const popup = { enabled: true, title: '이달의 프로모션', image: 'promoCurrent', link: '/promotion' };
writeFileSync('content/popup.json', JSON.stringify(popup, null, 2) + '\n');

console.log('Generated: settings.json, media.json (' + Object.keys(media).length + '), translations.json (' + translations.length + '), popup.json');

// Appends "페이지 · <name>" content collections to .pages.yml, one per
// content/pages/*.json, with fields inferred from the JSON shape.
// Run: node scripts/gen-pages-cms.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const files = readdirSync('content/pages').filter((f) => f.endsWith('.json')).sort();

function fieldFor(name, v) {
  if (Array.isArray(v)) {
    if (v.length && v[0] && typeof v[0] === 'object') {
      return { name, type: 'object', list: true, fields: fieldsFor(v[0]) };
    }
    return { name, type: 'string', list: true };
  }
  if (v && typeof v === 'object') {
    return { name, type: 'object', fields: fieldsFor(v) };
  }
  const long = typeof v === 'string' && v.length > 70;
  return { name, type: long ? 'text' : 'string' };
}
function fieldsFor(obj) {
  return Object.entries(obj).map(([k, v]) => fieldFor(k, v));
}

function emit(field, indent) {
  const pad = ' '.repeat(indent);
  let s = `${pad}- name: ${field.name}\n`;
  s += `${pad}  label: ${field.name}\n`;
  s += `${pad}  type: ${field.type}\n`;
  if (field.list) s += `${pad}  list: true\n`;
  if (field.fields) {
    s += `${pad}  fields:\n`;
    for (const f of field.fields) s += emit(f, indent + 4);
  }
  return s;
}

let out = '\n  # ---- Page content (한국어 본문) — auto-generated ----\n';
for (const file of files) {
  const name = file.replace('.json', '');
  const data = JSON.parse(readFileSync(`content/pages/${file}`, 'utf8'));
  out += `  - name: page_${name}\n`;
  out += `    label: 페이지 · ${name}\n`;
  out += `    type: file\n`;
  out += `    path: content/pages/${file}\n`;
  out += `    fields:\n`;
  for (const f of fieldsFor(data)) out += emit(f, 6);
}

const yml = readFileSync('.pages.yml', 'utf8').replace(/\s*$/, '\n');
writeFileSync('.pages.yml', yml + out);
console.log('Appended', files.length, 'page collections to .pages.yml');

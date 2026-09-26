#!/usr/bin/env node
/**
 * `npm run thumbs` — draw every placeholder cover the site needs.
 *
 * Imprint never ships a stock photograph. Artwork here is DRAWN: an SVG
 * built from the collection's hue (derived from your one accent colour,
 * exactly the way the CSS derives it) and a pattern chosen by hashing the
 * title, so the same entry always gets the same picture and two entries
 * side by side never get the same one.
 *
 * Three things come out of this:
 *   assets/img/covers/<collection>.svg   the fallback cover per collection
 *   assets/img/demo/<slug>.svg           dummy art for the demo content
 *   assets/img/placeholder.svg           the last-resort cover
 *
 * The runtime twin of this is _includes/utility/thumb.html, which draws
 * the same thing inline from an entry's own front matter — that one needs
 * no build step and is what most cards actually use. This script exists
 * for the cases that need a real FILE: a social card, an <img src>, a
 * collection's `image:`.
 *
 *   node tools/thumbs.mjs [--accent "#f22f46"] [--force]
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import * as Y from './lib/yaml-lite.mjs';
import { accentHsl, collectionHue, hsl, hash } from './lib/color.mjs';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const FORCE = argv.includes('--force');

const cfg = Y.parse(fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8'));
const ACCENT = opt('accent', cfg.accent_color || '#f22f46');
const [H, S, L] = accentHsl(ACCENT);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Same rule as tools/new.mjs, so a generated cover's filename matches the
// slug an entry would get. Apostrophes vanish rather than becoming hyphens.
const slug = (s) => String(s).toLowerCase().trim()
  .replace(/['\u2019]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);

/**
 * Five patterns. Each is a <pattern> body drawn in `ink`; which one an
 * entry gets is decided by hashing its title, so it is stable across
 * builds and unrelated to the order things happen to be in.
 */
const PATTERNS = [
  (ink) => `<pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.7" fill="${ink}"/></pattern>`,
  (ink) => `<pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0v48" fill="none" stroke="${ink}" stroke-width="1"/></pattern>`,
  (ink) => `<pattern id="p" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M-2 24 24-2" stroke="${ink}" stroke-width="1.3"/></pattern>`,
  (ink) => `<pattern id="p" width="120" height="120" patternUnits="userSpaceOnUse"><circle cx="60" cy="60" r="46" fill="none" stroke="${ink}" stroke-width="1"/><circle cx="60" cy="60" r="20" fill="none" stroke="${ink}" stroke-width="1"/></pattern>`,
  (ink) => `<pattern id="p" width="60" height="30" patternUnits="userSpaceOnUse"><path d="M0 22q15-18 30 0t30 0" fill="none" stroke="${ink}" stroke-width="1.2"/></pattern>`,
];

/** Wrap a title onto at most three lines of roughly `per` characters. */
function wrap(text, per = 22, max = 3) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = []; let cur = '';
  for (const w of words) {
    if (!cur) { cur = w; continue; }
    if ((cur + ' ' + w).length <= per) cur += ' ' + w;
    else { lines.push(cur); cur = w; if (lines.length === max) break; }
  }
  if (cur && lines.length < max) lines.push(cur);
  if (lines.length === max && words.join(' ').length > lines.join(' ').length) {
    lines[max - 1] = lines[max - 1].replace(/\s*\S*$/, '') + '…';
  }
  return lines;
}

/** Initials for the corner mark — the site's, not the entry's. */
const MONOGRAM = (() => {
  const parts = String(cfg.author || cfg.title || 'Im').trim().split(/\s+/);
  const a = parts[0]?.[0] ?? 'I';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? 'm');
  return (a + b).toUpperCase();
})();

/**
 * One 1200×675 cover. Dark by design: a picture sits on top of the page
 * in both themes, so it has to be legible against either, and white type
 * on a deep field is the one combination that always is.
 */
function cover({ title, kicker = '', meta = '', label = 'posts', seed }) {
  const hue = collectionHue(H, label);
  const s = Math.max(S, 0.4);
  // Tinted charcoal, not a slab of colour: a cover has to sit behind a
  // title and beside five others without shouting. The hue is legible,
  // the saturation is not the point.
  const bgA = hsl(hue, s * 0.30, 0.12);
  const bgB = hsl(hue, s * 0.44, 0.22);
  const glow = hsl(hue, s * 0.9, 0.52, 0.38);
  const ink = hsl(hue, s * 0.4, 0.75, 0.16);
  const rule = hsl(hue, s * 0.85, 0.66);
  const pattern = PATTERNS[hash(seed ?? title) % PATTERNS.length](ink);
  const lines = wrap(title, title.length > 46 ? 26 : 22);
  const y0 = 300 - (lines.length - 1) * 38;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/>
    </linearGradient>
    <radialGradient id="glow" cx="82%" cy="14%" r="70%">
      <stop offset="0" stop-color="${glow}"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    ${pattern}
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#p)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>
  <g font-family="Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif">
    ${kicker ? `<text x="80" y="${y0 - 86}" fill="${rule}" font-size="24" font-weight="600" letter-spacing="3.2">${esc(kicker.toUpperCase())}</text>` : ''}
    <rect x="80" y="${y0 - 62}" width="56" height="4" rx="2" fill="${rule}"/>
    ${lines.map((l, i) => `<text x="80" y="${y0 + i * 76}" fill="#fff" font-size="66" font-weight="600" letter-spacing="-1.6">${esc(l)}</text>`).join('\n    ')}
    ${meta ? `<text x="80" y="${y0 + lines.length * 76 + 26}" fill="rgb(255 255 255 / 0.66)" font-size="26" font-weight="500">${esc(meta)}</text>` : ''}
    <g opacity="0.92">
      <circle cx="1094" cy="108" r="46" fill="rgb(255 255 255 / 0.1)" stroke="rgb(255 255 255 / 0.28)"/>
      <text x="1094" y="122" text-anchor="middle" fill="#fff" font-size="32" font-weight="600" letter-spacing="0.5">${esc(MONOGRAM)}</text>
    </g>
  </g>
</svg>
`;
}

function write(rel, body) {
  const dest = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!FORCE && fs.existsSync(dest) && fs.readFileSync(dest, 'utf8') === body) return false;
  fs.writeFileSync(dest, body);
  return true;
}

/** Read an entry's front matter — just enough of it for a cover. */
function frontMatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) return {};
  try { return Y.parse(m[1]) || {}; } catch { return {}; }
}

let made = 0;

// ── 1. One fallback cover per collection ───────────────────────────────
// Written to the path the collection's own `image:` names, so the config
// stays the single source of truth and a renamed cover is never orphaned.
for (const [label, c] of Object.entries(cfg.collections || {})) {
  const body = cover({
    title: c.title || label,
    kicker: 'Collection',
    meta: c.description || '',
    label,
    seed: label,
  });
  const rel = String(c.image || `/assets/img/covers/${label}.svg`).replace(/^\//, '');
  if (!rel.endsWith('.svg')) continue;   // a real picture — leave it alone
  if (write(rel, body)) made++;
}

// ── 2. Dummy art for whatever content is actually here ─────────────────
// So a freshly cloned repo LOOKS finished the first time it is served —
// every card has a picture, and no two pictures are the same.
for (const label of Object.keys(cfg.collections || {})) {
  const dir = path.join(ROOT, `_${label}`);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => /\.(md|markdown|html)$/.test(f))) {
    const fm = frontMatter(path.join(dir, file));
    const name = slug(fm.title || file.replace(/\.\w+$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''));
    const singular = cfg.collections[label].singular || label;
    const body = cover({
      title: fm.title || name,
      kicker: fm.kind || singular,
      meta: [fm.lang, fm.model, fm.duration, fm.year, (fm.tags || []).slice(0, 2).join(' · ')].filter(Boolean).join('  ·  '),
      label,
      seed: `${label}/${name}`,
    });
    if (write(`assets/img/demo/${label}-${name}.svg`, body)) made++;
  }
}

// ── 3. The last resort ─────────────────────────────────────────────────
if (write('assets/img/placeholder.svg', cover({
  title: cfg.title || 'Imprint',
  kicker: cfg.job_title || '',
  meta: String(cfg.url || '').replace(/^https?:\/\//, ''),
  label: 'pages',
  seed: 'placeholder',
}))) made++;

// ── 4. A social card ───────────────────────────────────────────────────
if (write('assets/img/social-card.svg', cover({
  title: cfg.title || 'Imprint',
  kicker: '',
  meta: cfg.description ? String(cfg.description).slice(0, 72) : '',
  label: 'posts',
  seed: 'social',
}))) made++;

console.log(made
  ? `  ✓ drew ${made} cover${made === 1 ? '' : 's'} from accent ${ACCENT}`
  : '  · covers already up to date (use --force to redraw)');

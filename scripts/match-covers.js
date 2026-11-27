const fs = require('fs');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const HTML_PATH = 'C:/Users/Hype/.local/share/opencode/tool-output/tool_21d610b75001Zd6rB6uoVS6ako';

if (!getApps().length) initializeApp();
const db = getFirestore();

const html = fs.readFileSync(HTML_PATH, 'utf8');
const candidates = [];

for (const m of html.matchAll(/<img[^>]+src="([^"]+)"[^>]*title="([^"]+)"/g)) {
  candidates.push({ title: m[2], url: m[1] });
}
for (const m of html.matchAll(/background-image:\s*url\('([^']+)'\)[\s\S]{0,1200}?data-jtitle="([^"]+)"/g)) {
  candidates.push({ title: m[2], url: m[1] });
}

const norm = s => String(s || '').toLowerCase()
  .replace(/[’']/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const words = s => norm(s).split(' ').filter(w => w.length > 2);

let score = (a, b) => {
  const wa = words(a), wb = words(b);
  if (!wa.length || !wb.length) return 0;
  const setB = new Set(wb);
  const hits = wa.filter(w => setB.has(w)).length;
  const cover = hits / Math.max(wa.length, wb.length);
  return norm(b).startsWith(norm(a)) ? cover + 1 : cover;
};

(async () => {
  const snap = await db.collection('users').doc('603891834858635274').collection('donghua').get();
  const out = [];
  for (const doc of snap.docs) {
    const d = doc.data();
    let best = null, bestScore = 0;
    for (const c of candidates) {
      const s = score(d.judul, c.title);
      if (s > bestScore) { bestScore = s; best = c; }
    }
    if (best && bestScore >= 0.6) {
      const url = best.url.startsWith('http') ? best.url : 'https://anichin.moe' + best.url;
      out.push({ id: doc.id, judul: d.judul, match: best.title, url });
    }
  }
  fs.writeFileSync('assets/anichin-covers.json', JSON.stringify(out, null, 2));
  console.log('matched', out.length, 'of', snap.size);
})().catch(e => { console.error(e.message); process.exit(1); });

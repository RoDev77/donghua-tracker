const fs = require('fs');
const path = require('path');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const DIR = path.join(__dirname, '..', 'assets', 'covers');
const OWNER = '603891834858635274';

const norm = s => String(s || '').toLowerCase()
  .replace(/\.[^.]+$/, '')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const fileMap = new Map();
fs.readdirSync(DIR).forEach(name => {
  const rel = 'assets/covers/' + name;
  fileMap.set(norm(name), rel);
});

if (!getApps().length) initializeApp();
const db = getFirestore();

(async () => {
  const col = db.collection('users').doc(OWNER).collection('donghua');
  const snap = await col.get();
  const batch = db.batch();
  let updated = 0;
  const matched = [];
  snap.docs.forEach(doc => {
    const judul = doc.data().judul;
    const rel = fileMap.get(norm(judul));
    if (!rel) return;
    matched.push(judul + ' => ' + rel);
    if (doc.data().cover !== rel) { batch.update(doc.ref, { cover: rel }); updated++; }
  });
  await batch.commit();

  // Patch seed di index.html
  let html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const lines = html.split('\n');
  let patched = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/judul: '((?:\\.|[^'])*)'/);
    if (!m) continue;
    const judul = m[1].replace(/\\'/g, "'");
    const rel = fileMap.get(norm(judul));
    if (!rel) continue;
    if (/cover:/.test(lines[i])) {
      lines[i] = lines[i].replace(/cover: '[^']*'/, `cover: '${rel}'`);
    } else {
      lines[i] = lines[i].replace(`judul: '${m[1]}',`, `judul: '${m[1]}', cover: '${rel}',`);
    }
    patched++;
  }
  fs.writeFileSync(path.join(__dirname, '..', 'index.html'), lines.join('\n'));

  console.log('Firestore diperbarui: ' + updated);
  console.log('Seed diperbarui: ' + patched);
  console.log('Tidak ada file untuk: ' + snap.docs.map(d => d.data().judul).filter(j => !fileMap.has(norm(j))).join(', '));
})().catch(e => { console.error(e.message); process.exit(1); });

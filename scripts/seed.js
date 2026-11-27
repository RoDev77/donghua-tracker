// Seed Firestore dari data awal yang ada di index.html.
// Jalankan dengan: GOOGLE_APPLICATION_CREDENTIALS=<path service account> node scripts/seed.js
const fs = require('fs');
const path = require('path');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/const seed = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Tidak menemukan array seed di index.html');
const seed = Function('return ' + match[1])();

if (!getApps().length) initializeApp();
const db = getFirestore();

(async () => {
  const col = db.collection('donghua');
  const batch = db.batch();
  const existing = await col.get();
  existing.forEach(doc => batch.delete(doc.ref));
  seed.forEach(item => {
    batch.set(col.doc(String(item.id)), {
      judul: String(item.judul || ''),
      hari: String(item.hari || ''),
      lastEp: String(item.lastEp ?? ''),
      nextEp: String(item.nextEp ?? ''),
      season: String(item.season || ''),
      status: String(item.status || 'Ongoing'),
      via: String(item.via || ''),
      updatedAt: FieldValue.serverTimestamp()
    });
  });
  await batch.commit();
  console.log('Seeded ' + seed.length + ' dokumen ke Firestore.');
})().catch(err => {
  console.error('Gagal seed:', err.message || err);
  process.exit(1);
});

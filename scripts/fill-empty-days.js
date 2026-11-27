const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const OWNER = '603891834858635274';
if (!getApps().length) initializeApp();
const db = getFirestore();

(async () => {
  const col = db.collection('users').doc(OWNER).collection('donghua');
  const snap = await col.get();
  const batch = db.batch();
  let n = 0;
  snap.docs.forEach(doc => {
    const hari = String(doc.data().hari || '').trim();
    if (!hari || hari === '-' || hari === '?' || /^\?+$/.test(hari)) {
      batch.update(doc.ref, { hari: 'Kosong' });
      n++;
    }
  });
  await batch.commit();
  console.log('Hari Update diisi "Kosong" untuk ' + n + ' dokumen.');
})().catch(e => { console.error(e.message); process.exit(1); });

const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const OWNER = '603891834858635274';
const covers = {
  'Renegade Immortal': 'assets/covers/renegade-immortal.jpeg',
  'Azure Legacy': 'assets/covers/azure-legacy.jpeg',
  'Beyond Time’s Gaze': 'assets/covers/beyond-times-gaze.jpeg',
  'Tales of Herding Gods': 'assets/covers/tales-of-herding-gods.jpeg',
  'Ancient God Sovereign': 'assets/covers/ancient-god-sovereign.jpeg',
  '100.000 Years Of Refining Qi': 'assets/covers/100000-years-of-refining-qi.jpeg'
};

if (!getApps().length) initializeApp();
const db = getFirestore();

(async () => {
  const col = db.collection('users').doc(OWNER).collection('donghua');
  const snap = await col.get();
  const batch = db.batch();
  let n = 0;
  snap.docs.forEach(doc => {
    const url = covers[doc.data().judul];
    if (url) { batch.update(doc.ref, { cover: url }); n++; }
  });
  await batch.commit();
  console.log('Cover lokal dipasang ke ' + n + ' dokumen.');
})().catch(e => { console.error(e.message); process.exit(1); });

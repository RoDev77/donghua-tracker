const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const OWNER = '603891834858635274';
const covers = {
  'Renegade Immortal': 'https://anichin.moe/wp-content/uploads/2023/09/RENEGADE-IMMORTAL-SUBTITLE-INDONESIA-3.webp',
  'Azure Legacy': 'https://anichin.moe/wp-content/uploads/2023/06/Azure-Legacy-Season-3-Subtitle-Indonesia.webp',
  'Beyond Time’s Gaze': 'https://anichin.moe/wp-content/uploads/2025/12/Beyond-Times-Gaze-2-Subtitle-Indonesia.webp',
  'Tales of Herding Gods': 'https://anichin.moe/wp-content/uploads/2024/10/converted-107.webp',
  '100.000 Years Of Refining Qi': 'https://anichin.moe/wp-content/uploads/2023/02/100.000-Years-of-Refining-Qi-1-214x300.jpg'
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
  console.log('Cover ditambahkan ke ' + n + ' dokumen.');
})().catch(e => { console.error(e.message); process.exit(1); });

const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
if (!getApps().length) initializeApp();
const db = getFirestore();
(async () => {
  const doc = db.collection('users').doc('603891834858635274').collection('donghua').doc('1795803138517');
  await doc.update({ cover: 'assets/covers/against-the-gods.webp' });
  console.log('Cover Against the Gods diperbarui.');
})().catch(e => { console.error(e.message); process.exit(1); });

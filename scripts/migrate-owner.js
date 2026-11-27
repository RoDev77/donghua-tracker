const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const OWNER_ID = '603891834858635274';

if (!getApps().length) initializeApp();
const db = getFirestore();

(async () => {
  const src = db.collection('donghua');
  const dst = db.collection('users').doc(OWNER_ID).collection('donghua');
  const snap = await src.get();
  const batch = db.batch();
  snap.docs.forEach(doc => {
    batch.set(dst.doc(doc.id), doc.data());
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log('Migrated ' + snap.size + ' dokumen ke users/' + OWNER_ID + '/donghua');
})().catch(e => { console.error(e.message); process.exit(1); });

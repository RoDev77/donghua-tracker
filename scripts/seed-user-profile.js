const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

if (!getApps().length) initializeApp();
const db = getFirestore();

(async () => {
  await db.collection('users').doc('603891834858635274').set({
    username: 'ahmadrodiii',
    globalName: '0xRodi™',
    avatar: '',
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
  console.log('Profil publik dibuat/diperbarui.');
})().catch(e => { console.error(e.message); process.exit(1); });

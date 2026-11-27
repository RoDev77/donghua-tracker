const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (!getApps().length) {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (sa) initializeApp({ credential: cert(JSON.parse(sa)) });
  else initializeApp();
}
const db = getFirestore();

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const uid = String(new URL(req.url, 'https://dh.rstudiolab.tech').searchParams.get('uid') || '').trim();
  if (!uid) return res.status(400).json({ error: 'uid diperlukan' });

  try {
    const userDoc = await db.collection('users').doc(uid).get();
    const user = userDoc.exists ? {
      id: uid,
      username: String(userDoc.data().username || ''),
      globalName: String(userDoc.data().globalName || ''),
      avatar: String(userDoc.data().avatar || '')
    } : { id: uid, username: uid, globalName: uid, avatar: '' };

    const snap = await db.collection('users').doc(uid).collection('donghua').get();
    const donghua = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    donghua.sort((a, b) => Number(a.id) - Number(b.id));

    return res.status(200).json({ user, donghua });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
};

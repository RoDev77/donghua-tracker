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

  const q = String(new URL(req.url, 'https://dh.rstudiolab.tech').searchParams.get('q') || '').trim().toLowerCase();
  try {
    const snap = await db.collection('users').get();
    let users = snap.docs.map(doc => ({
      id: doc.id,
      username: String(doc.data().username || ''),
      globalName: String(doc.data().globalName || ''),
      avatar: String(doc.data().avatar || '')
    }));
    if (q) {
      users = users.filter(u =>
        u.username.toLowerCase().includes(q) ||
        u.globalName.toLowerCase().includes(q) ||
        u.id.includes(q)
      );
    }
    users.sort((a, b) => (a.globalName || a.username).localeCompare(b.globalName || b.username));
    return res.status(200).json({ users: users.slice(0, 50) });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
};

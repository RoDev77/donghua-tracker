const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { parseCookies, verify } = require('../lib/auth');

if (!getApps().length) {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (sa) initializeApp({ credential: cert(JSON.parse(sa)) });
  else initializeApp();
}

const db = getFirestore();

function collectionFor(req) {
  const cookies = parseCookies(req.headers.cookie);
  const session = verify(cookies.dh_session);
  if (!session || !session.id) return null;
  return db.collection('users').doc(String(session.id)).collection('donghua');
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const col = collectionFor(req);
  if (!col) return res.status(401).json({ error: 'Discord login diperlukan' });

  try {
    if (req.method === 'GET') {
      const snap = await col.get();
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => Number(a.id) - Number(b.id));
      return res.status(200).json(items);
    }

    if (req.method === 'PUT') {
      const items = Array.isArray(req.body) ? req.body : [];
      const batch = db.batch();
      const existing = await col.get();
      existing.forEach(doc => batch.delete(doc.ref));
      items.forEach(item => {
        batch.set(col.doc(String(item.id)), {
          judul: String(item.judul || ''),
          judulLain: String(item.judulLain || ''),
          hari: String(item.hari || ''),
          lastEp: String(item.lastEp ?? ''),
          nextEp: String(item.nextEp ?? ''),
          season: String(item.season || ''),
          status: String(item.status || 'Ongoing'),
          via: String(item.via || ''),
          seringDitonton: item.seringDitonton === true,
          updatedAt: FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      return res.status(200).json({ ok: true, count: items.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
};

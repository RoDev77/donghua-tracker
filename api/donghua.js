const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

if (!getApps().length) {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (sa) {
    initializeApp({ credential: cert(JSON.parse(sa)) });
  } else {
    initializeApp();
  }
}

const db = getFirestore();
const COLLECTION = 'donghua';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const snap = await db.collection(COLLECTION).get();
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => Number(a.id) - Number(b.id));
      return res.status(200).json(items);
    }

    if (req.method === 'PUT') {
      const items = Array.isArray(req.body) ? req.body : [];
      const col = db.collection(COLLECTION);
      const batch = db.batch();

      const existing = await col.get();
      existing.forEach(doc => batch.delete(doc.ref));

      items.forEach(item => {
        const id = String(item.id);
        batch.set(col.doc(id), {
          judul: String(item.judul || ''),
          judulLain: String(item.judulLain || ''),
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
      return res.status(200).json({ ok: true, count: items.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
};

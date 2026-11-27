const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const OWNER = '603891834858635274';
const covers = {
  'A Record of a Mortal’s Journey to Immortality': 'assets/covers/a-record-of-a-mortal’s-journey-to-immortality.webp',
  'Against the Sky Supreme': 'assets/covers/against-the-sky-supreme.webp',
  'Apotheosis': 'assets/covers/apotheosis.webp',
  'Battle Through the Heavens': 'assets/covers/battle-through-the-heavens.webp',
  'Martial Master': 'assets/covers/martial-master.webp',
  'My Senior Brother Is Too Steady': 'assets/covers/my-senior-brother-is-too-steady.jpg',
  'Perfect World': 'assets/covers/perfect-world.webp',
  'Soul Land': 'assets/covers/soul-land.webp',
  'Spirit Sword Sovereign': 'assets/covers/spirit-sword-sovereign.webp',
  'Supreme God Emperor': 'assets/covers/supreme-god-emperor.webp',
  'Swallowed Star': 'assets/covers/swallowed-star.webp',
  'The Great Ruler': 'assets/covers/the-great-ruler.webp',
  'The Young Brewmaster’s Adventure': 'assets/covers/the-young-brewmaster’s-adventure.webp',
  'Throne Of Seal': 'assets/covers/throne-of-seal.webp',
  'Yuan Long': 'assets/covers/yuan-long.jpg'
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
  const missing = Object.keys(covers).filter(t => !snap.docs.some(d => d.data().judul === t));
  if (missing.length) console.log('Judul tidak ditemukan:', missing.join(', '));
})().catch(e => { console.error(e.message); process.exit(1); });

const fs = require('fs');

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

let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
let n = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.includes('judul:')) continue;
  for (const [judul, url] of Object.entries(covers)) {
    if (!line.includes(`judul: '${judul}'`)) continue;
    if (line.includes('cover:')) break;
    lines[i] = line.replace(`judul: '${judul}',`, `judul: '${judul}', cover: '${url}',`);
    n++;
    break;
  }
}
html = lines.join('\n');
fs.writeFileSync('index.html', html);
console.log('Seed diperbarui untuk ' + n + ' judul.');

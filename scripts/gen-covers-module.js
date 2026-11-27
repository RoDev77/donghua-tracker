const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'assets', 'covers');
const norm = s => String(s || '').toLowerCase()
  .replace(/\.[^.]+$/, '')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const map = {};
fs.readdirSync(DIR).forEach(name => {
  map[norm(name)] = 'assets/covers/' + name;
});

const body = Object.entries(map)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
  .join(',\n');

const out = `// Generated from assets/covers oleh scripts/gen-covers-module.js
const MAP = {
${body}
};
const norm = s => String(s || '').toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
function coverFor(judul) { return MAP[norm(judul)] || ''; }
module.exports = { coverFor, MAP };
`;

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'covers.js'), out);
console.log('lib/covers.js dibuat dengan ' + Object.keys(map).length + ' entri.');

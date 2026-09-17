// Verify Pexels CDN URLs via HEAD requests (concurrent); write passing IDs grouped by term
import fs from 'node:fs';

const index = JSON.parse(fs.readFileSync('tools/pexels-good.json', 'utf8'));
const results = {};

async function check(term, id) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
    const ct = res.headers.get('content-type') || '';
    return { id, ok: res.ok && ct.includes('jpeg') };
  } catch { return { id, ok: false }; }
}

const all = [];
for (const [term, ids] of Object.entries(index)) {
  results[term] = [];
  for (const id of ids) all.push({ term, id });
}
const B = 12;
for (let i = 0; i < all.length; i += B) {
  const batch = all.slice(i, i + B);
  const out = await Promise.all(batch.map((t) => check(t.term, t.id)));
  out.forEach((r, k) => {
    const t = batch[k];
    if (r.ok) results[t.term].push(t.id);
    else console.log('BAD', t.term, t.id);
  });
  fs.writeFileSync('tools/pexels-verified.json', JSON.stringify(results, null, 1));
  process.stdout.write('.');
}
for (const [term, ids] of Object.entries(results)) console.log('VERIFIED', term, ids.length + '/' + index[term].length);
console.log('DONE');
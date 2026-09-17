// Verify a curated list of famous Pexels photo IDs (from memory) across needed topics
import fs from 'node:fs';

const GUESSES = {
  diningFood: ['67468', '1640777', '1099680', '2878747', '376464', '1639557', '262978', '2102587', '551628', '1581384'],
  dessert: ['1624487', '1855217', '1126359', '291528', '1321935'],
  champagneBar: ['1129413', '851555', '279573', '1478590'],
  coffeeCafe: ['312418', '1233319', '1029243', '1132049', '1295572', '302899'],
  interiorArch: ['1571460', '271624', '262048', '1454806', '2417842', '1287460', '1579253', '1259619'],
  spaWellness: ['1545743', '221210', '3771167', '3757950'],
  gymFitness: ['1954524', '841130', '1552242', '260352'],
  cinema: ['1487154', '799157', '2271110'],
  shoppingRetail: ['2536965', '3900413', '5668857', '1445203', '325876', '1926959'],
  perfumeBeauty: ['1961795', '2490805', '1813513', '3373722', '1452821'],
  jewelryWatch: ['935743', '2113853', '190819', '2783873', '1029717', '277390'],
  sunglasses: ['210474'],
  peopleFashion: ['1130626', '1043474', '297933', '415829', '733872', '220453', '2182970'],
  streetModel: ['1464367', '3771069'],
  hotel: ['189296', '258154'],
  shoppingBags: ['583842', '2529558', '842811', '1580287'],
  eventParty: ['1190298', '2608517', '169190'],
};

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
for (const [term, ids] of Object.entries(GUESSES)) {
  results[term] = [];
  for (const id of ids) all.push({ term, id });
}
const B = 12;
for (let i = 0; i < all.length; i += B) {
  const batch = all.slice(i, i + B);
  const out = await Promise.all(batch.map((t) => check(t.term, t.id)));
  out.forEach((r, k) => { if (r.ok) results[batch[k].term].push(batch[k].id); });
}
for (const [term, ids] of Object.entries(results)) console.log(term.padEnd(16), ids.join(','));
fs.writeFileSync('tools/pexels-famous-verified.json', JSON.stringify(results, null, 1));
console.log('DONE');
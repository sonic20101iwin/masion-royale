// Round 2: extract Pexels fashion IDs from saved HTML + retry Commons gaps with better terms
import fs from 'node:fs';

function cleanThumb(u) { return u.split('?')[0]; }

const savePexels = () => {
  const html = fs.readFileSync('tools/p1.html', 'utf8');
  const re = /https:\/\/images\.pexels\.com\/photos\/(\d+)\/pexels-photo-\d+\.jpeg/g;
  const ids = [...new Set([...html.matchAll(re)].map((m) => m[1]))];
  const urls = ids.slice(0, 24).map((id) => ({
    src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1800&fit=crop`,
    srcType: 'PE', id, source: 'pexels',
  }));
  console.log('SAVED PEXELS ids', ids.length);
  return urls;
};

const commonsTerms = {
  'shoe': 'pair of leather shoes footwear',
  'watch': 'wristwatch closeup macro watch',
  'sneaker': 'sneaker shoe white studio',
  'diamond': 'diamond engagement ring macro',
  'manwatch': 'gentleman suit pocket watch',
  'champagne': 'champagne flute pouring',
  'fashion': 'fashion editorial photography',
  'food': 'restaurant dish gourmet plate',
  'barista': 'cafe coffee cup barista',
  'stylishwoman': 'fashion woman elegant dress street',
  'jacket': 'leather jacket fashion model',
  'tie': 'necktie fashion accessories',
  'sunglasses': 'sunglasses fashion accessory',
  'gowns': 'wedding gown elegant dress bride',
  'shirtdetail': 'suit jacket closeup men formal',
  'perfumebottle': 'perfume glass bottle fragrance',
  'handbagleather': 'leather bag luxury boutique',
  'giftbox': 'luxury gift box ribbon gold',
  'hotellobby': 'hotel lobby luxury interior chandelier',
  'nightcity': 'shopping street night lights city',
  'lightswall': 'luxury boutique store window display',
  'car': 'luxury sports car front',
  'winebar': 'wine bar glasses bottle restaurant',
  'seafood': 'oysters seafood fine dining',
  'steak': 'steak gourmet restaurant plating',
  'pastry': 'french pastry macaron dessert',
  'iced': 'cocktail drink bar elegant',
  'yoga': 'spa relaxation wellness towel',
  'swimmingpool': 'resort swimming pool luxury hotel',
  'runway': 'fashion show runway models',
  'models': 'models fashion photo shoot studio',
  'earrings': 'earrings jewelry woman model',
  'bracelet': 'gold bracelet jewelry closeup',
  'chinese': 'chinese fine dining restaurant interior',
  'italian': 'italian restaurant pasta interior',
  'sushibar': 'sushi bar japanese restaurant interior',
  'coffeeshop': 'coffee shop modern interior cafe',
  'bowling': 'bowling alley entertainment interior',
  'theater': 'theater stage performance concert',
  'kidsplay': 'kids play area indoor entertainment',
};

async function commonsSearch(termKey, q) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
    encodeURIComponent('filetype:bitmap ' + q) +
    '&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=1400&format=json';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (mall-site-builder; contact@example.com)' },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  const out = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info?.thumburl) continue;
    const w = info.width || 0, h = info.height || 0;
    if (p.title.toLowerCase().includes('.svg') || p.title.toLowerCase().endsWith('.tif')) continue;
    if (h < 850 || w < 850) continue;
    out.push({ src: cleanThumb(info.thumburl), srcType: 'CO', title: p.title, source: 'commons' });
  }
  console.log('C2', termKey, out.length);
  return out.slice(0, 10);
}

const index = JSON.parse(fs.readFileSync('tools/img-index.json', 'utf8'));
index['fashion'] = [...(savePexels()), ...(index['fashion'] || [])];

for (const [key, q] of Object.entries(commonsTerms)) {
  if (index[key] && index[key].length >= 3 && !['shoe', 'watch', 'sneaker', 'diamond', 'food', 'champagne'].includes(key)) continue;
  const urls = await commonsSearch(key, q);
  index[key] = [...(index[key] || []), ...urls];
}

fs.writeFileSync('tools/img-index.json', JSON.stringify(index, null, 1));
console.log('DONE');
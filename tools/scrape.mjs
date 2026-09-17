// Scrape topic-accurate image URLs from Pexels search pages + Wikimedia Commons API
import fs from "node:fs";

const OUT = "tools/img-index.json";

const PE = "PE",
  CO = "CO";

// ---- 1. Pexels: parse already-saved HTML files (p*.html) or fetch fresh search pages
const pexelsTerms = {
  fashion: "luxury%20fashion",
  shoe: "luxury%20shoes",
  watch: "luxury%20watch",
  bag: "luxury%20handbag",
  jewelry: "luxury%20jewelry",
  dining: "fine%20dining%20restaurant",
  food: "gourmet%20food%20plating",
  interior: "luxury%20mall%20interior",
  escalator: "mall%20escalator",
  spa: "luxury%20spa",
  cinema: "cinema%20movie%20theater",
  event: "party%20event%20celebration",
  lounge: "lounge%20bar%20cocktail",
  dessert: "dessert%20cake%20pastry",
  suit: "man%20suit%20fashion",
  dress: "elegant%20dress%20woman",
  sneaker: "sneakers%20shoes",
  heels: "high%20heels%20shoes",
  perfume: "perfume%20bottle%20luxury",
  makeup: "makeup%20cosmetics",
  fitness: "luxury%20gym%20fitness",
  building: "modern%20architecture%20building",
  city: "luxury%20city%20night",
  gift: "luxury%20gift%20box",
  valet: "valet%20parking%20car",
  stylishwoman: "stylish%20woman%20shopping",
  manwatch: "man%20luxury%20life",
  champagne: "champagne%20toast%20celebration",
  barista: "coffee%20cafe%20latte",
  diamond: "diamond%20ring%20luxury",
  jacket: "fashion%20jacket%20coat",
};

function pexelsUrl(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1800&fit=crop`;
  // keep compression params — typical pexels CDN requires no auth; w/h params control size
}

async function pexelsSearch(termKey, query) {
  const url = `https://www.pexels.com/search/${query}/`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) {
    console.log("PEXELS FAIL", termKey, res.status);
    return [];
  }
  const html = await res.text();
  const re =
    /https:\/\/images\.pexels\.com\/photos\/(\d+)\/pexels-photo-\d+\.jpeg/g;
  const ids = [...new Set([...html.matchAll(re)].map((m) => m[1]))];
  console.log("PEXELS", termKey, ids.length);
  return ids
    .slice(0, 14)
    .map((id) => ({ src: pexelsUrl(id), srcType: PE, id }));
}

// ---- 2. Wikimedia Commons API per topic
const commonsTerms = {
  fashion: "fashion model runway",
  shoe: "designer shoes product photography",
  watch: "luxury wristwatch macro",
  bag: "luxury leather handbag",
  jewelry: "gold jewelry necklace gemstone",
  dining: "fine dining restaurant interior",
  food: "gourmet plated dish restaurant",
  interior: "shopping mall atrium interior",
  escalator: "escalator shopping mall",
  spa: "luxury spa hotel swimming",
  cinema: "cinema auditorium seats",
  event: "evening gala celebration event",
  lounge: "cocktail bar lounge interior",
  dessert: "dessert plated patisserie",
  suit: "man in elegant suit portrait",
  dress: "elegant evening gown dress",
  sneaker: "sneakers fashion shoes studio",
  heels: "high heel shoes",
  perfume: "perfume bottle product",
  makeup: "cosmetics makeup products",
  fitness: "gym fitness interior",
  building: "modern luxury architecture facade",
  city: "city skyline night lights",
  gift: "gift box ribbon present",
  valet: "luxury car parked entrance",
  stylishwoman: "woman shopping bags fashion",
  manwatch: "man elegant suit lifestyle",
  champagne: "champagne glasses celebration",
  barista: "coffee shop interior barista",
  diamond: "diamond ring jewelry macro",
  jacket: "fashion coat woman street style",
};

function cleanThumb(u) {
  // keep the thumb.wikimedia.org 1280px url but drop utm tracking params (optional & allowed)
  return u.split("?")[0];
}

async function commonsSearch(termKey, q) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
    encodeURIComponent("filetype:bitmap " + q) +
    "&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=1400&format=json";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (mall-site-builder; contact@example.com)",
    },
  });
  if (!res.ok) {
    console.log("COMMONS FAIL", termKey, res.status);
    return [];
  }
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  const out = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info?.thumburl) continue;
    const w = info.width || 0,
      h = info.height || 0;
    const isSvg =
      p.title.toLowerCase().endsWith(".svg") ||
      p.title.toLowerCase().includes(".tif");
    if (isSvg) continue;
    if (h < 900 || w < 900) continue; // keep meaningful resolution
    out.push({ src: cleanThumb(info.thumburl), srcType: CO, title: p.title });
  }
  console.log("COMMONS", termKey, out.length);
  return out.slice(0, 10);
}

// ---- 3. Run everything
const index = {};
for (const [key, q] of Object.entries(pexelsTerms)) {
  const urls = await pexelsSearch(key, q);
  index[key] = index[key] || [];
  index[key].push(...urls.map((u) => ({ ...u, source: "pexels" })));
}
for (const [key, q] of Object.entries(commonsTerms)) {
  const urls = await commonsSearch(key, q);
  index[key] = index[key] || [];
  index[key].push(...urls.map((u) => ({ ...u, source: "commons" })));
}
fs.writeFileSync(OUT, JSON.stringify(index, null, 1));
console.log("WROTE", OUT);

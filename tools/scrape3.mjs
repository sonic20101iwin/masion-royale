// Round 3: scrape Pexels search pages via curl.exe for all topics -> curated index
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const TERMS = {
  fashion: "luxury fashion",
  models: "fashion model editorial",
  runway: "fashion show runway",
  dress: "elegant dress woman fashion",
  gown: "evening gown dress",
  suit: "man in suit fashion",
  menswear: "man fashion style",
  shoe: "luxury shoes",
  sneaker: "designer sneakers",
  heels: "high heels shoes",
  boots: "leather boots fashion",
  loafers: "loafers shoes",
  watch: "luxury watch wrist",
  watchmen: "man wearing watch",
  bag: "luxury handbag",
  clutch: "clutch bag elegant",
  jewelry: "luxury jewelry gold",
  earrings: "earrings woman",
  necklace: "necklace gold luxury",
  ring: "diamond ring luxury",
  bracelet: "gold bracelet",
  perfume: "perfume luxury bottle",
  makeup: "luxury makeup cosmetics",
  sunglasses: "sunglasses luxury",
  scarf: "silk scarf fashion",
  dining: "fine dining restaurant",
  food: "gourmet food restaurant",
  plate: "fine dining plate dish",
  dessert: "luxury dessert",
  pastry: "french pastry macarons",
  champagne: "champagne glasses",
  wine: "wine glass restaurant",
  cafe: "luxury cafe interior",
  lounge: "luxury lounge bar",
  cocktail: "cocktail bar elegant",
  sushi: "sushi restaurant",
  steak: "steak fine dining",
  seafood: "seafood gourmet restaurant",
  cinema: "movie theater seats",
  arcade: "arcade games neon",
  stage: "concert stage lights",
  party: "party event luxury",
  event: "event venue luxury",
  exhibition: "art exhibition gallery",
  interior: "luxury mall interior",
  escalator: "escalator shopping mall",
  atrium: "shopping mall atrium",
  facade: "luxury building facade",
  lobby: "hotel lobby luxury",
  spa: "luxury spa",
  massage: "spa massage wellness",
  pool: "luxury swimming pool",
  fitness: "luxury gym",
  yoga: "yoga studio luxury",
  modelstreet: "fashion street style woman",
  shoppingwoman: "woman shopping bags",
  giftbox: "luxury gift box",
  ribbon: "gold ribbon present",
  valet: "valet parking",
  car: "luxury car black",
  nightcity: "city night luxury",
  boutiqueWindow: "luxury boutique storefront",
  watchdetail: "watch closeup macro",
  heelslegs: "high heels legs woman",
  manwatchcuff: "man suit watch cuff",
  leather: "leather goods luxury",
  tie: "tie formal men",
  jewelrywear: "woman wearing jewelry",
  hotelroom: "luxury hotel room",
  loungechair: "luxury armchair interior",
  staircase: "luxury staircase interior",
  weddinggown: "wedding dress boutique",
  tailor: "tailor suit atelier",
  shoesdisplay: "shoe store display",
  bagsdisplay: "handbag store display",
  watchesdisplay: "watch store display",
};

const results = fs.existsSync("tools/pexels-index.json")
  ? JSON.parse(fs.readFileSync("tools/pexels-index.json", "utf8"))
  : {};
for (const [key, term] of Object.entries(TERMS)) {
  if (results[key] && results[key].length > 0) {
    console.log(key.padEnd(16), "cached");
    continue;
  }
  const q = encodeURIComponent(term);
  const file = `tools/px/${key}.html`;
  fs.mkdirSync("tools/px", { recursive: true });
  try {
    execFileSync(
      "curl.exe",
      [
        "-s",
        "-L",
        "--max-time",
        "25",
        "-A",
        UA,
        `https://www.pexels.com/search/${q}/`,
        "-o",
        file,
      ],
      { stdio: ["ignore", "ignore", "inherit"] },
    );
  } catch (e) {
    console.log("CURL FAIL", key);
    continue;
  }

  const html = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const re =
    /https:\/\/images\.pexels\.com\/photos\/(\d+)\/pexels-photo-\d+\.jpeg/g;
  const ids = [...new Set([...html.matchAll(re)].map((m) => m[1]))];
  results[key] = ids.slice(0, 16);
  console.log(key.padEnd(16), term.padEnd(24), ids.length);
  // incremental save so timeouts don't lose progress
  fs.writeFileSync("tools/pexels-index.json", JSON.stringify(results, null, 1));
}

fs.writeFileSync("tools/pexels-index.json", JSON.stringify(results, null, 1));
console.log("WROTE tools/pexels-index.json");

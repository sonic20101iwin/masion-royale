// Extract unique Pexels IDs from the good (large) saved HTML files and verify CDN access
import fs from "node:fs";

const FILES = {
  fashion: ["tools/p1.html", "tools/px/fashion.html"],
  dress: ["tools/px/dress.html"],
  shoe: ["tools/p_shoe.html", "tools/px/shoe.html"],
  loafers: ["tools/px/loafers.html"],
  watch: ["tools/p_watch.html"],
};

const byTerm = {};
for (const [term, files] of Object.entries(FILES)) {
  const ids = new Set();
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const html = fs.readFileSync(f, "utf8");
    const re =
      /https:\/\/images\.pexels\.com\/photos\/(\d+)\/pexels-photo-\d+\.jpeg/g;
    for (const m of html.matchAll(re)) ids.add(m[1]);
  }
  byTerm[term] = [...ids];
  console.log(term, ids.size);
}
fs.writeFileSync("tools/pexels-good.json", JSON.stringify(byTerm, null, 1));
console.log("WROTE tools/pexels-good.json");

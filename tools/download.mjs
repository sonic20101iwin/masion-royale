// Download candidate images for visual curation — concurrent version (resumes)
import fs from "node:fs";
import path from "node:path";

const PREVIEW = "tools/preview";
fs.mkdirSync(PREVIEW, { recursive: true });
const index = JSON.parse(fs.readFileSync("tools/img-index.json", "utf8"));

const plan = {
  fashion: 6,
  models: 4,
  runway: 4,
  shoe: 6,
  heels: 6,
  sneaker: 6,
  watch: 4,
  bag: 6,
  jewelry: 6,
  diamond: 2,
  earrings: 3,
  dress: 6,
  gowns: 3,
  suit: 4,
  jacket: 3,
  stylishwoman: 3,
  sunglasses: 3,
  perfume: 4,
  makeup: 4,
  dining: 4,
  food: 3,
  dessert: 4,
  pastry: 2,
  champagne: 3,
  lounge: 5,
  barista: 4,
  interior: 6,
  escalator: 5,
  building: 5,
  hotellobby: 3,
  nightcity: 4,
  spa: 5,
  swimmingpool: 3,
  fitness: 4,
  cinema: 6,
  event: 4,
  car: 4,
  gift: 5,
  valet: 4,
  tie: 2,
  manwatch: 1,
  italian: 3,
  sushibar: 4,
  coffeeshop: 3,
};

const tasks = [];
for (const [key, count] of Object.entries(plan)) {
  const list = (index[key] || []).slice(0, count);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const ext = path.extname(new URL(item.src).pathname) || ".jpg";
    const name = `${key}_${String(i).padStart(2, "0")}${ext}`;
    const dest = path.join(PREVIEW, name);
    if (fs.existsSync(dest)) continue;
    tasks.push({ key, name, dest, src: item.src });
  }
}
console.log("TODO", tasks.length);

const failures = [];
let done = 0;
const workers = 12;
const batches = [];
for (let i = 0; i < tasks.length; i += workers)
  batches.push(tasks.slice(i, i + workers));

for (const batch of batches) {
  await Promise.all(
    batch.map(async (t) => {
      try {
        const res = await fetch(t.src, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          },
        });
        if (!res.ok) {
          failures.push([t.key, t.name, res.status]);
          return;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 2000 || buf[0] !== 0xff || buf[1] !== 0xd8) {
          failures.push([t.key, t.name, "BAD:" + buf.length]);
          return;
        }
        fs.writeFileSync(t.dest, buf);
        done++;
      } catch (e) {
        failures.push([t.key, t.name, "ERR"]);
      }
    }),
  );
  process.stdout.write(".");
}
console.log("\nDOWNLOADED:", done, "FAILURES:", failures.length);
for (const f of failures.slice(0, 40)) console.log("FAIL", f.join(" | "));

const manifest = {};
for (const d of fs.readdirSync(PREVIEW)) {
  const m = d.match(/^(.*?)_(\d+)\.(jpg|jpeg|png)$/);
  if (!m) continue;
  const cand = (index[m[1]] || [])[+m[2]];
  if (cand) manifest[d] = cand.src;
}
fs.writeFileSync(
  "tools/preview-manifest.json",
  JSON.stringify(manifest, null, 1),
);
console.log("MANIFEST", Object.keys(manifest).length);

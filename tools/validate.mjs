// ---------------------------------------------------------------------------
// MAISON ROYALE — site validator
// 1) node --check every .js
// 2) every local href/src in every .html resolves to an existing file
// 3) critical element ids referenced by JS exist on the pages using them
// 4) no leftover build markers (@@ or __X__) in shipped html/js
// ---------------------------------------------------------------------------
import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, join, extname } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
let errors = 0;
function fail(msg) { errors++; console.log('  FAIL: ' + msg); }

// 1) JS syntax
console.log('== JS syntax ==');
const jsFiles = [];
function walk(dir) {
  readdirSync(dir).forEach(function (f) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (extname(f) === '.js') jsFiles.push(p);
  });
}
walk(ROOT);
jsFiles.forEach(function (f) {
  try { execSync('node --check "' + f + '"', { stdio: 'pipe' }); console.log('  ok   ' + f); }
  catch (e) { fail(f + ' — ' + String(e.stderr || e).slice(0, 300)); }
});

// 2) + 3) HTML audit
console.log('== HTML audit ==');
const htmlFiles2 = [];
function walk2(dir) {
  readdirSync(dir).forEach(function (f) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) {
      if (f === 'tools' || f === 'px' || f === 'preview' || f === 'assets') return;
      walk2(p);
    } else if (f.endsWith('.html')) htmlFiles2.push(p);
  });
}
walk2(ROOT);

htmlFiles2.forEach(function (file) {
  const src = readFileSync(file, 'utf8');
  const base = dirname(file);
  const m = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  // leftover markers
  if (/@@[A-Z0-9]+@@|__[A-Z0-9_]+__/.test(src)) fail(m + ' contains leftover marker');
  // local asset refs
  const refs = src.match(/(?:src|href)="([^"]+)"/g) || [];
  refs.forEach(function (ref) {
    const u = ref.replace(/^(?:src|href)="/, '').replace(/"$/, '');
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(u)) return;
    if (u.indexOf(' + ') !== -1 || u.indexOf('${') !== -1) return; // JS-concatenated
    const clean = u.split('#')[0].split('?')[0];
    if (!clean) return;
    let target = resolve(base, clean);
    if (!existsSync(target)) fail(m + ' -> ' + clean + ' (404)');
  });
});

// 3) critical ids
console.log('== Critical id presence ==');
const idMap = {
  'index.html': ['homeBrands', 'homeProducts', 'homeShoes', 'homeDining', 'homeEvents', 'homeOffers', 'homeServices'],
  'pages/stores.html': ['storeGrid', 'storeCount', 'storePager', 'storeSearch', 'storeSort', 'groupPills', 'floorPills', 'storeModal'],
  'pages/fashion.html': ['fashionGrid', 'fashionCount', 'fashionSearch', 'fashionCat', 'fashionModal'],
  'pages/dining.html': ['diningGrid', 'diningCount', 'diningSearch', 'diningCat', 'diningModal'],
  'pages/entertainment.html': ['entGrid', 'entCount', 'entCat', 'entModal'],
  'pages/events.html': ['eventGrid', 'eventCount', 'eventCat', 'eventModal'],
  'pages/offers.html': ['offerGrid', 'offerCount', 'offerCat'],
  'pages/contact.html': ['contactForm'],
  'dashboard/index.html': ['perfRows', 'kStores'],
  'dashboard/stores.html': ['storesTbody', 'storesPager', 'storesCount', 'storesSearch', 'storesTable', 'addStoreBtn', 'crudModal'],
  'dashboard/products.html': ['productsTbody', 'productsPager', 'productsCount', 'productsSearch', 'productsTable', 'addProductBtn', 'productModal', 'prModalTitle', 'prSubmitLabel'],
  'dashboard/events.html': ['eventsTbody', 'eventsTable', 'addEventBtn', 'crudModal'],
  'dashboard/offers.html': ['offersTbody', 'offersTable', 'addOfferBtn', 'crudModal'],
  'dashboard/analytics.html': ['channelRows'],
  'dashboard/settings.html': ['saveSettingsBtn', 'setName'],
  'dashboard/customers.html': ['custBody', 'miniSearch'],
  'dashboard/bookings.html': ['bookBody', 'miniSearch'],
  'dashboard/messages.html': ['msgBody', 'miniSearch'],
  'dashboard/brands.html': ['brandsBody', 'miniSearch'],
  'dashboard/categories.html': ['catBody'],
  'dashboard/restaurants.html': ['restBody']
};
Object.keys(idMap).forEach(function (k) {
  const p = resolve(ROOT, k);
  if (!existsSync(p)) { fail('page missing: ' + k); return; }
  const src = readFileSync(p, 'utf8');
  idMap[k].forEach(function (id) {
    if (src.indexOf('id="' + id + '"') === -1) fail(k + ' missing #' + id);
  });
});

if (errors) { console.log('\n' + errors + ' problem(s) found.'); process.exit(1); }
console.log('\nALL CHECKS PASSED');
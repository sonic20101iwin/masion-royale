// ============================================================================
// MAISON ROYALE — dashboard page generator
// Builds all 13 dashboard pages from a shared sidebar/header chrome.
// ============================================================================
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'dashboard');
mkdirSync(OUT, { recursive: true });

const LINKS = [
  { s: 'Overview', items: ['index.html|Dashboard|fa-chart-pie'] },
  { s: 'Management', items: [
    'stores.html|Stores|fa-store',
    'brands.html|Brands|fa-star',
    'products.html|Products|fa-shirt',
    'categories.html|Categories|fa-tags',
    'restaurants.html|Restaurants|fa-utensils',
    'events.html|Events|fa-calendar',
    'offers.html|Offers|fa-tag'] },
  { s: 'Guests', items: [
    'customers.html|Customers / Visitors|fa-users',
    'bookings.html|Bookings|fa-calendar-check',
    'messages.html|Messages|fa-envelope'] },
  { s: 'Insights', items: [
    'analytics.html|Analytics|fa-chart-line',
    'settings.html|Settings|fa-gear'] }
];

function sidebar(activeFile) {
  const s = [];
  s.push('<aside class="dash-sidebar">');
  s.push('<div class="sd-head">');
  s.push('<a class="nav-logo" href="index.html"><span class="monogram"><span>R</span></span><span class="word"><b>ROYALE</b><small style="display:block;font-size:.52rem;letter-spacing:.4em;color:var(--gold)">MANAGEMENT</small></span></a>');
  s.push('<button class="sd-collapse" data-sidebar-collapse aria-label="Collapse sidebar"><i class="fa-solid fa-chevron-left"></i></button>');
  s.push('</div>');
  LINKS.forEach(function (sec) {
    s.push('<div class="sd-section">' + sec.s + '</div>');
    s.push('<div class="sd-links">');
    sec.items.forEach(function (it) {
      const f = it.split('|');
      const active = f[0] === activeFile ? ' active' : '';
      let count = '';
      if (f[0] === 'messages.html') count = '<span class="sd-count">3</span>';
      if (f[0] === 'bookings.html') count = '<span class="sd-count">6</span>';
      s.push('<a href="' + f[0] + '" data-dpage="' + f[0] + '"' + active + '><i class="fa-solid ' + f[2] + '"></i><span>' + f[1] + '</span>' + count + '</a>');
    });
    s.push('</div>');
  });
  s.push('<div class="sd-foot"><div class="sd-card">');
  s.push('<b>Need a hand?</b><p>The command centre learns from every sale across the maison.</p>');
  s.push('<a class="btn btn-gold btn-sm w-100" href="../pages/contact.html"><i class="fa-solid fa-headset"></i> Concierge Desk</a>');
  s.push('</div></div>');
  s.push('</aside>');
  return s.join('\n');
}
function header() {
  const s = [];
  s.push('<header class="dash-header">');
  s.push('<button class="dh-burger d-lg-none" id="mobileBurger" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>');
  s.push('<div class="dash-search-box"><i class="fa-solid fa-magnifying-glass"></i>');
  s.push('<input id="dashGlobalSearch" type="search" placeholder="Search the command centre\u2026" aria-label="Global search"></div>');
  s.push('<div class="dh-spacer"></div>');
  s.push('<div class="dash-date-selector" role="button" tabindex="0"><i class="fa-solid fa-calendar"></i><span class="js-date-label">This week</span></div>');
  s.push('<button class="dash-icon-btn" data-notif-toggle aria-label="Notifications"><i class="fa-solid fa-bell"></i><span class="dib-badge">3</span></button>');
  s.push('<div class="dropdown">');
  s.push('<button class="dash-icon-btn" data-bs-toggle="dropdown" aria-label="Messages"><i class="fa-solid fa-envelope"></i><span class="dib-badge">2</span></button>');
  s.push('<div class="dropdown-menu dropdown-menu-end dash-dropdown dd-msgs">');
  s.push('<div class="dd-head"><b>Messages</b><a href="messages.html">View all</a></div>');
  s.push('<a class="dd-item" href="messages.html"><span class="dd-ic unread"><i class="fa-solid fa-user"></i></span><span><b>Charlotte M.</b><p>Private preview request \u2014 Saturday?</p></span><time>2m</time></a>');
  s.push('<a class="dd-item" href="messages.html"><span class="dd-ic unread"><i class="fa-solid fa-user"></i></span><span><b>Henri S.</b><p>Lost &amp; found: leather tote, Level 1</p></span><time>1h</time></a>');
  s.push('<div class="dd-foot"><a href="messages.html" class="btn btn-ghost btn-sm">Open inbox</a></div>');
  s.push('</div></div>');
  s.push('<div class="dropdown">');
  s.push('<div class="dash-profile" role="button" tabindex="0"><span class="dp-avatar">AB</span><span><span class="dash-name">Alex Beaumont</span><span class="dash-role">General Manager</span></span></div>');
  s.push('<div class="dropdown-menu dropdown-menu-end profile-dd">');
  s.push('<a class="dropdown-item" href="settings.html"><i class="fa-solid fa-user-pen"></i> My profile</a>');
  s.push('<a class="dropdown-item" href="settings.html"><i class="fa-solid fa-gear"></i> Preferences</a>');
  s.push('<a class="dropdown-item" href="../index.html"><i class="fa-solid fa-building"></i> View public site</a>');
  s.push('</div></div>');
  s.push('<div class="dropdown">');
  s.push('<button class="btn btn-add btn-sm qa-btn" data-bs-toggle="dropdown" aria-label="Quick actions"><i class="fa-solid fa-plus"></i> Quick Action</button>');
  s.push('<div class="dropdown-menu dropdown-menu-end qa-menu">');
  s.push('<a class="dropdown-item" href="stores.html"><i class="fa-solid fa-store"></i> Add store</a>');
  s.push('<a class="dropdown-item" href="products.html"><i class="fa-solid fa-shirt"></i> Add product</a>');
  s.push('<a class="dropdown-item" href="events.html"><i class="fa-solid fa-calendar"></i> Add event</a>');
  s.push('<a class="dropdown-item" href="offers.html"><i class="fa-solid fa-tag"></i> Create offer</a>');
  s.push('</div></div>');
  s.push('</header>');
  return s.join('\n');
}

const CONFIRM = '<div class="modal fade dash-modal" id="confirmModal" tabindex="-1" aria-hidden="true">' +
  '<div class="modal-dialog modal-dialog-centered" style="max-width:420px"><div class="modal-content">' +
  '<div class="modal-body" style="text-align:center;padding:34px 30px">' +
  '<div class="confirm-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>' +
  '<h5 class="confirm-title" style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:8px">Are you sure?</h5>' +
  '<p class="confirm-msg" style="color:var(--muted);font-size:.9rem;margin-bottom:22px">This action cannot be undone.</p>' +
  '<div class="d-flex gap-2 justify-content-center"><button class="btn btn-ghost btn-sm confirm-no" data-bs-dismiss="modal">Cancel</button>' +
  '<button class="btn btn-sm confirm-yes" style="background:var(--burgundy);color:var(--ivory)">Yes, continue</button></div>' +
  '</div></div></div></div>';
function shell(name, opts) {
  opts = opts || {};
  const s = [];
  s.push('<!doctype html>\n<html lang="en">\n<head>');
  s.push('<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">');
  s.push('<title>' + opts.title + ' — Maison Royale Admin</title>');
  s.push('<meta name="description" content="Maison Royale management dashboard — ' + opts.title + '.">');
  s.push('<link rel="preconnect" href="https://fonts.googleapis.com">');
  s.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
  s.push('<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">');
  s.push('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">');
  s.push('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">');
  s.push('<link rel="stylesheet" href="../css/style.css">');
  s.push('<link rel="stylesheet" href="../css/dashboard.css">');
  s.push('<link rel="stylesheet" href="../css/responsive.css">');
  s.push('</head>');
  s.push('<body class="dash-body">');
  s.push('<div class="dash-shell">\n' + sidebar(name) + '\n<div class="dash-backdrop"></div>\n<div class="dash-main">\n' + header());
  s.push('<div class="dash-content">');
  s.push(opts.content || '');
  s.push('</div>');
  s.push('<footer class="dash-footer-bar"><span>Maison Royale \u2014 Command Centre</span><span>\u00A9 <span class="js-dash-year">2026</span> Maison Royale</span></footer>');
  s.push('</div></div>');
  s.push((opts.modals || '') + CONFIRM);
  s.push('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>');
  s.push('<script src="../js/img-map.js"></script>');
  s.push('<script src="../js/data.js"></script>');
  s.push('<script src="../js/dashboard.js"></script>');
  s.push('<script src="../js/dashboard-crud.js"></script>');
  if (opts.useCharts) s.push('<script src="../js/analytics.js"></script>');
  if (opts.inline) s.push('<script>' + opts.inline + '</script>');
  s.push('</body>\n</html>');
  return s.join('\n');
}

function pageTitle(icon, title, sub, btn) {
  return '<div class="dash-page-title"><div><h1>' + title + '</h1><p>' + sub + '</p></div>' + (btn || '') + '</div>';
}
function write(name, opts) {
  const html = shell(name, opts);
  writeFileSync(resolve(OUT, name + '.html'), html, 'utf8');
  console.log('wrote dashboard/' + name + '.html (' + html.length + ' bytes)');
}
const SAVE = {};
// ============================ DASHBOARD INDEX ============================
const dashWelcome = '<div class="dash-welcome"><div><h2>Good evening, Alex</h2>' +
  '<p>The maison is serene \u2014 four floors humming, the atrium at golden hour.</p></div>' +
  '<span class="time-chip"><i class="fa-solid fa-circle" style="font-size:.4rem;color:#2e8b57;margin-right:6px"></i> Live</span></div>';

const kpis = '<div class="dash-kpis">' +
  '<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">Total Stores</span><span class="kpi-ic"><i class="fa-solid fa-store"></i></span></div><div class="kpi-value" id="kStores">\u2013</div><div class="kpi-sub"><span class="trend-up"><i class="fa-solid fa-arrow-trend-up"></i> +2</span> this season</div><i class="fa-solid fa-store kpi-bg-ink"></i></div>' +
  '<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">Visitors Today</span><span class="kpi-ic blue"><i class="fa-solid fa-users"></i></span></div><div class="kpi-value" id="kVisitors">\u2013</div><div class="kpi-sub"><span class="trend-up"><i class="fa-solid fa-arrow-trend-up"></i> +12.4%</span> vs last week</div><i class="fa-solid fa-users kpi-bg-ink"></i></div>' +
  '<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">Active Promotions</span><span class="kpi-ic red"><i class="fa-solid fa-tag"></i></span></div><div class="kpi-value" id="kPromos">\u2013</div><div class="kpi-sub"><span class="trend-up"><i class="fa-solid fa-arrow-trend-up"></i> 2 new</span> this week</div><i class="fa-solid fa-tag kpi-bg-ink"></i></div>' +
  '<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">Upcoming Events</span><span class="kpi-ic green"><i class="fa-solid fa-calendar"></i></span></div><div class="kpi-value" id="kEvents">\u2013</div><div class="kpi-sub">Autumn show in <span style="color:var(--gold)">14 days</span></div><i class="fa-solid fa-calendar kpi-bg-ink"></i></div>' +
  '</div>';

const chartRow = '<div class="dash-charts-2">' +
  '<div class="panel"><div class="panel-head"><h3>Visitor Traffic</h3><div class="panel-tools"><span style="font-size:.72rem;color:var(--muted)">Monthly</span></div></div>' +
  '<div class="panel-body"><div data-chart="line" data-keys="visitors"></div><div class="chart-legend" style="margin-top:12px"><span class="lg-item">Visitors</span><span class="lg-item muted">Traffic</span></div></div></div>' +
  '<div class="panel"><div class="panel-head"><h3>Departments</h3></div>' +
  '<div class="panel-body"><div data-chart="donut" data-keys="categories"></div><div class="chart-legend" style="margin-top:12px"><span class="lg-item">Fashion</span><span class="lg-item charcoal">Dining</span><span class="lg-item burgundy">Lifestyle</span><span class="lg-item muted">Entertainment</span></div></div></div>' +
  '</div>';

const perfRow = '<div class="dash-grid-2">' +
  '<div class="panel"><div class="panel-head"><h3>Revenue Overview</h3><div class="panel-tools"><span class="badge badge-gold" style="font-size:.6rem">All stores</span></div></div>' +
  '<div class="panel-body"><div data-chart="line" data-keys="revenue"></div></div></div>' +
  '<div class="panel"><div class="panel-head"><h3>Top Performing Stores</h3><div class="panel-tools"><a href="stores.html" style="font-size:.72rem;color:var(--gold)">Manage</a></div></div>' +
  '<div class="panel-body" id="perfRows"></div></div>' +
  '</div>';

const indexContent = dashWelcome + '<div class="kpi-stats-row" style="margin:-10px 0 22px">' +
  '<div class="ks"><span>Restaurants</span><b id="kRests">\u2013</b></div>' +
  '<div class="ks"><span>Revenue MTD</span><b id="kRevenue">\u2013</b></div>' +
  '<div class="ks"><span>Satisfaction</span><b>4.8 / 5</b></div>' +
  '<div class="ks"><span>Occupancy</span><b>96%</b></div></div>' +
  kpis + chartRow + perfRow;
function textField(label, id, ph, required) {
  return '<div class="form-group"><label class="form-label" for="' + id + '">' + label + '</label>' +
    '<input class="form-control" id="' + id + '" type="text" placeholder="' + ph + '"' + (required !== false ? ' required' : '') + '><span class="error-msg">Required field.</span></div>';
}
function numField(label, id, value) {
  return '<div class="form-group"><label class="form-label" for="' + id + '">' + label + '</label>' +
    '<input class="form-control" id="' + id + '" type="number" value="' + value + '"><span class="error-msg">Required field.</span></div>';
}
function selField(label, id, optsArr, val) {
  const opts = (optsArr || []).map(function (o) {
    return '<option value="' + o + '"' + (o === val ? ' selected' : '') + '>' + o + '</option>';
  }).join('');
  return '<div class="form-group"><label class="form-label" for="' + id + '">' + label + '</label>' +
    '<select class="form-select" id="' + id + '" required>' + opts + '</select><span class="error-msg">Required field.</span></div>';
}
function areaField(label, id, rows) {
  return '<div class="col-span-2 form-group"><label class="form-label" for="' + id + '">' + label + '</label>' +
    '<textarea class="form-control" id="' + id + '" rows="' + (rows || 3) + '"></textarea></div>';
}
function dateField(label, id) {
  return '<div class="form-group"><label class="form-label" for="' + id + '">' + label + '</label>' +
    '<input class="form-control" id="' + id + '" type="date" required><span class="error-msg">Required field.</span></div>';
}
function imgField(id) {
  return '<div class="col-span-2 form-group"><label class="form-label" for="' + id + '">Image Key</label>' +
    '<input class="form-control js-img-input" id="' + id + '" placeholder="e.g. retailStorefront, dressA, diningA\u2026">' +
    '<img class="img-preview js-img-preview" alt="Image preview" style="display:none"></div>';
}
function crudShell(titleId, labelId, saveId, bodyHtml, modalId) {
  return '<div class="modal fade dash-modal" id="' + (modalId || 'crudModal') + '" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content">' +
    '<div class="modal-header"><h5 class="modal-title" id="' + titleId + '">Add</h5>' +
    '<button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="modal-body"><form class="form-grid" novalidate>' + bodyHtml + '</form></div>' +
    '<div class="modal-footer"><button class="btn btn-ghost btn-sm" data-bs-dismiss="modal">Cancel</button>' +
    '<button class="btn btn-gold btn-sm" id="' + saveId + '"><span id="' + labelId + '">Save</span></button></div>' +
    '</div></div></div>';
}
const FL = ['G', 'M', '1', '2', '3'];
const ST_GROUPS = ['Fashion', 'Dining', 'Lifestyle', 'Entertainment'];
const STATUS_PUB = ['draft', 'published'];
const STATUS_OFF = ['active', 'draft'];
const STATUS_STORE = ['open', 'coming'];
const CAT_FILTER = ['Womenswear', 'Menswear', 'Evening Wear', 'Outerwear', 'Shoes', 'Handbags', 'Watches', 'Jewelry', 'Accessories', 'Fragrance'];
function optsSel(id, label, arr, title) {
  return '<select id="' + id + '" aria-label="' + label + '"><option value="all">' + title + '</option>' +
    arr.map(function (o) { return '<option value="' + o + '">' + o + '</option>'; }).join('') + '</select>';
}
function dataTable(id, theadCols, cols) {
  const th = theadCols.map(function (c, i) {
    const key = cols[i];
    return '<th data-col="' + (key || '') + '">' + c + '</th>';
  }).join('');
  return '<div class="panel"><div class="table-responsive-lux"><table class="data-table" id="' + id + '"><thead><tr>' + th + '</tr></thead>' +
    '<tbody id="' + id.replace('Table', 'Tbody') + '"></tbody></table></div><div class="pagination-lux" id="' + id.replace('Table', 'Pager') + '"></div></div>';
}

const storesContent = pageTitle('fa-store', 'Store Management',
  'Add, edit and retire boutiques across the maison \u2014 every change reflects on the public directory.',
  '<button class="btn btn-add" id="addStoreBtn"><i class="fa-solid fa-plus"></i> Add Store</button>') +
  '<div class="dash-toolbar">' +
  '<div class="grow"><i class="fa-solid fa-magnifying-glass"></i><input id="storesSearch" placeholder="Search stores, categories, locations\u2026" aria-label="Search stores"></div>' +
  optsSel('filterGroup', 'Filter by group', ST_GROUPS, 'All departments') +
  optsSel('filterFloor', 'Filter by floor', FL, 'All floors') +
  '<span style="margin-left:auto;font-size:.78rem;color:var(--muted)" id="storesCount"><b>0</b> stores</span></div>' +
  dataTable('storesTable', ['Store', 'Category', 'Floor', 'Status', 'Opening Hours', 'Actions'], ['name', 'cat', 'floor', 'status', 'hours', '']) +
  crudShell('crudModalTitle', 'crudSubmitLabel', 'saveStoreBtn',
    textField('Store Name', 'stName', 'Maison \u00C9l\u00E9gance') +
    selField('Department', 'stGroup', ST_GROUPS) +
    textField('Category', 'stCat', 'Womenswear') +
    selField('Floor', 'stFloor', FL, 'G') +
    textField('Opening Hours', 'stHours', '10:00 \u2013 21:00', false) +
    textField('Phone', 'stPhone', '+33 1 42 60 00 01', false) +
    textField('Location', 'stLocation', 'Main Promenade \u00B7 Ground', false) +
    selField('Status', 'stStatus', STATUS_STORE, 'open') +
    imgField('stImg') +
    areaField('Description', 'stDesc', 3));
const BRAND_FILTER = ['Maison \u00C9l\u00E9gance', 'Aurelia', 'Noir Atelier', 'Milano House', '\u00C9lan', 'Prestige', 'Crown Fashion', 'Sole Society', 'Marchetti Calzature', 'Heels & Co.', 'Le Sac Atelier', 'Velvet & Co.', 'Chrono Paris', 'Aurea Gioielli', 'Fragrance House'];

const productsContent = pageTitle('fa-shirt', 'Product Management',
  'Catalogue every piece across the maison \u2014 pricing, stock and status live here.',
  '<button class="btn btn-add" id="addProductBtn"><i class="fa-solid fa-plus"></i> Add Product</button>') +
  '<div class="dash-toolbar">' +
  '<div class="grow"><i class="fa-solid fa-magnifying-glass"></i><input id="productsSearch" placeholder="Search products, brands\u2026" aria-label="Search products"></div>' +
  optsSel('filterCat', 'Filter by category', CAT_FILTER, 'All categories') +
  optsSel('filterBrand', 'Filter by brand', BRAND_FILTER, 'All brands') +
  optsSel('filterStatus', 'Filter by status', ['in-stock', 'limited', 'unavailable'], 'All statuses') +
  '<span style="margin-left:auto;font-size:.78rem;color:var(--muted)" id="productsCount"><b>0</b> products</span></div>' +
  dataTable('productsTable', ['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'], ['name', 'cat', 'price', 'stock', 'status', '']) +
  crudShell('prModalTitle', 'prSubmitLabel', 'saveProductBtn',
    textField('Product Name', 'prName', 'Noir Gown \u2014 Haute Couture') +
    textField('Brand', 'prBrand', 'Maison \u00C9l\u00E9gance') +
    selField('Category', 'prCat', CAT_FILTER, 'Womenswear') +
    numField('Price \u20AC', 'prPrice', '1250') +
    numField('Old Price \u20AC', 'prOld', '0') +
    numField('Stock', 'prStock', '10') +
    selField('Status', 'prStatus', ['in-stock', 'limited', 'unavailable'], 'in-stock') +
    imgField('prImg') +
    areaField('Description', 'prDesc', 3), 'productModal');

const CAT_EV = ['Fashion', 'Live Music', 'Social', 'Product Launch', 'Seasonal', 'Art', 'Wellness'];

const eventsContent = pageTitle('fa-calendar', 'Events Management',
  'Schedule the maison\u2019s calendar \u2014 publish, unpublish and refine every moment.',
  '<button class="btn btn-add" id="addEventBtn"><i class="fa-solid fa-plus"></i> Add Event</button>') +
  '<div class="dash-toolbar">' +
  '<div class="grow"><i class="fa-solid fa-magnifying-glass"></i><input id="eventsSearch" placeholder="Search events\u2026" aria-label="Search events"></div>' +
  optsSel('filterEvCat', 'Filter by type', CAT_EV, 'All types') +
  optsSel('filterEvStatus', 'Filter by status', ['published', 'draft'], 'All statuses') +
  '<span style="margin-left:auto;font-size:.78rem;color:var(--muted)" id="eventsCount"><b>0</b> events</span></div>' +
  dataTable('eventsTable', ['Event', 'Date', 'Location', 'Capacity', 'Status', 'Actions'], ['title', 'date', 'location', 'capacity', 'status', '']) +
  crudShell('crudModalTitle', 'crudSubmitLabel', 'saveEventBtn',
    textField('Event Name', 'evName', 'Autumn Fashion Show') +
    selField('Type', 'evCat', CAT_EV, 'Fashion') +
    dateField('Date', 'evDate') +
    textField('Time', 'evTime', '19:00', false) +
    textField('Location', 'evLocation', 'Grand Atrium', false) +
    numField('Capacity', 'evCapacity', '200') +
    selField('Status', 'evStatus', STATUS_PUB, 'draft') +
    imgField('evImg') +
    areaField('Description', 'evDesc', 3));

const BADGES = ['EXCLUSIVE', 'VIP', 'LIMITED', 'NEW', 'WEEKEND'];

const offersContent = pageTitle('fa-tag', 'Offers Management',
  'Create, schedule and retire promotions \u2014 expiry dates keep every privilege honest.',
  '<button class="btn btn-add" id="addOfferBtn"><i class="fa-solid fa-plus"></i> Create Offer</button>') +
  '<div class="dash-toolbar">' +
  '<div class="grow"><i class="fa-solid fa-magnifying-glass"></i><input id="offersSearch" placeholder="Search offers, stores\u2026" aria-label="Search offers"></div>' +
  optsSel('filterOfBadge', 'Filter by badge', BADGES, 'All badges') +
  optsSel('filterOfStatus', 'Filter by status', ['active', 'draft'], 'All statuses') +
  '<span style="margin-left:auto;font-size:.78rem;color:var(--muted)" id="offersCount"><b>0</b> offers</span></div>' +
  dataTable('offersTable', ['Offer', 'Store', 'Discount', 'Start', 'Ends', 'Status', 'Actions'], ['title', 'store', 'discount', 'start', 'end', 'status', '']) +
  crudShell('crudModalTitle', 'crudSubmitLabel', 'saveOfferBtn',
    textField('Offer Title', 'ofTitle', 'Le Sac Atelier \u2014 Launch Week') +
    textField('Store', 'ofStore', 'Le Sac Atelier') +
    numField('Discount %', 'ofDiscount', '20') +
    dateField('Start Date', 'ofStart') +
    dateField('End Date', 'ofEnd') +
    selField('Badge', 'ofBadge', BADGES, 'NEW') +
    selField('Status', 'ofStatus', STATUS_OFF, 'active') +
    imgField('ofImg') +
    areaField('Description', 'ofDesc', 3));
function miniTable(theadCols, id) {
  return '<div class="panel"><div class="table-responsive-lux"><table class="data-table"><thead><tr>' +
    theadCols.map(function (c) { return '<th>' + c + '</th>'; }).join('') +
    '</tr></thead><tbody id="' + id + '"></tbody></table></div></div>';
}
const miniSearch = `<div class="dash-toolbar"><div class="grow"><i class="fa-solid fa-magnifying-glass"></i><input id="miniSearch" placeholder="Search\u2026" aria-label="Search"></div><span style="margin-left:auto;font-size:.78rem;color:var(--muted)" id="miniCount"><b>0</b> records</span></div>`;

const brandsContent = pageTitle('fa-star', 'Brand Management',
  'The maison\u2019s house partners \u2014 eight celebrated names, each with its own atelier.') +
  miniSearch + miniTable(['Brand', 'Category', 'Floor', 'Status', 'Actions'], 'brandsBody');

const categoriesContent = pageTitle('fa-tags', 'Category Index',
  'Every department and category across the maison, with live boutique counts.') +
  miniSearch + miniTable(['Category', 'Department', 'Boutiques', 'Status', 'Actions'], 'catBody');

const restaurantsContent = pageTitle('fa-utensils', 'Restaurant Management',
  'Twelve tables across six floors \u2014 cuisine, price point and service hours at a glance.') +
  miniSearch + miniTable(['Restaurant', 'Cuisine', 'Level', 'Price', 'Hours', 'Status', 'Actions'], 'restBody');

const customersContent = pageTitle('fa-users', 'Customers & Visitors',
  'Your most loyal guests \u2014 tier, visits and lifetime spend across the maison.') +
  miniSearch + miniTable(['Guest', 'Tier', 'Visits', 'Lifetime Spend', 'Last Visit', 'Status', 'Actions'], 'custBody');

const bookingsContent = pageTitle('fa-calendar-check', 'Bookings',
  'Restaurant reservations, event seats and venue bookings \u2014 confirmed in real time.') +
  miniSearch + miniTable(['Booking', 'Guest', 'Venue', 'Date', 'Guests', 'Status', 'Actions'], 'bookBody');

const messagesContent = pageTitle('fa-envelope', 'Messages',
  'Every note the maison receives \u2014 reply once, reply well.') +
  miniSearch + miniTable(['Guest', 'Subject', 'Received', 'Status', 'Actions'], 'msgBody');
const FLT = `
  function bindMini(rows) {
    var q = document.getElementById('miniSearch');
    var count = document.getElementById('miniCount');
    if (count) count.innerHTML = '<b>' + rows.length + '</b> records';
    if (!q) return;
    q.addEventListener('input', function () {
      var v = q.value.toLowerCase(); var n = 0;
      rows.forEach(function (r) {
        var show = r.textContent.toLowerCase().indexOf(v) > -1;
        r.style.display = show ? '' : 'none'; if (show) n++;
      });
      if (count) count.innerHTML = '<b>' + n + '</b> record' + (n === 1 ? '' : 's');
    });
  }
  function mkToast() {
    document.querySelectorAll('[data-toast]').forEach(function (b) {
      b.addEventListener('click', function () { window.MR.toast('Done', b.getAttribute('data-toast'), 'success'); });
    });
  }
  function badge(status) {
    var m = { active: ['ts-active', 'Active'], open: ['ts-active', 'Open'], confirmed: ['ts-active', 'Confirmed'], pending: ['ts-draft', 'Pending'], cancelled: ['ts-closed', 'Cancelled'], new: ['ts-active', 'New'], replied: ['ts-closed', 'Replied'] };
    return '<span class="table-status ' + (m[status] || m.active)[0] + '">' + (m[status] || m.active)[1] + '</span>';
  }
  function av(name) {
    return '<span style="width:40px;height:40px;border-radius:10px;display:inline-grid;place-items:center;background:linear-gradient(135deg,rgba(200,162,74,.18),rgba(200,162,74,.05));border:1px solid var(--line);color:var(--gold);font-weight:800;font-size:.8rem">' + (name.match(/\b\w/g) || ['R']).slice(0, 2).join('').toUpperCase() + '</span>';
  }
`;

const brandsInline = `(function () {
  'use strict';
  var D = window.MallData; if (!D) return;
  var b = document.getElementById('brandsBody');
  b.innerHTML = D.BRANDS.map(function (x) {
    return '<tr><td><div class="dt-product">' + av(x.name) + '<div><b>' + D.esc(x.name) + '</b><span>' + D.esc(x.blurb) + '</span></div></div></td>' +
      '<td>' + D.esc(x.cat) + '</td><td>Lv ' + D.esc(x.floor) + '</td>' +
      '<td>' + badge('active') + '</td>' +
      '<td><div class="action-group"><button class="act-btn" title="Edit" data-toast="' + D.esc(x.name) + ' updated successfully."><i class="fa-solid fa-pen"></i></button></div></td></tr>';
  }).join('');
  bindMini(b.querySelectorAll('tr')); mkToast();
})();`;

const categoriesInline = `(function () {
  'use strict';
  var D = window.MallData; if (!D) return;
  var host = document.getElementById('catBody');
  var rows = [];
  Object.keys(D.CATEGORIES).forEach(function (dept) {
    D.CATEGORIES[dept].forEach(function (cat) {
      var n = D.stores().filter(function (s) { return s.group === cap(dept) || s.cat === cat; }).length;
      rows.push([cat, cap(dept), n]);
    });
  });
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  host.innerHTML = rows.map(function (r) {
    return '<tr><td><span class="dt-cell-label"><b style="color:var(--text)">' + D.esc(r[0]) + '</b></span></td>' +
      '<td>' + D.esc(r[1]) + '</td><td>' + r[2] + '</td>' +
      '<td>' + badge('active') + '</td>' +
      '<td><div class="action-group"><button class="act-btn" title="View stores" data-toast="Showing ' + D.esc(r[0]) + ' stores in the directory."><i class="fa-solid fa-eye"></i></button></div></td></tr>';
  }).join('');
  bindMini(host.querySelectorAll('tr')); mkToast();
})();`;

const restaurantsInline = `(function () {
  'use strict';
  var D = window.MallData; if (!D) return;
  var host = document.getElementById('restBody');
  function euro(v) { return '\u20AC'.repeat(Math.max(1, Math.min(4, v))); }
  host.innerHTML = D.restaurants().map(function (r) {
    return '<tr><td><div class="dt-product">' + av(r.name) + '<div><b>' + D.esc(r.name) + '</b><span>' + D.esc(r.cuisine) + '</span></div></div></td>' +
      '<td>' + D.esc(r.cuisine) + '</td><td>Lv ' + D.esc(r.floor) + '</td><td>' + euro(r.price) + '</td>' +
      '<td>' + D.esc(r.hours) + '</td><td>' + badge('open') + '</td>' +
      '<td><div class="action-group"><button class="act-btn" title="Edit hours" data-toast="' + D.esc(r.name) + ' hours updated."><i class="fa-solid fa-pen"></i></button></div></td></tr>';
  }).join('');
  bindMini(host.querySelectorAll('tr')); mkToast();
})();`;
const customersInline = `(function () {
  'use strict';
  var host = document.getElementById('custBody');
  var guests = [
    ['Charlotte Meyer', 'Royale', 38, '\u20AC184,200', '12 Sep', 'new'],
    ['Henri Soufflot', 'VIP', 21, '\u20AC97,400', '15 Sep', 'active'],
    ['Amara Diallo', 'Gold', 14, '\u20AC43,900', '14 Sep', 'active'],
    ['Lucas Berthier', 'Gold', 9, '\u20AC28,150', '11 Sep', 'active'],
    ['Elena Petrova', 'VIP', 26, '\u20AC88,300', '16 Sep', 'active'],
    ['Oscar Lindqvist', 'Royale', 52, '\u20AC241,700', '16 Sep', 'new'],
    ['Mia Fontaine', 'Silver', 6, '\u20AC12,400', '08 Sep', 'active'],
    ['Noah Weber', 'Silver', 11, '\u20AC19,900', '10 Sep', 'active'],
    ['Isabelle Moreau', 'Gold', 17, '\u20AC55,000', '13 Sep', 'active'],
    ['Rajan Iyer', 'VIP', 22, '\u20AC74,600', '09 Sep', 'active']
  ];
  function tier(t) { return '<span class="table-status ' + (t === 'Royale' ? 'ts-limited' : t === 'VIP' ? 'ts-coming' : 'ts-active') + '">' + t + '</span>'; }
  host.innerHTML = guests.map(function (g) {
    return '<tr><td><div class="dt-product">' + av(g[0]) + '<div><b>' + g[0] + '</b><span>Member since 2021</span></div></div></td>' +
      '<td>' + tier(g[1]) + '</td><td>' + g[2] + '</td><td>' + g[3] + '</td><td>' + g[4] + '</td>' +
      '<td>' + badge(g[5]) + '</td>' +
      '<td><div class="action-group"><button class="act-btn" title="Message" data-toast="Composed a note to ' + g[0] + '."><i class="fa-solid fa-envelope"></i></button></div></td></tr>';
  }).join('');
  bindMini(host.querySelectorAll('tr')); mkToast();
})();`;

const bookingsInline = `(function () {
  'use strict';
  var host = document.getElementById('bookBody');
  var data = [
    ['BK-2041', 'Charlotte Meyer', 'Le Grand Rouge', '19 Sep \u00B7 20:00', 2, 'confirmed'],
    ['BK-2042', 'Henri Soufflot', 'Autumn Fashion Show', '20 Sep \u00B7 19:00', 4, 'pending'],
    ['BK-2043', 'Elena Petrova', 'Nocturne \u2014 Night Shopping', '16 Oct \u00B7 19:00', 6, 'confirmed'],
    ['BK-2044', 'Oscar Lindqvist', 'Champagne Evening', '02 Oct \u00B7 18:30', 2, 'pending'],
    ['BK-2045', 'Amara Diallo', 'Sakura House', '18 Sep \u00B7 12:30', 3, 'confirmed'],
    ['BK-2046', 'Isabelle Moreau', 'Vinoteca 21', '21 Sep \u00B7 20:00', 2, 'cancelled']
  ];
  function row(b, i) {
    return '<tr data-bk="' + i + '"><td><b style="font-family:var(--font-display)">' + b[0] + '</b></td>' +
      '<td>' + b[1] + '</td><td>' + b[2] + '</td><td>' + b[3] + '</td><td>' + b[4] + ' guests</td>' +
      '<td data-bk-status>' + badge(b[5]) + '</td>' +
      '<td><div class="action-group"><button class="act-btn" title="Confirm" data-bk-confirm="' + i + '"><i class="fa-solid fa-check"></i></button>' +
      '<button class="act-btn danger" title="Cancel" data-bk-cancel="' + i + '"><i class="fa-solid fa-xmark"></i></button></div></td></tr>';
  }
  function reBadge(tr, s) { tr.querySelector('[data-bk-status]').innerHTML = badge(s); }
  host.innerHTML = data.map(row).join('');
  host.querySelectorAll('[data-bk-confirm]').forEach(function (b) {
    b.addEventListener('click', function () {
      var tr = b.closest('tr');
      reBadge(tr, 'confirmed');
      window.MR.toast('Booking confirmed', tr.querySelector('b').textContent + ' is confirmed.', 'success');
    });
  });
  host.querySelectorAll('[data-bk-cancel]').forEach(function (b) {
    b.addEventListener('click', function () {
      var tr = b.closest('tr');
      reBadge(tr, 'cancelled');
      window.MR.toast('Booking cancelled', tr.querySelector('b').textContent + ' has been cancelled.', 'success');
    });
  });
  bindMini(host.querySelectorAll('tr')); mkToast();
})();`;

const messagesInline = `(function () {
  'use strict';
  var host = document.getElementById('msgBody');
  var data = [
    ['Charlotte Meyer', 'Private preview request \u2014 Saturday?', 'Today \u00B7 09:14', 'new'],
    ['Henri Soufflot', 'Lost &amp; found: leather tote, Level 1', 'Today \u00B7 07:42', 'new'],
    ['Elena Petrova', 'Membership enquiry \u2014 Royale Circle', 'Yesterday \u00B7 18:03', 'replied'],
    ['Lucas Berthier', 'Compliment for Caf\u00E9 \u00C9toile', 'Yesterday \u00B7 12:21', 'replied'],
    ['Amara Diallo', 'Reschedule booking BK-2041', '2 days ago', 'new'],
    ['Noah Weber', 'Gift card balance request', '3 days ago', 'replied']
  ];
  host.innerHTML = data.map(function (m, i) {
    return '<tr data-msg="' + i + '"><td><div class="dt-product">' + av(m[0]) + '<div><b>' + m[0] + '</b></div></div></td>' +
      '<td class="dt-cell-label"><b>' + m[1] + '</b></td><td>' + m[2] + '</td><td>' + badge(m[3]) + '</td>' +
      '<td><div class="action-group"><button class="act-btn" title="Reply" data-msg-reply="' + i + '"><i class="fa-solid fa-reply"></i></button>' +
      '<button class="act-btn danger" title="Archive" data-msg-arch="' + i + '"><i class="fa-solid fa-box-archive"></i></button></div></td></tr>';
  }).join('');
  host.querySelectorAll('[data-msg-reply]').forEach(function (b) {
    b.addEventListener('click', function () {
      var tr = b.closest('tr');
      tr.querySelector('[data-bk-status], td:nth-child(4)').innerHTML = badge('replied');
      window.MR.toast('Reply drafted', 'A response to ' + tr.querySelector('b').textContent + ' is ready to send.', 'success');
    });
  });
  host.querySelectorAll('[data-msg-arch]').forEach(function (b) {
    b.addEventListener('click', function () { var tr = b.closest('tr'); tr.remove(); window.MR.toast('Message archived', 'Moved to the archive.', 'success'); });
  });
  bindMini(host.querySelectorAll('tr')); mkToast();
})();`;
const analyticsContent = pageTitle('fa-chart-line', 'Analytics',
  'Six floors of data \u2014 visitors, revenue, attendance and engagement at a glance.') +
  '<div class="dash-kpis">' +
  '<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">Visitors This Month</span><span class="kpi-ic"><i class="fa-solid fa-users"></i></span></div><div class="kpi-value" id="aVisitors">\u2013</div><div class="kpi-sub"><span class="trend-up"><i class="fa-solid fa-arrow-trend-up"></i> +14.8%</span> YoY</div></div>' +
  '<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">Revenue MTD</span><span class="kpi-ic green"><i class="fa-solid fa-sack-dollar"></i></span></div><div class="kpi-value" id="aRevenue">\u2013</div><div class="kpi-sub">Avg ticket <b>\u20AC432</b></div></div>' +
  '<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">Avg. Dwell Time</span><span class="kpi-ic blue"><i class="fa-solid fa-hourglass-half"></i></span></div><div class="kpi-value">2h 41m</div><div class="kpi-sub"><span class="trend-up"><i class="fa-solid fa-arrow-trend-up"></i> +18m</span> vs last season</div></div>' +
  '<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">Offer Redemption</span><span class="kpi-ic red"><i class="fa-solid fa-ticket"></i></span></div><div class="kpi-value">6.2%</div><div class="kpi-sub">Above industry <b>\u00D72</b></div></div>' +
  '</div>' +
  '<div class="dash-charts-2">' +
  '<div class="panel"><div class="panel-head"><h3>Visitors per Month</h3><div class="panel-tools"><span class="badge badge-gold" style="font-size:.6rem">2026</span></div></div>' +
  '<div class="panel-body"><div data-chart="line" data-keys="visitors"></div></div></div>' +
  '<div class="panel"><div class="panel-head"><h3>Website Traffic</h3></div>' +
  '<div class="panel-body"><div data-chart="donut" data-keys="channels"></div><div class="chart-legend" style="margin-top:12px"><span class="lg-item">Organic</span><span class="lg-item charcoal">Social</span><span class="lg-item burgundy">Direct</span><span class="lg-item muted">Referral · Paid</span></div></div></div>' +
  '</div>' +
  '<div class="dash-grid-3">' +
  '<div class="panel"><div class="panel-head"><h3>Store Performance</h3></div><div class="panel-body"><div data-chart="bars" data-keys="storePerf"></div></div></div>' +
  '<div class="panel"><div class="panel-head"><h3>Event Attendance</h3></div><div class="panel-body"><div data-chart="bars" data-keys="attendance"></div></div></div>' +
  '<div class="panel"><div class="panel-head"><h3>Popular Departments</h3></div><div class="panel-body"><div data-chart="bars" data-keys="categories"></div></div></div>' +
  '</div>' +
  '<div class="dash-grid-2">' +
  '<div class="panel"><div class="panel-head"><h3>Traffic Sources</h3></div><div class="panel-body" id="channelRows"></div></div>' +
  '<div class="panel"><div class="panel-head"><h3>Offer Engagement</h3></div><div class="panel-body"><div data-chart="line" data-keys="engagement"></div><div class="chart-legend" style="margin-top:10px"><span class="lg-item">Engagement index</span></div></div></div>' +
  '</div>';

const settingsContent = pageTitle('fa-gear', 'Settings',
  'House identity, opening hours and notification preferences for the command centre.') +
  '<div class="panel"><div class="panel-body settings-form">' +
  '<div class="form-section"><h5>House Identity</h5><div class="row g-4">' +
  '<div class="col-md-6"><div class="form-group"><label class="form-label" for="setName">Mall Name</label><input class="form-control" id="setName" type="text"></div></div>' +
  '<div class="col-md-6"><div class="form-group"><label class="form-label" for="setPhone">Concierge Phone</label><input class="form-control" id="setPhone" type="text"></div></div>' +
  '<div class="col-md-6"><div class="form-group"><label class="form-label" for="setEmail">Concierge Email</label><input class="form-control" id="setEmail" type="email"></div></div>' +
  '<div class="col-md-6"><div class="form-group"><label class="form-label" for="setAddress">Address</label><input class="form-control" id="setAddress" type="text"></div></div>' +
  '<div class="col-12"><div class="form-group"><label class="form-label" for="setHours">Opening Hours</label><input class="form-control" id="setHours" type="text"></div></div>' +
  '</div></div>' +
  '<div class="form-section"><h5>Notifications</h5>' +
  '<div class="toggle-row"><div><b>Announcements</b><span>Season campaigns and maison-wide news</span></div><button class="toggle-lux" data-toggle="announcements" aria-pressed="true" aria-label="Announcements"></button></div>' +
  '<div class="toggle-row"><div><b>Newsletter alerts</b><span>Notify when the Royale Letter is sent</span></div><button class="toggle-lux" data-toggle="newsletter" aria-pressed="true" aria-label="Newsletter alerts"></button></div>' +
  '<div class="toggle-row"><div><b>Concierge requests</b><span>Real-time alerts for guest enquiries</span></div><button class="toggle-lux" data-toggle="concierge" aria-pressed="true" aria-label="Concierge requests"></button></div>' +
  '<div class="toggle-row"><div><b>Critical notices</b><span>Security and operational alerts</span></div><button class="toggle-lux" data-toggle="notices" aria-pressed="true" aria-label="Critical notices"></button></div>' +
  '</div>' +
  '<div style="margin-top:22px"><button class="btn btn-gold" id="saveSettingsBtn"><i class="fa-solid fa-floppy-disk"></i> Save Settings</button></div>' +
  '</div></div>';
const indexInline = `(function () {
  'use strict';
  var D = window.MallData; var A = D ? D.ANALYTICS || {} : {}; if (!D) return;
  function set(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
  set('kStores', D.stores().length);
  set('kVisitors', (A.visitorsToday || 0).toLocaleString('en-US'));
  set('kPromos', D.offers().filter(function (o) { return o.status === 'active'; }).length);
  set('kEvents', D.events().filter(function (ev) { return ev.status === 'published'; }).length);
  set('kRests', D.restaurants().length);
  set('kRevenue', '\u20AC' + (A.revenueMtd || 0) + 'k');
  var pr = document.getElementById('perfRows');
  if (pr && A.storePerf) {
    pr.innerHTML = A.storePerf.map(function (s) {
      return '<div class="mini-row"><span class="mr-av" style="background:linear-gradient(135deg,rgba(200,162,74,.3),rgba(200,162,74,.12))">' + D.esc(s.name.charAt(0)) + '</span>' +
        '<div><b>' + D.esc(s.name) + '</b><span>' + s.rev + ' \u00B7 ' + s.footfall.toLocaleString('en-US') + ' footfall</span></div>' +
        '<div class="mr-tail"><span class="mr-val">+' + s.growth + '%</span><span>growth</span></div></div>';
    }).join('');
  }
})();`;

const settingsInline = `(function () {
  'use strict';
  var D = window.MallData; if (!D) return;
  var s = D.settings();
  function fill(id, v) { var el = document.getElementById(id); if (el) el.value = v || ''; }
  fill('setName', s.name); fill('setAddress', s.address); fill('setEmail', s.email); fill('setPhone', s.phone); fill('setHours', s.hours);
  document.querySelectorAll('[data-toggle]').forEach(function (btn) {
    var key = btn.getAttribute('data-toggle');
    btn.classList.toggle('on', !!s[key]);
    btn.addEventListener('click', function () {
      btn.classList.toggle('on');
      btn.setAttribute('aria-pressed', btn.classList.contains('on') ? 'true' : 'false');
    });
  });
  var sv = document.getElementById('saveSettingsBtn');
  if (sv) sv.addEventListener('click', function () {
    function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
    s.name = val('setName'); s.address = val('setAddress'); s.email = val('setEmail'); s.phone = val('setPhone'); s.hours = val('setHours');
    document.querySelectorAll('[data-toggle]').forEach(function (btn) { s[btn.getAttribute('data-toggle')] = btn.classList.contains('on'); });
    D.saveSettings(s);
    window.MR.toast('Settings saved', 'The maison remembers every detail.', 'success');
  });
})();`;

const analyticsInline = `(function () {
  'use strict';
  var D = window.MallData; var A = D ? D.ANALYTICS || {} : {}; if (!D) return;
  function set(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
  if (A.visitors) set('aVisitors', A.visitors[A.visitors.length - 1].toLocaleString('en-US'));
  if (A.revenue) set('aRevenue', '\u20AC' + A.revenue[A.revenue.length - 1] + 'k');
  var ch = document.getElementById('channelRows');
  if (ch && A.channels) {
    var max = Math.max.apply(null, Object.keys(A.channels).map(function (k) { return A.channels[k]; }));
    ch.innerHTML = Object.keys(A.channels).map(function (k) {
      var v = A.channels[k];
      return '<div class="channel-row"><span class="ch-name">' + D.esc(k) + '</span><div class="ch-bar"><span style="width:' + (v / max * 100) + '%"></span></div><span class="ch-val">' + v + '%</span></div>';
    }).join('');
  }
})();`;

// ================================ WRITER ================================
write('index', { title: 'Dashboard', content: indexContent, useCharts: true, inline: indexInline });
write('stores', { title: 'Stores', content: storesContent });
write('products', { title: 'Products', content: productsContent });
write('events', { title: 'Events', content: eventsContent });
write('offers', { title: 'Offers', content: offersContent });
write('brands', { title: 'Brands', content: brandsContent, inline: FLT + brandsInline });
write('categories', { title: 'Categories', content: categoriesContent, inline: FLT + categoriesInline });
write('restaurants', { title: 'Restaurants', content: restaurantsContent, inline: FLT + restaurantsInline });
write('customers', { title: 'Customers', content: customersContent, inline: FLT + customersInline });
write('bookings', { title: 'Bookings', content: bookingsContent, inline: FLT + bookingsInline });
write('messages', { title: 'Messages', content: messagesContent, inline: FLT + messagesInline });
write('analytics', { title: 'Analytics', content: analyticsContent, useCharts: true, inline: analyticsInline });
write('settings', { title: 'Settings', content: settingsContent, inline: settingsInline });
console.log('DONE');
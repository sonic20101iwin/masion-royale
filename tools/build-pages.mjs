// ============================================================================
// MAISON ROYALE — public page generator
// Builds pages/fashion.html, dining.html, entertainment.html, events.html,
// offers.html, about.html, contact.html from a shared chrome shell.
// ============================================================================
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'pages');
mkdirSync(OUT, { recursive: true });

const NAV_ITEMS = [
  { key: 'home', label: 'Home', href: 'index.html' },
  { key: 'stores', label: 'Stores', href: 'pages/stores.html' },
  { key: 'fashion', label: 'Fashion', href: 'pages/fashion.html' },
  { key: 'dining', label: 'Dining', href: 'pages/dining.html' },
  { key: 'entertainment', label: 'Entertainment', href: 'pages/entertainment.html' },
  { key: 'events', label: 'Events', href: 'pages/events.html' },
  { key: 'offers', label: 'Offers', href: 'pages/offers.html' },
  { key: 'about', label: 'About', href: 'pages/about.html' },
  { key: 'contact', label: 'Contact', href: 'pages/contact.html' }
];

function nav(active, root) {
  return NAV_ITEMS.map(function (n) {
    let href = n.href;
    if (root) {
      if (n.key === 'home') href = '../index.html';
      else href = href.replace(/^pages\//, '');
    }
    const cls = n.key === active ? ' class="active"' : '';
    return '<li><a href="' + href + '"' + cls + '>' + n.label + '</a></li>';
  }).join('');
}

function ph(pages, title) {
  return 'pages/' + title + '.html';
}
function chrome(o) {
  const root = o.root || '';
  const active = o.active;
  const BASE = root || '';
  const P = root ? '' : 'pages/';
  const s = [];
  s.push('<!doctype html>\n<html lang="en">\n<head>');
  s.push('<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">');
  s.push('<title>' + o.title + '</title>');
  s.push('<meta name="description" content="' + o.desc + '">');
  s.push('<link rel="preconnect" href="https://fonts.googleapis.com">');
  s.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
  s.push('<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">');
  s.push('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">');
  s.push('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">');
  s.push('<link rel="stylesheet" href="' + BASE + 'css/style.css">');
  s.push('<link rel="stylesheet" href="' + BASE + 'css/responsive.css">');
  s.push('</head>');
  s.push('<body data-page="' + active + '" data-root="' + root + '">');
  s.push('<div class="topbar"><div class="container-lux"><div class="tb-left">');
  s.push('<span class="topbar-phone"><i class="fa-solid fa-phone"></i> +33 1 42 60 00 00</span>');
  s.push('<span class="tb-sep"></span><span class="topbar-hours"><i class="fa-solid fa-clock"></i> Mon\u2013Sat 10:00 \u2013 22:00 \u00B7 Sun 11:00 \u2013 20:00</span></div>');
  s.push('<div class="tb-right"><a href="' + P + 'about.html"><i class="fa-solid fa-crown"></i> The Royale Circle</a>');
  s.push('<span class="tb-sep"></span><a href="' + BASE + 'dashboard/index.html"><i class="fa-solid fa-sliders"></i> Management Portal</a>');
  s.push('</div></div></div>');
  s.push('<header class="navbar-lux"><div class="container-lux"><div class="nav-inner">');
  s.push('<a class="nav-logo" href="' + BASE + 'index.html" aria-label="Maison Royale \u2014 Home"><span class="monogram"><span>R</span></span><span class="word"><b>MAISON ROYALE</b><small>PARIS</small></span></a>');
  s.push('<nav aria-label="Primary"><ul class="nav-menu">' + nav(active, root) + '</ul></nav>');
  s.push('<div class="nav-actions">');
  s.push('<button class="icon-btn" data-search-open aria-label="Search the mall"><i class="fa-solid fa-magnifying-glass"></i></button>');
  s.push('<a class="icon-btn has-dot" href="' + P + 'offers.html" aria-label="Exclusive offers"><i class="fa-solid fa-bag-shopping"></i><span class="dot"></span></a>');
  s.push('<a class="btn btn-gold btn-sm admin-pill" href="' + BASE + 'dashboard/index.html"><i class="fa-solid fa-sliders"></i> Manager</a>');
  s.push('<button class="icon-btn nav-toggle" data-drawer-open aria-label="Open menu" aria-controls="mobileDrawer"><i class="fa-solid fa-bars"></i></button>');
  s.push('</div></div></div></header>');
  s.push('<div class="mobile-drawer" id="mobileDrawer" role="dialog" aria-modal="true" aria-label="Menu">');
  s.push('<div class="drawer-backdrop" data-drawer-close></div><div class="drawer-panel">');
  s.push('<div class="drawer-head"><a class="nav-logo" href="' + BASE + 'index.html"><span class="monogram"><span>R</span></span><span class="word"><b>MAISON ROYALE</b></span></a>');
  s.push('<button class="icon-btn" data-drawer-close aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button></div>');
  s.push('<ul class="drawer-links">' + nav(active, root) + '</ul>');
  s.push('<div class="drawer-cta"><a href="' + P + 'offers.html" class="btn btn-gold w-100 mb-2"><i class="fa-solid fa-tag"></i> Exclusive Offers</a>');
  s.push('<a href="' + BASE + 'dashboard/index.html" class="btn btn-ghost w-100"><i class="fa-solid fa-sliders"></i> Management Portal</a></div>');
  s.push('</div></div>');
  s.push('<div class="search-overlay" id="searchOverlay" aria-hidden="true">');
  s.push('<div class="so-backdrop" data-search-close></div>');
  s.push('<div class="so-panel" role="dialog" aria-modal="true" aria-label="Search the mall">');
  s.push('<div class="so-bar"><i class="fa-solid fa-magnifying-glass"></i>');
  s.push('<input class="so-input" type="text" placeholder="Search stores, dining, events, offers\u2026" aria-label="Search" autocomplete="off">');
  s.push('<button class="so-close" data-search-close aria-label="Close search"><i class="fa-solid fa-xmark"></i></button></div>');
  s.push('<div class="so-body"></div>');
  s.push('<div class="so-hint"><span><kbd>\u21B5</kbd> open result</span><span><kbd>ESC</kbd> close search</span></div>');
  s.push('</div></div>');
  return s;
}
function finish(s, o, BASE) {
  s.push('<main id="main">');
  s.push(o.hero || '');
  s.push(o.body || '');
  s.push('</main>');
  s.push(o.footerHtml || '');
  s.push(o.modals || '');
  s.push('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>');
  s.push('<script src="' + BASE + 'js/img-map.js"></script>');
  s.push('<script src="' + BASE + 'js/data.js"></script>');
  s.push('<script src="' + BASE + 'js/main.js"></script>');
  (o.pageScripts || []).forEach(function (p) { s.push('<script src="' + BASE + 'js/' + p + '"></script>'); });
  if (o.inline) s.push('<script>' + o.inline + '</script>');
  s.push('</body>\n</html>');
  return s.join('\n');
}

function pageHero(crumbCurrent, h1, p, bg) {
  return '<section class="page-hero">' +
    (bg ? '<div class="ph-bg"><img src="' + bg + '" alt="" aria-hidden="true"></div>' : '') +
    '<div class="ph-shade"></div><div class="container-lux"><div class="ph-inner">' +
    '<div class="ph-crumb"><a href="../index.html">Home</a> <i class="fa-solid fa-chevron-right"></i> <span>' + crumbCurrent + '</span></div>' +
    '<h1>' + h1 + '</h1><p>' + p + '</p></div></div></section>';
}

function footerHtml(root) {
  const P = root ? '' : 'pages/';
  const B = root || '';
  return '<footer class="site-footer"><div class="container-lux"><div class="footer-grid">' +
    '<div class="footer-brand">' +
    '<a class="nav-logo" href="' + B + 'index.html"><span class="monogram"><span>R</span></span><span class="word"><b>MAISON ROYALE</b><small>PARIS</small></span></a>' +
    '<p>One Royale Avenue, Goldcrest Quarter \u2014 the world\'s ultimate destination for luxury shopping, dining, entertainment and lifestyle.</p>' +
    '<div class="social-row">' +
    '<a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>' +
    '<a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>' +
    '<a href="https://x.com" target="_blank" rel="noopener" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>' +
    '<a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>' +
    '<a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>' +
    '</div></div>' +
    '<div><h5>Mall</h5><ul class="foot-links">' +
    '<li><a href="' + P + 'about.html">About</a></li>' +
    '<li><a href="' + P + 'stores.html">Stores</a></li>' +
    '<li><a href="' + P + 'stores.html">Directory</a></li>' +
    '<li><a href="' + P + 'events.html">Events</a></li>' +
    '<li><a href="' + P + 'offers.html">Offers</a></li></ul></div>' +
    '<div><h5>Services</h5><ul class="foot-links">' +
    '<li><a href="' + P + 'contact.html">Concierge</a></li>' +
    '<li><a href="' + P + 'about.html#services">Parking</a></li>' +
    '<li><a href="' + P + 'about.html#services">Accessibility</a></li>' +
    '<li><a href="' + P + 'offers.html">Gift Cards</a></li>' +
    '<li><a href="' + P + 'contact.html">Customer Service</a></li></ul></div>' +
    '<div><h5>Information</h5><ul class="foot-links">' +
    '<li><a href="' + P + 'contact.html">Opening Hours</a></li>' +
    '<li><a href="' + P + 'contact.html">Location</a></li>' +
    '<li><a href="' + P + 'contact.html">Contact</a></li>' +
    '<li><a href="' + P + 'about.html#policies">Privacy Policy</a></li>' +
    '<li><a href="' + P + 'about.html#policies">Terms</a></li></ul></div>' +
    '</div><div class="footer-bottom"><p>\u00A9 <span class="footer-year">2026</span> Maison Royale. All rights reserved.</p>' +
    '<div class="foot-mini"><a href="' + P + 'about.html#policies">Privacy</a><a href="' + P + 'about.html#policies">Terms</a>' +
    '<a href="' + B + 'dashboard/index.html">Management Portal</a></div></div></div></footer>';
}

function page(opts) {
  opts.root = opts.root || '../';
  opts.footerHtml = opts.footerHtml || footerHtml(opts.root);
  const s = chrome(opts);
  return finish(s, opts, opts.root);
}

const PAGES = {};
function def(name, opts) { PAGES[name] = opts; }
// ============================== FASHION ==============================
def('fashion', {
  title: 'Fashion — Maison Royale',
  desc: 'Editorial collections — womenswear, menswear, shoes, bags, watches, jewelry and accessories from the world\'s coveted houses.',
  active: 'fashion',
  hero: pageHero('Fashion', 'Fashion <em>Collections</em>',
    'A living archive of the maison — search every piece by house, category or mood.',
    'https://images.pexels.com/photos/14528152/pexels-photo-14528152.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop'),
  pageScripts: ['fashion.js'],
  modals: '<div class="modal fade modal-lux" id="fashionModal" tabindex="-1" role="dialog" aria-modal="true" aria-label="Piece details"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"></div></div></div>',
  body: `
  <section class="section">
    <div class="container-lux">
      <div class="filter-bar">
        <div class="search-field">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="fashionSearch" placeholder="Search houses, pieces, categories\u2026" aria-label="Search fashion" autocomplete="off">
        </div>
      </div>
      <div class="pills-row" id="fashionCat" role="group" aria-label="Filter by category">
        <button class="pill active" data-cat="All">All</button>
        <button class="pill" data-cat="Womenswear">Womenswear</button>
        <button class="pill" data-cat="Menswear">Menswear</button>
        <button class="pill" data-cat="Evening Wear">Evening Wear</button>
        <button class="pill" data-cat="Outerwear">Outerwear</button>
        <button class="pill" data-cat="Shoes">Shoes</button>
        <button class="pill" data-cat="Handbags">Handbags</button>
        <button class="pill" data-cat="Watches">Watches</button>
        <button class="pill" data-cat="Jewelry">Jewelry</button>
        <button class="pill" data-cat="Accessories">Accessories</button>
      </div>
      <div class="result-count" id="fashionCount"><b>0</b> pieces</div>
      <div class="row g-4" id="fashionGrid"></div>
    </div>
  </section>`
});

// ============================== DINING ==============================
def('dining', {
  title: 'Dining — Maison Royale',
  desc: 'Twelve world-class tables — fine dining, caf\u00E9s, international cuisine and dessert salons across six floors.',
  active: 'dining',
  hero: pageHero('Dining', 'Dining at the <em>Palace</em>',
    'From two Michelin stars to a rooftop tasting room \u2014 book a seat across twelve signature tables.',
    'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop'),
  pageScripts: ['dining.js'],
  modals: '<div class="modal fade modal-lux" id="diningModal" tabindex="-1" role="dialog" aria-modal="true" aria-label="Restaurant details"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"></div></div></div>',
  body: `
  <section class="section">
    <div class="container-lux">
      <div class="filter-bar">
        <div class="search-field">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="diningSearch" placeholder="Search restaurants, cuisines\u2026" aria-label="Search restaurants" autocomplete="off">
        </div>
      </div>
      <div class="pills-row" id="diningCat" role="group" aria-label="Filter by cuisine">
        <button class="pill active" data-cat="All">All</button>
        <button class="pill" data-cat="Fine Dining">Fine Dining</button>
        <button class="pill" data-cat="Casual">Casual</button>
        <button class="pill" data-cat="Caf\u00E9s &amp; Sweets">Caf\u00E9s &amp; Sweets</button>
        <button class="pill" data-cat="Bars &amp; Wine">Bars &amp; Wine</button>
        <button class="pill" data-cat="International">International</button>
      </div>
      <div class="result-count" id="diningCount"><b>0</b> restaurants</div>
      <div class="row g-4" id="diningGrid"></div>
    </div>
  </section>`
});

// =========================== ENTERTAINMENT ===========================
def('entertainment', {
  title: 'Entertainment — Maison Royale',
  desc: 'Cinema, gaming, family and luxury experiences \u2014 something extraordinary on every floor after dark.',
  active: 'entertainment',
  hero: pageHero('Entertainment', 'Entertainment, <em>Perfected</em>',
    'Velvet auditoriums, kinetic stages, VR suites and rooftop terraces \u2014 the maison stays awake with you.',
    'https://images.pexels.com/photos/1487154/pexels-photo-1487154.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop'),
  pageScripts: ['entertainment.js'],
  modals: '<div class="modal fade modal-lux" id="entModal" tabindex="-1" role="dialog" aria-modal="true" aria-label="Venue details"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"></div></div></div>',
  body: `
  <section class="section">
    <div class="container-lux">
      <div class="pills-row" id="entCat" role="group" aria-label="Filter by category">
        <button class="pill active" data-cat="All">All</button>
        <button class="pill" data-cat="Cinema">Cinema</button>
        <button class="pill" data-cat="Gaming">Gaming</button>
        <button class="pill" data-cat="Family">Family</button>
        <button class="pill" data-cat="Live Performances">Live Performances</button>
        <button class="pill" data-cat="Luxury Experiences">Experiences</button>
        <button class="pill" data-cat="Private Lounges">Lounges</button>
        <button class="pill" data-cat="Outdoor">Outdoor</button>
      </div>
      <div class="result-count" id="entCount"><b>0</b> venues</div>
      <div class="row g-4" id="entGrid"></div>
    </div>
  </section>`
});
// =============================== EVENTS ===============================
def('events', {
  title: 'Events — Maison Royale',
  desc: 'Fashion shows, live music, night shopping and private previews \u2014 the maison\u2019s calendar of moments.',
  active: 'events',
  hero: pageHero('Events', 'The Royale <em>Calendar</em>',
    'Fashion presentations, night shopping and private tastings \u2014 reserve your seat before the doors close.',
    'https://images.pexels.com/photos/8193520/pexels-photo-8193520.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop'),
  pageScripts: ['events.js'],
  modals: '<div class="modal fade modal-lux" id="eventModal" tabindex="-1" role="dialog" aria-modal="true" aria-label="Event details"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"></div></div></div>',
  body: `
  <section class="section">
    <div class="container-lux">
      <div class="pills-row" id="eventCat" role="group" aria-label="Filter by type">
        <button class="pill active" data-cat="All">All</button>
        <button class="pill" data-cat="Fashion">Fashion</button>
        <button class="pill" data-cat="Live Music">Live Music</button>
        <button class="pill" data-cat="Social">Social</button>
        <button class="pill" data-cat="Product Launch">Launches</button>
        <button class="pill" data-cat="Seasonal">Seasonal</button>
        <button class="pill" data-cat="Art">Art</button>
        <button class="pill" data-cat="Wellness">Wellness</button>
      </div>
      <div class="result-count" id="eventCount"><b>0</b> events</div>
      <div class="row g-4" id="eventGrid"></div>
    </div>
  </section>`
});

// =============================== OFFERS ===============================
def('offers', {
  title: 'Exclusive Offers — Maison Royale',
  desc: 'Limited-season promotions, VIP privileges and private previews \u2014 claim them with your Royale Card.',
  active: 'offers',
  hero: pageHero('Offers', 'Exclusive <em>Privileges</em>',
    'Limited-season offers from the maison\u2019s finest boutiques \u2014 claim before the season ends.',
    'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop'),
  pageScripts: ['offers.js'],
  body: `
  <section class="section">
    <div class="container-lux">
      <div class="pills-row" id="offerCat" role="group" aria-label="Filter by badge">
        <button class="pill active" data-badge="All">All</button>
        <button class="pill" data-badge="EXCLUSIVE">EXCLUSIVE</button>
        <button class="pill" data-badge="VIP">VIP</button>
        <button class="pill" data-badge="LIMITED">LIMITED</button>
        <button class="pill" data-badge="NEW">NEW</button>
        <button class="pill" data-badge="WEEKEND">WEEKEND</button>
      </div>
      <div class="result-count" id="offerCount"><b>0</b> live offers</div>
      <div class="row g-4" id="offerGrid"></div>
    </div>
  </section>`
});
// ================================ ABOUT ================================
def('about', {
  title: 'About — Maison Royale',
  desc: 'The story, architecture and philosophy of Maison Royale \u2014 six floors of the world\u2019s finest retail destination.',
  active: 'about',
  hero: pageHero('About', 'The Maison, <em>Revealed</em>',
    'Founded in 2012, Maison Royale is a temple of retail \u2014 six floors of glass, marble and the world\u2019s most coveted brands.',
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&fit=crop'),
  body: `
  <section class="section">
    <div class="container-lux">
      <div class="split">
        <div class="split-media">
          <div class="frame tall"><img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop" alt="Editorial portrait at Maison Royale" loading="lazy"></div>
          <div class="media-chip"><b>2012</b><span>Established in Paris</span></div>
        </div>
        <div class="split-body">
          <div class="overline">Our Story</div>
          <h2 class="display-2">A <em>Palace</em> for the senses</h2>
          <p class="lead">Maison Royale was conceived as a single question: what if a shopping destination could feel like the greatest department store ever imagined \u2014 and a private gallery at the same time?</p>
          <ul class="split-list">
            <li><i class="fa-solid fa-leaf"></i><div><b>Designed in harmony</b><p>Travertine, smoked oak and bronze across 96,000 m\u00B2, crowned by a 96-metre glass atrium.</p></div></li>
            <li><i class="fa-solid fa-handshake"></i><div><b>Curated by experts</b><p>Thirty boutiques, twelve tables and eight experiences \u2014 each one chosen by a dedicated house.</p></div></li>
            <li><i class="fa-solid fa-heart"></i><div><b>Quietly considerate</b><p>Concierge on every floor, private salons and one promise: the maison always anticipates.</p></div></li>
          </ul>
          <a href="stores.html" class="btn btn-gold"><i class="fa-solid fa-store"></i> Visit the Directory</a>
        </div>
      </div>
    </div>
  </section>

  <section class="counters-band">
    <div class="container-lux">
      <div class="counters">
        <div><b><span data-count="30">0</span></b><span>Curated Boutiques</span></div>
        <div><b><span data-count="12">0</span></b><span>Restaurants &amp; Bars</span></div>
        <div><b><span data-count="96">0</span>k</b><span>Square Metres</span></div>
        <div><b><span data-count="14">0</span></b><span>Years of Prestige</span></div>
      </div>
    </div>
  </section>

  <section class="section" id="services">
    <div class="container-lux">
      <div class="sec-head">
        <div class="overline">Guest Services</div>
        <h2 class="display-2">Every Comfort, <em>Considered</em></h2>
        <p class="lead">Twelve services that make a day at Royale effortless \u2014 from valet to pet concierge.</p>
      </div>
      <div class="svc-grid" id="aboutServices"></div>
    </div>
  </section>
<section class="section section-alt">
    <div class="container-lux">
      <div class="sec-head">
        <div class="overline">The Building</div>
        <h2 class="display-2">An Architectural <em>Masterpiece</em></h2>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item g2"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Northern_round_atrium_at_Suntec_City_Mall%2C_Singapore.jpg/1400px-Northern_round_atrium_at_Suntec_City_Mall%2C_Singapore.jpg" alt="The grand atrium" loading="lazy"></div>
        <div class="gallery-item"><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Escalator_in_shopping_mall%2C_Warsaw%2C_Poland.jpg/1400px-Escalator_in_shopping_mall%2C_Warsaw%2C_Poland.jpg" alt="Sculptural escalators" loading="lazy"></div>
        <div class="gallery-item"><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/DZ6_0939_A_modern_hotel_building_lit_up_at_night_its_triangular_fa%C3%A7ade_and_rows_of_balconies_glowing_against_the_dark_sky.jpg/1400px-DZ6_0939_A_modern_hotel_building_lit_up_at_night_its_triangular_fa%C3%A7ade_and_rows_of_balconies_glowing_against_the_dark_sky.jpg" alt="The night facade" loading="lazy"></div>
      </div>
    </div>
  </section>

  <section class="vip-band" id="vip">
    <div class="vip-bg" style="background-image:url('https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Entrance_lobby_of_Amantaka_luxury_Resort_%26_Hotel_at_blue_hour_in_Luang_Prabang_Laos.jpg/1400px-Entrance_lobby_of_Amantaka_luxury_Resort_%26_Hotel_at_blue_hour_in_Luang_Prabang_Laos.jpg')"></div>
    <div class="vip-shade"></div>
    <div class="container-lux">
      <div class="vip-inner">
        <div class="overline">The Royale Circle</div>
        <h2>An Address Beyond <em>First Class</em></h2>
        <p class="lead" style="color:rgba(246,239,227,.78)">Invitation-only membership. Personal shoppers, private lounges and previews reserved before anyone else sees them.</p>
        <ul class="vip-list">
          <li><i class="fa-solid fa-user-tie"></i> Private personal shopping</li>
          <li><i class="fa-solid fa-martini-glass-citrus"></i> VIP member lounges</li>
          <li><i class="fa-solid fa-car-side"></i> Valet &amp; chauffeur service</li>
          <li><i class="fa-solid fa-bell-concierge"></i> Dedicated concierge desk</li>
          <li><i class="fa-solid fa-table-top"></i> Private events &amp; previews</li>
          <li><i class="fa-solid fa-champagne-glasses"></i> Members-only dining rooms</li>
        </ul>
        <a href="contact.html" class="btn btn-gold btn-lg">Request Membership <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  </section>

  <section class="section" id="policies">
    <div class="container-lux">
      <div class="sec-head">
        <div class="overline">Good to Know</div>
        <h2 class="display-2">Privacy &amp; <em>Terms</em></h2>
      </div>
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card-lux" style="padding:30px">
            <h3 style="font-size:1.3rem;margin-bottom:12px"><i class="fa-solid fa-shield-halved" style="color:var(--gold);margin-right:10px"></i>Privacy Policy</h3>
            <p class="detail-desc">Maison Royale collects only the information you choose to share \u2014 through forms, the newsletter and loyalty programmes \u2014 to personalise your experience and improve the maison. Your data is never sold. You may request a copy or deletion of your data at any time by writing to privacy@maisonroyale.com.</p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card-lux" style="padding:30px">
            <h3 style="font-size:1.3rem;margin-bottom:12px"><i class="fa-solid fa-scale-balanced" style="color:var(--gold);margin-right:10px"></i>Terms of Service</h3>
            <p class="detail-desc">Entry to the maison implies acceptance of our house rules: courteous conduct, no unauthorised photography in private suites, and supervision of minors. Offers are subject to availability and expire on their stated dates. The Royale Card remains the property of Maison Royale.</p>
          </div>
        </div>
      </div>
    </div>
  </section>`,
  inline: `
    (function () {
      'use strict';
      var D = window.MallData;
      if (!D) return;
      var host = document.getElementById('aboutServices');
      if (host) {
        host.innerHTML = D.SERVICES.map(function (s) {
          return '<div class="card-lux svc-card"><div class="svc-icon"><i class="fa-solid ' + s.icon + '"></i></div><h4>' + D.esc(s.title) + '</h4><p>' + D.esc(s.desc) + '</p></div>';
        }).join('');
      }
    })();`
});
// =============================== CONTACT ===============================
def('contact', {
  title: 'Contact — Maison Royale',
  desc: 'Find Maison Royale on One Royale Avenue, Paris — or write to the concierge.',
  active: 'contact',
  hero: pageHero('Contact', 'Find & <em>Reach Us</em>',
    'One Royale Avenue in the Goldcrest Quarter \u2014 or write to the concierge from anywhere in the world.',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/NYC_Night_lights_%287040124053%29.jpg/1400px-NYC_Night_lights_%287040124053%29.jpg'),
  body: `
  <section class="section">
    <div class="container-lux">
      <div class="info-strip">
        <div><i class="fa-solid fa-location-dot"></i><b>One Royale Avenue</b><span>Goldcrest Quarter, 75008 Paris</span></div>
        <div><i class="fa-solid fa-phone"></i><b>+33 1 42 60 00 00</b><span>Concierge desk \u00B7 open daily</span></div>
        <div><i class="fa-solid fa-envelope"></i><b>concierge@maisonroyale.com</b><span>Replies within one working day</span></div>
        <div><i class="fa-solid fa-clock"></i><b>Mon\u2013Sat 10:00 \u2013 22:00</b><span>Sunday 11:00 \u2013 20:00</span></div>
      </div>

      <div class="map-card" style="margin-bottom:56px">
        <div class="map-scene" style="background-image:linear-gradient(135deg, rgba(10,9,8,.25), rgba(10,9,8,.05)), url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Northern_round_atrium_at_Suntec_City_Mall%2C_Singapore.jpg/1400px-Northern_round_atrium_at_Suntec_City_Mall%2C_Singapore.jpg');background-size:cover;background-position:center">
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-88%);text-align:center">
            <i class="fa-solid fa-location-dot" style="font-size:2.2rem;color:var(--gold);text-shadow:0 6px 18px rgba(0,0,0,.4)"></i>
          </div>
          <span class="badge badge-glass" style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%)"><i class="fa-solid fa-location-dot"></i> One Royale Avenue \u00B7 Goldcrest Quarter</span>
        </div>
        <div class="map-panel">
          <h3 style="font-size:1.3rem;margin-bottom:18px">Arriving at Royale</h3>
          <ul class="split-list">
            <li><i class="fa-solid fa-square-parking"></i><div><b>Parking</b><p>Four basement levels \u00B7 1,400 spaces \u00B7 valet at North &amp; South.</p></div></li>
            <li><i class="fa-solid fa-train-subway"></i><div><b>Metro &amp; Rail</b><p>Goldcrest Central (Lines 1, 9) \u00B7 direct shuttles from both stations.</p></div></li>
            <li><i class="fa-solid fa-person-wheelchair"></i><div><b>Accessibility</b><p>Step-free routes on every level and companion facilities.</p></div></li>
          </ul>
          <a class="btn btn-gold" href="https://www.google.com/maps/search/?api=1&query=48.8698,2.3074" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> Get Directions</a>
        </div>
      </div>
<div class="sec-head">
        <div class="overline">Write to us</div>
        <h2 class="display-2">The Concierge <em>Desk</em></h2>
        <p class="lead">Reservations, private appointments or a simple question \u2014 the desk answers within one working day.</p>
      </div>
      <div class="contact-row" style="max-width:820px">
        <form data-validate id="contactForm" novalidate>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label" for="ctName">Full Name</label>
                <input class="form-control" id="ctName" name="name" type="text" placeholder="Marie Dupont" required aria-required="true">
                <span class="error-msg">Please enter your name.</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label" for="ctEmail">Email Address</label>
                <input class="form-control" id="ctEmail" name="email" type="email" placeholder="marie@example.com" required aria-required="true">
                <span class="error-msg">Please enter a valid email address.</span>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label class="form-label" for="ctSubject">Subject</label>
                <select class="form-select" id="ctSubject" name="subject" required aria-required="true">
                  <option value="" selected disabled>Choose a subject</option>
                  <option>Restaurant reservation</option>
                  <option>Private shopping appointment</option>
                  <option>Royale Circle membership</option>
                  <option>Lost &amp; found</option>
                  <option>General enquiry</option>
                </select>
                <span class="error-msg">Please choose a subject.</span>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label class="form-label" for="ctMsg">Message</label>
                <textarea class="form-control" id="ctMsg" name="message" placeholder="How may the maison help?" required aria-required="true"></textarea>
                <span class="error-msg">Please write a short message.</span>
              </div>
            </div>
          </div>
          <button class="btn btn-gold btn-lg" type="submit" style="margin-top:26px"><i class="fa-solid fa-paper-plane"></i> Send Message</button>
        </form>
      </div>
    </div>
  </section>`,
  inline: `
    (function () {
      'use strict';
      var form = document.getElementById('contactForm');
      if (!form) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form.checkValidity()) {
          window.MR.toast('Message sent', 'The concierge desk will reply within one working day.', 'success');
          form.reset();
          form.classList.remove('was-valid');
        }
      });
    })();`
});

// ================================ WRITER ================================
Object.keys(PAGES).forEach(function (name) {
  const html = page(PAGES[name]);
  writeFileSync(resolve(OUT, name + '.html'), html, 'utf8');
  console.log('wrote pages/' + name + '.html (' + html.length + ' bytes)');
});
console.log('DONE');
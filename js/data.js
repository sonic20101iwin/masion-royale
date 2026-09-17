/* ==========================================================================
   MAISON ROYALE — Data Layer
   Single source of truth for the public site and the admin dashboard.
   Dashboard edits persist to localStorage (simulated backend).
   ========================================================================== */
(function (global) {
  'use strict';

  var IMG = global.MR_IMG || {};

  /* ------------------------------ helpers ------------------------------ */
  function uid(prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function money(n) {
    return '\u20AC' + Number(n || 0).toLocaleString('en-US');
  }
  function fmtDate(d) {
    var dt = new Date(d);
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function daysUntil(dateStr) {
    var t = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(t / 86400000));
  }
  function read(key, fb) {
    try { var raw = localStorage.getItem('mr_' + key); if (raw) return JSON.parse(raw); } catch (e) {}
    return fb;
  }
  function write(key, val) {
    try { localStorage.setItem('mr_' + key, JSON.stringify(val)); } catch (e) {}
  }
  function isOpenNow(hours) {
    // hours like "10:00 – 22:00"
    var m = /(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/.exec(hours || '');
    if (!m) return false;
    var d = new Date();
    var now = d.getHours() * 60 + d.getMinutes();
    var a = (+m[1]) * 60 + (+m[2]);
    var b = (+m[3]) * 60 + (+m[4]);
    return now >= a && now <= b;
  }

  /* ------------------------------- site -------------------------------- */
  var SITE = {
    name: 'Maison Royale',
    brand: 'MAISON ROYALE',
    tagline: 'Where Luxury Meets Lifestyle',
    desc: 'Six floors of the world\u2019s finest fashion, dining, entertainment and experiences \u2014 under one extraordinary destination.',
    address: 'One Royale Avenue, Goldcrest Quarter',
    city: 'Paris, France',
    phone: '+33 1 42 60 00 00',
    email: 'concierge@maisonroyale.com',
    hours: 'Mon\u2013Sat 10:00 \u2013 22:00 &middot; Sun 11:00 \u2013 20:00',
    floors: ['G', 'M', '1', '2', '3', 'R'],
    floorNames: { G: 'Ground', M: 'Mezzanine', '1': 'Level 1', '2': 'Level 2', '3': 'Level 3', R: 'Rooftop' },
    est: 2012,
    storesTotal: 28,
    pos: { lat: 48.8698, lng: 2.3074 }
  };

  /* ---------------------------- categories ----------------------------- */
  var CATEGORIES = {
    fashion: ['Womenswear', 'Menswear', 'Shoes', 'Bags', 'Watches', 'Jewelry', 'Accessories'],
    dining: ['Fine Dining', 'Caf\u00E9s', 'Fast Casual', 'Desserts', 'International'],
    lifestyle: ['Beauty', 'Fitness', 'Spa', 'Wellness'],
    entertainment: ['Cinema', 'Arcade', 'Live Performances', 'Family', 'Experiences']
  };

  /* ------------------------------ brands ------------------------------- */
  var BRANDS = [
    { name: 'Maison \u00C9l\u00E9gance', cat: 'Womenswear', floor: '1', blurb: 'Parisian couture reimagined for the modern muse.', img: 'dressA', mono: 'M\u00C9' },
    { name: 'Aurelia', cat: 'Womenswear', floor: '1', blurb: 'Fluid silhouettes, architectural draping.', img: 'dressB', mono: 'AU' },
    { name: 'Noir Atelier', cat: 'Couture & Evening', floor: '2', blurb: 'Precision tailoring in a palette of shadow.', img: 'dressNoir', mono: 'NA' },
    { name: 'Milano House', cat: 'Menswear', floor: 'G', blurb: 'Sartorial elegance from Lake Como to Le Marais.', img: 'suitEditorial', mono: 'MH' },
    { name: '\u00C9lan', cat: 'Contemporary', floor: '1', blurb: 'Effortless luxury for the everyday.', img: 'womanStreet', mono: '\u00C9L' },
    { name: 'Prestige', cat: 'Designer Labels', floor: '2', blurb: 'A curated edit of the world\u2019s most coveted houses.', img: 'fashionRunway', mono: 'PR' },
    { name: 'Velvet & Co.', cat: 'Accessories', floor: 'M', blurb: 'Where every detail whispers exclusivity.', img: 'catAccessories', mono: 'VC' },
    { name: 'Crown Fashion', cat: 'Fine Retail', floor: '3', blurb: 'The crown jewel of avant-garde luxury retail.', img: 'fashionEditorial', mono: 'CF' }
  ];
  /* ------------------------------ stores ------------------------------- */
  var DEFAULT_STORES = [
    { id: 's1',  name: 'Maison \u00C9l\u00E9gance', group: 'Fashion', cat: 'Womenswear', floor: '1', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 01', desc: 'Parisian couture, hand-finished ateliers and seasonal capsules presented in a gallery-like boutique.', img: 'dressA', status: 'open', location: 'North Atrium \u00B7 Level 1', rating: 4.9 },
    { id: 's2',  name: 'Aurelia', group: 'Fashion', cat: 'Womenswear', floor: '1', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 02', desc: 'Architectural draping, sculptural knitwear and the house\u2019s signature silk canvas.', img: 'dressB', status: 'open', location: 'Galleria \u00B7 Level 1', rating: 4.8 },
    { id: 's3',  name: 'Noir Atelier', group: 'Fashion', cat: 'Couture & Evening', floor: '2', hours: '11:00 \u2013 20:00', phone: '+33 1 42 60 00 03', desc: 'Evening couture and made-to-measure tailoring in a monochrome atelier.', img: 'dressNoir', status: 'open', location: 'East Wing \u00B7 Level 2', rating: 5.0 },
    { id: 's4',  name: 'Milano House', group: 'Fashion', cat: 'Menswear', floor: 'G', hours: '10:00 \u2013 22:00', phone: '+33 1 42 60 00 04', desc: 'Sartorial suiting, silk dressing gowns and Italian leather goods.', img: 'suitEditorial', status: 'open', location: 'Main Promenade \u00B7 Ground', rating: 4.7 },
    { id: 's5',  name: '\u00C9lan', group: 'Fashion', cat: 'Contemporary', floor: '1', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 05', desc: 'Effortless contemporary luxury \u2014 knitwear, tailoring and leather accessories.', img: 'womanStreet', status: 'open', location: 'North Atrium \u00B7 Level 1', rating: 4.6 },
    { id: 's6',  name: 'Prestige', group: 'Fashion', cat: 'Designer Labels', floor: '2', hours: '10:00 \u2013 21:30', phone: '+33 1 42 60 00 06', desc: 'A multi-brand emporium of the world\u2019s most coveted fashion houses.', img: 'fashionRunway', status: 'open', location: 'Grand Gallery \u00B7 Level 2', rating: 4.9 },
    { id: 's7',  name: 'Velvet & Co.', group: 'Fashion', cat: 'Accessories', floor: 'M', hours: '10:00 \u2013 20:30', phone: '+33 1 42 60 00 07', desc: 'Silk scarves, eyewear and objet to complete every couture look.', img: 'catAccessories', status: 'open', location: 'Mezzanine \u00B7 Central', rating: 4.5 },
    { id: 's8',  name: 'Crown Fashion', group: 'Fashion', cat: 'Fine Retail', floor: '3', hours: '11:00 \u2013 20:00', phone: '+33 1 42 60 00 08', desc: 'Avant-garde labels, exclusive capsules and private client suites.', img: 'fashionEditorial', status: 'coming', location: 'Sky Gallery \u00B7 Level 3', rating: 4.8 },
    { id: 's9',  name: 'Sole Society', group: 'Fashion', cat: 'Shoes', floor: 'G', hours: '10:00 \u2013 22:00', phone: '+33 1 42 60 00 09', desc: 'Hand-finished footwear from the world\u2019s most celebrated makers.', img: 'shoeB', status: 'open', location: 'Main Promenade \u00B7 Ground', rating: 4.7 },
    { id: 's10', name: 'Marchetti Calzature', group: 'Fashion', cat: 'Shoes', floor: 'G', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 10', desc: 'Florentine craftsmanship, from pav\u00E9 oxfords to sculptural loafers.', img: 'shoeG', status: 'open', location: 'South Promenade \u00B7 Ground', rating: 4.8 },
    { id: 's11', name: 'Heels & Co.', group: 'Fashion', cat: 'Shoes', floor: 'M', hours: '10:00 \u2013 20:30', phone: '+33 1 42 60 00 11', desc: 'Designer heels and evening shoes, matched to order.', img: 'shoeD', status: 'open', location: 'Mezzanine \u00B7 East', rating: 4.6 },
    { id: 's12', name: 'Chrono Paris', group: 'Fashion', cat: 'Watches', floor: '1', hours: '10:00 \u2013 20:00', phone: '+33 1 42 60 00 12', desc: 'Haute horlogerie \u2014 complications, heritage references and limited series.', img: 'watchA', status: 'open', location: 'Galleria \u00B7 Level 1', rating: 4.9 },
    { id: 's13', name: 'Aurea Gioielli', group: 'Fashion', cat: 'Jewelry', floor: '2', hours: '10:00 \u2013 20:00', phone: '+33 1 42 60 00 13', desc: 'Gold and white-diamond jewellery, designed in a single Milanese atelier.', img: 'jewelryA', status: 'open', location: 'East Wing \u00B7 Level 2', rating: 5.0 },
    { id: 's14', name: 'Maison Lumi\u00E8re', group: 'Fashion', cat: 'Couture & Evening', floor: '3', hours: '11:00 \u2013 19:30', phone: '+33 1 42 60 00 14', desc: 'Made-to-measure evening wear in couture ateliers of sheer luxury.', img: 'dressCouture', status: 'open', location: 'Sky Gallery \u00B7 Level 3', rating: 4.9 },
    { id: 's15', name: 'Le Sac Atelier', group: 'Fashion', cat: 'Bags', floor: '1', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 15', desc: 'Bespoke handbags and trunks, cut and stitched on the premises.', img: 'bagA', status: 'open', location: 'North Atrium \u00B7 Level 1', rating: 4.8 }
  ];
  var DEFAULT_STORES_B = [
    { id: 's16', name: 'Le Grand Rouge', group: 'Dining', cat: 'Fine Dining', floor: '3', hours: '12:00 \u2013 23:00', phone: '+33 1 42 60 00 16', desc: 'A two-Michelin-star table beneath a glass cupola, serving classic French haute cuisine.', img: 'diningA', status: 'open', location: 'Sky Gallery \u00B7 Level 3', rating: 5.0 },
    { id: 's17', name: 'Caf\u00E9 \u00C9toile', group: 'Dining', cat: 'Caf\u00E9s', floor: 'G', hours: '08:00 \u2013 20:00', phone: '+33 1 42 60 00 17', desc: 'Single-origin espresso, cultured butter croissants, gold-leaf lattes.', img: 'diningG', status: 'open', location: 'Main Promenade \u00B7 Ground', rating: 4.7 },
    { id: 's18', name: 'Sakura House', group: 'Dining', cat: 'International', floor: '2', hours: '12:00 \u2013 22:30', phone: '+33 1 42 60 00 18', desc: 'Omakase menus and a 14-seat counter of market-driven Japanese cuisine.', img: 'diningD', status: 'open', location: 'East Wing \u00B7 Level 2', rating: 4.9 },
    { id: 's19', name: 'P\u00E2tisserie Noire', group: 'Dining', cat: 'Desserts', floor: 'M', hours: '09:00 \u2013 21:00', phone: '+33 1 42 60 00 19', desc: 'Sculptural desserts, viennoiserie and rare cacao from single estates.', img: 'diningK', status: 'open', location: 'Mezzanine \u00B7 Central', rating: 4.8 },
    { id: 's20', name: 'The Conservatory', group: 'Dining', cat: 'International', floor: '2', hours: '11:00 \u2013 22:00', phone: '+33 1 42 60 00 20', desc: 'A botanical brasserie serving a world tour of flavours under glass.', img: 'diningE', status: 'open', location: 'Grand Gallery \u00B7 Level 2', rating: 4.6 },
    { id: 's21', name: 'Oasi', group: 'Dining', cat: 'Fast Casual', floor: '1', hours: '11:00 \u2013 21:30', phone: '+33 1 42 60 00 21', desc: 'Contemporary Italian \u2014 handmade pasta, wood-fired antipasti.', img: 'diningF', status: 'open', location: 'Galleria \u00B7 Level 1', rating: 4.5 },
    { id: 's22', name: 'Belladonna Beauty', group: 'Lifestyle', cat: 'Beauty', floor: 'G', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 22', desc: 'Skincare alchemy, brow ateliers and the finest cosmetic houses.', img: 'makeupA', status: 'open', location: 'South Promenade \u00B7 Ground', rating: 4.7 },
    { id: 's23', name: 'Fragrance House', group: 'Lifestyle', cat: 'Beauty', floor: 'G', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 23', desc: 'A perfumery of rare essences and bespoke scent consultations.', img: 'perfumeA', status: 'open', location: 'Main Promenade \u00B7 Ground', rating: 4.8 },
    { id: 's24', name: 'Pure & Co.', group: 'Lifestyle', cat: 'Spa', floor: '3', hours: '09:00 \u2013 21:30', phone: '+33 1 42 60 00 24', desc: 'A thermal spa sanctuary \u2014 hammam, vitality pool and silent suites.', img: 'spaA', status: 'open', location: 'Sky Gallery \u00B7 Level 3', rating: 4.9 },
    { id: 's25', name: 'Lumina Fitness', group: 'Lifestyle', cat: 'Fitness', floor: '3', hours: '06:00 \u2013 23:00', phone: '+33 1 42 60 00 25', desc: 'A wellness club with private training suites and skyline studios.', img: 'fitnessA', status: 'open', location: 'Sky Gallery \u00B7 Level 3', rating: 4.6 },
    { id: 's26', name: 'The Royale Cinemas', group: 'Entertainment', cat: 'Cinema', floor: '2', hours: '10:00 \u2013 01:00', phone: '+33 1 42 60 00 26', desc: 'Seven auditoriums of velvet and sound \u2014 including an IMAX hall.', img: 'cinema', status: 'open', location: 'East Wing \u00B7 Level 2', rating: 4.8 },
    { id: 's27', name: 'Aether Arcade', group: 'Entertainment', cat: 'Arcade', floor: '2', hours: '11:00 \u2013 23:00', phone: '+33 1 42 60 00 27', desc: 'Curated gaming \u2014 simulators, esports lounges and VR suites.', img: 'partyNeon', status: 'open', location: 'East Wing \u00B7 Level 2', rating: 4.5 },
    { id: 's28', name: 'The Sunburst Stage', group: 'Entertainment', cat: 'Live Performances', floor: 'G', hours: 'Advance shows only', phone: '+33 1 42 60 00 28', desc: 'Live performances, fashion presentations and private recitals.', img: 'stageParty', status: 'open', location: 'Central Plaza \u00B7 Ground', rating: 4.9 },
    { id: 's29', name: 'Orion IMAX', group: 'Entertainment', cat: 'Cinema', floor: '2', hours: '10:00 \u2013 01:00', phone: '+33 1 42 60 00 29', desc: 'A 400-seat IMAX auditorium and the continent\u2019s largest screen.', img: 'cinema4dx', status: 'coming', location: 'East Wing \u00B7 Level 2', rating: 4.7 },
    { id: 's30', name: 'Family Kingdom', group: 'Entertainment', cat: 'Family', floor: '2', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 30', desc: 'Interactive play, soft-play castles and weekend story salons.', img: 'popcorn', status: 'open', location: 'East Wing \u00B7 Level 2', rating: 4.6 }
  ].concat(DEFAULT_STORES);

  // NOTE: DEFAULT_STORES_B intentionally built after merge above; alias for clarity
  var ALL_STORES_SEED = DEFAULT_STORES_B;

  /* ----------------------------- products ----------------------------- */
  var DEFAULT_PRODUCTS = [
    { id: 'p1',  name: 'Noir Gown \u2014 Haute Couture', brand: 'Maison \u00C9l\u00E9gance', cat: 'Evening Wear', price: 4200, old: 4800, desc: 'Hand-draped silk satin gown with a sculptural neckline. Made to order in Paris.', img: 'dressC', status: 'in-stock', stock: 6 },
    { id: 'p2',  name: 'Aurelia Silk Column Dress', brand: 'Aurelia', cat: 'Women\u2019s Fashion', price: 2650, old: 0, desc: 'Fluid silk column rendered in the house\u2019s signature champagne noir.', img: 'dressB', status: 'in-stock', stock: 12 },
    { id: 'p3',  name: 'Milano Sartorial Suit', brand: 'Milano House', cat: 'Men\u2019s Fashion', price: 3800, old: 4200, desc: 'Two-button peak lapel suit in midnight-wool, canvased entirely by hand.', img: 'suitEditorial', status: 'in-stock', stock: 9 },
    { id: 'p4',  name: '\u00C9lan Ivory Blazer', brand: '\u00C9lan', cat: 'Outerwear', price: 1750, old: 0, desc: 'Single-breasted unstructured blazer in ivory merino and silk.', img: 'editorialMan', status: 'in-stock', stock: 15 },
    { id: 'p5',  name: 'Noir Atelier Cocktail Dress', brand: 'Noir Atelier', cat: 'Evening Wear', price: 2950, old: 0, desc: 'Architectural cocktail dress with couture-laser cut detailing.', img: 'dressA', status: 'in-stock', stock: 8 },
    { id: 'p6',  name: 'Prestige One-Shoulder Gown', brand: 'Prestige', cat: 'Evening Wear', price: 5450, old: 6100, desc: 'A one-shoulder column gown in crushed velvet, weighted with crystal.', img: 'dressD', status: 'limited', stock: 3 },
    { id: 'p7',  name: 'Crown Cashmere Duster Coat', brand: 'Crown Fashion', cat: 'Outerwear', price: 3200, old: 0, desc: 'Double-faced cashmere duster in warm taupe, cut long and fluid.', img: 'womanStreet', status: 'in-stock', stock: 7 },
    { id: 'p8',  name: 'Aurelia Silk Blouse', brand: 'Aurelia', cat: 'Women\u2019s Fashion', price: 890, old: 990, desc: 'Blouson sleeve silk blouse with elongated French cuffs.', img: 'dressSilk', status: 'in-stock', stock: 20 },
    { id: 'p9',  name: 'Sole Chevalier Oxford', brand: 'Sole Society', cat: 'Formal Shoes', price: 1450, old: 0, desc: 'Whole-cut oxford in museum calf, finished on a last cut for Royale.', img: 'shoeB', status: 'in-stock', stock: 14 },
    { id: 'p10', name: 'Marchetti Driver Loafers', brand: 'Marchetti Calzature', cat: 'Loafers', price: 720, old: 0, desc: 'Unlined peccary loafers with a hand-stitched apron seam.', img: 'shoeG', status: 'in-stock', stock: 22 },
    { id: 'p11', name: 'Heels & Co. Stiletto Noir', brand: 'Heels & Co.', cat: 'Heels', price: 980, old: 1150, desc: '100mm stiletto in patent noir with a shimmering gold thread.', img: 'shoeD', status: 'limited', stock: 4 },
    { id: 'p12', name: 'Sole \u00C9lan Street Sneaker', brand: 'Sole Society', cat: 'Sneakers', price: 640, old: 0, desc: 'Italian sneaker in nappa with tone-on-tone rubber sole.', img: 'shoeE', status: 'in-stock', stock: 30 },
    { id: 'p13', name: 'Marchetti Chelsea Boot', brand: 'Marchetti Calzature', cat: 'Boots', price: 1180, old: 1320, desc: 'Suede chelsea boot on a slim, elongated almond last.', img: 'shoeH', status: 'in-stock', stock: 11 },
    { id: 'p14', name: 'Heels & Co. Satin Sandal', brand: 'Heels & Co.', cat: 'Sandals', price: 860, old: 0, desc: 'Barely-there sandal in ivory satin with luminous hardware.', img: 'shoeC', status: 'in-stock', stock: 13 }
  ];
  var DEFAULT_PRODUCTS_B = [
    { id: 'p15', name: 'Le Sac Monarch Tote', brand: 'Le Sac Atelier', cat: 'Handbags', price: 2400, old: 0, desc: 'Sculptural tote in grained leather, stitched over a timber frame.', img: 'bagA', status: 'in-stock', stock: 8 },
    { id: 'p16', name: 'Velvet Evening Clutch', brand: 'Velvet & Co.', cat: 'Clutches', price: 1100, old: 0, desc: 'Box clutch in satin velvet with a gold clasp and chain strap.', img: 'bagB', status: 'in-stock', stock: 16 },
    { id: 'p17', name: 'Le Sac Voyage Duffle', brand: 'Le Sac Atelier', cat: 'Travel', price: 1900, old: 2100, desc: 'Weekender duffle in burnished tobacco leather, fully lined in suede.', img: 'bagC', status: 'in-stock', stock: 6 },
    { id: 'p18', name: 'Chrono H\u00E9ritage 41', brand: 'Chrono Paris', cat: 'Watches', price: 18500, old: 0, desc: 'Automatic 41mm in 18k gold with a hand-guilloch\u00E9 dial.', img: 'watchA', status: 'limited', stock: 5 },
    { id: 'p19', name: 'Chrono Squelette Nocturne', brand: 'Chrono Paris', cat: 'Watches', price: 12500, old: 14000, desc: 'Openworked automatic in steel with anthracite bridges.', img: 'watchC', status: 'in-stock', stock: 4 },
    { id: 'p20', name: 'Aurelia Serpentine Watch', brand: 'Aurelia', cat: 'Watches', price: 6800, old: 0, desc: 'Ladies\u2019 bracelet watch coiled in polished and satin gold.', img: 'watchB', status: 'in-stock', stock: 7 },
    { id: 'p21', name: 'Aurea Solitaire Ring', brand: 'Aurea Gioielli', cat: 'Jewelry', price: 15400, old: 0, desc: 'A 1.8ct brilliant-cut diamond set in a six-claw gold setting.', img: 'jewelryA', status: 'limited', stock: 2 },
    { id: 'p22', name: 'Aurea Gold Cuff', brand: 'Aurea Gioielli', cat: 'Jewelry', price: 9200, old: 0, desc: 'Sculptural cuff in mirror-polished gold, open at the wrist.', img: 'jewelryB', status: 'in-stock', stock: 6 },
    { id: 'p23', name: 'Velvet Premi\u00E8re Sunglasses', brand: 'Velvet & Co.', cat: 'Accessories', price: 520, old: 0, desc: 'Acetate eyewear with gold core wire and mineral lenses.', img: 'catAccessories', status: 'in-stock', stock: 18 },
    { id: 'p24', name: 'Fragrance House Essence N\u00B01', brand: 'Fragrance House', cat: 'Fragrance', price: 310, old: 0, desc: 'Rare oud, iris and bergamot \u2014 hand-blended in limited batches.', img: 'perfumeA', status: 'in-stock', stock: 40 }
  ].concat(DEFAULT_PRODUCTS);
  var ALL_PRODUCTS_SEED = DEFAULT_PRODUCTS_B;

  /* --------------------------- restaurants --------------------------- */
  var DEFAULT_RESTAURANTS = [
    { id: 'r1',  name: 'Le Grand Rouge', cuisine: 'French Haute', price: 4, floor: '3', hours: '12:00 \u2013 23:00', phone: '+33 1 42 60 00 16', desc: 'Two Michelin stars beneath a glass cupola. Prix-fixe theatre of the senses.', img: 'diningA', tags: ['Chef\u2019s Table', 'Sommelier'] },
    { id: 'r2',  name: 'Caf\u00E9 \u00C9toile', cuisine: 'Caf\u00E9 & Patisserie', price: 2, floor: 'G', hours: '08:00 \u2013 20:00', phone: '+33 1 42 60 00 17', desc: 'Gold-leaf lattes, cultured butter croissants and quiet mornings.', img: 'diningG', tags: ['Breakfast', 'Lunch'] },
    { id: 'r3',  name: 'Sakura House', cuisine: 'Japanese', price: 3, floor: '2', hours: '12:00 \u2013 22:30', phone: '+33 1 42 60 00 18', desc: 'Omakase at a 14-seat hinoki counter. Market-driven, season-first.', img: 'diningD', tags: ['Omakase', 'Sushi'] },
    { id: 'r4',  name: 'P\u00E2tisserie Noire', cuisine: 'Desserts', price: 2, floor: 'M', hours: '09:00 \u2013 21:00', phone: '+33 1 42 60 00 19', desc: 'Sculptural desserts and single-estate cacao. The sweetest floor in the house.', img: 'diningK', tags: ['Afternoon Tea', 'Viennoiserie'] },
    { id: 'r5',  name: 'The Conservatory', cuisine: 'International', price: 3, floor: '2', hours: '11:00 \u2013 22:00', phone: '+33 1 42 60 00 20', desc: 'A botanical brasserie touring the world\u2019s flavours under one glass roof.', img: 'diningE', tags: ['Brunch', 'Botanical'] },
    { id: 'r6',  name: 'Oasi', cuisine: 'Italian', price: 3, floor: '1', hours: '11:00 \u2013 21:30', phone: '+33 1 42 60 00 21', desc: 'Handmade pasta, wood-fired antipasti and a cellar of Tuscan vintages.', img: 'diningF', tags: ['Pasta', 'Wine'] },
    { id: 'r7',  name: 'Grill Royale', cuisine: 'Steakhouse', price: 4, floor: '3', hours: '12:00 \u2013 23:30', phone: '+33 1 42 60 00 31', desc: 'Dry-aged prime beef finished over oak. A carnivore\u2019s cathedral.', img: 'diningB', tags: ['Steak', 'Private Dining'] },
    { id: 'r8',  name: 'The Tea Atelier', cuisine: 'Tea & Pastry', price: 2, floor: 'M', hours: '10:00 \u2013 19:00', phone: '+33 1 42 60 00 32', desc: 'Rare-leaf teas, petits fours and ceremonial service on level M.', img: 'diningM', tags: ['High Tea', 'Japandi'] },
    { id: 'r9',  name: 'Oc\u00E9an', cuisine: 'Seafood', price: 4, floor: '2', hours: '12:00 \u2013 22:00', phone: '+33 1 42 60 00 33', desc: 'Coastal French plates \u2014 oysters, turbot and champagne beurre blanc.', img: 'diningC', tags: ['Oysters', 'Shellfish'] },
    { id: 'r10', name: 'Vinoteca 21', cuisine: 'Wine Bar', price: 3, floor: '1', hours: '17:00 \u2013 01:00', phone: '+33 1 42 60 00 34', desc: 'Six hundred references by the glass, charcuterie and live vinyl.', img: 'diningJ', tags: ['Natural Wine', 'Late Night'] },
    { id: 'r11', name: 'Maison du Caf\u00E9', cuisine: 'Specialty Coffee', price: 2, floor: 'G', hours: '07:30 \u2013 19:00', phone: '+33 1 42 60 00 35', desc: 'Single-origin espresso culture, brewed with obsessive precision.', img: 'diningH', tags: ['Espresso', 'Calm'] },
    { id: 'r12', name: 'Solstice', cuisine: 'Contemporary', price: 4, floor: 'R', hours: '12:00 \u2013 23:00', phone: '+33 1 42 60 00 36', desc: 'Rooftop tasting menus with a 360\u00B0 view over the city\u2019s gold hour.', img: 'diningL', tags: ['Tasting Menu', 'Rooftop'] }
  ];
  /* -------------------------- entertainment ---------------------------- */
  var DEFAULT_ENTERTAINMENT = [
    { id: 'e1', name: 'The Royale Cinemas', cat: 'Cinema', floor: '2', hours: '10:00 \u2013 01:00', phone: '+33 1 42 60 00 26', desc: 'Seven auditoriums of velvet, Dolby Atmos and a grand champagne foyer.', img: 'cinema' },
    { id: 'e2', name: 'Orion IMAX', cat: 'Cinema', floor: '2', hours: '10:00 \u2013 01:00', phone: '+33 1 42 60 00 29', desc: 'The continent\u2019s largest screen with immersive 12-channel sound.', img: 'cinema4dx' },
    { id: 'e3', name: 'Aether Arcade', cat: 'Gaming', floor: '2', hours: '11:00 \u2013 23:00', phone: '+33 1 42 60 00 27', desc: 'Racing simulators, esports stages and private VR suites.', img: 'partyNeon' },
    { id: 'e4', name: 'Family Kingdom', cat: 'Family', floor: '2', hours: '10:00 \u2013 21:00', phone: '+33 1 42 60 00 30', desc: 'Soft-play castles, interactive floors and weekend story salons.', img: 'popcorn' },
    { id: 'e5', name: 'The Sunburst Stage', cat: 'Live Performances', floor: 'G', hours: 'Advance shows only', phone: '+33 1 42 60 00 28', desc: 'Live music, fashion presentations and private recitals under a kinetic light rig.', img: 'stageParty' },
    { id: 'e6', name: 'Le D\u00F4me Experiences', cat: 'Luxury Experiences', floor: '3', hours: 'By appointment', phone: '+33 1 42 60 00 37', desc: 'Champagne tastings, cigar lounges and private concierge-led moments.', img: 'champagne' },
    { id: 'e7', name: 'The Velvet Room', cat: 'Private Lounges', floor: '3', hours: '18:00 \u2013 02:00', phone: '+33 1 42 60 00 38', desc: 'A members-only salon for evening cocktails and quiet ideas.', img: 'interiorRoom' },
    { id: 'e8', name: 'Terraces Royale', cat: 'Outdoor', floor: 'R', hours: '10:00 \u2013 23:00', phone: '+33 1 42 60 00 39', desc: 'Rooftop gardens with skyline views, seasonal food and golden hour.', img: 'interiorLounge' }
  ];

  /* ------------------------------ events ------------------------------ */
  var DEFAULT_EVENTS = [
    { id: 'ev1', title: 'Maison Royale Autumn Fashion Show', date: '2026-09-20', time: '19:00', location: 'Grand Atrium', cat: 'Fashion', desc: 'Our autumn-winter presentation with eight couture houses on one runway. Seating is reservation-only.', img: 'fashionRunway', status: 'published', featured: true, capacity: 1200 },
    { id: 'ev2', title: 'Golden Hour Jazz Series', date: '2026-09-24', time: '20:30', location: 'The Sunburst Stage', cat: 'Live Music', desc: 'An intimate evening of contemporary jazz beneath the kinetic light rig.', img: 'stageParty', status: 'published', featured: false, capacity: 400 },
    { id: 'ev3', title: 'Champagne Evening \u2014 Vintage Tasting', date: '2026-10-02', time: '18:30', location: 'Le Grand Rouge', cat: 'Social', desc: 'Rare press\u00E9e vintages, paired canap\u00E9s and a masterclass with our head sommelier.', img: 'champagne', status: 'published', featured: false, capacity: 90 },
    { id: 'ev4', title: 'Aurea Gioielli \u2014 Private Preview', date: '2026-10-08', time: '17:00', location: 'Level 2 \u00B7 East Wing', cat: 'Product Launch', desc: 'Meet the atelier behind the Solitaire collection and preview pieces in platinum.', img: 'jewelryA', status: 'published', featured: false, capacity: 150 },
    { id: 'ev5', title: 'Nocturne \u2014 Night Shopping', date: '2026-10-16', time: '19:00', location: 'The Whole Mall', cat: 'Seasonal', desc: 'The floors stay open past midnight with champagne caravans and live DJ sets in the atria.', img: 'cityNight', status: 'published', featured: true, capacity: 5000 },
    { id: 'ev6', title: 'Art & Atelier \u2014 Emerging Artists', date: '2026-10-22', time: '16:00', location: 'Gallery Royale', cat: 'Art', desc: 'A curated opening of sculpture and textiles from six European academies.', img: 'storeDisplay', status: 'published', featured: false, capacity: 300 },
    { id: 'ev7', title: 'Wellness Weekend', date: '2026-10-30', time: '09:00', location: 'Pure & Co. \u00B7 Level 3', cat: 'Wellness', desc: 'Breathwork, thermal rituals and guided sound baths across three days.', img: 'spaB', status: 'draft', featured: false, capacity: 60 },
    { id: 'ev8', title: 'Crown Fashion Private Preview', date: '2026-11-06', time: '19:30', location: 'La Grande Salle', cat: 'Fashion', desc: 'An invitation-only first view of Crown\u2019s winter couture collection.', img: 'dressCouture', status: 'draft', featured: false, capacity: 200 }
  ];
  /* ------------------------------- offers ------------------------------ */
  var DEFAULT_OFFERS = [
    { id: 'o1', title: 'Le Sac Atelier \u2014 Launch Week', store: 'Le Sac Atelier', discount: 20, start: '2026-09-10', end: '2026-09-30', desc: '20% off the entire Monarch collection, including made-to-order totes.', img: 'bagA', badge: 'EXCLUSIVE', status: 'active' },
    { id: 'o2', title: 'Chrono Paris \u2014 Heritage Sale', store: 'Chrono Paris', discount: 15, start: '2026-09-15', end: '2026-10-12', desc: '15% across the Heritage and Squelette lines. Bespoke service included.', img: 'watchA', badge: 'VIP', status: 'active' },
    { id: 'o3', title: 'Le Grand Rouge \u2014 Three-Course Soir\u00E9e', store: 'Le Grand Rouge', discount: 25, start: '2026-09-05', end: '2026-09-25', desc: 'A three-course tasting menu with champagne pairing at a quarter off.', img: 'diningA', badge: 'LIMITED', status: 'active' },
    { id: 'o4', title: 'Belladonna \u2014 Autumn Ritual', store: 'Belladonna Beauty', discount: 30, start: '2026-09-18', end: '2026-10-18', desc: '30% off ritual sets and a complimentary 30-minute skin consultation.', img: 'makeupA', badge: 'NEW', status: 'active' },
    { id: 'o5', title: 'Fragrance House \u2014 Discovery Set', store: 'Fragrance House', discount: 20, start: '2026-09-12', end: '2026-10-05', desc: 'A curated discovery of five rare essences, with credit toward full bottles.', img: 'perfumeA', badge: 'NEW', status: 'active' },
    { id: 'o6', title: 'Caf\u00E9 \u00C9toile \u2014 Weekend Brunch', store: 'Caf\u00E9 \u00C9toile', discount: 15, start: '2026-09-19', end: '2026-10-31', desc: 'Weekend brunch for two with gold-leaf lattes, 15% off after 11am.', img: 'diningG', badge: 'WEEKEND', status: 'active' },
    { id: 'o7', title: 'Aurea Gioielli \u2014 Solitaire Event', store: 'Aurea Gioielli', discount: 10, start: '2026-10-01', end: '2026-10-20', desc: '10% on bespoke commissions placed during the Private Preview week.', img: 'jewelryA', badge: 'VIP', status: 'draft' },
    { id: 'o8', title: 'The Royale Cinemas \u2014 Private Screen', store: 'The Royale Cinemas', discount: 30, start: '2026-09-22', end: '2026-11-15', desc: '30% off private screenings for two in our velvet auditoriums.', img: 'cinema', badge: 'LIMITED', status: 'active' }
  ];

  /* ------------------------------ services ----------------------------- */
  var SERVICES = [
    { icon: 'fa-square-parking', title: 'Parking', desc: '1,400 secure spaces across four basement levels, valet-assisted.' },
    { icon: 'fa-car-side', title: 'Valet Parking', desc: 'Door-to-door valet at the North and South entrances.' },
    { icon: 'fa-bell-concierge', title: 'Concierge', desc: 'Reservations, travel, tickets and surprises \u2014 handled.' },
    { icon: 'fa-person-wheelchair', title: 'Accessibility', desc: 'Step-free routes, assistance and companion facilities.' },
    { icon: 'fa-wifi', title: 'Free Wi-Fi', desc: 'Seamless, high-speed connectivity on every floor.' },
    { icon: 'fa-headset', title: 'Customer Care', desc: 'A concierge desk on each level, staffed all hours.' },
    { icon: 'fa-gift', title: 'Gift Cards', desc: 'Configurable gift cards, wrapped in the house style.' },
    { icon: 'fa-magnifying-glass', title: 'Lost & Found', desc: 'A secure lost-and-found registry updated in real time.' },
    { icon: 'fa-bus', title: 'Transportation', desc: 'Direct shuttles from the city centre and both rail stations.' },
    { icon: 'fa-children', title: 'Family Services', desc: 'Nursing suites, buggy hire and quiet family salons.' },
    { icon: 'fa-user-tie', title: 'Personal Shopping', desc: 'Complimentary stylists and private shopping suites.' },
    { icon: 'fa-hand-holding-heart', title: 'Pet Concierge', desc: 'A five-star care lounge for the city\u2019s most pampered pets.' }
  ];
  /* ------------------------------ analytics ----------------------------- */
  var ANALYTICS = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    visitors: [128400, 142100, 136900, 158700, 171200, 189600, 196400, 178200, 183900, 214600, 232100, 246800],
    revenue: [4120, 4380, 4210, 4890, 5320, 5980, 6240, 5710, 5840, 6710, 7240, 7860],
    attendance: { 'Fashion Show': 1150, 'Jazz Series': 320, 'Night Shopping': 4100, 'Champagne Tasting': 84, 'Art Opening': 260, 'Wellness Weekend': 42, 'Product Launch': 118, 'Gala': 640 },
    storePerf: [
      { name: 'Maison \u00C9l\u00E9gance', rev: '1.42M', footfall: 18600, growth: 8.2 },
      { name: 'Chrono Paris', rev: '1.18M', footfall: 12400, growth: 12.4 },
      { name: 'Le Grand Rouge', rev: '0.96M', footfall: 15200, growth: 6.1 },
      { name: 'Aurea Gioielli', rev: '0.88M', footfall: 9800, growth: 9.7 },
      { name: 'Sole Society', rev: '0.74M', footfall: 14100, growth: 4.5 },
      { name: 'Sakura House', rev: '0.61M', footfall: 10800, growth: 3.2 },
      { name: 'Fragrance House', rev: '0.52M', footfall: 8900, growth: 5.8 },
      { name: 'The Royale Cinemas', rev: '0.47M', footfall: 21300, growth: 1.9 }
    ],
    categories: { Fashion: 42, Dining: 26, Lifestyle: 18, Entertainment: 14 },
    channels: { Organic: 34, Social: 28, Direct: 22, Referral: 9, Paid: 7 },
    engagement: [3.1, 3.4, 3.8, 3.6, 4.1, 4.6, 4.9, 5.2],
    traffic: [48200, 51600, 49700, 55300, 61100, 68900, 72400, 66800, 70200, 81600, 89300, 96200],
    visitorsToday: 48612,
    revenueMtd: 2148
  };

  /* ------------------------- storage & accessors ------------------------ */
  function getList(key, seed) {
    return read(key, seed);
  }
  function setList(key, list) {
    write(key, list);
    var ev = new CustomEvent('mr:' + key + ':change', { detail: list });
    document.dispatchEvent(ev);
  }

  var VERSION = 1;
  var SETTINGS_DEFAULT = { name: SITE.name, address: SITE.address, phone: SITE.phone, email: SITE.email, hours: 'Mon\u2013Sat 10:00 \u2013 22:00 &middot; Sun 11:00 \u2013 20:00', announcements: true, newsletter: true, concierge: true, notices: true };

  global.MallData = {
    VERSION: VERSION,
    SITE: SITE,
    CATEGORIES: CATEGORIES,
    BRANDS: BRANDS,
    SERVICES: SERVICES,
    ANALYTICS: ANALYTICS,
    IMG: IMG,
    esc: esc, money: money, fmtDate: fmtDate, daysUntil: daysUntil, uid: uid, isOpenNow: isOpenNow,
    stores: function () { return getList('stores', ALL_STORES_SEED); },
    products: function () { return getList('products', ALL_PRODUCTS_SEED); },
    restaurants: function () { return getList('restaurants', DEFAULT_RESTAURANTS); },
    entertainment: function () { return getList('entertainment', DEFAULT_ENTERTAINMENT); },
    events: function () { return getList('events', DEFAULT_EVENTS); },
    offers: function () { return getList('offers', DEFAULT_OFFERS); },
    settings: function () { return Object.assign({}, SETTINGS_DEFAULT, read('settings', {})); },
    saveStores: function (l) { setList('stores', l); },
    saveProducts: function (l) { setList('products', l); },
    saveEvents: function (l) { setList('events', l); },
    saveOffers: function (l) { setList('offers', l); },
    saveSettings: function (s) { write('settings', s); }
  };
})(typeof window !== 'undefined' ? window : this);
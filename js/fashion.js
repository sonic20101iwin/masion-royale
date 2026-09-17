/* =========================================================================
   MAISON ROYALE — Fashion collection
   Searchable, filterable product gallery with detail modal + deep links.
   ========================================================================= */
(function () {
  'use strict';
  var D = window.MallData;
  var IMG = window.MR_IMG || {};
  if (!D) return;

  var state = { cat: 'All', q: '', page: 1, per: 12 };
  var SHOES = ['Formal Shoes', 'Loafers', 'Heels', 'Sneakers', 'Boots', 'Sandals'];
  var BAGS = ['Handbags', 'Clutches', 'Travel'];

  function img(key) { return D.IMG[key] || IMG[key] || ''; }
  function catMatch(p, c) {
    if (c === 'Shoes') return SHOES.indexOf(p.cat) !== -1;
    if (c === 'Handbags') return BAGS.indexOf(p.cat) !== -1;
    return p.cat === c;
  }
  function cards() {
    var q = state.q.toLowerCase();
    return D.products().filter(function (p) {
      var okQ = !q || (p.name + ' ' + p.brand + ' ' + p.cat + ' ' + (p.desc || '')).toLowerCase().indexOf(q) !== -1;
      return okQ && (state.cat === 'All' || catMatch(p, state.cat));
    }).sort(function (a, b) { return a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name); });
  }
  function price(r) { return D.money(r.price) + (r.old ? ' <small>' + D.money(r.old) + '</small>' : ''); }
  function card(r) {
    return '<article class="card-lux prod-card reveal">' +
      '<div class="media" style="aspect-ratio:4/5"><img src="' + img(r.img) + '" alt="' + D.esc(r.name) + '" loading="lazy">' +
      (r.status === 'limited' ? '<div class="prod-save"><span class="badge badge-gold">Limited</span></div>' : '') +
      '<div class="prod-view"><button class="btn btn-gold btn-sm" data-view-piece="' + r.id + '"><i class="fa-solid fa-eye"></i> View Details</button></div>' +
      '</div>' +
      '<div class="prod-body">' +
      '<span class="prod-brand">' + D.esc(r.brand) + '</span>' +
      '<h3>' + D.esc(r.name) + '</h3>' +
      '<span class="prod-cat">' + D.esc(r.cat) + '</span>' +
      '<div class="prod-foot"><span class="prod-price">' + price(r) + '</span></div>' +
      '</div></article>';
  }
  function render() {
    var grid = document.getElementById('fashionGrid');
    var count = document.getElementById('fashionCount');
    if (!grid) return;
    var list = cards();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.per));
    state.page = Math.min(state.page, pages);
    var slice = list.slice((state.page - 1) * state.per, state.page * state.per);
    if (!slice.length) {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><div class="e-icon"><i class="fa-solid fa-shirt"></i></div>' +
        '<b>No pieces found</b><p>Try a different house, category or a new season\u2019s search.</p></div></div>';
    } else {
      grid.innerHTML = slice.map(function (r, i) {
        return '<div class="col-md-6 col-lg-4">' + card(r).replace('reveal">', 'reveal" style="animation-delay:' + (i % 3) * 0.08 + 's">') + '</div>';
      }).join('');
      document.querySelectorAll('#fashionGrid [data-view-piece]').forEach(function (b) {
        b.addEventListener('click', function () { openModal(b.getAttribute('data-view-piece')); });
      });
    }
    if (count) count.innerHTML = '<b>' + total + '</b> piece' + (total === 1 ? '' : 's');
    if (window.MR) window.MR.bindImgFallback(grid);
    document.querySelectorAll('#fashionGrid .reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.98) el.classList.add('in');
    });
  }
  function find(id) { var out = null; D.products().forEach(function (p) { if (p.id === id) out = p; }); return out; }
  function openModal(id) {
    var r = find(id);
    var modal = document.getElementById('fashionModal');
    if (!r || !modal) return;
    modal.querySelector('.modal-content').innerHTML =
      '<div class="modal-header"><h5 class="modal-title">' + D.esc(r.name) + '</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="m-head-banner"><img src="' + img(r.img) + '" alt="' + D.esc(r.name) + '"><div class="mhd-shade"></div>' +
      '<div style="position:absolute;top:16px;right:16px;z-index:3"><span class="badge ' + (r.status === 'limited' ? 'badge-gold' : 'badge-open') + '">' + (r.status === 'limited' ? 'Limited' : 'In Stock') + '</span></div></div>' +
      '<div class="modal-body">' +
      '<span style="font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);font-weight:800">' + D.esc(r.brand) + ' \u00B7 ' + D.esc(r.cat) + '</span>' +
      '<h2 style="font-size:1.9rem;margin:.3rem 0 .4rem;font-family:var(--font-display)">' + D.esc(r.name) + '</h2>' +
      '<div style="font-family:var(--font-display);font-size:1.5rem;color:var(--noir)">' + price(r) + '</div>' +
      '<p class="detail-desc">' + D.esc(r.desc) + '</p>' +
      '<div class="detail-grid" style="margin-top:20px">' +
      '<div class="dg-item"><i class="fa-solid fa-tags"></i><div><b>Category</b><span>' + D.esc(r.cat) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-boxes-stacked"></i><div><b>Availability</b><span>' + (r.stock || 0) + ' pieces in the maison</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-store"></i><div><b>House</b><span>' + D.esc(r.brand) + ' boutique</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-circle-info"></i><div><b>Private appt.</b><span>Available on request</span></div></div>' +
      '</div></div>' +
      '<div class="modal-footer"><span style="font-size:.78rem;color:var(--muted)"><i class="fa-solid fa-gem"></i> Complimentary styling session with every piece.</span>' +
      '<a class="btn btn-gold btn-sm" href="stores.html?q=' + encodeURIComponent(r.brand) + '"><i class="fa-solid fa-store"></i> Visit the House</a></div>';
    window.bootstrap.Modal.getOrCreateInstance(modal).show();
    if (window.MR) window.MR.bindImgFallback(modal);
  }
  function init() {
    var qp = new URLSearchParams(location.search);
    var c0 = qp.get('cat');
    var p0 = qp.get('p');
    var searchEl = document.getElementById('fashionSearch');
    if (c0) {
      state.cat = c0;
      document.querySelectorAll('#fashionCat .pill').forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-cat') === c0);
      });
    }
    if (searchEl) searchEl.addEventListener('input', function () { state.q = searchEl.value; state.page = 1; render(); });
    document.querySelectorAll('#fashionCat .pill').forEach(function (p) {
      p.addEventListener('click', function () {
        document.querySelectorAll('#fashionCat .pill').forEach(function (x) { x.classList.remove('active'); });
        p.classList.add('active');
        state.cat = p.getAttribute('data-cat');
        state.page = 1; render();
      });
    });
    render();
    if (p0) setTimeout(function () { openModal(p0); }, 420);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
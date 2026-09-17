/* =========================================================================
   MAISON ROYALE — Dining
   Restaurant gallery with cuisine filters, search and reservation modal.
   ========================================================================= */
(function () {
  'use strict';
  var D = window.MallData;
  var IMG = window.MR_IMG || {};
  if (!D) return;

  var state = { cat: 'All', q: '' };
  var GROUPS = {
    'Fine Dining': ['French Haute', 'Steakhouse', 'Seafood', 'Contemporary'],
    Casual: ['Italian', 'Japanese', 'International'],
    'Caf\u00e9s & Sweets': ['Caf\u00e9 & Patisserie', 'Desserts', 'Tea & Pastry', 'Specialty Coffee'],
    'Bars & Wine': ['Wine Bar'],
    International: ['International', 'Japanese', 'Italian']
  };

  function img(key) { return D.IMG[key] || IMG[key] || ''; }
  function moneyIcon(v) { return '\u20AC'.repeat(Math.max(1, Math.min(4, v))); }
  function matchCuisine(c, group) {
    return group === 'All' || (GROUPS[group] || []).indexOf(c) !== -1;
  }
  function list() {
    var q = state.q.toLowerCase();
    return D.restaurants().filter(function (r) {
      var okQ = !q || (r.name + ' ' + r.cuisine + ' ' + r.desc + ' ' + (r.tags || []).join(' ')).toLowerCase().indexOf(q) !== -1;
      return okQ && matchCuisine(r.cuisine, state.cat);
    }).sort(function (a, b) { return b.price - a.price || a.name.localeCompare(b.name); });
  }
  function card(r) {
    return '<article class="card-lux rest-card reveal">' +
      '<div class="media" style="aspect-ratio:16/10"><img src="' + img(r.img) + '" alt="' + D.esc(r.name) + '" loading="lazy"></div>' +
      '<div class="rest-body">' +
      '<div class="rest-head"><div><span class="rest-cuisine">' + D.esc(r.cuisine) + '</span><h3>' + D.esc(r.name) + '</h3></div>' +
      '<span class="rest-price">' + moneyIcon(r.price) + '</span></div>' +
      '<p>' + D.esc(r.desc) + '</p>' +
      '<div class="rest-tags">' + (r.tags || []).map(function (t) { return '<span>' + D.esc(t) + '</span>'; }).join('') + '</div>' +
      '<div class="rest-meta">' +
      '<span><i class="fa-solid fa-clock"></i>' + D.esc(r.hours) + '</span>' +
      '<span><i class="fa-solid fa-layer-group"></i> Level ' + D.esc(r.floor) + '</span>' +
      '<span><i class="fa-solid fa-phone"></i>' + D.esc(r.phone) + '</span></div>' +
      '<div class="rest-foot">' +
      '<button class="btn btn-gold btn-sm" data-view-rest="' + r.id + '"><i class="fa-solid fa-eye"></i> View Restaurant</button>' +
      '<button class="btn btn-ghost btn-sm" data-book-rest="' + r.id + '"><i class="fa-solid fa-calendar-check"></i> Reserve</button>' +
      '</div></div></article>';
  }
  function render() {
    var grid = document.getElementById('diningGrid');
    var count = document.getElementById('diningCount');
    if (!grid) return;
    var listAll = list();
    if (!listAll.length) {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><div class="e-icon"><i class="fa-solid fa-utensils"></i></div>' +
        '<b>No restaurants found</b><p>Adjust your search \u2014 twelve tables await on six floors.</p></div></div>';
    } else {
      grid.innerHTML = listAll.map(function (r, i) {
        return '<div class="col-md-6 col-lg-4">' + card(r).replace('reveal">', 'reveal" style="animation-delay:' + (i % 3) * 0.08 + 's">') + '</div>';
      }).join('');
      wire();
    }
    if (count) count.innerHTML = '<b>' + listAll.length + '</b> restaurant' + (listAll.length === 1 ? '' : 's');
    if (window.MR) window.MR.bindImgFallback(grid);
    document.querySelectorAll('#diningGrid .reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.98) el.classList.add('in');
    });
  }
  function find(id) { var out = null; D.restaurants().forEach(function (r) { if (r.id === id) out = r; }); return out; }
  function openModal(id) {
    var r = find(id);
    var modal = document.getElementById('diningModal');
    if (!r || !modal) return;
    modal.querySelector('.modal-content').innerHTML =
      '<div class="modal-header"><h5 class="modal-title">' + D.esc(r.name) + '</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="m-head-banner"><img src="' + img(r.img) + '" alt="' + D.esc(r.name) + '"><div class="mhd-shade"></div>' +
      '<div style="position:absolute;top:16px;right:16px;z-index:3"><span class="badge badge-gold">' + D.esc(r.cuisine) + '</span></div></div>' +
      '<div class="modal-body">' +
      '<span style="font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);font-weight:800">' + D.esc(r.cuisine) + ' \u00B7 ' + moneyIcon(r.price) + '</span>' +
      '<h2 style="font-size:1.9rem;margin:.3rem 0 1rem;font-family:var(--font-display)">' + D.esc(r.name) + '</h2>' +
      '<p class="detail-desc">' + D.esc(r.desc) + '</p>' +
      '<div class="rest-tags" style="margin:14px 0 4px">' + (r.tags || []).map(function (t) { return '<span>' + D.esc(t) + '</span>'; }).join('') + '</div>' +
      '<div class="detail-grid" style="margin-top:18px">' +
      '<div class="dg-item"><i class="fa-solid fa-clock"></i><div><b>Service</b><span>' + D.esc(r.hours) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-layer-group"></i><div><b>Level</b><span>' + D.esc(r.floor) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-phone"></i><div><b>Table line</b><span>' + D.esc(r.phone) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-user-tie"></i><div><b>Dress code</b><span>Elegant casual \u00B7 jacket advised</span></div></div>' +
      '</div></div>' +
      '<div class="modal-footer"><span style="font-size:.78rem;color:var(--muted)"><i class="fa-solid fa-bell-concierge"></i> Concierge confirms every reservation personally.</span>' +
      '<button class="btn btn-gold btn-sm" data-book-rest="' + r.id + '" data-bs-dismiss="modal"><i class="fa-solid fa-calendar-check"></i> Reserve a Table</button></div>';
    window.bootstrap.Modal.getOrCreateInstance(modal).show();
    var bk = modal.querySelector('[data-book-rest]');
    if (bk) bk.addEventListener('click', function () { window.MR.toast('Reservation requested', r.name + ' \u2014 the concierge will confirm your table.', 'success'); });
    if (window.MR) window.MR.bindImgFallback(modal);
  }
  function wire() {
    document.querySelectorAll('[data-view-rest]').forEach(function (b) { b.addEventListener('click', function () { openModal(b.getAttribute('data-view-rest')); }); });
    document.querySelectorAll('[data-book-rest]').forEach(function (b) {
      b.addEventListener('click', function () {
        var r = find(b.getAttribute('data-book-rest'));
        if (r) window.MR.toast('Reservation requested', r.name + ' \u2014 the concierge will confirm your table.', 'success');
      });
    });
  }
  function init() {
    var qp = new URLSearchParams(location.search);
    var r0 = qp.get('r');
    var searchEl = document.getElementById('diningSearch');
    if (searchEl) searchEl.addEventListener('input', function () { state.q = searchEl.value; render(); });
    document.querySelectorAll('#diningCat .pill').forEach(function (p) {
      p.addEventListener('click', function () {
        document.querySelectorAll('#diningCat .pill').forEach(function (x) { x.classList.remove('active'); });
        p.classList.add('active');
        state.cat = p.getAttribute('data-cat');
        render();
      });
    });
    render();
    if (r0) setTimeout(function () { openModal(r0); }, 420);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
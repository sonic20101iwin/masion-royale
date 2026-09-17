/* =========================================================================
   MAISON ROYALE — Stores Directory
   Search, group/floor filters, sort, pagination, detail modal.
   ========================================================================= */
(function () {
  'use strict';
  var D = window.MallData;
  var IMG = window.MR_IMG || {};
  if (!D) return;

  var state = { q: '', group: 'All', floor: 'All', sort: 'name', page: 1, per: 12 };

  function img(key) { return D.IMG[key] || IMG[key] || ''; }
  function badge(s) {
    if (s.status === 'coming') return '<span class="badge badge-coming"><i class="fa-solid fa-hourglass-half"></i> Coming Soon</span>';
    return '<span class="badge badge-open"><i class="fa-solid fa-circle" style="font-size:.42rem"></i> Open</span>';
  }
  function card(s) {
    return '' +
      '<article class="card-lux store-card reveal">' +
      '<div class="media" style="aspect-ratio:16/10"><img src="' + img(s.img) + '" alt="' + D.esc(s.name) + ' boutique" loading="lazy">' +
      '<div class="prod-save">' + badge(s) + '</div></div>' +
      '<div class="store-body">' +
      '<div class="store-head"><div><span class="store-cat">' + D.esc(s.group) + ' \u00B7 ' + D.esc(s.cat) + '</span>' +
      '<h3>' + D.esc(s.name) + '</h3></div>' +
      '<span class="badge badge-ghost">Lv ' + D.esc(s.floor) + '</span></div>' +
      '<p class="store-desc">' + D.esc(s.desc) + '</p>' +
      '<div class="store-meta">' +
      '<span><i class="fa-solid fa-clock"></i>' + D.esc(s.hours) + '</span>' +
      '<span><i class="fa-solid fa-location-dot"></i>' + D.esc(s.location) + '</span>' +
      '<span><i class="fa-solid fa-star" style="color:var(--gold)"></i>' + s.rating + '</span>' +
      '</div>' +
      '<div class="store-foot">' +
      '<button class="btn btn-gold btn-sm" data-view-store="' + s.id + '"><i class="fa-solid fa-eye"></i> View Store</button>' +
      '<button class="btn btn-ghost btn-sm" data-call-store="' + s.id + '"><i class="fa-solid fa-phone"></i></button>' +
      '</div></div></article>';
  }
  function filter() {
    var q = state.q.toLowerCase();
    var list = D.stores().filter(function (s) {
      var okQ = !q || (s.name + ' ' + s.cat + ' ' + s.group + ' ' + s.desc + ' ' + s.location).toLowerCase().indexOf(q) !== -1;
      var okG = state.group === 'All' || s.group === state.group;
      var okF = state.floor === 'All' || s.floor === state.floor;
      return okQ && okG && okF;
    });
    if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (state.sort === 'floor') list.sort(function (a, b) { return a.floor.localeCompare(b.floor); });
    if (state.sort === 'rating') list.sort(function (a, b) { return b.rating - a.rating; });
    return list;
  }
  function render() {
    var grid = document.getElementById('storeGrid');
    var count = document.getElementById('storeCount');
    var list = filter();
    if (grid) {
      var total = list.length;
      var pages = Math.max(1, Math.ceil(total / state.per));
      state.page = Math.min(state.page, pages);
      var slice = list.slice((state.page - 1) * state.per, state.page * state.per);
      if (!slice.length) {
        grid.innerHTML = '<div class="col-12"><div class="empty-state"><div class="e-icon"><i class="fa-solid fa-store-slash"></i></div>' +
          '<b>No stores found</b><p>Adjust your search or filters \u2014 30 boutiques await.</p></div></div>';
      } else {
        grid.innerHTML = slice.map(function (s, i) {
          return '<div class="col-md-6 col-xl-4">' +
            card(s).replace('reveal">', 'reveal" style="animation-delay:' + (i % 3) * 0.08 + 's">') + '</div>';
        }).join('');
      }
      if (count) count.innerHTML = '<b>' + total + '</b> boutique' + (total === 1 ? '' : 's');
      renderPagination(pages);
      wireCards();
      if (window.MR && window.MR.bindImgFallback) window.MR.bindImgFallback(grid);
      bindReveal();
    }
  }
  function bindReveal() {
    document.querySelectorAll('.reveal').forEach(function (e) {
      if (e.getBoundingClientRect().top < window.innerHeight * 0.95) e.classList.add('in');
    });
  }
  function renderPagination(pages) {
    var host = document.getElementById('storePager');
    if (!host) return;
    if (pages <= 1) { host.innerHTML = ''; return; }
    var html = '';
    for (var i = 1; i <= pages; i++) {
      if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - state.page) > 1) {
        if (html.slice(-9) !== '&hellip;</button>') html += '<span class="pg-ellipsis">&hellip;</span>';
        continue;
      }
      html += '<button class="pg-btn' + (i === state.page ? ' active' : '') + '" data-pg="' + i + '">' + i + '</button>';
    }
    host.innerHTML = html;
    host.querySelectorAll('[data-pg]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.page = +b.getAttribute('data-pg');
        render();
        var top = document.getElementById('storeGrid');
        if (top) window.scrollTo({ top: top.offsetTop - 140, behavior: 'smooth' });
      });
    });
  }
  function wireCards() {
    document.querySelectorAll('[data-view-store]').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(btn.getAttribute('data-view-store')); });
    });
    document.querySelectorAll('[data-call-store]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var s = find(btn.getAttribute('data-call-store'));
        if (s) window.MR.toast('Calling ' + s.name, s.phone + ' \u2014 connecting you now.', 'success');
      });
    });
  }
  function find(id) {
    var out = null;
    D.stores().forEach(function (s) { if (s.id === id) out = s; });
    return out;
  }
  function openModal(id) {
    var s = find(id);
    if (!s) return;
    var modal = document.getElementById('storeModal');
    if (!modal) return;
    var open = s.status === 'open' && D.isOpenNow(s.hours);
    var statusBadge = open
      ? '<span class="badge badge-open">Open Now</span>'
      : '<span class="badge badge-coming">' + (s.status === 'coming' ? 'Coming Soon' : 'Closed') + '</span>';
    modal.querySelector('.modal-content').innerHTML =
      '<div class="modal-header"><h5 class="modal-title">' + D.esc(s.name) + '</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="m-head-banner"><img src="' + img(s.img) + '" alt="' + D.esc(s.name) + '"><div class="mhd-shade"></div>' +
      '<div style="position:absolute;top:16px;right:16px;z-index:3">' + statusBadge + '</div></div>' +
      '<div class="modal-body">' +
      '<span style="font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);font-weight:800">' + D.esc(s.group) + ' \u00B7 ' + D.esc(s.cat) + '</span>' +
      '<h2 style="font-size:1.9rem;margin:.3rem 0 1rem;font-family:var(--font-display)">' + D.esc(s.name) + '</h2>' +
      '<p class="detail-desc">' + D.esc(s.desc) + '</p>' +
      '<div class="detail-grid" style="margin-top:20px">' +
      '<div class="dg-item"><i class="fa-solid fa-location-dot"></i><div><b>Location</b><span>' + D.esc(s.location) + ' \u00B7 Level ' + D.esc(s.floor) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-clock"></i><div><b>Opening Hours</b><span>' + D.esc(s.hours) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-phone"></i><div><b>Boutique</b><span>' + D.esc(s.phone) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-star"></i><div><b>Guest Rating</b><span>' + s.rating + ' / 5</span></div></div>' +
      '</div></div>' +
      '<div class="modal-footer"><span style="font-size:.78rem;color:var(--muted)"><i class="fa-solid fa-circle-info"></i> Concierge can arrange a private appointment.</span>' +
      '<button class="btn btn-gold btn-sm" data-mr-call="' + s.id + '"><i class="fa-solid fa-phone"></i> Call the boutique</button></div>';
    window.bootstrap.Modal.getOrCreateInstance(modal).show();
    var callBtn = modal.querySelector('[data-mr-call]');
    if (callBtn) callBtn.addEventListener('click', function () {
      window.MR.toast('Boutique line', s.phone + ' \u2014 our concierge will connect you.', 'success');
    });
    if (window.MR) window.MR.bindImgFallback(modal);
  }
  function init() {
    var searchEl = document.getElementById('storeSearch');
    if (searchEl) searchEl.addEventListener('input', function () { state.q = searchEl.value; state.page = 1; render(); });
    var sortEl = document.getElementById('storeSort');
    if (sortEl) sortEl.addEventListener('change', function () { state.sort = sortEl.value; state.page = 1; render(); });
    document.querySelectorAll('#groupPills .pill').forEach(function (p) {
      p.addEventListener('click', function () {
        document.querySelectorAll('#groupPills .pill').forEach(function (x) { x.classList.remove('active'); });
        p.classList.add('active');
        state.group = p.getAttribute('data-group');
        state.page = 1; render();
      });
    });
    document.querySelectorAll('#floorPills .pill').forEach(function (p) {
      p.addEventListener('click', function () {
        document.querySelectorAll('#floorPills .pill').forEach(function (x) { x.classList.remove('active'); });
        p.classList.add('active');
        state.floor = p.getAttribute('data-floor');
        state.page = 1; render();
      });
    });
    var qp = new URLSearchParams(location.search);
    var q0 = qp.get('q');
    var s0 = qp.get('store');
    if (q0 && searchEl) { searchEl.value = q0; state.q = q0; }
    render();
    if (s0) setTimeout(function () { openModal(s0); }, 420);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
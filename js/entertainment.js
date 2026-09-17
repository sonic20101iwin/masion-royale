/* =========================================================================
   MAISON ROYALE — Entertainment
   Venue gallery (cinema, gaming, family, live, lounges, outdoor) with
   category filters and a details modal.
   ========================================================================= */
(function () {
  'use strict';
  var D = window.MallData;
  var IMG = window.MR_IMG || {};
  if (!D) return;

  var state = { cat: 'All' };
  function img(key) { return D.IMG[key] || IMG[key] || ''; }
  function list() {
    return D.entertainment().filter(function (v) {
      return state.cat === 'All' || v.cat === state.cat;
    });
  }
  function card(v) {
    return '<article class="card-lux rest-card reveal">' +
      '<div class="media" style="aspect-ratio:16/10"><img src="' + img(v.img) + '" alt="' + D.esc(v.name) + '" loading="lazy"></div>' +
      '<div class="rest-body">' +
      '<div class="rest-head"><div><span class="rest-cuisine">' + D.esc(v.cat) + '</span><h3>' + D.esc(v.name) + '</h3></div>' +
      '<span class="badge badge-ghost">Lv ' + D.esc(v.floor) + '</span></div>' +
      '<p>' + D.esc(v.desc) + '</p>' +
      '<div class="rest-meta">' +
      '<span><i class="fa-solid fa-clock"></i>' + D.esc(v.hours) + '</span>' +
      '<span><i class="fa-solid fa-phone"></i>' + D.esc(v.phone) + '</span></div>' +
      '<div class="rest-foot">' +
      '<button class="btn btn-gold btn-sm" data-view-venue="' + v.id + '"><i class="fa-solid fa-eye"></i> View Venue</button>' +
      '</div></div></article>';
  }
  function render() {
    var grid = document.getElementById('entGrid');
    var count = document.getElementById('entCount');
    if (!grid) return;
    var listAll = list();
    if (!listAll.length) {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><div class="e-icon"><i class="fa-solid fa-film"></i></div>' +
        '<b>No venues found</b><p>New experiences are being curated \u2014 check back soon.</p></div></div>';
    } else {
      grid.innerHTML = listAll.map(function (v, i) {
        return '<div class="col-md-6 col-lg-4">' + card(v).replace('reveal">', 'reveal" style="animation-delay:' + (i % 3) * 0.08 + 's">') + '</div>';
      }).join('');
      document.querySelectorAll('#entGrid [data-view-venue]').forEach(function (b) {
        b.addEventListener('click', function () { openModal(b.getAttribute('data-view-venue')); });
      });
    }
    if (count) count.innerHTML = '<b>' + listAll.length + '</b> venue' + (listAll.length === 1 ? '' : 's');
    if (window.MR) window.MR.bindImgFallback(grid);
    document.querySelectorAll('#entGrid .reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.98) el.classList.add('in');
    });
  }
  function find(id) { var out = null; D.entertainment().forEach(function (v) { if (v.id === id) out = v; }); return out; }
  function openModal(id) {
    var v = find(id);
    var modal = document.getElementById('entModal');
    if (!v || !modal) return;
    modal.querySelector('.modal-content').innerHTML =
      '<div class="modal-header"><h5 class="modal-title">' + D.esc(v.name) + '</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="m-head-banner"><img src="' + img(v.img) + '" alt="' + D.esc(v.name) + '"><div class="mhd-shade"></div>' +
      '<div style="position:absolute;top:16px;right:16px;z-index:3"><span class="badge badge-gold">' + D.esc(v.cat) + '</span></div></div>' +
      '<div class="modal-body">' +
      '<span style="font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);font-weight:800">' + D.esc(v.cat) + ' \u00B7 Level ' + D.esc(v.floor) + '</span>' +
      '<h2 style="font-size:1.9rem;margin:.3rem 0 1rem;font-family:var(--font-display)">' + D.esc(v.name) + '</h2>' +
      '<p class="detail-desc">' + D.esc(v.desc) + '</p>' +
      '<div class="detail-grid" style="margin-top:20px">' +
      '<div class="dg-item"><i class="fa-solid fa-clock"></i><div><b>Hours</b><span>' + D.esc(v.hours) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-layer-group"></i><div><b>Floor</b><span>Level ' + D.esc(v.floor) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-phone"></i><div><b>Venue line</b><span>' + D.esc(v.phone) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-crown"></i><div><b>Royale Card</b><span>Priority seating &amp; previews</span></div></div>' +
      '</div></div>' +
      '<div class="modal-footer"><span style="font-size:.78rem;color:var(--muted)"><i class="fa-solid fa-ticket"></i> Tickets &amp; bookings via the concierge.</span>' +
      '<button class="btn btn-gold btn-sm" data-book-venue="' + v.id + '" data-bs-dismiss="modal"><i class="fa-solid fa-ticket"></i> Book through Concierge</button></div>';
    window.bootstrap.Modal.getOrCreateInstance(modal).show();
    var bk = modal.querySelector('[data-book-venue]');
    if (bk) bk.addEventListener('click', function () { window.MR.toast('Booking requested', v.name + ' \u2014 the concierge will arrange your visit.', 'success'); });
    if (window.MR) window.MR.bindImgFallback(modal);
  }
  function init() {
    document.querySelectorAll('#entCat .pill').forEach(function (p) {
      p.addEventListener('click', function () {
        document.querySelectorAll('#entCat .pill').forEach(function (x) { x.classList.remove('active'); });
        p.classList.add('active');
        state.cat = p.getAttribute('data-cat');
        render();
      });
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
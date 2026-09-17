/* =========================================================================
   MAISON ROYALE — Events
   Filterable event grid + detailed event modal with countdown + booking.
   ========================================================================= */
(function () {
  'use strict';
  var D = window.MallData;
  var IMG = window.MR_IMG || {};
  if (!D) return;

  var state = { cat: 'All' };

  function img(key) { return D.IMG[key] || IMG[key] || ''; }
  function monthName(d) { return new Date(d).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(); }
  function dayNum(d) { return new Date(d).getDate(); }

  function card(e) {
    return '' +
      '<article class="card-lux event-card reveal">' +
      '<div class="media"><img src="' + img(e.img) + '" alt="' + D.esc(e.title) + '" loading="lazy">' +
      '<div class="event-date"><span>' + monthName(e.date) + '</span><b>' + dayNum(e.date) + '</b></div>' +
      (e.featured ? '<div class="prod-save"><span class="badge badge-gold">Featured</span></div>' : '') +
      '</div>' +
      '<div class="event-body">' +
      '<span class="store-cat" style="font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);font-weight:800">' + D.esc(e.cat) + '</span>' +
      '<h3>' + D.esc(e.title) + '</h3>' +
      '<div class="event-meta">' +
      '<span><i class="fa-solid fa-calendar"></i>' + D.fmtDate(e.date) + ' \u00B7 ' + D.esc(e.time) + '</span>' +
      '<span><i class="fa-solid fa-location-dot"></i>' + D.esc(e.location) + '</span>' +
      '<span><i class="fa-solid fa-users"></i>' + e.capacity.toLocaleString('en-US') + ' guests</span>' +
      '</div>' +
      '<p class="desc">' + D.esc(e.desc) + '</p>' +
      '<div class="event-foot">' +
      '<button class="btn btn-gold btn-sm" data-view-event="' + e.id + '"><i class="fa-solid fa-arrow-right"></i> View Event</button>' +
      '<button class="btn btn-ghost btn-sm" data-book-event="' + e.id + '"><i class="fa-solid fa-ticket"></i> Book</button>' +
      '</div></div></article>';
  }

  function render() {
    var grid = document.getElementById('eventGrid');
    var count = document.getElementById('eventCount');
    if (!grid) return;
    var list = D.events().filter(function (e) {
      return e.status === 'published' && (state.cat === 'All' || e.cat === state.cat);
    });
    if (!list.length) {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><div class="e-icon"><i class="fa-solid fa-calendar-xmark"></i></div>' +
        '<b>No upcoming events</b><p>New experiences are being prepared \u2014 check back soon.</p></div></div>';
      if (count) count.innerHTML = '<b>0</b> events';
    } else {
      grid.innerHTML = list.map(function (e, i) {
        return '<div class="col-lg-6">' + card(e).replace('reveal">', 'reveal" style="animation-delay:' + (i % 2) * 0.1 + 's">') + '</div>';
      }).join('');
      if (count) count.innerHTML = '<b>' + list.length + '</b> event' + (list.length === 1 ? '' : 's');
      wire();
      if (window.MR) window.MR.bindImgFallback(grid);
      setTimeout(function () {
        document.querySelectorAll('#eventGrid .reveal').forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        });
      }, 40);
    }
  }
  function find(id) { var out = null; D.events().forEach(function (e) { if (e.id === id) out = e; }); return out; }

  function openModal(id) {
    var e = find(id);
    if (!e) return;
    var modal = document.getElementById('eventModal');
    if (!modal) return;
    modal.querySelector('.modal-content').innerHTML =
      '<div class="modal-header"><h5 class="modal-title">' + D.esc(e.title) + '</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="m-head-banner"><img src="' + img(e.img) + '" alt="' + D.esc(e.title) + '"><div class="mhd-shade"></div>' +
      '<div style="position:absolute;top:16px;right:16px;z-index:3"><span class="badge badge-gold">' + D.esc(e.cat) + '</span></div></div>' +
      '<div class="modal-body">' +
      '<p class="detail-desc">' + D.esc(e.desc) + '</p>' +
      '<h6 style="font-size:.7rem;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);font-weight:800;margin:18px 0 10px">Countdown</h6>' +
      '<div class="countdown" data-countdown="' + e.date + 'T' + e.time + ':00"></div>' +
      '<div class="detail-grid" style="margin-top:22px">' +
      '<div class="dg-item"><i class="fa-solid fa-calendar"></i><div><b>Date</b><span>' + D.fmtDate(e.date) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-clock"></i><div><b>Time</b><span>' + D.esc(e.time) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-location-dot"></i><div><b>Location</b><span>' + D.esc(e.location) + '</span></div></div>' +
      '<div class="dg-item"><i class="fa-solid fa-users"></i><div><b>Capacity</b><span>' + e.capacity.toLocaleString('en-US') + ' guests</span></div></div>' +
      '</div></div>' +
      '<div class="modal-footer"><span style="font-size:.78rem;color:var(--muted)"><i class="fa-solid fa-ticket"></i> Complimentary for Royale members</span>' +
      '<button class="btn btn-gold btn-sm" data-book-event="' + e.id + '" data-bs-dismiss="modal"><i class="fa-solid fa-ticket"></i> Reserve a seat</button></div>';
    window.bootstrap.Modal.getOrCreateInstance(modal).show();
    var cd = modal.querySelector('[data-countdown]');
    if (cd) startCountdown(cd);
    modal.querySelectorAll('[data-book-event]').forEach(function (b) {
      b.addEventListener('click', function () {
        window.MR.toast('Reservation requested', D.esc(e.title) + ' \u2014 our concierge will confirm shortly.', 'success');
      });
    });
    if (window.MR) window.MR.bindImgFallback(modal);
  }

  function startCountdown(el) {
    var target = new Date(el.getAttribute('data-countdown')).getTime();
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { el.innerHTML = '<span class="text-muted" style="font-size:.9rem">Event day is here</span>'; return; }
      var d = Math.floor(diff / 864e5);
      var h = Math.floor(diff % 864e5 / 36e5);
      var m = Math.floor(diff % 36e5 / 6e4);
      var s = Math.floor(diff % 6e4 / 1e3);
      var pad = function (n) { return n < 10 ? '0' + n : n; };
      el.innerHTML =
        '<span class="cd-block"><b>' + d + '</b><span>Days</span></span>' +
        '<span class="cd-block"><b>' + pad(h) + '</b><span>Hrs</span></span>' +
        '<span class="cd-block"><b>' + pad(m) + '</b><span>Min</span></span>' +
        '<span class="cd-block"><b>' + pad(s) + '</b><span>Sec</span></span>';
    }
    tick();
    setInterval(tick, 1000);
  }

  function wire() {
    document.querySelectorAll('[data-view-event]').forEach(function (b) {
      b.addEventListener('click', function () { openModal(b.getAttribute('data-view-event')); });
    });
    document.querySelectorAll('[data-book-event]').forEach(function (b) {
      b.addEventListener('click', function () {
        var e = find(b.getAttribute('data-book-event'));
        window.MR.toast('Reservation requested', (e ? e.title : 'Event') + ' \u2014 our concierge will confirm shortly.', 'success');
      });
    });
  }

  function init() {
    var qp = new URLSearchParams(location.search);
    var e0 = qp.get('event');
    document.querySelectorAll('#eventCat .pill').forEach(function (p) {
      p.addEventListener('click', function () {
        document.querySelectorAll('#eventCat .pill').forEach(function (x) { x.classList.remove('active'); });
        p.classList.add('active');
        state.cat = p.getAttribute('data-cat');
        render();
      });
    });
    render();
    if (e0) setTimeout(function () { openModal(e0); }, 420);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
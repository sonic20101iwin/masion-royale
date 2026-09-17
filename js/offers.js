/* =========================================================================
   MAISON ROYALE — Exclusive Offers
   Badge filter, expiry countdowns and redeem flow.
   ========================================================================= */
(function () {
  'use strict';
  var D = window.MallData;
  var IMG = window.MR_IMG || {};
  if (!D) return;

  var state = { badge: 'All' };
  function img(key) { return D.IMG[key] || IMG[key] || ''; }

  function card(o) {
    var days = D.daysUntil(o.end);
    return '' +
      '<article class="card-lux offer-card reveal">' +
      '<div class="media"><img src="' + img(o.img) + '" alt="' + D.esc(o.title) + '" loading="lazy">' +
      '<div class="offer-disc"><span>' + o.discount + '%<small>off</small></span></div>' +
      '<div class="offer-badge-row"><span class="badge badge-vip">' + D.esc(o.badge || 'OFFER') + '</span></div>' +
      '</div>' +
      '<div class="offer-body">' +
      '<span class="store-cat" style="font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);font-weight:800">' + D.esc(o.store) + '</span>' +
      '<h3>' + D.esc(o.title) + '</h3>' +
      '<p>' + D.esc(o.desc) + '</p>' +
      '<div class="offer-meta">' +
      '<span><i class="fa-solid fa-calendar-check"></i> Ends ' + D.fmtDate(o.end) + '</span>' +
      '<span class="offer-count"><i class="fa-solid fa-hourglass-half"></i> ' + days + ' days left</span>' +
      '</div>' +
      '<div class="offer-foot">' +
      '<button class="btn btn-gold btn-sm" data-claim="' + o.id + '"><i class="fa-solid fa-ticket"></i> Claim Offer</button>' +
      '<button class="btn btn-ghost btn-sm" data-link-store="' + o.id + '">View Store</button>' +
      '</div></div></article>';
  }

  function render() {
    var grid = document.getElementById('offerGrid');
    var count = document.getElementById('offerCount');
    if (!grid) return;
    var list = D.offers().filter(function (o) {
      return o.status === 'active' && (state.badge === 'All' || o.badge === state.badge);
    });
    if (!list.length) {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><div class="e-icon"><i class="fa-solid fa-tags"></i></div>' +
        '<b>No promotions available</b><p>New privileges are being prepared \u2014 check back soon.</p></div></div>';
      if (count) count.innerHTML = '<b>0</b> offers';
    } else {
      grid.innerHTML = list.map(function (o, i) {
        return '<div class="col-md-6 col-xl-4">' + card(o).replace('reveal">', 'reveal" style="animation-delay:' + (i % 3) * 0.08 + 's">') + '</div>';
      }).join('');
      if (count) count.innerHTML = '<b>' + list.length + '</b> live offer' + (list.length === 1 ? '' : 's');
      wire();
      if (window.MR) window.MR.bindImgFallback(grid);
      setTimeout(function () {
        document.querySelectorAll('#offerGrid .reveal').forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        });
      }, 40);
    }
  }

  function find(id) { var out = null; D.offers().forEach(function (o) { if (o.id === id) out = o; }); return out; }

  function wire() {
    document.querySelectorAll('[data-claim]').forEach(function (b) {
      b.addEventListener('click', function () {
        var o = find(b.getAttribute('data-claim'));
        b.innerHTML = '<i class="fa-solid fa-circle-check"></i> Claimed';
        b.disabled = true;
        window.MR.toast('Offer claimed', o.title + ' \u2014 show your Royale Card at ' + o.store + '.', 'success');
      });
    });
    document.querySelectorAll('[data-link-store]').forEach(function (b) {
      b.addEventListener('click', function () {
        window.MR.toast('Opening the directory', 'Browse every boutique on the Explore page.', 'success');
        setTimeout(function () { window.location.href = 'stores.html?q=' + encodeURIComponent(o.store); }, 600);
      });
    });
  }

  function init() {
    var qp = new URLSearchParams(location.search);
    var b0 = qp.get('badge');
    if (b0) {
      state.badge = b0;
      document.querySelectorAll('#offerCat .pill').forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-badge') === b0);
      });
    }
    document.querySelectorAll('#offerCat .pill').forEach(function (p) {
      p.addEventListener('click', function () {
        document.querySelectorAll('#offerCat .pill').forEach(function (x) { x.classList.remove('active'); });
        p.classList.add('active');
        state.badge = p.getAttribute('data-badge');
        render();
      });
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
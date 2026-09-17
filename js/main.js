/* =========================================================================
   MAISON ROYALE — Main Site Script
   Navbar, drawer, search overlay, newsletter, toasts, reveal, countdowns.
   ========================================================================= */
(function (global) {
  'use strict';

  var D = global.MallData;
  var ROOT = (typeof document !== 'undefined' && document.body && document.body.getAttribute('data-root')) || '';
  var IMG = global.MR_IMG || {};

  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ----------------------------- toast helper ----------------------------- */
  global.MR = global.MR || {};
  function toast(title, msg, type) {
    var stack = qs('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    var el = document.createElement('div');
    el.className = 'toast-lux ' + (type || '');
    el.innerHTML =
      '<span class="t-ic"><i class="fa-solid ' + (type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-bell') + '"></i></span>' +
      '<div><b></b><p></p></div>' +
      '<button class="t-close" aria-label="Dismiss"><i class="fa-solid fa-xmark"></i></button>';
    el.querySelector('b').textContent = title;
    el.querySelector('p').textContent = msg || '';
    el.querySelector('.t-close').addEventListener('click', function () { dismiss(el); });
    stack.appendChild(el);
    setTimeout(function () { dismiss(el); }, 4200);
  }
  function dismiss(el) {
    if (!el || el.classList.contains('leaving')) return;
    el.classList.add('leaving');
    el.addEventListener('animationend', function () { if (el.parentNode) el.parentNode.removeChild(el); });
  }
  global.MR.toast = toast;

  /* ---------------------------- image fallback ---------------------------- */
  function bindImgFallback(scope) {
    qsa('img', scope || document).forEach(function (img) {
      if (img.dataset.bound === '1') return;
      img.dataset.bound = '1';
      img.addEventListener('error', function () {
        var media = img.closest('.media');
        if (media) media.classList.add('imgoff');
        img.style.display = 'none';
      });
    });
  }

  /* ------------------------------- navbar -------------------------------- */
  function initNavbar() {
    var nav = qs('.navbar-lux');
    if (nav) {
      function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 30); }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page === '') page = 'index.html';
    qsa('.nav-menu a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === page) a.classList.add('active');
    });

    var drawer = qs('.mobile-drawer');
    var openBtn = qs('[data-drawer-open]');
    if (drawer && openBtn) {
      openBtn.addEventListener('click', function () { drawer.classList.add('open'); document.body.classList.add('lock'); });
      qsa('[data-drawer-close]').forEach(function (b) {
        b.addEventListener('click', function () { drawer.classList.remove('open'); document.body.classList.remove('lock'); });
      });
      var back = qs('.drawer-backdrop', drawer);
      if (back) back.addEventListener('click', function () { drawer.classList.remove('open'); document.body.classList.remove('lock'); });
    }

    var fav = qs('[data-fav]');
    if (fav) {
      fav.addEventListener('click', function () {
        var count = 0;
        try { count = +(localStorage.getItem('mr_favs') || 0); } catch (e) {}
        count = (count + 1) % 13;
        try { localStorage.setItem('mr_favs', count); } catch (e) {}
        var dot = qs('.fav-dot', fav);
        if (count) {
          if (!dot) { fav.classList.add('has-dot'); fav.insertAdjacentHTML('beforeend', '<span class="dot fav-dot"></span>'); }
        } else if (dot) { dot.remove(); }
        toast(count ? 'Added to your wishlist' : 'Wishlist cleared', 'Your curated list is kept in this browser.', 'success');
      });
    }
    var tb = qs('.topbar-phone');
    if (tb && D && D.SITE) tb.textContent = D.SITE.phone;
    var tbHours = qs('.topbar-hours');
    if (tbHours && D && D.SITE) tbHours.innerHTML = D.SITE.hours;
    var year = qs('.footer-year');
    if (year) year.textContent = new Date().getFullYear();
  }
  /* --------------------------- search overlay --------------------------- */
  function initSearch() {
    var overlay = qs('.search-overlay');
    var input = qs('.so-input');
    var body = qs('.so-body');
    if (!overlay) return;
    var all = buildIndex();

    qsa('[data-search-open]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    qsa('.so-close, [data-search-close]').forEach(function (b) {
      b.addEventListener('click', function () { close(); });
    });
    var back = qs('.so-backdrop', overlay);
    if (back) back.addEventListener('click', close);

    function open() {
      overlay.classList.add('open');
      document.body.classList.add('lock');
      setTimeout(function () { input.focus(); }, 120);
      if (input.value.trim()) render(input.value.trim()); else renderEmpty();
    }
    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('lock');
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    });
    input.addEventListener('input', function () {
      var v = input.value.trim();
      if (!v) { renderEmpty(); return; }
      render(v);
    });

    function buildIndex() {
      var idx = { Stores: [], Restaurants: [], Events: [], Offers: [], Services: [], Pages: [] };
      if (!D) return idx;
      D.stores().forEach(function (s) {
        idx.Stores.push({ title: s.name, sub: s.cat + ' \u00B7 ' + s.group, icon: 'fa-store', url: 'pages/stores.html', q: s.name + ' ' + s.cat + ' ' + s.group + ' ' + s.desc });
      });
      D.restaurants().forEach(function (r) {
        idx.Restaurants.push({ title: r.name, sub: r.cuisine + ' \u00B7 Level ' + r.floor, icon: 'fa-utensils', url: 'pages/dining.html', q: r.name + ' ' + r.cuisine + ' ' + r.desc });
      });
      D.events().forEach(function (e) {
        if (e.status === 'published') idx.Events.push({ title: e.title, sub: D.fmtDate(e.date) + ' \u00B7 ' + e.location, icon: 'fa-calendar', url: 'pages/events.html', q: e.title + ' ' + e.cat + ' ' + e.location });
      });
      D.offers().forEach(function (o) {
        if (o.status === 'active') idx.Offers.push({ title: o.title, sub: o.store + ' \u00B7 up to ' + o.discount + '% off', icon: 'fa-tag', url: 'pages/offers.html', q: o.title + ' ' + o.store });
      });
      D.SERVICES.forEach(function (s) {
        idx.Services.push({ title: s.title, sub: s.desc, icon: s.icon, url: 'pages/about.html', q: s.title + ' ' + s.desc });
      });
      idx.Pages = [
        { title: 'The Destination', sub: 'Home of the ultimate luxury experience', icon: 'fa-building', url: 'index.html', q: 'home hero mall boutique' },
        { title: 'Fashion', sub: 'Editorial curated collections', icon: 'fa-shirt', url: 'pages/fashion.html', q: 'fashion clothes designer' },
        { title: 'Store Directory', sub: 'Browse every boutique', icon: 'fa-store', url: 'pages/stores.html', q: 'directory stores floors' },
        { title: 'Dining', sub: 'Twelve world-class tables', icon: 'fa-utensils', url: 'pages/dining.html', q: 'restaurant food' },
        { title: 'Entertainment', sub: 'Cinema, gaming, live and more', icon: 'fa-film', url: 'pages/entertainment.html', q: 'cinema entertainment' },
        { title: 'Events', sub: 'What\u2019s happening at the palace', icon: 'fa-calendar', url: 'pages/events.html', q: 'events shows' },
        { title: 'Offers', sub: 'Exclusive promotions', icon: 'fa-tag', url: 'pages/offers.html', q: 'offers promotions' },
        { title: 'VIP Experience', sub: 'Beyond first class', icon: 'fa-crown', url: 'pages/about.html', q: 'vip concierge valet' },
        { title: 'Contact & Location', sub: 'Find us or write to us', icon: 'fa-envelope', url: 'pages/contact.html', q: 'contact map address' }
      ];
      return idx;
    }

    function render(q) {
      var lowered = q.toLowerCase();
      var total = 0;
      var html = '';
      Object.keys(all).forEach(function (cat) {
        var hits = all[cat].filter(function (item) {
          return (item.q || item.title + ' ' + item.sub).toLowerCase().indexOf(lowered) !== -1;
        });
        if (!hits.length) return;
        total += hits.length;
        html += '<div class="so-cat">' + cat + '</div><div class="so-results">';
        hits.slice(0, 5).forEach(function (h) {
          html += '<a class="so-result" href="' + ROOT + h.url + '"><span class="r-ic"><i class="fa-solid ' + h.icon + '"></i></span><span><b>' + D.esc(h.title) + '</b><span>' + D.esc(h.sub) + '</span></span></a>';
        });
        html += '</div>';
      });
      if (!total) {
        body.innerHTML =
          '<div class="so-empty"><i class="fa-solid fa-magnifying-glass"></i><b>No search results</b>' +
          '<p>Try &ldquo;Chrono Paris&rdquo;, &ldquo;sushi&rdquo;, &ldquo;fashion show&rdquo; or &ldquo;valet&rdquo;.</p>' +
          '<p style="font-size:.78rem">Search was for &lsquo;' + D.esc(q) + '&rsquo;</p></div>';
      } else {
        body.innerHTML = '<div class="so-cat" style="padding-top:18px">' + total + ' result' + (total > 1 ? 's' : '') + '</div>' + html;
      }
    }
    function renderEmpty() {
      body.innerHTML =
        '<div class="so-empty"><i class="fa-solid fa-compass"></i><b>Search the palace</b><p>Stores, restaurants, events, offers, services and pages live here.</p></div>';
    }
    renderEmpty();
  }
  /* --------------------------- newsletter + misc --------------------------- */
  function initNewsletter() {
    qsa('[data-newsletter]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = qs('input[type=email]', form);
        var val = (input.value || '').trim();
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
        if (!ok) {
          input.classList.add('invalid');
          input.setAttribute('aria-invalid', 'true');
          var err = qs('.news-error', form);
          if (err) err.style.display = 'block';
          return;
        }
        input.classList.remove('invalid');
        var err = qs('.news-error', form);
        if (err) err.style.display = 'none';
        form.querySelector('button[type=submit]').disabled = true;
        form.querySelector('button[type=submit]').innerHTML = '<i class="fa-solid fa-circle-check"></i> Welcome';
        var note = qs('.news-note', form);
        if (note) note.innerHTML = '<i class="fa-solid fa-envelope-circle-check"></i> You\u2019re on the list \u2014 look for your first letter soon.';
        toast('Subscription confirmed', 'You are now part of the Maison Royale inner circle.', 'success');
      });
    });
  }

  /* --------------------------- reveal + counters --------------------------- */
  function initReveal() {
    var els = qsa('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }
  function initCounters() {
    var counters = qsa('[data-count]');
    if (!counters.length) return;
    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var dur = 1500, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { counters.forEach(animate); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ------------------------------ countdowns ------------------------------ */
  function initCountdowns() {
    qsa('[data-countdown]').forEach(function (el) {
      var target = new Date(el.getAttribute('data-countdown')).getTime();
      function tick() {
        var diff = target - Date.now();
        if (diff <= 0) { el.innerHTML = '<span>Ended</span>'; return; }
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
    });
  }
  /* ---------------------- open-now badges on store cards ---------------------- */
  function initOpenNow() {
    if (!D) return;
    qsa('[data-open-now]').forEach(function (el) {
      var id = el.getAttribute('data-open-now');
      var store = null;
      D.stores().forEach(function (s) { if (s.id === id) store = s; });
      if (!store) return;
      var open = D.isOpenNow(store.hours) && store.status === 'open';
      el.className = 'badge ' + (open ? 'badge-open' : 'badge-coming');
      el.innerHTML = open ? '<i class="fa-solid fa-circle" style="font-size:.42rem"></i> Open Now' : '<i class="fa-solid fa-clock"></i> Closed';
    });
  }

  /* ------------------------------ form helpers ------------------------------ */
  function initValidation() {
    qsa('form[data-validate]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var valid = true;
        qsa('[required]', form).forEach(function (field) {
          if (field.type === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim())) { markError(field, true); valid = false; }
            else markError(field, false);
          } else if (!field.value.trim()) { markError(field, true); valid = false; }
          else markError(field, false);
        });
        if (!valid) { e.preventDefault(); toast('Please review the form', 'Some required fields are missing or invalid.', 'error'); }
        else form.classList.add('was-valid');
      });
      qsa('[required]', form).forEach(function (field) {
        field.addEventListener('input', function () { markError(field, false); });
      });
    });
    function markError(field, on) {
      var g = field.closest('.form-group');
      if (g) g.classList.toggle('has-error', on);
      field.classList.toggle('invalid', on);
      if (on) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
    }
  }

  /* -------------------------------- dynamic triggers -------------------------------- */
  function wireDynamic() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-modal-open]');
      if (!t) return;
      var modal = qs('#' + t.getAttribute('data-modal-open'));
      if (modal && global.bootstrap) global.bootstrap.Modal.getOrCreateInstance(modal).show();
    });
  }

  /* ---------------------------------- init ---------------------------------- */
  function init() {
    bindImgFallback();
    initNavbar();
    initSearch();
    initNewsletter();
    initReveal();
    initCounters();
    initCountdowns();
    initOpenNow();
    initValidation();
    wireDynamic();
    if (global.bootstrap && global.bootstrap.Tooltip) {
      qsa('[data-bs-toggle="tooltip"]').forEach(function (el) { global.bootstrap.Tooltip.getOrCreateInstance(el); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.MR.bindImgFallback = bindImgFallback;
  global.MR.initOpenNow = initOpenNow;
})(typeof window !== 'undefined' ? window : this);
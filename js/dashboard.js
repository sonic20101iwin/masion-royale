/* =========================================================================
   MAISON ROYALE — Dashboard Shell & Table Engine
   Sidebar, header dropdowns, toasts, confirm modal, data tables.
   ========================================================================= */
(function (global) {
  'use strict';
  var D = global.MallData || {};
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* --------------------------------- toast --------------------------------- */
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

  /* -------------------------------- confirm -------------------------------- */
  var confirmCb = null;
  function confirmDialog(title, msg, onYes) {
    var modal = qs('#confirmModal');
    if (!modal) { if (onYes) onYes(); return; }
    confirmCb = onYes;
    qs('.confirm-title', modal).textContent = title;
    qs('.confirm-msg', modal).textContent = msg;
    global.bootstrap.Modal.getOrCreateInstance(modal).show();
  }
  global.MR.confirm = confirmDialog;
  document.addEventListener('click', function (e) {
    var yes = e.target.closest('.confirm-yes');
    var no = e.target.closest('.confirm-no');
    if (yes && confirmCb) { var cb = confirmCb; confirmCb = null; window.bootstrap.Modal.getOrCreateInstance(qs('#confirmModal')).hide(); cb(); }
    if (no && confirmCb) { confirmCb = null; window.bootstrap.Modal.getOrCreateInstance(qs('#confirmModal')).hide(); }
  });
  /* ------------------------------ table engine ------------------------------ */
  function createTable(cfg) {
    var state = { q: '', sortKey: cfg.sortKey || cfg.columns[0].key, sortDir: 1, page: 1 };
    var per = cfg.pageSize || 8;
    var tbody = qs(cfg.tbody);
    var pagerHost = qs(cfg.pager);
    var countEl = qs(cfg.count);

    function current() {
      var list = cfg.data().slice();
      var q = state.q.toLowerCase();
      if (q) list = list.filter(function (r) { return cfg.searchText(r).toLowerCase().indexOf(q) !== -1; });
      if (cfg.filter) list = cfg.filter(list, state);
      var k = state.sortKey;
      list.sort(function (a, b) {
        var av = cfg.columns[k] ? cfg.columns[k].value(a) : a[k];
        var bv = cfg.columns[k] ? cfg.columns[k].value(b) : b[k];
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * state.sortDir;
        return String(av).localeCompare(String(bv)) * state.sortDir;
      });
      return list;
    }

    function render() {
      var list = current();
      var pages = Math.max(1, Math.ceil(list.length / per));
      state.page = Math.min(state.page, pages);
      var slice = list.slice((state.page - 1) * per, state.page * per);
      if (!slice.length) {
        tbody.innerHTML = '<tr class="table-empty"><td colspan="' + cfg.columns.length + '">' +
          '<div class="empty-state"><div class="e-icon"><i class="fa-solid ' + (cfg.emptyIcon || 'fa-box-open') + '"></i></div>' +
          '<b>' + (cfg.emptyTitle || 'Nothing here yet') + '</b><p>' + (cfg.emptyMsg || '') + '</p></div></td></tr>';
      } else {
        tbody.innerHTML = slice.map(function (r) {
          var tds = cfg.columns.map(function (c) {
            return '<td data-label="' + (c.label || '') + '">' + (c.render(r, api) || '') + '</td>';
          }).join('');
          return '<tr>' + tds + '</tr>';
        }).join('');
      }
      if (countEl) countEl.innerHTML = '<b>' + list.length + '</b> ' + (cfg.noun || 'records');
      renderPager(pages, list.length);
      if (cfg.afterRender) cfg.afterRender(tbody);
    }

    function renderPager(pages, total) {
      if (!pagerHost) return;
      if (pages <= 1) { pagerHost.innerHTML = ''; return; }
      var html = '<span class="pg-info">Showing ' + ((state.page - 1) * per + 1) + '\u2013' + Math.min(state.page * per, total) + ' of ' + total + '</span>';
      for (var i = 1; i <= pages; i++) {
        if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - state.page) > 1) {
          if (html.slice(-9) !== '&hellip;</button>') html += '<span class="pg-ellipsis">&hellip;</span>';
          continue;
        }
        html += '<button class="pg-btn' + (i === state.page ? ' active' : '') + '" data-pg="' + i + '">' + i + '</button>';
      }
      pagerHost.innerHTML = html;
      qsa('[data-pg]', pagerHost).forEach(function (b) {
        b.addEventListener('click', function () { state.page = +b.getAttribute('data-pg'); render(); });
      });
    }

    function wireSort() {
      Object.keys(cfg.columns).forEach(function (key) {
        var th = qs(cfg.thead + ' [data-col="' + key + '"]');
        if (th) th.addEventListener('click', function () {
          if (state.sortKey === key) state.sortDir *= -1; else { state.sortKey = key; state.sortDir = 1; }
          qsa(cfg.thead + ' th').forEach(function (h) {
            var ic = h.querySelector('.sort-ic');
            if (ic) ic.remove();
          });
          th.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-chevron-' + (state.sortDir === 1 ? 'down' : 'up') + ' sort-ic" style="font-size:.6rem;color:var(--gold);margin-left:6px"></i>');
          render();
        });
      });
    }
    function wireSortB() {
      Object.keys(cfg.columns).forEach(function (key) {
        var th = qs(cfg.thead + ' [data-col="' + key + '"]');
        if (th) th.addEventListener('click', function () {
          if (state.sortKey === key) state.sortDir *= -1; else { state.sortKey = key; state.sortDir = 1; }
          qsa(cfg.thead + ' th').forEach(function (h) {
            var ic = h.querySelector('.sort-ic');
            if (ic) ic.remove();
          });
          var ic = th.querySelector('.sort-ic');
          if (ic) ic.remove();
          th.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-chevron-' + (state.sortDir === 1 ? 'down' : 'up') + ' sort-ic" style="font-size:.6rem;color:var(--gold);margin-left:6px"></i>');
          render();
        });
      });
    }

    var api = {
      refresh: render,
      state: state,
      data: current,
      setFilter: function () { state.page = 1; render(); }
    };
    var searchEl = qs(cfg.search);
    if (searchEl) searchEl.addEventListener('input', function () { state.q = searchEl.value; state.page = 1; render(); });
    if (cfg.onInit) cfg.onInit(api);
    wireSortB();
    render();
    return api;
  }
  global.MR.table = createTable;
  /* ---------------------------- shell + wire-up ---------------------------- */
  function initShell() {
    var shell = qs('.dash-shell');
    if (!shell) return;
    // collapse sidebar
    var collapseBtn = qs('[data-sidebar-collapse]');
    if (collapseBtn) collapseBtn.addEventListener('click', function () {
      shell.classList.toggle('sidebar-collapsed');
    });
    // mobile drawer
    var burger = qs('.dh-burger');
    var backdrop = qs('.dash-backdrop');
    if (burger) burger.addEventListener('click', function () { shell.classList.add('sidebar-open'); });
    if (backdrop) backdrop.addEventListener('click', function () { shell.classList.remove('sidebar-open'); });
    // active nav
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    qsa('.sd-links a[data-dpage]').forEach(function (a) {
      if (a.getAttribute('data-dpage') === page) a.classList.add('active');
    });

    // date selector text
    var ds = qs('.js-date-label');
    if (ds) {
      var now = new Date();
      var fmt = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' \u2013 ';
      var later = new Date(now.getTime() + 6 * 864e5);
      fmt += later.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      ds.textContent = fmt;
    }
    // notifications
    var notifBtn = qs('[data-notif-toggle]');
    if (notifBtn) notifBtn.addEventListener('click', function () {
      qsa('.dib-badge', notifBtn).forEach(function (b) { b.remove(); });
      setTimeout(function () { window.MR.toast('You\u2019re all caught up', 'No unread notifications.', 'success'); }, 300);
    });

    // header search jumps to relevant table or shows hint
    var hSearch = qs('#dashGlobalSearch');
    if (hSearch) hSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var v = hSearch.value.trim();
        if (v) window.MR.toast('Searching \u2018' + v + '\u2019', 'Check the data table below for matches.', 'success');
      }
    });

    // profile quick links
    var profile = qs('.dash-profile');
    if (profile) profile.addEventListener('click', function () {
      var dd = qs('.profile-dd', profile.parentElement);
      if (dd && window.bootstrap) window.bootstrap.Dropdown.getOrCreateInstance(profile.parentElement).toggle();
    });

    // year
    var year = qs('.js-dash-year');
    if (year) year.textContent = new Date().getFullYear();
  }

  function boot() {
    initShell();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(typeof window !== 'undefined' ? window : this);
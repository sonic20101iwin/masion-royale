/* =========================================================================
   MAISON ROYALE — Dashboard CRUD
   Stores / Products / Events / Offers management with modal forms + toasts.
   ========================================================================= */
(function (global) {
  'use strict';
  var D = global.MallData || {};
  var IMG = global.MR_IMG || {};
  var MR = global.MR || {};
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* -------------------------- shared modal helpers -------------------------- */
  function esc(v) { return D.esc ? D.esc(v) : String(v).replace(/</g, '&lt;'); }
  function img(key) { return (D.IMG && D.IMG[key]) || IMG[key] || ''; }
  function showModal(id) { if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(qs('#' + id)).show(); }
  function hideModal(id) { if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(qs('#' + id)).hide(); }

  function fill(formFields, row) {
    formFields.forEach(function (f) {
      var el = qs('#' + f.id);
      if (!el) return;
      var v = row ? row[f.prop] : (f.default || '');
      el.value = v == null ? '' : v;
      el.classList.remove('invalid');
      el.closest('.form-group') && el.closest('.form-group').classList.remove('has-error');
    });
    qsa('.js-img-preview').forEach(function (p) {
      var key = row ? (row.img || '') : '';
      p.src = img(key) || '';
      if (!p.src) { p.style.display = 'none'; } else { p.style.display = 'block'; }
    });
  }
  function collect(formFields) {
    var data = {};
    formFields.forEach(function (f) {
      var el = qs('#' + f.id);
      data[f.prop] = el ? el.value.trim() : '';
    });
    return data;
  }
  function validate(formFields) {
    var ok = true;
    formFields.forEach(function (f) {
      if (f.required !== false) {
        var el = qs('#' + f.id);
        if (!el || !el.value.trim()) {
          ok = false;
          if (el) { el.classList.add('invalid'); el.closest('.form-group') && el.closest('.form-group').classList.add('has-error'); }
        }
      }
    });
    if (!ok) MR.toast('Please review the form', 'Some required fields are missing.', 'error');
    return ok;
  }
  /* ------------------------- shared CRUD registry ------------------------- */
  var TABLES = {};
  function del(label, id, model) {
    model = model || label;
    MR.confirm(
      'Delete this ' + label + '?',
      'This will permanently remove it from the maison. This action cannot be undone.',
      function () {
        var cap = model.charAt(0).toUpperCase() + model.slice(1);
        var list = D[model + 's']().filter(function (r) { return r.id !== id; });
        D['save' + cap + 's'](list);
        MR.toast(label.charAt(0).toUpperCase() + label.slice(1) + ' deleted', 'It has been removed from the maison.', 'success');
        if (TABLES[model]) TABLES[model].refresh();
      }
    );
  }

  function bindImgPicker(formFields) {
    qsa('.js-img-input').forEach(function (input) {
      var prev = qs('.js-img-preview');
      input.addEventListener('input', function () {
        var key = input.value.trim();
        if (prev) { prev.src = img(key) || ''; prev.style.display = prev.src ? 'block' : 'none'; }
      });
    });
  }

  /* ------------------------------ status helper ------------------------------ */
  function statusBadge(val) {
    var map = {
      'open': ['ts-active', 'Open'], 'active': ['ts-active', 'Active'],
      'coming': ['ts-coming', 'Coming Soon'], 'draft': ['ts-draft', 'Draft'],
      'closed': ['ts-closed', 'Closed'], 'in-stock': ['ts-active', 'In Stock'],
      'limited': ['ts-limited', 'Limited'], 'low': ['ts-draft', 'Low Stock'], 'unavailable': ['ts-closed', 'Unavailable']
    };
    var m = map[val] || [map.draft[0], val];
    return '<span class="table-status ' + m[0] + '">' + m[1] + '</span>';
  }
  function actions(id, model, extra) {
    return '<div class="action-group">' +
      '<button class="act-btn" title="Edit" data-edit="' + id + '" data-model="' + model + '"><i class="fa-solid fa-pen"></i></button>' +
      '<button class="act-btn" title="Delete" data-del="' + id + '" data-model="' + model + '"><i class="fa-solid fa-trash"></i></button>' +
      '</div>';
  }
  /* =============================== STORES =============================== */
  function initStores() {
    var saveBtn = qs('#saveStoreBtn');
    var formFields = [
      { id: 'stName', prop: 'name' },
      { id: 'stGroup', prop: 'group' },
      { id: 'stCat', prop: 'cat' },
      { id: 'stFloor', prop: 'floor' },
      { id: 'stHours', prop: 'hours', required: false },
      { id: 'stPhone', prop: 'phone', required: false },
      { id: 'stLocation', prop: 'location', required: false },
      { id: 'stDesc', prop: 'desc', required: false },
      { id: 'stImg', prop: 'img', required: false },
      { id: 'stStatus', prop: 'status' }
    ];
    var editing = null;

    var t = global.MR.table({
      tbody: '#storesTbody', pager: '#storesPager', count: '#storesCount', search: '#storesSearch',
      thead: '#storesTable',
      sortKey: 'name', noun: 'stores',
      data: function () { return D.stores(); },
      searchText: function (r) { return r.name + ' ' + r.cat + ' ' + r.group + ' ' + r.location + ' ' + r.phone; },
      filter: function (list, state) {
        var g = (qs('#filterGroup') || {}).value;
        var f = (qs('#filterFloor') || {}).value;
        return list.filter(function (r) { return (g === 'all' || r.group === g) && (f === 'all' || r.floor === f); });
      },
      columns: [
        { key: 'name', label: 'Store', value: function (r) { return r.name; }, render: function (r) {
          return '<div class="dt-product"><img src="' + img(r.img) + '" alt="" loading="lazy"><div><b>' + esc(r.name) + '</b><span>' + esc(r.group) + ' \u00B7 ' + esc(r.location) + '</span></div></div>';
        } },
        { key: 'cat', label: 'Category', value: function (r) { return r.cat; }, render: function (r) { return esc(r.cat); } },
        { key: 'floor', label: 'Floor', value: function (r) { return r.floor; }, render: function (r) { return '<span class="badge badge-ghost">Lv ' + esc(r.floor) + '</span>'; } },
        { key: 'status', label: 'Status', value: function (r) { return r.status; }, render: function (r) { return statusBadge(r.status); } },
        { key: 'hours', label: 'Opening Hours', value: function (r) { return r.hours; }, render: function (r) { return '<span class="dt-cell-label">' + esc(r.hours) + '<small>' + esc(r.phone) + '</small></span>'; } },
        { key: '', label: 'Actions', value: function () { return ''; }, render: function (r) { return actions(r.id, 'store'); } }
      ],
      afterRender: function () {
        qsa('#storesTbody [data-edit]').forEach(function (b) { b.addEventListener('click', function () { openEdit(storeById(b.getAttribute('data-edit'))); }); });
        qsa('#storesTbody [data-del]').forEach(function (b) { b.addEventListener('click', function () { del('store', b.getAttribute('data-edit'), 'store'); }); });
      },
      emptyTitle: 'No stores found', emptyMsg: 'Try adjusting filters or add a new boutique.', emptyIcon: 'fa-store-slash'
    });
    TABLES.store = t;

    // filter wire-up
    ['filterGroup', 'filterFloor'].forEach(function (id) {
      var el = qs('#' + id);
      if (el) el.addEventListener('change', function () { t.setFilter(); });
    });

    function storeById(id) { var out = null; D.stores().forEach(function (s) { if (s.id === id) out = s; }); return out; }

    qs('#addStoreBtn').addEventListener('click', function () {
      editing = null;
      qs('#crudModalTitle').textContent = 'Add Store';
      fill(formFields, { group: 'Fashion', floor: 'G', status: 'open', img: 'retailStorefront' });
      qs('#crudSubmitLabel').textContent = 'Add Store';
      showModal('crudModal');
    });
    function openEdit(row) {
      if (!row) return;
      editing = row;
      qs('#crudModalTitle').textContent = 'Edit Store \u2014 ' + row.name;
      qs('#crudSubmitLabel').textContent = 'Update Store';
      fill(formFields, row);
      showModal('crudModal');
    }
    saveBtn.addEventListener('click', function () {
      if (!validate(formFields)) return;
      var data = collect(formFields);
      data.hours = data.hours || '10:00 \u2013 21:00';
      data.phone = data.phone || '+33 1 42 60 00 00';
      data.img = data.img || 'retailStorefront';
      var list = D.stores();
      if (editing) {
        Object.keys(data).forEach(function (k) { editing[k] = data[k]; });
        D.saveStores(list);
        MR.toast('Store updated', data.name + ' saved successfully.', 'success');
      } else {
        list.push(Object.assign({ id: D.uid('s'), rating: 4.5 }, data));
        D.saveStores(list);
        MR.toast('Store added', data.name + ' is now in the directory.', 'success');
      }
      hideModal('crudModal');
      t.refresh();
    });
    bindImgPicker(formFields);
  }
  /* =============================== PRODUCTS =============================== */
  function initProducts() {
    var saveBtn = qs('#saveProductBtn');
    var formFields = [
      { id: 'prName', prop: 'name' },
      { id: 'prBrand', prop: 'brand' },
      { id: 'prCat', prop: 'cat' },
      { id: 'prPrice', prop: 'price' },
      { id: 'prOld', prop: 'old', required: false },
      { id: 'prStock', prop: 'stock', required: false },
      { id: 'prImg', prop: 'img', required: false },
      { id: 'prStatus', prop: 'status' },
      { id: 'prDesc', prop: 'desc', required: false }
    ];
    var editing = null;

    var t = global.MR.table({
      tbody: '#productsTbody', pager: '#productsPager', count: '#productsCount', search: '#productsSearch',
      thead: '#productsTable', sortKey: 'name', noun: 'products',
      data: function () { return D.products(); },
      searchText: function (r) { return r.name + ' ' + r.brand + ' ' + r.cat + ' ' + r.desc; },
      filter: function (list) {
        var c = (qs('#filterCat') || {}).value;
        var b = (qs('#filterBrand') || {}).value;
        var s = (qs('#filterStatus') || {}).value;
        return list.filter(function (r) {
          return (c === 'all' || r.cat === c) && (b === 'all' || r.brand === b) && (s === 'all' || r.status === s);
        });
      },
      columns: [
        { key: 'name', label: 'Product', value: function (r) { return r.name; }, render: function (r) {
          return '<div class="dt-product"><img src="' + img(r.img) + '" alt="" loading="lazy"><div><b>' + esc(r.name) + '</b><span>' + esc(r.brand) + '</span></div></div>';
        } },
        { key: 'cat', label: 'Category', value: function (r) { return r.cat; }, render: function (r) { return esc(r.cat); } },
        { key: 'price', label: 'Price', value: function (r) { return r.price; }, render: function (r) {
          return D.money(+r.price) + (r.old ? ' <del style="color:var(--muted);font-size:.78rem">' + D.money(+r.old) + '</del>' : '');
        } },
        { key: 'stock', label: 'Stock', value: function (r) { return +r.stock || 0; }, render: function (r) {
          var st = +r.stock || 0;
          var cls = st === 0 ? 'ts-closed' : st <= 5 ? 'ts-limited' : 'ts-active';
          return '<span class="table-status ' + cls + '">' + st + ' units</span>';
        } },
        { key: 'status', label: 'Status', value: function (r) { return r.status; }, render: function (r) { return statusBadge(r.status); } },
        { key: '', label: 'Actions', value: function () { return ''; }, render: function (r) { return actions(r.id, 'product'); } }
      ],
      afterRender: function () {
        qsa('#productsTbody [data-edit]').forEach(function (b) { b.addEventListener('click', function () { openEdit(findById(b.getAttribute('data-edit'))); }); });
        qsa('#productsTbody [data-del]').forEach(function (b) { b.addEventListener('click', function () { del('product', b.getAttribute('data-edit')); }); });
      },
      emptyTitle: 'No products found', emptyMsg: 'Try a different filter or create a new listing.', emptyIcon: 'fa-shirt'
    });
    TABLES.product = t;

    function findById(id) { var out = null; D.products().forEach(function (p) { if (p.id === id) out = p; }); return out; }

    qs('#addProductBtn').addEventListener('click', function () {
      editing = null;
      qs('#prModalTitle').textContent = 'Add Product';
      qs('#prSubmitLabel').textContent = 'Add Product';
      fill(formFields, { status: 'in-stock', stock: 10, old: 0, img: 'dressA' });
      showModal('productModal');
    });
    function openEdit(row) {
      if (!row) return;
      editing = row;
      qs('#prModalTitle').textContent = 'Edit Product \u2014 ' + row.name;
      qs('#prSubmitLabel').textContent = 'Update Product';
      fill(formFields, row);
      showModal('productModal');
    }
    saveBtn.addEventListener('click', function () {
      if (!validate(formFields)) return;
      var data = collect(formFields);
      data.price = parseFloat(data.price) || 0;
      data.old = parseFloat(data.old) || 0;
      data.stock = parseInt(data.stock, 10) || 0;
      data.img = data.img || 'dressA';
      data.desc = data.desc || 'A new arrival from ' + data.brand + '.';
      var list = D.products();
      if (editing) {
        Object.keys(data).forEach(function (k) { editing[k] = data[k]; });
        D.saveProducts(list);
        MR.toast('Product updated', data.name + ' saved successfully.', 'success');
      } else {
        list.push(Object.assign({ id: D.uid('p') }, data));
        D.saveProducts(list);
        MR.toast('Product added', data.name + ' is now listed.', 'success');
      }
      hideModal('productModal');
      t.refresh();
    });
    bindImgPicker(formFields);
  }
  /* terminal-ish */
  function initProductsFilters() {
    ['filterCat', 'filterBrand', 'filterStatus'].forEach(function (id) {
      var el = qs('#' + id);
      if (el) el.addEventListener('change', function () { if (TABLES.product) TABLES.product.setFilter(); });
    });
  }
  global.MR = global.MR || {};
  global.MR.__productsReady = { initProducts: initProducts, initProductsFilters: initProductsFilters };
  /* =============================== EVENTS =============================== */
  function initEvents() {
    var saveBtn = qs('#saveEventBtn');
    var formFields = [
      { id: 'evName', prop: 'title' },
      { id: 'evDate', prop: 'date' },
      { id: 'evTime', prop: 'time', required: false },
      { id: 'evLocation', prop: 'location', required: false },
      { id: 'evCat', prop: 'cat' },
      { id: 'evCapacity', prop: 'capacity', required: false },
      { id: 'evImg', prop: 'img', required: false },
      { id: 'evStatus', prop: 'status' },
      { id: 'evDesc', prop: 'desc', required: false }
    ];
    var editing = null;
    var t = global.MR.table({
      tbody: '#eventsTbody', pager: '#eventsPager', count: '#eventsCount', search: '#eventsSearch',
      thead: '#eventsTable', sortKey: 'date', noun: 'events',
      data: function () { return D.events(); },
      searchText: function (r) { return r.title + ' ' + r.cat + ' ' + r.location + ' ' + (r.desc || ''); },
      filter: function (list) {
        var c = (qs('#filterEvCat') || {}).value;
        var s = (qs('#filterEvStatus') || {}).value;
        return list.filter(function (r) { return (c === 'all' || r.cat === c) && (s === 'all' || r.status === s); });
      },
      columns: [
        { key: 'title', label: 'Event', value: function (r) { return r.title; }, render: function (r) {
          return '<div class="dt-product"><img src="' + img(r.img) + '" alt="" loading="lazy"><div><b>' + esc(r.title) + '</b><span>' + esc(r.cat) + '</span></div></div>';
        } },
        { key: 'date', label: 'Date', value: function (r) { return r.date; }, render: function (r) { return '<span class="dt-cell-label">' + D.fmtDate(r.date) + '<small>' + esc(r.time || '') + '</small></span>'; } },
        { key: 'location', label: 'Location', value: function (r) { return r.location; }, render: function (r) { return esc(r.location || '\u2014'); } },
        { key: 'capacity', label: 'Capacity', value: function (r) { return +r.capacity || 0; }, render: function (r) { return (+r.capacity || 0).toLocaleString('en-US') + ' guests'; } },
        { key: 'status', label: 'Status', value: function (r) { return r.status; }, render: function (r) { return statusBadge(r.status === 'published' ? 'active' : r.status); } },
        { key: '', label: 'Actions', value: function () { return ''; }, render: function (r) { return actions(r.id, 'event'); } }
      ],
      afterRender: function () {
        qsa('#eventsTbody [data-edit]').forEach(function (b) { b.addEventListener('click', function () { openEdit(evById(b.getAttribute('data-edit'))); }); });
        qsa('#eventsTbody [data-del]').forEach(function (b) { b.addEventListener('click', function () { del('event', b.getAttribute('data-edit'), 'event'); }); });
      },
      emptyTitle: 'No events found', emptyMsg: 'The calendar is open \u2014 schedule the next moment.', emptyIcon: 'fa-calendar-xmark'
    });
    TABLES.event = t;
    ['filterEvCat', 'filterEvStatus'].forEach(function (id) {
      var el = qs('#' + id);
      if (el) el.addEventListener('change', function () { t.setFilter(); });
    });
    function evById(id) { var out = null; D.events().forEach(function (e) { if (e.id === id) out = e; }); return out; }
    qs('#addEventBtn').addEventListener('click', function () {
      editing = null;
      qs('#crudModalTitle').textContent = 'Add Event';
      qs('#crudSubmitLabel').textContent = 'Add Event';
      fill(formFields, { status: 'draft', time: '19:00', capacity: 200, img: 'fashionRunway' });
      showModal('crudModal');
    });
    function openEdit(row) {
      if (!row) return;
      editing = row;
      qs('#crudModalTitle').textContent = 'Edit Event \u2014 ' + row.title;
      qs('#crudSubmitLabel').textContent = 'Update Event';
      fill(formFields, row);
      showModal('crudModal');
    }
    saveBtn.addEventListener('click', function () {
      if (!validate(formFields)) return;
      var data = collect(formFields);
      data.time = data.time || '19:00';
      data.location = data.location || 'Grand Atrium';
      data.cat = data.cat || 'Fashion';
      data.capacity = parseInt(data.capacity, 10) || 100;
      data.img = data.img || 'fashionRunway';
      var list = D.events();
      if (editing) {
        Object.keys(data).forEach(function (k) { editing[k] = data[k]; });
        D.saveEvents(list);
        MR.toast('Event updated', data.title + ' saved successfully.', 'success');
      } else {
        list.push(Object.assign({ id: D.uid('ev'), featured: false }, data));
        D.saveEvents(list);
        MR.toast('Event added', data.title + ' is on the calendar.', 'success');
      }
      hideModal('crudModal');
      t.refresh();
    });
    bindImgPicker(formFields);
  }
  /* =============================== OFFERS =============================== */
  function initOffers() {
    var saveBtn = qs('#saveOfferBtn');
    var formFields = [
      { id: 'ofTitle', prop: 'title' },
      { id: 'ofStore', prop: 'store' },
      { id: 'ofDiscount', prop: 'discount' },
      { id: 'ofStart', prop: 'start' },
      { id: 'ofEnd', prop: 'end' },
      { id: 'ofImg', prop: 'img', required: false },
      { id: 'ofBadge', prop: 'badge', required: false },
      { id: 'ofStatus', prop: 'status' },
      { id: 'ofDesc', prop: 'desc', required: false }
    ];
    var editing = null;
    var today = new Date().toISOString().slice(0, 10);
    var later = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    var t = global.MR.table({
      tbody: '#offersTbody', pager: '#offersPager', count: '#offersCount', search: '#offersSearch',
      thead: '#offersTable', sortKey: 'end', noun: 'offers',
      data: function () { return D.offers(); },
      searchText: function (r) { return r.title + ' ' + r.store + ' ' + (r.desc || '') + ' ' + (r.badge || ''); },
      filter: function (list) {
        var b = (qs('#filterOfBadge') || {}).value;
        var s = (qs('#filterOfStatus') || {}).value;
        return list.filter(function (r) { return (b === 'all' || r.badge === b) && (s === 'all' || r.status === s); });
      },
      columns: [
        { key: 'title', label: 'Offer', value: function (r) { return r.title; }, render: function (r) {
          return '<div class="dt-product"><img src="' + img(r.img) + '" alt="" loading="lazy"><div><b>' + esc(r.title) + '</b><span>' + esc(r.badge || 'Offer') + '</span></div></div>';
        } },
        { key: 'store', label: 'Store', value: function (r) { return r.store; }, render: function (r) { return esc(r.store); } },
        { key: 'discount', label: 'Discount', value: function (r) { return +r.discount || 0; }, render: function (r) { return '<span class="badge badge-gold">' + (+r.discount || 0) + '% off</span>'; } },
        { key: 'start', label: 'Start', value: function (r) { return r.start; }, render: function (r) { return D.fmtDate(r.start); } },
        { key: 'end', label: 'Ends', value: function (r) { return r.end; }, render: function (r) {
          var d = D.daysUntil(r.end);
          return '<span class="dt-cell-label">' + D.fmtDate(r.end) + '<small>' + (d > 0 ? d + ' days left' : 'Expired') + '</small></span>';
        } },
        { key: 'status', label: 'Status', value: function (r) { return r.status; }, render: function (r) { return statusBadge(r.status); } },
        { key: '', label: 'Actions', value: function () { return ''; }, render: function (r) { return actions(r.id, 'offer'); } }
      ],
      afterRender: function () {
        qsa('#offersTbody [data-edit]').forEach(function (b) { b.addEventListener('click', function () { openEdit(offById(b.getAttribute('data-edit'))); }); });
        qsa('#offersTbody [data-del]').forEach(function (b) { b.addEventListener('click', function () { del('offer', b.getAttribute('data-edit'), 'offer'); }); });
      },
      emptyTitle: 'No offers found', emptyMsg: 'Create the first promotion for the maison.', emptyIcon: 'fa-tags'
    });
    TABLES.offer = t;
    ['filterOfBadge', 'filterOfStatus'].forEach(function (id) {
      var el = qs('#' + id);
      if (el) el.addEventListener('change', function () { t.setFilter(); });
    });
    function offById(id) { var out = null; D.offers().forEach(function (o) { if (o.id === id) out = o; }); return out; }
    qs('#addOfferBtn').addEventListener('click', function () {
      editing = null;
      qs('#crudModalTitle').textContent = 'Create Offer';
      qs('#crudSubmitLabel').textContent = 'Create Offer';
      fill(formFields, { status: 'active', badge: 'NEW', discount: 20, start: today, end: later, img: 'shoppingBags' });
      showModal('crudModal');
    });
    function openEdit(row) {
      if (!row) return;
      editing = row;
      qs('#crudModalTitle').textContent = 'Edit Offer \u2014 ' + row.title;
      qs('#crudSubmitLabel').textContent = 'Update Offer';
      fill(formFields, row);
      showModal('crudModal');
    }
    saveBtn.addEventListener('click', function () {
      if (!validate(formFields)) return;
      var data = collect(formFields);
      data.discount = parseInt(data.discount, 10) || 0;
      data.badge = (data.badge || 'OFFER').toUpperCase();
      data.img = data.img || 'shoppingBags';
      data.desc = data.desc || ('Save ' + data.discount + '% at ' + data.store + ' for a limited time.');
      var list = D.offers();
      if (editing) {
        Object.keys(data).forEach(function (k) { editing[k] = data[k]; });
        D.saveOffers(list);
        MR.toast('Offer updated', data.title + ' saved successfully.', 'success');
      } else {
        list.push(Object.assign({ id: D.uid('o') }, data));
        D.saveOffers(list);
        MR.toast('Offer created', data.title + ' is now live for shoppers.', 'success');
      }
      hideModal('crudModal');
      t.refresh();
    });
    bindImgPicker(formFields);
  }
  /* ---------------------------------- boot ---------------------------------- */
  function boot() {
    if (qs('#storesTbody')) initStores();
    if (qs('#productsTbody')) { initProducts(); initProductsFilters(); }
    if (qs('#eventsTbody')) initEvents();
    if (qs('#offersTbody')) initOffers();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  global.MR.__crudReady = { initStores: initStores, initProducts: initProducts, initEvents: initEvents, initOffers: initOffers };
  /*__CRUD_DONE__*/
})(typeof window !== 'undefined' ? window : this);
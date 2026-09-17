/* =========================================================================
   MAISON ROYALE — Analytics charts
   Dependency-free SVG renderers: line/area, bars, donut.
   Paints every [data-chart] host with data pulled from MallData.ANALYTICS.
   ========================================================================= */
(function (global) {
  'use strict';
  var D = global.MallData || {};
  var A = D.ANALYTICS || {};
  var NS = 'http://www.w3.org/2000/svg';
  var PALETTE = ['#c8a24a', '#14100e', '#7b2340', '#1a3d6e', '#2e8b57', '#8a8174'];

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function fmt(n) {
    if (n >= 1000) { var k = n / 1000; return (k >= 100 ? Math.round(k) : k.toFixed(1)).toString().replace(/\.0$/, '') + 'k'; }
    return Math.round(n).toString();
  }

  /* --------------------------------- line --------------------------------- */
  function lineChart(host, data, labels) {
    if (!host || !data || !data.length) return;
    var W = 640, H = 250, padL = 46, padR = 14, padT = 18, padB = 32;
    var iw = W - padL - padR, ih = H - padT - padB;
    var max = Math.max.apply(null, data), min = Math.min.apply(null, data);
    var range = (max - min) || 1;
    function x(i) { return padL + (data.length === 1 ? iw / 2 : i * (iw / (data.length - 1))); }
    function y(v) { return padT + ih - ((v - min) / range) * ih; }
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart-svg', role: 'img' }, host);
    var defs = el('defs', {}, svg);
    var grad = el('linearGradient', { id: 'mrAreaGrad', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#c8a24a', 'stop-opacity': '.3' }, grad);
    el('stop', { offset: '100%', 'stop-color': '#c8a24a', 'stop-opacity': '0' }, grad);
    var g, i;
    for (g = 0; g <= 4; g++) {
      var gy = padT + ih * g / 4;
      el('line', { x1: padL, y1: gy, x2: W - padR, y2: gy, class: 'grid-line' }, svg);
      el('text', { x: padL - 9, y: gy + 3, 'text-anchor': 'end', class: 'axis-label' }, svg).textContent = fmt(max - range * g / 4);
    }
    var pts = [];
    for (i = 0; i < data.length; i++) pts.push([x(i), y(data[i])]);
    var area = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') +
      ' ' + pts[pts.length - 1][0].toFixed(1) + ',' + (padT + ih) + ' ' + pts[0][0].toFixed(1) + ',' + (padT + ih);
    el('polygon', { points: area, class: 'series-area' }, svg);
    el('polyline', { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), class: 'series-line' }, svg);
    pts.forEach(function (p) {
      el('circle', { cx: p[0], cy: p[1], r: 3, fill: '#c8a24a', class: 'hover-dot' }, svg);
    });
    labels.forEach(function (lb, i) {
      if (data.length <= 12) el('text', { x: x(i), y: H - 10, 'text-anchor': 'middle', class: 'axis-label' }, svg).textContent = lb || '';
    });
  }
  /* --------------------------------- bars --------------------------------- */
  function barChart(host, items) {
    if (!host || !items || !items.length) return;
    var W = 640, H = 230, padL = 46, padR = 12, padT = 16, padB = 40;
    var iw = W - padL - padR, ih = H - padT - padB;
    var vals = items.map(function (o) { return parseFloat(o.value) || 0; });
    var max = Math.max.apply(null, vals) || 1;
    var n = items.length;
    var slot = iw / n, bw = Math.min(36, slot * 0.56);
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart-svg', role: 'img' }, host);
    var g, i;
    for (g = 0; g <= 4; g++) {
      var gy = padT + ih * g / 4;
      el('line', { x1: padL, y1: gy, x2: W - padR, y2: gy, class: 'grid-line' }, svg);
      el('text', { x: padL - 9, y: gy + 3, 'text-anchor': 'end', class: 'axis-label' }, svg).textContent = fmt(max - max * g / 4);
    }
    items.forEach(function (o, i) {
      var h = Math.max(2, (vals[i] / max) * ih);
      var bx = padL + slot * i + (slot - bw) / 2;
      var by = padT + ih - h;
      el('rect', { x: bx, y: by, width: bw, height: h, rx: 3, class: 'series-bar' + (i % 2 ? ' alt' : '') }, svg);
      el('text', { x: padL + slot * i + slot / 2, y: H - 10, 'text-anchor': 'middle', class: 'bar-label' }, svg).textContent = o.label.length > 9 ? o.label.slice(0, 8) + '\u2026' : o.label;
    });
  }

  /* --------------------------------- donut -------------------------------- */
  function donutChart(host, items) {
    if (!host || !items || !items.length) return;
    var cx = 90, cy = 90, r = 62, sw = 27;
    var total = items.reduce(function (s, o) { return s + (parseFloat(o.value) || 0); }, 0) || 1;
    var svg = el('svg', { viewBox: '0 0 180 180', class: 'chart-svg', style: 'max-width:250px;margin:auto', role: 'img' }, host);
    var a = -90;
    items.forEach(function (o, i) {
      var frac = (parseFloat(o.value) || 0) / total;
      var a2 = a + frac * 360;
      var large = frac > 0.5 ? 1 : 0;
      var x1 = cx + r * Math.cos(a * Math.PI / 180), y1 = cy + r * Math.sin(a * Math.PI / 180);
      var x2 = cx + r * Math.cos(a2 * Math.PI / 180), y2 = cy + r * Math.sin(a2 * Math.PI / 180);
      var d = 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1);
      el('path', { d: d, fill: 'none', stroke: PALETTE[i % PALETTE.length], 'stroke-width': sw, 'stroke-linecap': 'round', class: 'donut-seg' }, svg);
      a = a2;
    });
    var t = el('text', { x: cx, y: cy, 'text-anchor': 'middle', class: 'donut-center' }, svg);
    el('tspan', { x: cx, dy: '2' }, t).textContent = (parseFloat(items[0].value) / total * 100).toFixed(0) + '%';
    el('tspan', { x: cx, dy: '15', 'font-size': '8', 'font-family': 'Manrope, sans-serif', fill: '#8a8174' }, t).textContent = items[0].label;
  }

  /* ------------------------------- normalize ------------------------------- */
  function normalize(key) {
    var src = A[key];
    if (!src) return null;
    if (Array.isArray(src)) {
      if (typeof src[0] === 'number') return { type: 'line', labels: A.months || [], values: src };
      return { type: 'bars', items: src.map(function (o) { return { label: o.name, value: o.rev }; }) };
    }
    if (key === 'channels' || key === 'categories') return { type: 'donut', items: Object.keys(src).map(function (k) { return { label: k, value: src[k] }; }) };
    return { type: 'bars', items: Object.keys(src).map(function (k) { return { label: k, value: src[k] }; }) };
  }

  function paintAll() {
    document.querySelectorAll('[data-chart]').forEach(function (host) {
      var obj = normalize(host.getAttribute('data-keys'));
      if (!obj) return;
      if (obj.type === 'line') lineChart(host, obj.values, obj.labels);
      else if (obj.type === 'bars') barChart(host, obj.items);
      else donutChart(host, obj.items);
    });
  }

  global.MR = global.MR || {};
  global.MR.charts = { line: lineChart, bars: barChart, donut: donutChart };
  global.MR.paintCharts = paintAll;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paintAll);
  else paintAll();
})(typeof window !== 'undefined' ? window : this);
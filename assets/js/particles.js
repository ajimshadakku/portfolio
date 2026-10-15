/* ============================================================================
   particles.js — "matrix field" behind the hero
   ----------------------------------------------------------------------------
   Small dots locked to a grid. Each one breathes on its own slow cycle, so
   the field reads as a quiet data matrix rather than floating dust. The cursor
   lights up the dots around it — they grow and pick up a soft halo — and every
   few seconds a ring pulse travels out from a random point.

   Colour and strength come from the CSS variables --particle / --particle-op
   in assets/css/styles.css, so the field follows the theme.

   EDIT: FIELD SETTINGS are all in the CONFIG object below.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- EDIT: FIELD SETTINGS ----------------------------------------- */
  var CONFIG = {
    cell:          46,    // px between grid points
    size:          3.2,   // px — dot diameter at rest
    fillRatio:     0.42,  // 0–1 — share of grid cells that are occupied
    breatheSpeed:  0.45,  // how fast dots fade in and out
    mouseRadius:   165,   // px — cursor influence radius
    mouseBoost:    2.6,   // how much brighter a lit dot becomes
    mouseGrow:     2.6,   // extra px a lit dot grows by
    glow:          15,    // px — strongest halo on a fully lit dot (0 = no glow)
    glowStart:     0.12,  // only dots lit past this much get a halo
    pulseEvery:    4.5,   // seconds between ring pulses (0 = off)
    pulseSpeed:    320,   // px per second the ring travels
    pulseWidth:    90,    // px — thickness of the ring
    maxCells:      900    // hard ceiling, keeps slow laptops happy
  };
  /* ------------------------------------------------------------------- */

  var canvas = document.getElementById("particles");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var cells = [];
  var w = 0, h = 0, dpr = 1;
  var mouse = { x: -9999, y: -9999 };
  var raf = null;
  var t0 = performance.now();
  var rgb = "156,59,34";
  var baseOpacity = 0.3;
  var pulse = null;      // { x, y, started }
  var nextPulse = CONFIG.pulseEvery * 1000;

  function readTheme() {
    var style = getComputedStyle(document.documentElement);
    rgb = hexToRgb((style.getPropertyValue("--particle") || "#9c3b22").trim());
    baseOpacity = parseFloat(style.getPropertyValue("--particle-op")) || 0.3;
  }

  function hexToRgb(hex) {
    var s = hex.replace("#", "");
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    var n = parseInt(s, 16);
    if (isNaN(n)) return "156,59,34";
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(",");
  }

  function build() {
    cells = [];
    var cols = Math.ceil(w / CONFIG.cell);
    var rows = Math.ceil(h / CONFIG.cell);
    for (var c = 0; c <= cols; c++) {
      for (var r = 0; r <= rows; r++) {
        if (Math.random() > CONFIG.fillRatio) continue;
        if (cells.length >= CONFIG.maxCells) return;
        cells.push({
          x: c * CONFIG.cell,
          y: r * CONFIG.cell,
          phase: Math.random() * Math.PI * 2,
          weight: 0.4 + Math.random() * 0.6    // per-cell brightness
        });
      }
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function frame(now) {
    var t = (now - t0) / 1000;
    ctx.clearRect(0, 0, w, h);

    /* schedule the next ring pulse */
    if (CONFIG.pulseEvery && now - t0 > nextPulse) {
      pulse = { x: Math.random() * w, y: Math.random() * h, started: now };
      nextPulse = now - t0 + CONFIG.pulseEvery * 1000;
    }

    var pulseR = pulse ? ((now - pulse.started) / 1000) * CONFIG.pulseSpeed : 0;
    var maxR = Math.sqrt(w * w + h * h);
    if (pulse && pulseR > maxR) pulse = null;

    for (var i = 0; i < cells.length; i++) {
      var p = cells[i];

      /* slow breathing */
      var breathe = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * CONFIG.breatheSpeed + p.phase));
      var alpha = baseOpacity * p.weight * breathe;
      var size = CONFIG.size;
      var lift = 0;                       // 0–1, how "awake" this dot is

      /* cursor proximity */
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        var near = 1 - dist / CONFIG.mouseRadius;
        alpha += baseOpacity * near * (CONFIG.mouseBoost - 1);
        size += near * CONFIG.mouseGrow;
        if (near > lift) lift = near;
      }

      /* ring pulse */
      if (pulse) {
        var pd = Math.abs(Math.sqrt((p.x - pulse.x) * (p.x - pulse.x) + (p.y - pulse.y) * (p.y - pulse.y)) - pulseR);
        if (pd < CONFIG.pulseWidth) {
          var ring = (1 - pd / CONFIG.pulseWidth) * (1 - pulseR / maxR);
          alpha += baseOpacity * ring * 1.8;
          size += ring * 1.6;
          if (ring > lift) lift = ring;
        }
      }

      if (alpha > 1) alpha = 1;

      /* a halo, but only on dots that are actually lit — the resting field
         stays crisp so the effect reads as considered rather than neon */
      var halo = CONFIG.glow && lift > CONFIG.glowStart
        ? CONFIG.glow * (lift - CONFIG.glowStart) / (1 - CONFIG.glowStart)
        : 0;

      if (halo > 0) {
        ctx.shadowColor = "rgba(" + rgb + "," + Math.min(1, alpha * 0.8).toFixed(3) + ")";
        ctx.shadowBlur = halo;
      }

      ctx.fillStyle = "rgba(" + rgb + "," + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
      ctx.fill();

      if (halo > 0) { ctx.shadowBlur = 0; ctx.shadowColor = "transparent"; }
    }

    raf = requestAnimationFrame(frame);
  }

  function start() { if (!raf) raf = requestAnimationFrame(frame); }
  function stop()  { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  /* ---- wiring -------------------------------------------------------- */
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  window.addEventListener("mousemove", function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener("mouseout", function () { mouse.x = mouse.y = -9999; });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0 }).observe(canvas);
  } else {
    start();
  }

  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : start();
  });

  document.addEventListener("themechange", readTheme);

  readTheme();
  resize();
  start();
})();

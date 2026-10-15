/* ============================================================================
   main.js — interactions
   ----------------------------------------------------------------------------
   1. Theme toggle (remembers the choice)
   2. Reading progress
   3. Active section — highlights the menu and updates the bottom status bar
   4. Mobile menu
   5. Scroll reveal
   6. Counting numbers
   7. Copy email · 8. Status bar · 9. Keyboard shortcut · 10. Pointer flourishes
   11. Footer year
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     1. Theme toggle
     EDIT: change "light" below to "dark" to open in dark mode
     ========================================================== */
  var DEFAULT_THEME = "light";

  /* EDIT: these must match --paper in the two palettes (styles.css) */
  var THEME_COLOR = { light: "#e9e4d9", dark: "#1a1816" };

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}

  var startTheme = stored ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : DEFAULT_THEME);
  applyTheme(startTheme);

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[theme] || THEME_COLOR.light);
    document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  }

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ==========================================================
     2. Reading progress
     ========================================================== */
  var bar = document.getElementById("progressBar");

  function onScroll() {
    if (!bar) return;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ==========================================================
     3. Active section
     Highlights the menu item and writes the section name into the
     status bar along the bottom of the screen.
     EDIT: "Open to work" below is what the bar shows at the top of the page.
     ========================================================== */
  var IDLE_STATUS = "Open to work";

  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  var statusNow = document.getElementById("statusNow");
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var hash = "#" + entry.target.id;

        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === hash);
        });

        if (statusNow) {
          var active = links.filter(function (a) { return a.getAttribute("href") === hash; })[0];
          if (!active) {
            statusNow.textContent = IDLE_STATUS;
          } else {
            /* the link is "<i>01</i>Profile" — show it as "01 · Profile" */
            var num = active.querySelector("i");
            var label = active.textContent.replace(num ? num.textContent : "", "").trim();
            statusNow.textContent = (num ? num.textContent + " · " : "") + label;
          }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });

    /* back to the idle message when the hero is in view */
    var hero = document.getElementById("top");
    if (hero && statusNow) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          statusNow.textContent = IDLE_STATUS;
          links.forEach(function (a) { a.classList.remove("is-active"); });
        }
      }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 }).observe(hero);
    }
  }

  /* ==========================================================
     4. Mobile menu
     ========================================================== */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("navLinks");

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.addEventListener("click", function (e) {
      if (!e.target.closest("a")) return;
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) burger.click();
    });
  }

  /* ==========================================================
     5. Scroll reveal
     class "reveal"          → fades up
     class "reveal reveal--wipe" → wipes up from a mask
     data-delay="1|2|3..."   → staggers it
     ========================================================== */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  revealEls.forEach(function (el) { el.style.setProperty("--d", el.dataset.delay || 0); });

  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ==========================================================
     6. Counting numbers
     data-count    = the value to count to
     data-decimals = decimal places (default 0)
     data-pad      = pad with leading zeros to this many digits
     The final value is written in the HTML, so it is already correct
     before (and without) this script; we only zero it to animate it.
     ========================================================== */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

  function format(el, value) {
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var pad = parseInt(el.dataset.pad || "0", 10);
    var out = value.toFixed(decimals);
    while (pad && out.replace(/\..*/, "").length < pad) out = "0" + out;
    return out;
  }

  if (!reduced) {
    counters.forEach(function (el) { el.textContent = format(el, 0); });
  }

  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    if (reduced) { el.textContent = format(el, target); return; }

    var duration = 1300;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(el, target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(el, target);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    counters.forEach(function (el) { countObs.observe(el); });
  } else {
    counters.forEach(countUp);
  }

  /* ==========================================================
     7. Copy the email address
     The address lives in data-copy on the button in index.html.
     EDIT: the two messages below are what the little line says.
     ========================================================== */
  var COPY_OK = "Copied to clipboard";
  var COPY_FAIL = "Press Ctrl+C to copy";

  var copyBtn = document.getElementById("copyMail");
  var copyStatus = document.getElementById("copyStatus");
  var copyTimer;

  function say(message) {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    copyStatus.classList.add("is-shown");
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
      copyStatus.classList.remove("is-shown");
      if (copyBtn) copyBtn.classList.remove("is-done");
    }, 2600);
  }

  function legacyCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:absolute;left:-9999px";
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(field);
    return ok;
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.dataset.copy || "";

      function done() { copyBtn.classList.add("is-done"); say(COPY_OK); }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          legacyCopy(text) ? done() : say(COPY_FAIL);
        });
      } else {
        legacyCopy(text) ? done() : say(COPY_FAIL);
      }
    });
  }

  /* ==========================================================
     8. Status bar — live read percentage and the top button
     ========================================================== */
  var statusPct = document.getElementById("statusPct");
  var statusTop = document.getElementById("statusTop");

  if (statusPct) {
    window.addEventListener("scroll", function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.round(((window.scrollY || 0) / max) * 100) : 0;
      statusPct.textContent = Math.min(100, Math.max(0, pct)) + "%";
    }, { passive: true });
  }

  if (statusTop) {
    statusTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ==========================================================
     9. Keyboard shortcut — T switches the theme
     EDIT: change "t" to any other letter you prefer.
     ========================================================== */
  var THEME_KEY = "t";

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key.toLowerCase() === THEME_KEY && toggle) toggle.click();
  });

  /* ==========================================================
     10. Small pointer flourishes
     Buttons lean very slightly towards the cursor, and a project's
     figure redraws itself when you hover the block. Both are skipped
     on touch screens and when reduced motion is requested.
     ========================================================== */
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer && !reduced) {
    var PULL = 4;   // EDIT: how many px a button leans towards the cursor

    Array.prototype.forEach.call(document.querySelectorAll(".btn, .copy"), function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.transform = "translate(" + (x * PULL).toFixed(2) + "px," +
                             (y * PULL - 2).toFixed(2) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    Array.prototype.forEach.call(document.querySelectorAll(".work"), function (block) {
      block.addEventListener("mouseenter", function () {
        var parts = block.querySelectorAll(".fig__bars rect, .fig__path, .fig__dot");
        Array.prototype.forEach.call(parts, function (node) {
          node.style.animation = "none";
          void node.offsetWidth;          // force a reflow so it can replay
          node.style.animation = "";
        });
      });
    });
  }

  /* ==========================================================
     11. Footer year
     ========================================================== */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

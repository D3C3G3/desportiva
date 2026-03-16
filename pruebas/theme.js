/* ═══════════════════════════════════════════════════
   theme.js — Dark / Light mode toggle
   Usa el toggle "Within" de https://toggles.dev/within/html
   CDN CSS: https://cdn.jsdelivr.net/npm/theme-toggles@4.10.1/css/within.min.css
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Aplica el tema guardado ANTES de pintar (evita flash) ──
  var saved = localStorage.getItem('autoelite-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
  }

  document.addEventListener('DOMContentLoaded', function () {

    // ── Cursor personalizado ──
    var cursor = document.getElementById('cursor');
    var ring   = document.getElementById('cursorRing');
    if (cursor && ring) {
      document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
        setTimeout(function () {
          ring.style.left = e.clientX + 'px';
          ring.style.top  = e.clientY + 'px';
        }, 80);
      });
    }

    // ── Menú burger ──
    window.toggleMenu = function () {
      var links = document.getElementById('navLinks');
      if (links) links.classList.toggle('open');
    };

    // ── FAQ toggle ──
    window.toggleFaq = function (el) {
      el.closest('.faq-item').classList.toggle('open');
    };

    // ── Scroll reveal ──
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          setTimeout(function () {
            e.target.classList.add('visible');
          }, i * 80);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

    // ── Rating bars animadas (testimonios) ──
    var ratingHero = document.getElementById('ratingHero');
    if (ratingHero) {
      var barObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          setTimeout(function () {
            document.querySelectorAll('.rb-fill').forEach(function (b) {
              b.style.width = b.dataset.w;
            });
          }, 400);
        }
      }, { threshold: 0.3 });
      barObs.observe(ratingHero);
    }

    // ── Theme toggle (toggles.dev "Within") ──
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    // Estado inicial
    var isDark = document.body.classList.contains('dark');
    if (isDark) btn.classList.add('theme-toggle--toggled');

    btn.addEventListener('click', function () {
      isDark = !isDark;
      document.body.classList.toggle('dark', isDark);
      btn.classList.toggle('theme-toggle--toggled', isDark);
      localStorage.setItem('autoelite-theme', isDark ? 'dark' : 'light');
    });

  });
})();

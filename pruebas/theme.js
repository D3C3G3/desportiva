/* ═══════════════════════════════════════════════════
   theme.js — AutoEscuela Elite
   Integración: Dark Mode, Sticky Header, Scroll Top y Efectos
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  // 1. APLICAR TEMA ANTES DE LA CARGA (Evita el destello blanco)
  var saved = localStorage.getItem('autoelite-theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }

  document.addEventListener('DOMContentLoaded', function () {
    
    // --- ELEMENTOS CLAVE ---
    const navbar = document.querySelector('nav');
    const btnSubir = document.getElementById('btnSubirImage');

    // 2. LÓGICA DE SCROLL (Header transparente y Botón Subir)
    window.addEventListener('scroll', function() {
      // Header dinámico
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Mostrar/Ocultar botón de subir con animación
      if (btnSubir) {
        if (window.scrollY > 300) {
          btnSubir.classList.add('mostrar');
        } else {
          btnSubir.classList.remove('mostrar');
        }
      }
    });

    // 3. FUNCIÓN PARA SUBIR AL INICIO
    window.subirInicio = function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // 4. CURSOR PERSONALIZADO
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

    // 5. MENÚ MOBILE — Estilo Spacedesk (panel derecha + overlay + stagger)
    window.toggleMenu = function (event) {
      if (event) event.stopPropagation();
      var links   = document.getElementById('navLinks');
      var overlay = document.getElementById('navOverlay');
      var navbar  = document.querySelector('nav');

      if (!links) return;

      var isOpen = links.classList.contains('open');

      if (!isOpen) {
        // ABRIR
        // 1. Mostrar overlay
        if (overlay) overlay.classList.add('visible');
        // 2. Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        // 3. Abrir panel (después de un frame para que la transición funcione)
        requestAnimationFrame(function () {
          links.classList.add('open');
          navbar.classList.add('menu-abierto');
        });
      } else {
        // CERRAR
        links.classList.remove('open');
        navbar.classList.remove('menu-abierto');
        if (overlay) overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    };

    // 6. FAQ TOGGLE — accordion (solo una abierta a la vez)
    window.toggleFaq = function (el) {
      var item   = el.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    };

    // 7. SCROLL REVEAL (Animaciones al aparecer)
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

    // 8. RATING BARS (Testimonios)
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

    // 9. THEME TOGGLE (Modo Oscuro)
    var btnTheme = document.getElementById('themeToggle');
    if (btnTheme) {
      var isDark = document.body.classList.contains('dark');
      if (isDark) btnTheme.classList.add('theme-toggle--toggled');

      btnTheme.addEventListener('click', function () {
        isDark = !isDark;
        document.body.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('dark', isDark);
        btnTheme.classList.toggle('theme-toggle--toggled', isDark);
        localStorage.setItem('autoelite-theme', isDark ? 'dark' : 'light');
      });
    }

  });

  // 10. CERRAR MENÚ AL HACER CLIC FUERA (Efecto Spacedesk)
    document.addEventListener('click', function (event) {
      var links   = document.getElementById('navLinks');
      var overlay = document.getElementById('navOverlay');
      var navbar  = document.querySelector('nav');
      var burger  = document.querySelector('.nav-toggle');

      if (links && links.classList.contains('open')) {
        if (!links.contains(event.target) && !burger.contains(event.target)) {
          links.classList.remove('open');
          navbar.classList.remove('menu-abierto');
          if (overlay) overlay.classList.remove('visible');
          document.body.style.overflow = '';
        }
      }
    });

    // SPA + LOADER SOLO PRIMERA CARGA
document.addEventListener("DOMContentLoaded", function () {

  const loader = document.getElementById("pageLoader");
  const content = document.getElementById("appContent");

  // SOLO PRIMERA VEZ
  if (!sessionStorage.getItem("visited")) {
    sessionStorage.setItem("visited", "true");

    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 500);
    });

  } else {
    if (loader) loader.style.display = "none";
  }

  async function loadPage(url) {
    try {
      content.style.opacity = 0;
      content.style.transform = "translateY(20px)";

      const res = await fetch(url);
      const text = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      const newContent = doc.querySelector("#appContent");

      setTimeout(() => {
        if (newContent) {
          content.innerHTML = newContent.innerHTML;

          content.style.opacity = 1;
          content.style.transform = "translateY(0)";

          reInitScripts();
        }
      }, 300);

      history.pushState(null, "", url);

    } catch (err) {
      window.location.href = url;
    }
  }

  document.querySelectorAll("a").forEach(link => {
    const url = link.getAttribute("href");

    if (
      url &&
      !url.startsWith("#") &&
      !url.startsWith("http") &&
      !link.hasAttribute("target")
    ) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        loadPage(url);
      });
    }
  });

  window.addEventListener("popstate", () => {
    loadPage(window.location.pathname);
  });

  function reInitScripts() {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
    });

    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);
  }

});


})();
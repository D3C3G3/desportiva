/* ═══════════════════════════════════════════════════
   theme.js — AutoEscuela Elite (CORREGIDO)
   Integración: Dark Mode, Sticky Header, Scroll Top y SPA
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  // 1. APLICAR TEMA ANTES DE LA CARGA (Evita el destello blanco)
  const saved = localStorage.getItem('autoelite-theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }

  document.addEventListener('DOMContentLoaded', function () {
    
    // --- ELEMENTOS CLAVE ---
    const navbar = document.querySelector('nav');
    const btnSubir = document.getElementById('btnSubirImage');
    const btnTheme = document.getElementById('themeToggle');

    // 2. LÓGICA DE SCROLL (Header dinámico y Botón Subir)
    window.addEventListener('scroll', function() {
      // Solo si existe el navbar
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Solo si existe el botón de subir
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 4. CURSOR PERSONALIZADO (Solo si ambos existen)
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');
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

    // 5. MENÚ MOBILE
    window.toggleMenu = function (event) {
      if (event) event.stopPropagation();
      const links   = document.getElementById('navLinks');
      const overlay = document.getElementById('navOverlay');
      const nav     = document.querySelector('nav');

      if (!links) return; // Validación crucial

      const isOpen = links.classList.contains('open');

      if (!isOpen) {
        if (overlay) overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          links.classList.add('open');
          if (nav) nav.classList.add('menu-abierto');
        });
      } else {
        links.classList.remove('open');
        if (nav) nav.classList.remove('menu-abierto');
        if (overlay) overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    };

    // 6. FAQ TOGGLE
    window.toggleFaq = function (el) {
      const item = el.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    };

    // 7. SCROLL REVEAL
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
          }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(el => obs.observe(el));
    }

    // 8. THEME TOGGLE (Modo Oscuro)
    if (btnTheme) {
      let isDark = document.body.classList.contains('dark');
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

  // 9. CERRAR MENÚ AL HACER CLIC FUERA
  document.addEventListener('click', function (event) {
    const links   = document.getElementById('navLinks');
    const overlay = document.getElementById('navOverlay');
    const nav     = document.querySelector('nav');
    const burger  = document.querySelector('.nav-toggle');

    if (links && links.classList.contains('open')) {
      // Solo cerramos si el click NO fue dentro del menú ni en la hamburguesa
      if (!links.contains(event.target) && (burger && !burger.contains(event.target))) {
        links.classList.remove('open');
        if (nav) nav.classList.remove('menu-abierto');
        if (overlay) overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    }
  });

  // 10. SPA + LOADER
  document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("pageLoader");
    const content = document.getElementById("appContent");

    // Lógica del Loader
    if (loader) {
      if (!sessionStorage.getItem("visited")) {
        sessionStorage.setItem("visited", "true");
        window.addEventListener("load", () => {
          setTimeout(() => loader.classList.add("hidden"), 500);
        });
      } else {
        loader.style.display = "none";
      }
    }

    // Lógica SPA (Navegación sin recargar)
    if (content) {
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
              // Reiniciar animaciones y listeners
              reInitScripts();
            }
          }, 300);

          history.pushState(null, "", url);
        } catch (err) {
          window.location.href = url;
        }
      }

      // Capturar clicks en enlaces
      document.body.addEventListener("click", e => {
        const link = e.target.closest("a");
        if (!link) return;

        const url = link.getAttribute("href");
        if (url && !url.startsWith("#") && !url.startsWith("http") && !link.hasAttribute("target")) {
          e.preventDefault();
          loadPage(url);
        }
      });

      window.addEventListener("popstate", () => loadPage(window.location.pathname));
    }

    function reInitScripts() {
      // Resetear revelaciones de scroll
      document.querySelectorAll('.reveal').forEach(el => el.classList.remove('visible'));
      // Volver a disparar DOMContentLoaded para que los observadores se aten
      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);
    }
  });

})();

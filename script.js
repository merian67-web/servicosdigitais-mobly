/* ============================================================
   MOBLY — SCRIPT.JS
   Autor: Dev Sênior (30+ anos)
   Funcionalidades:
   1. Menu mobile (toggle + fechar ao clicar em link)
   2. Header com efeito de scroll (sombra + fundo sólido)
   3. Accordion das Políticas de Privacidade (com acessibilidade)
   4. Animações de reveal ao rolar a página (IntersectionObserver)
   5. Scroll suave e fechamento de menu ao redimensionar
   ============================================================ */

(function () {
  'use strict';

  /* ===== UTILITÁRIOS ===== */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  /* ============================================================
     1. MENU MOBILE
     ============================================================ */
  const menuToggle = $('#menuToggle');
  const nav = $('#nav');

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      const icon = menuToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  }

  function toggleMenu() {
    if (!nav) return;
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    const icon = menuToggle.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar em qualquer link interno
    $$('.nav__link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Fecha ao clicar fora do menu (overlay implícito)
    document.addEventListener('click', (e) => {
      if (
        nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ============================================================
     2. HEADER COM EFEITO DE SCROLL
     ============================================================ */
  const header = $('#header');

  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader(); // executa ao carregar

  /* ============================================================
     3. ACCORDION DAS POLÍTICAS DE PRIVACIDADE
     ============================================================ */
  const privacyItems = $$('.privacy-item');

  privacyItems.forEach((item) => {
    const headerBtn = $('.privacy-item__header', item);
    const body = $('.privacy-item__body', item);

    if (!headerBtn || !body) return;

    headerBtn.addEventListener('click', () => {
      const isExpanded = headerBtn.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros itens (comportamento de accordion clássico)
      privacyItems.forEach((other) => {
        if (other === item) return;
        const otherBtn = $('.privacy-item__header', other);
        const otherBody = $('.privacy-item__body', other);
        if (otherBtn && otherBody) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBody.classList.remove('open');
        }
      });

      // Alterna o item atual
      headerBtn.setAttribute('aria-expanded', String(!isExpanded));
      body.classList.toggle('open', !isExpanded);
    });

    // Acessibilidade: abre com Enter/Espaço (já é button, mas reforçamos)
    headerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        headerBtn.click();
      }
    });
  });

  /* ============================================================
     4. ANIMAÇÕES DE REVEAL AO ROLAR A PÁGINA
     ============================================================ */
  const revealTargets = [
    '.section__header',
    '.about-card',
    '.data-item',
    '.ie-item',
    '.activity-card',
    '.contact-card',
    '.privacy-item',
    '.footer__brand',
    '.footer__links',
    '.footer__contact',
  ];

  const revealElements = $$(revealTargets.join(',')).map((el, index) => {
    el.classList.add('reveal');
    // Atraso escalonado para efeito em cascata
    el.style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`;
    return el;
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback para navegadores antigos
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  /* ============================================================
     5. SCROLL SUAVE PARA LINKS INTERNOS (fallback p/ navegadores)
     ============================================================ */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  /* ============================================================
     6. RESET DO MENU AO REDIMENSIONAR PARA DESKTOP
     ============================================================ */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) closeMenu();
    }, 150);
  });

  /* ============================================================
     7. LOG DE BOAS-VINDAS (apenas em dev)
     ============================================================ */
  console.log(
    '%c🚀 Mobly — Site institucional carregado com sucesso!',
    'background: linear-gradient(135deg,#ff6a00,#ffc107); color:#fff; padding:8px 16px; border-radius:8px; font-weight:bold; font-size:14px;'
  );
  console.log(
    '%cDesenvolvido com HTML5, CSS3 e JavaScript puro (vanilla).',
    'color:#0d1b3e; font-size:12px;'
  );
})();

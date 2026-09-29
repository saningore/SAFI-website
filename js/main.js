/**
 * SAFI Website — Main JavaScript
 */
(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const isInnerPage = document.body.classList.contains('inner-page');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (isInnerPage && header) {
    header.classList.add('header-solid', 'scrolled');
  }

  function onScroll() {
    if (!header) return;
    if (isInnerPage || window.scrollY > 60) {
      header.classList.add('scrolled');
    } else if (!isInnerPage && window.scrollY <= 60) {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMobileNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    mainNav.querySelectorAll('.nav-dropdown.open').forEach((dd) => {
      dd.classList.remove('open');
      const btn = dd.querySelector('.nav-dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function isMobileNav() {
    return window.matchMedia('(max-width: 991px)').matches;
  }

  function initNavigation() {
    if (!mainNav) return;

    /* Mobile menu toggle */
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      });
    }

    /* Dropdown toggles (mobile accordion + keyboard) */
    mainNav.querySelectorAll('.nav-dropdown-toggle').forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.nav-dropdown');
        const isOpen = dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));

        /* Close other open dropdowns on mobile */
        if (isMobileNav()) {
          mainNav.querySelectorAll('.nav-dropdown.open').forEach((dd) => {
            if (dd !== dropdown) {
              dd.classList.remove('open');
              const btn = dd.querySelector('.nav-dropdown-toggle');
              if (btn) btn.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    });

    /* Close nav when a real link is clicked */
    mainNav.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => closeMobileNav());
    });

    /* Close dropdowns when clicking outside */
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        mainNav.querySelectorAll('.nav-dropdown.open').forEach((dd) => {
          dd.classList.remove('open');
          const btn = dd.querySelector('.nav-dropdown-toggle');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    /* Escape closes menu */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  initNavigation();

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const success = contactForm.querySelector('.form-success');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        contactForm.reset();
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 800);
    });
  }
})();

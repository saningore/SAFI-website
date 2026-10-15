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
  const isImmersiveInner = document.body.classList.contains('people-page--immersive');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (isInnerPage && header && !isImmersiveInner) {
    header.classList.add('header-solid', 'scrolled');
  }

  function onScroll() {
    if (!header) return;
    if (isInnerPage && !isImmersiveInner) {
      header.classList.add('scrolled');
      return;
    }
    /* Solid header once past the hero so nav stays readable over light sections */
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function isMobileNav() {
    return window.matchMedia('(max-width: 991px)').matches;
  }

  function closeAllDropdowns(except) {
    if (!mainNav) return;
    mainNav.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
      if (except && dropdown === except) return;
      dropdown.classList.remove('open');
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function openActiveDropdowns() {
    if (!mainNav || !isMobileNav()) return;
    mainNav.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      if (toggle && toggle.classList.contains('active')) {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  function closeMobileNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    if (header) header.classList.remove('nav-open');
    closeAllDropdowns();
  }

  function initNavigation() {
    if (!mainNav) return;

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        if (header) header.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        if (isOpen) openActiveDropdowns();
        else closeAllDropdowns();
      });
    }

    mainNav.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', (e) => {
        if (!isMobileNav()) return;
        e.preventDefault();
        const willOpen = !dropdown.classList.contains('open');
        closeAllDropdowns(willOpen ? dropdown : null);
        dropdown.classList.toggle('open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
      });
    });

    mainNav.querySelectorAll('.nav-submenu a[href], .main-nav > ul > li > a[href]').forEach((link) => {
      link.addEventListener('click', () => closeMobileNav());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });

    window.addEventListener('resize', () => {
      if (!isMobileNav()) {
        closeAllDropdowns();
        closeMobileNav();
      }
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

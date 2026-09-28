/**
 * SAFI — Shared layout injection for static pages
 */
(function () {
  'use strict';

  const script = document.currentScript;
  const page = script?.dataset.page || 'home';
  const base = script?.dataset.base || '';

  const navItems = [
    { id: 'home', label: 'Home', href: `${base}index.html` },
    { id: 'about', label: 'About SAFI', href: `${base}about.html` },
    { id: 'research', label: 'Research Centres', href: `${base}research.html` },
    { id: 'programmes', label: 'Programmes', href: `${base}programmes.html` },
    { id: 'partnerships', label: 'Partnerships', href: `${base}partnerships.html` },
    { id: 'contact', label: 'Contact', href: `${base}contact.html`, cta: true },
  ];

  function isActive(id) {
    if (page === id) return true;
    if (page.startsWith('about') && id === 'about') return true;
    if (page.startsWith('research') && id === 'research') return true;
    if (page.startsWith('programmes') && id === 'programmes') return true;
    if (page === 'partnerships' && id === 'partnerships') return true;
    if (page === 'contact' && id === 'contact') return true;
    return false;
  }

  function renderNav() {
    return navItems
      .map((item) => {
        const cls = [
          isActive(item.id) ? 'active' : '',
          item.cta ? 'nav-cta' : '',
        ]
          .filter(Boolean)
          .join(' ');
        return `<li><a href="${item.href}" class="${cls}">${item.label}</a></li>`;
      })
      .join('');
  }

  const headerHtml = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header" id="header">
      <div class="header-inner container">
        <a href="${base}index.html" class="logo" aria-label="SAFI Home">
          <span class="logo-mark">SAFI</span>
          <span class="logo-text">The Savannah Futures Institute</span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="main-nav" id="mainNav" aria-label="Primary">
          <ul>${renderNav()}</ul>
        </nav>
      </div>
    </header>`;

  const footerHtml = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <span class="logo-mark">SAFI</span>
          <p>The Savannah Futures Institute is an independent African research, innovation and policy institute advancing resilient futures across inland and coastal savannas.</p>
          <p class="footer-tagline-inline">Healthy landscapes. Healthy people. Peaceful communities. Resilient futures.</p>
        </div>
        <div class="footer-links">
          <h4>Institute</h4>
          <ul>
            <li><a href="${base}about.html">About SAFI</a></li>
            <li><a href="${base}people.html">People</a></li>
            <li><a href="${base}governance.html">Governance</a></li>
            <li><a href="${base}contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Research</h4>
          <ul>
            <li><a href="${base}research.html">Research Centres</a></li>
            <li><a href="${base}research-platforms.html">Shared Platforms</a></li>
            <li><a href="${base}programmes.html">Programmes</a></li>
            <li><a href="${base}partnerships.html">Partnerships</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Knowledge</h4>
          <ul>
            <li><a href="${base}publications.html">Publications</a></li>
            <li><a href="${base}insights.html">Insights</a></li>
            <li><a href="${base}academy.html">Academy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom container">
        <p>&copy; <span id="year"></span> The Savannah Futures Institute. Registered in Ghana as a Company Limited by Guarantee.</p>
        <p class="footer-legal">Not-for-profit research and innovation organisation · Accra, Ghana</p>
      </div>
    </footer>`;

  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');

  if (headerEl) headerEl.innerHTML = headerHtml;
  if (footerEl) footerEl.innerHTML = footerHtml;
})();

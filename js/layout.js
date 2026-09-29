/**
 * SAFI — Shared layout with dropdown navigation
 */
(function () {
  'use strict';

  const script = document.currentScript;
  const page = script?.dataset.page || 'home';
  const base = script?.dataset.base || '';

  const navItems = [
    { id: 'home', label: 'Home', href: `${base}index.html` },
    {
      id: 'about',
      label: 'About',
      href: `${base}about.html`,
      children: [
        { label: 'Overview', href: `${base}about.html` },
        { label: 'Mission & Vision', href: `${base}about.html#mission-vision` },
        { label: 'People', href: `${base}people.html` },
        { label: 'Governance', href: `${base}governance.html` },
      ],
    },
    {
      id: 'research',
      label: 'Research',
      href: `${base}research.html`,
      children: [
        { label: 'Overview', href: `${base}research.html` },
        { label: 'Climate & Landscapes', href: `${base}research-climate-landscapes.html` },
        { label: 'Population Health', href: `${base}research-population-health.html` },
        { label: 'Food & Economy', href: `${base}research-food-economy.html` },
        { label: 'Peace & Borderlands', href: `${base}research-peace-borderlands.html` },
        { label: 'Indigenous Knowledge', href: `${base}research-indigenous-knowledge.html` },
        { label: 'Shared Platforms', href: `${base}research-platforms.html` },
      ],
    },
    {
      id: 'programmes',
      label: 'Programmes',
      href: `${base}programmes.html`,
      children: [
        { label: 'Overview', href: `${base}programmes.html` },
        { label: 'UNESCO Collaboration', href: `${base}programmes-unesco-collaboration.html` },
        { label: 'BAIRP (Bawku)', href: `${base}programmes-bairp.html` },
      ],
    },
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

  function renderNavItem(item) {
    const active = isActive(item.id);
    const cls = [active ? 'active' : '', item.cta ? 'nav-cta' : ''].filter(Boolean).join(' ');

    if (!item.children) {
      return `<li><a href="${item.href}" class="${cls}">${item.label}</a></li>`;
    }

    const subLinks = item.children
      .map((child) => `<li><a href="${child.href}">${child.label}</a></li>`)
      .join('');

    return `
      <li class="nav-dropdown${active ? ' active' : ''}">
        <button type="button" class="nav-dropdown-toggle${active ? ' active' : ''}" aria-expanded="false" aria-haspopup="true">
          ${item.label}
          <svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <a href="${item.href}" class="nav-dropdown-link-mobile">${item.label}</a>
        <ul class="nav-submenu" role="menu">
          ${subLinks}
        </ul>
      </li>`;
  }

  const headerHtml = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header" id="header">
      <div class="header-inner container">
        <a href="${base}index.html" class="logo" aria-label="The Savannah Futures Institute — Home">
          <span class="logo-mark">SAFI</span>
          <span class="logo-text">The Savannah Futures Institute</span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="main-nav" id="mainNav" aria-label="Primary">
          <ul>${navItems.map(renderNavItem).join('')}</ul>
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
            <li><a href="${base}about.html">About</a></li>
            <li><a href="${base}about.html#mission-vision">Mission &amp; Vision</a></li>
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

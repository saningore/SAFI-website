/**
 * SAFI — Shared layout (navigation with dropdown menus)
 */
(function () {
  'use strict';

  const script = document.currentScript;
  const page = script?.dataset.page || 'home';
  const base = script?.dataset.base || '';

  const CHEVRON =
    '<svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">' +
    '<path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const navItems = [
    {
      id: 'about',
      label: 'About',
      children: [
        { label: 'About SAFI', href: `${base}about.html`, pages: ['about'] },
        { label: 'Mission & Vision', href: `${base}about.html#mission-vision`, pages: ['about'] },
        { label: 'People', href: `${base}people.html`, pages: ['about-people'] },
        { label: 'Governance', href: `${base}governance.html`, pages: ['about-governance'] },
      ],
    },
    {
      id: 'research',
      label: 'Research',
      children: [
        { label: 'Research overview', href: `${base}research.html`, pages: ['research'] },
        {
          label: 'Climate, Environment & Landscapes',
          href: `${base}research-climate-landscapes.html`,
          pages: ['research-climate'],
        },
        {
          label: 'Population Health Innovation',
          href: `${base}research-population-health.html`,
          pages: ['research-health'],
        },
        {
          label: 'Peace, Security & Borderlands',
          href: `${base}research-peace-borderlands.html`,
          pages: ['research-peace'],
        },
        {
          label: 'Indigenous Knowledge & Culture',
          href: `${base}research-indigenous-knowledge.html`,
          pages: ['research-knowledge'],
        },
        {
          label: 'Food Futures & Economic Transformation',
          href: `${base}research-food-economy.html`,
          pages: ['research-food'],
        },
        { label: 'Shared platforms', href: `${base}research-platforms.html`, pages: ['research-platforms'] },
        {
          label: 'Food systems — field video',
          href: `${base}research-food-economy.html#food-field-video`,
          pages: ['research-food'],
        },
      ],
    },
    {
      id: 'programmes',
      label: 'Programmes',
      children: [
        { label: 'Programme overview', href: `${base}programmes.html`, pages: ['programmes'] },
        {
          label: 'UNESCO collaboration (proposed)',
          href: `${base}programmes-unesco-collaboration.html`,
          pages: ['programmes-unesco'],
        },
        { label: 'BAIRP programme concept', href: `${base}programmes-bairp.html`, pages: ['programmes-bairp'] },
      ],
    },
    { id: 'academy', label: 'Academy', href: `${base}academy.html` },
    {
      id: 'resources',
      label: 'Resources',
      children: [
        { label: 'Knowledge Hub', href: `${base}knowledge.html`, pages: ['knowledge'] },
        { label: 'Publications', href: `${base}publications.html`, pages: ['publications'] },
        { label: 'News & Insights', href: `${base}insights.html`, pages: ['insights'] },
      ],
    },
    { id: 'impact', label: 'Impact', href: `${base}impact.html` },
    { id: 'partnerships', label: 'Partnerships', href: `${base}partnerships.html` },
    { id: 'contact', label: 'Contact', href: `${base}contact.html` },
    { id: 'partner', label: 'Partner with SAFI', href: `${base}partnerships.html`, cta: true },
  ];

  function isParentActive(item) {
    if (page === item.id) return true;
    if (item.id === 'about') {
      return page === 'about' || page.startsWith('about-');
    }
    if (item.id === 'research') {
      return page === 'research' || page.startsWith('research-');
    }
    if (item.id === 'programmes') {
      return page === 'programmes' || page.startsWith('programmes-');
    }
    if (item.id === 'resources') {
      return page === 'knowledge' || page === 'publications' || page === 'insights';
    }
    if (item.id === 'partnerships' && page === 'partnerships') return true;
    if (item.id === 'partner' && page === 'partnerships') return true;
    if (item.id === 'impact' && page === 'impact') return true;
    if (item.id === 'contact' && page === 'contact') return true;
    return false;
  }

  function isChildActive(child) {
    if (!child.pages) return false;
    return child.pages.includes(page);
  }

  function renderDropdown(item) {
    const parentActive = isParentActive(item) ? ' active' : '';
    const submenu = item.children
      .map((child) => {
        const childActive = isChildActive(child) ? ' class="active"' : '';
        return `<li><a href="${child.href}"${childActive}>${child.label}</a></li>`;
      })
      .join('');
    return `<li class="nav-dropdown">
      <button type="button" class="nav-dropdown-toggle${parentActive}" aria-expanded="false" aria-haspopup="true">
        <span>${item.label}</span>${CHEVRON}
      </button>
      <ul class="nav-submenu">${submenu}</ul>
    </li>`;
  }

  function renderNav() {
    return navItems
      .map((item) => {
        if (item.cta) {
          const cls = item.id === 'partner' && page === 'partnerships' ? 'nav-cta active' : 'nav-cta';
          return `<li><a href="${item.href}" class="${cls}">${item.label}</a></li>`;
        }
        if (item.children) {
          return renderDropdown(item);
        }
        const active = isParentActive(item) ? ' active' : '';
        return `<li><a href="${item.href}" class="${active}">${item.label}</a></li>`;
      })
      .join('');
  }

  const headerHtml = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header${page === 'home' ? ' site-header--home' : ''}" id="header">
      <div class="header-inner container">
        <a href="${base}index.html" class="logo" aria-label="The Savannah Futures Institute — Home">
          <img class="logo-img" src="${base}assets/images/safi-logo.png" width="44" height="44" alt="">
          <span class="logo-text-wrap">
            <span class="logo-mark">SAFI</span>
            <span class="logo-text">The Savannah Futures Institute</span>
          </span>
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
          <img src="${base}assets/images/safi-logo.png" width="56" height="56" alt="" style="margin-bottom:1rem;filter:brightness(0) invert(1);opacity:0.9;">
          <p><strong>The Savannah Futures Institute</strong> connects knowledge, people and action to shape resilient savanna futures.</p>
          <p class="footer-tagline-inline">Healthy landscapes. Healthy people. Peaceful communities. Resilient savanna ecosystem.</p>
        </div>
        <div class="footer-links">
          <h4>Institute</h4>
          <ul>
            <li><a href="${base}about.html">About</a></li>
            <li><a href="${base}people.html">People</a></li>
            <li><a href="${base}governance.html">Governance</a></li>
            <li><a href="${base}academy.html">Academy</a></li>
            <li><a href="${base}impact.html">Impact</a></li>
            <li><a href="${base}contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Research &amp; programmes</h4>
          <ul>
            <li><a href="${base}research.html">Research</a></li>
            <li><a href="${base}programmes.html">Programmes</a></li>
            <li><a href="${base}partnerships.html">Partnerships</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Resources</h4>
          <ul>
            <li><a href="${base}knowledge.html">Knowledge Hub</a></li>
            <li><a href="${base}publications.html">Publications</a></li>
            <li><a href="${base}insights.html">News &amp; Insights</a></li>
            <li><a href="${base}academy.html">Academy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom container">
        <p>&copy; <span id="year"></span> The Savannah Futures Institute. Registered in Ghana as a Company Limited by Guarantee.</p>
        <p class="footer-legal">African-led research, innovation and action · Accra, Ghana</p>
      </div>
    </footer>`;

  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = headerHtml;
  if (footerEl) footerEl.innerHTML = footerHtml;
})();

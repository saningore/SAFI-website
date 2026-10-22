/**
 * SAFI People directory — ranked bands, search, filter and sort.
 */
(function () {
  'use strict';

  const data = window.SAFI_PEOPLE_DATA || { people: [], centres: [], tiers: [] };
  const SAFI_PEOPLE = data.people;
  const ROLE_GROUPS = data.roleGroups || [];
  const CENTRES = data.centres || [];
  const TIERS = data.tiers || [];

  const PAGE_SIZE = 18;
  const PLACEHOLDER_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';

  const els = {
    grid: document.getElementById('people-grid'),
    meta: document.getElementById('people-meta'),
    pagination: document.getElementById('people-pagination'),
    centre: document.getElementById('filter-centre'),
    role: document.getElementById('filter-role'),
    sort: document.getElementById('people-sort'),
    apply: document.getElementById('people-apply'),
    reset: document.getElementById('people-reset'),
    search: document.getElementById('people-search-input'),
    searchBtn: document.getElementById('people-search-btn'),
    searchForm: document.getElementById('people-search-form'),
  };

  if (!els.grid) return;

  let state = {
    centre: '',
    role: '',
    sort: 'listed',
    keyword: '',
    page: 1,
  };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function whatsappHref(person) {
    const digits = String(person.phone || '').replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : '';
  }

  function centreLabel(id) {
    return CENTRES.find((c) => c.id === id)?.label || id;
  }

  function roleGroupLabel(id) {
    return ROLE_GROUPS.find((r) => r.id === id)?.label || id;
  }

  function tierById(id) {
    return TIERS.find((tier) => tier.id === id);
  }

  function profileHref(person) {
    if (person.profileUrl) return person.profileUrl;
    return `people-profile.html?id=${encodeURIComponent(person.id)}`;
  }

  function populateSelect(select, options) {
    select.innerHTML = options.map((o) => `<option value="${o.id}">${o.label}</option>`).join('');
  }

  function readPageFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('current-page') || params.get('page') || '1', 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  }

  function pageCount(list) {
    const bands = TIERS.filter((tier) => tier.id && !tier.featured);
    const pages = bands.map((tier) => {
      const count = list.filter((person) => person.tier === tier.id).length;
      return Math.ceil(count / PAGE_SIZE);
    });
    return Math.max(1, ...pages);
  }

  function syncUrl() {
    const totalPages = pageCount(filteredPeople());
    const params = new URLSearchParams(window.location.search);
    if (state.page > 1 && state.page <= totalPages) {
      params.set('current-page', String(state.page));
    } else {
      params.delete('current-page');
      params.delete('page');
    }
    const qs = params.toString();
    const hash = '#listing';
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${hash}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
      history.replaceState(null, '', next);
    }
  }

  function readFiltersFromForm() {
    state.centre = els.centre.value;
    state.role = els.role.value;
    state.sort = els.sort.value;
    state.keyword = (els.search?.value || '').trim();
    state.page = 1;
    render();
  }

  function resetFilters() {
    state = { centre: '', role: '', sort: 'listed', keyword: '', page: 1 };
    els.centre.value = '';
    els.role.value = '';
    els.sort.value = 'listed';
    if (els.search) els.search.value = '';
    render();
  }

  function appointmentLabel(person) {
    if (person.formalAppointment) return person.formalAppointment;
    if (person.appointment) return `${person.appointment} appointment`;
    if (person.roleGroup) return roleGroupLabel(person.roleGroup);
    return '';
  }

  function personSearchText(person) {
    const appointmentText = (person.appointments || []).flatMap((item) => [item.label, item.text]);
    return [
      person.name,
      person.fullName,
      person.role,
      person.professionalTitle,
      person.summary,
      ...(person.secondaryRoles || []),
      person.appointment,
      person.formalAppointment,
      ...appointmentText,
      person.affiliation,
      ...(person.specialisms || []),
      ...(person.bio || []),
      person.phone,
      person.email,
      person.location,
      person.department,
      centreLabel(person.centre),
      roleGroupLabel(person.roleGroup),
      tierById(person.tier)?.label,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  function comparePeople(a, b) {
    if (state.sort === 'listed') {
      return (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    }
    const cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    return state.sort === 'name-desc' ? -cmp : cmp;
  }

  function filteredPeople() {
    const kw = state.keyword.toLowerCase();
    return SAFI_PEOPLE.filter((person) => {
      if (state.centre && person.centre !== state.centre) return false;
      if (state.role && person.tier !== state.role) return false;
      if (kw && !personSearchText(person).includes(kw)) return false;
      return true;
    });
  }

  function peopleInTier(list, tierId) {
    return list.filter((person) => person.tier === tierId).sort(comparePeople);
  }

  function photoHtml(person, size, loading) {
    if (person.photo) {
      return `<img src="${escapeHtml(person.photo)}" alt="" width="${size}" height="${size}" loading="${loading || 'lazy'}">`;
    }
    return `<span class="people-avatar-placeholder">${PLACEHOLDER_SVG}</span>`;
  }

  function renderCard(person) {
    const href = profileHref(person);
    const appointment = appointmentLabel(person);
    const wa = whatsappHref(person);
    const tel = String(person.phone || '').replace(/\s/g, '');
    const contact = [];
    if (wa && person.phone) {
      contact.push(
        `<a href="${wa}" rel="noopener noreferrer">WhatsApp</a> <a href="tel:${escapeHtml(tel)}">${escapeHtml(person.phone)}</a>`
      );
    }
    const emailLine = person.email
      ? `<p class="people-card-contact"><a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a></p>`
      : '<p class="people-card-contact people-field-pending">Official email to be added</p>';

    return `
      <article class="people-card reveal" data-id="${escapeHtml(person.id)}">
        <div class="people-card-inner">
          <div class="people-card-photo">${photoHtml(person, 72)}</div>
          <div class="people-card-body">
            <h3><a href="${href}">${escapeHtml(person.name)}</a></h3>
            ${person.role
              ? `<p class="people-card-role">${escapeHtml(person.role)}</p>`
              : '<p class="people-card-role people-field-pending">Role to be added</p>'}
            ${appointment
              ? `<p class="people-card-appointment">${escapeHtml(appointment)}</p>`
              : '<p class="people-card-contact people-field-pending">Appointment to be added</p>'}
            ${contact.length ? `<p class="people-card-contact">${contact.join('')}</p>` : ''}
            ${emailLine}
          </div>
        </div>
      </article>`;
  }

  function renderFeature(person) {
    const href = profileHref(person);
    const also = (person.secondaryRoles || []).filter(Boolean);
    return `
      <article class="people-feature reveal">
        <a class="people-feature-photo" href="${href}" tabindex="-1" aria-hidden="true">${photoHtml(person, 168, 'eager')}</a>
        <div class="people-feature-body">
          <h2><a href="${href}">${escapeHtml(person.name)}</a></h2>
          ${person.role ? `<p class="people-feature-role">${escapeHtml(person.role)}</p>` : ''}
          ${also.map((role) => `<p class="people-feature-also">${escapeHtml(role)}</p>`).join('')}
          ${person.professionalTitle ? `<p class="people-feature-title">${escapeHtml(person.professionalTitle)}</p>` : ''}
          ${person.summary ? `<p class="people-feature-summary">${escapeHtml(person.summary)}</p>` : ''}
          <p class="people-feature-more"><a href="${href}">View profile</a></p>
        </div>
      </article>`;
  }

  function renderBand(tier, people) {
    return `
      <section class="people-band" aria-labelledby="band-${escapeHtml(tier.id)}">
        <h2 id="band-${escapeHtml(tier.id)}" class="people-band-title">${escapeHtml(tier.label)}</h2>
        <div class="people-grid">${people.map(renderCard).join('')}</div>
      </section>`;
  }

  function renderEmpty() {
    const hasFilters = state.centre || state.role || state.keyword;
    const title = hasFilters ? 'No profiles match your search' : 'Team profiles publishing soon';
    const detail = hasFilters
      ? 'Try different keywords, reset filters, or check back as confirmed appointments are added.'
      : 'Confirmed appointments, biographies and photographs will appear here once approved by the Executive Director. Proposed advisers will not be listed as appointed.';

    return `
      <div class="people-empty reveal" role="status">
        <h3>${title}</h3>
        <p>${detail}</p>
      </div>`;
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      els.pagination.innerHTML = '';
      els.pagination.hidden = true;
      return;
    }
    els.pagination.hidden = false;
    let html = '';
    html += `<button type="button" data-page="prev" ${state.page <= 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>`;
    for (let i = 1; i <= totalPages; i += 1) {
      const current = i === state.page ? ' aria-current="page"' : '';
      html += `<button type="button" data-page="${i}"${current}>${i}</button>`;
    }
    html += `<button type="button" data-page="next" ${state.page >= totalPages ? 'disabled' : ''} aria-label="Next page">›</button>`;
    els.pagination.innerHTML = html;
  }

  function renderMeta(total, totalPages) {
    const profileWord = total === 1 ? 'profile' : 'profiles';
    if (total === 0) {
      els.meta.innerHTML = `<strong>0 ${profileWord}</strong> <span class="people-meta-sep">/</span> Directory ready for verified appointments`;
      return;
    }
    if (totalPages <= 1) {
      els.meta.innerHTML = `<strong>${total} ${profileWord}</strong>`;
      return;
    }
    els.meta.innerHTML = `<strong>${total} ${profileWord}</strong> <span class="people-meta-sep">/</span> ${state.page} of ${totalPages} pages`;
  }

  function revealCards() {
    els.grid.querySelectorAll('.reveal').forEach((el) => {
      requestAnimationFrame(() => el.classList.add('visible'));
    });
  }

  function render() {
    const list = filteredPeople();
    const total = list.length;
    const totalPages = pageCount(list);
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * PAGE_SIZE;

    if (total === 0) {
      els.grid.innerHTML = renderEmpty();
    } else {
      const html = TIERS.filter((tier) => tier.id).map((tier) => {
        const people = peopleInTier(list, tier.id);
        if (!people.length) return '';
        if (tier.featured) {
          if (state.page !== 1) return '';
          return people.map(renderFeature).join('');
        }
        const visible = people.slice(start, start + PAGE_SIZE);
        if (!visible.length) return '';
        return renderBand(tier, visible);
      }).join('');
      els.grid.innerHTML = html;
    }

    renderMeta(total, totalPages);
    renderPagination(totalPages);
    syncUrl();
    revealCards();
  }

  populateSelect(els.centre, CENTRES);
  populateSelect(els.role, TIERS);

  state.page = readPageFromUrl();

  els.apply.addEventListener('click', readFiltersFromForm);
  els.reset.addEventListener('click', resetFilters);
  els.sort.addEventListener('change', () => {
    state.sort = els.sort.value;
    state.page = 1;
    render();
  });

  if (els.searchForm) {
    els.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      readFiltersFromForm();
    });
  }
  if (els.searchBtn) {
    els.searchBtn.addEventListener('click', readFiltersFromForm);
  }

  els.pagination.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-page]');
    if (!btn || btn.disabled) return;
    const totalPages = pageCount(filteredPeople());
    const val = btn.dataset.page;
    if (val === 'prev') state.page = Math.max(1, state.page - 1);
    else if (val === 'next') state.page = Math.min(totalPages, state.page + 1);
    else state.page = parseInt(val, 10);
    render();
    document.getElementById('listing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
})();

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
  const EXEC_LEAD_PHOTO = 112;
  const EXEC_ORG_CENTER_PHOTO = 112;
  const EXECUTIVE_DIRECTOR_ID = 'john-atibilla';
  const INSTITUTIONAL_SUPPORT_IDS = ['francis-ayarna', 'samuel-amidini-aningore', 'philemon-a-azangbeo'];
  const LEAD_ROW_IDS = ['magdalene-ayamga', 'agoswin-musah'];
  const SECOND_ROW_IDS = [
    'desmond-bugbilla',
    'john-azaare',
    'samuel-akugri-asitanga',
  ];
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

  function centreLabel(id) {
    return CENTRES.find((c) => c.id === id)?.label || id;
  }

  function roleGroupLabel(id) {
    return ROLE_GROUPS.find((r) => r.id === id)?.label || id;
  }

  function tierById(id) {
    return TIERS.find((tier) => tier.id === id);
  }

  function displayName(person) {
    if (typeof window.SAFI_formatDisplayName === 'function') {
      return window.SAFI_formatDisplayName(person);
    }
    return person.profileHeadline || person.name;
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

  function photoHtml(person, size, loading) {
    if (person.photo) {
      return `<img src="${escapeHtml(person.photo)}" alt="" width="${size}" height="${size}" loading="${loading || 'lazy'}">`;
    }
    return `<span class="people-avatar-placeholder">${PLACEHOLDER_SVG}</span>`;
  }

  function personById(list, id) {
    return list.find((person) => person.id === id);
  }

  function renderExecutiveLead(person, slot, roleLines) {
    const href = profileHref(person);
    const isCenter = slot === 'center';
    const photoSize = isCenter ? EXEC_ORG_CENTER_PHOTO : EXEC_LEAD_PHOTO;
    const cardClass = isCenter ? ' people-executive-card--center' : '';
    const lines = roleLines && roleLines.length ? roleLines : (person.role ? [person.role] : []);
    const role = lines.length
      ? `<p class="people-feature-role">${lines.map((line) => `<span class="people-feature-role-line">${escapeHtml(line)}</span>`).join('')}</p>`
      : '';
    return `
      <article class="people-executive-card people-feature people-feature--lead${cardClass} reveal" data-id="${escapeHtml(person.id)}">
        <a class="people-feature-photo" href="${href}">${photoHtml(person, photoSize, 'eager')}</a>
        <div class="people-feature-body">
          <h2 class="people-feature-name"><a href="${href}">${escapeHtml(displayName(person))}</a></h2>
          ${role}
        </div>
      </article>`;
  }

  function renderDirectoryLeadCard(person) {
    return renderExecutiveLead(person, 'flank');
  }

  function peopleInOrder(list, ids) {
    const byId = new Map(list.map((person) => [person.id, person]));
    return ids.map((id) => byId.get(id)).filter(Boolean);
  }

  function renderDirectory(list) {
    const director = personById(list, EXECUTIVE_DIRECTOR_ID);
    const supportIds = new Set(INSTITUTIONAL_SUPPORT_IDS);
    const listed = state.sort === 'listed';
    const placed = new Set([
      EXECUTIVE_DIRECTOR_ID,
      ...INSTITUTIONAL_SUPPORT_IDS,
      ...LEAD_ROW_IDS,
      ...SECOND_ROW_IDS,
    ]);
    const support = listed
      ? peopleInOrder(list, INSTITUTIONAL_SUPPORT_IDS)
      : list.filter((person) => supportIds.has(person.id)).sort(comparePeople);
    const beside = listed ? peopleInOrder(list, LEAD_ROW_IDS) : [];
    const second = listed ? peopleInOrder(list, SECOND_ROW_IDS) : [];
    const extras = listed
      ? list.filter((person) => !placed.has(person.id)).sort(comparePeople)
      : list
          .filter((person) => person.id !== EXECUTIVE_DIRECTOR_ID && !supportIds.has(person.id))
          .sort(comparePeople);

    const researchHeading = director
      ? `<h2 class="people-research-innovation-heading">Research and Innovations</h2>`
      : '';
    const lead = director
      ? `<div class="people-flat-lead">${renderExecutiveLead(director, 'center', [
          'Executive Director',
          'Director: Climate | Landscapes | Food Systems',
        ])}</div>`
      : '';
    const leadRowCards = [lead, ...beside.map(renderDirectoryLeadCard)].filter(Boolean);
    const leadRowBlock = leadRowCards.length
      ? `<div class="people-lead-row">${leadRowCards.join('')}</div>`
      : '';
    const supportBlock = support.length
      ? `<section class="people-institutional" aria-labelledby="people-institutional-heading">
          <h2 id="people-institutional-heading" class="people-institutional-heading">Institutional Support</h2>
          <div class="people-institutional-row">${support.map(renderDirectoryLeadCard).join('')}</div>
        </section>`
      : '';
    const secondCards = second.map(renderDirectoryLeadCard).join('');
    const extrasBlock = extras.length
      ? `<div class="people-org-main"><div class="people-org-column">${extras.map(renderDirectoryLeadCard).join('')}</div></div>`
      : '';
    if (!leadRowBlock && !supportBlock && !secondCards && !extrasBlock) return '';
    const lower = secondCards || supportBlock || extrasBlock
      ? `<div class="people-org-lower">${secondCards}${supportBlock}${extrasBlock}</div>`
      : '';
    return `<div class="people-org">${researchHeading}${leadRowBlock}${lower}</div>`;
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
    if (total === 0) {
      els.grid.innerHTML = renderEmpty();
    } else {
      const html = renderDirectory(list);
      els.grid.innerHTML = html.trim() ? html : renderEmpty();
    }

    if (els.meta) els.meta.innerHTML = '';
    renderPagination(1);
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

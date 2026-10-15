/**
 * SAFI People directory — search, filter, sort and paginate (SEI-style listing).
 */
(function () {
  'use strict';

  const data = window.SAFI_PEOPLE_DATA || { people: [], centres: [], roleGroups: [] };
  const SAFI_PEOPLE = data.people;
  const ROLE_GROUPS = data.roleGroups;
  const CENTRES = data.centres;

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
    sort: 'name-asc',
    keyword: '',
    page: 1,
  };

  function centreLabel(id) {
    return CENTRES.find((c) => c.id === id)?.label || id;
  }

  function roleGroupLabel(id) {
    return ROLE_GROUPS.find((r) => r.id === id)?.label || id;
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

  function syncUrl() {
    const list = filteredPeople();
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
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
    state = { centre: '', role: '', sort: 'name-asc', keyword: '', page: 1 };
    els.centre.value = '';
    els.role.value = '';
    els.sort.value = 'name-asc';
    if (els.search) els.search.value = '';
    render();
  }

  function personSearchText(p) {
    return [
      p.name,
      p.role,
      p.location,
      p.department,
      centreLabel(p.centre),
      roleGroupLabel(p.roleGroup),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  function filteredPeople() {
    const kw = state.keyword.toLowerCase();
    return SAFI_PEOPLE.filter((p) => {
      if (state.centre && p.centre !== state.centre) return false;
      if (state.role && p.roleGroup !== state.role) return false;
      if (kw && !personSearchText(p).includes(kw)) return false;
      return true;
    }).sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      return state.sort === 'name-desc' ? -cmp : cmp;
    });
  }

  function renderCard(person) {
    const photo = person.photo
      ? `<img src="${person.photo}" alt="" width="72" height="72" loading="lazy">`
      : `<span class="people-avatar-placeholder">${PLACEHOLDER_SVG}</span>`;
    const dept = person.department || roleGroupLabel(person.roleGroup);
    const href = profileHref(person);
    const centre = centreLabel(person.centre);

    return `
      <article class="people-card reveal" data-id="${person.id}">
        <div class="people-card-inner">
          <div class="people-card-photo">${photo}</div>
          <div class="people-card-body">
            <h3><a href="${href}">${person.name}</a></h3>
            <p class="people-card-role">${person.role}</p>
            <p class="people-card-unit">${dept}</p>
            <p class="people-card-location">${centre}</p>
            ${person.location && person.location !== centre ? `<p class="people-card-location">${person.location}</p>` : ''}
          </div>
        </div>
      </article>`;
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
    els.meta.innerHTML = `<strong>${total} ${profileWord}</strong> <span class="people-meta-sep">/</span> ${state.page} of ${totalPages} pages`;
  }

  function render() {
    const list = filteredPeople();
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);

    if (total === 0) {
      els.grid.innerHTML = renderEmpty();
    } else {
      els.grid.innerHTML = pageItems.map(renderCard).join('');
    }

    renderMeta(total, totalPages);
    renderPagination(totalPages);
    syncUrl();

    els.grid.querySelectorAll('.reveal').forEach((el) => {
      requestAnimationFrame(() => el.classList.add('visible'));
    });
  }

  populateSelect(els.centre, CENTRES);
  populateSelect(els.role, ROLE_GROUPS);

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
    const list = filteredPeople();
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const val = btn.dataset.page;
    if (val === 'prev') state.page = Math.max(1, state.page - 1);
    else if (val === 'next') state.page = Math.min(totalPages, state.page + 1);
    else state.page = parseInt(val, 10);
    render();
    document.getElementById('listing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
})();

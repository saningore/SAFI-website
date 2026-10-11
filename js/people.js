/**
 * SAFI People directory — filter, sort and paginate published profiles.
 * Add entries to SAFI_PEOPLE only after leadership approval (photo + biography).
 */
(function () {
  'use strict';

  /** @type {Array<{id:string,name:string,role:string,roleGroup:string,centre:string,location:string,photo?:string,profileUrl?:string}>} */
  const SAFI_PEOPLE = [];

  const ROLE_GROUPS = [
    { id: '', label: 'All role groups' },
    { id: 'board', label: 'Board of Trustees' },
    { id: 'executive', label: 'Executive Leadership' },
    { id: 'centre', label: 'Centre Leadership' },
    { id: 'advisers', label: 'Advisers & Fellows' },
    { id: 'operations', label: 'Operations & Support' },
  ];

  const CENTRES = [
    { id: '', label: 'All centres' },
    { id: 'climate', label: 'Climate, Environment & Landscapes' },
    { id: 'health', label: 'Population Health Innovation Systems' },
    { id: 'peace', label: 'Peace, Security & Borderlands' },
    { id: 'indigenous', label: 'Indigenous Knowledge, Governance & Culture' },
    { id: 'food', label: 'Food Futures & Economic Transformation' },
    { id: 'institute', label: 'Institute leadership & operations' },
  ];

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
  };

  if (!els.grid) return;

  let state = {
    centre: '',
    role: '',
    sort: 'name-asc',
    page: 1,
  };

  function centreLabel(id) {
    return CENTRES.find((c) => c.id === id)?.label || id;
  }

  function populateSelect(select, options) {
    select.innerHTML = options.map((o) => `<option value="${o.id}">${o.label}</option>`).join('');
  }

  function readFiltersFromForm() {
    state.centre = els.centre.value;
    state.role = els.role.value;
    state.sort = els.sort.value;
    state.page = 1;
    render();
  }

  function resetFilters() {
    state = { centre: '', role: '', sort: 'name-asc', page: 1 };
    els.centre.value = '';
    els.role.value = '';
    els.sort.value = 'name-asc';
    render();
  }

  function filteredPeople() {
    return SAFI_PEOPLE.filter((p) => {
      if (state.centre && p.centre !== state.centre) return false;
      if (state.role && p.roleGroup !== state.role) return false;
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
    const nameHtml = person.profileUrl
      ? `<a href="${person.profileUrl}">${person.name}</a>`
      : person.name;

    return `
      <article class="people-card reveal" data-id="${person.id}">
        <div class="people-card-accent" aria-hidden="true"></div>
        <div class="people-card-inner">
          <div class="people-card-photo">${photo}</div>
          <div class="people-card-body">
            <h3>${nameHtml}</h3>
            <p class="people-card-role">${person.role}</p>
            <p class="people-card-unit">${centreLabel(person.centre)}</p>
            <p class="people-card-location">${person.location}</p>
          </div>
        </div>
      </article>`;
  }

  function renderEmpty() {
    const hasFilters = state.centre || state.role;
    const title = hasFilters ? 'No profiles match your filters' : 'Team profiles publishing soon';
    const detail = hasFilters
      ? 'Try resetting filters or check back as confirmed appointments are added.'
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

    const profileWord = total === 1 ? 'profile' : 'profiles';
    els.meta.textContent =
      total === 0
        ? `0 ${profileWord} · Directory ready for verified appointments`
        : `${total} ${profileWord} · Page ${state.page} of ${totalPages}`;

    renderPagination(totalPages);

    els.grid.querySelectorAll('.reveal').forEach((el) => {
      requestAnimationFrame(() => el.classList.add('visible'));
    });
  }

  populateSelect(els.centre, CENTRES);
  populateSelect(els.role, ROLE_GROUPS);

  els.apply.addEventListener('click', readFiltersFromForm);
  els.reset.addEventListener('click', resetFilters);
  els.sort.addEventListener('change', () => {
    state.sort = els.sort.value;
    render();
  });

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
    els.grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
})();

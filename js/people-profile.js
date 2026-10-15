(function () {
  'use strict';

  const data = window.SAFI_PEOPLE_DATA || { people: [], centres: [], roleGroups: [] };
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const root = document.getElementById('people-profile-root');
  const missing = document.getElementById('people-profile-missing');

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (!id || !root) {
    if (missing) missing.hidden = false;
    return;
  }

  const person = data.people.find((p) => p.id === id);
  if (!person) {
    if (missing) missing.hidden = false;
    document.title = 'Profile not found | The Savannah Futures Institute';
    return;
  }

  function centreLabel(centreId) {
    return data.centres.find((c) => c.id === centreId)?.label || centreId;
  }

  function roleGroupLabel(roleId) {
    return data.roleGroups.find((r) => r.id === roleId)?.label || roleId;
  }

  const PLACEHOLDER_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';

  document.title = `${person.name} | The Savannah Futures Institute`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `${person.name} — ${person.role} at The Savannah Futures Institute.`;

  document.getElementById('profile-name').textContent = person.name;
  document.getElementById('profile-role').textContent = person.role;
  document.getElementById('profile-dept').textContent = person.department || roleGroupLabel(person.roleGroup);
  document.getElementById('profile-centre').textContent = centreLabel(person.centre);

  const contact = document.getElementById('profile-contact');
  const items = [];
  if (person.email) {
    items.push(
      `<li><span class="people-contact-icon" aria-hidden="true">✉</span> <a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a></li>`
    );
  }
  if (person.phone) {
    const tel = person.phone.replace(/\s/g, '');
    items.push(
      `<li><span class="people-contact-icon" aria-hidden="true">☎</span> <a href="tel:${escapeHtml(tel)}">${escapeHtml(person.phone)}</a></li>`
    );
  }
  if (person.linkedin) {
    items.push(
      `<li><span class="people-contact-icon" aria-hidden="true">in</span> <a href="${escapeHtml(person.linkedin)}" rel="noopener noreferrer">LinkedIn</a></li>`
    );
  }
  contact.innerHTML = items.length ? items.join('') : '<li>Contact details will be published when approved.</li>';

  const photoEl = document.getElementById('profile-photo');
  if (person.photo) {
    photoEl.innerHTML = `<img src="${escapeHtml(person.photo)}" alt="" width="280" height="280" loading="eager">`;
  } else {
    photoEl.innerHTML = `<span class="people-avatar-placeholder">${PLACEHOLDER_SVG}</span>`;
  }

  const bioEl = document.getElementById('profile-bio');
  const paragraphs = person.bio || [];
  if (paragraphs.length) {
    bioEl.innerHTML = paragraphs.map((t) => `<p>${escapeHtml(t)}</p>`).join('');
  } else {
    bioEl.innerHTML = '<p>Biography will be published once approved.</p>';
  }

  root.hidden = false;
})();

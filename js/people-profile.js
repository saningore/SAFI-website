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

  function pending(text) {
    return `<p class="people-field-pending">${escapeHtml(text)}</p>`;
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

  const PLACEHOLDER_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';

  document.title = `${person.name} | The Savannah Futures Institute`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.content = person.role
      ? `${person.name} — ${person.role} at The Savannah Futures Institute.`
      : `${person.name} at The Savannah Futures Institute.`;
  }

  document.getElementById('profile-name').textContent = person.name;
  const roleEl = document.getElementById('profile-role');
  if (person.role) {
    roleEl.textContent = person.role;
    roleEl.classList.remove('people-field-pending');
  } else {
    roleEl.textContent = 'Role to be added';
    roleEl.classList.add('people-field-pending');
  }
  const deptEl = document.getElementById('profile-dept');
  const department = person.department || '';
  if (department && !person.role.includes(department)) {
    deptEl.textContent = department;
  } else {
    deptEl.hidden = true;
  }

  const appointmentEl = document.getElementById('profile-appointment');
  const formalAppointment = person.formalAppointment
    || (person.appointment ? `${person.appointment} appointment` : '');
  if (formalAppointment) {
    appointmentEl.textContent = formalAppointment;
    appointmentEl.classList.remove('people-field-pending');
  } else {
    appointmentEl.textContent = 'To be added';
    appointmentEl.classList.add('people-field-pending');
  }

  const affiliationEl = document.getElementById('profile-affiliation');
  if (person.affiliation) {
    affiliationEl.textContent = person.affiliation;
    affiliationEl.classList.remove('people-field-pending');
  } else {
    affiliationEl.textContent = 'To be added';
    affiliationEl.classList.add('people-field-pending');
  }

  const contact = document.getElementById('profile-contact');
  const items = [];
  const digits = String(person.phone || '').replace(/\D/g, '');
  if (digits && person.phone) {
    items.push(
      `<li><a href="tel:${escapeHtml(person.phone.replace(/\s/g, ''))}">Mobile ${escapeHtml(person.phone)}</a></li>`
    );
    items.push(
      `<li><a href="https://wa.me/${digits}" rel="noopener noreferrer">WhatsApp ${escapeHtml(person.phone)}</a></li>`
    );
  }
  if (person.email) {
    items.push(
      `<li><a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a></li>`
    );
  } else {
    items.push('<li class="people-field-pending">Official email to be added</li>');
  }
  contact.innerHTML = items.join('');

  const photoEl = document.getElementById('profile-photo');
  if (person.photo) {
    photoEl.innerHTML = `<img src="${escapeHtml(person.photo)}" alt="" width="280" height="280" loading="eager">`;
  } else {
    photoEl.innerHTML = `<span class="people-avatar-placeholder">${PLACEHOLDER_SVG}</span>`;
  }

  const bioEl = document.getElementById('profile-bio');
  const paragraphs = person.bio || [];
  bioEl.innerHTML = paragraphs.length
    ? paragraphs.map((t) => `<p>${escapeHtml(t)}</p>`).join('')
    : pending('Biography will be added when approved for publication.');

  const specialismsEl = document.getElementById('profile-specialisms');
  const specialisms = person.specialisms || [];
  specialismsEl.innerHTML = specialisms.length
    ? `<ul>${specialisms.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
    : pending('To be added.');

  const linksEl = document.getElementById('profile-links');
  const links = (person.links || []).filter((link) => link && link.url);
  if (person.linkedin) links.push({ label: 'LinkedIn', url: person.linkedin });
  if (person.orcid) links.push({ label: 'ORCID', url: person.orcid });
  linksEl.innerHTML = links.length
    ? `<ul class="people-profile-contact">${links
        .map(
          (link) =>
            `<li><a href="${escapeHtml(link.url)}" rel="noopener noreferrer">${escapeHtml(link.label || link.url)}</a></li>`
        )
        .join('')}</ul>`
    : pending('Institutional profile, ORCID or LinkedIn will be added when available.');

  root.hidden = false;
})();

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

  function showSection(section, html) {
    if (!section) return;
    if (!html) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
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

  const fullNameEl = document.getElementById('profile-full-name');
  if (fullNameEl) {
    if (person.fullName && person.fullName !== person.name) {
      fullNameEl.hidden = false;
      fullNameEl.textContent = person.fullName;
    } else {
      fullNameEl.hidden = true;
    }
  }

  const roleEl = document.getElementById('profile-role');
  if (person.role) {
    roleEl.textContent = person.role;
    roleEl.classList.remove('people-field-pending');
  } else {
    roleEl.textContent = 'Role to be added';
    roleEl.classList.add('people-field-pending');
  }

  const deptEl = document.getElementById('profile-dept');
  const secondaryRoles = (person.secondaryRoles || []).filter(Boolean);
  const department = person.department || '';
  if (secondaryRoles.length) {
    deptEl.hidden = false;
    deptEl.textContent = secondaryRoles.join('; ');
  } else if (department && !(person.role || '').includes(department)) {
    deptEl.hidden = false;
    deptEl.textContent = department;
  } else {
    deptEl.hidden = true;
  }

  const titleEl = document.getElementById('profile-professional-title');
  if (titleEl) {
    if (person.professionalTitle) {
      titleEl.hidden = false;
      titleEl.textContent = person.professionalTitle;
    } else {
      titleEl.hidden = true;
    }
  }

  const appointmentEl = document.getElementById('profile-appointment');
  const appointmentBlock = document.getElementById('profile-appointment-block');
  const appointmentItems = (person.appointments || []).filter((item) => item && item.text);
  let appointmentHtml = '';
  if (appointmentItems.length) {
    appointmentHtml = `<ul class="people-profile-appointment-list">${appointmentItems
      .map((item) => {
        const label = item.label
          ? `<span class="people-profile-appointment-label">${escapeHtml(item.label)}</span>`
          : '';
        return `<li>${label}${escapeHtml(item.text)}</li>`;
      })
      .join('')}</ul>`;
  } else {
    const formalAppointment = person.formalAppointment
      || (person.appointment ? `${person.appointment} appointment` : '');
    if (formalAppointment) appointmentHtml = `<p>${escapeHtml(formalAppointment)}</p>`;
    else if (!person.published) appointmentHtml = pending('To be added');
  }
  if (appointmentHtml) {
    if (appointmentBlock) appointmentBlock.hidden = false;
    appointmentEl.innerHTML = appointmentHtml;
  } else if (appointmentBlock) {
    appointmentBlock.hidden = true;
  }

  const affiliationEl = document.getElementById('profile-affiliation');
  const affiliationBlock = document.getElementById('profile-affiliation-block');
  if (person.affiliation) {
    if (affiliationBlock) affiliationBlock.hidden = false;
    affiliationEl.textContent = person.affiliation;
    affiliationEl.classList.remove('people-field-pending');
  } else if (person.published) {
    if (affiliationBlock) affiliationBlock.hidden = true;
  } else {
    if (affiliationBlock) affiliationBlock.hidden = false;
    affiliationEl.textContent = 'To be added';
    affiliationEl.classList.add('people-field-pending');
  }

  const contact = document.getElementById('profile-contact');
  const contactBlock = document.getElementById('profile-contact-block');
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
  } else if (!person.published) {
    items.push('<li class="people-field-pending">Official email to be added</li>');
  }
  if (items.length) {
    if (contactBlock) contactBlock.hidden = false;
    contact.innerHTML = items.join('');
  } else if (person.published) {
    if (contactBlock) contactBlock.hidden = true;
  } else {
    if (contactBlock) contactBlock.hidden = false;
    contact.innerHTML = '<li class="people-field-pending">Official email to be added</li>';
  }

  const photoEl = document.getElementById('profile-photo');
  if (person.photo) {
    photoEl.innerHTML = `<img src="${escapeHtml(person.photo)}" alt="" width="280" height="280">`;
  } else {
    photoEl.innerHTML = `<span class="people-avatar-placeholder">${PLACEHOLDER_SVG}</span>`;
  }

  const bioSection = document.getElementById('profile-bio-section');
  const bioEl = document.getElementById('profile-bio');
  const paragraphs = person.bio || [];
  if (paragraphs.length) {
    showSection(bioSection, true);
    bioEl.innerHTML = paragraphs.map((t) => `<p>${escapeHtml(t)}</p>`).join('');
  } else if (person.published) {
    showSection(bioSection, false);
  } else {
    showSection(bioSection, true);
    bioEl.innerHTML = pending('Biography will be added when approved for publication.');
  }

  const specialismsSection = document.getElementById('profile-specialisms-section');
  const specialismsEl = document.getElementById('profile-specialisms');
  const specialisms = person.specialisms || [];
  if (specialisms.length) {
    showSection(specialismsSection, true);
    specialismsEl.innerHTML = `<ul>${specialisms.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`;
  } else if (person.published) {
    showSection(specialismsSection, false);
  } else {
    showSection(specialismsSection, true);
    specialismsEl.innerHTML = pending('To be added.');
  }

  const linksSection = document.getElementById('profile-links-section');
  const linksEl = document.getElementById('profile-links');
  const links = (person.links || []).filter((link) => link && link.url);
  if (person.linkedin) links.push({ label: 'LinkedIn', url: person.linkedin });
  if (person.orcid) links.push({ label: 'ORCID', url: person.orcid });
  if (links.length) {
    showSection(linksSection, true);
    linksEl.innerHTML = `<ul class="people-profile-contact">${links
      .map(
        (link) =>
          `<li><a href="${escapeHtml(link.url)}" rel="noopener noreferrer">${escapeHtml(link.label || link.url)}</a></li>`
      )
      .join('')}</ul>`;
  } else if (person.published) {
    showSection(linksSection, false);
  } else {
    showSection(linksSection, true);
    linksEl.innerHTML = pending('Institutional profile, ORCID or LinkedIn will be added when available.');
  }

  root.hidden = false;
})();

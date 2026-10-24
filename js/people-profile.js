(function () {
  'use strict';

  const LINKS_PENDING =
    'Optional institutional profile, ORCID and LinkedIn links to be supplied.';

  const data = window.SAFI_PEOPLE_DATA || { people: [] };

  function displayName(person) {
    if (typeof window.SAFI_formatDisplayName === 'function') {
      return window.SAFI_formatDisplayName(person);
    }
    return person.profileHeadline || person.name;
  }
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const root = document.getElementById('people-profile-root');
  const missing = document.getElementById('people-profile-missing');

  const PLACEHOLDER_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';

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

  function renderSpecField(number, label, bodyHtml) {
    return `
      <section class="people-profile-spec-field" aria-labelledby="profile-field-${number}">
        <h2 class="people-profile-spec-label" id="profile-field-${number}">${escapeHtml(label)}</h2>
        <div class="people-profile-spec-value">${bodyHtml}</div>
      </section>`;
  }

  function buildPublicationTitle(person) {
    if (person.publicationTitle) return person.publicationTitle;
    if (person.professionalTitle) return `${person.name} — ${person.professionalTitle}`;
    return person.name || '';
  }

  function buildSafiRole(person) {
    if (person.safiRole) return person.safiRole;
    return [person.role, ...(person.secondaryRoles || [])].filter(Boolean).join('; ');
  }

  function buildFormalAppointmentHtml(person) {
    const items = (person.appointments || []).filter((item) => item && item.text);
    if (items.length) {
      return items
        .map((item) => {
          if (!item.label) return `<p class="people-profile-appointment-line">${escapeHtml(item.text)}</p>`;
          return `<p class="people-profile-appointment-line"><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.text)}</p>`;
        })
        .join('');
    }
    if (person.formalAppointment) {
      return `<p>${escapeHtml(person.formalAppointment)}</p>`;
    }
    if (!person.published) return pending('To be added');
    return '';
  }

  function buildAffiliationHtml(person) {
    if (person.affiliation) {
      const text = person.affiliationDisplay || person.affiliation.toUpperCase();
      return `<p>${escapeHtml(text)}</p>`;
    }
    if (!person.published) return pending('To be added');
    return pending('To be added');
  }

  function buildBioHtml(person) {
    const paragraphs = person.bio || [];
    if (paragraphs.length) {
      return paragraphs.map((t) => `<p>${escapeHtml(t)}</p>`).join('');
    }
    if (!person.published) return pending('Biography will be added when approved for publication.');
    return '';
  }

  function buildSpecialismsHtml(person) {
    const specialisms = person.specialisms || [];
    if (specialisms.length) {
      return `<ul class="people-profile-spec-list">${specialisms
        .map((t) => `<li>${escapeHtml(t)}</li>`)
        .join('')}</ul>`;
    }
    if (!person.published) return pending('To be added.');
    return '';
  }

  function buildLinksHtml(person) {
    const links = (person.links || []).filter((link) => link && link.url);
    if (person.linkedin) links.push({ label: 'LinkedIn', url: person.linkedin });
    if (person.orcid) links.push({ label: 'ORCID', url: person.orcid });
    if (links.length) {
      return `<ul class="people-profile-link-list">${links
        .map(
          (link) =>
            `<li><a href="${escapeHtml(link.url)}" rel="noopener noreferrer">${escapeHtml(link.label || link.url)}</a></li>`
        )
        .join('')}</ul>`;
    }
    return `<p class="people-field-pending">${escapeHtml(LINKS_PENDING)}</p>`;
  }

  function buildSpecFields(person) {
    const publication = buildPublicationTitle(person);
    const safiRole = buildSafiRole(person);

    return [
      renderSpecField(
        1,
        'Professional title and publication name',
        publication ? `<p>${escapeHtml(publication)}</p>` : pending('To be added')
      ),
      renderSpecField(
        2,
        'SAFI role',
        safiRole ? `<p>${escapeHtml(safiRole)}</p>` : pending('To be added')
      ),
      renderSpecField(3, 'Formal appointment', buildFormalAppointmentHtml(person) || pending('To be added')),
      renderSpecField(4, 'Affiliation', buildAffiliationHtml(person)),
      renderSpecField(5, 'Biography', buildBioHtml(person) || pending('To be added')),
      renderSpecField(
        6,
        'Specialisms',
        buildSpecialismsHtml(person) || pending('To be added.')
      ),
      renderSpecField(7, 'Links', buildLinksHtml(person)),
    ];
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

  const publicName = displayName(person);
  document.title = `${publicName} | The Savannah Futures Institute`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    const banner = person.profileRoleBanner || person.role || 'Team member';
    meta.content = `${publicName} — ${banner} at The Savannah Futures Institute.`;
  }

  document.getElementById('profile-name').textContent = publicName;

  const roleBanner = document.getElementById('profile-role-banner');
  const bannerText = person.profileRoleBanner || person.role || '';
  if (bannerText) {
    roleBanner.textContent = bannerText;
    roleBanner.hidden = false;
  } else {
    roleBanner.hidden = true;
  }

  const photoEl = document.getElementById('profile-photo');
  if (person.photo) {
    photoEl.innerHTML = `<img src="${escapeHtml(person.photo)}" alt="" width="220" height="275">`;
  } else {
    photoEl.innerHTML = `<span class="people-avatar-placeholder">${PLACEHOLDER_SVG}</span>`;
  }

  const specFields = buildSpecFields(person);
  document.getElementById('profile-spec-primary').innerHTML = specFields.slice(0, 4).join('');
  document.getElementById('profile-spec-bio').innerHTML = specFields[4] || '';
  document.getElementById('profile-spec-secondary').innerHTML = specFields.slice(5).join('');

  root.hidden = false;
})();

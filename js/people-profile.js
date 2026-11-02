(function () {
  'use strict';

  const LINKS_PENDING =
    'Institutional profile, ORCID and LinkedIn links to be added when supplied.';

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

  function renderSection(id, label, bodyHtml) {
    if (!bodyHtml) return '';
    return `
      <section class="people-profile-cv-section" aria-labelledby="profile-section-${id}">
        <h2 class="people-profile-cv-heading" id="profile-section-${id}">${escapeHtml(label)}</h2>
        <div class="people-profile-cv-section-body">${bodyHtml}</div>
      </section>`;
  }

  function renderSubheading(text) {
    return `<h3 class="people-profile-cv-subheading">${escapeHtml(text)}</h3>`;
  }

  function buildListHtml(items, className) {
    const cleaned = (items || []).filter(Boolean);
    if (!cleaned.length) return '';
    return `<ul class="${className}">${cleaned
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('')}</ul>`;
  }

  function buildTagline(person) {
    if (person.professionalTagline) return person.professionalTagline;
    if (person.professionalTitle) {
      return String(person.professionalTitle)
        .replace(/;\s*/g, ' | ')
        .replace(/\s+and\s+/gi, ' | ');
    }
    return '';
  }

  function buildRoleLine(person) {
    if (person.roleLine) return person.roleLine;
    const parts = [person.role, ...(person.secondaryRoles || [])].filter(Boolean);
    if (parts.length) return parts.join(' | ');
    if (person.safiRole) {
      const firstSentence = String(person.safiRole).split('.')[0].trim();
      return firstSentence || person.safiRole;
    }
    return '';
  }

  function buildQualificationsHtml(person) {
    return buildListHtml(person.qualifications, 'people-profile-cv-list');
  }

  function buildBioHtml(person) {
    const paragraphs = (person.bio || []).filter(Boolean);
    if (!paragraphs.length) return '';
    return paragraphs.map((t) => `<p>${escapeHtml(t)}</p>`).join('');
  }

  function buildSpecialismsHtml(person) {
    const specialisms = person.specialisms || [];
    if (!specialisms.length) return '';

    return `<ul class="people-profile-cv-list people-profile-cv-specialisms">${specialisms
      .map((item) => {
        if (item && typeof item === 'object') {
          const title = item.title || '';
          const detail = item.detail || item.text || '';
          if (title && detail) {
            return `<li><strong>${escapeHtml(title)}:</strong> ${escapeHtml(detail)}</li>`;
          }
          return `<li>${escapeHtml(title || detail)}</li>`;
        }
        return `<li>${escapeHtml(item)}</li>`;
      })
      .join('')}</ul>`;
  }

  function buildCurrentAppointmentsHtml(person) {
    const items = (person.currentAppointments || person.appointments || []).filter(
      (item) => item && (item.text || typeof item === 'string')
    );

    if (items.length) {
      return `<ul class="people-profile-cv-list">${items
        .map((item) => {
          if (typeof item === 'string') return `<li>${escapeHtml(item)}</li>`;
          if (!item.label) return `<li>${escapeHtml(item.text)}</li>`;
          return `<li><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.text)}</li>`;
        })
        .join('')}</ul>`;
    }

    if (person.formalAppointment) {
      return `<p>${escapeHtml(person.formalAppointment)}</p>`;
    }

    if (person.safiRole) {
      return `<p>${escapeHtml(person.safiRole)}</p>`;
    }

    return '';
  }

  function buildPreviousAppointmentsHtml(person) {
    const rows = (person.previousAppointments || []).filter(
      (row) => row && (row.period || row.appointment)
    );
    if (!rows.length) return '';

    return `
      <div class="people-profile-cv-table-wrap">
        <table class="people-profile-cv-table">
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th scope="col">Appointment and Institution</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>
                <th scope="row">${escapeHtml(row.period || '')}</th>
                <td>${escapeHtml(row.appointment || '')}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`;
  }

  function buildFormalAppointmentsHtml(person) {
    const currentHtml = buildCurrentAppointmentsHtml(person);
    const previousHtml = buildPreviousAppointmentsHtml(person);
    if (!currentHtml && !previousHtml) return '';

    let html = '';
    if (currentHtml) {
      html += renderSubheading('Current SAFI Appointments');
      html += currentHtml;
    }
    if (previousHtml) {
      html += renderSubheading('Previous Professional Appointments');
      html += previousHtml;
    }
    return html;
  }

  function buildRecognitionHtml(person) {
    return buildListHtml(person.recognition, 'people-profile-cv-list');
  }

  function buildAffiliationHtml(person) {
    const affiliations = (person.affiliations || []).filter(Boolean);
    if (affiliations.length) {
      return buildListHtml(affiliations, 'people-profile-cv-list');
    }
    if (person.affiliationDisplay || person.affiliation) {
      return `<p>${escapeHtml(person.affiliationDisplay || person.affiliation)}</p>`;
    }
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
    return pending(person.linksNote || LINKS_PENDING);
  }

  function buildContentHtml(person) {
    return [
      renderSection('qualifications', 'Qualifications', buildQualificationsHtml(person)),
      renderSection('biography', 'Biography', buildBioHtml(person)),
      renderSection('specialisms', 'Specialisms', buildSpecialismsHtml(person)),
      renderSection('appointments', 'Formal Appointments', buildFormalAppointmentsHtml(person)),
      renderSection(
        'recognition',
        'Selected Professional Recognition',
        buildRecognitionHtml(person)
      ),
      renderSection('affiliations', 'Affiliations', buildAffiliationHtml(person)),
      renderSection('links', 'Professional Links', buildLinksHtml(person)),
    ]
      .filter(Boolean)
      .join('');
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

  const taglineEl = document.getElementById('profile-tagline');
  const tagline = buildTagline(person);
  if (tagline) {
    taglineEl.textContent = tagline;
    taglineEl.hidden = false;
  } else {
    taglineEl.hidden = true;
  }

  const roleLineEl = document.getElementById('profile-roleline');
  const roleLine = buildRoleLine(person);
  if (roleLine) {
    roleLineEl.textContent = roleLine;
    roleLineEl.hidden = false;
  } else {
    roleLineEl.hidden = true;
  }

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

  document.getElementById('profile-content').innerHTML = buildContentHtml(person);
  if (missing) missing.hidden = true;
  root.hidden = false;
})();

/**
 * Display names for the people directory and profile pages.
 */
(function (global) {
  'use strict';

  function hasDoctorTitle(name) {
    return /^Dr\.?\s/i.test(String(name || '').trim());
  }

  function formatDoctorDisplayName(person) {
    if (person.displayName) return person.displayName;
    const name = person.name || '';
    if (!hasDoctorTitle(name)) return person.profileHeadline || person.name || '';

    const withoutTitle = name.replace(/^Dr\.?\s*/i, '').trim();
    return withoutTitle ? `${withoutTitle} PhD` : name;
  }

  function formatDisplayName(person) {
    if (!person) return '';
    if (hasDoctorTitle(person.name)) return formatDoctorDisplayName(person);
    return person.profileHeadline || person.name || '';
  }

  global.SAFI_formatDisplayName = formatDisplayName;
  global.SAFI_hasDoctorTitle = hasDoctorTitle;
})(typeof window !== 'undefined' ? window : globalThis);

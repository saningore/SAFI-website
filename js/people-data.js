/**
 * Published people directory data — add entries only after leadership approval.
 * Awini Azure is a placeholder profile for layout and UX review (replace before launch).
 */
(function (global) {
  'use strict';

  global.SAFI_PEOPLE_DATA = {
    people: [
      {
        id: 'awini-azure',
        name: 'Awini Azure',
        role: 'Director of Partnerships and Knowledge Exchange',
        roleGroup: 'executive',
        department: 'Partnerships & engagement',
        centre: 'institute',
        location: 'Accra, Ghana · SAFI Headquarters',
        email: 'awini.azure@savannahfutures.org',
        phone: '+233 30 000 0000',
        photo: 'assets/images/people/photo-01-57-05.png',
        bio: [
          'Awini Azure leads partnership development and knowledge exchange at The Savannah Futures Institute, connecting research teams with universities, public institutions, communities and international collaborators across Africa\'s savannas.',
          'Her work focuses on translating interdisciplinary evidence into practical programmes — from climate-smart landscapes and food futures to health innovation and peaceful borderland governance — while ensuring community voices and indigenous knowledge remain central to SAFI\'s approach.',
          'Before joining SAFI, she coordinated multi-country research consortia on sustainable land use and rural enterprise in West Africa, and advised regional bodies on stakeholder engagement for environmental policy.',
        ],
      },
    ],
    roleGroups: [
      { id: '', label: 'All departments' },
      { id: 'board', label: 'Board of Trustees' },
      { id: 'executive', label: 'Executive Leadership' },
      { id: 'centre', label: 'Centre Leadership' },
      { id: 'advisers', label: 'Advisers & Fellows' },
      { id: 'operations', label: 'Operations & Support' },
    ],
    centres: [
      { id: '', label: 'All centres' },
      { id: 'climate', label: 'Climate, Environment & Landscapes' },
      { id: 'health', label: 'Population Health Innovation Systems' },
      { id: 'peace', label: 'Peace, Security & Borderlands' },
      { id: 'indigenous', label: 'Indigenous Knowledge, Governance & Culture' },
      { id: 'food', label: 'Food Futures & Economic Transformation' },
      { id: 'institute', label: 'Institute leadership & operations' },
    ],
  };
})(typeof window !== 'undefined' ? window : globalThis);

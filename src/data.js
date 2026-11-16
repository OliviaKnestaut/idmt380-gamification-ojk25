export const STORAGE_KEY = 'ready-plan-form';

export const coverIntro = [
  'Build your emergency plan one small step at a time. Add the details your household will need to reconnect, make safe decisions, and support one another during an emergency.',
].join('');

export const sectionDescriptions = {
  contacts: [
    'List the people your household may need to reach, including family members ',
    'and trusted emergency contacts outside your home.',
  ].join(''),
  plans: [
    'Capture the organizations and plans you may rely on, along with the ',
    'instructions and contact details that will help you act quickly.',
  ].join(''),
  meetings: [
    'Choose places where everyone can reconnect if you are separated at home, ',
    'in your neighborhood, or across town.',
  ].join(''),
  medical: [
    'Record care teams, allergies, prescriptions, insurance, and equipment so ',
    'important medical information is ready when you need it.',
  ].join(''),
  review: [
    'Take one final look at every answer. Blank fields remain visible so you can ',
    'spot anything your household still wants to add before finishing.',
  ].join(''),
};

export const steps = [
  'Household',
  'Contacts',
  'Plans',
  'Meeting places',
  'Medical',
  'Review',
];

export const states = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
  ['DC', 'District of Columbia'],
];

export const blank = {
  household: {
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  },
  members: [
    {
      name: '',
      mobile: '',
      otherPhone: '',
      email: '',
      address: '',
      notes: '',
    },
  ],
  contacts: [
    {
      name: '',
      mobile: '',
      otherPhone: '',
      email: '',
      address: '',
      notes: '',
    },
  ],
  plans: [
    {
      name: '',
      address: '',
      phone: '',
      otherPhone: '',
      website: '',
      details: '',
    },
  ],
  meetings: [{ name: '', address: '', instructions: '' }],
  doctors: [{ type: '', name: '', phone: '', address: '' }],
  allergies: [{ member: '', allergies: '', prescriptions: '' }],
  insurance: [{ name: '', policy: '', notes: '' }],
  equipment: '',
};

const repeatableSections = [
  'members',
  'contacts',
  'plans',
  'meetings',
  'doctors',
  'allergies',
  'insurance',
];

export function loadData() {
  try {
    const saved = {
      ...blank,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
    };

    repeatableSections.forEach((section) => {
      const entries = saved[section];
      const allBlank = entries?.every((item) =>
        Object.values(item).every((value) => !value),
      );

      if (entries?.length > 1 && allBlank) {
        saved[section] = [entries[0]];
      }
    });

    return saved;
  } catch {
    return blank;
  }
}

import { createContext, useContext, useReducer, useMemo } from 'react';

export const PALETTE = [
  { name: 'Crimson',  hex: '#8B1A1A' },
  { name: 'Golden',   hex: '#C9A227' },
  { name: 'Amber',    hex: '#E07B2A' },
  { name: 'Midnight', hex: '#1A1A1A' },
  { name: 'Cream',    hex: '#F5DEB3' },
  { name: 'Pearl',    hex: '#E8E4E0' },
  { name: 'Sienna',   hex: '#8B4513' },
  { name: 'Forest',   hex: '#2D5A3D' },
];

export const GUEST_TIERS = [
  { label: 'Starter',  guests: 20,  price: 180  },
  { label: 'Classic',  guests: 30,  price: 270  },
  { label: 'Premium',  guests: 50,  price: 450  },
  { label: 'Large',    guests: 80,  price: 720  },
  { label: 'Grand',    guests: 100, price: 900  },
  { label: 'Elite',    guests: 150, price: 1350 },
];

export const SERVICES = [
  {
    id: 'main-menu',
    name: 'Main Menu',
    desc: 'Large portions of our dishes, perfect for feeding a crowd. Order any combination of rice, proteins, soups & sides. Minimum order £150, free delivery until 31 Aug 2026.',
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'food-boxes',
    name: 'Individual Food Boxes',
    desc: 'Individually packed meals, ideal when you want each guest to have their own box. £15 per box, minimum 10 boxes. At least 1 week\'s notice required.',
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'grazing-table',
    name: 'Grazing Tables',
    desc: 'Canapés, bowl food and desserts, fully styled to your event\'s colour palette. A beautiful display designed around your event. Minimum 3 weeks\' notice.',
    img: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80&auto=format&fit=crop',
  },
];

export const STYLES = [
  {
    id: 'traditional',
    name: 'Traditional Heritage',
    tag: 'AUTHENTIC & WARM',
    desc: 'Earth-toned linens, hand-carved accents, and woven textures inspired by West African artistry.',
    img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 'minimalist',
    name: 'Modern Minimalist',
    tag: 'CLEAN & SLEEK',
    desc: 'Monochromatic palette, architectural serving pieces, and spacious negative-space layouts.',
    img: 'https://images.unsplash.com/photo-1517456480724-33fa07bf7949?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 'vibrant',
    name: 'Vibrant Celebration',
    tag: 'JOYOUS & BOLD',
    desc: 'High-contrast patterns, tropical flora, and an explosion of celebratory colors and textures.',
    img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&q=80&auto=format&fit=crop',
  },
];

export const MENU_SECTIONS = [
  {
    id: 'abula-station',
    label: 'Abula Station',
    subtitle: '£13 per person · MOQ 50 people',
    img: '/image 4.jpg',
    countInServings: true,
    items: [
      { id: 'abula-station', name: 'Abula Station', price: 13, unit: 'person', min: 50 },
    ],
  },
  {
    id: 'canapes',
    label: 'Canapés',
    subtitle: 'Priced per piece · MOQ 20 per item',
    img: '/image 2.jpg',
    countInServings: true,
    items: [
      { id: 'puff-puff',       name: 'Puff Puff',            price: 0.50, unit: 'piece',   min: 20 },
      { id: 'spring-rolls',    name: 'Spring Rolls',         price: 0.50, unit: 'piece',   min: 20 },
      { id: 'samosas',         name: 'Samosas',              price: 1.00, unit: 'piece',   min: 20 },
      { id: 'shawarma-rolls',  name: 'Mini Shawarma Rolls',  price: 2.00, unit: 'roll',    min: 20 },
      { id: 'fried-plantain',  name: 'Fried Plantain',       price: 1.00, unit: 'serving', min: 20 },
      { id: 'chicken-waffles', name: 'Chicken & Waffles',    price: 3.50, unit: 'portion', min: 20 },
      { id: 'bbq-niblets',     name: 'BBQ Chicken Niblets',  price: 1.50, unit: 'piece',   min: 20 },
      { id: 'suya-wings',      name: 'Suya Chicken Wings',   price: 1.50, unit: 'wing',    min: 20 },
      { id: 'corn-cob',        name: 'Corn on the Cob',      price: 1.00, unit: 'piece',   min: 20 },
    ],
  },
  {
    id: 'bowl-food',
    label: 'Bowl Food',
    subtitle: 'Priced per portion · MOQ 20 portions',
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=900&q=80&auto=format&fit=crop',
    countInServings: true,
    items: [
      { id: 'jollof-rice-bowl',   name: 'Jollof Rice',                 price: 4.00, unit: 'portion', min: 20 },
      { id: 'fried-rice-bowl',    name: 'Fried Rice',                  price: 3.50, unit: 'portion', min: 20 },
      { id: 'rice-peas-goat',     name: 'Rice & Peas with Curry Goat', price: 4.00, unit: 'portion', min: 20 },
      { id: 'gizdodo-bowl',       name: 'Gizdodo',                     price: 3.00, unit: 'portion', min: 20 },
      { id: 'peppered-chk-bowl',  name: 'Peppered Chicken',            price: 2.50, unit: 'piece',   min: 20 },
      { id: 'peppered-beef',      name: 'Peppered Beef',               price: 2.50, unit: 'portion', min: 20 },
      { id: 'peppered-fish',      name: 'Peppered Fish',               price: 3.50, unit: 'portion', min: 20 },
    ],
  },
  {
    id: 'sweets-desserts',
    label: 'Sweets & Desserts',
    subtitle: 'Priced per box or serving dish · Feeds 10–12 per dish',
    img: '/image 1.jpg',
    countInServings: false,
    items: [
      { id: 'brookies-6',      name: 'Cookie Butter Brookies (Box of 6)',  price: 25, unit: 'box',  min: 1 },
      { id: 'brookies-12',     name: 'Cookie Butter Brookies (Box of 12)', price: 38, unit: 'box',  min: 1 },
      { id: 'berry-cream',     name: 'Berry Me in Cream',                  price: 35, unit: 'dish', min: 1 },
      { id: 'red-y-not',       name: 'Red-y or Not',                       price: 35, unit: 'dish', min: 1 },
      { id: 'tiramisu-crazy',  name: 'Tirr-a-mi-crazyy',                   price: 35, unit: 'dish', min: 1 },
      { id: 'choc-dream',      name: 'Chocolate Dream',                    price: 40, unit: 'dish', min: 1 },
      { id: 'creme-brulee',    name: 'Crème Brûlée Cheesecake',            price: 40, unit: 'dish', min: 1 },
    ],
  },
];

export const BRUNCH_PACKAGES = {
  nigerian: [
    { guests: 20,  price: 500,  name: 'Nigerian Traditional Breakfast (Tier 20)',  desc: 'Includes Akara, Yam Fries, Spicy Omelette, and Artisan Bread. Plus Pap or Custard station.', tags: ['Includes Staff', 'Live Station'] },
    { guests: 50,  price: 1250, name: 'Nigerian Traditional Breakfast (Tier 50)',  desc: 'Includes Akara, Yam Fries, Spicy Omelette, and Artisan Bread. Plus Pap or Custard station.', tags: ['Includes Staff', 'Live Station'] },
    { guests: 100, price: 2500, name: 'Nigerian Traditional Breakfast (Tier 100)', desc: 'Full breakfast spread with live cooking stations, Akara, Yam Fries, and Custard station.', tags: ['Includes Staff', 'Live Station', 'Premium'] },
    { guests: 150, price: 3750, name: 'Nigerian Traditional Breakfast (Tier 150)', desc: 'Grand breakfast event with multiple live stations and dedicated service team.', tags: ['Includes Staff', 'Live Station', 'Premium', 'Dedicated Team'] },
  ],
  western: [
    { guests: 20,  price: 400,  name: 'Western Brunch (Tier 20)',  desc: 'Classic western brunch with eggs benedict, avocado toast, pastry selection, and fresh juice.', tags: ['Includes Staff'] },
    { guests: 50,  price: 1000, name: 'Western Brunch (Tier 50)',  desc: 'Full western brunch spread with hot and cold stations, pastries, and premium juices.', tags: ['Includes Staff', 'Live Station'] },
    { guests: 100, price: 2000, name: 'Western Brunch (Tier 100)', desc: 'Premium western brunch with multiple hot stations and barista coffee service.', tags: ['Includes Staff', 'Live Station', 'Premium'] },
    { guests: 150, price: 3000, name: 'Western Brunch (Tier 150)', desc: 'Grand western brunch event with full service team and tailored menu.', tags: ['Includes Staff', 'Live Station', 'Premium', 'Dedicated Team'] },
  ],
};

export const FS_PACKAGES = [
  {
    id: 'standard',
    name: '1 Course',
    badge: 'Standard',
    badgeCls: 'bg-dark text-white',
    desc: 'Choice of Main Entrée with traditional African sides.',
    pricePerGuest: 45,
    allocation: { starters: 0, mains: 1, desserts: 0 },
    features: [
      { label: 'Main Entrée', ok: true },
      { label: '2 Signature Sides', ok: true },
      { label: 'No Appetizers', ok: false },
    ],
    icon: 'burger',
  },
  {
    id: 'popular',
    name: '2 Courses',
    badge: 'Most Popular',
    badgeCls: 'bg-primary text-white',
    desc: 'Balanced experience with appetizers and mains.',
    pricePerGuest: 65,
    allocation: { starters: 1, mains: 2, desserts: 0 },
    features: [
      { label: 'Choice of Appetizer', ok: true },
      { label: 'Main Entrée + 3 Sides', ok: true },
      { label: 'Table Refreshments', ok: true },
    ],
    icon: 'fork',
  },
  {
    id: 'premium',
    name: '3 Courses',
    badge: 'Premium',
    badgeCls: 'bg-gold text-dark',
    desc: 'The full journey including starters, mains, and desserts.',
    pricePerGuest: 85,
    allocation: { starters: 1, mains: 2, desserts: 1 },
    features: [
      { label: 'Starter & Appetizers', ok: true },
      { label: 'Signature Main Entrée', ok: true },
      { label: 'Gourmet Dessert', ok: true },
    ],
    icon: 'plate',
  },
];

export const FS_MENU = {
  starters: {
    label: 'Starters',
    items: [
      { id: 'suya-skewers', name: 'Spiced Beef Suya Skewers', badge: 'Signature', desc: 'Thinly sliced beef marinated in a complex kuli-kuli peanut spice blend, flame-grilled to smoky perfection.', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80&auto=format&fit=crop' },
      { id: 'injera-wraps', name: 'Mini Injera Wraps', badge: null, desc: 'Bite-sized fermented teff bread rolls filled with savory Misir Wot and Gomen stews.', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80&auto=format&fit=crop' },
      { id: 'heritage-platter', name: 'Heritage Starter Platter', badge: null, desc: 'A curated board of Suya Wagyu sliders, Mini Kelewele, and Puff-Puff bites.', img: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=500&q=80&auto=format&fit=crop' },
    ],
  },
  mains: {
    label: 'Main Courses',
    items: [
      { id: 'jollof-rice', name: 'Smoky Party Jollof Rice', badge: null, desc: 'Long-grain parboiled rice slow-cooked in a rich tomato, pepper, and onion reduction.', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&q=80&auto=format&fit=crop' },
      { id: 'lamb-curry', name: 'Cape Malay Lamb Curry', badge: null, desc: 'A sweet and spicy aromatic curry featuring tender lamb, apricots, and warming spices.', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80&auto=format&fit=crop' },
      { id: 'royal-main', name: 'The Royal Main', badge: "Chef's Pick", desc: 'Signature Smoked Jollof Rice with grilled chicken, crispy plantain, and house pepper sauce.', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80&auto=format&fit=crop' },
    ],
  },
  desserts: {
    label: 'Desserts',
    items: [
      { id: 'malva-pudding', name: 'Classic Malva Pudding', badge: null, desc: 'Sweet, apricot-infused caramelized sponge pudding served warm with vanilla cream.', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80&auto=format&fit=crop' },
      { id: 'chin-chin', name: 'Chin-Chin & Puff-Puff Basket', badge: null, desc: 'A sharing basket of crispy fried dough bites, sweet and lightly spiced.', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80&auto=format&fit=crop' },
    ],
  },
};

export const PLATTER_TRAYS = [
  {
    id: 'jollof-tray',
    name: 'Smokey Jollof Tray',
    badge: 'Bestseller',
    desc: 'Our signature firewood-flavored jollof rice served with your choice of protein.',
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&q=80&auto=format&fit=crop',
    volumes: [
      { label: '3L',  price: 45  },
      { label: '6L',  price: 85  },
      { label: '12L', price: 165 },
      { label: '24L', price: 320 },
    ],
  },
  {
    id: 'egusi-tray',
    name: 'Egusi & Pounded Yam',
    badge: null,
    desc: 'Rich melon seed soup with spinach and assorted meats. Served with fluffy yam.',
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80&auto=format&fit=crop',
    volumes: [
      { label: '3L',  price: 55  },
      { label: '6L',  price: 105 },
      { label: '12L', price: 200 },
      { label: '24L', price: 390 },
    ],
  },
];

export const PLATTER_SMALL_CHOPS = {
  id: 'signature-mix',
  name: 'Signature Mix Box',
  desc: 'A curated selection of Puff-Puff, Samosas, Spring Rolls, and Peppered Gizzard. Our most popular appetizer option.',
  img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80&auto=format&fit=crop',
  tiers: [
    { pcs: 10,  pricePerPc: 2.50 },
    { pcs: 20,  pricePerPc: 2.25 },
    { pcs: 30,  pricePerPc: 2.00 },
    { pcs: 100, pricePerPc: 1.80 },
  ],
};

export const PLATTER_BRUNCH = [
  {
    id: 'naija-morning',
    name: 'The Naija Morning',
    desc: 'Yam chips, plantain, egg sauce with peppers, and freshly made Akara. Includes tea & coffee service.',
    pricePerGuest: 22.50,
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 'continental-lux',
    name: 'The Continental Lux',
    desc: 'Smashed avocado toast, smoked salmon bagels, seasonal fruit platter, and artisanal pastries.',
    pricePerGuest: 28.00,
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80&auto=format&fit=crop',
  },
];

export const MAIN_MENU_SECTIONS = [
  {
    id: 'rice',
    label: 'Rice Dishes',
    note: 'All rice dishes come in a 5L pot · Feeds 20–25',
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=900&q=80&auto=format&fit=crop',
    items: [
      { id: 'white-rice',  name: 'White Rice',  price: 45, size: '5L · Feeds 20–25' },
      { id: 'jollof-rice', name: 'Jollof Rice', price: 80, size: '5L · Feeds 20–25' },
      { id: 'fried-rice',  name: 'Fried Rice',  price: 75, size: '5L · Feeds 20–25' },
      { id: 'rice-peas',   name: 'Rice & Peas', price: 65, size: '5L · Feeds 20–25' },
    ],
  },
  {
    id: 'proteins',
    label: 'Proteins',
    note: null,
    img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=900&q=80&auto=format&fit=crop',
    items: [
      { id: 'grilled-chicken',  name: 'Grilled Chicken',  price: 80, size: '30 pieces' },
      { id: 'peppered-chicken', name: 'Peppered Chicken', price: 90, size: '30 pieces' },
      { id: 'grilled-wings',    name: 'Grilled Wings',    price: 40, size: '18–20 wings' },
      { id: 'peppered-wings',   name: 'Peppered Wings',   price: 50, size: '18–20 wings' },
      { id: 'bbq-wings',        name: 'BBQ Wings',        price: 45, size: '18–20 wings' },
      { id: 'grilled-turkey',   name: 'Grilled Turkey',   price: 75, size: '20 servings' },
      { id: 'peppered-turkey',  name: 'Peppered Turkey',  price: 85, size: '20 servings' },
    ],
  },
  {
    id: 'soups',
    label: 'Soups & Stews',
    note: 'All soups and stews come in a 4L tub',
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80&auto=format&fit=crop',
    items: [
      { id: 'egusi',         name: 'Egusi',           price: 95,  size: '4L' },
      { id: 'assorted-okro', name: 'Assorted Okro',   price: 80,  size: '4L' },
      { id: 'red-ofada',     name: 'Red Ofada Sauce', price: 80,  size: '4L' },
      { id: 'beef-obe-ata',  name: 'Beef Obe Ata',    price: 110, size: '4L' },
      { id: 'chicken-stew',  name: 'Chicken Stew',    price: 70,  size: '4L' },
      { id: 'turkey-stew',   name: 'Turkey Stew',     price: 70,  size: '4L' },
      { id: 'fish-obe-ata',  name: 'Fish Obe Ata',    price: 95,  size: '4L' },
      { id: 'curry-goat',    name: 'Curry Goat',      price: 85,  size: '4L' },
    ],
  },
  {
    id: 'sides',
    label: 'Sides',
    note: null,
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80&auto=format&fit=crop',
    items: [
      { id: 'gizdodo',             name: 'Gizdodo',                  price: 65, size: '4L' },
      { id: 'coleslaw',            name: 'Coleslaw',                 price: 50, size: 'Feeds ~100' },
      { id: 'plain-puff-puff',     name: 'Plain Puff Puff',          price: 35, size: '60 pieces' },
      { id: 'cinnamon-puff-puff',  name: 'Cinnamon Sugar Puff Puff', price: 40, size: '60 pieces' },
    ],
  },
];

export const FOOD_BOXES = [
  {
    id: 'jollof',
    name: 'Jollof Box',
    price: 15,
    contents: ['Jollof rice', 'Grilled chicken', 'Fried plantain'],
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'fried-rice',
    name: 'Fried Rice Box',
    price: 15,
    contents: ['Fried rice', 'Grilled chicken', 'Fried plantain'],
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'half-half',
    name: 'Half & Half Box',
    price: 15,
    contents: ['Jollof + fried rice', 'Grilled chicken', 'Fried plantain'],
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop',
  },
];

const initialState = {
  step: 1,
  service: null,
  guestCount: 50,
  guestTier: GUEST_TIERS[2],
  style: null,
  primaryColor: PALETTE[0],
  accentColor: PALETTE[1],
  menuItems: {},
  addedPackages: [],
  brunchType: 'nigerian',
  brunchGuests: 50,
  budget: 2500,
  kitchenStatus: null,
  setupTime: '2hrs',
  accessNotes: '',
  staffCount: 4,
  staffHours: 6,
  details: {
    name: '', email: '', phone: '',
    eventType: 'Wedding Reception',
    eventDate: '', startTime: '', venue: '',
    deliveryTime: '', occasionNotes: '',
    dietary: [], allergyDetails: '',
  },
  platterStep: 1,
  platterFulfillment: 'delivery',
  platterGuests: 10,
  platterDate: '',
  platterAddress: '',
  platterSpecialInstructions: '',
  platterBasket: [],
  platterContact: { name: '', email: '', phone: '' },
  fsStep: 1,
  fsPackage: null,
  fsGuests: 25,
  fsSelectedItems: { starters: [], mains: [], desserts: [] },
  fsDetails: {
    name: '', email: '', phone: '',
    eventType: 'Wedding Reception',
    eventDate: '', startTime: '', venue: '',
    dietary: '',
  },

  // Main Menu flow
  mainMenuStep: 1,
  mainMenuFulfillment: 'delivery',
  mainMenuDate: '',
  mainMenuAddress: '',
  mainMenuNotes: '',
  mainMenuItems: {},
  mainMenuContact: { name: '', email: '', phone: '' },

  // Food Box flow
  foodBoxStep: 1,
  foodBoxBoxes: { jollof: 0, 'fried-rice': 0, 'half-half': 0 },
  foodBoxDate: '',
  foodBoxContact: { name: '', email: '', phone: '' },
  foodBoxNotes: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':         return { ...state, step: action.payload };
    case 'SET_SERVICE':      return { ...state, service: action.payload };
    case 'SET_GUEST_COUNT':  return { ...state, guestCount: action.payload };
    case 'SET_GUEST_TIER':   return { ...state, guestTier: action.payload };
    case 'SET_STYLE':        return { ...state, style: action.payload };
    case 'SET_PRIMARY':      return { ...state, primaryColor: action.payload };
    case 'SET_ACCENT':       return { ...state, accentColor: action.payload };
    case 'UPDATE_MENU_QTY': {
      const { id, qty } = action.payload;
      const next = { ...state.menuItems };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      return { ...state, menuItems: next };
    }
    case 'TOGGLE_PACKAGE': {
      const pkg = action.payload;
      const exists = state.addedPackages.find(p => p.name === pkg.name);
      return {
        ...state,
        addedPackages: exists
          ? state.addedPackages.filter(p => p.name !== pkg.name)
          : [...state.addedPackages, pkg],
      };
    }
    case 'SET_BRUNCH_TYPE':   return { ...state, brunchType: action.payload };
    case 'SET_BRUNCH_GUESTS': return { ...state, brunchGuests: action.payload };
    case 'SET_LOGISTICS':     return { ...state, ...action.payload };
    case 'UPDATE_DETAILS':    return { ...state, details: { ...state.details, ...action.payload } };
    case 'SET_PLATTER_STEP':  return { ...state, platterStep: action.payload };
    case 'SET_PLATTER_FIELD': return { ...state, [action.payload.key]: action.payload.val };
    case 'ADD_TO_PLATTER': {
      const idx = state.platterBasket.findIndex(i => i.id === action.payload.id);
      if (idx >= 0) {
        const updated = [...state.platterBasket];
        updated[idx] = action.payload;
        return { ...state, platterBasket: updated };
      }
      return { ...state, platterBasket: [...state.platterBasket, action.payload] };
    }
    case 'REMOVE_FROM_PLATTER': return { ...state, platterBasket: state.platterBasket.filter(i => i.id !== action.payload) };
    case 'UPDATE_PLATTER_CONTACT': return { ...state, platterContact: { ...state.platterContact, ...action.payload } };
    case 'SET_FS_STEP':    return { ...state, fsStep: action.payload };
    case 'SET_FS_PACKAGE': return { ...state, fsPackage: action.payload, fsSelectedItems: { starters: [], mains: [], desserts: [] } };
    case 'SET_FS_GUESTS':  return { ...state, fsGuests: action.payload };
    case 'TOGGLE_FS_ITEM': {
      const { category, id, max } = action.payload;
      const current = state.fsSelectedItems[category];
      const isOn = current.includes(id);
      const next = isOn ? current.filter(i => i !== id) : current.length < max ? [...current, id] : [...current.slice(1), id];
      return { ...state, fsSelectedItems: { ...state.fsSelectedItems, [category]: next } };
    }
    case 'UPDATE_FS_DETAILS': return { ...state, fsDetails: { ...state.fsDetails, ...action.payload } };

    // Main Menu flow
    case 'SET_MAIN_MENU_STEP':   return { ...state, mainMenuStep: action.payload };
    case 'SET_MAIN_MENU_FIELD':  return { ...state, [action.payload.key]: action.payload.val };
    case 'UPDATE_MAIN_MENU_ITEM': {
      const { id, qty } = action.payload;
      const next = { ...state.mainMenuItems };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      return { ...state, mainMenuItems: next };
    }
    case 'UPDATE_MAIN_MENU_CONTACT': return { ...state, mainMenuContact: { ...state.mainMenuContact, ...action.payload } };

    // Food Box flow
    case 'SET_FOOD_BOX_STEP':    return { ...state, foodBoxStep: action.payload };
    case 'SET_FOOD_BOX_FIELD':   return { ...state, [action.payload.key]: action.payload.val };
    case 'UPDATE_FOOD_BOX_QTY':  return { ...state, foodBoxBoxes: { ...state.foodBoxBoxes, [action.payload.id]: Math.max(0, action.payload.qty) } };
    case 'UPDATE_FOOD_BOX_CONTACT': return { ...state, foodBoxContact: { ...state.foodBoxContact, ...action.payload } };

    default: return state;
  }
}

const OrderContext = createContext(null);

export function OrderProvider({ children, menuSections: menuSectionsProp, fsPackages: fsPackagesProp, staffConfig: staffConfigProp }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeSections = menuSectionsProp || MENU_SECTIONS;
  const activePackages = fsPackagesProp || FS_PACKAGES;
  const activeStaffConfig = staffConfigProp || { hourlyRate: 16.67, minHours: 6 };

  const computed = useMemo(() => {
    const basePrice = 0; // kept for backward compat — tier pricing removed

    const menuTotal = Object.entries(state.menuItems).reduce((sum, [id, qty]) => {
      for (const section of activeSections) {
        const item = section.items.find(i => i.id === id);
        if (item) return sum + item.price * qty;
      }
      return sum;
    }, 0);

    const brunchTotal = state.addedPackages.reduce((s, p) => s + p.price, 0);
    const menuSubtotal = menuTotal + brunchTotal;
    const tableStylingCost = state.style ? 250 : 0; // added when a theme is selected
    const logisticsCost = 100; // minimum — actual cost confirmed by location
    const staffCost = state.staffCount * Math.max(state.staffHours, 4) * 15; // £15/hr, 4hr min
    const subtotal = tableStylingCost + logisticsCost + menuSubtotal + staffCost;
    const vat = subtotal * 0.2;
    const total = subtotal + vat;
    const budgetLeft = state.budget - menuSubtotal;
    const budgetPct = Math.max(0, Math.min(100, (menuSubtotal / state.budget) * 100));

    const platterSubtotal = state.platterBasket.reduce((s, i) => s + i.price, 0);
    const platterFee = platterSubtotal * 0.05;
    const platterTotal = platterSubtotal + platterFee;

    const fsPkg = activePackages.find(p => p.id === state.fsPackage);
    const fsTotal = fsPkg ? fsPkg.pricePerGuest * state.fsGuests : 0;
    const fsTotalItems = Object.values(state.fsSelectedItems).reduce((s, arr) => s + arr.length, 0);
    const fsMaxItems = fsPkg ? Object.values(fsPkg.allocation).reduce((s, n) => s + n, 0) : 0;

    const allMainMenuItems = MAIN_MENU_SECTIONS.flatMap(s => s.items);
    const mainMenuTotal = allMainMenuItems.reduce(
      (sum, item) => sum + (state.mainMenuItems[item.id] ?? 0) * item.price, 0,
    );

    const foodBoxCount = Object.values(state.foodBoxBoxes).reduce((s, n) => s + n, 0);
    const foodBoxTotal = foodBoxCount * 15;

    return { basePrice, menuTotal, brunchTotal, menuSubtotal, tableStylingCost, logisticsCost, staffCost, subtotal, vat, total, budgetLeft, budgetPct, platterSubtotal, platterFee, platterTotal, fsPkg, fsTotal, fsTotalItems, fsMaxItems, mainMenuTotal, foodBoxCount, foodBoxTotal };
  }, [state, activeSections, activePackages, activeStaffConfig]);

  return (
    <OrderContext.Provider value={{ state, dispatch, computed }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}

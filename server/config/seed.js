const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const MenuConfig = require('../models/MenuConfig');

const DEFAULT_CONFIGS = {
  'guest-tiers': [
    { label: 'Starter', guests: 20, price: 180 },
    { label: 'Classic', guests: 30, price: 270 },
    { label: 'Premium', guests: 50, price: 450 },
    { label: 'Large', guests: 80, price: 720 },
    { label: 'Grand', guests: 100, price: 900 },
    { label: 'Elite', guests: 150, price: 1350 },
  ],
  'grazing-styles': [
    { id: 'traditional', name: 'Traditional Heritage', tag: 'AUTHENTIC & WARM', desc: 'Earth-toned linens, hand-carved accents, and woven textures inspired by West African artistry.', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80&auto=format&fit=crop' },
    { id: 'minimalist', name: 'Modern Minimalist', tag: 'CLEAN & SLEEK', desc: 'Monochromatic palette, architectural serving pieces, and spacious negative-space layouts.', img: 'https://images.unsplash.com/photo-1517456480724-33fa07bf7949?w=500&q=80&auto=format&fit=crop' },
    { id: 'vibrant', name: 'Vibrant Celebration', tag: 'JOYOUS & BOLD', desc: 'High-contrast patterns, tropical flora, and an explosion of celebratory colors and textures.', img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&q=80&auto=format&fit=crop' },
  ],
  'grazing-menu': [
    {
      id: 'small-chops', label: 'Small Chops', subtitle: 'Authentic finger foods priced per piece',
      img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&q=80&auto=format&fit=crop',
      items: [
        { id: 'puff-puff', name: 'Spicy Puff Puff', price: 1.50, unit: 'pc', min: 20 },
        { id: 'scotch-eggs', name: 'Mini Scotch Eggs', price: 1.80, unit: 'pc', min: 20 },
        { id: 'akara', name: 'Akara Bites', price: 1.20, unit: 'pc', min: 20 },
        { id: 'plantain-fry', name: 'Fried Plantain', price: 0.90, unit: 'pc', min: 20 },
      ],
    },
    {
      id: 'bowl-food', label: 'Bowl Food', subtitle: 'Substantial portions for networking events',
      img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=900&q=80&auto=format&fit=crop',
      items: [
        { id: 'jollof-bowl', name: 'Signature Jollof Bowl', price: 12.00, unit: 'portion', min: 1 },
        { id: 'goat-bowl', name: 'Curry Goat Rice Bowl', price: 14.50, unit: 'portion', min: 1 },
        { id: 'egusi-bowl', name: 'Egusi Soup Bowl', price: 11.00, unit: 'portion', min: 1 },
        { id: 'pepper-soup', name: 'Pepper Soup', price: 9.50, unit: 'portion', min: 1 },
      ],
    },
    {
      id: 'drinks', label: 'Drinks & Refreshments', subtitle: 'Curated Mocktails & Cocktails priced per guest',
      img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=900&q=80&auto=format&fit=crop',
      items: [
        { id: 'hibiscus', name: 'Hibiscus Zest Mocktail', price: 6.50, unit: 'guest', min: 1 },
        { id: 'rum-punch', name: 'Spiced Rum Punch', price: 9.50, unit: 'guest', min: 1 },
        { id: 'chapman', name: "Chapman's Classic", price: 7.00, unit: 'guest', min: 1 },
        { id: 'zobo', name: 'Zobo Cooler', price: 5.00, unit: 'guest', min: 1 },
      ],
    },
  ],
  'brunch-packages': {
    nigerian: [
      { guests: 20, price: 500, name: 'Nigerian Traditional Breakfast (Tier 20)', desc: 'Includes Akara, Yam Fries, Spicy Omelette, and Artisan Bread. Plus Pap or Custard station.', tags: ['Includes Staff', 'Live Station'] },
      { guests: 50, price: 1250, name: 'Nigerian Traditional Breakfast (Tier 50)', desc: 'Includes Akara, Yam Fries, Spicy Omelette, and Artisan Bread. Plus Pap or Custard station.', tags: ['Includes Staff', 'Live Station'] },
      { guests: 100, price: 2500, name: 'Nigerian Traditional Breakfast (Tier 100)', desc: 'Full breakfast spread with live cooking stations, Akara, Yam Fries, and Custard station.', tags: ['Includes Staff', 'Live Station', 'Premium'] },
      { guests: 150, price: 3750, name: 'Nigerian Traditional Breakfast (Tier 150)', desc: 'Grand breakfast event with multiple live stations and dedicated service team.', tags: ['Includes Staff', 'Live Station', 'Premium', 'Dedicated Team'] },
    ],
    western: [
      { guests: 20, price: 400, name: 'Western Brunch (Tier 20)', desc: 'Classic western brunch with eggs benedict, avocado toast, pastry selection, and fresh juice.', tags: ['Includes Staff'] },
      { guests: 50, price: 1000, name: 'Western Brunch (Tier 50)', desc: 'Full western brunch spread with hot and cold stations, pastries, and premium juices.', tags: ['Includes Staff', 'Live Station'] },
      { guests: 100, price: 2000, name: 'Western Brunch (Tier 100)', desc: 'Premium western brunch with multiple hot stations and barista coffee service.', tags: ['Includes Staff', 'Live Station', 'Premium'] },
      { guests: 150, price: 3000, name: 'Western Brunch (Tier 150)', desc: 'Grand western brunch event with full service team and tailored menu.', tags: ['Includes Staff', 'Live Station', 'Premium', 'Dedicated Team'] },
    ],
  },
  'platter-trays': [
    {
      id: 'jollof-tray', name: 'Smokey Jollof Tray', badge: 'Bestseller',
      desc: 'Our signature firewood-flavored jollof rice served with your choice of protein.',
      img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&q=80&auto=format&fit=crop',
      volumes: [{ label: '3L', price: 45 }, { label: '6L', price: 85 }, { label: '12L', price: 165 }, { label: '24L', price: 320 }],
    },
    {
      id: 'egusi-tray', name: 'Egusi & Pounded Yam', badge: null,
      desc: 'Rich melon seed soup with spinach and assorted meats. Served with fluffy yam.',
      img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80&auto=format&fit=crop',
      volumes: [{ label: '3L', price: 55 }, { label: '6L', price: 105 }, { label: '12L', price: 200 }, { label: '24L', price: 390 }],
    },
  ],
  'platter-smallchops': {
    id: 'signature-mix', name: 'Signature Mix Box',
    desc: 'A curated selection of Puff-Puff, Samosas, Spring Rolls, and Peppered Gizzard. Our most popular appetizer option.',
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80&auto=format&fit=crop',
    tiers: [
      { pcs: 10, pricePerPc: 2.50 },
      { pcs: 20, pricePerPc: 2.25 },
      { pcs: 30, pricePerPc: 2.00 },
      { pcs: 100, pricePerPc: 1.80 },
    ],
  },
  'platter-brunch': [
    { id: 'naija-morning', name: 'The Naija Morning', desc: 'Yam chips, plantain, egg sauce with peppers, and freshly made Akara. Includes tea & coffee service.', pricePerGuest: 22.50, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80&auto=format&fit=crop' },
    { id: 'continental-lux', name: 'The Continental Lux', desc: 'Smashed avocado toast, smoked salmon bagels, seasonal fruit platter, and artisanal pastries.', pricePerGuest: 28.00, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80&auto=format&fit=crop' },
  ],
  'fs-packages': [
    { id: 'standard', name: '1 Course', badge: 'Standard', badgeCls: 'bg-dark text-white', desc: 'Choice of Main Entrée with traditional African sides.', pricePerGuest: 45, allocation: { starters: 0, mains: 1, desserts: 0 }, features: [{ label: 'Main Entrée', ok: true }, { label: '2 Signature Sides', ok: true }, { label: 'No Appetizers', ok: false }], icon: 'burger' },
    { id: 'popular', name: '2 Courses', badge: 'Most Popular', badgeCls: 'bg-primary text-white', desc: 'Balanced experience with appetizers and mains.', pricePerGuest: 65, allocation: { starters: 1, mains: 2, desserts: 0 }, features: [{ label: 'Choice of Appetizer', ok: true }, { label: 'Main Entrée + 3 Sides', ok: true }, { label: 'Table Refreshments', ok: true }], icon: 'fork' },
    { id: 'premium', name: '3 Courses', badge: 'Premium', badgeCls: 'bg-gold text-dark', desc: 'The full journey including starters, mains, and desserts.', pricePerGuest: 85, allocation: { starters: 1, mains: 2, desserts: 1 }, features: [{ label: 'Starter & Appetizers', ok: true }, { label: 'Signature Main Entrée', ok: true }, { label: 'Gourmet Dessert', ok: true }], icon: 'plate' },
  ],
  'staff-config': {
    hourlyRate: 16.67,
    minHours: 6,
  },
  'payment-settings': {
    companyDetails: {
      name: 'Sizzling Sensations',
      tagline: "London's Premier African Catering",
      address: 'London, United Kingdom',
      phone: '',
      email: 'hello@sizzlingsensations.co.uk',
      website: 'www.sizzlingsensations.co.uk',
    },
    bankTransfer: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      sortCode: '',
      paymentReference: 'SS-[number]',
    },
  },
  'fs-menu': {
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
        { id: 'chin-chin', name: 'Chin-Chin & Puff-Puff Basket', badge: null, desc: 'A sharing basket of crispy fried dough bites — sweet and lightly spiced.', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80&auto=format&fit=crop' },
      ],
    },
  },
};

async function seed() {
  const adminCount = await AdminUser.countDocuments();
  if (adminCount === 0) {
    const passwordHash = await bcrypt.hash('Admin1234!', 12);
    await AdminUser.create({ name: 'Admin', email: 'admin@sizzlingsensations.co.uk', passwordHash, role: 'superadmin' });
    console.log('Default admin created — email: admin@sizzlingsensations.co.uk  password: Admin1234!');
  }

  for (const [key, data] of Object.entries(DEFAULT_CONFIGS)) {
    const exists = await MenuConfig.findOne({ key });
    if (!exists) {
      await MenuConfig.create({ key, data });
      console.log(`Seeded menu config: ${key}`);
    }
  }
}

module.exports = seed;

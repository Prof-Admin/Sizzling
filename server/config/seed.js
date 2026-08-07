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
    { id: 'traditional', name: 'Traditional Heritage', tag: 'AUTHENTIC & WARM', desc: 'Earth-toned linens, hand-carved accents, and woven textures inspired by West African artistry.', img: '/image 1.webp' },
    { id: 'minimalist', name: 'Modern Minimalist', tag: 'CLEAN & SLEEK', desc: 'Monochromatic palette, architectural serving pieces, and spacious negative-space layouts.', img: '/Image 5.webp' },
    { id: 'vibrant', name: 'Vibrant Celebration', tag: 'JOYOUS & BOLD', desc: 'High-contrast patterns, tropical flora, and an explosion of celebratory colors and textures.', img: '/Image 6.webp' },
  ],
  'grazing-menu': [
    {
      id: 'abula-station', label: 'Abula Station', subtitle: '£13 per person · MOQ 50 people',
      img: '/image 4.webp', countInServings: true,
      items: [
        { id: 'abula-station', name: 'Abula Station', price: 13, unit: 'person', min: 50 },
      ],
    },
    {
      id: 'canapes', label: 'Canapés', subtitle: 'Priced per piece · MOQ 20 per item',
      img: '/image 2.webp', countInServings: true,
      items: [
        { id: 'puff-puff',       name: 'Puff Puff',           price: 0.50, unit: 'piece',   min: 20 },
        { id: 'spring-rolls',    name: 'Spring Rolls',        price: 0.50, unit: 'piece',   min: 20 },
        { id: 'samosas',         name: 'Samosas',             price: 1.00, unit: 'piece',   min: 20 },
        { id: 'shawarma-rolls',  name: 'Mini Shawarma Rolls', price: 2.00, unit: 'roll',    min: 20 },
        { id: 'fried-plantain',  name: 'Fried Plantain',      price: 1.00, unit: 'serving', min: 20 },
        { id: 'chicken-waffles', name: 'Chicken & Waffles',   price: 3.50, unit: 'portion', min: 20 },
        { id: 'bbq-niblets',     name: 'BBQ Chicken Niblets', price: 1.50, unit: 'piece',   min: 20 },
        { id: 'suya-wings',      name: 'Suya Chicken Wings',  price: 1.50, unit: 'wing',    min: 20 },
        { id: 'corn-cob',        name: 'Corn on the Cob',     price: 1.00, unit: 'piece',   min: 20 },
      ],
    },
    {
      id: 'bowl-food', label: 'Bowl Food', subtitle: 'Priced per portion · MOQ 20 portions',
      img: '/image 1.webp', countInServings: true,
      items: [
        { id: 'jollof-rice-bowl',       name: 'Jollof Rice',                 price: 4.00, unit: 'portion', min: 20 },
        { id: 'fried-rice-bowl',        name: 'Fried Rice',                  price: 3.50, unit: 'portion', min: 20 },
        { id: 'rice-peas-goat',         name: 'Rice & Peas with Curry Goat', price: 4.00, unit: 'portion', min: 20 },
        { id: 'gizdodo-bowl',           name: 'Gizdodo',                     price: 3.00, unit: 'portion', min: 20 },
        { id: 'peppered-chk-bowl',      name: 'Peppered Chicken',            price: 2.50, unit: 'piece',   min: 20 },
        { id: 'peppered-beef',          name: 'Peppered Beef',               price: 2.50, unit: 'portion', min: 20 },
        { id: 'peppered-fish',          name: 'Peppered Fish',               price: 3.50, unit: 'portion', min: 20 },
        { id: 'catfish-pep-soup-bowl',  name: 'Catfish Pepper Soup',         price: 3.50, unit: 'portion', min: 20 },
        { id: 'assorted-meat-pep-bowl', name: 'Assorted Meat Pepper Soup',   price: 3.00, unit: 'portion', min: 20 },
      ],
    },
    {
      id: 'sweets-desserts', label: 'Sweets & Desserts', subtitle: 'Priced per box or serving dish · Feeds 10–12 per dish',
      img: '/image 3.webp', countInServings: false,
      items: [
        { id: 'brookies-6',     name: 'Cookie Butter Brookies (Box of 6)',  price: 25, unit: 'box',  min: 1 },
        { id: 'brookies-12',    name: 'Cookie Butter Brookies (Box of 12)', price: 38, unit: 'box',  min: 1 },
        { id: 'berry-cream',    name: 'Berry Me in Cream',                  price: 35, unit: 'dish', min: 1 },
        { id: 'red-y-not',      name: 'Red-y or Not',                       price: 35, unit: 'dish', min: 1 },
        { id: 'tiramisu-crazy', name: 'Tirr-a-mi-crazyy',                   price: 35, unit: 'dish', min: 1 },
        { id: 'choc-dream',     name: 'Chocolate Dream',                    price: 40, unit: 'dish', min: 1 },
        { id: 'creme-brulee',   name: 'Crème Brûlée Cheesecake',            price: 40, unit: 'dish', min: 1 },
      ],
    },
  ],
  'brunch-packages': {
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
  },
  'platter-trays': [
    {
      id: 'jollof-tray', name: 'Smokey Jollof Tray', badge: 'Bestseller',
      desc: 'Our signature firewood-flavored jollof rice served with your choice of protein.',
      img: '/image 4.webp',
      volumes: [{ label: '3L', price: 45 }, { label: '6L', price: 85 }, { label: '12L', price: 165 }, { label: '24L', price: 320 }],
    },
    {
      id: 'egusi-tray', name: 'Egusi & Pounded Yam', badge: null,
      desc: 'Rich melon seed soup with spinach and assorted meats. Served with fluffy yam.',
      img: '/image 1.webp',
      volumes: [{ label: '3L', price: 55 }, { label: '6L', price: 105 }, { label: '12L', price: 200 }, { label: '24L', price: 390 }],
    },
  ],
  'platter-smallchops': {
    id: 'signature-mix', name: 'Signature Mix Box',
    desc: 'A curated selection of Puff-Puff, Samosas, Spring Rolls, and Peppered Gizzard. Our most popular appetizer option.',
    img: '/image 2.webp',
    tiers: [
      { pcs: 10,  pricePerPc: 2.50 },
      { pcs: 20,  pricePerPc: 2.25 },
      { pcs: 30,  pricePerPc: 2.00 },
      { pcs: 100, pricePerPc: 1.80 },
    ],
  },
  'platter-brunch': [
    { id: 'naija-morning',  name: 'The Naija Morning',    desc: 'Yam chips, plantain, egg sauce with peppers, and freshly made Akara. Includes tea & coffee service.', pricePerGuest: 22.50, img: '/image 3.webp' },
    { id: 'continental-lux', name: 'The Continental Lux', desc: 'Smashed avocado toast, smoked salmon bagels, seasonal fruit platter, and artisanal pastries.',        pricePerGuest: 28.00, img: '/Image 5.webp' },
  ],
  'fs-packages': [
    { id: 'standard', name: '1 Course', badge: 'Standard',     badgeCls: 'bg-dark text-white',    desc: 'Choice of Main Entrée with traditional African sides.',         pricePerGuest: 45, allocation: { starters: 0, mains: 1, desserts: 0 }, features: [{ label: 'Main Entrée', ok: true }, { label: '2 Signature Sides', ok: true }, { label: 'No Appetizers', ok: false }], icon: 'burger' },
    { id: 'popular',  name: '2 Courses', badge: 'Most Popular', badgeCls: 'bg-primary text-white', desc: 'Balanced experience with appetizers and mains.',                pricePerGuest: 65, allocation: { starters: 1, mains: 2, desserts: 0 }, features: [{ label: 'Choice of Appetizer', ok: true }, { label: 'Main Entrée + 3 Sides', ok: true }, { label: 'Table Refreshments', ok: true }], icon: 'fork' },
    { id: 'premium',  name: '3 Courses', badge: 'Premium',      badgeCls: 'bg-gold text-dark',     desc: 'The full journey including starters, mains, and desserts.',    pricePerGuest: 85, allocation: { starters: 1, mains: 2, desserts: 1 }, features: [{ label: 'Starter & Appetizers', ok: true }, { label: 'Signature Main Entrée', ok: true }, { label: 'Gourmet Dessert', ok: true }], icon: 'plate' },
  ],
  'staff-config': {
    hourlyRate: 15,
    minHours: 4,
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
  'main-menu-sections': [
    { id: 'rice', label: 'Rice Dishes', note: 'All rice dishes come in a 5L pot · Feeds 20–25', img: '/image 4.webp',
      items: [
        { id: 'white-rice',  name: 'White Rice',  price: 45, size: '5L · Feeds 20–25' },
        { id: 'jollof-rice', name: 'Jollof Rice', price: 80, size: '5L · Feeds 20–25' },
        { id: 'fried-rice',  name: 'Fried Rice',  price: 75, size: '5L · Feeds 20–25' },
        { id: 'rice-peas',   name: 'Rice & Peas', price: 65, size: '5L · Feeds 20–25' },
      ],
    },
    { id: 'proteins', label: 'Proteins', note: null, img: '/image 1.webp',
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
    { id: 'soups', label: 'Soups & Stews', note: 'All soups and stews come in a 4L tub', img: '/image 2.webp',
      items: [
        { id: 'egusi',                  name: 'Egusi',                     price: 95,  size: '4L' },
        { id: 'assorted-okro',          name: 'Assorted Okro',             price: 80,  size: '4L' },
        { id: 'red-ofada',              name: 'Red Ofada Sauce',           price: 80,  size: '4L' },
        { id: 'beef-obe-ata',           name: 'Beef Obe Ata',              price: 110, size: '4L' },
        { id: 'chicken-stew',           name: 'Chicken Stew',              price: 70,  size: '4L' },
        { id: 'turkey-stew',            name: 'Turkey Stew',               price: 70,  size: '4L' },
        { id: 'fish-obe-ata',           name: 'Fish Obe Ata',              price: 95,  size: '4L' },
        { id: 'curry-goat',             name: 'Curry Goat',                price: 85,  size: '4L' },
        { id: 'groundnut-soup',         name: 'Groundnut Soup',            price: 90,  size: '4L' },
        { id: 'catfish-pepper-soup',    name: 'Catfish Pepper Soup',       price: 110, size: '4L' },
        { id: 'assorted-meat-pep-soup', name: 'Assorted Meat Pepper Soup', price: 95,  size: '4L' },
      ],
    },
    { id: 'sides', label: 'Sides', note: null, img: '/image 3.webp',
      items: [
        { id: 'gizdodo',            name: 'Gizdodo',                  price: 65, size: '4L' },
        { id: 'coleslaw',           name: 'Coleslaw',                 price: 50, size: 'Feeds ~100' },
        { id: 'plain-puff-puff',    name: 'Plain Puff Puff',          price: 35, size: '60 pieces' },
        { id: 'cinnamon-puff-puff', name: 'Cinnamon Sugar Puff Puff', price: 40, size: '60 pieces' },
      ],
    },
  ],
  'food-box-options': [
    { id: 'jollof',     name: 'Jollof Box',       price: 15, contents: ['Jollof rice', 'Grilled chicken', 'Fried plantain'],          img: '/image 2.webp' },
    { id: 'fried-rice', name: 'Fried Rice Box',   price: 15, contents: ['Fried rice', 'Grilled chicken', 'Fried plantain'],           img: '/image 3.webp' },
    { id: 'half-half',  name: 'Half & Half Box',  price: 15, contents: ['Jollof + fried rice', 'Grilled chicken', 'Fried plantain'],  img: '/Image 5.webp' },
  ],
  'fs-menu': {
    starters: {
      label: 'Starters',
      items: [
        { id: 'suya-skewers',   name: 'Spiced Beef Suya Skewers',  badge: 'Signature', desc: 'Thinly sliced beef marinated in a complex kuli-kuli peanut spice blend, flame-grilled to smoky perfection.', img: '/image 1.webp' },
        { id: 'injera-wraps',   name: 'Mini Injera Wraps',         badge: null,        desc: 'Bite-sized fermented teff bread rolls filled with savory Misir Wot and Gomen stews.',                         img: '/image 2.webp' },
        { id: 'heritage-platter', name: 'Heritage Starter Platter', badge: null,       desc: 'A curated board of Suya Wagyu sliders, Mini Kelewele, and Puff-Puff bites.',                                   img: '/image 3.webp' },
      ],
    },
    mains: {
      label: 'Main Courses',
      items: [
        { id: 'jollof-rice', name: 'Smoky Party Jollof Rice', badge: null,          desc: 'Long-grain parboiled rice slow-cooked in a rich tomato, pepper, and onion reduction.',                        img: '/image 4.webp' },
        { id: 'lamb-curry',  name: 'Cape Malay Lamb Curry',   badge: null,          desc: 'A sweet and spicy aromatic curry featuring tender lamb, apricots, and warming spices.',                       img: '/Image 5.webp' },
        { id: 'royal-main',  name: 'The Royal Main',          badge: "Chef's Pick", desc: 'Signature Smoked Jollof Rice with grilled chicken, crispy plantain, and house pepper sauce.',                img: '/Image 6.webp' },
      ],
    },
    desserts: {
      label: 'Desserts',
      items: [
        { id: 'malva-pudding', name: 'Classic Malva Pudding',       badge: null, desc: 'Sweet, apricot-infused caramelized sponge pudding served warm with vanilla cream.',   img: '/IMG_7900.HEIC.webp' },
        { id: 'chin-chin',     name: 'Chin-Chin & Puff-Puff Basket', badge: null, desc: 'A sharing basket of crispy fried dough bites — sweet and lightly spiced.',           img: '/IMG_7902.HEIC.webp' },
      ],
    },
  },
};

// ─── Migration helpers ────────────────────────────────────────────────────────

function hasUnsplashImage(data) {
  return JSON.stringify(data).includes('unsplash.com');
}

function hasOldJpgImage(data) {
  return JSON.stringify(data).includes('.jpg');
}

function bowlFoodMissingPepperSoups(data) {
  const bowlFood = Array.isArray(data) && data.find(s => s.id === 'bowl-food');
  return bowlFood && !bowlFood.items.some(i => i.id === 'catfish-pep-soup-bowl');
}

// ─── Seed function ────────────────────────────────────────────────────────────

async function seed() {
  const adminCount = await AdminUser.countDocuments();
  if (adminCount === 0) {
    const passwordHash = await bcrypt.hash('Admin1234!', 12);
    await AdminUser.create({ name: 'Admin', email: 'admin@sizzlingsensations.co.uk', passwordHash, role: 'superadmin' });
    console.log('Default admin created — email: admin@sizzlingsensations.co.uk  password: Admin1234!');
  }

  for (const [key, data] of Object.entries(DEFAULT_CONFIGS)) {
    const existing = await MenuConfig.findOne({ key });

    if (!existing) {
      await MenuConfig.create({ key, data });
      console.log(`Seeded menu config: ${key}`);
      continue;
    }

    let needsUpdate = false;
    let reason = '';

    // Always migrate if any Unsplash image URL remains
    if (hasUnsplashImage(existing.data)) {
      needsUpdate = true;
      reason = 'replaced Unsplash images';
    }

    // Always migrate if any old .jpg extension remains
    if (!needsUpdate && hasOldJpgImage(existing.data)) {
      needsUpdate = true;
      reason = 'updated image extensions to .webp';
    }

    // Migrate grazing-menu if bowl food is missing the new pepper soups
    if (key === 'grazing-menu' && !needsUpdate && bowlFoodMissingPepperSoups(existing.data)) {
      needsUpdate = true;
      reason = 'added Catfish & Assorted Meat Pepper Soup to bowl food';
    }

    // Legacy migration: grazing-menu with old placeholder sections
    if (key === 'grazing-menu' && !needsUpdate) {
      const OLD_IDS = ['small-chops', 'drinks'];
      if (Array.isArray(existing.data) && existing.data.some(s => OLD_IDS.includes(s.id))) {
        needsUpdate = true;
        reason = 'replaced old placeholder sections';
      }
    }

    // Legacy migration: staff-config with old rates
    if (key === 'staff-config' && !needsUpdate) {
      if (existing.data.hourlyRate === 16.67 || existing.data.minHours === 6) {
        needsUpdate = true;
        reason = 'updated to £15/hr, 4hr minimum';
      }
    }

    if (needsUpdate) {
      await MenuConfig.findOneAndUpdate({ key }, { data }, { new: true });
      console.log(`Migrated ${key}: ${reason}`);
    }
  }
}

module.exports = seed;

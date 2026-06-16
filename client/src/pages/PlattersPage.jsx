import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&q=80&auto=format&fit=crop';

const WHY_FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Freshly Made',
    desc: 'Every platter is prepared hours before delivery in our commercial London kitchen, ensuring maximum flavor and crunch.',
    highlight: false,
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
    title: 'Authentic Spice',
    desc: 'Using generational recipes and imported spices, we deliver the exact flavor profile of Lagos and Accra street food.',
    highlight: true,
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'London-wide Delivery',
    desc: 'Our specialized delivery fleet covers all London zones, ensuring your platters arrive warm and beautifully presented.',
    highlight: false,
  },
];

const PLATTERS = [
  {
    id: 1,
    name: 'The Meat Feast',
    price: 45,
    img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80&auto=format&fit=crop',
    desc: 'Beef Suya, Chicken Wings, Gizzards, and Plantain Chips. Serves 6–8 people.',
    tags: ['SPICY', 'GLUTEN-FREE'],
    badge: 'BEST SELLER',
    badgeColor: 'bg-primary text-white',
  },
  {
    id: 2,
    name: 'Vegan Delight',
    price: 38,
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop',
    desc: 'Akara, Fried Yam, Plantain, and Spicy Tomato Dip. Serves 6–8 people.',
    tags: ['PLANT BASED', 'PROTEIN-HIGH'],
    badge: null,
  },
  {
    id: 3,
    name: 'Sweet Sensation',
    price: 32,
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80&auto=format&fit=crop',
    desc: 'Puff Puff, Chin Chin, and Coconut Macaroons. Serves 10–12 people.',
    tags: ['VEGETARIAN', 'SWEET'],
    badge: null,
  },
];

const TAG_COLORS = {
  SPICY: 'bg-red-50 text-red-700 border-red-100',
  'GLUTEN-FREE': 'bg-green-50 text-green-700 border-green-100',
  'PLANT BASED': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'PROTEIN-HIGH': 'bg-blue-50 text-blue-700 border-blue-100',
  VEGETARIAN: 'bg-lime-50 text-lime-700 border-lime-100',
  SWEET: 'bg-pink-50 text-pink-700 border-pink-100',
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Sizzling Sensations Platter Menu',
  itemListElement: PLATTERS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.name,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'GBP',
    },
  })),
};

export default function PlattersPage() {
  const [added, setAdded] = useState({});

  const handleAdd = (id) => {
    setAdded((p) => ({ ...p, [id]: true }));
    setTimeout(() => setAdded((p) => ({ ...p, [id]: false })), 2000);
  };

  return (
    <>
      <SEO
        title="Platters — London's Best African Finger Food"
        description="Elevate your office catering or home parties with our premium African snack platters. From smoky Suya skewers to golden puff puff, we bring the heart of West Africa to your London doorstep."
        canonical="/platters"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative pt-16 min-h-[60vh] flex items-center" aria-label="Platters hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="West African finger food platter" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-dark/55" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-4">
              Authentic West African Flavors
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-3">
              London's Best{' '}
              <span className="text-gold">Finger<br />Food</span>{' '}
              for Every Occasion.
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-6 max-w-md">
              Elevate your office catering or home parties with our premium snack platters. From smoky Suya skewers to golden puff puff, we bring the heart of West Africa to your London doorstep.
            </p>
            <div className="flex flex-col xs:flex-row gap-3">
              <Link to="/order-builder" className="btn-primary px-7 py-3">Build Your Platter Order</Link>
              <Link to="/menu" className="btn-secondary px-7 py-3">View Menu</Link>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <div className="flex -space-x-2">
                {['A', 'B', 'C'].map((l) => (
                  <div key={l} className="w-7 h-7 rounded-full bg-gold border-2 border-white flex items-center justify-center text-xs font-bold text-dark">
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/70">500+ Office Events Catered This Month</span>
            </div>
          </div>

          {/* Floating badge */}
          <div className="hidden lg:flex justify-end">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm px-4 py-3">
              <div className="flex items-center gap-2 text-gold text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Freshly Spiced Suya
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Platters */}
      <section className="py-16 md:py-20 bg-white" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title" id="why-heading">Why Our Platters?</h2>
            <p className="text-sm text-dark-600 mt-2 max-w-lg mx-auto">
              London's most convenient and authentic African catering experience, designed for modern professional and social needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {WHY_FEATURES.map((f) => (
              <div
                key={f.title}
                className={`rounded-sm p-7 text-center ${
                  f.highlight ? 'bg-primary' : 'bg-white border border-gray-100 shadow-sm'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  f.highlight ? 'bg-primary-light' : 'bg-primary-50'
                }`}>
                  {f.icon}
                </div>
                <h3 className={`text-base font-serif font-semibold mb-2 ${f.highlight ? 'text-white' : 'text-dark'}`}>
                  {f.title}
                </h3>
                <p className={`text-sm leading-relaxed ${f.highlight ? 'text-white/80' : 'text-dark-600'}`}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platter Bundles */}
      <section className="py-16 md:py-20 bg-offwhite" aria-labelledby="bundles-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="section-title" id="bundles-heading">Popular Platter Bundles</h2>
              <p className="text-sm text-dark-600 mt-1">Carefully curated selections for diverse dietary needs.</p>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors" aria-label="Previous">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors" aria-label="Next">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PLATTERS.map((platter) => (
              <div key={platter.id} className="card group">
                <div className="relative overflow-hidden">
                  <img
                    src={platter.img}
                    alt={platter.name}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {platter.badge && (
                    <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-sm ${platter.badgeColor}`}>
                      {platter.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-serif font-semibold text-dark">{platter.name}</h3>
                    <span className="text-primary font-bold text-base ml-2">£{platter.price}</span>
                  </div>
                  <p className="text-sm text-dark-600 mb-3 leading-relaxed">{platter.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {platter.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TAG_COLORS[tag] || 'bg-gray-50 text-gray-600 border-gray-100'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAdd(platter.id)}
                    className={`w-full py-2.5 text-sm font-semibold rounded-sm border-2 transition-all duration-200 ${
                      added[platter.id]
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {added[platter.id] ? '✓ Added to Order' : 'Add to Order'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary" aria-label="Spice up your event">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-3">
                Ready to Spice Up Your Event?
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-md">
                Whether it's a Friday office lunch or a birthday bash at home, our platters are the perfect conversation starter.
              </p>
              <Link to="/order-builder" className="btn-gold mt-6 px-8 py-3.5 inline-flex">
                Build Your Order Now
              </Link>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {['https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
                'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80'].map((src, i) => (
                <img key={i} src={src} alt="" className="w-full h-40 object-cover rounded-sm opacity-60" loading="lazy" aria-hidden="true" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

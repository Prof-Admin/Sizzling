import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1600&q=80&auto=format&fit=crop';

const MENU_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'starters', label: 'Starters' },
  { id: 'mains', label: 'Mains' },
  { id: 'sides', label: 'Sides' },
  { id: 'desserts', label: 'Desserts' },
];

const MENU_ITEMS = [
  {
    id: 1, category: 'starters', name: 'Suya Skewers',
    desc: 'Spiced beef skewers marinated in groundnut paste, grilled to perfection with yaji spice.',
    price: 12, serves: '2–3 people',
    tags: ['SPICY', 'HALAL', 'GLUTEN-FREE'],
    img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 2, category: 'starters', name: 'Akara (Bean Fritters)',
    desc: 'Crispy black-eyed pea fritters with a hint of chili and onion, served with spicy dipping sauce.',
    price: 8, serves: '4–6 pieces',
    tags: ['VEGAN', 'GLUTEN-FREE'],
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 3, category: 'mains', name: 'Jollof Rice',
    desc: 'The legendary smoky West African rice, slow-cooked in a rich tomato and pepper base with aromatic herbs.',
    price: 18, serves: 'per portion',
    tags: ['VEGAN', 'GLUTEN-FREE'],
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&q=80&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 4, category: 'mains', name: 'Egusi Soup & Fufu',
    desc: 'Rich ground melon seed soup with leafy greens and choice of protein, served with pounded yam fufu.',
    price: 22, serves: 'per portion',
    tags: ['HALAL', 'GLUTEN-FREE'],
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 5, category: 'mains', name: 'Grilled Tilapia',
    desc: 'Whole tilapia marinated in a blend of African spices, grilled and served with garden egg stew.',
    price: 28, serves: 'per portion',
    tags: ['GLUTEN-FREE', 'HALAL'],
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 6, category: 'sides', name: 'Fried Plantain',
    desc: 'Golden-fried sweet plantain, caramelised to perfection. The ultimate accompaniment to any dish.',
    price: 6, serves: 'side portion',
    tags: ['VEGAN', 'GLUTEN-FREE'],
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 7, category: 'sides', name: 'Coleslaw',
    desc: 'Nigerian-style coleslaw with a creamy, lightly sweet dressing — the perfect refreshing side.',
    price: 5, serves: 'side portion',
    tags: ['VEGETARIAN'],
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 8, category: 'desserts', name: 'Puff Puff',
    desc: 'Light and airy deep-fried dough balls, dusted with cinnamon sugar. A West African street food classic.',
    price: 7, serves: '6 pieces',
    tags: ['VEGETARIAN', 'SWEET'],
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 9, category: 'desserts', name: 'Coconut Macaroons',
    desc: 'Chewy, golden coconut macaroons with a hint of vanilla and a dark chocolate drizzle.',
    price: 8, serves: '4 pieces',
    tags: ['GLUTEN-FREE', 'SWEET'],
    img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80&auto=format&fit=crop',
  },
];

const TAG_COLORS = {
  SPICY: 'bg-red-50 text-red-600 border-red-100',
  HALAL: 'bg-green-50 text-green-700 border-green-100',
  'GLUTEN-FREE': 'bg-blue-50 text-blue-700 border-blue-100',
  VEGAN: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  VEGETARIAN: 'bg-lime-50 text-lime-700 border-lime-100',
  SWEET: 'bg-pink-50 text-pink-700 border-pink-100',
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Sizzling Sensations Menu',
  description: 'Authentic West African dishes for catering events in London',
  hasMenuSection: MENU_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => ({
    '@type': 'MenuSection',
    name: cat.label,
    hasMenuItem: MENU_ITEMS.filter((i) => i.category === cat.id).map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.desc,
      offers: { '@type': 'Offer', price: item.price, priceCurrency: 'GBP' },
    })),
  })),
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeTab);

  return (
    <>
      <SEO
        title="Menu — Authentic West African Dishes"
        description="Explore Sizzling Sensations' authentic West African menu. From smoky Jollof Rice and Suya Skewers to Egusi Soup, our dishes bring the vibrant flavors of Africa to London."
        canonical="/menu"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-end pt-16" aria-label="Menu hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Authentic African cuisine" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-dark/65" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
          <div className="inline-flex bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-3">
            London's Premier African Catering
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Our Menu</h1>
          <p className="text-white/80 text-sm md:text-base mt-2 max-w-xl">
            Every dish is a celebration of authentic West African heritage, crafted with premium ingredients and generational recipes.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-0.5 py-1" role="tablist" aria-label="Menu categories">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeTab === cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === cat.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-dark-600 hover:text-dark hover:border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <section className="py-12 md:py-16 bg-offwhite" aria-label="Menu items">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <article key={item.id} className="card group">
                <div className="relative overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {item.featured && (
                    <div className="absolute top-3 left-3 bg-gold text-dark text-xs font-bold px-2.5 py-1 rounded-sm">
                      ★ Fan Favourite
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary font-bold text-sm px-2.5 py-1 rounded-sm">
                    £{item.price}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-serif font-semibold text-dark">{item.name}</h3>
                  </div>
                  <p className="text-sm text-dark-600 leading-relaxed mb-3">{item.desc}</p>
                  <p className="text-xs text-gray-400 mb-3">Serves: {item.serves}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TAG_COLORS[tag] || ''}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-dark-600">No items in this category yet.</div>
          )}
        </div>
      </section>

      {/* Build Order CTA */}
      <section className="py-14 bg-white" aria-label="Order CTA">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-title mb-3">Ready to Build Your Order?</h2>
          <p className="section-subtitle mx-auto mb-7">
            Select your favourite dishes and we'll create a bespoke catering experience tailored to your event.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link to="/order-builder" className="btn-primary px-8 py-3.5">Build My Order</Link>
            <Link to="/platters" className="btn-outline-dark px-8 py-3.5">View Platters</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1600&q=80&auto=format&fit=crop';

const HOW_IT_WORKS = [
  { label: 'Minimum Order', value: '£150', desc: 'Choose any combination of dishes from our Main Menu.' },
  { label: 'Order Window', value: 'Sat – Mon', desc: 'Orders open every Saturday and close at 12pm on Monday.' },
  { label: 'Dispatch', value: 'From Tuesday', desc: 'Orders are freshly prepared and dispatched from Tuesday.' },
  { label: 'Delivery', value: 'Free*', desc: 'Free delivery until 31st August 2026.' },
];

const MENU_SECTIONS = [
  {
    id: 'rice',
    label: 'Rice Dishes',
    items: [
      { name: 'White Rice',  price: '£45', size: '5L · Serves 20–25 people' },
      { name: 'Jollof Rice', price: '£80', size: '5L · Serves 20–25 people' },
      { name: 'Fried Rice',  price: '£75', size: '5L · Serves 20–25 people' },
      { name: 'Rice & Peas', price: '£65', size: '5L · Serves 20–25 people' },
    ],
  },
  {
    id: 'proteins',
    label: 'Proteins',
    items: [
      { name: 'Grilled Chicken',  price: '£80', size: '30 pieces' },
      { name: 'Peppered Chicken', price: '£90', size: '30 pieces' },
      { name: 'Grilled Wings',    price: '£40', size: '18–20 wings' },
      { name: 'Peppered Wings',   price: '£50', size: '18–20 wings' },
      { name: 'BBQ Wings',        price: '£45', size: '18–20 wings' },
      { name: 'Grilled Turkey',   price: '£75', size: '20 servings' },
      { name: 'Peppered Turkey',  price: '£85', size: '20 servings' },
    ],
  },
  {
    id: 'soups',
    label: 'Soups & Stews',
    note: 'All soups and stews come in a 4L tub.',
    items: [
      { name: 'Egusi',           price: '£95',  size: '4L' },
      { name: 'Assorted Okro',   price: '£80',  size: '4L' },
      { name: 'Red Ofada Sauce', price: '£80',  size: '4L' },
      { name: 'Beef Obe Ata',    price: '£110', size: '4L' },
      { name: 'Chicken Stew',    price: '£70',  size: '4L' },
      { name: 'Turkey Stew',     price: '£70',  size: '4L' },
      { name: 'Fish Obe Ata',    price: '£95',  size: '4L' },
      { name: 'Curry Goat',      price: '£85',  size: '4L' },
    ],
  },
  {
    id: 'sides',
    label: 'Sides',
    items: [
      { name: 'Gizdodo',                  price: '£65', size: '4L · Serves approx. 20 people' },
      { name: 'Coleslaw',                 price: '£50', size: 'Serves approx. 100 people' },
      { name: 'Plain Puff Puff',          price: '£35', size: '60 pieces' },
      { name: 'Cinnamon Sugar Puff Puff', price: '£40', size: '60 pieces' },
    ],
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Sizzling Sensations Main Menu',
  description: 'Authentic Nigerian catering dishes for events and gatherings in London',
  hasMenuSection: MENU_SECTIONS.map(sec => ({
    '@type': 'MenuSection',
    name: sec.label,
    hasMenuItem: sec.items.map(item => ({
      '@type': 'MenuItem',
      name: item.name,
      offers: { '@type': 'Offer', price: item.price, priceCurrency: 'GBP' },
    })),
  })),
};

function MenuTable({ section }) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-xl font-serif font-bold text-dark">{section.label}</h2>
        {section.note && <span className="text-xs text-dark-600 italic">{section.note}</span>}
      </div>
      <div className="overflow-hidden border border-gray-100 rounded-sm shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-offwhite border-b border-gray-100">
              <th className="text-left px-5 py-3 font-semibold text-dark-600 uppercase tracking-wider text-xs">Dish</th>
              <th className="text-right px-5 py-3 font-semibold text-dark-600 uppercase tracking-wider text-xs">Price</th>
              <th className="text-right px-5 py-3 font-semibold text-dark-600 uppercase tracking-wider text-xs hidden sm:table-cell">Size / Serves</th>
            </tr>
          </thead>
          <tbody>
            {section.items.map((item, i) => (
              <tr key={item.name}
                className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
              >
                <td className="px-5 py-3.5 font-medium text-dark">
                  {item.name}
                  <span className="block text-xs text-dark-600 font-semibold sm:hidden">{item.size}</span>
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-primary">{item.price}</td>
                <td className="px-5 py-3.5 text-right text-dark-600 hidden sm:table-cell">{item.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState('all');

  const visibleSections = activeSection === 'all'
    ? MENU_SECTIONS
    : MENU_SECTIONS.filter(s => s.id === activeSection);

  return (
    <>
      <SEO
        title="Main Menu | Authentic Nigerian Catering"
        description="Explore Sizzling Sensations' catering menu. Rice dishes, proteins, soups & stews, and sides, freshly prepared in large quantities for your event or gathering."
        canonical="/menu"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end pt-16" aria-label="Menu hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Authentic Nigerian cuisine" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-dark/65" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
          <div className="inline-flex bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-3">
            Main Menu
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">
            Large Portions, Big Flavour
          </h1>
          <p className="text-white/80 text-sm md:text-base mb-6 max-w-xl">
            Perfect for feeding a crowd. Choose any combination of dishes. Minimum order £150. Free delivery until 31 Aug 2026.
          </p>
          <Link to="/order-builder?service=main-menu" className="btn-primary px-8 py-3.5 text-base">
            Order Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 md:py-14 bg-offwhite border-b border-gray-100" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xs font-bold tracking-widest uppercase text-dark-600 mb-7" id="how-it-works-heading">
            How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map(card => (
              <div key={card.label} className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-dark-600 mb-1">{card.label}</p>
                <p className="text-2xl font-serif font-bold text-primary mb-2">{card.value}</p>
                <p className="text-sm text-dark-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-dark-600 mt-4">*Free delivery until 31st August 2026. Delivered directly to you.</p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-0.5 py-1" role="tablist" aria-label="Menu categories">
            <button
              role="tab"
              aria-selected={activeSection === 'all'}
              onClick={() => setActiveSection('all')}
              className={`flex-shrink-0 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeSection === 'all' ? 'border-primary text-primary' : 'border-transparent text-dark-600 hover:text-dark hover:border-gray-200'
              }`}
            >
              All
            </button>
            {MENU_SECTIONS.map(sec => (
              <button
                key={sec.id}
                role="tab"
                aria-selected={activeSection === sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeSection === sec.id ? 'border-primary text-primary' : 'border-transparent text-dark-600 hover:text-dark hover:border-gray-200'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Tables */}
      <section className="py-12 md:py-16 bg-white" aria-label="Menu items">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {visibleSections.map(section => (
            <MenuTable key={section.id} section={section} />
          ))}

          <div className="mt-4 flex items-center gap-2 text-sm text-dark-600 bg-green-50 border border-green-100 rounded-sm px-4 py-3">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All our food is halal. Please let us know of any dietary requirements when you enquire.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-offwhite" aria-label="Order CTA">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-title mb-3">Ready to Place Your Order?</h2>
          <p className="section-subtitle mx-auto mb-7">
            Use our order builder to choose your dishes, select a delivery date, and send your order directly to us via WhatsApp.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link to="/order-builder?service=main-menu" className="btn-primary px-8 py-3.5">
              Order Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-outline-dark px-8 py-3.5">Make an Enquiry</Link>
          </div>
        </div>
      </section>
    </>
  );
}

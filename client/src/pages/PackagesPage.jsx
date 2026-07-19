import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = '/image 3.jpg';

const GRAZING_SECTIONS = [
  {
    id: 'abula',
    label: 'Abula Station',
    cols: ['Dish', 'Price', 'MOQ'],
    items: [
      { name: 'Abula Station', price: '£13 per person', moq: '50 people' },
    ],
  },
  {
    id: 'canapes',
    label: 'Canapés',
    cols: ['Dish', 'Price', 'MOQ'],
    items: [
      { name: 'Puff Puff', price: '£0.50 per piece', moq: '20 pieces' },
      { name: 'Spring Rolls', price: '£0.50 per piece', moq: '20 pieces' },
      { name: 'Samosas', price: '£1 per piece', moq: '20 pieces' },
      { name: 'Mini Shawarma Rolls', price: '£2 per roll', moq: '20 rolls' },
      { name: 'Fried Plantain', price: '£1 per serving', moq: '20 servings' },
      { name: 'Chicken & Waffles', price: '£3.50 per portion', moq: '20 portions' },
      { name: 'BBQ Chicken Niblets', price: '£1.50 per piece', moq: '20 pieces' },
      { name: 'Suya Chicken Wings', price: '£1.50 per wing', moq: '20 wings' },
      { name: 'Corn on the Cob', price: '£1 per piece', moq: '20 pieces' },
    ],
  },
  {
    id: 'bowl',
    label: 'Bowl Food',
    cols: ['Dish', 'Price', 'MOQ'],
    items: [
      { name: 'Jollof Rice', price: '£4 per portion', moq: '20 portions' },
      { name: 'Fried Rice', price: '£3.50 per portion', moq: '20 portions' },
      { name: 'Rice & Peas with Curry Goat', price: '£4 per portion', moq: '20 portions' },
      { name: 'Gizdodo', price: '£3 per portion', moq: '20 portions' },
      { name: 'Peppered Chicken', price: '£2.50 per piece', moq: '20 pieces' },
      { name: 'Peppered Beef', price: '£2.50 per portion', moq: '20 portions' },
      { name: 'Peppered Fish', price: '£3.50 per portion', moq: '20 portions' },
    ],
  },
  {
    id: 'sweets',
    label: 'Sweets & Desserts',
    cols: ['Item', 'Price', 'Size'],
    items: [
      { name: 'Cookie Butter Brookies', price: '£25', moq: 'Box of 6' },
      { name: 'Cookie Butter Brookies', price: '£38', moq: 'Box of 12' },
      { name: 'Berry Me in Cream', price: '£35', moq: 'Feeds 10–12' },
      { name: 'Red-y or Not', price: '£35', moq: 'Feeds 10–12' },
      { name: 'Tirr-a-mi-crazyy', price: '£35', moq: 'Feeds 10–12' },
      { name: 'Chocolate Dream', price: '£40', moq: 'Feeds 10–12' },
      { name: 'Crème Brûlée Cheesecake', price: '£40', moq: 'Feeds 10–12' },
    ],
  },
];

const HOW_IT_WORKS = [
  {
    label: 'Table Styling',
    price: '£250',
    desc: 'Layered table linen, coordinated florals, fresh fruit displays, themed decorative accents, chafing dishes, styled serving pieces, decorative plates, napkins and cutlery. Coordinated with your event colour palette.',
  },
  {
    label: 'Logistics',
    price: 'From £100',
    desc: 'We deliver the food and grazing table items directly to your venue. The final logistics cost depends on your location.',
  },
  {
    label: 'Staffing',
    price: '£15 / staff / hr',
    desc: 'Minimum four hours per staff member. Staff replenish the food and keep your grazing table looking full and presentable throughout your event.',
  },
];

const STAFFING = [
  { guests: 'Up to 30 guests', staff: 'Minimum 2 staff' },
  { guests: 'Up to 60 guests', staff: 'Minimum 3 staff' },
  { guests: 'Up to 100 guests', staff: 'Minimum 5 staff' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Grazing Tables — Sizzling Sensations',
  provider: { '@type': 'Organization', name: 'Sizzling Sensations' },
  description: 'Nigerian-inspired grazing tables with canapés, bowl food, and beautiful styling for events in London.',
  areaServed: 'London',
};

function PricingTable({ section }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-serif font-bold text-dark mb-4">{section.label}</h2>
      <div className="overflow-hidden border border-gray-100 rounded-sm shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-offwhite border-b border-gray-100">
              {section.cols.map((col, i) => (
                <th
                  key={col}
                  className={`px-5 py-3 font-semibold text-dark-600 uppercase tracking-wider text-xs ${i === 0 ? 'text-left' : 'text-right'} ${i === 2 ? 'hidden sm:table-cell' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.items.map((item, i) => (
              <tr
                key={`${item.name}-${i}`}
                className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
              >
                <td className="px-5 py-3.5 font-medium text-dark">{item.name}</td>
                <td className="px-5 py-3.5 text-right font-bold text-primary">{item.price}</td>
                <td className="px-5 py-3.5 text-right text-dark-600 hidden sm:table-cell">{item.moq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <>
      <SEO
        title="Grazing Tables — Sizzling Sensations"
        description="Our grazing tables bring together food and beautiful table styling to create a food display designed around your event. Canapés, bowl food, desserts and full styling."
        canonical="/packages"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pt-16" aria-label="Grazing tables hero">
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_IMG}
          >
            <source src="/video 1.mp4" type="video/mp4" />
            <img src={HERO_IMG} alt="Grazing table setup" className="w-full h-full object-cover" />
          </video>
          <div className="absolute inset-0 bg-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div className="inline-flex bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-4">
            Grazing Tables
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-3">
            Food & Styling,<br className="hidden sm:block" /> Designed Around Your Event
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mb-6">
            Our grazing tables bring together food and beautiful table styling to create a food display that's as stunning as it is delicious.
          </p>
          <div className="flex flex-col xs:flex-row gap-3">
            <Link to="/contact" className="btn-primary px-7 py-3">
              Request a Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Real event photo strip */}
      <div className="grid grid-cols-2 gap-0.5" aria-hidden="true">
        <div className="overflow-hidden h-48 sm:h-64">
          <img src="/Image 5.jpg" alt="Seekh kebab wraps on a gold tray" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="overflow-hidden h-48 sm:h-64">
          <img src="/Image 6.jpg" alt="Beef samosas arranged on a gold tray" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      {/* Notice banner */}
      <div className="bg-primary-50 border-b border-primary/20 py-3">
        <p className="text-center text-sm text-primary font-medium">
          Grazing Tables require a minimum of <strong>3 weeks' notice</strong>
        </p>
      </div>

      {/* Menu / Pricing */}
      <section className="py-12 md:py-16 bg-white" aria-labelledby="pricing-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="section-label mb-2" id="pricing-heading">What's on the Table</p>
            <p className="text-sm text-dark-600 max-w-xl">
              Build your grazing table from our selection of canapés, bowl food, desserts, and the Abula Station. Mix and match to suit your event and guest count.
            </p>
          </div>

          {GRAZING_SECTIONS.map((section) => (
            <PricingTable key={section.id} section={section} />
          ))}

          <div className="mt-2 flex items-center gap-2 text-sm text-dark-600 bg-green-50 border border-green-100 rounded-sm px-4 py-3">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All our food is halal. Please let us know of any dietary requirements when you enquire.
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-offwhite" aria-labelledby="how-it-works-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold tracking-widest uppercase text-dark-600 mb-2" id="how-it-works-heading">How It Works</h2>
            <p className="section-title">What's Included</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {HOW_IT_WORKS.map((card) => (
              <div key={card.label} className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
                <p className="text-xs font-bold tracking-widest uppercase text-dark-600 mb-1">{card.label}</p>
                <p className="text-2xl font-serif font-bold text-primary mb-3">{card.price}</p>
                <p className="text-sm text-dark-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Staffing recommendations */}
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-offwhite">
              <h3 className="text-sm font-semibold text-dark">Our Staffing Recommendation</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-6 py-3 font-semibold text-dark-600 uppercase tracking-wider text-xs">Guest Count</th>
                  <th className="text-right px-6 py-3 font-semibold text-dark-600 uppercase tracking-wider text-xs">Recommended Staffing</th>
                </tr>
              </thead>
              <tbody>
                {STAFFING.map((row, i) => (
                  <tr key={row.guests} className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="px-6 py-3.5 font-medium text-dark">{row.guests}</td>
                    <td className="px-6 py-3.5 text-right text-dark-600">{row.staff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white" aria-label="Grazing table enquiry CTA">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-title mb-3">Ready to Plan Your Grazing Table?</h2>
          <p className="section-subtitle mx-auto mb-7">
            Share your event details, guest count, and colour palette with us and we'll put together a bespoke proposal.
          </p>
          <Link to="/contact" className="btn-primary px-8 py-3.5">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&q=80&auto=format&fit=crop';

const BOXES = [
  {
    name: 'Jollof Box',
    price: '£15',
    contents: ['Jollof rice', 'Grilled chicken', 'Fried plantain'],
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Fried Rice Box',
    price: '£15',
    contents: ['Fried rice', 'Grilled chicken', 'Fried plantain'],
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Half & Half Box',
    price: '£15',
    contents: ['Jollof rice and fried rice', 'Grilled chicken', 'Fried plantain'],
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop',
  },
];

const HOW_IT_WORKS = [
  { label: 'Price', value: '£15 per box', desc: 'Each box includes rice, grilled chicken and fried plantain.' },
  { label: 'Minimum Order', value: '10 Boxes', desc: 'Minimum order of 10 boxes per order.' },
  { label: 'Notice Required', value: '1 Week', desc: 'Individual Food Box orders require at least one week\'s notice.' },
  { label: 'Location', value: 'London Only', desc: 'Currently available for London orders only.' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Individual Food Boxes — Sizzling Sensations',
  provider: { '@type': 'Organization', name: 'Sizzling Sensations' },
  description: 'Individually packed Nigerian food boxes — Jollof, Fried Rice, or Half & Half — ideal for events where each guest has their own box.',
  areaServed: 'London',
};

export default function PlattersPage() {
  return (
    <>
      <SEO
        title="Individual Food Boxes — Sizzling Sensations"
        description="Individually packed Nigerian food boxes. Choose Jollof, Fried Rice, or Half & Half — each box includes rice, grilled chicken and fried plantain. Minimum 10 boxes."
        canonical="/food-boxes"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end pt-16" aria-label="Individual food boxes hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Individually packed food boxes" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div className="inline-flex bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-4">
            Individual Food Boxes
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-3">
            A Box for Every Guest
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mb-6">
            Individually packed meals — ideal when you want each guest to have their own box. Perfect for parties, celebrations, and corporate events.
          </p>
          <Link to="/order-builder?service=food-boxes" className="btn-primary px-7 py-3">
            Order Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Box Options */}
      <section className="py-12 md:py-16 bg-white" aria-labelledby="boxes-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-label mb-2" id="boxes-heading">Choose Your Box</p>
            <h2 className="section-title">Three Boxes, All £15</h2>
            <p className="text-sm text-dark-600 mt-2 max-w-lg mx-auto">
              Every box comes with rice, grilled chicken, and fried plantain. Choose your rice or go half and half.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BOXES.map((box) => (
              <div key={box.name} className="border border-gray-100 rounded-sm overflow-hidden shadow-sm group">
                <div className="relative overflow-hidden">
                  <img
                    src={box.img}
                    alt={box.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white font-bold text-sm px-2.5 py-1 rounded-sm">
                    {box.price}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold text-dark mb-3">{box.name}</h3>
                  <ul className="space-y-1.5">
                    {box.contents.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-dark-600">
                        <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-offwhite" aria-labelledby="how-it-works-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xs font-bold tracking-widest uppercase text-dark-600 mb-7" id="how-it-works-heading">
            How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((card) => (
              <div key={card.label} className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-dark-600 mb-1">{card.label}</p>
                <p className="text-xl font-serif font-bold text-primary mb-2">{card.value}</p>
                <p className="text-sm text-dark-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection & Delivery */}
      <section className="py-10 bg-white border-t border-gray-100" aria-label="Collection and delivery info">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-gray-100 rounded-sm p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-1">Collection — Free</h3>
                  <p className="text-sm text-dark-600 leading-relaxed">Collect from our London kitchen at an agreed time. No charge for collection.</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-100 rounded-sm p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-1">Delivery — Customer Arranged</h3>
                  <p className="text-sm text-dark-600 leading-relaxed">Customers can arrange and pay for Uber delivery directly to their event location.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-offwhite" aria-label="Food boxes enquiry CTA">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-title mb-3">Ready to Order Your Boxes?</h2>
          <p className="section-subtitle mx-auto mb-7">
            Submit an enquiry with your box choice, quantity, and event date. We'll confirm availability and guide you through the next steps.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link to="/order-builder?service=food-boxes" className="btn-primary px-8 py-3.5">
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

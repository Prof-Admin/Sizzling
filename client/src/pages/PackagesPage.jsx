import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=80&auto=format&fit=crop';
const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80&auto=format&fit=crop',
    alt: 'Arancini rice balls with dipping sauce',
    caption: 'Jollof Arancini',
    desc: 'Smoked Jollof rice spheres with a molten mozzarella core and spicy shito glaze.',
    span: 'lg:col-span-1 lg:row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop',
    alt: 'Variety of dips and spreads',
    caption: '',
    desc: '',
    span: 'lg:col-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&q=80&auto=format&fit=crop',
    alt: 'Golden fried snacks with smoke',
    caption: '',
    desc: '',
    span: 'lg:col-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop',
    alt: 'Plantain bites appetizer',
    caption: 'Plantain Bites',
    desc: 'Sweet fried plantain medallions topped with avocado mousse and citrus salt.',
    span: 'lg:col-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80&auto=format&fit=crop',
    alt: 'Gourmet mini burgers platter',
    caption: '',
    desc: '',
    span: 'lg:col-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1515361271503-b8d9fa0d1ec5?w=800&q=80&auto=format&fit=crop',
    alt: 'Specialty dips platter',
    caption: 'Specialty Dips',
    desc: 'A trio of Suya-infused hummus, roasted red pepper Harissa, and honey-ginger dip.',
    span: 'lg:col-span-1',
  },
];

const PERFECT_FOR = [
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Luxury Weddings',
    desc: 'A dramatic culinary focal point for your cocktail hour or reception.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    title: 'Brand Launches',
    desc: 'Memorable, Instagrammable setups that reflect high-end innovation.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Corporate Galas',
    desc: "Elegant, efficient grazing solutions for London's leading enterprises.",
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bespoke African Grazing Tables',
  provider: { '@type': 'Organization', name: 'Sizzling Sensations' },
  description: 'Luxury West African grazing table experiences for weddings, brand launches, and corporate events in London.',
  areaServed: 'London',
};

export default function PackagesPage() {
  return (
    <>
      <SEO
        title="Packages — Bespoke African Grazing Tables"
        description="Experience the luxury of cultural heritage reimagined through contemporary culinary design. Bespoke African grazing tables for weddings, brand launches, and corporate galas in London."
        canonical="/packages"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pt-16" aria-label="Packages hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Bespoke African grazing table" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div className="inline-flex bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-4">
            Premium London Catering
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-3">
            Bespoke African Grazing Tables
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mb-6">
            An Edible Work of Art for Your Event. Experience the luxury of cultural heritage reimagined through contemporary culinary design.
          </p>
          <div className="flex flex-col xs:flex-row gap-3">
            <Link to="/contact" className="btn-primary px-7 py-3">
              Request a Grazing Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button className="btn-secondary px-7 py-3">
              View Showcase
            </button>
          </div>
        </div>
      </section>

      {/* Grazing Experience intro */}
      <section className="py-12 md:py-16 bg-white" aria-labelledby="grazing-intro">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-2" id="grazing-intro">The Grazing Experience</p>
          <h2 className="section-title mb-3">An Edible Work of Art for Your Event.</h2>
          <p className="section-subtitle mx-auto">
            We don't just cater; we curate multisensory installations that become the centrepiece of your celebration.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-16 md:pb-20 bg-white" aria-label="Gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {GALLERY.map((item, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-sm ${item.span}`}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-48 sm:h-64 lg:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  style={{ minHeight: i === 0 ? '32rem' : undefined }}
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-dark-overlay p-4">
                    <p className="text-sm font-semibold text-white">{item.caption}</p>
                    {item.desc && <p className="text-xs text-white/70 mt-0.5">{item.desc}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect For */}
      <section className="py-12 md:py-16 bg-dark" aria-labelledby="perfect-for-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="section-label text-gold mb-3" id="perfect-for-heading">Perfect For</p>
              <div className="space-y-5">
                {PERFECT_FOR.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-dark-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn-gold mt-8 px-8 py-3 inline-flex">
                Request a Grazing Quote
              </Link>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80&auto=format&fit=crop"
                alt="Elegant event venue with guests"
                className="w-full h-96 object-cover rounded-sm"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

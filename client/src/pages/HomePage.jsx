import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1600&q=80&auto=format&fit=crop';
const GRAZING_IMAGE = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop';
const PLATTER_IMAGE = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop';
const EVENTS_IMAGE = 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&q=80&auto=format&fit=crop';

const FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Authentic Flavors',
    desc: 'We use heritage recipes and premium ingredients to ensure every bite delivers an authentic taste of Africa.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: 'Premium Presentation',
    desc: 'Food is art. Our styling team ensures your spread is as visually stunning as it is delicious.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Bespoke Service',
    desc: 'Every event is unique. We work closely with you to create a menu that fits your vision and budget perfectly.',
  },
];

const TESTIMONIALS = [
  {
    quote: '"The Jollof rice was the star of the night! Sizzling Sensations handled our corporate lunch for 150 people with absolute professionalism."',
    name: 'Sarah O.',
    role: 'Events Manager, TechCity',
    initials: 'SO',
  },
  {
    quote: '"Beyond the food, the presentation was breathtaking. Our wedding guests are still talking about the grazing table two months later."',
    name: 'David A.',
    role: 'Private Client',
    initials: 'DA',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Sizzling Sensations',
  description: "London's premier African catering service",
  url: 'https://sizzlingsensation.co.uk',
  telephone: '+442074640000',
  email: 'hello@sizzlingsensation.co.uk',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Canary Wharf',
    addressLocality: 'London',
    postalCode: 'E14',
    addressCountry: 'GB',
  },
  servesCuisine: 'West African',
  priceRange: '£££',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
};

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold fill-gold" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <SEO
        title="London's Premier African Catering"
        description="Sizzling Sensations brings the vibrant flavors of African heritage to London. From intimate grazing tables to grand full-service events. Book your catering experience today."
        canonical="/"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center pt-16" aria-label="Hero">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Authentic African cuisine spread"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-6">
              Premier African Catering in London
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-4">
              Experience the{' '}
              <span className="text-gold">Vibrant Flavors</span>{' '}
              of African Heritage
            </h1>
            <p className="text-base md:text-lg text-white/85 mb-8 max-w-lg leading-relaxed">
              Elevating culinary traditions with modern flair. From intimate grazing tables to grand full-service events.
            </p>
            <div className="flex flex-col xs:flex-row gap-3">
              <Link to="/order-builder" className="btn-primary text-base px-8 py-3.5">
                Build Your Order
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/menu" className="btn-secondary text-base px-8 py-3.5">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catering Services */}
      <section className="py-16 md:py-24 bg-white" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <p className="section-label mb-2">Our Catering Services</p>
              <p className="text-sm text-dark-600 max-w-md">
                Tailored culinary experiences designed to leave a lasting impression on your guests through authentic taste and premium presentation.
              </p>
            </div>
            <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors whitespace-nowrap">
              View All Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Grazing Tables - Large */}
            <div className="relative group overflow-hidden rounded-sm aspect-[4/3] md:aspect-auto md:row-span-1">
              <img
                src={GRAZING_IMAGE}
                alt="Grazing table with West African small bites"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-dark-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-xl font-serif font-bold text-white mb-1">Grazing Tables</h2>
                <p className="text-sm text-white/80 mb-4">
                  Perfect for networking events and social gatherings, featuring a stunning array of West African small bites.
                </p>
                <Link to="/packages" className="btn-gold text-sm px-5 py-2.5">
                  Explore Grazing
                </Link>
              </div>
            </div>

            {/* Gourmet Platters */}
            <div className="relative group overflow-hidden rounded-sm">
              <img
                src={PLATTER_IMAGE}
                alt="Gourmet African platters"
                className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="p-5 bg-white">
                <h2 className="text-lg font-serif font-bold text-dark mb-1">Gourmet Platters</h2>
                <p className="text-sm text-dark-600 mb-3">
                  Curated selections of our finest dishes, delivered ready to serve for your office lunch or home party.
                </p>
                <Link to="/platters" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-light transition-colors">
                  Explore Platters
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Full-Service Banner */}
          <div className="relative group overflow-hidden rounded-sm">
            <img
              src={EVENTS_IMAGE}
              alt="Full service catering event"
              className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-dark/60 flex flex-col items-center justify-center text-center p-6">
              <p className="section-label mb-2">Full-Service Catering</p>
              <p className="text-white text-sm md:text-base max-w-md mb-5">
                From weddings to corporate galas, we handle everything from menu design to on-site service and cleanup.
              </p>
              <Link to="/events" className="btn-primary text-sm px-7 py-3">
                Explore Full Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Sensation Difference */}
      <section className="py-16 md:py-20 bg-offwhite" aria-labelledby="difference-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-2" id="difference-heading">The Sensation Difference</p>
            <h2 className="section-title">Why London Chooses Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-sm mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-serif font-semibold text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-dark-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-primary" aria-label="Testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-2">Loved by Hosts Across London</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-primary-light/30 border border-white/10 rounded-sm p-6">
                <StarRating />
                <blockquote className="mt-3 text-sm md:text-base text-white/90 leading-relaxed italic">
                  {t.quote}
                </blockquote>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-dark text-sm font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/60">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white" aria-label="Call to action">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="border border-gray-100 rounded-sm p-8 md:p-12 shadow-sm">
            <h2 className="section-title mb-3">Ready to Bring Sensation to Your Event?</h2>
            <p className="section-subtitle mx-auto mb-8">
              Whether it's a small gathering or a grand celebration, we're here to make it unforgettable. Start building your custom order today.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 justify-center">
              <Link to="/order-builder" className="btn-primary px-8 py-3.5">
                Start My Order
              </Link>
              <Link to="/contact" className="btn-gold px-8 py-3.5">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

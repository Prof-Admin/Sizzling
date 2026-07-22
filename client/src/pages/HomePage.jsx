import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1600&q=80&auto=format&fit=crop';
const MENU_IMAGE = 'https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=800&q=80&auto=format&fit=crop';
const BOXES_IMAGE = 'https://images.unsplash.com/photo-1664334997177-6ae654a62735?w=800&q=80&auto=format&fit=crop';
const GRAZING_IMAGE = '/image 4.jpg';

const SERVICES = [
  {
    label: 'Main Menu',
    heading: 'Large Portions for a Crowd',
    desc: 'Choose from our full menu of rice dishes, proteins, soups and stews, and sides. Perfect for feeding family, friends, or event guests. Minimum order £150.',
    cta: 'Order Now',
    to: '/order-builder?service=main-menu',
    img: MENU_IMAGE,
    badge: 'Min. order £150 · Free delivery*',
  },
  {
    label: 'Individual Food Boxes',
    heading: 'A Box for Every Guest',
    desc: 'Individually packed meals, each with rice, grilled chicken, and fried plantain. Ideal when you want each guest to have their own box. From £15 per box.',
    cta: 'Order Now',
    to: '/order-builder?service=food-boxes',
    img: BOXES_IMAGE,
    badge: '£15 per box · Min. 10 boxes',
  },
];

const FAQS_PREVIEW = [
  {
    q: 'How do I place an order?',
    a: 'Use our enquiry form and tell us what you\'re looking for. We\'ll review your request and get in touch to guide you through the next steps.',
  },
  {
    q: 'Is your food halal?',
    a: 'Yes, all our food is halal. Please let us know of any dietary requirements before placing your order.',
  },
  {
    q: 'When do Main Menu orders open?',
    a: 'Main Menu orders open every Saturday and close at 12pm on Monday, with dispatch beginning from Tuesday.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Sizzling Sensations',
  description: 'Nigerian catering for events, gatherings, and celebrations in London',
  url: 'https://sizzlingsensation.co.uk',
  email: 'hello@sizzlingsensation.co.uk',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'London',
    addressCountry: 'GB',
  },
  servesCuisine: 'Nigerian',
  priceRange: '££',
};

export default function HomePage() {
  return (
    <>
      <SEO
        title="Nigerian Catering for Events & Gatherings in London"
        description="Sizzling Sensations brings authentic Nigerian food to London. Main menu catering, individual food boxes, and grazing tables for your event."
        canonical="/"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center pt-16" aria-label="Hero">
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_IMAGE}
          >
            <source src="/video 2.mp4" type="video/mp4" />
            <img src={HERO_IMAGE} alt="Authentic Nigerian cuisine spread" className="w-full h-full object-cover" />
          </video>
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-6">
              Nigerian Catering · London
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-4">
              Stress-free catering for{' '}
              <span className="text-gold">life's special moments.</span>
            </h1>
            <p className="text-base md:text-lg text-white/85 mb-8 max-w-lg leading-relaxed">
              Beautifully presented Nigerian catering, platters and grazing tables for weddings, celebrations and corporate events.
            </p>
            <div className="flex flex-col xs:flex-row gap-3">
              <Link to="/order-builder" className="btn-primary text-base px-8 py-3.5">
                Order Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/contact" className="btn-secondary text-base px-8 py-3.5">
                Make an Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three Ways to Order intro */}
      <section className="py-12 md:py-16 bg-offwhite border-b border-gray-100" aria-labelledby="ways-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-2" id="ways-heading">Three Ways to Order</p>
          <h2 className="section-title mb-3">Whether You're Feeding a Crowd or Planning an Event</h2>
          <p className="text-sm text-dark-600 max-w-xl mx-auto">
            Whether you're feeding family and friends, planning an event, or looking for individually packed meals, there are three ways to enjoy Sizzling Sensations.
          </p>
        </div>
      </section>

      {/* Main Menu + Food Boxes cards */}
      <section className="py-12 md:py-16 bg-white" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only" id="services-heading">Our services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {SERVICES.map((svc) => (
              <div key={svc.label} className="relative group overflow-hidden rounded-sm border border-gray-100 shadow-sm">
                <div className="overflow-hidden">
                  <img
                    src={svc.img}
                    alt={svc.heading}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-primary-50 text-primary text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm mb-3">
                    {svc.label}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-dark mb-2">{svc.heading}</h3>
                  <p className="text-sm text-dark-600 leading-relaxed mb-4">{svc.desc}</p>
                  <div className="flex items-center justify-between gap-3">
                    <Link to={svc.to} className="btn-primary text-sm px-5 py-2.5">
                      {svc.cta}
                    </Link>
                    <span className="text-xs text-dark-600 text-right leading-snug max-w-[140px]">{svc.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grazing Tables — full width banner */}
          <div className="relative group overflow-hidden rounded-sm">
            <img
              src={GRAZING_IMAGE}
              alt="Beautiful grazing table display"
              className="w-full h-96 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-dark/55 flex flex-col md:flex-row md:items-center md:justify-between p-6 md:p-10 gap-4">
              <div className="max-w-xl">
                <span className="inline-block bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm mb-3">
                  Grazing Tables
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                  Food & Styling for Your Event
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  Food and styling brought together to create a beautiful food display designed around your event. Canapés, bowl food, desserts, and full table styling.
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link to="/order-builder?service=grazing-table" className="btn-gold text-sm px-6 py-3 text-center">
                  Order Now
                </Link>
                <span className="text-xs text-white/70 text-center">Minimum 3 weeks' notice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sizzling Sensations */}
      <section className="py-16 md:py-20 bg-offwhite" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-2" id="why-heading">Why Sizzling Sensations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                color: 'text-primary',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Reliable Catering & Delivery',
                desc: 'From your first enquiry to your event day, we\'re committed to providing reliable service and on-time delivery.',
              },
              {
                color: 'text-gold',
                icon: (
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: '5-Star Food Hygiene',
                desc: 'We proudly hold a 5-star Food Hygiene Rating, so you can order with confidence.',
              },
              {
                color: 'text-primary',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: '100% Halal Menu',
                desc: 'Every dish on our menu is prepared using halal ingredients.',
              },
            ].map((f) => (
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

      {/* FAQ Preview */}
      <section className="py-16 md:py-20 bg-white" aria-labelledby="faq-preview-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-label mb-2" id="faq-preview-heading">Quick Answers</p>
            <h2 className="section-title">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS_PREVIEW.map((item) => (
              <div key={item.q} className="border border-gray-100 rounded-sm p-5">
                <h3 className="text-sm font-semibold text-dark mb-1.5">{item.q}</h3>
                <p className="text-sm text-dark-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-7">
            <Link to="/faq" className="btn-outline-dark px-6 py-2.5 text-sm">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary" aria-label="Call to action">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">Ready to Place an Order?</h2>
          <p className="text-white/80 text-sm md:text-base mb-8 max-w-lg mx-auto">
            Tell us what you're looking for and we'll guide you through the next steps. No obligation.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link to="/contact" className="btn-secondary px-8 py-3.5">
              Make an Enquiry
            </Link>
            <Link to="/menu" className="btn-gold px-8 py-3.5">
              View the Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

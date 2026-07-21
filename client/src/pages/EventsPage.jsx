import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop';
const BUFFET_IMG = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop';
const PLATED_IMG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop';
const FAMILY_IMG = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop';

const ADVANTAGES = [
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Elite Staffing',
    desc: 'Uniformed, professional waitstaff and bartenders trained in high-end hospitality and African culinary traditions.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Premium Rentals',
    desc: "Sourcing of bespoke linens, designer cutlery, and high-quality glassware that complements your event's specific aesthetic.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Seamless Logistics',
    desc: 'Meticulous setup and post-event clear-away. We leave your venue in pristine condition, so you can focus on your guests.',
  },
];

const TESTIMONIALS = [
  {
    quote: '"Sizzling Sensations provided the catering for our annual fundraiser at the British Museum. The fusion of traditional flavors with such professional service was exactly what we needed to impress our international donors."',
    name: 'Elena J.',
    role: 'Event Director, London Arts Council',
    initials: 'EJ',
  },
  {
    quote: '"The best full-service African catering in London, hands down. Their attention to detail during our product launch was impeccable. The team was efficient, polite, and the food was the talk of the evening."',
    name: 'Marcus K.',
    role: 'Head of PR, TechGlobal UK',
    initials: 'MK',
  },
  {
    quote: '"From the bespoke menu planning to the day-of execution, Sizzling Sensations handled our 500-person corporate gala with total grace. A truly five-star experience that honored our heritage."',
    name: 'Sarah A.',
    role: 'Founder, Heritage Foundation',
    initials: 'SA',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Full-Service African Catering',
  provider: { '@type': 'Organization', name: 'Sizzling Sensations' },
  description: 'Professional full-service African catering for corporate events, weddings, galas and private dining in London.',
  areaServed: 'London',
};

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-gold text-gold" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function EventsPage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <>
      <SEO
        title="Full-Service Catering | Corporate Events & Weddings"
        description="Experience the pinnacle of full-service event catering. From corporate functions to intimate galas, Sizzling Sensations brings the soul of African cuisine to London's most prestigious tables."
        canonical="/events"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-end pt-16 overflow-hidden" aria-label="Events hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Full service catering setup" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-primary/75" />
          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" className="w-full fill-white" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-24">
          <div className="inline-flex bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-4">
            Authentic Flavors, Professional Excellence
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-3 max-w-2xl">
            Authentic Flavors,<br /> Professional Excellence
          </h1>
          <p className="text-white/85 text-sm md:text-base max-w-xl mb-6">
            Experience the pinnacle of full-service event catering. From intimate galas to large-scale corporate functions, we bring the soul of African cuisine to London's most prestigious tables.
          </p>
          <div className="flex flex-col xs:flex-row gap-3">
            <Link to="/contact" className="btn-gold px-7 py-3">
              Book a Consultation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Link>
            <button className="btn-secondary px-7 py-3">View Our Portfolio</button>
          </div>
        </div>
      </section>

      {/* Catering Styles */}
      <section className="py-16 md:py-20 bg-white" aria-labelledby="styles-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-2" id="styles-heading">Our Catering Styles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Grand Buffet */}
            <div className="group relative overflow-hidden rounded-sm">
              <img src={BUFFET_IMG} alt="Grand buffet spread" className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-dark-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-xl font-serif font-bold text-white">Grand Buffet</h2>
                <p className="text-sm text-white/80 mt-1">
                  An interactive dining experience featuring a vast array of artisanal dishes, perfect for large celebrations and high-energy gatherings.
                </p>
              </div>
            </div>

            {/* Fine Plated */}
            <div className="group relative overflow-hidden rounded-sm">
              <img src={PLATED_IMG} alt="Fine plated African dining" className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-dark-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-xl font-serif font-bold text-white">Fine Plated</h2>
                <p className="text-sm text-white/80 mt-1">
                  Precision-engineered multi-course dining for black-tie galas and executive meetings.
                </p>
              </div>
            </div>
          </div>

          {/* Family Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-offwhite rounded-sm p-6 md:p-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-dark mb-2">Family Style Social</h2>
              <p className="text-sm text-dark-600 leading-relaxed mb-4">
                Bringing the traditional warmth of African hospitality to your table. Large, beautifully presented platters designed for sharing, fostering conversation and community at every event.
              </p>
              <ul className="space-y-2">
                {['Communal Dining Experience', 'Artisanal Shared Platters'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-dark-600">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <img src={FAMILY_IMG} alt="Family style sharing platters" className="w-full h-52 md:h-64 object-cover rounded-sm" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Full Service Advantage */}
      <section className="py-16 md:py-20 bg-offwhite" aria-labelledby="advantage-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-2" id="advantage-heading">The Full Service Advantage</p>
            <p className="text-dark-600 text-sm md:text-base max-w-xl mx-auto">
              We don't just cook: we curate an entire atmosphere. From the first setup to the final clear-away, we manage every detail.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="bg-white border border-gray-100 rounded-sm p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-full mb-4">
                  {a.icon}
                </div>
                <h3 className="text-base font-serif font-semibold text-dark mb-2">{a.title}</h3>
                <p className="text-sm text-dark-600 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 md:py-20 bg-white" aria-label="Client testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="section-label mb-1">Voices of Excellence</p>
              <p className="text-sm text-dark-600">Trusted by London's most iconic organisations.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTestimonialIdx((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Previous testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setTestimonialIdx((p) => (p + 1) % TESTIMONIALS.length)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Next testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`border rounded-sm p-5 transition-all duration-300 ${
                  i === testimonialIdx
                    ? 'border-primary shadow-md bg-primary-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <StarRating />
                <blockquote className="mt-3 text-sm text-dark-600 leading-relaxed italic">
                  {t.quote}
                </blockquote>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">{t.name}</p>
                    <p className="text-xs text-dark-600">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary" aria-label="Elevate your event CTA">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            Ready to Elevate Your Next Event?
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto mb-8">
            Partner with London's leading professional African caterers. Let's design a menu and service plan that perfectly suits your vision.
          </p>
          <Link to="/contact" className="btn-gold px-10 py-4 text-base">
            Book a Consultation
          </Link>
          <p className="text-white/50 text-xs mt-4">Average response time: Within 4 business hours.</p>
        </div>
      </section>
    </>
  );
}

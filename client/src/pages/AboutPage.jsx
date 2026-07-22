import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=80&auto=format&fit=crop';
const FOOD_IMG_1 = '/image 1.jpg';
const FOOD_IMG_2 = '/Image 6.jpg';

const PILLARS = [
  {
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Authenticity',
    desc: 'Every dish is rooted in the Nigerian flavours we grew up with. We never compromise on the ingredients, techniques, or soul that make this food what it is.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Presentation',
    desc: 'Food is art. We bring our own touch to how every dish is plated, styled, and experienced, from a pot of jollof to a full grazing table.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Community',
    desc: 'We\'re building more than a food business. We\'re creating a space where Nigerian culture, food, and people are celebrated and shared.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Sizzling Sensations',
  url: 'https://sizzlingsensation.co.uk/about',
  description: 'Twin sisters from Nigeria sharing the food and culture they grew up with through Sizzling Sensations.',
};

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Our Story | Sizzling Sensations"
        description="We're twin sisters who grew up in Nigeria with a love for cooking. Sizzling Sensations is our way of showcasing the Nigerian food and culture we grew up with."
        canonical="/about"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[55vh] md:min-h-[65vh] flex items-end pt-16" aria-label="About hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Food spread" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-dark/65" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
          <div className="inline-flex items-center bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-4">
            The Story Behind Sizzling Sensations
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
            Built on Flavour,<br className="hidden sm:block" /> Rooted in Culture.
          </h1>
          <p className="mt-4 text-white/80 text-sm md:text-base max-w-xl">
            Twin sisters sharing the Nigerian food and culture they grew up with.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white" aria-labelledby="story-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="section-label mb-3" id="story-heading">Our Story</p>
              <div className="space-y-4 text-dark-600 text-sm md:text-base leading-relaxed">
                <p>
                  Our story started long before Sizzling Sensations.
                </p>
                <p>
                  We grew up in Nigeria with a love for cooking and moved to the UK at 16, shortly after finishing secondary school. Like many people, we followed the path we thought we were supposed to take: A Levels, university, and degrees in Psychology.
                </p>
                <p>
                  But the love for food never really left us.
                </p>
                <p>
                  Eventually, we found ourselves asking: what if we actually followed our dream? What if we took our love for cooking and used it to showcase the Nigerian food and culture we grew up with?
                </p>
                <p>
                  And that's where Sizzling Sensations comes in. We're twin sisters building a food business inspired by the flavours we know and love, while bringing our own touch to how the food is presented and experienced.
                </p>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <img src={FOOD_IMG_1} alt="Nigerian spices and ingredients" className="w-full h-52 md:h-64 object-cover rounded-sm" loading="lazy" />
              <img src={FOOD_IMG_2} alt="Jollof rice dish" className="w-full h-52 md:h-64 object-cover rounded-sm mt-8" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="py-16 md:py-20 bg-offwhite" aria-labelledby="pillars-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title" id="pillars-heading">What We Stand For</h2>
            <p className="text-sm text-dark-600 mt-2">The values behind everything we cook and serve.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-white border border-gray-100 rounded-sm p-7 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-full mb-4">
                  {p.icon}
                </div>
                <h3 className="text-lg font-serif font-semibold text-dark mb-2">{p.title}</h3>
                <p className="text-sm text-dark-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary" aria-label="Get in touch CTA">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">Want to Experience the Food?</h2>
          <p className="text-white/80 text-sm md:text-base mb-8 max-w-lg mx-auto">
            Whether you're feeding family and friends, planning an event, or looking for individually packed meals, we'd love to hear from you.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link to="/contact" className="btn-secondary px-8 py-3.5">
              Make an Enquiry
            </Link>
            <Link to="/menu" className="btn-gold px-8 py-3.5">
              View Our Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

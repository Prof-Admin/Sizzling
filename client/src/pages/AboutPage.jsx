import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const HERO_IMG = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=80&auto=format&fit=crop';
const SPICE_IMG = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80&auto=format&fit=crop';
const CHEF_PLATE_IMG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop';

const TEAM = [
  {
    name: 'Amina Bello',
    role: 'Culinary Director',
    img: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=80&auto=format&fit=crop&faces',
  },
  {
    name: 'David Okoro',
    role: 'Operations Lead',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Sarah Mensah',
    role: 'Pastry Specialist',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Kofi Arhin',
    role: 'Concierge Manager',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop',
  },
];

const PILLARS = [
  {
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Authenticity',
    desc: 'We never compromise on the soulful essence of African cuisine. Our marinades and spice blends are crafted from scratch, staying true to the vibrant roots of our heritage.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Quality',
    desc: 'From locally sourced meats to exotic imports, we select only the finest ingredients. Every plate is a testament to culinary excellence and uncompromising standards.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Service',
    desc: 'We treat every event as if it were our own. Our professional staff provides seamless, attentive service that ensures your guests feel truly celebrated and cared for.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Sizzling Sensations',
  url: 'https://sizzlingsensation.co.uk/about',
  description: "London's premier African catering company — our story, team, and values.",
};

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Us — Authentic Flavors, London Elegance"
        description="Sizzling Sensations was born from a passion to bring the rich, vibrant culinary heritage of West Africa to the most prestigious tables in London. Meet our team and story."
        canonical="/about"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[55vh] md:min-h-[65vh] flex items-end pt-16" aria-label="About hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Elegant table setting with candles" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-dark/65" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
          <div className="inline-flex items-center bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-4">
            Premium African Catering
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
            Authentic Flavors,<br className="hidden sm:block" /> London Elegance.
          </h1>
          <p className="mt-4 text-white/80 text-sm md:text-base max-w-xl">
            Sizzling Sensations was born from a passion to bring the rich, vibrant culinary heritage of West Africa to the most prestigious tables in London.
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
                  Founded in the heart of London, Sizzling Sensations started as a small family kitchen with a big dream: to redefine African catering. We saw a gap between traditional authenticity and the premium service required by high-end events.
                </p>
                <p>
                  Our journey began with recipes passed down through generations — spices meticulously sourced from the markets of Lagos and Accra, and techniques honed over decades. We've transformed these roots into a sophisticated dining experience that honors our past while embracing the modern palate.
                </p>
                <p>
                  Today, we are proud to be London's premier choice for those seeking a culinary bridge between continents, serving everything from intimate galas to grand corporate celebrations.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="border border-gray-200 rounded-sm px-4 py-4 text-center">
                  <p className="text-2xl font-serif font-bold text-primary">15+</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Years Exp</p>
                </div>
                <div className="border border-gray-200 rounded-sm px-4 py-4 text-center">
                  <p className="text-2xl font-serif font-bold text-primary">10k+</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Guests Served</p>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <img src={SPICE_IMG} alt="African spices and ingredients" className="w-full h-52 md:h-64 object-cover rounded-sm" loading="lazy" />
              <img src={CHEF_PLATE_IMG} alt="Beautifully plated African dish" className="w-full h-52 md:h-64 object-cover rounded-sm mt-8" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* The Sensation Standard */}
      <section className="py-16 md:py-20 bg-offwhite" aria-labelledby="standard-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title" id="standard-heading">The Sensation Standard</h2>
            <p className="text-sm text-dark-600 mt-2">The pillars that define every event we touch.</p>
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

      {/* The Visionaries */}
      <section className="py-16 md:py-20 bg-white" aria-labelledby="team-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="section-title" id="team-heading">The Visionaries</h2>
              <p className="text-sm text-dark-600 mt-1 max-w-md">
                Meet the passionate experts who transform traditional recipes into contemporary masterpieces.
              </p>
            </div>
            <Link to="/contact" className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap self-start sm:self-auto">
              Join the Team
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="group">
                <div className="overflow-hidden rounded-sm mb-3 aspect-[3/4]">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-sm font-semibold text-dark">{member.name}</h3>
                <p className="text-xs text-dark-600 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary" aria-label="Ready to Sizzle CTA">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">Ready to Sizzle?</h2>
          <p className="text-white/80 text-sm md:text-base mb-8 max-w-lg mx-auto">
            Let us bring the authentic taste of West Africa to your next event. Experience the fusion of tradition and luxury.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link to="/contact" className="btn-secondary px-8 py-3.5">
              Request a Proposal
            </Link>
            <Link to="/menu" className="btn-gold px-8 py-3.5">
              View Sample Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

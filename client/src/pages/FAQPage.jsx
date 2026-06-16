import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const FAQ_DATA = [
  {
    id: 'ordering',
    label: 'Ordering',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Ordering Process',
    questions: [
      {
        q: 'How far in advance do I need to book?',
        a: 'We recommend booking at least 4–6 weeks in advance for full-service events and corporate catering. For large weddings or galas, 3–6 months advance notice is ideal. Platter deliveries can often be arranged within 48 hours, subject to availability.',
      },
      {
        q: 'Can I customize my catering package?',
        a: 'Absolutely! Every event is unique and we pride ourselves on bespoke service. You can customize menu items, portion sizes, service style, and presentation. Submit an enquiry and our events team will work with you to create a tailored proposal.',
      },
      {
        q: 'Is a deposit required to confirm a booking?',
        a: 'Yes, we require a 25% deposit to secure your date, with the remaining balance due 14 days before your event. For platter orders under £500, full payment is required at the time of booking.',
      },
    ],
  },
  {
    id: 'dietary',
    label: 'Dietary',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Dietary Requirements',
    questions: [
      {
        q: 'Do you offer vegan or gluten-free options?',
        a: 'Yes! We offer a full range of vegan and plant-based options including Akara (bean fritters), Fried Yam, Jollof Rice, and various vegetable stews. Many of our dishes are naturally gluten-free. Please inform us of any dietary requirements when booking.',
      },
      {
        q: 'How do you handle severe allergies?',
        a: 'We take allergies very seriously. Our team is trained in allergen awareness and we follow strict cross-contamination protocols. All dishes are labelled with allergen information. For severe allergies (e.g. peanuts, shellfish), we recommend discussing this directly with our Culinary Director.',
      },
      {
        q: 'Are your meats Halal certified?',
        a: 'Yes, all our meats are sourced from Halal-certified suppliers. We can provide certification documentation upon request. Our kitchen maintains strict procedures to prevent cross-contamination with non-Halal products.',
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Delivery & Logistics',
    questions: [
      {
        q: 'What areas in London do you cover?',
        a: 'We cover all 32 London boroughs and the City of London. Our specialized delivery fleet ensures your platters arrive warm and beautifully presented. For events outside London (within 50 miles), additional travel fees may apply.',
      },
      {
        q: 'Do you provide servers and tableware?',
        a: 'Yes, our full-service packages include uniformed servers, bartenders, and all necessary tableware, linens, and serving equipment. We can also rent bespoke glassware and designer cutlery to match your event aesthetic.',
      },
      {
        q: 'What time do you deliver/arrive for events?',
        a: 'For full-service events, our team arrives 2–3 hours before guest arrival to set up. Platter deliveries are scheduled within a 1-hour window of your preferred time. You will receive real-time tracking updates on the day.',
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Payment Methods',
    questions: [
      {
        q: 'What are your payment terms?',
        a: 'We accept bank transfer, credit/debit card (Visa, Mastercard, Amex), and PayPal. A 25% deposit secures your booking, with the balance due 14 days before your event. For recurring corporate accounts, we offer monthly invoicing on approved credit.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made more than 30 days before the event receive a full deposit refund. Cancellations within 14–30 days forfeit the deposit. Cancellations within 14 days are charged at 50% of the total contract value. Force majeure events are handled on a case-by-case basis.',
      },
    ],
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_DATA.flatMap((cat) =>
    cat.questions.map((q) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a },
    }))
  ),
};

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-gray-100 rounded-sm overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base font-medium text-dark pr-4">{question}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-45 border-primary' : ''}`}>
          <svg className={`w-3 h-3 ${isOpen ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="px-5 py-4 text-sm text-dark-600 leading-relaxed border-t border-gray-50 bg-gray-50/50">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('ordering');
  const [openItems, setOpenItems] = useState({});
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return FAQ_DATA;
    const q = search.toLowerCase();
    return FAQ_DATA.map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.questions.length > 0);
  }, [search]);

  const toggle = (catId, idx) => {
    const key = `${catId}-${idx}`;
    setOpenItems((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <>
      <SEO
        title="FAQ — Common Queries"
        description="Everything you need to know about Sizzling Sensations African catering in London. From ordering and dietary requirements to delivery and payments."
        canonical="/faq"
        structuredData={SCHEMA}
      />

      <div className="min-h-screen bg-white pt-16">
        {/* Header */}
        <div className="bg-offwhite py-12 md:py-16 text-center border-b border-gray-100">
          <p className="section-label mb-3">Support Center</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark">Common Queries</h1>
          <p className="mt-3 text-sm md:text-base text-dark-600 max-w-lg mx-auto">
            Everything you need to know about London's premier African catering experience. From spicy jollof to seamless logistics.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto px-4">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a question..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm text-dark bg-white shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                aria-label="Search FAQ"
              />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Sidebar */}
            {!search && (
              <nav className="md:w-44 flex-shrink-0" aria-label="FAQ categories">
                <ul className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                  {FAQ_DATA.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-sm font-medium whitespace-nowrap transition-colors w-full text-left ${
                          activeCategory === cat.id
                            ? 'bg-primary text-white'
                            : 'text-dark-600 hover:bg-gray-100 hover:text-dark'
                        }`}
                      >
                        <span className={activeCategory === cat.id ? 'text-white' : 'text-gray-400'}>
                          {cat.icon}
                        </span>
                        {cat.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Questions */}
            <div className="flex-1">
              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-600">No results found for "{search}"</p>
                  <button onClick={() => setSearch('')} className="btn-outline-dark mt-4 text-sm px-5 py-2">
                    Clear Search
                  </button>
                </div>
              )}

              {(search ? filteredData : filteredData.filter((c) => c.id === activeCategory)).map((cat) => (
                <div key={cat.id} className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                      {cat.icon}
                    </div>
                    <h2 className="text-xl font-serif font-semibold text-dark">{cat.title}</h2>
                  </div>
                  {cat.questions.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      question={item.q}
                      answer={item.a}
                      isOpen={!!openItems[`${cat.id}-${idx}`]}
                      onToggle={() => toggle(cat.id, idx)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Still have questions */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="relative bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden p-8 md:p-10">
            {/* Decorative fork/knife icons */}
            <div className="absolute left-4 bottom-4 opacity-10 text-gray-400" aria-hidden="true">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <h3 className="text-xl font-serif font-bold text-primary">Still have questions?</h3>
                <p className="text-sm text-dark-600 mt-1 max-w-xs">
                  Our friendly events team is here to help you craft the perfect catering experience.
                </p>
              </div>
              <Link to="/contact" className="btn-primary px-7 py-3 whitespace-nowrap flex-shrink-0">
                Get in Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

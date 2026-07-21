import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const FAQ_ITEMS = [
  {
    q: 'How do I place an order or make an enquiry?',
    a: 'Use the enquiry form on our website and tell us what you\'re looking for. Once we receive your details, we\'ll review your request and get in touch to guide you through the next steps.',
  },
  {
    q: 'How far in advance should I order?',
    a: 'Main Menu orders open every Saturday and close at 12pm on Monday, with dispatch beginning from Tuesday. Individual Food Boxes require a minimum of one week\'s notice. Grazing Tables require a minimum of three weeks\' notice.',
  },
  {
    q: 'When is my order or booking confirmed?',
    a: 'Main Menu and Individual Food Box orders are confirmed once full payment has been received. Grazing Table bookings are secured with a 50% deposit, with the remaining balance due 14 days before your event.',
  },
  {
    q: 'Is your food halal, and can you cater for dietary requirements?',
    a: 'Yes, all our food is halal. Please inform us of any dietary requirements before placing your order so we can advise you accordingly.',
  },
  {
    q: 'How much food should I order for my number of guests?',
    a: 'Not sure how much food you need? Send us your guest count and the type of event you\'re hosting, and we\'ll help you choose the right quantities from our menu.',
  },
  {
    q: 'Can you match the grazing table to my event colours?',
    a: 'Yes. Our grazing table styling can be coordinated with your event colour palette and aesthetic. Please share your colours and theme with us when booking.',
  },
  {
    q: 'What happens after I submit an enquiry?',
    a: 'Once we receive your enquiry, we\'ll review your order or event details and get in touch to guide you through the next steps. Your order or booking is only confirmed once the required payment or deposit has been received.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
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
  const [openItems, setOpenItems] = useState({ 0: true });

  const toggle = (idx) => {
    setOpenItems((p) => ({ ...p, [idx]: !p[idx] }));
  };

  return (
    <>
      <SEO
        title="FAQ | Frequently Asked Questions"
        description="Everything you need to know about ordering from Sizzling Sensations: how to order, lead times, dietary requirements, delivery, and more."
        canonical="/faq"
        structuredData={SCHEMA}
      />

      <div className="min-h-screen bg-white pt-16">
        {/* Header */}
        <div className="bg-offwhite py-12 md:py-16 text-center border-b border-gray-100">
          <p className="section-label mb-3">Help & Info</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark">Frequently Asked Questions</h1>
          <p className="mt-3 text-sm md:text-base text-dark-600 max-w-lg mx-auto">
            Everything you need to know about placing an order or booking with Sizzling Sensations.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem
              key={idx}
              question={item.q}
              answer={item.a}
              isOpen={!!openItems[idx]}
              onToggle={() => toggle(idx)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="bg-primary rounded-sm p-8 md:p-10 text-center">
            <h3 className="text-xl font-serif font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-sm text-white/80 mb-6 max-w-xs mx-auto">
              Use our enquiry form and we'll get back to you with everything you need to know.
            </p>
            <Link to="/contact" className="btn-gold px-7 py-3 inline-flex">
              Get in Touch
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

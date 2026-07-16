import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { openWhatsApp } from '../utils/whatsapp';
import { saveOrder } from '../utils/api';

const HERO_IMG = 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1600&q=80&auto=format&fit=crop';

const HOW_IT_WORKS = [
  { label: 'Minimum Order', value: '£150', desc: 'Choose any combination of dishes from our Main Menu.' },
  { label: 'Order Window', value: 'Sat – Mon', desc: 'Orders open every Saturday and close at 12pm on Monday.' },
  { label: 'Dispatch', value: 'From Tuesday', desc: 'Orders are freshly prepared and dispatched from Tuesday.' },
  { label: 'Delivery', value: 'Free*', desc: 'Free delivery until 31st August 2026.' },
];

const MENU_SECTIONS = [
  {
    id: 'rice',
    label: 'Rice Dishes',
    note: 'All rice dishes come in a 5L pot.',
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=900&q=80&auto=format&fit=crop',
    items: [
      { id: 'white-rice',  name: 'White Rice',  price: 45, size: '5L · Feeds 20–25' },
      { id: 'jollof-rice', name: 'Jollof Rice', price: 80, size: '5L · Feeds 20–25' },
      { id: 'fried-rice',  name: 'Fried Rice',  price: 75, size: '5L · Feeds 20–25' },
      { id: 'rice-peas',   name: 'Rice & Peas', price: 65, size: '5L · Feeds 20–25' },
    ],
  },
  {
    id: 'proteins',
    label: 'Proteins',
    img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=900&q=80&auto=format&fit=crop',
    items: [
      { id: 'grilled-chicken',  name: 'Grilled Chicken',  price: 80, size: '30 pieces' },
      { id: 'peppered-chicken', name: 'Peppered Chicken', price: 90, size: '30 pieces' },
      { id: 'grilled-wings',    name: 'Grilled Wings',    price: 40, size: '18–20 wings' },
      { id: 'peppered-wings',   name: 'Peppered Wings',   price: 50, size: '18–20 wings' },
      { id: 'bbq-wings',        name: 'BBQ Wings',        price: 45, size: '18–20 wings' },
      { id: 'grilled-turkey',   name: 'Grilled Turkey',   price: 75, size: '20 servings' },
      { id: 'peppered-turkey',  name: 'Peppered Turkey',  price: 85, size: '20 servings' },
    ],
  },
  {
    id: 'soups',
    label: 'Soups & Stews',
    note: 'All soups and stews come in a 4L tub.',
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80&auto=format&fit=crop',
    items: [
      { id: 'egusi',         name: 'Egusi',           price: 95,  size: '4L' },
      { id: 'assorted-okro', name: 'Assorted Okro',   price: 80,  size: '4L' },
      { id: 'red-ofada',     name: 'Red Ofada Sauce', price: 80,  size: '4L' },
      { id: 'beef-obe-ata',  name: 'Beef Obe Ata',    price: 110, size: '4L' },
      { id: 'chicken-stew',  name: 'Chicken Stew',    price: 70,  size: '4L' },
      { id: 'turkey-stew',   name: 'Turkey Stew',     price: 70,  size: '4L' },
      { id: 'fish-obe-ata',  name: 'Fish Obe Ata',    price: 95,  size: '4L' },
      { id: 'curry-goat',    name: 'Curry Goat',      price: 85,  size: '4L' },
    ],
  },
  {
    id: 'sides',
    label: 'Sides',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80&auto=format&fit=crop',
    items: [
      { id: 'gizdodo',           name: 'Gizdodo',                  price: 65, size: '4L' },
      { id: 'coleslaw',          name: 'Coleslaw',                 price: 50, size: 'Feeds approx. 100' },
      { id: 'plain-puff-puff',   name: 'Plain Puff Puff',          price: 35, size: '60 pieces' },
      { id: 'cinnamon-puff-puff',name: 'Cinnamon Sugar Puff Puff', price: 40, size: '60 pieces' },
    ],
  },
];

const ALL_ITEMS = MENU_SECTIONS.flatMap(s => s.items);
const MIN_ORDER = 150;

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Sizzling Sensations Main Menu',
  description: 'Authentic Nigerian catering dishes for events and gatherings in London',
  hasMenuSection: MENU_SECTIONS.map((sec) => ({
    '@type': 'MenuSection',
    name: sec.label,
    hasMenuItem: sec.items.map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      offers: { '@type': 'Offer', price: item.price, priceCurrency: 'GBP' },
    })),
  })),
};

function fmt(n) { return `£${n.toFixed(2)}`; }

function ChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function Progress({ current }) {
  const steps = ['Order Details', 'Menu Selection', 'Review & Send'];
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-16 z-30">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
          STEP 0{current} OF 03
        </p>
        <div className="flex items-center">
          {steps.map((label, i) => {
            const n = i + 1;
            return (
              <div key={n} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors
                      ${n === current ? 'bg-primary border-primary text-white' : n < current ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white border-gray-200 text-gray-400'}`}
                  >
                    {n < current ? (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : n}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 whitespace-nowrap ${n === current ? 'text-primary font-semibold' : n < current ? 'text-dark-600' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 mb-4 ${n < current ? 'bg-primary/40' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stepper({ qty, onChange }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => onChange(Math.max(0, qty - 1))}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-dark-600 hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="w-5 text-center text-sm font-semibold text-dark">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-dark-600 hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

function Step1({ fulfillment, setFulfillment, eventDate, setEventDate, address, setAddress, notes, setNotes, onNext }) {
  const canContinue = eventDate && (fulfillment === 'collection' || address.trim());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-[1fr_300px] gap-6 items-start">

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <p className="text-sm font-medium text-dark mb-3">How would you like to receive your order?</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                id: 'delivery', label: 'Delivery',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                ),
              },
              {
                id: 'collection', label: 'Collection',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setFulfillment(opt.id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-sm border-2 text-sm font-semibold transition-all
                  ${fulfillment === opt.id ? 'bg-primary border-primary text-white' : 'border-gray-200 text-dark hover:border-gray-300 bg-white'}`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Preferred Date</label>
            <div className="relative">
              <svg className="w-4 h-4 text-dark-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {fulfillment === 'delivery' && (
            <div className="mb-4">
              <label className="text-xs font-medium text-dark-600 block mb-1.5">Delivery Address</label>
              <div className="relative">
                <svg className="w-4 h-4 text-dark-600 absolute left-3 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <textarea
                  rows={3}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter full delivery address, including postcode…"
                  className="input-field pl-9 resize-none"
                />
              </div>
              <p className="text-xs text-dark-600 mt-1 italic">Free delivery until 31st August 2026.</p>
            </div>
          )}

          <div className="mb-6">
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Special Instructions <span className="font-normal">(optional)</span></label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Dietary requirements, delivery notes, etc."
              className="input-field resize-none"
            />
          </div>

          <button
            onClick={onNext}
            disabled={!canContinue}
            className={`btn-primary w-full justify-center ${!canContinue ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Continue to Menu
            <ChevronRight />
          </button>
        </div>

        {/* Info cards */}
        <div className="space-y-3">
          {HOW_IT_WORKS.map(card => (
            <div key={card.label} className="bg-white border border-gray-100 rounded-sm p-4 shadow-sm">
              <p className="text-xs font-bold tracking-widest uppercase text-dark-600 mb-0.5">{card.label}</p>
              <p className="text-xl font-serif font-bold text-primary mb-1">{card.value}</p>
              <p className="text-xs text-dark-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
          <p className="text-xs text-dark-600 px-1">*Free delivery until 31st August 2026.</p>
        </div>
      </div>
    </div>
  );
}

function Step2({ qty, onChange, total, onBack, onNext }) {
  const meetsMin = total >= MIN_ORDER;
  const selectedItems = ALL_ITEMS.filter(i => (qty[i.id] ?? 0) > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">
      <div className="grid lg:grid-cols-[1fr_268px] gap-6 items-start">

        {/* Menu sections */}
        <div>
          {MENU_SECTIONS.map(section => (
            <div key={section.id} className="mb-10">
              <div className="relative h-40 rounded-sm overflow-hidden mb-4">
                <img src={section.img} alt={section.label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <h3 className="text-xl font-serif font-bold">{section.label}</h3>
                  {section.note && <p className="text-sm opacity-80 mt-0.5">{section.note}</p>}
                </div>
              </div>

              <div className="space-y-2">
                {section.items.map(item => {
                  const q = qty[item.id] ?? 0;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white border rounded-sm p-4 flex items-center gap-3 transition-colors ${q > 0 ? 'border-primary/40 bg-primary/5' : 'border-gray-200'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark">{item.name}</p>
                        <p className="text-xs text-dark-600 mt-0.5">{item.size}</p>
                      </div>
                      <p className="text-sm font-bold text-primary shrink-0 mr-2">{fmt(item.price)}</p>
                      <Stepper qty={q} onChange={v => onChange(item.id, v)} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button onClick={onBack} className="btn-outline-dark text-sm">
              <ChevronLeft />
              Order Details
            </button>
            <button
              onClick={onNext}
              disabled={!meetsMin}
              className={`btn-primary text-sm ${!meetsMin ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Continue to Review
              <ChevronRight />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-dark-600 bg-green-50 border border-green-100 rounded-sm px-4 py-3">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All our food is halal. Please let us know of any dietary requirements when you enquire.
          </div>
        </div>

        {/* Desktop live summary */}
        <div className="hidden lg:block sticky top-32">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-offwhite flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-semibold text-dark">Your Order</p>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto">
              {selectedItems.length === 0 ? (
                <p className="text-xs text-dark-600 italic">No items selected yet.</p>
              ) : (
                selectedItems.map(item => (
                  <div key={item.id} className="flex justify-between text-xs mb-2 last:mb-0">
                    <span className="text-dark-600 max-w-[140px] leading-tight">{item.name} × {qty[item.id]}</span>
                    <span className="font-medium text-dark ml-2 shrink-0">{fmt(item.price * qty[item.id])}</span>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 pt-0 pb-2 border-t border-gray-100">
              <div className="flex justify-between text-sm font-bold py-3">
                <span className="text-dark">Total</span>
                <span className="text-primary">{fmt(total)}</span>
              </div>
              {!meetsMin && total > 0 && (
                <p className="text-xs text-amber-600 -mt-1 mb-2">
                  {fmt(MIN_ORDER - total)} more to reach the £150 minimum.
                </p>
              )}
              {!meetsMin && total === 0 && (
                <p className="text-xs text-dark-600 -mt-1 mb-2">Minimum order is £150.</p>
              )}
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={onNext}
                disabled={!meetsMin}
                className={`btn-primary w-full justify-center text-sm ${!meetsMin ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Continue to Review
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <button
          onClick={onNext}
          disabled={!meetsMin}
          className={`w-full btn-primary justify-between text-sm ${!meetsMin ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <span>Continue to Review</span>
          <span className="font-bold">{fmt(total)}</span>
        </button>
        {!meetsMin && (
          <p className="text-center text-xs text-amber-600 mt-1">
            Min. £{MIN_ORDER} · {fmt(Math.max(0, MIN_ORDER - total))} to go
          </p>
        )}
      </div>
    </div>
  );
}

function Step3({ qty, fulfillment, eventDate, address, notes, contact, setContact, total, onBack, onSubmit }) {
  const selectedItems = ALL_ITEMS.filter(i => (qty[i.id] ?? 0) > 0);
  const canSubmit = contact.name && contact.email && contact.phone && selectedItems.length > 0;

  function updateContact(key, val) {
    setContact(prev => ({ ...prev, [key]: val }));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h2 className="text-2xl font-serif font-bold text-dark">Review Your Order</h2>
        <p className="text-sm text-dark-600 mt-1">Check everything looks right and add your contact details.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">

        {/* Left */}
        <div className="space-y-5">
          {/* Contact */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Contact Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-dark-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={e => updateContact('name', e.target.value)}
                  placeholder="Your full name"
                  className="input-field"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-dark-600 block mb-1">Email</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={e => updateContact('email', e.target.value)}
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-600 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={e => updateContact('phone', e.target.value)}
                    placeholder="+44 7000 000 000"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order details */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Details
            </h3>
            {[
              { label: 'Fulfilment', value: fulfillment === 'delivery' ? 'Delivery' : 'Collection' },
              { label: 'Date', value: eventDate },
              fulfillment === 'delivery' ? { label: 'Address', value: address } : null,
              notes ? { label: 'Instructions', value: notes } : null,
            ].filter(Boolean).map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs text-dark-600">{row.label}</span>
                <span className="text-xs font-medium text-dark text-right max-w-[200px]">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Items Ordered
            </h3>
            {selectedItems.length === 0 ? (
              <p className="text-sm text-dark-600 italic">
                No items selected.{' '}
                <button onClick={onBack} className="text-primary underline">Go back to menu.</button>
              </p>
            ) : (
              selectedItems.map(item => (
                <div key={item.id} className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-dark">{item.name}</p>
                    <p className="text-xs text-dark-600">Qty: {qty[item.id]} · {item.size}</p>
                  </div>
                  <span className="text-sm font-bold text-dark ml-4 shrink-0">{fmt(item.price * qty[item.id])}</span>
                </div>
              ))
            )}
          </div>

          <button onClick={onBack} className="btn-outline-dark text-sm w-full justify-center">
            <ChevronLeft />
            Back to Menu
          </button>
        </div>

        {/* Right — price & submit */}
        <div>
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm sticky top-24">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-dark">Price Summary</h3>
            </div>
            <div className="p-5 space-y-2">
              {selectedItems.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-dark-600 max-w-[150px] truncate">{item.name} × {qty[item.id]}</span>
                  <span className="font-medium text-dark">{fmt(item.price * qty[item.id])}</span>
                </div>
              ))}
            </div>
            <div className="bg-primary px-5 py-3.5 flex justify-between">
              <span className="text-sm font-bold text-white uppercase tracking-wide">Total</span>
              <span className="text-lg font-bold text-white">{fmt(total)}</span>
            </div>
            <div className="p-4">
              <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className={`btn-primary w-full justify-center text-sm ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Send Order via WhatsApp
                <ChevronRight />
              </button>
              <p className="text-[10px] text-dark-600 text-center mt-3">
                By placing your order you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ contact, total, waMessage }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-dark mb-3">Order Sent!</h2>
        <p className="text-dark-600 mb-2">Thank you, {contact.name}. Your order is on its way to us.</p>
        <p className="text-dark-600 mb-6">
          We'll confirm via <span className="font-medium text-dark">{contact.email}</span> within 2 hours.
        </p>
        <p className="text-2xl font-bold text-primary mb-4">{fmt(total)} total</p>
        <p className="text-sm text-dark-600 mb-6">
          Your WhatsApp message was opened automatically. If it didn't open,{' '}
          <button onClick={() => openWhatsApp(waMessage)} className="text-primary underline font-medium">
            click here to resend
          </button>.
        </p>
        <Link to="/" className="btn-outline-dark justify-center">Back to Home</Link>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [step, setStep] = useState(1);
  const [fulfillment, setFulfillment] = useState('delivery');
  const [eventDate, setEventDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [qty, setQty] = useState({});
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [waMessage, setWaMessage] = useState('');

  const total = useMemo(
    () => ALL_ITEMS.reduce((sum, item) => sum + (qty[item.id] ?? 0) * item.price, 0),
    [qty],
  );

  function updateQty(id, val) {
    setQty(prev => {
      const next = { ...prev };
      if (val <= 0) delete next[id]; else next[id] = val;
      return next;
    });
  }

  function handleSubmit() {
    const selectedItems = ALL_ITEMS.filter(i => (qty[i.id] ?? 0) > 0);
    const itemLines = selectedItems.map(
      item => `  • ${item.name} × ${qty[item.id]} — ${fmt(item.price * qty[item.id])}`,
    );

    const msg = [
      `🍽️ *NEW MAIN MENU ORDER — Sizzling Sensations*`,
      ``,
      `🚚 *Fulfilment*: ${fulfillment === 'delivery' ? 'Delivery' : 'Collection'}`,
      eventDate ? `📅 *Date*: ${eventDate}` : null,
      fulfillment === 'delivery' && address ? `📍 *Address*: ${address}` : null,
      notes ? `📝 *Notes*: ${notes}` : null,
      ``,
      `━━━━━━━━━━━━━━━━━━`,
      `📞 *CONTACT DETAILS*`,
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Phone: ${contact.phone}`,
      ``,
      `━━━━━━━━━━━━━━━━━━`,
      `🛒 *ITEMS ORDERED*`,
      ...itemLines,
      ``,
      `━━━━━━━━━━━━━━━━━━`,
      `💰 *TOTAL: ${fmt(total)}*`,
    ].filter(l => l !== null).join('\n');

    openWhatsApp(msg);
    saveOrder({
      serviceType: 'main-menu',
      contact,
      estimatedTotal: total,
      orderData: {
        fulfillment,
        eventDate,
        address,
        notes,
        items: selectedItems.map(i => ({ id: i.id, name: i.name, qty: qty[i.id], price: i.price * qty[i.id] })),
      },
    });
    setWaMessage(msg);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <SEO title="Order Confirmed — Sizzling Sensations" canonical="/menu" />
        <div style={{ paddingTop: '4rem' }}>
          <SuccessScreen contact={contact} total={total} waMessage={waMessage} />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Main Menu — Authentic Nigerian Catering"
        description="Explore Sizzling Sensations' catering menu. Rice dishes, proteins, soups & stews, and sides — freshly prepared in large quantities for your event or gathering."
        canonical="/menu"
        structuredData={SCHEMA}
      />

      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-end pt-16" aria-label="Menu hero">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Authentic Nigerian cuisine" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-dark/65" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
          <div className="inline-flex bg-gold/20 border border-gold/40 text-gold text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-3">
            Main Menu
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Large Portions, Big Flavour</h1>
          <p className="text-white/80 text-sm md:text-base mt-2 max-w-xl">
            Perfect for feeding a crowd. Choose any combination of dishes — minimum order £150.
          </p>
        </div>
      </section>

      {/* Progress */}
      <Progress current={step} />

      {/* Steps */}
      {step === 1 && (
        <Step1
          fulfillment={fulfillment} setFulfillment={setFulfillment}
          eventDate={eventDate} setEventDate={setEventDate}
          address={address} setAddress={setAddress}
          notes={notes} setNotes={setNotes}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2
          qty={qty} onChange={updateQty} total={total}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3
          qty={qty} fulfillment={fulfillment} eventDate={eventDate}
          address={address} notes={notes}
          contact={contact} setContact={setContact}
          total={total}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}

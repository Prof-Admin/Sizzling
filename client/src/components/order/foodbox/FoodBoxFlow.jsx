import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../../context/OrderContext';
import { FOOD_BOXES } from '../../../context/OrderContext';
import { openWhatsApp, buildFoodBoxMessage } from '../../../utils/whatsapp';
import { saveOrder } from '../../../utils/api';

const MIN_BOXES = 10;
const BOX_PRICE = 15;
const STEP_LABELS = ['Choose Your Boxes', 'Your Details', 'Review & Send'];

function fmt(n) { return `£${n.toFixed(2)}`; }

function Progress({ current, onBack }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-16 z-30">
      <div className="max-w-5xl mx-auto flex items-start gap-6">
        <button
          onClick={onBack}
          className="mt-1 text-dark-600 hover:text-primary transition-colors shrink-0"
          aria-label="Change service"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
            FOOD BOXES · STEP 0{current} OF 03
          </p>
          <div className="flex items-center">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              return (
                <div key={n} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors
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
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`w-8 sm:w-14 h-0.5 mx-1 sm:mx-2 mb-4 ${n < current ? 'bg-primary/40' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ qty, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(0, qty - 1))}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-dark-600 hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="w-8 text-center text-lg font-bold text-dark">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-dark-600 hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

/* ─── STEP 1: Choose Your Boxes ─── */
function Step1({ state, dispatch, count, total, onNext }) {
  const { foodBoxBoxes } = state;
  const meetsMin = count >= MIN_BOXES;

  function setQty(id, qty) {
    dispatch({ type: 'UPDATE_FOOD_BOX_QTY', payload: { id, qty } });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">
      <div className="text-center mb-8">
        <p className="section-label mb-2">Each box contains rice, grilled chicken & fried plantain</p>
        <h2 className="text-2xl font-serif font-bold text-dark">Choose Your Boxes</h2>
        <p className="text-sm text-dark-600 mt-2">£15 per box · Minimum 10 boxes · London only</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {FOOD_BOXES.map(box => {
          const qty = foodBoxBoxes[box.id] ?? 0;
          const active = qty > 0;
          return (
            <div key={box.id}
              className={`bg-white border-2 rounded-sm overflow-hidden shadow-sm transition-all ${active ? 'border-primary shadow-md' : 'border-gray-200'}`}
            >
              <div className="relative">
                <img src={box.img} alt={box.name} className="w-full h-48 object-cover" loading="lazy" />
                <div className="absolute top-3 right-3 bg-primary text-white text-sm font-bold px-2.5 py-1 rounded-sm">
                  £{box.price}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-serif font-bold text-dark mb-3">{box.name}</h3>
                <ul className="space-y-1.5 mb-5">
                  {box.contents.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-dark-600">
                      <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-600">{qty > 0 ? `${qty} × £${box.price} = ${fmt(qty * box.price)}` : 'How many?'}</span>
                  <Stepper qty={qty} onChange={v => setQty(box.id, v)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Running total bar */}
      <div className={`rounded-sm border p-4 mb-6 flex items-center justify-between transition-colors ${meetsMin ? 'border-primary/30 bg-primary/5' : 'border-gray-200 bg-offwhite'}`}>
        <div>
          <p className="text-sm font-semibold text-dark">
            {count} box{count !== 1 ? 'es' : ''} selected
            {!meetsMin && count > 0 && <span className="text-amber-600 ml-2">· {MIN_BOXES - count} more to reach minimum</span>}
            {!meetsMin && count === 0 && <span className="text-dark-600 ml-2">· Minimum 10 boxes</span>}
          </p>
          <p className="text-xs text-dark-600 mt-0.5">£15 per box</p>
        </div>
        <p className={`text-xl font-bold ${meetsMin ? 'text-primary' : 'text-dark-600'}`}>{fmt(total)}</p>
      </div>

      <div className="flex justify-center">
        <button onClick={onNext} disabled={!meetsMin}
          className={`btn-primary px-10 ${!meetsMin ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Continue to Your Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <button onClick={onNext} disabled={!meetsMin}
          className={`w-full btn-primary justify-between text-sm ${!meetsMin ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <span>{count} box{count !== 1 ? 'es' : ''} · Continue</span>
          <span className="font-bold">{fmt(total)}</span>
        </button>
        {!meetsMin && (
          <p className="text-center text-xs text-amber-600 mt-1">Minimum 10 boxes · {Math.max(0, MIN_BOXES - count)} to go</p>
        )}
      </div>
    </div>
  );
}

/* ─── STEP 2: Your Details ─── */
function Step2({ state, dispatch, count, total, onBack, onNext }) {
  const { foodBoxDate, foodBoxContact, foodBoxNotes } = state;

  function field(key, val) {
    dispatch({ type: 'SET_FOOD_BOX_FIELD', payload: { key, val } });
  }
  function updateContact(key, val) {
    dispatch({ type: 'UPDATE_FOOD_BOX_CONTACT', payload: { [key]: val } });
  }

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  })();

  const canContinue = foodBoxDate && foodBoxContact.name && foodBoxContact.email && foodBoxContact.phone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-[1fr_280px] gap-6 items-start">

        <div className="space-y-5">
          {/* Fulfilment selector */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4">How would you like to receive your boxes?</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {[
                {
                  id: 'collection',
                  label: 'Collection',
                  sub: 'Free — collect from our London kitchen',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                },
                {
                  id: 'delivery',
                  label: 'Delivery',
                  sub: 'Customer arranges & pays for Uber delivery',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
                },
              ].map(opt => {
                const active = state.foodBoxFulfillment === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => field('foodBoxFulfillment', opt.id)}
                    className={`flex items-start gap-3 p-4 rounded-sm border-2 text-left transition-all
                      ${active ? 'bg-primary border-primary text-white' : 'border-gray-200 text-dark hover:border-gray-300 bg-white'}`}
                  >
                    <span className={`mt-0.5 shrink-0 ${active ? 'text-white' : 'text-dark-600'}`}>{opt.icon}</span>
                    <span>
                      <span className="block text-sm font-semibold">{opt.label}</span>
                      <span className={`block text-xs mt-0.5 leading-snug ${active ? 'text-white/80' : 'text-dark-600'}`}>{opt.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {state.foodBoxFulfillment === 'delivery' && (
              <p className="text-xs text-amber-600 flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                You will arrange and pay for an Uber delivery directly to your location. We will let you know when the order is ready for collection by the driver.
              </p>
            )}
          </div>

          {/* Date */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4">Preferred Date</h3>
            <div className="relative">
              <svg className="w-4 h-4 text-dark-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input type="date" min={minDate} value={foodBoxDate} onChange={e => field('foodBoxDate', e.target.value)} className="input-field pl-10" />
            </div>
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              At least 1 week's notice required. London orders only.
            </p>
          </div>

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
                <input type="text" value={foodBoxContact.name} onChange={e => updateContact('name', e.target.value)}
                  placeholder="Your full name" className="input-field" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-dark-600 block mb-1">Email</label>
                  <input type="email" value={foodBoxContact.email} onChange={e => updateContact('email', e.target.value)}
                    placeholder="you@example.com" className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-600 block mb-1">Phone</label>
                  <input type="tel" value={foodBoxContact.phone} onChange={e => updateContact('phone', e.target.value)}
                    placeholder="+44 7000 000 000" className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-dark-600 block mb-1">Any notes <span className="font-normal">(optional)</span></label>
                <textarea rows={2} value={foodBoxNotes} onChange={e => field('foodBoxNotes', e.target.value)}
                  placeholder="Dietary requirements, allergen notes, etc." className="input-field resize-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={onBack} className="btn-outline-dark text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Boxes
            </button>
            <button onClick={onNext} disabled={!canContinue}
              className={`btn-primary text-sm ${!canContinue ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Review Order
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="hidden md:block sticky top-32">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-offwhite border-b border-gray-100">
              <p className="text-sm font-semibold text-dark">Box Summary</p>
            </div>
            <div className="p-4 space-y-2">
              {FOOD_BOXES.filter(b => (state.foodBoxBoxes[b.id] ?? 0) > 0).map(box => (
                <div key={box.id} className="flex justify-between text-xs">
                  <span className="text-dark-600">{box.name} × {state.foodBoxBoxes[box.id]}</span>
                  <span className="font-medium text-dark">{fmt(state.foodBoxBoxes[box.id] * box.price)}</span>
                </div>
              ))}
            </div>
            <div className="bg-primary px-4 py-3 flex justify-between">
              <span className="text-sm font-bold text-white">{count} boxes</span>
              <span className="text-lg font-bold text-white">{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 3: Review & Send ─── */
function Step3({ state, dispatch, count, total, onBack, onSubmit, submitted, waMessage }) {
  const { foodBoxBoxes, foodBoxDate, foodBoxContact, foodBoxNotes, foodBoxFulfillment } = state;
  const selectedBoxes = FOOD_BOXES.filter(b => (foodBoxBoxes[b.id] ?? 0) > 0);
  const canSubmit = foodBoxContact.name && foodBoxContact.email && foodBoxContact.phone && count >= MIN_BOXES && foodBoxDate;

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-bold text-dark mb-3">Order Sent!</h2>
          <p className="text-dark-600 mb-2">Thank you, {foodBoxContact.name}.</p>
          <p className="text-dark-600 mb-6">
            We'll be in touch at <span className="font-medium text-dark">{foodBoxContact.email}</span> to confirm your order.
          </p>
          <p className="text-2xl font-bold text-primary mb-2">{fmt(total)}</p>
          <p className="text-sm text-dark-600 mb-6">
            {count} boxes · {fmt(BOX_PRICE)} each
          </p>
          <p className="text-sm text-dark-600 mb-6">
            Your WhatsApp message was opened automatically. If it didn't open,{' '}
            <button onClick={() => openWhatsApp(waMessage)} className="text-primary underline font-medium">click here to resend</button>.
          </p>
          <Link to="/" className="btn-outline-dark justify-center">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h2 className="text-2xl font-serif font-bold text-dark">Review Your Order</h2>
        <p className="text-sm text-dark-600 mt-1">Check everything looks right before sending.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-5">
          {/* Boxes ordered */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Boxes Ordered
            </h3>
            {selectedBoxes.map(box => (
              <div key={box.id} className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-dark">{box.name}</p>
                  <p className="text-xs text-dark-600">{box.contents.join(' · ')}</p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-sm font-bold text-dark">× {foodBoxBoxes[box.id]}</p>
                  <p className="text-xs text-dark-600">{fmt(foodBoxBoxes[box.id] * box.price)}</p>
                </div>
              </div>
            ))}
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
              { label: 'Date', value: foodBoxDate },
              { label: 'Fulfilment', value: foodBoxFulfillment === 'delivery' ? 'Delivery — customer arranges Uber' : 'Collection — free from our kitchen' },
              foodBoxNotes ? { label: 'Notes', value: foodBoxNotes } : null,
            ].filter(Boolean).map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs text-dark-600 shrink-0">{row.label}</span>
                <span className="text-xs font-medium text-dark text-right max-w-[200px]">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Contact Details
            </h3>
            {[
              { label: 'Name', value: foodBoxContact.name },
              { label: 'Email', value: foodBoxContact.email },
              { label: 'Phone', value: foodBoxContact.phone },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs text-dark-600">{row.label}</span>
                <span className="text-xs font-medium text-dark">{row.value}</span>
              </div>
            ))}
          </div>

          <button onClick={onBack} className="btn-outline-dark text-sm w-full justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Edit Details
          </button>
        </div>

        {/* Price & submit */}
        <div>
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm sticky top-24">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-dark">Price Breakdown</h3>
            </div>
            <div className="p-5 space-y-2">
              {selectedBoxes.map(box => (
                <div key={box.id} className="flex justify-between text-xs">
                  <span className="text-dark-600">{box.name} × {foodBoxBoxes[box.id]}</span>
                  <span className="font-medium text-dark">{fmt(foodBoxBoxes[box.id] * box.price)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs border-t border-gray-100 pt-2">
                <span className="text-dark-600">Total boxes</span>
                <span className="font-medium text-dark">{count}</span>
              </div>
            </div>
            <div className="bg-primary px-5 py-3.5 flex justify-between">
              <span className="text-sm font-bold text-white uppercase tracking-wide">Total</span>
              <span className="text-lg font-bold text-white">{fmt(total)}</span>
            </div>
            <div className="p-4">
              <button onClick={onSubmit} disabled={!canSubmit}
                className={`btn-primary w-full justify-center text-sm ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Send Order via WhatsApp
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <p className="text-[10px] text-dark-600 text-center mt-3">By placing your order you agree to our Terms of Service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Flow container ─── */
export default function FoodBoxFlow() {
  const { state, dispatch, computed } = useOrder();
  const { foodBoxStep } = state;
  const { foodBoxCount, foodBoxTotal } = computed;
  const [submitted, setSubmitted] = useState(false);
  const [waMessage, setWaMessage] = useState('');

  function goBack() { dispatch({ type: 'SET_STEP', payload: 1 }); }

  function handleSubmit() {
    const msg = buildFoodBoxMessage(state, computed);
    openWhatsApp(msg);
    saveOrder({
      serviceType: 'food-boxes',
      contact: state.foodBoxContact,
      estimatedTotal: foodBoxTotal,
      orderData: {
        date: state.foodBoxDate,
        notes: state.foodBoxNotes,
        boxes: state.foodBoxBoxes,
        totalBoxes: foodBoxCount,
      },
    });
    setWaMessage(msg);
    setSubmitted(true);
  }

  return (
    <div>
      <Progress current={foodBoxStep} onBack={goBack} />
      {foodBoxStep === 1 && (
        <Step1 state={state} dispatch={dispatch} count={foodBoxCount} total={foodBoxTotal}
          onNext={() => dispatch({ type: 'SET_FOOD_BOX_STEP', payload: 2 })}
        />
      )}
      {foodBoxStep === 2 && (
        <Step2 state={state} dispatch={dispatch} count={foodBoxCount} total={foodBoxTotal}
          onBack={() => dispatch({ type: 'SET_FOOD_BOX_STEP', payload: 1 })}
          onNext={() => dispatch({ type: 'SET_FOOD_BOX_STEP', payload: 3 })}
        />
      )}
      {foodBoxStep === 3 && (
        <Step3 state={state} dispatch={dispatch} count={foodBoxCount} total={foodBoxTotal}
          onBack={() => dispatch({ type: 'SET_FOOD_BOX_STEP', payload: 2 })}
          onSubmit={handleSubmit}
          submitted={submitted}
          waMessage={waMessage}
        />
      )}
    </div>
  );
}

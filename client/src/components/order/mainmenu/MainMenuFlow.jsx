import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../../context/OrderContext';
import { MAIN_MENU_SECTIONS } from '../../../context/OrderContext';
import { openWhatsApp, buildMainMenuMessage } from '../../../utils/whatsapp';
import { saveOrder } from '../../../utils/api';

const ALL_ITEMS = MAIN_MENU_SECTIONS.flatMap(s => s.items);
const MIN_ORDER = 150;
const STEP_LABELS = ['Order Details', 'Menu Selection', 'Review & Send'];

function fmt(n) { return `£${n.toFixed(2)}`; }

function getMainMenuMinDate() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const hour = now.getHours();

  // Order window: Sat(6), Sun(0), Mon before 12:00
  const inOrderWindow = day === 6 || day === 0 || (day === 1 && hour < 12);

  const min = new Date(now);
  if (inOrderWindow) {
    // Dispatch from Tuesday → minimum delivery date is today + 3
    min.setDate(min.getDate() + 3);
  } else {
    // Window closed (Mon 12pm – Fri 23:59) → next Tuesday
    // Mon after 12: +8, Tue: +7, Wed: +6, Thu: +5, Fri: +4
    const daysToNextTue = day === 1 ? 8 : day === 2 ? 7 : (9 - day);
    min.setDate(min.getDate() + daysToNextTue);
  }
  return min.toISOString().split('T')[0];
}

function getOrderWindowNote() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  if (day === 6 || day === 0) {
    return { text: 'Order window is open. Closes Monday at 12pm. Dispatch from Tuesday.', warn: false };
  }
  if (day === 1 && hour < 12) {
    return { text: 'Order window closes today at 12pm. Dispatch from tomorrow (Tuesday).', warn: true };
  }
  return { text: 'Order window is closed (Mon 12pm – Fri). Earliest available date is next Tuesday.', warn: true };
}

function Progress({ current, onBack }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-16 z-30">
      <div className="max-w-5xl mx-auto">

        {/* Mobile: compact single row */}
        <div className="flex items-center gap-3 sm:hidden">
          <button onClick={onBack} className="text-dark-600 hover:text-primary transition-colors shrink-0" aria-label="Change service">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-xs font-bold text-primary uppercase tracking-widest shrink-0">Step {current}/3</p>
          <p className="text-xs text-dark-600 font-medium truncate">{STEP_LABELS[current - 1]}</p>
          <div className="flex items-center gap-1 ml-auto shrink-0">
            {[1, 2, 3].map(n => (
              <div key={n} className={`w-1.5 h-1.5 rounded-full transition-colors ${n === current ? 'bg-primary' : n < current ? 'bg-primary/40' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Desktop: full progress with circles */}
        <div className="hidden sm:flex items-start gap-6">
          <button onClick={onBack} className="mt-1 text-dark-600 hover:text-primary transition-colors shrink-0" aria-label="Change service">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold tracking-widest text-primary uppercase">STEP 0{current} OF 03</p>
              <p className="text-xs text-dark-600 font-medium">{STEP_LABELS[current - 1]}</p>
            </div>
            <div className="flex items-center mt-3">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                return (
                  <div key={n} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                        ${n === current ? 'bg-primary border-primary text-white' : n < current ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white border-gray-200 text-gray-400'}`}
                      >
                        {n < current ? (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : n}
                      </div>
                      <span className={`text-xs mt-1 whitespace-nowrap ${n === current ? 'text-primary font-semibold' : n < current ? 'text-dark-600' : 'text-gray-400'}`}>
                        {label}
                      </span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className={`w-16 h-0.5 mx-2 mb-4 ${n < current ? 'bg-primary/40' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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

/* ─── STEP 1: Order Details ─── */
function Step1({ state, dispatch, onNext }) {
  const { mainMenuFulfillment, mainMenuDate, mainMenuAddress, mainMenuNotes } = state;

  function field(key, val) {
    dispatch({ type: 'SET_MAIN_MENU_FIELD', payload: { key, val } });
  }

  const canContinue = mainMenuDate && (mainMenuFulfillment === 'collection' || mainMenuAddress.trim());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-[1fr_300px] gap-6 items-start">

        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <p className="text-sm font-medium text-dark mb-3">How would you like to receive your order?</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { id: 'delivery', label: 'Delivery',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
              },
              { id: 'collection', label: 'Collection',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
              },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => field('mainMenuFulfillment', opt.id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-sm border-2 text-sm font-semibold transition-all
                  ${mainMenuFulfillment === opt.id ? 'bg-primary border-primary text-white' : 'border-gray-200 text-dark hover:border-gray-300 bg-white'}`}
              >
                {opt.icon}{opt.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Preferred Dispatch / Collection Date</label>
            <div className="relative">
              <svg className="w-4 h-4 text-dark-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                min={getMainMenuMinDate()}
                value={mainMenuDate}
                onChange={e => field('mainMenuDate', e.target.value)}
                className="input-field pl-10"
              />
            </div>
            {(() => {
              const note = getOrderWindowNote();
              return (
                <p className={`text-xs mt-1.5 flex items-start gap-1.5 ${note.warn ? 'text-amber-600' : 'text-green-700'}`}>
                  <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={note.warn
                      ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                      : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    } />
                  </svg>
                  {note.text}
                </p>
              );
            })()}
          </div>

          {mainMenuFulfillment === 'delivery' && (
            <div className="mb-4">
              <label className="text-xs font-medium text-dark-600 block mb-1.5">Delivery Address</label>
              <div className="relative">
                <svg className="w-4 h-4 text-dark-600 absolute left-3 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <textarea rows={3} value={mainMenuAddress} onChange={e => field('mainMenuAddress', e.target.value)}
                  placeholder="Full delivery address including postcode…" className="input-field pl-9 resize-none" />
              </div>
              <p className="text-xs text-dark-600 mt-1 italic">Free delivery until 31st August 2026.</p>
            </div>
          )}

          <div className="mb-6">
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Special Instructions <span className="font-normal">(optional)</span></label>
            <textarea rows={2} value={mainMenuNotes} onChange={e => field('mainMenuNotes', e.target.value)}
              placeholder="Dietary requirements, allergy notes, gate codes…" className="input-field resize-none" />
          </div>

          <button
            onClick={onNext}
            disabled={!canContinue}
            className={`btn-primary w-full justify-center ${!canContinue ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Continue to Menu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Info panel */}
        <div className="space-y-3">
          {[
            { label: 'Minimum Order', value: '£150', desc: 'Choose any combination of dishes.' },
            { label: 'Order Window', value: 'Sat – Mon', desc: 'Orders open Saturday, close 12pm Monday.' },
            { label: 'Dispatch', value: 'From Tuesday', desc: 'Freshly prepared and dispatched from Tuesday.' },
            { label: 'Delivery', value: 'Free*', desc: 'Free delivery until 31st August 2026.' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-gray-100 rounded-sm p-4 shadow-sm">
              <p className="text-xs font-bold tracking-widest uppercase text-dark-600 mb-0.5">{card.label}</p>
              <p className="text-xl font-serif font-bold text-primary mb-1">{card.value}</p>
              <p className="text-xs text-dark-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 2: Menu Selection ─── */
function Step2({ state, dispatch, total, onBack, onNext }) {
  const { mainMenuItems } = state;
  const meetsMin = total >= MIN_ORDER;
  const selected = ALL_ITEMS.filter(i => (mainMenuItems[i.id] ?? 0) > 0);

  function setQty(id, qty) {
    dispatch({ type: 'UPDATE_MAIN_MENU_ITEM', payload: { id, qty } });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">
      <div className="grid lg:grid-cols-[1fr_268px] gap-6 items-start">

        <div>
          {MAIN_MENU_SECTIONS.map(section => (
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
                  const qty = mainMenuItems[item.id] ?? 0;
                  return (
                    <div key={item.id}
                      className={`bg-white border rounded-sm p-4 flex items-center gap-3 transition-colors ${qty > 0 ? 'border-primary/40 bg-primary/5' : 'border-gray-200'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark">{item.name}</p>
                        <p className="text-xs text-dark-600 mt-0.5">{item.size}</p>
                      </div>
                      <p className="text-sm font-bold text-primary shrink-0 mr-2">{fmt(item.price)}</p>
                      <Stepper qty={qty} onChange={v => setQty(item.id, v)} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
            <button onClick={onBack} className="btn-outline-dark text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Order Details
            </button>
            <button onClick={onNext} disabled={!meetsMin}
              className={`btn-primary text-sm ${!meetsMin ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Continue to Review
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-dark-600 bg-green-50 border border-green-100 rounded-sm px-4 py-3">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All our food is halal. Let us know of any dietary requirements.
          </div>
        </div>

        {/* Desktop live summary */}
        <div className="hidden lg:block sticky top-32">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-offwhite flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-semibold text-dark">Your Order</p>
            </div>

            <div className="p-4 max-h-56 overflow-y-auto">
              {selected.length === 0 ? (
                <p className="text-xs text-dark-600 italic">No items selected yet.</p>
              ) : (
                selected.map(item => (
                  <div key={item.id} className="flex justify-between text-xs mb-2 last:mb-0">
                    <span className="text-dark-600 max-w-[140px] leading-tight">{item.name} × {mainMenuItems[item.id]}</span>
                    <span className="font-medium text-dark ml-2 shrink-0">{fmt(item.price * mainMenuItems[item.id])}</span>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 border-t border-gray-100">
              <div className="flex justify-between text-sm font-bold py-3">
                <span className="text-dark">Total</span>
                <span className="text-primary">{fmt(total)}</span>
              </div>
              {!meetsMin && total > 0 && (
                <p className="text-xs text-amber-600 -mt-1 mb-3">
                  {fmt(MIN_ORDER - total)} more to reach the £150 minimum.
                </p>
              )}
              {!meetsMin && total === 0 && (
                <p className="text-xs text-dark-600 -mt-1 mb-3">Minimum order is £150.</p>
              )}
            </div>

            <div className="px-4 pb-4">
              <button onClick={onNext} disabled={!meetsMin}
                className={`btn-primary w-full justify-center text-sm ${!meetsMin ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Continue to Review
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <button onClick={onNext} disabled={!meetsMin}
          className={`w-full btn-primary justify-between text-sm ${!meetsMin ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <span>Continue to Review</span>
          <span className="font-bold">{fmt(total)}</span>
        </button>
        {!meetsMin && (
          <p className="text-center text-xs text-amber-600 mt-1">Min. £{MIN_ORDER} · {fmt(Math.max(0, MIN_ORDER - total))} to go</p>
        )}
      </div>
    </div>
  );
}

/* ─── STEP 3: Review & Send ─── */
function Step3({ state, dispatch, total, onBack, onSubmit, submitted, waMessage }) {
  const { mainMenuItems, mainMenuFulfillment, mainMenuDate, mainMenuAddress, mainMenuNotes, mainMenuContact } = state;
  const selected = ALL_ITEMS.filter(i => (mainMenuItems[i.id] ?? 0) > 0);

  function updateContact(key, val) {
    dispatch({ type: 'UPDATE_MAIN_MENU_CONTACT', payload: { [key]: val } });
  }

  const canSubmit = mainMenuContact.name && mainMenuContact.email && mainMenuContact.phone && selected.length > 0;

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
          <p className="text-dark-600 mb-2">Thank you, {mainMenuContact.name}.</p>
          <p className="text-dark-600 mb-6">
            We'll be in touch at <span className="font-medium text-dark">{mainMenuContact.email}</span> within 2 hours.
          </p>
          <p className="text-2xl font-bold text-primary mb-4">{fmt(total)}</p>
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
        <p className="text-sm text-dark-600 mt-1">Check everything looks right then add your contact details.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
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
                <input type="text" value={mainMenuContact.name} onChange={e => updateContact('name', e.target.value)}
                  placeholder="Your full name" className="input-field" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-dark-600 block mb-1">Email</label>
                  <input type="email" value={mainMenuContact.email} onChange={e => updateContact('email', e.target.value)}
                    placeholder="you@example.com" className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-600 block mb-1">Phone</label>
                  <input type="tel" value={mainMenuContact.phone} onChange={e => updateContact('phone', e.target.value)}
                    placeholder="+44 7000 000 000" className="input-field" />
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Details
            </h3>
            {[
              { label: 'Fulfilment', value: mainMenuFulfillment === 'delivery' ? 'Delivery (free until 31 Aug 2026)' : 'Collection' },
              { label: 'Date', value: mainMenuDate },
              mainMenuFulfillment === 'delivery' ? { label: 'Address', value: mainMenuAddress } : null,
              mainMenuNotes ? { label: 'Instructions', value: mainMenuNotes } : null,
            ].filter(Boolean).map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs text-dark-600 shrink-0">{row.label}</span>
                <span className="text-xs font-medium text-dark text-right max-w-[200px]">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Items Ordered
            </h3>
            {selected.length === 0 ? (
              <p className="text-sm text-dark-600 italic">No items selected. <button onClick={onBack} className="text-primary underline">Go back to menu.</button></p>
            ) : selected.map(item => (
              <div key={item.id} className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-dark">{item.name}</p>
                  <p className="text-xs text-dark-600">Qty: {mainMenuItems[item.id]} · {item.size}</p>
                </div>
                <span className="text-sm font-bold text-dark ml-4 shrink-0">{fmt(item.price * mainMenuItems[item.id])}</span>
              </div>
            ))}
          </div>

          <button onClick={onBack} className="btn-outline-dark text-sm w-full justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu
          </button>
        </div>

        {/* Price + submit */}
        <div>
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm sticky top-24">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-dark">Price Summary</h3>
            </div>
            <div className="p-5 space-y-2">
              {selected.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-dark-600 max-w-[150px] truncate">{item.name} × {mainMenuItems[item.id]}</span>
                  <span className="font-medium text-dark">{fmt(item.price * mainMenuItems[item.id])}</span>
                </div>
              ))}
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
export default function MainMenuFlow() {
  const { state, dispatch, computed } = useOrder();
  const { mainMenuStep } = state;
  const { mainMenuTotal } = computed;
  const [submitted, setSubmitted] = useState(false);
  const [waMessage, setWaMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [mainMenuStep]);

  function goBack() { dispatch({ type: 'SET_STEP', payload: 1 }); }

  function handleSubmit() {
    const msg = buildMainMenuMessage(state, computed);
    openWhatsApp(msg);
    saveOrder({
      serviceType: 'main-menu',
      contact: state.mainMenuContact,
      estimatedTotal: mainMenuTotal,
      orderData: {
        fulfillment: state.mainMenuFulfillment,
        date: state.mainMenuDate,
        address: state.mainMenuAddress,
        notes: state.mainMenuNotes,
        items: ALL_ITEMS
          .filter(i => (state.mainMenuItems[i.id] ?? 0) > 0)
          .map(i => ({ id: i.id, name: i.name, qty: state.mainMenuItems[i.id], price: i.price * state.mainMenuItems[i.id] })),
      },
    });
    setWaMessage(msg);
    setSubmitted(true);
  }

  return (
    <div>
      <Progress current={mainMenuStep} onBack={goBack} />
      {mainMenuStep === 1 && (
        <Step1 state={state} dispatch={dispatch} onNext={() => dispatch({ type: 'SET_MAIN_MENU_STEP', payload: 2 })} />
      )}
      {mainMenuStep === 2 && (
        <Step2 state={state} dispatch={dispatch} total={mainMenuTotal}
          onBack={() => dispatch({ type: 'SET_MAIN_MENU_STEP', payload: 1 })}
          onNext={() => dispatch({ type: 'SET_MAIN_MENU_STEP', payload: 3 })}
        />
      )}
      {mainMenuStep === 3 && (
        <Step3 state={state} dispatch={dispatch} total={mainMenuTotal}
          onBack={() => dispatch({ type: 'SET_MAIN_MENU_STEP', payload: 2 })}
          onSubmit={handleSubmit}
          submitted={submitted}
          waMessage={waMessage}
        />
      )}
    </div>
  );
}

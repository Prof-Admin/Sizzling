import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../../context/OrderContext';
import { openWhatsApp, buildGrazingMessage } from '../../../utils/whatsapp';
import { saveOrder } from '../../../utils/api';
import { useMenuConfig } from '../../../context/MenuConfigContext';

const EVENT_TYPES = [
  'Wedding Reception', 'Corporate Event', 'Birthday Party', 'Anniversary',
  'Baby Shower', 'Graduation', 'Networking Event', 'Product Launch', 'Other',
];

const DIETARY_OPTIONS = [
  { id: 'nut-free',     label: 'Nut Free' },
  { id: 'gluten-free',  label: 'Gluten Free' },
  { id: 'vegan',        label: 'Vegan' },
  { id: 'halal',        label: 'Halal Only' },
];

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 mb-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-primary">{icon}</span>
        <h3 className="text-base font-semibold text-dark">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function getGrazingMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().split('T')[0];
}

export default function Step5Details() {
  const { state, dispatch, computed } = useOrder();
  const { menuSections } = useMenuConfig();
  const { details } = state;
  const { total } = computed;
  const [submitted, setSubmitted] = useState(false);
  const [waMessage, setWaMessage] = useState('');

  function update(field, value) {
    dispatch({ type: 'UPDATE_DETAILS', payload: { [field]: value } });
  }

  function toggleDietary(id) {
    const current = details.dietary;
    const next = current.includes(id) ? current.filter(d => d !== id) : [...current, id];
    update('dietary', next);
  }

  function handleSubmit() {
    if (!details.name || !details.email || !details.phone) return;
    const msg = buildGrazingMessage(state, computed, menuSections);
    openWhatsApp(msg);
    saveOrder({
      serviceType: 'grazing',
      contact: { name: details.name, email: details.email, phone: details.phone },
      estimatedTotal: computed.total,
      orderData: {
        style: state.style,
        guestTier: state.guestTier,
        primaryColor: state.primaryColor,
        accentColor: state.accentColor,
        menuItems: state.menuItems,
        brunchPackages: state.addedPackages,
        logistics: {
          setupTime: state.setupTime,
          staffCount: state.staffCount,
          staffHours: state.staffHours,
          kitchenStatus: state.kitchenStatus,
          accessNotes: state.accessNotes,
        },
        event: {
          eventType: details.eventType,
          eventDate: details.eventDate,
          startTime: details.startTime,
          venue: details.venue,
          deliveryTime: details.deliveryTime,
          occasionNotes: details.occasionNotes,
        },
        dietary: { requirements: details.dietary, details: details.allergyDetails },
      },
    });
    setWaMessage(msg);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-dark mb-3">Order Submitted!</h2>
        <p className="text-dark-600 mb-2">Thank you, {details.name}. Your catering enquiry has been received.</p>
        <p className="text-dark-600 mb-6">We will be in touch at <span className="font-medium text-dark">{details.email}</span> within 24 hours to confirm your booking.</p>
        <p className="text-2xl font-bold text-primary mb-4">Estimated Total: £{total.toFixed(2)}</p>
        <p className="text-sm text-dark-600 mb-6">Your WhatsApp message was opened automatically. If it didn't open, <button onClick={() => openWhatsApp(waMessage)} className="text-primary underline font-medium">click here to resend</button>.</p>
        <Link to="/" className="btn-outline-dark justify-center">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary">Almost There!</h1>
        <p className="text-dark-600 mt-1">Provide your contact and event specifics to finalise the booking. Our chefs are standing by.</p>
      </div>

      {/* Contact */}
      <SectionCard
        title="Contact Information"
        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Full Name</label>
            <input type="text" value={details.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Ama Mensah" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Email Address</label>
            <input type="email" value={details.email} onChange={e => update('email', e.target.value)} placeholder="ama@example.com" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Phone Number</label>
            <input type="tel" value={details.phone} onChange={e => update('phone', e.target.value)} placeholder="+44 7000 000 000" className="input-field" />
          </div>
        </div>
      </SectionCard>

      {/* Event Specifics */}
      <SectionCard
        title="Event Specifics"
        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Event Type</label>
            <div className="relative">
              <select value={details.eventType} onChange={e => update('eventType', e.target.value)} className="select-field pr-8">
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <svg className="w-4 h-4 text-dark-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Event Date</label>
            <input
              type="date"
              min={getGrazingMinDate()}
              value={details.eventDate}
              onChange={e => update('eventDate', e.target.value)}
              className="input-field"
            />
            <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Grazing Tables require a minimum of 3 weeks' notice.
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Start Time</label>
            <input type="time" value={details.startTime} onChange={e => update('startTime', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Venue Name / Location</label>
            <input type="text" value={details.venue} onChange={e => update('venue', e.target.value)} placeholder="e.g. Kensington Hall" className="input-field" />
          </div>
        </div>
      </SectionCard>

      {/* Delivery Details */}
      <SectionCard
        title="Delivery Details"
        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Preferred Delivery Time</label>
            <input type="time" value={details.deliveryTime} onChange={e => update('deliveryTime', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">Occasion Notes</label>
            <textarea value={details.occasionNotes} onChange={e => update('occasionNotes', e.target.value)} placeholder="Tell us more about the celebration..." rows={4} className="input-field resize-none" />
          </div>
        </div>
      </SectionCard>

      {/* Dietary */}
      <div className="bg-white border-2 border-gold/40 rounded-sm p-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="text-base font-semibold text-dark">Dietary & Allergies</h3>
        </div>
        <p className="text-xs text-dark-600 italic mb-4">Safety is our priority. Please be as specific as possible.</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {DIETARY_OPTIONS.map(opt => {
            const checked = details.dietary.includes(opt.id);
            return (
              <label key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer text-sm transition-colors
                ${checked ? 'border-primary bg-primary/5 text-primary' : 'border-gray-300 text-dark hover:border-gray-400'}`}>
                <input type="checkbox" checked={checked} onChange={() => toggleDietary(opt.id)} className="accent-primary" />
                {opt.label}
              </label>
            );
          })}
        </div>
        <div>
          <label className="text-xs font-medium text-dark-600 block mb-1.5">Detailed Requirements</label>
          <textarea
            value={details.allergyDetails}
            onChange={e => update('allergyDetails', e.target.value)}
            placeholder="List specific allergies or additional catering notes here..."
            rows={3}
            className="input-field resize-none"
          />
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        <button onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })} className="btn-outline-dark text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Logistics
        </button>
        <button
          onClick={handleSubmit}
          disabled={!details.name || !details.email || !details.phone}
          className={`btn-primary text-sm ${(!details.name || !details.email || !details.phone) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Send Order via WhatsApp
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

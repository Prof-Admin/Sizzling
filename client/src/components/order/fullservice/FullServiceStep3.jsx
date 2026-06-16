import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../../context/OrderContext';
import FullServiceSummary from './FullServiceSummary';
import { openWhatsApp, buildFullServiceMessage } from '../../../utils/whatsapp';
import { saveOrder } from '../../../utils/api';
import { useMenuConfig } from '../../../context/MenuConfigContext';

const EVENT_TYPES = ['Wedding Reception', 'Corporate Gala', 'Birthday Celebration', 'Anniversary Dinner', 'Networking Event', 'Product Launch', 'Graduation Party', 'Other'];

export default function FullServiceStep3() {
  const { state, dispatch, computed } = useOrder();
  const { fsMenu } = useMenuConfig();
  const { fsDetails } = state;
  const { fsTotal } = computed;
  const [submitted, setSubmitted] = useState(false);

  function update(key, val) {
    dispatch({ type: 'UPDATE_FS_DETAILS', payload: { [key]: val } });
  }

  const canSubmit = fsDetails.name && fsDetails.email && fsDetails.phone;

  function handleSubmit() {
    if (!canSubmit) return;
    openWhatsApp(buildFullServiceMessage(state, computed, fsMenu));
    saveOrder({
      serviceType: 'full-service',
      contact: { name: fsDetails.name, email: fsDetails.email, phone: fsDetails.phone },
      estimatedTotal: computed.fsTotal,
      orderData: {
        package: state.fsPackage,
        guests: state.fsGuests,
        selectedItems: state.fsSelectedItems,
        event: {
          eventType: fsDetails.eventType,
          eventDate: fsDetails.eventDate,
          startTime: fsDetails.startTime,
          venue: fsDetails.venue,
        },
        dietary: fsDetails.dietary,
      },
    });
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
        <h2 className="text-3xl font-serif font-bold text-dark mb-3">Booking Confirmed!</h2>
        <p className="text-dark-600 mb-2">Thank you, {fsDetails.name}. Your full-service catering enquiry is received.</p>
        <p className="text-dark-600 mb-6">
          We'll reach out at <span className="font-medium text-dark">{fsDetails.email}</span> within 24 hours to finalise details.
        </p>
        <p className="text-2xl font-bold text-primary mb-8">
          ${fsTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} estimated total
        </p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* "Almost There!" heading */}
      <h1 className="text-4xl font-serif font-bold text-center text-dark mb-8">Almost There!</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

        {/* Left — two column form */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Top row: Contact + Event Specifics side by side */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-dark-600 uppercase block mb-1.5">Full Name</label>
                  <input type="text" value={fsDetails.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Ama Mensah" className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-dark-600 uppercase block mb-1.5">Email Address</label>
                  <input type="email" value={fsDetails.email} onChange={e => update('email', e.target.value)} placeholder="ama@example.com" className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-dark-600 uppercase block mb-1.5">Phone Number</label>
                  <input type="tel" value={fsDetails.phone} onChange={e => update('phone', e.target.value)} placeholder="+233 XX XXX XXXX" className="input-field text-sm" />
                </div>
              </div>
            </div>

            {/* Event Specifics */}
            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Event Specifics
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-dark-600 uppercase block mb-1.5">Event Type</label>
                  <div className="relative">
                    <select value={fsDetails.eventType} onChange={e => update('eventType', e.target.value)} className="select-field text-sm pr-8">
                      {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <svg className="w-4 h-4 text-dark-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-dark-600 uppercase block mb-1.5">Event Date</label>
                    <input type="date" value={fsDetails.eventDate} onChange={e => update('eventDate', e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-dark-600 uppercase block mb-1.5">Start Time</label>
                    <input type="time" value={fsDetails.startTime} onChange={e => update('startTime', e.target.value)} className="input-field text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-dark-600 uppercase block mb-1.5">Venue Location</label>
                  <input type="text" value={fsDetails.venue} onChange={e => update('venue', e.target.value)} placeholder="Hotel, Estate, or Residence" className="input-field text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Requirements */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Dietary Requirements
            </h3>
            <div>
              <label className="text-[10px] font-bold tracking-widest text-dark-600 uppercase block mb-1.5">Allergies & Special Requests</label>
              <textarea
                value={fsDetails.dietary}
                onChange={e => update('dietary', e.target.value)}
                placeholder="Please detail any gluten-free, vegan, or nut-allergy requirements here..."
                rows={4}
                className="input-field resize-none text-sm"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center pt-2">
            <button
              id="fs-submit-btn"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-10 py-3.5 bg-gold text-dark font-bold text-sm rounded-sm hover:bg-gold-dark transition-colors
                ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Send Order via WhatsApp
              <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex justify-start pt-2">
            <button onClick={() => dispatch({ type: 'SET_FS_STEP', payload: 2 })} className="btn-outline-dark text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Menu Selection
            </button>
          </div>
        </div>

        {/* Right — summary */}
        <FullServiceSummary />
      </div>
    </div>
  );
}

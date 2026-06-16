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
  const [waMessage, setWaMessage] = useState('');

  function update(key, val) {
    dispatch({ type: 'UPDATE_FS_DETAILS', payload: { [key]: val } });
  }

  const canSubmit = fsDetails.name && fsDetails.email && fsDetails.phone;

  function handleSubmit() {
    if (!canSubmit) return;
    setWaMessage(buildFullServiceMessage(state, computed, fsMenu));
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
        <p className="text-2xl font-bold text-primary mb-6">
          £{fsTotal.toLocaleString('en-GB', { minimumFractionDigits: 2 })} estimated total
        </p>
        <button
          onClick={() => openWhatsApp(waMessage)}
          className="btn-primary mb-4 justify-center w-full max-w-xs mx-auto"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Send Order via WhatsApp
        </button>
        <Link to="/" className="btn-outline-dark justify-center">Back to Home</Link>
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

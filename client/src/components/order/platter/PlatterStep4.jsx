import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../../context/OrderContext';
import { openWhatsApp, buildPlatterMessage } from '../../../utils/whatsapp';
import { saveOrder } from '../../../utils/api';

function fmt(n) { return `£${n.toFixed(2)}`; }

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-dark-600">{label}</span>
      <span className="text-xs font-medium text-dark text-right max-w-[200px]">{value}</span>
    </div>
  );
}

export default function PlatterStep4() {
  const { state, dispatch, computed } = useOrder();
  const {
    platterBasket, platterFulfillment, platterGuests, platterDate,
    platterAddress, platterSpecialInstructions, platterContact,
  } = state;
  const { platterSubtotal, platterFee, platterTotal } = computed;

  const [submitted, setSubmitted] = useState(false);
  const [waMessage, setWaMessage] = useState('');

  function updateContact(key, val) {
    dispatch({ type: 'UPDATE_PLATTER_CONTACT', payload: { [key]: val } });
  }

  const canSubmit = platterContact.name && platterContact.email && platterContact.phone && platterBasket.length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    setWaMessage(buildPlatterMessage(state, computed));
    saveOrder({
      serviceType: 'platter',
      contact: { name: platterContact.name, email: platterContact.email, phone: platterContact.phone },
      estimatedTotal: computed.platterTotal,
      orderData: {
        fulfillment: platterFulfillment,
        guests: platterGuests,
        date: platterDate,
        address: platterAddress,
        specialInstructions: platterSpecialInstructions,
        items: platterBasket,
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
        <h2 className="text-3xl font-serif font-bold text-dark mb-3">Order Confirmed!</h2>
        <p className="text-dark-600 mb-2">Thank you, {platterContact.name}. Your platter order is in.</p>
        <p className="text-dark-600 mb-6">
          Confirmation sent to <span className="font-medium text-dark">{platterContact.email}</span>. We'll be in touch within 2 hours.
        </p>
        <p className="text-2xl font-bold text-primary mb-6">{fmt(platterTotal)} total</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h2 className="text-2xl font-serif font-bold text-dark">Review Your Order</h2>
        <p className="text-sm text-dark-600 mt-1">Check everything looks right before placing your order.</p>
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
                  value={platterContact.name}
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
                    value={platterContact.email}
                    onChange={e => updateContact('email', e.target.value)}
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-600 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={platterContact.phone}
                    onChange={e => updateContact('phone', e.target.value)}
                    placeholder="+44 7000 000 000"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order details summary */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Details
            </h3>
            <InfoRow label="Service" value={platterFulfillment === 'delivery' ? 'Delivery' : 'Collection'} />
            <InfoRow label="Guests" value={`${platterGuests} guests`} />
            <InfoRow label="Date" value={platterDate} />
            {platterFulfillment === 'delivery' && <InfoRow label="Address" value={platterAddress} />}
            {platterSpecialInstructions && <InfoRow label="Special Instructions" value={platterSpecialInstructions} />}
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
            {platterBasket.length === 0 ? (
              <p className="text-sm text-dark-600 italic">No items in basket. <button onClick={() => dispatch({ type: 'SET_PLATTER_STEP', payload: 2 })} className="text-primary underline">Go back to menu.</button></p>
            ) : (
              <div className="space-y-0">
                {platterBasket.map(item => (
                  <div key={item.id} className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-dark">{item.name}</p>
                      {item.detail && <p className="text-xs text-dark-600">{item.detail}</p>}
                    </div>
                    <span className="text-sm font-bold text-dark ml-4 shrink-0">{fmt(item.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — price summary */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden sticky top-20">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-dark">Price Breakdown</h3>
            </div>
            <div className="p-5 space-y-2.5">
              {platterBasket.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-dark-600 max-w-[150px] truncate">{item.name}</span>
                  <span className="font-medium text-dark">{fmt(item.price)}</span>
                </div>
              ))}
              {platterBasket.length > 0 && <div className="border-t border-gray-100 pt-2.5" />}
              <div className="flex justify-between text-sm">
                <span className="text-dark-600">Subtotal</span>
                <span className="font-medium text-dark">{fmt(platterSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-600">Service Fee (5%)</span>
                <span className="text-dark-600">{fmt(platterFee)}</span>
              </div>
            </div>
            <div className="bg-primary px-5 py-3.5 flex justify-between">
              <span className="text-sm font-bold text-white uppercase tracking-wide">Total</span>
              <span className="text-lg font-bold text-white">{fmt(platterTotal)}</span>
            </div>
            <div className="p-4">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`btn-primary w-full justify-center text-sm ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Send Order via WhatsApp
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <p className="text-[10px] text-dark-600 text-center mt-3">
                By placing your order you agree to our Terms of Service.
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: 'SET_PLATTER_STEP', payload: 3 })}
            className="w-full btn-outline-dark text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Delivery
          </button>
        </div>
      </div>
    </div>
  );
}

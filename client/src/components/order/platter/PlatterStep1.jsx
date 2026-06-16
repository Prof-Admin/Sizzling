import { useOrder } from '../../../context/OrderContext';

const HERO_IMG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop';

const BENEFITS = [
  'Individual gourmet plating for each guest.',
  'Custom allergen-aware menu options.',
  'Professional white-glove delivery setup.',
];

export default function PlatterStep1() {
  const { state, dispatch } = useOrder();
  const { platterFulfillment, platterGuests, platterDate, platterAddress } = state;

  function setField(key, val) {
    dispatch({ type: 'SET_PLATTER_FIELD', payload: { key, val } });
  }

  function canContinue() {
    if (!platterDate || platterGuests < 5) return false;
    if (platterFulfillment === 'delivery' && !platterAddress.trim()) return false;
    return true;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">

        {/* Left — form */}
        <div className="bg-white border border-gray-200 rounded-sm p-6">

          {/* Fulfillment toggle */}
          <p className="text-sm font-medium text-dark mb-3">How would you like to receive your sensation?</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { id: 'delivery', label: 'Delivery', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              )},
              { id: 'collection', label: 'Collection', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )},
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setField('platterFulfillment', opt.id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-sm border-2 text-sm font-semibold transition-all
                  ${platterFulfillment === opt.id
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-200 text-dark hover:border-gray-300 bg-white'
                  }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {/* Guests + Date */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-dark-600 block mb-1.5">Number of Guests</label>
              <div className="relative">
                <svg className="w-4 h-4 text-dark-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="number"
                  min={5}
                  value={platterGuests}
                  onChange={e => setField('platterGuests', Math.max(5, parseInt(e.target.value) || 5))}
                  className="input-field pl-10"
                />
              </div>
              <p className="text-xs text-dark-600 mt-1">Minimum 5 guests for plated service.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-dark-600 block mb-1.5">Preferred Date</label>
              <div className="relative">
                <svg className="w-4 h-4 text-dark-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  value={platterDate}
                  onChange={e => setField('platterDate', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          {platterFulfillment === 'delivery' && (
            <div className="mb-4">
              <label className="text-xs font-medium text-dark-600 block mb-1.5">Delivery Address</label>
              <div className="relative">
                <svg className="w-4 h-4 text-dark-600 absolute left-3 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <textarea
                  rows={4}
                  value={platterAddress}
                  onChange={e => setField('platterAddress', e.target.value)}
                  placeholder="Enter full delivery address, including postcode..."
                  className="input-field pl-9 resize-none"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <svg className="w-3.5 h-3.5 text-dark-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-dark-600 italic">Standard delivery area includes a 15-mile radius from Central London.</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => dispatch({ type: 'SET_PLATTER_STEP', payload: 2 })}
              disabled={!canContinue()}
              className={`btn-primary px-10 ${!canContinue() ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Continue to Menu
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right — info panel */}
        <div className="space-y-4">
          <div className="rounded-sm overflow-hidden bg-white border border-gray-200 shadow-sm">
            <img src={HERO_IMG} alt="Premium plated experience" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-base font-serif font-bold text-dark">Premium Experience</h3>
              <p className="text-sm text-dark-600 mt-1 leading-relaxed">
                Every order is prepared with culinary passion and delivered in temperature-controlled sustainable packaging.
              </p>
            </div>
          </div>

          <div className="bg-gold/15 border border-gold/30 rounded-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gold-dark" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-semibold text-dark">Why Choose Our Plated Service?</p>
            </div>
            <ul className="space-y-2">
              {BENEFITS.map(b => (
                <li key={b} className="flex items-start gap-2 text-sm text-dark-700">
                  <svg className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
            className="w-full text-sm text-dark-600 hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change service type
          </button>
        </div>
      </div>
    </div>
  );
}

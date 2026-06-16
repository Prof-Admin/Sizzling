import { useOrder } from '../../../context/OrderContext';

const DELIVERY_WINDOWS = [
  { id: 'morning',   label: 'Morning',   time: '8:00 AM – 11:00 AM' },
  { id: 'midday',    label: 'Midday',    time: '11:00 AM – 2:00 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '2:00 PM – 5:00 PM' },
  { id: 'evening',   label: 'Evening',   time: '5:00 PM – 8:00 PM' },
];

const ACCESS_OPTIONS = [
  { id: 'ground',    label: 'Ground floor / easy access' },
  { id: 'elevator',  label: 'Elevator available' },
  { id: 'stairs',    label: 'Stairs only' },
  { id: 'reception', label: 'Collect from reception' },
];

export default function PlatterStep3() {
  const { state, dispatch } = useOrder();
  const { platterFulfillment, platterSpecialInstructions } = state;

  const deliveryWindow = state.deliveryWindow ?? null;
  const accessOption  = state.accessOption  ?? null;

  function setField(key, val) {
    dispatch({ type: 'SET_PLATTER_FIELD', payload: { key, val } });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h2 className="text-2xl font-serif font-bold text-dark">
          {platterFulfillment === 'collection' ? 'Collection Details' : 'Delivery Details'}
        </h2>
        <p className="text-sm text-dark-600 mt-1">
          {platterFulfillment === 'collection'
            ? 'Let us know when you\'ll be collecting your order.'
            : 'Tell us your preferred delivery window and any access requirements.'}
        </p>
      </div>

      {/* Preferred delivery window */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 mb-5">
        <h3 className="text-sm font-semibold text-dark mb-4">
          Preferred {platterFulfillment === 'collection' ? 'Collection' : 'Delivery'} Window
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DELIVERY_WINDOWS.map(w => {
            const active = deliveryWindow === w.id;
            return (
              <label key={w.id}
                className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-colors
                  ${active ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <input
                  type="radio"
                  name="window"
                  checked={active}
                  onChange={() => setField('deliveryWindow', w.id)}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-dark">{w.label}</p>
                  <p className="text-xs text-dark-600">{w.time}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Access requirements (delivery only) */}
      {platterFulfillment === 'delivery' && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-5">
          <h3 className="text-sm font-semibold text-dark mb-4">Venue Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACCESS_OPTIONS.map(opt => {
              const active = accessOption === opt.id;
              return (
                <label key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-colors
                    ${active ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <input
                    type="radio"
                    name="access"
                    checked={active}
                    onChange={() => setField('accessOption', opt.id)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-dark">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Special instructions */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 mb-8">
        <h3 className="text-sm font-semibold text-dark mb-3">Special Instructions</h3>
        <textarea
          value={platterSpecialInstructions}
          onChange={e => setField('platterSpecialInstructions', e.target.value)}
          placeholder="Dietary requirements, setup preferences, allergy notes, gate codes..."
          rows={4}
          className="input-field resize-none"
        />
        <p className="text-xs text-dark-600 mt-2 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Our team reviews all notes before dispatch to accommodate your needs.
        </p>
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        <button onClick={() => dispatch({ type: 'SET_PLATTER_STEP', payload: 2 })} className="btn-outline-dark text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Menu
        </button>
        <button onClick={() => dispatch({ type: 'SET_PLATTER_STEP', payload: 4 })} className="btn-primary text-sm">
          Review & Finalise
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

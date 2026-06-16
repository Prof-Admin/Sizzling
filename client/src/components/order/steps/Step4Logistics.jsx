import { useOrder } from '../../../context/OrderContext';

const KITCHEN_OPTIONS = [
  { id: 'full',    label: 'Fully working professional kitchen',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  },
  { id: 'limited', label: 'Limited facilities (Sink/Power only)',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
  },
  { id: 'none',    label: 'No kitchen (Outdoor/Marquee)',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" points="9,22 9,12 15,12 15,22" /></svg>,
  },
  { id: 'check',  label: 'Check with venue for me',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
];

const SETUP_TIMES = ['1 hr', '2 hrs', '3 hrs', 'Half Day'];

const STAFFING_GUIDE = [
  { range: '0 – 50 GUESTS',   count: '2-3 Staff',   note: 'Perfect for intimate gatherings' },
  { range: '51 – 100 GUESTS',  count: '4-6 Staff',   note: 'Standard for medium events' },
  { range: '101 – 200 GUESTS', count: '8-10 Staff',  note: 'Essential for larger parties' },
  { range: '200+ GUESTS',      count: 'Custom',      note: 'Enquire for bespoke teams' },
];

export default function Step4Logistics() {
  const { state, dispatch } = useOrder();
  const { kitchenStatus, setupTime, accessNotes, staffCount, staffHours } = state;

  function setField(key, val) {
    dispatch({ type: 'SET_LOGISTICS', payload: { [key]: val } });
  }

  const staffTotal = staffCount * Math.max(staffHours, 6) * (100 / 6);

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl">
      {/* Venue logistics header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-dark">Venue Logistics</h2>
          <p className="text-sm text-dark-600">Tell us about your kitchen facilities and setup requirements.</p>
        </div>
      </div>

      {/* Kitchen + Setup grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Kitchen Status */}
        <div className="bg-white border border-gray-200 rounded-sm p-5">
          <h3 className="text-sm font-semibold text-dark mb-4">Venue Kitchen Status</h3>
          <div className="space-y-2">
            {KITCHEN_OPTIONS.map(opt => {
              const active = kitchenStatus === opt.id;
              return (
                <label key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-colors
                    ${active ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <input
                    type="radio"
                    name="kitchen"
                    checked={active}
                    onChange={() => setField('kitchenStatus', opt.id)}
                    className="accent-primary"
                  />
                  <span className="text-dark-600">{opt.icon}</span>
                  <span className="text-sm text-dark">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Setup time + access notes */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-4">Setup Time Selection</h3>
            <div className="grid grid-cols-2 gap-2">
              {SETUP_TIMES.map(t => {
                const active = setupTime === t;
                return (
                  <button
                    key={t}
                    onClick={() => setField('setupTime', t)}
                    className={`py-2 px-3 rounded-sm border-2 text-sm font-medium transition-colors
                      ${active ? 'border-primary bg-primary text-white' : 'border-gray-200 text-dark hover:border-gray-300'}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-sm font-semibold text-dark mb-3">Venue Access Notes</h3>
            <textarea
              value={accessNotes}
              onChange={e => setField('accessNotes', e.target.value)}
              placeholder="e.g. Loading dock location, elevator code, narrow stairs..."
              rows={4}
              className="input-field resize-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Staffing */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-dark">Professional Staffing</h2>
          <p className="text-sm text-dark-600">Ensure your event runs smoothly with our premium service team.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Staffing guide */}
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-amber-800">Staffing Guide (Recommended)</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STAFFING_GUIDE.map(g => (
              <div key={g.range} className="bg-white rounded-sm p-3 border border-amber-100">
                <p className="text-[10px] text-dark-600 font-semibold tracking-wide">{g.range}</p>
                <p className="text-xl font-bold text-dark mt-1">{g.count}</p>
                <p className="text-xs text-dark-600 mt-0.5">{g.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <div className="bg-primary rounded-sm p-5 text-white">
          <h3 className="text-sm font-semibold mb-1">Staffing Calculator</h3>
          <p className="text-xs text-white/70 mb-4">£100 per staff member (minimum 6-hour shift included).</p>

          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs text-white/80 uppercase tracking-wider font-semibold block mb-1.5">Number of Staff</label>
              <input
                type="number"
                min={1}
                max={50}
                value={staffCount}
                onChange={e => setField('staffCount', Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white/10 border border-white/30 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="text-xs text-white/80 uppercase tracking-wider font-semibold block mb-1.5">Total Hours</label>
              <input
                type="number"
                min={6}
                max={24}
                value={staffHours}
                onChange={e => setField('staffHours', Math.max(6, parseInt(e.target.value) || 6))}
                className="w-full bg-white/10 border border-white/30 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-white"
              />
              <p className="text-xs text-white/50 mt-1">Note: Min 6 hrs required per person.</p>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4 flex items-center justify-between">
            <span className="text-sm font-semibold">Staffing Total:</span>
            <span className="text-2xl font-bold">£{staffTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        <button onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })} className="btn-outline-dark text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Step: Menu
        </button>
        <button onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })} className="btn-primary text-sm">
          Next Step: Confirm Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

import { useOrder } from '../../../context/OrderContext';

const STAFFING_GUIDE = [
  { range: 'Up to 30 guests',  staff: 'Minimum 2 staff' },
  { range: 'Up to 60 guests',  staff: 'Minimum 3 staff' },
  { range: 'Up to 100 guests', staff: 'Minimum 5 staff' },
];

const STAFF_RATE    = 15;
const STAFF_MIN_HRS = 4;

export default function Step4Logistics() {
  const { state, dispatch } = useOrder();
  const { staffCount, staffHours, accessNotes } = state;

  function setField(key, val) {
    dispatch({ type: 'SET_LOGISTICS', payload: { [key]: val } });
  }

  const hours      = Math.max(staffHours, STAFF_MIN_HRS);
  const staffTotal = staffCount * hours * STAFF_RATE;

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl">

      {/* ── Logistics ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-dark">Logistics</h2>
          <p className="text-sm text-dark-600">Delivery of food and grazing table items to your venue.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm p-5 mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <p className="text-sm font-semibold text-dark">Delivery to your venue</p>
          <p className="text-sm font-bold text-primary shrink-0">From £100</p>
        </div>
        <p className="text-sm text-dark-600 leading-relaxed mb-4">
          We deliver the food and grazing table items directly to your venue. The final logistics cost depends on your location and will be confirmed when we follow up on your enquiry.
        </p>
        <div>
          <label className="text-xs font-medium text-dark-600 block mb-1.5">Venue Address & Access Notes</label>
          <textarea
            value={accessNotes}
            onChange={e => setField('accessNotes', e.target.value)}
            placeholder="Venue name, address, loading dock location, elevator code, narrow stairs, parking info…"
            rows={4}
            className="input-field resize-none text-sm"
          />
          <p className="text-xs text-dark-600 mt-1.5 italic">The more detail you give us, the more accurate your logistics quote will be.</p>
        </div>
      </div>

      {/* ── Staffing ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-dark">Staffing</h2>
          <p className="text-sm text-dark-600">£{STAFF_RATE} per staff member / hour · Minimum {STAFF_MIN_HRS} hours per person.</p>
        </div>
      </div>

      <p className="text-sm text-dark-600 mb-5 leading-relaxed">
        Staff replenish the food and help keep your grazing table looking full and presentable throughout your event.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* Staffing recommendation guide */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="px-5 py-4 bg-offwhite border-b border-gray-100">
            <p className="text-sm font-semibold text-dark">Our Recommendation</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-dark-600 uppercase tracking-wide">Guest Count</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-dark-600 uppercase tracking-wide">Staffing</th>
              </tr>
            </thead>
            <tbody>
              {STAFFING_GUIDE.map((row, i) => (
                <tr key={row.range} className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  <td className="px-5 py-3 font-medium text-dark">{row.range}</td>
                  <td className="px-5 py-3 text-right text-dark-600">{row.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Staffing calculator */}
        <div className="bg-primary rounded-sm p-5 text-white">
          <h3 className="text-sm font-semibold mb-0.5">Staffing Calculator</h3>
          <p className="text-xs text-white/70 mb-5">£{STAFF_RATE}/hr per staff · {STAFF_MIN_HRS}hr minimum per person.</p>

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
              <label className="text-xs text-white/80 uppercase tracking-wider font-semibold block mb-1.5">Hours per Staff Member</label>
              <input
                type="number"
                min={STAFF_MIN_HRS}
                max={24}
                value={staffHours}
                onChange={e => setField('staffHours', Math.max(STAFF_MIN_HRS, parseInt(e.target.value) || STAFF_MIN_HRS))}
                className="w-full bg-white/10 border border-white/30 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-white"
              />
              <p className="text-xs text-white/50 mt-1">Minimum {STAFF_MIN_HRS} hours per staff member.</p>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4 space-y-1">
            <div className="flex justify-between text-xs text-white/70">
              <span>{staffCount} staff × {hours}hrs × £{STAFF_RATE}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Staffing Total</span>
              <span className="text-2xl font-bold">£{staffTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        <button onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })} className="btn-outline-dark text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous: Menu
        </button>
        <button onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })} className="btn-primary text-sm">
          Next: Confirm Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

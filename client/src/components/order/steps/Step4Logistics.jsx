import { useEffect } from 'react';
import { useOrder } from '../../../context/OrderContext';

const KITCHEN_OPTIONS = [
  { id: 'full',    label: 'Full working kitchen / prep space available' },
  { id: 'limited', label: 'Limited facilities (sink / power only)' },
  { id: 'none',    label: 'No kitchen (outdoor / marquee)' },
  { id: 'check',   label: 'Not sure, please check with the venue' },
];

const SETUP_TIMES = [
  '1 hour before guests arrive',
  '2 hours before guests arrive',
  '3 hours before guests arrive',
  'Half day before guests arrive',
];

const STAFFING_GUIDE = [
  { range: 'Up to 30 guests',  staff: 'Minimum 2 staff',  max: 30,  recommended: 2 },
  { range: 'Up to 60 guests',  staff: 'Minimum 3 staff',  max: 60,  recommended: 3 },
  { range: 'Up to 100 guests', staff: 'Minimum 5 staff',  max: 100, recommended: 5 },
];

const STAFF_RATE    = 15;
const STAFF_MIN_HRS = 4;

function recommendedStaff(guestCount) {
  if (guestCount <= 30)  return 2;
  if (guestCount <= 60)  return 3;
  if (guestCount <= 100) return 5;
  // Above 100: 5 base + 2 extra staff per every additional 30 guests (or part thereof)
  return 5 + Math.ceil((guestCount - 100) / 30) * 2;
}

export default function Step4Logistics() {
  const { state, dispatch } = useOrder();
  const { staffCount, staffHours, accessNotes, guestCount, kitchenStatus, setupTime } = state;

  useEffect(() => {
    dispatch({ type: 'SET_LOGISTICS', payload: { staffCount: recommendedStaff(guestCount) } });
  }, [guestCount]);

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
        <p className="text-sm text-dark-600 leading-relaxed mb-5">
          We deliver the food and grazing table items directly to your venue. The final logistics cost depends on your location and will be confirmed when we follow up on your enquiry.
        </p>

        {/* Kitchen / prep space */}
        <div className="mb-5">
          <label className="text-xs font-medium text-dark-600 block mb-1.5">
            Does your venue have a kitchen or prep space available?
          </label>
          <div className="relative">
            <select
              value={kitchenStatus || ''}
              onChange={e => setField('kitchenStatus', e.target.value)}
              className="input-field pr-8 appearance-none"
            >
              <option value="" disabled>Please select…</option>
              {KITCHEN_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <svg className="w-4 h-4 text-dark-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Preferred setup time */}
        <div className="mb-5">
          <label className="text-xs font-medium text-dark-600 block mb-1.5">Preferred Setup Time</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SETUP_TIMES.map(t => {
              const active = setupTime === t;
              return (
                <button
                  key={t}
                  onClick={() => setField('setupTime', t)}
                  className={`py-2.5 px-3 rounded-sm border-2 text-sm text-left transition-colors
                    ${active ? 'border-primary bg-primary text-white' : 'border-gray-200 text-dark hover:border-gray-300 bg-white'}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Access / parking notes */}
        <div>
          <label className="text-xs font-medium text-dark-600 block mb-1.5">Venue access / parking notes</label>
          <textarea
            value={accessNotes}
            onChange={e => setField('accessNotes', e.target.value)}
            placeholder="e.g. Loading bay at rear, stairs only, parking permit required…"
            rows={3}
            className="input-field resize-none text-sm"
          />
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
              {STAFFING_GUIDE.map((row) => {
                const active = guestCount <= row.max && (row.max === 30 ? guestCount <= 30 : row.max === 60 ? guestCount > 30 : guestCount > 60 && guestCount <= 100);
                return (
                  <tr key={row.range} className={`border-b border-gray-50 ${active ? 'bg-primary/5' : 'bg-white'}`}>
                    <td className={`px-5 py-3 font-medium ${active ? 'text-primary' : 'text-dark'}`}>{row.range}</td>
                    <td className={`px-5 py-3 text-right font-medium ${active ? 'text-primary' : 'text-dark-600'}`}>
                      {row.staff}
                      {active && <span className="ml-1.5 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Your estimate</span>}
                    </td>
                  </tr>
                );
              })}
              {guestCount > 100 && (
                <tr className="bg-primary/5">
                  <td className="px-5 py-3 font-medium text-primary">Over 100 guests ({guestCount} guests)</td>
                  <td className="px-5 py-3 text-right font-medium text-primary">
                    {recommendedStaff(guestCount)} staff
                    <span className="ml-1.5 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Your estimate</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="text-xs text-dark-600 px-5 py-3 border-t border-gray-100 italic">
            For events over 100 guests, we add 2 staff per additional 30 guests (or part thereof).
          </p>
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

import { useOrder } from '../../../context/OrderContext';
import { useMenuConfig } from '../../../context/MenuConfigContext';

const INSPIRE_IMG = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80&auto=format&fit=crop';

const STEP_DEFS = [
  {
    key: 'guests',
    label: 'Guests & Courses',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'menu',
    label: 'Menu Selection',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
      </svg>
    ),
  },
  {
    key: 'event',
    label: 'Event Details',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

function fmt(n) { return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

export default function FullServiceSummary() {
  const { state, dispatch, computed } = useOrder();
  const { fsMenu } = useMenuConfig();
  const { fsStep, fsPackage, fsGuests, fsSelectedItems, fsDetails } = state;
  const { fsPkg, fsTotal, fsTotalItems, fsMaxItems } = computed;

  const activeKey = fsStep === 1 ? 'guests' : fsStep === 2 ? 'menu' : 'event';
  const doneStep1 = !!fsPackage;
  const doneStep2 = fsStep > 2;

  const allMenuItems = [...(fsMenu.starters?.items ?? []), ...(fsMenu.mains?.items ?? []), ...(fsMenu.desserts?.items ?? [])];
  const selectedItemObjs = Object.values(fsSelectedItems).flat().map(id => allMenuItems.find(i => i.id === id)).filter(Boolean);

  const subtitle = fsStep === 3 ? 'Review your selection before finalizing' : 'Track your catering selections';

  return (
    <aside className="w-full lg:w-72 lg:shrink-0">
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm lg:sticky lg:top-20">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-dark">Order Summary</p>
          <p className="text-xs text-dark-600 mt-0.5">{subtitle}</p>
        </div>

        {/* Step tracker */}
        <div className="px-4 py-3 space-y-1.5">
          {STEP_DEFS.map((s, i) => {
            const stepNum = i + 1;
            const isActive = activeKey === s.key;
            const isDone = (s.key === 'guests' && doneStep1 && fsStep > 1) || (s.key === 'menu' && doneStep2);
            const subtext = s.key === 'guests' && (isActive || isDone)
              ? `${fsGuests} Guests${fsPkg ? ` • ${fsPkg.name} Menu` : ''}`
              : s.key === 'menu' && isActive
              ? `${fsTotalItems}/${fsMaxItems} items selected`
              : s.key === 'menu' && isDone
              ? selectedItemObjs.slice(0, 3).map(i => i.name.split(' ')[0]).join(', ') + (selectedItemObjs.length > 3 ? '...' : '')
              : s.key === 'event' && isActive
              ? 'Awaiting final info'
              : null;

            return (
              <div key={s.key}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors
                  ${isActive ? 'bg-primary' : isDone ? 'bg-gray-50' : 'bg-transparent'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                  ${isActive ? 'bg-white/20 text-white' : isDone ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}
                >
                  {isDone
                    ? <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    : s.icon
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-white' : isDone ? 'text-dark' : 'text-gray-400'}`}>
                    {s.label}
                  </p>
                  {subtext && (
                    <p className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-dark-600'}`}>{subtext}</p>
                  )}
                  {!subtext && s.key === 'event' && !isActive && (
                    <p className="text-xs text-gray-400 mt-0.5">Not started</p>
                  )}
                </div>
                {isDone && (
                  <button
                    onClick={() => dispatch({ type: 'SET_FS_STEP', payload: stepNum })}
                    className="text-dark-600 hover:text-primary shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100" />

        {/* Dynamic content by step */}
        {fsStep <= 2 && (
          <div className="px-5 py-4">
            {fsStep === 1 && fsPkg && (
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-dark-600">Selected Package:</span>
                  <span className="font-semibold text-dark">{fsPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-600">Guests:</span>
                  <span className="font-semibold text-dark">{fsGuests}</span>
                </div>
              </div>
            )}

            {fsStep === 2 && selectedItemObjs.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold tracking-widest text-dark-600 uppercase mb-2">Currently Selected</p>
                <ul className="space-y-1.5">
                  {selectedItemObjs.map(item => (
                    <li key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-dark font-medium">{item.name}</span>
                      <button
                        onClick={() => {
                          const cat = Object.entries(fsMenu).find(([, c]) => c.items.some(i => i.id === item.id))?.[0];
                          if (cat) {
                            const alloc = fsPkg?.allocation[cat] ?? 1;
                            dispatch({ type: 'TOGGLE_FS_ITEM', payload: { category: cat, id: item.id, max: alloc } });
                          }
                        }}
                        className="text-gray-400 hover:text-primary ml-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm font-semibold text-dark">
                {fsStep === 1 ? 'Est. Total:' : 'Estimated Total'}
              </span>
              <span className="text-sm font-bold text-primary">{fmt(fsTotal)}</span>
            </div>
          </div>
        )}

        {fsStep === 3 && (
          <div className="px-5 py-4">
            {selectedItemObjs.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold tracking-widest text-dark-600 uppercase mb-2">Selected Menu Items</p>
                <ul className="space-y-2.5">
                  {selectedItemObjs.map(item => (
                    <li key={item.id} className="flex items-center gap-3">
                      <img src={item.img} alt={item.name} className="w-10 h-10 object-cover rounded-sm shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-dark truncate">{item.name}</p>
                        <p className="text-[10px] text-dark-600 truncate">{item.desc.split(' ').slice(0, 4).join(' ')}...</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-[10px] font-bold tracking-widest text-dark-600 uppercase mb-1">Estimated Total</p>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-dark">{fmt(fsTotal)}</span>
                <span className="text-[10px] text-dark-600">incl. all taxes</span>
              </div>
            </div>
          </div>
        )}

        {/* Review Order CTA */}
        <div className="px-4 pb-4">
          {fsStep < 3 ? (
            <button
              onClick={() => dispatch({ type: 'SET_FS_STEP', payload: fsStep + 1 })}
              className="w-full py-3 bg-gold text-dark text-sm font-bold rounded-sm hover:bg-gold-dark transition-colors"
            >
              Review Order
            </button>
          ) : (
            <button
              onClick={() => document.getElementById('fs-submit-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="w-full py-3 bg-gold text-dark text-sm font-bold rounded-sm hover:bg-gold-dark transition-colors"
            >
              Go to Submit ↓
            </button>
          )}

          {fsStep === 2 && (
            <p className="text-[10px] text-dark-600 text-center mt-2">
              Pricing subject to final guest count and service location.
            </p>
          )}
        </div>

        {/* Inspirational image (Step 3 only) */}
        {fsStep === 3 && (
          <div className="relative h-28 overflow-hidden">
            <img src={INSPIRE_IMG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-3 left-3 text-white text-sm font-serif font-bold leading-tight">
              Authentic Taste,<br />Modern Elegance.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

import { useOrder } from '../../context/OrderContext';

const STEPS = [
  {
    num: 1, label: 'Service',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    num: 2, label: 'Configuration',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    num: 3, label: 'Menu',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    num: 4, label: 'Logistics',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    num: 5, label: 'Details',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
];

export default function OrderSidebar({ stepName, onClose, isMobile = false }) {
  const { state, dispatch, computed } = useOrder();
  const { step } = state;

  return (
    <aside className={`${isMobile ? 'w-64 h-full' : 'w-56 shrink-0 sticky top-16 self-start max-h-[calc(100vh-4rem)]'} bg-white border-r border-gray-200 flex flex-col overflow-y-auto`}>
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Order Builder</p>
          <p className="text-xs text-dark-600 mt-0.5">
            Step {step} of 5: {stepName}
          </p>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-1 -mr-1 text-dark-600 hover:text-primary" aria-label="Close menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {STEPS.map(s => {
            const done = s.num < step;
            const active = s.num === step;
            const locked = s.num > step;
            return (
              <li key={s.num}>
                <button
                  onClick={() => done && dispatch({ type: 'SET_STEP', payload: s.num })}
                  disabled={locked}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left text-sm font-medium transition-colors
                    ${active ? 'bg-gold/10 text-dark' : ''}
                    ${done ? 'text-dark-600 hover:text-primary cursor-pointer' : ''}
                    ${locked ? 'text-gray-300 cursor-default' : ''}
                  `}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-colors
                    ${active ? 'bg-gold text-white' : ''}
                    ${done ? 'bg-primary/10 text-primary' : ''}
                    ${locked ? 'bg-gray-100 text-gray-300' : ''}
                  `}>
                    {s.icon}
                  </span>
                  {s.label}
                  {done && (
                    <svg className="w-3.5 h-3.5 ml-auto text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        {step >= 4 && (
          <div className="mb-3 p-3 bg-primary/5 rounded-sm">
            <p className="text-xs text-dark-600 uppercase tracking-wider font-semibold">Live Summary</p>
            <p className="text-lg font-bold text-primary mt-0.5">
              £{computed.subtotal.toFixed(2)}
            </p>
            <button
              onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
              className="text-xs text-primary underline mt-1"
            >
              View Details
            </button>
          </div>
        )}
        <button
          disabled={step === 1}
          onClick={() => step > 1 && dispatch({ type: 'SET_STEP', payload: step })}
          className={`w-full btn-outline-dark text-xs py-2 px-3 ${step === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {step >= 4 ? 'View Summary' : 'View Live Summary'}
        </button>
      </div>
    </aside>
  );
}

import { useOrder } from '../../../context/OrderContext';
import { useMenuConfig } from '../../../context/MenuConfigContext';
import FullServiceSummary from './FullServiceSummary';

function PackageIcon({ type }) {
  if (type === 'fork') return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  );
  if (type === 'plate') return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M3 13h18M3 13a9 9 0 1018 0M3 13H2m19 0h1M12 3v1m0 16v1" />
    </svg>
  );
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

export default function FullServiceStep1() {
  const { state, dispatch, computed } = useOrder();
  const { fsPackages } = useMenuConfig();
  const { fsPackage, fsGuests } = state;
  const { fsPkg, fsTotal } = computed;

  function setGuests(v) {
    dispatch({ type: 'SET_FS_GUESTS', payload: Math.max(10, v) });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

        {/* Left — main content */}
        <div className="flex-1 min-w-0">
          {/* Step label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">1</div>
            <div>
              <p className="text-base font-bold text-dark">Guests & Courses</p>
              <div className="h-0.5 w-24 bg-primary mt-1" />
            </div>
          </div>
          <p className="text-sm text-dark-600 mb-6">Personalize your dining experience by defining the scale and depth of your event.</p>

          {/* Guest count stepper */}
          <div className="bg-white border border-gray-200 rounded-sm px-5 py-4 flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-dark">Number of Guests</p>
              <p className="text-xs text-dark-600 mt-0.5">Minimum 10 guests for full-service catering</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests(fsGuests - 5)}
                className="w-9 h-9 rounded-sm border border-gray-300 flex items-center justify-center text-dark hover:border-primary hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              <span className="w-12 text-center text-base font-bold text-dark">{fsGuests}</span>
              <button
                onClick={() => setGuests(fsGuests + 5)}
                className="w-9 h-9 rounded-sm border border-gray-300 flex items-center justify-center text-dark hover:border-primary hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>

          {/* Package selection */}
          <p className="text-sm font-semibold text-dark mb-3">Select Your Package</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {fsPackages.map(pkg => {
              const active = fsPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => dispatch({ type: 'SET_FS_PACKAGE', payload: pkg.id })}
                  className={`relative bg-white border-2 rounded-sm cursor-pointer transition-all duration-200
                    ${active ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {/* Badge */}
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${pkg.badgeCls}`}>
                    {pkg.badge}
                  </div>

                  <div className="p-5 pt-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-dark-600'}`}>
                      <PackageIcon type={pkg.icon} />
                    </div>

                    <p className="text-base font-bold text-dark mb-1">{pkg.name}</p>
                    <p className="text-xs text-dark-600 mb-4 leading-relaxed">{pkg.desc}</p>

                    <ul className="space-y-1.5 mb-4">
                      {pkg.features.map(f => (
                        <li key={f.label} className={`flex items-center gap-2 text-xs ${f.ok ? 'text-dark' : 'text-gray-400'}`}>
                          {f.ok ? (
                            <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {f.label}
                        </li>
                      ))}
                    </ul>

                    <p className="text-base font-bold">
                      <span className="text-primary">${pkg.pricePerGuest}</span>
                      <span className="text-xs text-dark-600 font-normal">/guest</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue */}
          <div className="flex flex-col items-center gap-3 mt-8">
            <button
              disabled={!fsPackage}
              onClick={() => dispatch({ type: 'SET_FS_STEP', payload: 2 })}
              className={`btn-primary px-10 ${!fsPackage ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Continue to Menu
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
              className="text-sm text-dark-600 hover:text-primary flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Change service type
            </button>
          </div>
        </div>

        {/* Right — summary */}
        <FullServiceSummary />
      </div>
    </div>
  );
}

import { useOrder } from '../../../context/OrderContext';
import PlatterStep1 from './PlatterStep1';
import PlatterStep2 from './PlatterStep2';
import PlatterStep3 from './PlatterStep3';
import PlatterStep4 from './PlatterStep4';

const STEP_LABELS = ['', 'Order Details', 'Menu', 'Delivery', 'Review'];

export function PlatterProgress({ current }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="max-w-5xl mx-auto">
        {current === 1 ? (
          /* Full 4-step progress for Step 1 */
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
              STEP 0{current} OF 04
            </p>
            <div className="flex items-center gap-0">
              {[1, 2, 3, 4].map((n, i) => (
                <div key={n} className="flex items-center">
                  <div className={`flex flex-col items-center`}>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors
                      ${n === current ? 'bg-primary border-primary text-white' : n < current ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white border-gray-200 text-gray-400'}`}
                    >
                      {n < current ? (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : n}
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-1 whitespace-nowrap ${n === current ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                      {STEP_LABELS[n]}
                    </span>
                  </div>
                  {i < 3 && <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 mb-4 ${n < current ? 'bg-primary/40' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Compact 3-stage progress for Steps 2-4 */
          <div className="flex items-center gap-3">
            {/* Stage 1: Service Type (always done by step 2+) */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-dark-600 font-medium">Service Type</span>
            </div>

            <div className={`flex-1 h-0.5 ${current > 2 ? 'bg-primary/40' : 'bg-gray-200'}`} />

            {/* Stage 2: Menu Selection */}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0
                ${current === 2 ? 'bg-primary border-primary text-white' : current > 2 ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {current > 2 ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : '2'}
              </div>
              <span className={`text-sm font-medium ${current === 2 ? 'text-primary' : current > 2 ? 'text-dark-600' : 'text-gray-400'}`}>
                Menu Selection
              </span>
            </div>

            <div className={`flex-1 h-0.5 ${current > 3 ? 'bg-primary/40' : 'bg-gray-200'}`} />

            {/* Stage 3: Finalise */}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0
                ${current >= 3 ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                3
              </div>
              <span className={`text-sm font-medium ${current >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                Finalise
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlatterFlow() {
  const { state } = useOrder();
  const { platterStep } = state;

  return (
    <div>
      <PlatterProgress current={platterStep} />
      {platterStep === 1 && <PlatterStep1 />}
      {platterStep === 2 && <PlatterStep2 />}
      {platterStep === 3 && <PlatterStep3 />}
      {platterStep === 4 && <PlatterStep4 />}
    </div>
  );
}

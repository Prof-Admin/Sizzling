import { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import OrderSidebar from '../components/order/OrderSidebar';
import LiveSummaryPanel from '../components/order/LiveSummaryPanel';
import Step1Service from '../components/order/steps/Step1Service';
import Step2Configuration from '../components/order/steps/Step2Configuration';
import Step3Menu from '../components/order/steps/Step3Menu';
import Step4Logistics from '../components/order/steps/Step4Logistics';
import Step5Details from '../components/order/steps/Step5Details';
import MainMenuFlow from '../components/order/mainmenu/MainMenuFlow';
import FoodBoxFlow from '../components/order/foodbox/FoodBoxFlow';

const STEP_NAMES = ['', 'Service Selection', 'Style & Tier', 'Menu Selection', 'Logistics', 'Final Details'];

function OrderBuilderContent() {
  const { state, computed } = useOrder();
  const { step, service } = state;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const isMainMenuFlow = service === 'main-menu'   && step > 1;
  const isFoodBoxFlow  = service === 'food-boxes'  && step > 1;
  const showRightPanel = !isMainMenuFlow && !isFoodBoxFlow && (step === 2 || step === 3);

  if (isMainMenuFlow) {
    return (
      <div className="min-h-screen bg-offwhite overflow-x-hidden" style={{ paddingTop: '4rem' }}>
        <MainMenuFlow />
      </div>
    );
  }

  if (isFoodBoxFlow) {
    return (
      <div className="min-h-screen bg-offwhite overflow-x-hidden" style={{ paddingTop: '4rem' }}>
        <FoodBoxFlow />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite overflow-x-hidden" style={{ paddingTop: '4rem' }}>
      {/* Mobile step bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Order Builder</p>
          <p className="text-xs text-dark-600 mt-0.5">Step {step} of 5: {STEP_NAMES[step]}</p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -mr-1 text-dark-600 hover:text-primary"
          aria-label="Open steps menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto">
            <OrderSidebar stepName={STEP_NAMES[step]} onClose={() => setSidebarOpen(false)} isMobile />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <OrderSidebar stepName={STEP_NAMES[step]} />
        </div>

        <div className="flex flex-1 min-w-0">
          <main className="flex-1 min-w-0 overflow-y-auto pb-24 lg:pb-0">
            {step === 1 && <Step1Service />}
            {step === 2 && <Step2Configuration />}
            {step === 3 && <Step3Menu />}
            {step === 4 && <Step4Logistics />}
            {step === 5 && <Step5Details />}
          </main>

          {showRightPanel && (
            <aside className="hidden lg:block w-80 shrink-0 border-l border-gray-200 bg-white overflow-y-auto sticky top-16 self-start max-h-[calc(100vh-4rem)]">
              <LiveSummaryPanel />
            </aside>
          )}
        </div>
      </div>

      {/* Mobile summary bar (grazing table steps 2 & 3 only) */}
      {showRightPanel && (
        <>
          {summaryOpen && (
            <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSummaryOpen(false)} />
              <div className="relative bg-white rounded-t-xl max-h-[80vh] overflow-y-auto z-10">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <p className="font-semibold text-dark text-sm">Order Summary</p>
                  <button onClick={() => setSummaryOpen(false)} className="p-1 text-dark-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <LiveSummaryPanel />
              </div>
            </div>
          )}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
            <button
              onClick={() => setSummaryOpen(o => !o)}
              className="w-full btn-primary justify-between text-sm"
            >
              <span>View Summary</span>
              <span className="font-bold">£{computed.total.toFixed(2)}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function OrderBuilderPage() {
  return <OrderBuilderContent />;
}

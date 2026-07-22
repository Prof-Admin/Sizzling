import { useOrder } from '../../context/OrderContext';
import { useMenuConfig } from '../../context/MenuConfigContext';

function fmt(n) {
  return `£${n.toFixed(2)}`;
}

function SectionBlock({ label, children }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-semibold tracking-widest text-dark-600 uppercase mb-2">{label}</p>
      {children}
    </div>
  );
}

export default function LiveSummaryPanel() {
  const { state, dispatch, computed } = useOrder();
  const { menuSections } = useMenuConfig();
  const { step, menuItems, addedPackages, grazingColors, grazingHexCode } = state;
  const { menuSubtotal, staffCost } = computed;

  const allItems = menuSections.flatMap(s => s.items);
  const selectedItems = Object.entries(menuItems)
    .map(([id, qty]) => {
      const item = allItems.find(i => i.id === id);
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  const hasMenuItems = selectedItems.length > 0 || addedPackages.length > 0;

  const nextLabel = step === 2 ? 'Continue to Menu Selection' : 'Continue to Logistics';
  const nextStep  = step === 2 ? 3 : 4;

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="font-semibold text-sm text-dark">Live Summary</h3>
      </div>

      {/* Table Styling */}
      <SectionBlock label="Table Styling">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-dark">Grazing Table Styling</p>
            <p className="text-xs text-dark-600 mt-0.5">Linen, florals, styling & equipment</p>
          </div>
          <span className="text-sm font-bold text-primary ml-2 shrink-0">£250.00</span>
        </div>
      </SectionBlock>

      {/* Event Colours */}
      <SectionBlock label="Event Colours">
        {grazingColors ? (
          <div className="space-y-1">
            <p className="text-sm text-dark">{grazingColors}</p>
            {grazingHexCode && (
              <p className="text-xs text-dark-600 font-mono">{grazingHexCode}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-dark-600 italic">Enter your event colour(s) to continue</p>
        )}
      </SectionBlock>

      {/* Menu Items */}
      <SectionBlock label="Food Selection">
        {!hasMenuItems ? (
          <p className="text-xs text-dark-600 italic">No food items selected yet</p>
        ) : (
          <div className="space-y-1.5">
            {selectedItems.map(item => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="text-dark-700">{item.name} ×{item.qty}</span>
                <span className="text-dark font-medium">{fmt(item.price * item.qty)}</span>
              </div>
            ))}
            {addedPackages.map(pkg => (
              <div key={pkg.name} className="flex justify-between text-xs">
                <span className="text-dark-700 truncate max-w-[140px]">{pkg.name}</span>
                <span className="text-dark font-medium ml-1">{fmt(pkg.price)}</span>
              </div>
            ))}
          </div>
        )}
      </SectionBlock>

      {/* Cost breakdown */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-dark-600">Table Styling</span>
          <span className="font-medium text-dark">£250.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark-600">Food</span>
          <span className="font-medium text-dark">{menuSubtotal > 0 ? fmt(menuSubtotal) : '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark-600">Logistics</span>
          <span className="text-dark-600 italic text-xs">From £100 (TBC)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark-600">Staffing</span>
          <span className="font-medium text-dark">{fmt(staffCost)} <span className="font-normal text-dark-600 italic text-xs">(est.)</span></span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-100 pt-2 font-semibold">
          <span className="text-dark">Estimated Subtotal</span>
          <span className="text-primary">{fmt(250 + menuSubtotal + staffCost)}</span>
        </div>
        <p className="text-[10px] text-dark-600 leading-relaxed">
          A full quotation including logistics and staffing will be sent after we review your event details.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => dispatch({ type: 'SET_STEP', payload: nextStep })}
        className="btn-primary w-full mt-5 justify-between"
      >
        {nextLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

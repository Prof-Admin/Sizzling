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
  const { step, service, guestTier, style, primaryColor, accentColor, menuItems, addedPackages } = state;
  const { basePrice, menuSubtotal, subtotal, vat, total } = computed;

  const serviceLabel = service === 'grazing-table' ? 'Grazing Table'
    : service === 'platter' ? 'Platter'
    : service === 'full-service' ? 'Full-Service' : '—';

  const tierLabel = guestTier ? `${guestTier.label} (${guestTier.guests} guests)` : '—';

  const allItems = menuSections.flatMap(s => s.items);
  const selectedItems = Object.entries(menuItems)
    .map(([id, qty]) => {
      const item = allItems.find(i => i.id === id);
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  const hasMenuItems = selectedItems.length > 0 || addedPackages.length > 0;

  const nextLabel = step === 2 ? 'Menu Selection Next' : 'Continue to Logistics';
  const nextStep = step === 2 ? 3 : 4;

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

      {/* Service */}
      <SectionBlock label="Service Selection">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-dark">
              {guestTier?.label ?? ''} {serviceLabel}
            </p>
            <p className="text-xs text-dark-600 mt-0.5">Estimated for {guestTier?.guests ?? 0} Guests</p>
          </div>
          <span className="text-sm font-bold text-primary ml-2 shrink-0">{fmt(basePrice)}</span>
        </div>
      </SectionBlock>

      {/* Style */}
      {style && (
        <SectionBlock label="Style Choice">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-dark capitalize">
              {style === 'traditional' ? 'Traditional Heritage' : style === 'minimalist' ? 'Modern Minimalist' : 'Vibrant Celebration'}
            </p>
            <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </SectionBlock>
      )}

      {/* Color Palette */}
      <SectionBlock label="Color Palette">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border border-white shadow-sm shrink-0" style={{ background: primaryColor.hex }} />
          <span className="w-5 h-5 rounded-full border border-white shadow-sm shrink-0" style={{ background: accentColor.hex }} />
          <span className="text-xs text-dark-600">{primaryColor.name} & {accentColor.name}</span>
        </div>
      </SectionBlock>

      {/* Menu Items */}
      <SectionBlock label="Menu Items">
        {!hasMenuItems ? (
          <p className="text-xs text-dark-600 italic">No menu items selected yet</p>
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

      {/* Totals */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-dark-600">Subtotal</span>
          <span className="font-medium text-dark">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark-600">Tax (VAT 20%)</span>
          <span className="text-dark-600">{fmt(vat)}</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-1">
          <span className="text-dark">Total Estimate</span>
          <span className="text-primary">{fmt(total)}</span>
        </div>
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

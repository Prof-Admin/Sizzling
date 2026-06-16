import { useOrder } from '../../../context/OrderContext';
import { useMenuConfig } from '../../../context/MenuConfigContext';

const BRUNCH_IMG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80&auto=format&fit=crop';
const BRUNCH_PKG_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80&auto=format&fit=crop';

function fmt(n) {
  return `£${n.toFixed(2)}`;
}

function QttyStepper({ qty, min = 0, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, qty - (min || 1)))}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-dark-600 hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="w-5 text-center text-sm font-semibold text-dark">{qty}</span>
      <button
        onClick={() => onChange(qty === 0 ? (min || 1) : qty + (min || 1))}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-dark-600 hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

function SectionBanner({ section }) {
  return (
    <div className="relative h-44 rounded-sm overflow-hidden mb-4">
      <img src={section.img} alt={section.label} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5 text-white">
        <h3 className="text-xl font-serif font-bold">{section.label}</h3>
        <p className="text-sm opacity-80 mt-0.5">{section.subtitle}</p>
      </div>
    </div>
  );
}

function RegularSection({ section }) {
  const { state, dispatch } = useOrder();
  const { menuItems } = state;

  function setQty(id, qty) {
    dispatch({ type: 'UPDATE_MENU_QTY', payload: { id, qty } });
  }

  return (
    <div className="mb-10">
      <SectionBanner section={section} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {section.items.map(item => {
          const qty = menuItems[item.id] ?? 0;
          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-sm p-4 flex items-center gap-3">
              {item.img && (
                <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-sm shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark">{item.name}</p>
                <p className="text-xs text-primary font-medium mt-0.5">
                  {fmt(item.price)} / {item.unit}
                  {item.min > 1 && <span className="text-dark-600 ml-1">Min. {item.min}{item.unit === 'pc' ? 'pcs' : ''}</span>}
                </p>
              </div>
              <QttyStepper qty={qty} min={item.min} onChange={v => setQty(item.id, v)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrunchSection() {
  const { state, dispatch } = useOrder();
  const { brunchPackages } = useMenuConfig();
  const { brunchType, brunchGuests, addedPackages } = state;

  const GUEST_OPTS = [20, 50, 100, 150];
  const packages = brunchPackages[brunchType];
  const activePkg = packages.find(p => p.guests === brunchGuests);
  const isAdded = activePkg && addedPackages.find(p => p.name === activePkg.name);

  return (
    <div className="mb-10">
      <div className="relative h-44 rounded-sm overflow-hidden mb-4">
        <img src={BRUNCH_IMG} alt="Premium Brunch" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-5 text-white">
          <div className="flex items-end gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold">Premium Brunch</h3>
              <p className="text-sm opacity-80 mt-0.5">Curated guest packages for morning events</p>
            </div>
            <div className="flex gap-2 pb-0.5">
              {['nigerian', 'western'].map(t => (
                <button
                  key={t}
                  onClick={() => dispatch({ type: 'SET_BRUNCH_TYPE', payload: t })}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors
                    ${brunchType === t ? 'bg-primary text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  {t === 'nigerian' ? 'Nigerian Breakfast' : 'Western Brunch'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guest count tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {GUEST_OPTS.map(g => (
          <button
            key={g}
            onClick={() => dispatch({ type: 'SET_BRUNCH_GUESTS', payload: g })}
            className={`py-3 text-center rounded-sm border-2 transition-all font-bold text-lg
              ${brunchGuests === g ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 text-dark-600 hover:border-gray-300 bg-white'}`}
          >
            {g}
            <span className="block text-[10px] font-normal text-dark-600">GUESTS</span>
          </button>
        ))}
      </div>

      {/* Package card */}
      {activePkg && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 flex gap-4">
          <img src={BRUNCH_PKG_IMG} alt={activePkg.name} className="w-20 h-20 object-cover rounded-sm shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-dark">{activePkg.name}</p>
              <p className="text-lg font-bold text-dark shrink-0">{fmt(activePkg.price)}</p>
            </div>
            <p className="text-xs text-dark-600 mt-1 leading-relaxed">{activePkg.desc}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {activePkg.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10px] text-primary font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-end shrink-0">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PACKAGE', payload: activePkg })}
              className={`px-4 py-2 text-xs font-bold rounded-sm border-2 transition-colors
                ${isAdded ? 'bg-primary/10 border-primary text-primary' : 'bg-primary border-primary text-white hover:bg-primary-light'}`}
            >
              {isAdded ? 'Remove' : 'Add to Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FloatingSummary() {
  const { state, dispatch, computed } = useOrder();
  const { budget } = state;
  const { menuSubtotal, budgetLeft, budgetPct } = computed;

  return (
    <div className="hidden lg:block fixed top-24 right-6 w-64 bg-white border border-gray-200 rounded-sm shadow-lg z-30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-sm font-semibold text-dark">Live Summary</p>
      </div>

      {menuSubtotal === 0 ? (
        <p className="text-xs text-dark-600 italic mb-3">No items selected yet</p>
      ) : (
        <p className="text-xs text-dark-600 mb-1">Items: {Object.keys(state.menuItems).length + state.addedPackages.length}</p>
      )}

      <div className="flex justify-between text-sm mb-1">
        <span className="text-dark-600">Estimated Total</span>
        <span className="font-bold text-dark">£{menuSubtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-dark-600">Budget Left (£{budget.toFixed(0)})</span>
        <span className={`font-medium ${budgetLeft < 0 ? 'text-red-600' : 'text-dark'}`}>£{budgetLeft.toFixed(2)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
        <div
          className={`h-1.5 rounded-full transition-all ${budgetLeft < 0 ? 'bg-red-500' : 'bg-gold'}`}
          style={{ width: `${Math.min(100, budgetPct)}%` }}
        />
      </div>

      <button
        onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}
        className="btn-primary w-full text-xs py-2.5 justify-between"
      >
        Continue to Logistics
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function Step3Menu() {
  const { dispatch } = useOrder();
  const { menuSections } = useMenuConfig();

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <FloatingSummary />

      {menuSections.map(section => (
        <RegularSection key={section.id} section={section} />
      ))}

      <BrunchSection />

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })} className="btn-outline-dark text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Step: Configuration
        </button>
        <button onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })} className="btn-primary text-sm">
          Continue to Logistics
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

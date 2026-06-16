import { useOrder } from '../../../context/OrderContext';
import { useMenuConfig } from '../../../context/MenuConfigContext';
import FullServiceSummary from './FullServiceSummary';

function MenuCard({ item, selected, onToggle }) {
  return (
    <div
      className={`bg-white border-2 rounded-sm overflow-hidden cursor-pointer transition-all duration-200
        ${selected ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
      onClick={onToggle}
    >
      <div className="relative">
        <img src={item.img} alt={item.name} className="w-full h-44 object-cover" />
        {item.badge && (
          <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-sm">
            {item.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-bold text-dark mb-1">{item.name}</p>
        <p className="text-xs text-dark-600 leading-relaxed mb-4 line-clamp-2">{item.desc}</p>
        <button
          className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-sm border-2 transition-colors
            ${selected
              ? 'bg-primary border-primary text-white'
              : 'border-gray-300 text-dark hover:border-primary hover:text-primary'
            }`}
        >
          {selected ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Selected
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Select Option
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function FullServiceStep2() {
  const { state, dispatch, computed } = useOrder();
  const { fsPackages, fsMenu } = useMenuConfig();
  const { fsPackage, fsSelectedItems, fsGuests } = state;
  const { fsPkg, fsTotalItems, fsMaxItems } = computed;

  const pkg = fsPackages.find(p => p.id === fsPackage);

  function toggle(category, id) {
    const max = pkg?.allocation[category] ?? 1;
    dispatch({ type: 'TOGGLE_FS_ITEM', payload: { category, id, max } });
  }

  const CATEGORY_KEYS = Object.entries(fsMenu).filter(([key]) => {
    if (!pkg) return false;
    return pkg.allocation[key] > 0;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <p className="text-xs text-dark-600 font-semibold uppercase tracking-wider mb-1">Step 2: Craft Your Menu</p>
        <p className="text-sm text-dark-600">
          Select your preferred dishes for each course.
          {pkg && (
            <> Your selection allows for{' '}
              {Object.entries(pkg.allocation)
                .filter(([, n]) => n > 0)
                .map(([cat, n]) => `${n} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`)
                .join(', ')}.
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

        {/* Left — course sections */}
        <div className="flex-1 min-w-0 space-y-10">
          {CATEGORY_KEYS.map(([catKey, catData]) => {
            const max = pkg?.allocation[catKey] ?? 1;
            const selected = fsSelectedItems[catKey] ?? [];

            return (
              <div key={catKey}>
                {/* Section header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <p className="text-sm font-semibold text-dark">{catData.label}</p>
                  </div>
                  <span className="text-xs text-dark-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    Select {max} Option{max > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {catData.items.map(item => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      selected={selected.includes(item.id)}
                      onToggle={() => toggle(catKey, item.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button onClick={() => dispatch({ type: 'SET_FS_STEP', payload: 1 })} className="btn-outline-dark text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Guests & Courses
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_FS_STEP', payload: 3 })}
              className="btn-primary text-sm"
            >
              Continue to Event Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right — summary */}
        <FullServiceSummary />
      </div>
    </div>
  );
}

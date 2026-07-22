import { useOrder } from '../../../context/OrderContext';

const INCLUDED = [
  'Professional grazing table styling and setup',
  'Table linen',
  'Styling to match your event theme and colour palette',
  'Decorative serving pieces',
  'Chafing dishes',
  'Decorative plates, napkins and cutlery',
  'Coordinated décor and styling elements',
];

export default function Step2Configuration() {
  const { state, dispatch } = useOrder();
  const { grazingColors = '', grazingHexCode = '' } = state;

  const canContinue = grazingColors.trim().length > 0;

  function setField(key, val) {
    dispatch({ type: 'SET_GRAZING_FIELD', payload: { key, val } });
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">

      {/* Styling fee card */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-dark">Grazing Table Styling</h2>
            <p className="text-sm text-dark-600 mt-0.5">Food is not included in the styling fee.</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-serif font-bold text-primary">£250</p>
            <p className="text-xs text-dark-600">flat fee</p>
          </div>
        </div>
        <div className="bg-offwhite border border-gray-200 rounded-sm p-5">
          <p className="text-xs font-semibold text-dark-600 uppercase tracking-wider mb-3">What's included</p>
          <ul className="space-y-2 text-sm text-dark-600">
            {INCLUDED.map(item => (
              <li key={item} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Event colours */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-dark mb-1">Event Colours</h2>
        <p className="text-sm text-dark-600 mb-4">Share your event colours so we can coordinate the table styling.</p>
        <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">
              Event colour(s) <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={grazingColors}
              onChange={e => setField('grazingColors', e.target.value)}
              placeholder="e.g. Navy Blue and Gold"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-600 block mb-1.5">
              Exact colour code (HEX) <span className="font-normal text-dark-600/70">(optional)</span>
            </label>
            <input
              type="text"
              value={grazingHexCode}
              onChange={e => setField('grazingHexCode', e.target.value)}
              placeholder="#1E3A8A (Navy Blue)"
              className="input-field"
            />
          </div>
          <p className="text-xs text-dark-600 leading-relaxed">
            You can find your colour's HEX code by asking your event decorator or stationery designer, or by using an online colour picker such as{' '}
            <span className="font-medium text-dark">Adobe Color</span>,{' '}
            <span className="font-medium text-dark">Canva</span> or{' '}
            <span className="font-medium text-dark">Coolors</span>.
          </p>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3 mb-8 text-xs text-amber-800">
        <svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>Grazing Tables require a minimum of <strong>3 weeks' notice</strong>. Please ensure your event date allows for this.</p>
      </div>

      {/* Next */}
      <button
        onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}
        disabled={!canContinue}
        className={`btn-primary w-full justify-center ${!canContinue ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        Next: Choose Your Food
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

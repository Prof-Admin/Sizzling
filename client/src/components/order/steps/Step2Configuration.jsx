import { useState } from 'react';
import { useOrder, STYLES, PALETTE } from '../../../context/OrderContext';
import { useMenuConfig } from '../../../context/MenuConfigContext';

function ColorSwatch({ color, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(color)}
      title={color.name}
      className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
        selected ? 'border-dark scale-110 shadow-md' : 'border-transparent hover:scale-105'
      }`}
      style={{ background: color.hex }}
    />
  );
}

export default function Step2Configuration() {
  const { state, dispatch } = useOrder();
  const { styles, palette } = useMenuConfig();
  const { guestCount, style, primaryColor, accentColor } = state;
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">

      {/* Table Styling — £250 */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-dark">Table Styling</h2>
            <p className="text-sm text-dark-600 mt-0.5">Included with every grazing table booking.</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-serif font-bold text-primary">£250</p>
            <p className="text-xs text-dark-600">flat fee</p>
          </div>
        </div>
        <div className="bg-offwhite border border-gray-200 rounded-sm p-5 text-sm text-dark-600 leading-relaxed space-y-2">
          <p>Layered table linen, coordinated florals, fresh fruit displays, themed decorative accents, chafing dishes and hot-holding equipment, styled serving pieces and display boards, decorative and paper plates, napkins and wooden or plastic cutlery.</p>
          <p className="font-medium text-dark">Styling is coordinated with your event colour palette and aesthetic.</p>
        </div>
      </div>

      {/* Guest Count */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-dark mb-1">Guest Count</h2>
        <p className="text-sm text-dark-600 mb-4">How many guests are you expecting?</p>
        <div className="bg-white border border-gray-200 rounded-sm p-5">
          <label className="text-xs font-medium text-dark-600 block mb-1.5">Number of Guests</label>
          <div className="relative max-w-xs">
            <svg className="w-4 h-4 text-dark-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="number"
              min={1}
              value={guestCount}
              onChange={e => dispatch({ type: 'SET_GUEST_COUNT', payload: Math.max(1, parseInt(e.target.value) || 1) })}
              className="input-field pl-10"
              placeholder="e.g. 50"
            />
          </div>
          <p className="text-xs text-dark-600 mt-2">This helps us recommend the right amount of food and staffing.</p>
        </div>
      </div>

      {/* Table Theme */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-dark mb-1">Table Theme</h2>
        <p className="text-sm text-dark-600 mb-5">Choose a visual theme for your grazing table styling.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {styles.map(s => {
            const active = style === s.id;
            return (
              <div
                key={s.id}
                onClick={() => dispatch({ type: 'SET_STYLE', payload: s.id })}
                className={`rounded-sm overflow-hidden border-2 cursor-pointer transition-all duration-200
                  ${active ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-300'}`}
              >
                <div className="relative h-32">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3">
                    <p className="text-white text-sm font-bold leading-tight">{s.name}</p>
                  </div>
                  {active && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <p className="text-[10px] font-bold tracking-wider text-primary">{s.tag}</p>
                  <p className="text-xs text-dark-600 mt-1 leading-snug">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-dark mb-1">Colour Palette</h2>
        <p className="text-sm text-dark-600 mb-5">Share your event colours so we can coordinate the table styling.</p>
        <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-5">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-dark-600 uppercase mb-3">Primary Colour</p>
            <div className="flex gap-2 flex-wrap">
              {palette.map(c => (
                <ColorSwatch key={c.hex} color={c} selected={primaryColor.hex === c.hex} onClick={c => dispatch({ type: 'SET_PRIMARY', payload: c })} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-dark-600 uppercase mb-3">Accent Colour</p>
            <div className="flex gap-2 flex-wrap">
              {palette.map(c => (
                <ColorSwatch key={c.hex} color={c} selected={accentColor.hex === c.hex} onClick={c => dispatch({ type: 'SET_ACCENT', payload: c })} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="border border-gray-200 rounded-sm overflow-hidden mb-8">
        <button
          onClick={() => setPreviewOpen(o => !o)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-dark-600 hover:text-dark transition-colors bg-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          COLOUR PREVIEW
          <svg className={`w-4 h-4 transition-transform ${previewOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {previewOpen && (
          <div className="p-5 bg-gray-50 border-t border-gray-200">
            <div className="rounded-sm overflow-hidden border border-gray-200 h-40 flex items-center justify-center gap-4"
              style={{ background: `linear-gradient(135deg, ${primaryColor.hex}22, ${accentColor.hex}22)` }}
            >
              <div className="w-16 h-16 rounded-full border-4" style={{ borderColor: primaryColor.hex, background: `${primaryColor.hex}33` }} />
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: primaryColor.hex }}>
                  {state.style ? styles.find(s => s.id === state.style)?.name : 'Select a theme'}
                </p>
                <p className="text-xs text-dark-600 mt-1">{primaryColor.name} & {accentColor.name}</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4" style={{ borderColor: accentColor.hex, background: `${accentColor.hex}33` }} />
            </div>
          </div>
        )}
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
        className="btn-primary w-full justify-center"
      >
        Next: Choose Your Food
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

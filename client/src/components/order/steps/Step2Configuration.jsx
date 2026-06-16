import { useState } from 'react';
import { useOrder } from '../../../context/OrderContext';
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
  const { guestTiers, styles, palette } = useMenuConfig();
  const { guestTier, style, primaryColor, accentColor } = state;
  const [previewOpen, setPreviewOpen] = useState(false);

  function canAdvance() {
    return guestTier && style;
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      {/* Guest Tier */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-dark mb-1">Guest Count & Tier</h2>
        <p className="text-sm text-dark-600 mb-5">Select how many guests you are expecting.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {guestTiers.map(tier => {
            const active = guestTier?.label === tier.label;
            return (
              <button
                key={tier.label}
                onClick={() => dispatch({ type: 'SET_GUEST_TIER', payload: tier })}
                className={`p-3 rounded-sm border-2 text-left transition-all duration-150
                  ${active ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <p className={`text-lg font-bold ${active ? 'text-primary' : 'text-dark'}`}>{tier.guests}</p>
                <p className="text-xs text-dark-600 mt-0.5">GUESTS</p>
                <p className={`text-xs font-semibold mt-1 ${active ? 'text-primary' : 'text-dark-600'}`}>
                  £{tier.price.toFixed(2)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Aesthetics */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-dark mb-1">Table Aesthetics</h2>
        <p className="text-sm text-dark-600 mb-5">Select a visual theme that sets the mood for your catering experience.</p>
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
        <h2 className="text-2xl font-serif font-bold text-dark mb-1">Color Palette</h2>
        <p className="text-sm text-dark-600 mb-5">Customise the primary and accent colours for your linens and décor items.</p>

        <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-5">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-dark-600 uppercase mb-3">Primary Brand Palette</p>
            <div className="flex gap-2 flex-wrap">
              {palette.map(c => (
                <ColorSwatch key={c.hex} color={c} selected={primaryColor.hex === c.hex} onClick={c => dispatch({ type: 'SET_PRIMARY', payload: c })} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-dark-600 uppercase mb-3">Accents</p>
            <div className="flex gap-2 flex-wrap">
              {palette.map(c => (
                <ColorSwatch key={c.hex} color={c} selected={accentColor.hex === c.hex} onClick={c => dispatch({ type: 'SET_ACCENT', payload: c })} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview toggle */}
      <div className="border border-gray-200 rounded-sm overflow-hidden mb-8">
        <button
          onClick={() => setPreviewOpen(o => !o)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-dark-600 hover:text-dark transition-colors bg-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          LIVE PREVIEW
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
                  {state.style ? styles.find(s => s.id === state.style)?.name : 'Select a style'}
                </p>
                <p className="text-xs text-dark-600 mt-1">{primaryColor.name} & {accentColor.name}</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4" style={{ borderColor: accentColor.hex, background: `${accentColor.hex}33` }} />
            </div>
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        disabled={!canAdvance()}
        onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}
        className={`btn-primary w-full justify-center ${!canAdvance() ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        Menu Selection Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

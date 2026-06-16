import { useState } from 'react';
import { useOrder } from '../../../context/OrderContext';
import { useMenuConfig } from '../../../context/MenuConfigContext';

function fmt(n) { return `£${n.toFixed(2)}`; }

/* ─── Order Summary Sidebar ─────────────────────────────────────── */
function OrderSummary() {
  const { state, dispatch, computed } = useOrder();
  const { platterBasket } = state;
  const { platterSubtotal, platterFee, platterTotal } = computed;
  const isEmpty = platterBasket.length === 0;

  return (
    <aside className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-dark">Order Summary</h3>
        </div>

        {/* Items or empty state */}
        <div className="px-5 py-4 min-h-[160px]">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L3 3m2.4 2H19M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4" />
              </svg>
              <p className="text-sm font-medium text-dark-600">Your basket is empty.</p>
              <p className="text-xs text-gray-400 mt-0.5">Start adding some heat!</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {platterBasket.map(item => (
                <li key={item.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-dark truncate">{item.name}</p>
                    {item.detail && <p className="text-xs text-dark-600">{item.detail}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-dark">{fmt(item.price)}</span>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_PLATTER', payload: item.id })}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-gray-200 px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark-600">Subtotal</span>
            <span className="font-medium text-dark">{fmt(platterSubtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-600">Service Fee (5%)</span>
            <span className="text-dark-600">{fmt(platterFee)}</span>
          </div>
        </div>

        {/* Total block */}
        <div className="bg-primary px-5 py-3 flex justify-between items-center">
          <span className="text-sm font-bold text-white tracking-wide uppercase">Total</span>
          <span className="text-base font-bold text-white">{fmt(platterTotal)}</span>
        </div>

        {/* Proceed CTA */}
        <div className="p-4">
          <button
            onClick={() => dispatch({ type: 'SET_PLATTER_STEP', payload: 3 })}
            className="w-full flex items-center justify-between px-5 py-3 bg-gold text-dark font-semibold text-sm rounded-sm hover:bg-gold-dark transition-colors"
          >
            Proceed to Finalise
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ─── Tray Card ──────────────────────────────────────────────────── */
function TrayCard({ tray }) {
  const { state, dispatch } = useOrder();
  const [selectedVol, setSelectedVol] = useState(tray.volumes[0]);
  const inBasket = state.platterBasket.find(i => i.id === tray.id);

  function addOrUpdate() {
    dispatch({
      type: 'ADD_TO_PLATTER',
      payload: { id: tray.id, name: tray.name, detail: selectedVol.label, price: selectedVol.price },
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="relative">
        <img src={tray.img} alt={tray.name} className="w-full h-44 object-cover" />
        {tray.badge && (
          <span className="absolute top-3 right-3 bg-gold text-dark text-xs font-bold px-2.5 py-1 rounded-sm">
            {tray.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-sm font-bold text-dark mb-1">{tray.name}</h4>
        <p className="text-xs text-dark-600 leading-relaxed mb-3">{tray.desc}</p>

        <p className="text-[10px] font-bold tracking-widest text-dark-600 uppercase mb-2">Select Volume</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {tray.volumes.map(v => (
            <button
              key={v.label}
              onClick={() => setSelectedVol(v)}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm border-2 transition-colors
                ${selectedVol.label === v.label
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-200 text-dark hover:border-gray-300'
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-bold text-primary">{fmt(selectedVol.price)}</span>
          <button
            onClick={addOrUpdate}
            className={`btn-primary text-xs py-2 px-4 ${inBasket ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {inBasket ? 'Update Order' : 'Add to Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Small Chops Card ───────────────────────────────────────────── */
function SmallChopsCard() {
  const { state, dispatch } = useOrder();
  const { platterSmallChops: item } = useMenuConfig();
  const [selectedTier, setSelectedTier] = useState(item.tiers[0]);
  const inBasket = state.platterBasket.find(i => i.id === item.id);
  const total = selectedTier.pcs * selectedTier.pricePerPc;

  function addOrUpdate() {
    dispatch({
      type: 'ADD_TO_PLATTER',
      payload: { id: item.id, name: item.name, detail: `${selectedTier.pcs} pcs`, price: total },
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <img src={item.img} alt={item.name} className="w-full sm:w-44 h-44 object-cover shrink-0" />
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <h4 className="text-sm font-bold text-primary mb-1">{item.name}</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-4">{item.desc}</p>

            <div className="flex gap-2 flex-wrap mb-4">
              {item.tiers.map(t => {
                const active = selectedTier.pcs === t.pcs;
                return (
                  <button
                    key={t.pcs}
                    onClick={() => setSelectedTier(t)}
                    className={`px-3 py-2 text-xs font-bold rounded-sm border-2 transition-colors text-center
                      ${active ? 'bg-gold border-gold text-dark' : 'border-gray-200 text-dark hover:border-gray-300'}`}
                  >
                    <span className="block">{t.pcs} pcs</span>
                    <span className={`block font-normal ${active ? 'text-dark-700' : 'text-dark-600'}`}>{fmt(t.pricePerPc)}/ea</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-dark-600 uppercase">Total for Set</p>
              <p className="text-lg font-bold text-primary">{fmt(total)}</p>
            </div>
            <button
              onClick={addOrUpdate}
              className="px-5 py-2.5 bg-gold text-dark text-xs font-bold rounded-sm hover:bg-gold-dark transition-colors"
            >
              {inBasket ? 'Update Order' : 'Add to Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Brunch Card ────────────────────────────────────────────────── */
function BrunchCard({ item }) {
  const { state, dispatch } = useOrder();
  const { platterGuests } = state;
  const price = item.pricePerGuest * platterGuests;
  const inBasket = state.platterBasket.find(i => i.id === item.id);

  function toggle() {
    if (inBasket) {
      dispatch({ type: 'REMOVE_FROM_PLATTER', payload: item.id });
    } else {
      dispatch({
        type: 'ADD_TO_PLATTER',
        payload: { id: item.id, name: item.name, detail: `${platterGuests} guests`, price },
      });
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="relative h-40">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-white font-bold text-base font-serif">{item.name}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-dark-600 leading-relaxed mb-4">{item.desc}</p>
        <div className="flex items-center justify-between mb-3 py-2 border-t border-b border-gray-100">
          <span className="text-xs text-dark-600">Price per Guest</span>
          <span className="text-sm font-bold text-primary">{fmt(item.pricePerGuest)}</span>
        </div>
        <button
          onClick={toggle}
          className={`w-full py-2.5 text-sm font-semibold rounded-sm border-2 transition-colors
            ${inBasket
              ? 'bg-primary border-primary text-white'
              : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
        >
          {inBasket ? 'Remove Option' : 'Select Brunch Option'}
        </button>
      </div>
    </div>
  );
}

/* ─── Section Label ──────────────────────────────────────────────── */
function SectionLabel({ title, subtitle }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold text-dark">{title}</p>
      <p className="text-xs text-dark-600 mt-0.5">{subtitle}</p>
    </div>
  );
}

/* ─── Main Step 2 ────────────────────────────────────────────────── */
export default function PlatterStep2() {
  const { dispatch } = useOrder();
  const { platterTrays, platterBrunch } = useMenuConfig();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

        {/* Left — menu sections */}
        <div className="flex-1 min-w-0 space-y-10">

          {/* Trays */}
          <div>
            <SectionLabel title="Trays (Bowl Food)" subtitle="Authentic large-scale flavors for communal dining." />
            <div className="grid sm:grid-cols-2 gap-4">
              {platterTrays.map(t => <TrayCard key={t.id} tray={t} />)}
            </div>
          </div>

          {/* Small Chops */}
          <div>
            <SectionLabel title="Small Chops" subtitle="Finger foods that pack a punch. Perfect for networking and receptions." />
            <SmallChopsCard />
          </div>

          {/* Brunch */}
          <div>
            <SectionLabel title="Brunch Selections" subtitle="Elegant morning and midday spreads for the sophisticated host." />
            <div className="grid sm:grid-cols-2 gap-4">
              {platterBrunch.map(b => <BrunchCard key={b.id} item={b} />)}
            </div>
          </div>

          {/* Nav */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button onClick={() => dispatch({ type: 'SET_PLATTER_STEP', payload: 1 })} className="btn-outline-dark text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Order Details
            </button>
            <button onClick={() => dispatch({ type: 'SET_PLATTER_STEP', payload: 3 })} className="btn-primary text-sm">
              Continue to Delivery
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right — summary */}
        <OrderSummary />
      </div>
    </div>
  );
}

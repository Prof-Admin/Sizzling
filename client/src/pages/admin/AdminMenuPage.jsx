import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

function useMenuKey(key, authHeader) {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    axios.get(`/api/admin/menu/${key}`, { headers: authHeader })
      .then(res => setData(res.data.data))
      .catch(() => {});
  }, [key]);

  async function save(newData) {
    setSaving(true);
    try {
      await axios.put(`/api/admin/menu/${key}`, { data: newData }, { headers: authHeader });
      setData(newData);
      setToast('Saved!');
      setTimeout(() => setToast(''), 2500);
    } catch {
      setToast('Save failed.');
      setTimeout(() => setToast(''), 2500);
    } finally {
      setSaving(false);
    }
  }

  return { data, setData, save, saving, toast };
}

function SaveBar({ onSave, saving, toast }) {
  return (
    <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-200">
      <button onClick={onSave} disabled={saving} className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-sm hover:bg-gray-800 disabled:opacity-40 transition-colors">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
      {toast && <span className={`text-sm font-medium ${toast === 'Saved!' ? 'text-green-600' : 'text-red-500'}`}>{toast}</span>}
    </div>
  );
}

function Row({ children, className = '' }) {
  return <div className={`grid gap-3 ${className}`}>{children}</div>;
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
      />
    </div>
  );
}

function AddBtn({ onClick, label = 'Add Row' }) {
  return (
    <button onClick={onClick} className="mt-3 text-xs font-semibold text-gray-600 border border-dashed border-gray-300 rounded-sm px-3 py-1.5 hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      {label}
    </button>
  );
}

function DelBtn({ onClick }) {
  return (
    <button onClick={onClick} className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">{title}</h3>
      {children}
    </div>
  );
}

/* ─── GRAZING TAB ─── */
function GrazingEditor({ authHeader }) {
  const tiers = useMenuKey('guest-tiers', authHeader);
  const styles = useMenuKey('grazing-styles', authHeader);
  const menu = useMenuKey('grazing-menu', authHeader);
  const brunch = useMenuKey('brunch-packages', authHeader);
  const staff = useMenuKey('staff-config', authHeader);

  function updateTier(i, field, val) {
    const next = tiers.data.map((t, idx) => idx === i ? { ...t, [field]: val } : t);
    tiers.setData(next);
  }
  function addTier() { tiers.setData([...tiers.data, { label: 'New Tier', guests: 0, price: 0 }]); }
  function delTier(i) { tiers.setData(tiers.data.filter((_, idx) => idx !== i)); }

  function updateStyle(i, field, val) {
    const next = styles.data.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    styles.setData(next);
  }
  function addStyle() { styles.setData([...styles.data, { id: `style-${Date.now()}`, name: '', tag: '', desc: '', img: '' }]); }
  function delStyle(i) { styles.setData(styles.data.filter((_, idx) => idx !== i)); }

  function updateMenuItem(sIdx, iIdx, field, val) {
    const next = menu.data.map((sec, si) => si !== sIdx ? sec : {
      ...sec,
      items: sec.items.map((item, ii) => ii !== iIdx ? item : { ...item, [field]: val }),
    });
    menu.setData(next);
  }
  function addMenuItem(sIdx) {
    const next = menu.data.map((sec, si) => si !== sIdx ? sec : {
      ...sec,
      items: [...sec.items, { id: `item-${Date.now()}`, name: '', price: 0, unit: 'pc', min: 1 }],
    });
    menu.setData(next);
  }
  function delMenuItem(sIdx, iIdx) {
    const next = menu.data.map((sec, si) => si !== sIdx ? sec : {
      ...sec,
      items: sec.items.filter((_, ii) => ii !== iIdx),
    });
    menu.setData(next);
  }
  function updateSection(sIdx, field, val) {
    menu.setData(menu.data.map((sec, si) => si !== sIdx ? sec : { ...sec, [field]: val }));
  }
  function addSection() {
    menu.setData([...menu.data, { id: `section-${Date.now()}`, label: 'New Section', subtitle: '', img: '', items: [] }]);
  }
  function delSection(sIdx) { menu.setData(menu.data.filter((_, si) => si !== sIdx)); }

  function updateBrunch(type, i, field, val) {
    brunch.setData({ ...brunch.data, [type]: brunch.data[type].map((p, idx) => idx === i ? { ...p, [field]: val } : p) });
  }
  function addBrunch(type) {
    brunch.setData({ ...brunch.data, [type]: [...(brunch.data[type] || []), { guests: 0, price: 0, name: '', desc: '', tags: [] }] });
  }
  function delBrunch(type, i) {
    brunch.setData({ ...brunch.data, [type]: brunch.data[type].filter((_, idx) => idx !== i) });
  }

  if (!tiers.data || !styles.data || !menu.data || !brunch.data || !staff.data) return <p className="text-sm text-gray-400 p-4">Loading...</p>;

  return (
    <div>
      {/* Guest Tiers */}
      <Section title="Guest Tiers">
        <div className="space-y-2">
          {tiers.data.map((tier, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-sm px-3 py-2">
              <input value={tier.label} onChange={e => updateTier(i, 'label', e.target.value)} placeholder="Label" className="w-24 border-0 bg-transparent text-sm focus:outline-none font-medium" />
              <input type="number" value={tier.guests} onChange={e => updateTier(i, 'guests', Number(e.target.value))} placeholder="Guests" className="w-20 border border-gray-200 rounded-sm px-2 py-1 text-sm focus:outline-none bg-white" />
              <span className="text-gray-400 text-xs">guests</span>
              <span className="text-gray-400 text-xs">£</span>
              <input type="number" value={tier.price} onChange={e => updateTier(i, 'price', Number(e.target.value))} placeholder="Price" className="w-24 border border-gray-200 rounded-sm px-2 py-1 text-sm focus:outline-none bg-white" />
              <DelBtn onClick={() => delTier(i)} />
            </div>
          ))}
        </div>
        <AddBtn onClick={addTier} label="Add Tier" />
        <SaveBar onSave={() => tiers.save(tiers.data)} saving={tiers.saving} toast={tiers.toast} />
      </Section>

      {/* Table Styles */}
      <Section title="Table Styles">
        <div className="space-y-3">
          {styles.data.map((s, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Field label="Name" value={s.name} onChange={v => updateStyle(i, 'name', v)} />
                  <Field label="Tag" value={s.tag} onChange={v => updateStyle(i, 'tag', v)} placeholder="e.g. AUTHENTIC & WARM" />
                  <div className="col-span-2"><Field label="Description" value={s.desc} onChange={v => updateStyle(i, 'desc', v)} /></div>
                  <div className="col-span-2"><Field label="Image URL" value={s.img} onChange={v => updateStyle(i, 'img', v)} /></div>
                </div>
                <DelBtn onClick={() => delStyle(i)} />
              </div>
            </div>
          ))}
        </div>
        <AddBtn onClick={addStyle} label="Add Style" />
        <SaveBar onSave={() => styles.save(styles.data)} saving={styles.saving} toast={styles.toast} />
      </Section>

      {/* Menu Sections */}
      <Section title="Menu Sections & Items">
        {menu.data.map((sec, si) => (
          <div key={si} className="mb-5 border border-gray-200 rounded-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
              <input value={sec.label} onChange={e => updateSection(si, 'label', e.target.value)} className="flex-1 text-sm font-semibold bg-transparent border-0 focus:outline-none" />
              <input value={sec.subtitle} onChange={e => updateSection(si, 'subtitle', e.target.value)} placeholder="Subtitle" className="flex-1 text-xs bg-transparent border-0 focus:outline-none text-gray-500" />
              <DelBtn onClick={() => delSection(si)} />
            </div>
            <div className="p-4">
              <input value={sec.img} onChange={e => updateSection(si, 'img', e.target.value)} placeholder="Section image URL" className="w-full text-xs border border-gray-200 rounded-sm px-2.5 py-1.5 mb-3 focus:outline-none" />
              <table className="w-full text-xs">
                <thead><tr className="text-gray-500 font-medium">
                  <th className="text-left pb-2">Name</th>
                  <th className="text-left pb-2 w-20">Price £</th>
                  <th className="text-left pb-2 w-20">Unit</th>
                  <th className="text-left pb-2 w-16">Min</th>
                  <th className="w-6" />
                </tr></thead>
                <tbody>
                  {sec.items.map((item, ii) => (
                    <tr key={ii} className="border-t border-gray-100">
                      <td className="py-1.5 pr-2"><input value={item.name} onChange={e => updateMenuItem(si, ii, 'name', e.target.value)} className="w-full border border-gray-200 rounded-sm px-2 py-1 focus:outline-none" /></td>
                      <td className="py-1.5 pr-2"><input type="number" step="0.01" value={item.price} onChange={e => updateMenuItem(si, ii, 'price', Number(e.target.value))} className="w-full border border-gray-200 rounded-sm px-2 py-1 focus:outline-none" /></td>
                      <td className="py-1.5 pr-2"><input value={item.unit} onChange={e => updateMenuItem(si, ii, 'unit', e.target.value)} className="w-full border border-gray-200 rounded-sm px-2 py-1 focus:outline-none" /></td>
                      <td className="py-1.5 pr-2"><input type="number" value={item.min} onChange={e => updateMenuItem(si, ii, 'min', Number(e.target.value))} className="w-full border border-gray-200 rounded-sm px-2 py-1 focus:outline-none" /></td>
                      <td className="py-1.5"><DelBtn onClick={() => delMenuItem(si, ii)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <AddBtn onClick={() => addMenuItem(si)} label="Add Item" />
            </div>
          </div>
        ))}
        <AddBtn onClick={addSection} label="Add Section" />
        <SaveBar onSave={() => menu.save(menu.data)} saving={menu.saving} toast={menu.toast} />
      </Section>

      {/* Brunch Packages */}
      <Section title="Brunch Packages">
        {['nigerian', 'western'].map(type => (
          <div key={type} className="mb-5">
            <p className="text-xs font-bold text-gray-600 uppercase mb-2">{type === 'nigerian' ? 'Nigerian Traditional' : 'Western Brunch'}</p>
            <div className="space-y-2">
              {(brunch.data[type] || []).map((pkg, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">Guests</span>
                      <input type="number" value={pkg.guests} onChange={e => updateBrunch(type, i, 'guests', Number(e.target.value))} className="flex-1 border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none bg-white" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">£</span>
                      <input type="number" value={pkg.price} onChange={e => updateBrunch(type, i, 'price', Number(e.target.value))} className="flex-1 border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none bg-white" />
                    </div>
                    <div className="flex justify-end"><DelBtn onClick={() => delBrunch(type, i)} /></div>
                  </div>
                  <input value={pkg.name} onChange={e => updateBrunch(type, i, 'name', e.target.value)} placeholder="Package name" className="w-full text-xs border border-gray-200 rounded-sm px-2.5 py-1.5 mb-1.5 focus:outline-none bg-white" />
                  <input value={pkg.desc} onChange={e => updateBrunch(type, i, 'desc', e.target.value)} placeholder="Description" className="w-full text-xs border border-gray-200 rounded-sm px-2.5 py-1.5 focus:outline-none bg-white" />
                </div>
              ))}
            </div>
            <AddBtn onClick={() => addBrunch(type)} label={`Add ${type === 'nigerian' ? 'Nigerian' : 'Western'} Package`} />
          </div>
        ))}
        <SaveBar onSave={() => brunch.save(brunch.data)} saving={brunch.saving} toast={brunch.toast} />
      </Section>

      {/* Staff Config */}
      <Section title="Staffing Rates">
        <p className="text-xs text-gray-500 mb-4">
          Staff cost = Staff count × max(hours, min hours) × hourly rate. This is added to the order total.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">Hourly Rate per Staff (£)</label>
            <input
              type="number"
              step="0.01"
              value={staff.data.hourlyRate}
              onChange={e => staff.setData({ ...staff.data, hourlyRate: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">e.g. 16.67 = £100 for a 6-hour shift</p>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">Minimum Hours per Staff</label>
            <input
              type="number"
              min="1"
              value={staff.data.minHours}
              onChange={e => staff.setData({ ...staff.data, minHours: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">Staff hours are billed at least this many hours</p>
          </div>
        </div>
        <div className="mt-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm">
          <p className="text-xs text-gray-600 font-medium">Example calculation:</p>
          <p className="text-xs text-gray-500 mt-0.5">
            4 staff × {staff.data.minHours}h minimum × £{Number(staff.data.hourlyRate).toFixed(2)}/hr = <span className="font-bold text-gray-700">£{(4 * staff.data.minHours * staff.data.hourlyRate).toFixed(2)}</span>
          </p>
        </div>
        <SaveBar onSave={() => staff.save(staff.data)} saving={staff.saving} toast={staff.toast} />
      </Section>
    </div>
  );
}

/* ─── PLATTER TAB ─── */
function PlatterEditor({ authHeader }) {
  const trays = useMenuKey('platter-trays', authHeader);
  const sc = useMenuKey('platter-smallchops', authHeader);
  const pb = useMenuKey('platter-brunch', authHeader);

  function updateTray(i, field, val) { trays.setData(trays.data.map((t, ti) => ti !== i ? t : { ...t, [field]: val })); }
  function updateVolume(ti, vi, field, val) {
    trays.setData(trays.data.map((t, idx) => idx !== ti ? t : {
      ...t, volumes: t.volumes.map((v, vi2) => vi2 !== vi ? v : { ...v, [field]: val }),
    }));
  }
  function addVolume(ti) { trays.setData(trays.data.map((t, idx) => idx !== ti ? t : { ...t, volumes: [...t.volumes, { label: '', price: 0 }] })); }
  function delVolume(ti, vi) { trays.setData(trays.data.map((t, idx) => idx !== ti ? t : { ...t, volumes: t.volumes.filter((_, vi2) => vi2 !== vi) })); }
  function addTray() { trays.setData([...trays.data, { id: `tray-${Date.now()}`, name: '', badge: '', desc: '', img: '', volumes: [] }]); }
  function delTray(i) { trays.setData(trays.data.filter((_, ti) => ti !== i)); }

  function updateSCTier(i, field, val) { sc.setData({ ...sc.data, tiers: sc.data.tiers.map((t, ti) => ti !== i ? t : { ...t, [field]: val }) }); }
  function addSCTier() { sc.setData({ ...sc.data, tiers: [...sc.data.tiers, { pcs: 0, pricePerPc: 0 }] }); }
  function delSCTier(i) { sc.setData({ ...sc.data, tiers: sc.data.tiers.filter((_, ti) => ti !== i) }); }

  function updatePB(i, field, val) { pb.setData(pb.data.map((b, bi) => bi !== i ? b : { ...b, [field]: val })); }
  function addPB() { pb.setData([...pb.data, { id: `brunch-${Date.now()}`, name: '', desc: '', pricePerGuest: 0, img: '' }]); }
  function delPB(i) { pb.setData(pb.data.filter((_, bi) => bi !== i)); }

  if (!trays.data || !sc.data || !pb.data) return <p className="text-sm text-gray-400 p-4">Loading...</p>;

  return (
    <div>
      <Section title="Trays">
        {trays.data.map((tray, ti) => (
          <div key={ti} className="mb-4 border border-gray-200 rounded-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center gap-2">
              <input value={tray.name} onChange={e => updateTray(ti, 'name', e.target.value)} placeholder="Tray name" className="flex-1 text-sm font-semibold bg-transparent border-0 focus:outline-none" />
              <input value={tray.badge || ''} onChange={e => updateTray(ti, 'badge', e.target.value)} placeholder="Badge" className="w-28 text-xs bg-white border border-gray-200 rounded-sm px-2 py-1 focus:outline-none" />
              <DelBtn onClick={() => delTray(ti)} />
            </div>
            <div className="p-4 space-y-2">
              <input value={tray.desc} onChange={e => updateTray(ti, 'desc', e.target.value)} placeholder="Description" className="w-full text-sm border border-gray-200 rounded-sm px-2.5 py-1.5 focus:outline-none" />
              <input value={tray.img} onChange={e => updateTray(ti, 'img', e.target.value)} placeholder="Image URL" className="w-full text-xs border border-gray-200 rounded-sm px-2.5 py-1.5 focus:outline-none" />
              <p className="text-xs font-semibold text-gray-500 uppercase mt-2">Volumes</p>
              <div className="space-y-1.5">
                {tray.volumes.map((v, vi) => (
                  <div key={vi} className="flex items-center gap-2">
                    <input value={v.label} onChange={e => updateVolume(ti, vi, 'label', e.target.value)} placeholder="Label (e.g. 3L)" className="w-20 border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none" />
                    <span className="text-gray-400 text-xs">£</span>
                    <input type="number" value={v.price} onChange={e => updateVolume(ti, vi, 'price', Number(e.target.value))} className="w-24 border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none" />
                    <DelBtn onClick={() => delVolume(ti, vi)} />
                  </div>
                ))}
              </div>
              <AddBtn onClick={() => addVolume(ti)} label="Add Volume" />
            </div>
          </div>
        ))}
        <AddBtn onClick={addTray} label="Add Tray" />
        <SaveBar onSave={() => trays.save(trays.data)} saving={trays.saving} toast={trays.toast} />
      </Section>

      <Section title="Signature Small Chops Box">
        <div className="space-y-2 mb-4">
          <Field label="Name" value={sc.data.name} onChange={v => sc.setData({ ...sc.data, name: v })} />
          <Field label="Description" value={sc.data.desc} onChange={v => sc.setData({ ...sc.data, desc: v })} />
          <Field label="Image URL" value={sc.data.img} onChange={v => sc.setData({ ...sc.data, img: v })} />
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tiers</p>
        <div className="space-y-1.5">
          {sc.data.tiers.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="number" value={t.pcs} onChange={e => updateSCTier(i, 'pcs', Number(e.target.value))} placeholder="Pcs" className="w-20 border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none" />
              <span className="text-gray-400 text-xs">pcs @ £</span>
              <input type="number" step="0.01" value={t.pricePerPc} onChange={e => updateSCTier(i, 'pricePerPc', Number(e.target.value))} className="w-20 border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none" />
              <span className="text-gray-400 text-xs">/pc</span>
              <DelBtn onClick={() => delSCTier(i)} />
            </div>
          ))}
        </div>
        <AddBtn onClick={addSCTier} label="Add Tier" />
        <SaveBar onSave={() => sc.save(sc.data)} saving={sc.saving} toast={sc.toast} />
      </Section>

      <Section title="Brunch Options">
        <div className="space-y-3">
          {pb.data.map((b, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Name" value={b.name} onChange={v => updatePB(i, 'name', v)} />
                    <Field label="Price/Guest £" value={b.pricePerGuest} onChange={v => updatePB(i, 'pricePerGuest', Number(v))} type="number" />
                  </div>
                  <Field label="Description" value={b.desc} onChange={v => updatePB(i, 'desc', v)} />
                  <Field label="Image URL" value={b.img} onChange={v => updatePB(i, 'img', v)} />
                </div>
                <DelBtn onClick={() => delPB(i)} />
              </div>
            </div>
          ))}
        </div>
        <AddBtn onClick={addPB} label="Add Brunch Option" />
        <SaveBar onSave={() => pb.save(pb.data)} saving={pb.saving} toast={pb.toast} />
      </Section>
    </div>
  );
}

/* ─── FULL SERVICE TAB ─── */
function FullServiceEditor({ authHeader }) {
  const pkgs = useMenuKey('fs-packages', authHeader);
  const fsm = useMenuKey('fs-menu', authHeader);

  function updatePkg(i, field, val) { pkgs.setData(pkgs.data.map((p, pi) => pi !== i ? p : { ...p, [field]: val })); }
  function updateAlloc(i, cat, val) { pkgs.setData(pkgs.data.map((p, pi) => pi !== i ? p : { ...p, allocation: { ...p.allocation, [cat]: Number(val) } })); }
  function updateFeature(pi, fi, field, val) {
    pkgs.setData(pkgs.data.map((p, idx) => idx !== pi ? p : {
      ...p, features: p.features.map((f, fIdx) => fIdx !== fi ? f : { ...f, [field]: val }),
    }));
  }
  function addFeature(pi) { pkgs.setData(pkgs.data.map((p, idx) => idx !== pi ? p : { ...p, features: [...p.features, { label: '', ok: true }] })); }
  function delFeature(pi, fi) { pkgs.setData(pkgs.data.map((p, idx) => idx !== pi ? p : { ...p, features: p.features.filter((_, fIdx) => fIdx !== fi) })); }

  function updateItem(cat, i, field, val) {
    fsm.setData({ ...fsm.data, [cat]: { ...fsm.data[cat], items: fsm.data[cat].items.map((item, ii) => ii !== i ? item : { ...item, [field]: val }) } });
  }
  function addItem(cat) {
    fsm.setData({ ...fsm.data, [cat]: { ...fsm.data[cat], items: [...fsm.data[cat].items, { id: `item-${Date.now()}`, name: '', badge: null, desc: '', img: '' }] } });
  }
  function delItem(cat, i) {
    fsm.setData({ ...fsm.data, [cat]: { ...fsm.data[cat], items: fsm.data[cat].items.filter((_, ii) => ii !== i) } });
  }

  if (!pkgs.data || !fsm.data) return <p className="text-sm text-gray-400 p-4">Loading...</p>;

  return (
    <div>
      <Section title="Packages">
        {pkgs.data.map((pkg, pi) => (
          <div key={pi} className="mb-4 border border-gray-200 rounded-sm p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Name" value={pkg.name} onChange={v => updatePkg(pi, 'name', v)} />
              <Field label="Badge" value={pkg.badge} onChange={v => updatePkg(pi, 'badge', v)} />
              <Field label="Price/Guest £" value={pkg.pricePerGuest} onChange={v => updatePkg(pi, 'pricePerGuest', Number(v))} type="number" />
              <Field label="Description" value={pkg.desc} onChange={v => updatePkg(pi, 'desc', v)} />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Course Allocation</p>
            <div className="flex gap-4 mb-3">
              {['starters', 'mains', 'desserts'].map(cat => (
                <div key={cat} className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 capitalize">{cat}</span>
                  <input type="number" min="0" max="5" value={pkg.allocation?.[cat] ?? 0} onChange={e => updateAlloc(pi, cat, e.target.value)} className="w-12 border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none text-center" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Features</p>
            {pkg.features.map((f, fi) => (
              <div key={fi} className="flex items-center gap-2 mb-1.5">
                <input type="checkbox" checked={f.ok} onChange={e => updateFeature(pi, fi, 'ok', e.target.checked)} className="accent-gray-700" />
                <input value={f.label} onChange={e => updateFeature(pi, fi, 'label', e.target.value)} className="flex-1 border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none" />
                <DelBtn onClick={() => delFeature(pi, fi)} />
              </div>
            ))}
            <AddBtn onClick={() => addFeature(pi)} label="Add Feature" />
          </div>
        ))}
        <SaveBar onSave={() => pkgs.save(pkgs.data)} saving={pkgs.saving} toast={pkgs.toast} />
      </Section>

      <Section title="Menu Items">
        {Object.entries(fsm.data).map(([cat, catData]) => (
          <div key={cat} className="mb-5">
            <p className="text-xs font-bold text-gray-600 uppercase mb-2">{catData.label}</p>
            <div className="space-y-2">
              {catData.items.map((item, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-sm p-3 flex gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Field label="Name" value={item.name} onChange={v => updateItem(cat, i, 'name', v)} />
                    <Field label="Badge" value={item.badge || ''} onChange={v => updateItem(cat, i, 'badge', v || null)} placeholder="Optional" />
                    <div className="col-span-2"><Field label="Description" value={item.desc} onChange={v => updateItem(cat, i, 'desc', v)} /></div>
                    <div className="col-span-2"><Field label="Image URL" value={item.img} onChange={v => updateItem(cat, i, 'img', v)} /></div>
                  </div>
                  <DelBtn onClick={() => delItem(cat, i)} />
                </div>
              ))}
            </div>
            <AddBtn onClick={() => addItem(cat)} label={`Add ${catData.label} Item`} />
          </div>
        ))}
        <SaveBar onSave={() => fsm.save(fsm.data)} saving={fsm.saving} toast={fsm.toast} />
      </Section>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
const TABS = [
  { id: 'grazing', label: 'Grazing Table' },
  { id: 'platter', label: 'Platter' },
  { id: 'fullservice', label: 'Full Service' },
];

export default function AdminMenuPage() {
  const { authHeader } = useAdminAuth();
  const [tab, setTab] = useState('grazing');

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Menu Configuration</h1>
        <p className="text-sm text-gray-500 mt-0.5">Edit prices, items, and options shown to customers in the order builder</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'grazing' && <GrazingEditor authHeader={authHeader} />}
      {tab === 'platter' && <PlatterEditor authHeader={authHeader} />}
      {tab === 'fullservice' && <FullServiceEditor authHeader={authHeader} />}
    </div>
  );
}

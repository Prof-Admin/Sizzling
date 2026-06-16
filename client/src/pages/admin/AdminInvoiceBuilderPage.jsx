import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { downloadInvoicePdf, getInvoicePdfBase64, preloadLogo } from '../../utils/generateInvoicePdf';

const STATUSES = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

function emptyItem(isExtra = true) {
  return { description: '', quantity: 1, unitPrice: 0, total: 0, isExtra };
}

function buildLineItemsFromOrder(order) {
  const { serviceType, orderData, estimatedTotal } = order;

  if (serviceType === 'platter' && orderData?.items?.length) {
    const items = orderData.items.map(item => ({
      description: item.name + (item.detail ? ` (${item.detail})` : ''),
      quantity: 1,
      unitPrice: +(item.price || 0),
      total: +(item.price || 0),
      isExtra: false,
    }));
    const subtotal = items.reduce((s, i) => s + i.unitPrice, 0);
    const fee = +(subtotal * 0.05).toFixed(2);
    if (fee > 0) {
      items.push({ description: 'Service Fee (5%)', quantity: 1, unitPrice: fee, total: fee, isExtra: false });
    }
    return items;
  }

  if (serviceType === 'full-service' && orderData?.package) {
    const pkg = orderData.package;
    const guests = orderData.guests || 1;
    const pricePerGuest = +(pkg.pricePerGuest || 0);
    return [{
      description: `${pkg.name || 'Full-Service'} Package × ${guests} guests`,
      quantity: guests,
      unitPrice: pricePerGuest,
      total: +(guests * pricePerGuest).toFixed(2),
      isExtra: false,
    }];
  }

  // Grazing and fallback: single base line item
  const label = serviceType === 'grazing' ? 'Grazing Table' : serviceType === 'platter' ? 'Platter Delivery' : 'Full-Service Catering';
  return [{
    description: `${label} (as quoted)`,
    quantity: 1,
    unitPrice: +(estimatedTotal || 0),
    total: +(estimatedTotal || 0),
    isExtra: false,
  }];
}

function calcItem(item) {
  return { ...item, total: +(Number(item.quantity) * Number(item.unitPrice)).toFixed(2) };
}

function calcTotals(lineItems, vatRate) {
  const subtotal = +lineItems.reduce((s, i) => s + i.total, 0).toFixed(2);
  const vatAmount = +(subtotal * (vatRate / 100)).toFixed(2);
  const grandTotal = +(subtotal + vatAmount).toFixed(2);
  return { subtotal, vatAmount, grandTotal };
}

export default function AdminInvoiceBuilderPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authHeader } = useAdminAuth();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [settings, setSettings] = useState({});
  const [logoBase64, setLogoBase64] = useState(null);

  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    status: 'draft',
    client: { name: '', email: '', phone: '' },
    serviceDescription: '',
    lineItems: [],
    vatRate: 20,
    subtotal: 0,
    vatAmount: 0,
    grandTotal: 0,
    paymentMethod: 'none',
    stripePaymentLink: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    orderId: null,
  });

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  }

  // Load payment settings and preload logo
  useEffect(() => {
    axios.get('/api/admin/menu/payment-settings', { headers: authHeader })
      .then(r => setSettings(r.data.data || {}))
      .catch(() => {});
    preloadLogo().then(setLogoBase64);
  }, []);

  // Load invoice or seed from order
  useEffect(() => {
    const orderId = searchParams.get('orderId');

    async function load() {
      setLoading(true);
      try {
        if (!isNew) {
          const r = await axios.get(`/api/admin/invoices/${id}`, { headers: authHeader });
          const inv = r.data.data;
          setInvoice({
            ...inv,
            issueDate: inv.issueDate ? inv.issueDate.split('T')[0] : '',
            dueDate: inv.dueDate ? inv.dueDate.split('T')[0] : '',
          });
        } else if (orderId) {
          const r = await axios.get(`/api/admin/orders/${orderId}`, { headers: authHeader });
          const order = r.data.data;
          const c = order.contact || {};
          const serviceLabel = order.serviceType === 'grazing' ? 'Grazing Table' : order.serviceType === 'platter' ? 'Platter Delivery' : 'Full-Service Catering';
          setInvoice(prev => ({
            ...prev,
            orderId: order._id,
            client: { name: c.name || '', email: c.email || '', phone: c.phone || '' },
            serviceDescription: `${serviceLabel} – ${c.name || ''}`,
            lineItems: buildLineItemsFromOrder(order),
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Sync totals whenever line items or vatRate change
  useEffect(() => {
    const totals = calcTotals(invoice.lineItems, invoice.vatRate);
    setInvoice(prev => ({ ...prev, ...totals }));
  }, [invoice.lineItems, invoice.vatRate]);

  function updateField(field, value) {
    setInvoice(prev => ({ ...prev, [field]: value }));
  }

  function updateClient(field, value) {
    setInvoice(prev => ({ ...prev, client: { ...prev.client, [field]: value } }));
  }

  function updateItem(idx, field, value) {
    setInvoice(prev => {
      const items = prev.lineItems.map((item, i) => {
        if (i !== idx) return item;
        const updated = { ...item, [field]: field === 'description' ? value : Number(value) };
        return calcItem(updated);
      });
      return { ...prev, lineItems: items };
    });
  }

  function addItem() {
    setInvoice(prev => ({ ...prev, lineItems: [...prev.lineItems, emptyItem(true)] }));
  }

  function removeItem(idx) {
    setInvoice(prev => ({ ...prev, lineItems: prev.lineItems.filter((_, i) => i !== idx) }));
  }

  async function saveInvoice(newStatus) {
    setSaving(true);
    try {
      const payload = {
        ...invoice,
        status: newStatus || invoice.status,
        issueDate: invoice.issueDate || undefined,
        dueDate: invoice.dueDate || undefined,
      };
      let saved;
      if (isNew) {
        const r = await axios.post('/api/admin/invoices', payload, { headers: authHeader });
        saved = r.data.data;
        navigate(`/admin/invoices/${saved._id}`, { replace: true });
      } else {
        const r = await axios.put(`/api/admin/invoices/${id}`, payload, { headers: authHeader });
        saved = r.data.data;
        setInvoice(prev => ({
          ...prev,
          invoiceNumber: saved.invoiceNumber,
          status: saved.status,
          subtotal: saved.subtotal,
          vatAmount: saved.vatAmount,
          grandTotal: saved.grandTotal,
        }));
      }
      showToast('Invoice saved!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    if (!invoice.invoiceNumber) { showToast('Save the invoice first.', 'error'); return; }
    downloadInvoicePdf(invoice, settings, logoBase64);
  }

  async function handleSendEmail() {
    if (!invoice.invoiceNumber) { showToast('Save the invoice first.', 'error'); return; }
    if (!invoice.client.email) { showToast('Client email is required.', 'error'); return; }
    setSendingEmail(true);
    try {
      const pdfBase64 = getInvoicePdfBase64(invoice, settings, logoBase64);
      await axios.post(
        `/api/admin/invoices/${id}/send-email`,
        { pdfBase64 },
        { headers: authHeader }
      );
      setInvoice(prev => ({ ...prev, status: prev.status === 'draft' ? 'sent' : prev.status }));
      showToast(`Invoice sent to ${invoice.client.email}!`);
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to send email.', 'error');
    } finally {
      setSendingEmail(false);
    }
  }

  if (loading) return <div className="p-8 text-sm text-gray-400">Loading...</div>;

  const { subtotal, vatAmount, grandTotal } = calcTotals(invoice.lineItems, invoice.vatRate);

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/invoices')} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isNew ? 'New Invoice' : invoice.invoiceNumber || 'Invoice'}
            </h1>
            {invoice.orderId && <p className="text-xs text-gray-400 mt-0.5">Linked to order</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Status selector */}
          <select
            value={invoice.status}
            onChange={e => updateField('status', e.target.value)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[invoice.status]}`}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>

          {toast.msg && (
            <span className={`text-xs font-medium px-3 py-1.5 rounded-sm ${toast.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              {toast.msg}
            </span>
          )}

          <button onClick={handleDownload} className="px-3 py-1.5 border border-gray-200 rounded-sm text-xs font-medium text-gray-600 hover:border-gray-400 transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>

          <button
            onClick={handleSendEmail}
            disabled={sendingEmail || isNew}
            className="px-3 py-1.5 border border-blue-200 bg-blue-50 rounded-sm text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {sendingEmail ? 'Sending…' : 'Email to Client'}
          </button>

          <button
            onClick={() => saveInvoice()}
            disabled={saving}
            className="px-4 py-1.5 bg-gray-900 text-white rounded-sm text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — main form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Invoice dates */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Issue Date</label>
                <input type="date" value={invoice.issueDate} onChange={e => updateField('issueDate', e.target.value)} className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Due Date</label>
                <input type="date" value={invoice.dueDate} onChange={e => updateField('dueDate', e.target.value)} className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
            </div>
          </div>

          {/* Client details */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Client Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Full Name *</label>
                <input value={invoice.client.name} onChange={e => updateClient('name', e.target.value)} placeholder="Client name" className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Email Address *</label>
                <input type="email" value={invoice.client.email} onChange={e => updateClient('email', e.target.value)} placeholder="client@email.com" className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Phone</label>
                <input value={invoice.client.phone} onChange={e => updateClient('phone', e.target.value)} placeholder="+44 7000 000 000" className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Service Description</label>
                <input value={invoice.serviceDescription} onChange={e => updateField('serviceDescription', e.target.value)} placeholder="e.g. Grazing Table – 50 Guests" className="w-full border border-gray-200 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Line Items</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-2">Description</th>
                    <th className="text-center text-xs font-semibold text-gray-500 pb-2 w-16">Qty</th>
                    <th className="text-right text-xs font-semibold text-gray-500 pb-2 w-28">Unit Price £</th>
                    <th className="text-right text-xs font-semibold text-gray-500 pb-2 w-28">Total £</th>
                    <th className="w-6 pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, idx) => (
                    <tr key={idx} className={`border-b border-gray-50 ${item.isExtra ? 'bg-amber-50/40' : ''}`}>
                      <td className="py-2 pr-2">
                        <div className="flex items-center gap-1.5">
                          {item.isExtra && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">EXTRA</span>}
                          <input
                            value={item.description}
                            onChange={e => updateItem(idx, 'description', e.target.value)}
                            placeholder="Item description"
                            className="w-full border border-gray-200 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-gray-400"
                          />
                        </div>
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.quantity}
                          onChange={e => updateItem(idx, 'quantity', e.target.value)}
                          className="w-full border border-gray-200 rounded-sm px-2 py-1 text-xs text-center focus:outline-none focus:border-gray-400"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={e => updateItem(idx, 'unitPrice', e.target.value)}
                          className="w-full border border-gray-200 rounded-sm px-2 py-1 text-xs text-right focus:outline-none focus:border-gray-400"
                        />
                      </td>
                      <td className="py-2 pr-2 text-right text-xs font-semibold text-gray-800">
                        £{item.total.toFixed(2)}
                      </td>
                      <td className="py-2">
                        <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addItem}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-dashed border-gray-300 rounded-sm px-3 py-2 hover:border-amber-400 hover:text-amber-600 transition-colors w-full justify-center"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Extra Charge
            </button>
          </div>

          {/* Payment method */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Payment Method</h3>
            <div className="flex gap-3 mb-4">
              {['bank_transfer', 'stripe', 'none'].map(method => (
                <label key={method} className={`flex items-center gap-2 px-3 py-2 rounded-sm border cursor-pointer text-sm transition-colors ${invoice.paymentMethod === method ? 'border-gray-900 bg-gray-50 font-semibold text-gray-900' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                  <input type="radio" name="paymentMethod" value={method} checked={invoice.paymentMethod === method} onChange={() => updateField('paymentMethod', method)} className="accent-gray-900" />
                  {method === 'bank_transfer' ? 'Bank Transfer' : method === 'stripe' ? 'Stripe Payment Link' : 'None / TBD'}
                </label>
              ))}
            </div>

            {invoice.paymentMethod === 'bank_transfer' && (
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 text-sm space-y-1 text-gray-700">
                <p className="text-xs text-gray-400 mb-2">Bank details from Settings — shown on invoice</p>
                {settings.bankTransfer?.bankName && <p><span className="text-gray-500">Bank:</span> {settings.bankTransfer.bankName}</p>}
                {settings.bankTransfer?.accountName && <p><span className="text-gray-500">Account:</span> {settings.bankTransfer.accountName}</p>}
                {settings.bankTransfer?.accountNumber && <p><span className="text-gray-500">Number:</span> {settings.bankTransfer.accountNumber}</p>}
                {settings.bankTransfer?.sortCode && <p><span className="text-gray-500">Sort Code:</span> {settings.bankTransfer.sortCode}</p>}
                {!settings.bankTransfer?.bankName && (
                  <p className="text-amber-600 text-xs">⚠ Bank details not configured. Go to <a href="/admin/settings" className="underline">Settings</a>.</p>
                )}
              </div>
            )}

            {invoice.paymentMethod === 'stripe' && (
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">Stripe Payment Link URL</label>
                <input
                  value={invoice.stripePaymentLink}
                  onChange={e => updateField('stripePaymentLink', e.target.value)}
                  placeholder="https://buy.stripe.com/..."
                  className="w-full border border-gray-200 rounded-sm px-2.5 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1.5">Create a payment link in your <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noreferrer" className="underline text-blue-500">Stripe Dashboard</a>, then paste it here.</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Notes</h3>
            <textarea
              value={invoice.notes}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="Payment terms, special instructions, thank you message…"
              rows={3}
              className="w-full border border-gray-200 rounded-sm px-2.5 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Right — totals + quick actions */}
        <div className="space-y-4">
          {/* VAT + Totals */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">VAT</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={invoice.vatRate}
                    onChange={e => updateField('vatRate', Number(e.target.value))}
                    className="w-14 border border-gray-200 rounded-sm px-2 py-0.5 text-xs text-right focus:outline-none"
                  />
                  <span className="text-gray-400 text-xs">%</span>
                  <span className="font-medium">£{vatAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-gray-900 rounded-sm px-4 py-3 flex justify-between items-center">
              <span className="text-white text-xs font-bold uppercase tracking-wide">Total Due</span>
              <span className="text-white text-lg font-bold">£{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Actions</h3>
            <button
              onClick={() => saveInvoice()}
              disabled={saving}
              className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Invoice'}
            </button>
            <button
              onClick={handleDownload}
              className="w-full py-2.5 border border-gray-200 text-sm font-medium text-gray-700 rounded-sm hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail || isNew}
              className="w-full py-2.5 border border-blue-200 bg-blue-50 text-sm font-medium text-blue-700 rounded-sm hover:bg-blue-100 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {sendingEmail ? 'Sending…' : 'Send to Client'}
            </button>
            {!isNew && invoice.status === 'draft' && (
              <button
                onClick={() => saveInvoice('sent')}
                className="w-full py-2.5 border border-blue-300 text-sm font-medium text-blue-700 rounded-sm hover:bg-blue-50 transition-colors"
              >
                Mark as Sent
              </button>
            )}
            {!isNew && invoice.status === 'sent' && (
              <button
                onClick={() => saveInvoice('paid')}
                className="w-full py-2.5 border border-green-300 bg-green-50 text-sm font-medium text-green-700 rounded-sm hover:bg-green-100 transition-colors"
              >
                Mark as Paid ✓
              </button>
            )}
          </div>

          {/* Invoice info */}
          {invoice.invoiceNumber && (
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 text-xs text-gray-500 space-y-1">
              <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
              <p><span className="font-medium">Created:</span> {new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-GB')}</p>
              {invoice.orderId && <p><span className="font-medium">Order ID:</span> {String(invoice.orderId).slice(-8)}…</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

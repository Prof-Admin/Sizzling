import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

function Field({ label, value, onChange, type = 'text', placeholder = '', hint = '' }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 mb-5">
      <h3 className="text-sm font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const { authHeader } = useAdminAuth();
  const [data, setData] = useState({
    companyDetails: {
      name: 'Sizzling Sensations',
      tagline: "London's Premier African Catering",
      address: 'London, United Kingdom',
      phone: '',
      email: 'hello@sizzlingsensations.co.uk',
      website: 'www.sizzlingsensations.co.uk',
    },
    bankTransfer: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      sortCode: '',
      paymentReference: 'SS-[number]',
    },
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    axios.get('/api/admin/menu/payment-settings', { headers: authHeader })
      .then(r => { if (r.data.data) setData(r.data.data); })
      .catch(() => {});
  }, []);

  function setCompany(field, value) {
    setData(prev => ({ ...prev, companyDetails: { ...prev.companyDetails, [field]: value } }));
  }
  function setBank(field, value) {
    setData(prev => ({ ...prev, bankTransfer: { ...prev.bankTransfer, [field]: value } }));
  }

  async function save() {
    setSaving(true);
    try {
      await axios.put('/api/admin/menu/payment-settings', { data }, { headers: authHeader });
      setToast('Settings saved!');
      setTimeout(() => setToast(''), 2500);
    } catch {
      setToast('Save failed.');
      setTimeout(() => setToast(''), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Company details and payment configuration for invoices</p>
        </div>
        <div className="flex items-center gap-3">
          {toast && <span className={`text-sm font-medium ${toast === 'Settings saved!' ? 'text-green-600' : 'text-red-500'}`}>{toast}</span>}
          <button onClick={save} disabled={saving} className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>

      <Section title="Company Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company Name" value={data.companyDetails.name} onChange={v => setCompany('name', v)} placeholder="Sizzling Sensations" />
          <Field label="Tagline" value={data.companyDetails.tagline} onChange={v => setCompany('tagline', v)} placeholder="London's Premier African Catering" />
          <Field label="Address" value={data.companyDetails.address} onChange={v => setCompany('address', v)} placeholder="London, United Kingdom" />
          <Field label="Phone" value={data.companyDetails.phone} onChange={v => setCompany('phone', v)} placeholder="+44 7000 000 000" />
          <Field label="Email" value={data.companyDetails.email} onChange={v => setCompany('email', v)} placeholder="hello@sizzlingsensations.co.uk" />
          <Field label="Website" value={data.companyDetails.website} onChange={v => setCompany('website', v)} placeholder="www.sizzlingsensations.co.uk" />
        </div>
      </Section>

      <Section title="Bank Transfer Details">
        <p className="text-xs text-gray-400 mb-4">These details appear on invoices when Bank Transfer is selected as the payment method.</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Bank Name" value={data.bankTransfer.bankName} onChange={v => setBank('bankName', v)} placeholder="Barclays" />
          <Field label="Account Name" value={data.bankTransfer.accountName} onChange={v => setBank('accountName', v)} placeholder="Sizzling Sensations Ltd" />
          <Field label="Account Number" value={data.bankTransfer.accountNumber} onChange={v => setBank('accountNumber', v)} placeholder="12345678" />
          <Field label="Sort Code" value={data.bankTransfer.sortCode} onChange={v => setBank('sortCode', v)} placeholder="12-34-56" />
          <div className="col-span-2">
            <Field
              label="Payment Reference"
              value={data.bankTransfer.paymentReference}
              onChange={v => setBank('paymentReference', v)}
              placeholder="SS-[number]"
              hint="Use [number] as a placeholder — it will be replaced with the invoice number on the PDF."
            />
          </div>
        </div>
      </Section>

      <Section title="Stripe Payments">
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 text-sm text-blue-800 space-y-2">
          <p className="font-semibold">How to use Stripe payment links:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-700 text-xs leading-relaxed">
            <li>Log in to your <strong>Stripe Dashboard</strong> at dashboard.stripe.com</li>
            <li>Go to <strong>Payment Links → Create Payment Link</strong></li>
            <li>Set the amount equal to the invoice grand total</li>
            <li>Copy the generated link (starts with <code className="bg-blue-100 px-1 rounded">https://buy.stripe.com/…</code>)</li>
            <li>Paste it into the <strong>Stripe Payment Link</strong> field in the Invoice Builder</li>
            <li>The link appears on the PDF so the client can pay directly online</li>
          </ol>
        </div>
      </Section>

      <Section title="Email Configuration">
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-700">Email credentials are configured via environment variables on Render:</p>
          <div className="font-mono text-xs bg-white border border-gray-200 rounded-sm p-3 space-y-1">
            <p>EMAIL_HOST = smtp.gmail.com</p>
            <p>EMAIL_PORT = 587</p>
            <p>EMAIL_USER = your@gmail.com</p>
            <p>EMAIL_PASS = your-gmail-app-password</p>
            <p>EMAIL_FROM = noreply@sizzlingsensations.co.uk</p>
          </div>
          <p className="text-xs text-gray-400">For Gmail: enable 2FA → go to Google Account → Security → App Passwords → generate one for "Mail".</p>
        </div>
      </Section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { downloadInvoicePdf, preloadLogo } from '../../utils/generateInvoicePdf';

const STATUSES = ['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'];

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500 line-through',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function AdminInvoicesPage() {
  const { authHeader } = useAdminAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [logoBase64, setLogoBase64] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/menu/payment-settings', { headers: authHeader })
      .then(r => setSettings(r.data.data || {}))
      .catch(() => {});
    preloadLogo().then(setLogoBase64);
  }, []);

  function fetchInvoices() {
    setLoading(true);
    axios.get('/api/admin/invoices', {
      headers: authHeader,
      params: { status: statusFilter, page, limit: 20 },
    })
      .then(r => { setInvoices(r.data.data); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { fetchInvoices(); }, [page, statusFilter]);

  async function deleteInvoice(id) {
    if (!confirm('Delete this draft invoice?')) return;
    await axios.delete(`/api/admin/invoices/${id}`, { headers: authHeader });
    fetchInvoices();
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total</p>
        </div>
        <button
          onClick={() => navigate('/admin/invoices/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-sm hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </button>
      </div>

      <div className="mb-5">
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors capitalize ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-sm text-gray-400 text-center">Loading...</p>
        ) : invoices.length === 0 ? (
          <p className="p-8 text-sm text-gray-400 text-center">No invoices found.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Due</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{inv.client?.name}</p>
                      <p className="text-xs text-gray-400">{inv.client?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">£{inv.grandTotal?.toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-GB') : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(inv.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/invoices/${inv._id}`)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => downloadInvoicePdf(inv, settings, logoBase64)}
                          className="text-xs text-gray-500 hover:text-gray-800"
                          title="Download PDF"
                        >
                          PDF
                        </button>
                        {inv.status === 'draft' && (
                          <button
                            onClick={() => deleteInvoice(inv._id)}
                            className="text-xs text-red-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">Page {page} of {pages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs px-3 py-1.5 border border-gray-200 rounded-sm disabled:opacity-40">Prev</button>
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="text-xs px-3 py-1.5 border border-gray-200 rounded-sm disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

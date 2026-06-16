import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const STATUSES = ['all', 'new', 'confirmed', 'in-progress', 'completed', 'cancelled'];
const TYPES = ['all', 'grazing', 'platter', 'full-service'];

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const { authHeader } = useAdminAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  function fetchOrders() {
    setLoading(true);
    axios.get('/api/admin/orders', {
      headers: authHeader,
      params: { type: typeFilter, status: statusFilter, page, limit: 15 },
    })
      .then(res => { setOrders(res.data.data); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { setPage(1); }, [typeFilter, statusFilter]);
  useEffect(() => { fetchOrders(); }, [page, typeFilter, statusFilter]);

  async function updateStatus(id, status) {
    await axios.patch(`/api/admin/orders/${id}`, { status }, { headers: authHeader });
    fetchOrders();
    if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Type</label>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="text-sm border border-gray-300 rounded-sm px-2.5 py-1.5 bg-white focus:outline-none">
            {TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-300 rounded-sm px-2.5 py-1.5 bg-white focus:outline-none">
            {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white border border-gray-200 rounded-sm overflow-hidden">
          {loading ? (
            <p className="p-8 text-sm text-gray-400 text-center">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-sm text-gray-400 text-center">No orders found.</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr
                      key={o._id}
                      onClick={() => setSelected(o)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${selected?._id === o._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{o.contact?.name}</p>
                        <p className="text-xs text-gray-400">{o.contact?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{o.serviceType}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">£{o.estimatedTotal?.toFixed(2)}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateStatus(o._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-sm px-1.5 py-1 bg-white focus:outline-none"
                        >
                          {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">Page {page} of {pages}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs px-3 py-1.5 border border-gray-200 rounded-sm disabled:opacity-40 hover:border-gray-400">Prev</button>
                    <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="text-xs px-3 py-1.5 border border-gray-200 rounded-sm disabled:opacity-40 hover:border-gray-400">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 shrink-0 bg-white border border-gray-200 rounded-sm p-5 self-start sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Order Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div><span className="text-gray-500">Service</span><p className="font-medium capitalize mt-0.5">{selected.serviceType}</p></div>
              <div><span className="text-gray-500">Customer</span><p className="font-medium mt-0.5">{selected.contact?.name}</p><p className="text-gray-400">{selected.contact?.email}</p><p className="text-gray-400">{selected.contact?.phone}</p></div>
              <div><span className="text-gray-500">Total</span><p className="font-bold text-base text-gray-900 mt-0.5">£{selected.estimatedTotal?.toFixed(2)}</p></div>
              <div><span className="text-gray-500">Status</span>
                <select value={selected.status} onChange={e => updateStatus(selected._id, e.target.value)} className="block mt-1 text-xs border border-gray-200 rounded-sm px-2 py-1 bg-white focus:outline-none w-full">
                  {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><span className="text-gray-500">Date</span><p className="font-medium mt-0.5">{new Date(selected.createdAt).toLocaleString('en-GB')}</p></div>
              <button
                onClick={() => navigate(`/admin/invoices/new?orderId=${selected._id}`)}
                className="w-full mt-2 py-2 bg-gray-900 text-white text-xs font-semibold rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Create Invoice
              </button>
              {selected.orderData && (
                <div>
                  <span className="text-gray-500">Order Data</span>
                  <pre className="mt-1 text-[10px] bg-gray-50 border border-gray-100 rounded-sm p-2 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selected.orderData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

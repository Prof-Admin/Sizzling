import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const STATUSES = ['all', 'new', 'contacted', 'quoted', 'confirmed', 'declined'];

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-purple-100 text-purple-700',
  quoted: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function AdminEnquiriesPage() {
  const { authHeader } = useAdminAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  function fetchEnquiries() {
    setLoading(true);
    axios.get('/api/admin/enquiries', {
      headers: authHeader,
      params: { status: statusFilter, page, limit: 15 },
    })
      .then(res => { setEnquiries(res.data.data); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { fetchEnquiries(); }, [page, statusFilter]);

  async function updateStatus(id, status) {
    await axios.patch(`/api/admin/enquiries/${id}`, { status }, { headers: authHeader });
    fetchEnquiries();
    if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} total</p>
      </div>

      <div className="mb-5">
        <label className="text-xs text-gray-500 block mb-1">Status</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-300 rounded-sm px-2.5 py-1.5 bg-white focus:outline-none">
          {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 bg-white border border-gray-200 rounded-sm overflow-hidden">
          {loading ? (
            <p className="p-8 text-sm text-gray-400 text-center">Loading...</p>
          ) : enquiries.length === 0 ? (
            <p className="p-8 text-sm text-gray-400 text-center">No enquiries found.</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Event Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Received</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map(e => (
                    <tr
                      key={e._id}
                      onClick={() => setSelected(e)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${selected?._id === e._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{e.name}</p>
                        <p className="text-xs text-gray-400">{e.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{e.eventType}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{e.eventDate ? new Date(e.eventDate).toLocaleDateString('en-GB') : '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(e.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-3">
                        <select
                          value={e.status}
                          onClick={ev => ev.stopPropagation()}
                          onChange={ev => updateStatus(e._id, ev.target.value)}
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
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs px-3 py-1.5 border border-gray-200 rounded-sm disabled:opacity-40">Prev</button>
                    <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="text-xs px-3 py-1.5 border border-gray-200 rounded-sm disabled:opacity-40">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {selected && (
          <div className="w-72 shrink-0 bg-white border border-gray-200 rounded-sm p-5 self-start sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Enquiry Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div><span className="text-gray-500">Name</span><p className="font-medium mt-0.5">{selected.name}</p></div>
              <div><span className="text-gray-500">Contact</span><p className="text-gray-700 mt-0.5">{selected.email}</p></div>
              <div><span className="text-gray-500">Event Type</span><p className="font-medium mt-0.5">{selected.eventType}</p></div>
              {selected.eventDate && <div><span className="text-gray-500">Event Date</span><p className="font-medium mt-0.5">{new Date(selected.eventDate).toLocaleDateString('en-GB')}</p></div>}
              {selected.guestCount && <div><span className="text-gray-500">Guests</span><p className="font-medium mt-0.5">{selected.guestCount}</p></div>}
              {selected.budget && <div><span className="text-gray-500">Budget</span><p className="font-medium mt-0.5">{selected.budget}</p></div>}
              {selected.venue && <div><span className="text-gray-500">Venue</span><p className="font-medium mt-0.5">{selected.venue}</p></div>}
              {selected.serviceStyle && <div><span className="text-gray-500">Service Style</span><p className="font-medium mt-0.5">{selected.serviceStyle}</p></div>}
              {selected.message && <div><span className="text-gray-500">Message</span><p className="text-gray-700 mt-0.5 leading-relaxed">{selected.message}</p></div>}
              <div><span className="text-gray-500">Status</span>
                <select value={selected.status} onChange={e => updateStatus(selected._id, e.target.value)} className="block mt-1 text-xs border border-gray-200 rounded-sm px-2 py-1 bg-white focus:outline-none w-full">
                  {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

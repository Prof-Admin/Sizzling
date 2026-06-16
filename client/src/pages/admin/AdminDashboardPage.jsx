import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
  contacted: 'bg-purple-100 text-purple-700',
  quoted: 'bg-orange-100 text-orange-700',
  declined: 'bg-red-100 text-red-700',
};

function StatCard({ label, value, sub, color = 'text-gray-900' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  const { authHeader } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/dashboard/stats', { headers: authHeader })
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-sm text-gray-400">Loading...</div>;
  if (!stats) return <div className="p-8 text-sm text-red-500">Failed to load stats.</div>;

  const typeMap = {};
  for (const t of stats.ordersByType) typeMap[t._id] = t.count;

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your business</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Orders" value={stats.totalOrders} sub={`${stats.newOrders} new`} color="text-gray-900" />
        <StatCard label="Estimated Revenue" value={`£${stats.estimatedRevenue.toFixed(0)}`} color="text-green-700" />
        <StatCard label="Total Enquiries" value={stats.totalEnquiries} sub={`${stats.newEnquiries} new`} color="text-gray-900" />
        <StatCard label="New Today" value={stats.newOrders + stats.newEnquiries} sub="orders + enquiries" color="text-blue-700" />
      </div>

      {/* Orders by type */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['grazing', 'platter', 'full-service'].map(t => (
          <div key={t} className="bg-white border border-gray-200 rounded-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{typeMap[t] || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">{t === 'full-service' ? 'Full Service' : t}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No orders yet</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {stats.recentOrders.map(o => (
                  <tr key={o._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 text-xs">{o.contact?.name}</p>
                      <p className="text-gray-400 text-xs capitalize">{o.serviceType}</p>
                    </td>
                    <td className="px-5 py-3 text-xs font-bold text-gray-900">£{o.estimatedTotal?.toFixed(0)}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Enquiries</h3>
          </div>
          {stats.recentEnquiries.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No enquiries yet</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {stats.recentEnquiries.map(e => (
                  <tr key={e._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 text-xs">{e.name}</p>
                      <p className="text-gray-400 text-xs">{e.email}</p>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">{e.eventType}</td>
                    <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-5 py-3 text-xs text-gray-400">{new Date(e.createdAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

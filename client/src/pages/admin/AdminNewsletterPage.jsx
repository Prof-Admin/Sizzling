import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminNewsletterPage() {
  const { authHeader } = useAdminAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [subject, setSubject] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/newsletter/subscribers', { headers: authHeader, params: { status: 'active', limit: 100 } })
      .then(r => { setSubscribers(r.data.data); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    if (!subject.trim() || !contentHtml.trim()) return;
    if (!confirm(`Send this newsletter to ${total} active subscriber(s)?`)) return;
    setSending(true);
    setResult(null);
    try {
      const r = await axios.post('/api/admin/newsletter/send', { subject, contentHtml }, { headers: authHeader });
      setResult({ success: true, message: r.data.message });
      setSubject('');
      setContentHtml('');
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Failed to send.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Newsletter</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {loading ? 'Loading...' : `${total} active subscriber${total !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Compose Newsletter</h2>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. New seasonal menu — Sizzling Sensations"
                  className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Email Content <span className="text-gray-400 font-normal">(HTML supported)</span>
                </label>
                <textarea
                  value={contentHtml}
                  onChange={e => setContentHtml(e.target.value)}
                  rows={12}
                  placeholder={`<h2 style="color:#1a1a1a;">New Menu Items!</h2>\n<p>We've just added exciting new dishes...</p>`}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:border-gray-400 resize-y"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Write plain text or HTML. An unsubscribe link is automatically added to every email.</p>
              </div>

              {result && (
                <div className={`px-4 py-3 rounded-sm text-sm ${result.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {result.message}
                </div>
              )}

              <button
                type="submit"
                disabled={sending || total === 0}
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {sending ? 'Sending...' : `Send to ${total} Subscriber${total !== 1 ? 's' : ''}`}
              </button>
            </form>
          </div>
        </div>

        {/* Subscriber list */}
        <div>
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Active Subscribers</h2>
            {loading ? (
              <p className="text-xs text-gray-400">Loading...</p>
            ) : subscribers.length === 0 ? (
              <p className="text-xs text-gray-400">No subscribers yet.</p>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {subscribers.map(s => (
                  <li key={s._id} className="text-xs text-gray-600 border-b border-gray-50 pb-1.5 last:border-0 truncate">
                    {s.email}
                    <span className="text-gray-300 ml-2">{new Date(s.createdAt).toLocaleDateString('en-GB')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

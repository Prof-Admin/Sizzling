import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EXPLORE = [
  { label: 'Bowl Food', to: '/menu' },
  { label: 'Food Boxes', to: '/food-boxes' },
  { label: 'Grazing Tables', to: '/grazing-tables' },
  { label: 'Events', to: '/events' },
  { label: 'FAQ', to: '/faq' },
];

const COMPANY = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
];

const LEGAL = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Refund Policy', to: '/refund-policy' },
];


function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const r = await axios.post('/api/newsletter/subscribe', { email });
      setStatus('success');
      setMsg(r.data.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-2">Newsletter</h3>
      {status === 'success' ? (
        <p className="text-xs text-white/80">{msg}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-white/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-primary text-xs font-bold px-3 py-2 rounded-sm hover:bg-white/90 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? '...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && <p className="text-xs text-red-300 mt-1">{msg}</p>}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-6" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 lg:gap-12 pb-10 border-b border-white/20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" aria-label="Sizzling Sensations Home">
              <img src="/logo-main.png" alt="Sizzling Sensations" className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-xs">
              London's premier choice for authentic and modern African catering. Bringing heritage to every table.
            </p>
            <div className="mt-4">
              <a href="mailto:hello@sizzlingsensations.co.uk" className="text-sm text-white/70 hover:text-white transition-colors">
                hello@sizzlingsensations.co.uk
              </a>
            </div>
            <NewsletterSignup />
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-4">Explore</h3>
            <ul className="space-y-2.5">
              {EXPLORE.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-white/80 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-white/80 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Newsletter */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-4">Legal</h3>
            <ul className="space-y-2.5 mb-6">
              {LEGAL.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-white/80 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-3">Contact</h3>
            <address className="not-italic space-y-1">
              <a href="mailto:hello@sizzlingsensation.co.uk" className="text-sm text-white/70 hover:text-white transition-colors block">
                hello@sizzlingsensation.co.uk
              </a>
            </address>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Sizzling Sensations. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            London's Premier African Catering
          </p>
        </div>
      </div>
    </footer>
  );
}

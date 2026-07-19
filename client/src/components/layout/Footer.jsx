import { Link } from 'react-router-dom';

const EXPLORE = [
  { label: 'Main Menu', to: '/menu' },
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


export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-12 pb-6" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 lg:gap-12 pb-10 border-b border-dark-700">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" aria-label="Sizzling Sensations Home">
              <img src="/logo-white.png" alt="Sizzling Sensations" className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
              London's premier choice for authentic and modern African catering. Bringing heritage to every table.
            </p>
            <div className="mt-4">
              <a href="mailto:hello@sizzlingsensations.co.uk" className="text-sm text-gray-400 hover:text-white transition-colors">
                hello@sizzlingsensations.co.uk
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Explore</h3>
            <ul className="space-y-2.5">
              {EXPLORE.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Newsletter */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Legal</h3>
            <ul className="space-y-2.5 mb-6">
              {LEGAL.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Contact</h3>
            <address className="not-italic space-y-1">
              <p className="text-sm text-gray-400">Canary Wharf, London, E14</p>
              <a href="tel:+442074640000" className="text-sm text-gray-400 hover:text-white transition-colors block">
                +44 20 7464 0000
              </a>
              <a href="mailto:hello@sizzlingsensation.co.uk" className="text-sm text-gray-400 hover:text-white transition-colors block">
                hello@sizzlingsensation.co.uk
              </a>
            </address>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Sizzling Sensations. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            London's Premier African Catering
          </p>
        </div>
      </div>
    </footer>
  );
}

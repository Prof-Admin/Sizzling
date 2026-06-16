import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Menu', to: '/menu' },
  { label: 'Packages', to: '/packages' },
  { label: 'Events', to: '/events' },
  { label: 'About', to: '/about' },
];

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between" aria-hidden="true">
      <span className={`block h-0.5 bg-dark transition-all duration-300 origin-top-left ${open ? 'rotate-45 translate-x-0.5' : ''}`} />
      <span className={`block h-0.5 bg-dark transition-all duration-300 ${open ? 'opacity-0 translate-x-3' : ''}`} />
      <span className={`block h-0.5 bg-dark transition-all duration-300 origin-bottom-left ${open ? '-rotate-45 translate-x-0.5' : ''}`} />
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mobileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="Sizzling Sensations Home">
            <img
              src="/logo-main.png"
              alt="Sizzling Sensations"
              className="h-10 md:h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link text-sm font-medium ${isActive ? 'text-primary after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-primary' : 'text-dark-700 hover:text-primary'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/order-builder" className="p-2 text-dark-600 hover:text-primary transition-colors" aria-label="Cart">
              <CartIcon />
            </Link>
            <Link to="/order-builder" className="btn-primary text-sm px-5 py-2.5">
              Book Now
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/order-builder" className="p-2 text-dark-600" aria-label="Cart">
              <CartIcon />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -mr-2"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-nav"
        ref={mobileRef}
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="bg-white border-t border-gray-100 px-4 pb-6 pt-2" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-3 px-2 text-base font-medium border-b border-gray-50 transition-colors ${
                      isActive ? 'text-primary' : 'text-dark-700 hover:text-primary'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-3">
            <Link to="/order-builder" className="btn-primary w-full justify-center">
              Book Now
            </Link>
            <Link to="/contact" className="btn-outline-dark w-full justify-center">
              Request a Quote
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noindex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-offwhite">
        <div className="text-center max-w-md">
          <p className="text-7xl font-serif font-bold text-primary/20 mb-2">404</p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-dark mb-3">Page Not Found</h1>
          <p className="text-dark-600 text-sm mb-8">
            The page you're looking for doesn't exist. Perhaps you'd like to browse our menu or get in touch?
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary px-7">Back to Home</Link>
            <Link to="/menu" className="btn-outline-dark px-7">View Menu</Link>
          </div>
        </div>
      </div>
    </>
  );
}

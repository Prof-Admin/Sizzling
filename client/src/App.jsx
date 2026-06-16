import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { MenuConfigProvider, useMenuConfig } from './context/MenuConfigContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PackagesPage from './pages/PackagesPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import PlattersPage from './pages/PlattersPage';
import OrderBuilderPage from './pages/OrderBuilderPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollRestoration() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function ConfiguredOrderProvider({ children }) {
  const { menuSections, fsPackages } = useMenuConfig();
  return (
    <OrderProvider menuSections={menuSections} fsPackages={fsPackages}>
      {children}
    </OrderProvider>
  );
}

function PublicRoutes() {
  return (
    <ConfiguredOrderProvider>
      <ScrollRestoration />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/platters" element={<PlattersPage />} />
          <Route path="/order-builder" element={<OrderBuilderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </ConfiguredOrderProvider>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <MenuConfigProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/*" element={<PublicRoutes />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </MenuConfigProvider>
  );
}

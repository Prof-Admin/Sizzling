import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const stored = JSON.parse(localStorage.getItem('ss_admin') || 'null');
  const [token, setToken] = useState(stored?.token || null);
  const [admin, setAdmin] = useState(stored?.admin || null);

  async function login(email, password) {
    const res = await axios.post('/api/admin/auth/login', { email, password });
    const { token: t, admin: a } = res.data;
    setToken(t);
    setAdmin(a);
    localStorage.setItem('ss_admin', JSON.stringify({ token: t, admin: a }));
    return res.data;
  }

  function logout() {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('ss_admin');
  }

  return (
    <AdminAuthContext.Provider value={{
      token,
      admin,
      login,
      logout,
      isAuthenticated: !!token,
      authHeader: token ? { Authorization: `Bearer ${token}` } : {},
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

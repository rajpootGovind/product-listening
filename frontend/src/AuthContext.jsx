import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app opens, check if the saved token is still valid
  useEffect(() => {
    if (!localStorage.getItem('token')) return setLoading(false);
    api('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const save = (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };
  const login = async (email, password) => save(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (body) => save(await api('/auth/register', { method: 'POST', body }));
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  const refresh = () => api('/auth/me').then(setUser);

  return <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</Ctx.Provider>;
}

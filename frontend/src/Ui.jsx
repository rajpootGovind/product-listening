import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import I3 from './components/Icons3D';

// ---- Toasts, cart/wishlist and the login popup state live here ----
const Ctx = createContext();
export const useUi = () => useContext(Ctx);
export const useToastCtx = () => useUi().toast;
const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };

export function UiProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [auth, setAuth] = useState(null); // null | 'login' | 'register'
  const [cart, setCart] = useState(() => load('gs_cart'));
  const [wish, setWish] = useState(() => load('gs_wish'));
  useEffect(() => localStorage.setItem('gs_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('gs_wish', JSON.stringify(wish)), [wish]);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  const toast = useCallback((text, type = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, text, type: type === 'bad' ? 'error' : type }]);
    setTimeout(() => dismiss(id), 3500);
  }, []);
  const addToCart = (p) => { setCart((c) => [...c, p._id]); toast(`${p.title} added to cart`); };
  const toggleWish = (p) => {
    const on = wish.includes(p._id);
    setWish(on ? wish.filter((i) => i !== p._id) : [...wish, p._id]);
    toast(on ? 'Removed from wishlist' : 'Saved to wishlist', on ? 'info' : 'ok');
  };
  const icon = { ok: 'check', error: 'alert', info: 'heart' };

  return (
    <Ctx.Provider value={{ toast, auth, openAuth: setAuth, closeAuth: () => setAuth(null), cart, wish, addToCart, toggleWish }}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} role="status">
            <span className="t-ic"><I3 n={icon[t.type]} s={18} flat /></span>
            <span className="t-tx">{t.text}</span>
            <button aria-label="Dismiss" onClick={() => dismiss(t.id)}><I3 n="close" s={16} flat /></button>
            <i className="t-bar" />
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

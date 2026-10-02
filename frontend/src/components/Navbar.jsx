import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useUi } from '../Ui';
import I3 from './Icons3D';

export const Logo = ({ s = 36 }) => (
  <span className="brand"><I3 n="bag" s={s} /><b>Go<em>shop</em></b></span>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { openAuth, toast, cart, wish } = useUi();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [menu, setMenu] = useState(false);
  const [stuck, setStuck] = useState(false);
  const box = useRef();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    const onClick = (e) => box.current && !box.current.contains(e.target) && setMenu(false);
    window.addEventListener('scroll', onScroll); document.addEventListener('click', onClick);
    return () => { window.removeEventListener('scroll', onScroll); document.removeEventListener('click', onClick); };
  }, []);

  const search = (e) => { e.preventDefault(); navigate(q.trim() ? `/?q=${encodeURIComponent(q.trim())}#products` : '/#products'); };
  const out = () => { logout(); setMenu(false); navigate('/'); toast('You have been logged out', 'info'); };

  return (
    <header className={`nav ${stuck ? 'stuck' : ''}`}>
      <div className="nav-in">
        <Link to="/" aria-label="Go shop home"><Logo /></Link>
        <form className="nav-search" onSubmit={search} role="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for products, brands and shops" aria-label="Search" />
          {q && <button type="button" className="clr" aria-label="Clear" onClick={() => { setQ(''); setParams({}); }}><I3 n="close" s={16} flat /></button>}
          <button className="go" aria-label="Search"><I3 n="search" s={20} flat /></button>
        </form>
        <nav className="nav-r">
          {user?.role === 'vendor' && <NavLink to="/vendor" className="nl">Seller hub</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className="nl">Admin</NavLink>}
          {!user && <button className="nl seller" onClick={() => openAuth('register')}><I3 n="store" s={26} />Become a Seller</button>}
          <div className="acct" ref={box}>
            {user ? (
              <button className="avatar" onClick={() => setMenu(!menu)} aria-expanded={menu}><span>{user.name[0]}</span><b>{user.name.split(' ')[0]}</b><I3 n="chevron" s={14} flat /></button>
            ) : (
              <button className="btn login" onClick={() => openAuth('login')}>Login</button>
            )}
            {menu && (
              <div className="drop">
                <div className="drop-h"><strong>{user.name}</strong><small>{user.email}</small></div>
                <Link to={user.role === 'admin' ? '/admin' : '/vendor'} onClick={() => setMenu(false)}><I3 n="dash" s={18} flat />{user.role === 'admin' ? 'Admin dashboard' : 'Seller dashboard'}</Link>
                <button onClick={out}><I3 n="logout" s={18} flat />Log out</button>
              </div>
            )}
          </div>
          <button className="ibtn" aria-label="Wishlist" onClick={() => toast(`${wish.length} item(s) in your wishlist`, 'info')}><I3 n="heart" s={34} />{wish.length > 0 && <i>{wish.length}</i>}</button>
          <button className="ibtn" aria-label="Cart" onClick={() => toast(cart.length ? `${cart.length} item(s) in your cart` : 'Your cart is empty', 'info')}><I3 n="cart" s={34} />{cart.length > 0 && <i>{cart.length}</i>}</button>
        </nav>
      </div>
    </header>
  );
}

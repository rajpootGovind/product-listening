import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="nav">
      <Link to="/" className="brand">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <rect x="2" y="15" width="24" height="8" rx="3" fill="#FFB627" />
          <rect x="5" y="8.5" width="18" height="8" rx="3" fill="#FF6B57" />
          <rect x="8" y="2" width="12" height="8" rx="3" fill="#E9F3EF" />
        </svg>
        Man Stack
      </Link>
      <nav>
        <NavLink to="/" end>Shop</NavLink>
        {user?.role === 'vendor' && <NavLink to="/vendor">My dashboard</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin">Admin dashboard</NavLink>}
        {user ? (
          <button className="btn ghost sm" onClick={() => { logout(); navigate('/'); }}>Log out</button>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <Link to="/register" className="btn sm">Sell with us</Link>
          </>
        )}
      </nav>
    </header>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// One page for both Log in and Sign up. The "mode" prop decides which one.
export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', shopName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = isLogin ? await login(form.email, form.password) : await register(form);
      navigate(user.role === 'admin' ? '/admin' : '/vendor');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <form className="panel" onSubmit={submit}>
        <h2>{isLogin ? 'Welcome back' : 'Open your shop'}</h2>
        <p className="muted">{isLogin ? 'Log in to manage your dashboard.' : 'Create a vendor account. Our team will approve your shop.'}</p>

        {!isLogin && (
          <>
            <label>Your name<input required value={form.name} onChange={set('name')} /></label>
            <label>Shop name<input required value={form.shopName} onChange={set('shopName')} /></label>
          </>
        )}
        <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
        <label>Password<input type="password" required minLength={6} value={form.password} onChange={set('password')} /></label>

        {error && <p className="error">{error}</p>}
        <button className="btn block" disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}</button>

        <p className="muted small">
          {isLogin ? <>New vendor? <Link to="/register">Create an account</Link></> : <>Already have an account? <Link to="/login">Log in</Link></>}
        </p>
      </form>
    </main>
  );
}

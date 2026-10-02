import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useUi } from '../Ui';
import I3 from './Icons3D';
import { Logo } from './Navbar';

const blank = { name: '', shopName: '', email: '', password: '' };
const rules = {
  name: (v) => (!v.trim() ? 'Please enter your full name' : v.trim().length < 2 ? 'Name must be at least 2 characters' : ''),
  shopName: (v) => (!v.trim() ? 'Please enter your shop name' : ''),
  email: (v) => (!v.trim() ? 'Please enter your email address' : !/^\S+@\S+\.\S+$/.test(v) ? 'Enter a valid email, like name@example.com' : ''),
  password: (v, reg) => (!v ? 'Please enter your password' : reg && v.length < 6 ? 'Password must be at least 6 characters' : ''),
};

export default function AuthModal() {
  const { auth, closeAuth, openAuth, toast } = useUi();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [errs, setErrs] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const isLogin = auth === 'login';

  useEffect(() => { setForm(blank); setErrs({}); setShow(false); }, [auth]);
  useEffect(() => {
    if (!auth) return;
    const esc = (e) => e.key === 'Escape' && closeAuth();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [auth]);
  if (!auth) return null;

  const fields = isLogin ? ['email', 'password'] : ['name', 'shopName', 'email', 'password'];
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrs({ ...errs, [k]: '' }); };
  const strength = [/.{6,}/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(form.password)).length;

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    fields.forEach((k) => { const m = rules[k](form[k], !isLogin); if (m) found[k] = m; });
    setErrs(found);
    if (Object.keys(found).length) return toast(Object.values(found)[0], 'bad');
    setBusy(true);
    try {
      const user = isLogin ? await login(form.email, form.password) : await register(form);
      toast(isLogin ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Account created! Our team will approve your shop soon.');
      closeAuth();
      navigate(user.role === 'admin' ? '/admin' : '/vendor');
    } catch (err) {
      if (err.field) setErrs({ [err.field]: err.message });
      toast(err.message, 'bad');
    } finally { setBusy(false); }
  };

  const labels = { name: 'Full name', shopName: 'Shop name', email: 'Email address', password: 'Password' };
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && closeAuth()}>
      <div className="auth" role="dialog" aria-modal="true" aria-label={isLogin ? 'Log in' : 'Sign up'}>
        <aside className="auth-side">
          <Logo s={40} />
          <h3>{isLogin ? 'Welcome back!' : 'Sell on Go shop'}</h3>
          <p>{isLogin ? 'Log in to manage your products and orders.' : 'Reach thousands of shoppers with your own storefront.'}</p>
          <ul>
            <li><I3 n="bolt" s={30} />Quick, easy onboarding</li>
            <li><I3 n="shield" s={30} />Trusted, verified sellers</li>
            <li><I3 n="tag" s={30} />Zero listing fees</li>
          </ul>
        </aside>
        <form className="auth-form" onSubmit={submit} noValidate>
          <button type="button" className="x" aria-label="Close" onClick={closeAuth}><I3 n="close" s={20} flat /></button>
          <h2>{isLogin ? 'Log in' : 'Create your seller account'}</h2>
          {fields.map((k) => (
            <label key={k} className={errs[k] ? 'bad' : ''}>{labels[k]}
              <span className="inp">
                <input type={k === 'password' && !show ? 'password' : k === 'email' ? 'email' : 'text'} value={form[k]} onChange={set(k)}
                  autoFocus={k === fields[0]} autoComplete={k === 'password' ? (isLogin ? 'current-password' : 'new-password') : k} aria-invalid={!!errs[k]} />
                {k === 'password' && <button type="button" aria-label="Show password" onClick={() => setShow(!show)}><I3 n="eye" s={18} flat /></button>}
              </span>
              {errs[k] && <small className="err"><I3 n="alert" s={14} flat />{errs[k]}</small>}
              {k === 'password' && !isLogin && form.password && <span className={`meter s${strength}`}><i /><i /><i /><i /></span>}
            </label>
          ))}
          <button className="btn block" disabled={busy}>{busy ? <span className="spin sm" /> : isLogin ? 'Log in' : 'Create account'}</button>
          <p className="switch">{isLogin ? 'New to Go shop?' : 'Already have an account?'} <button type="button" onClick={() => openAuth(isLogin ? 'register' : 'login')}>{isLogin ? 'Create an account' : 'Log in'}</button></p>
        </form>
      </div>
    </div>
  );
}

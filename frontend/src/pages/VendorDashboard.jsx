import { useEffect, useState } from 'react';
import { api, money } from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../components/Toast';
import Stat from '../components/Stat';
import Img from '../components/Img';

const empty = { title: '', description: '', price: '', category: '', image: '', stock: '' };

export default function VendorDashboard() {
  const { user, refresh } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null); // null = adding a new product
  const [open, setOpen] = useState(false);
  const [toast, show] = useToast();
  const approved = user.status === 'approved';

  const load = () => api('/products/mine').then(setProducts).catch((e) => show(e.message, 'bad'));

  useEffect(() => {
    refresh(); // get the latest approval status
    load();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const openForm = (p) => {
    setEditId(p?._id || null);
    setForm(p ? { ...p } : empty);
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock || 0) };
      await api(editId ? `/products/${editId}` : '/products', { method: editId ? 'PUT' : 'POST', body });
      show(editId ? 'Product updated' : 'Product added');
      setOpen(false);
      load();
    } catch (err) {
      show(err.message, 'bad');
    }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await api(`/products/${p._id}`, { method: 'DELETE' });
    show('Product deleted');
    load();
  };

  const live = products.filter((p) => p.isActive).length;
  const units = products.reduce((sum, p) => sum + p.stock, 0);
  const value = products.reduce((sum, p) => sum + p.stock * p.price, 0);

  return (
    <main className="wrap dash">
      <div className="dash-head">
        <div>
          <h2>{user.shopName}</h2>
          <p className="muted">Manage everything you sell from here.</p>
        </div>
        <button className="btn" disabled={!approved} onClick={() => openForm()}>Add product</button>
      </div>

      {!approved && (
        <div className="notice">
          {user.status === 'pending' ? 'Your shop is waiting for admin approval. You can add products once it is approved.' : 'Your shop is blocked. Please contact the admin.'}
        </div>
      )}

      <div className="stats">
        <Stat label="Products" value={products.length} />
        <Stat label="Live in shop" value={live} tone="gold" />
        <Stat label="Units in stock" value={units} />
        <Stat label="Stock value" value={money(value)} tone="coral" />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><div className="cell"><Img className="thumb" src={p.image} alt={p.title} /><b>{p.title}</b></div></td>
                <td>{p.category}</td>
                <td>{money(p.price)}</td>
                <td>{p.stock}</td>
                <td><span className={`badge ${p.isActive ? 'approved' : 'blocked'}`}>{p.isActive ? 'Live' : 'Hidden by admin'}</span></td>
                <td className="actions">
                  <button className="btn ghost sm" onClick={() => openForm(p)}>Edit</button>
                  <button className="btn danger sm" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="empty">You have no products yet. Click “Add product” to list your first one.</p>}
      </div>

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editId ? 'Edit product' : 'Add product'}</h3>
            <label>Title<input required value={form.title} onChange={set('title')} /></label>
            <div className="two">
              <label>Price (₹)<input type="number" min="0" required value={form.price} onChange={set('price')} /></label>
              <label>Stock<input type="number" min="0" value={form.stock} onChange={set('stock')} /></label>
            </div>
            <label>Category<input placeholder="Fashion, Kitchen…" value={form.category} onChange={set('category')} /></label>
            <label>Image link<input placeholder="https://…" value={form.image} onChange={set('image')} /></label>
            <label>Description<textarea rows="3" value={form.description} onChange={set('description')} /></label>
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn">{editId ? 'Save changes' : 'Add product'}</button>
            </div>
          </form>
        </div>
      )}
      {toast}
    </main>
  );
}

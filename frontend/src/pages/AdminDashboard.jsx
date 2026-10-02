import { useEffect, useState } from 'react';
import { api, money } from '../api';
import { useToast } from '../components/Toast';
import Stat from '../components/Stat';
import Img from '../components/Img';

export default function AdminDashboard() {
  const [tab, setTab] = useState('vendors');
  const [stats, setStats] = useState({});
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [toast, show] = useToast();

  // Load everything again after every change
  const load = async () => {
    try {
      const [s, v, p] = await Promise.all([api('/admin/stats'), api('/admin/vendors'), api('/admin/products')]);
      setStats(s);
      setVendors(v);
      setProducts(p);
    } catch (e) {
      show(e.message, 'bad');
    }
  };
  useEffect(() => { load(); }, []);

  // Small helper: call API, show a message, reload data
  const run = async (path, method, body, message) => {
    try {
      await api(path, { method, body });
      show(message);
      load();
    } catch (e) {
      show(e.message, 'bad');
    }
  };

  const setStatus = (v, status) => run(`/admin/vendors/${v._id}/status`, 'PATCH', { status }, `${v.shopName} is now ${status}`);
  const removeVendor = (v) => confirm(`Delete ${v.shopName} and all its products?`) && run(`/admin/vendors/${v._id}`, 'DELETE', null, 'Vendor deleted');
  const toggle = (p) => run(`/admin/products/${p._id}/toggle`, 'PATCH', null, p.isActive ? 'Product hidden' : 'Product is live again');
  const removeProduct = (p) => confirm(`Delete "${p.title}"?`) && run(`/admin/products/${p._id}`, 'DELETE', null, 'Product deleted');

  return (
    <main className="wrap dash">
      <div className="dash-head">
        <div>
          <h2>Admin dashboard</h2>
          <p className="muted">Approve vendors and keep the shop clean.</p>
        </div>
      </div>

      <div className="stats">
        <Stat label="Vendors" value={stats.vendors ?? '–'} />
        <Stat label="Waiting for approval" value={stats.pending ?? '–'} tone="gold" />
        <Stat label="Products" value={stats.products ?? '–'} />
        <Stat label="Live products" value={stats.active ?? '–'} tone="coral" />
      </div>

      <div className="tabs">
        <button className={`pill ${tab === 'vendors' ? 'on' : ''}`} onClick={() => setTab('vendors')}>
          Vendors {stats.pending > 0 && <i className="dot">{stats.pending}</i>}
        </button>
        <button className={`pill ${tab === 'products' ? 'on' : ''}`} onClick={() => setTab('products')}>All products</button>
      </div>

      <div className="table-wrap">
        {tab === 'vendors' ? (
          <table>
            <thead><tr><th>Shop</th><th>Owner</th><th>Email</th><th>Products</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id}>
                  <td><b>{v.shopName}</b></td>
                  <td>{v.name}</td>
                  <td>{v.email}</td>
                  <td>{v.productCount}</td>
                  <td><span className={`badge ${v.status}`}>{v.status}</span></td>
                  <td className="actions">
                    {v.status !== 'approved' && <button className="btn sm" onClick={() => setStatus(v, 'approved')}>Approve</button>}
                    {v.status !== 'blocked' && <button className="btn ghost sm" onClick={() => setStatus(v, 'blocked')}>Block</button>}
                    <button className="btn danger sm" onClick={() => removeVendor(v)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead><tr><th>Product</th><th>Shop</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><div className="cell"><Img className="thumb" src={p.image} alt={p.title} /><b>{p.title}</b></div></td>
                  <td>{p.vendor?.shopName}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td><span className={`badge ${p.isActive ? 'approved' : 'blocked'}`}>{p.isActive ? 'Live' : 'Hidden'}</span></td>
                  <td className="actions">
                    <button className="btn ghost sm" onClick={() => toggle(p)}>{p.isActive ? 'Hide' : 'Show'}</button>
                    <button className="btn danger sm" onClick={() => removeProduct(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'vendors' && vendors.length === 0 && <p className="empty">No vendors have signed up yet.</p>}
        {tab === 'products' && products.length === 0 && <p className="empty">No products have been added yet.</p>}
      </div>
      {toast}
    </main>
  );
}

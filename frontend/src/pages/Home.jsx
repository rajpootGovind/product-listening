import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import Img from '../components/Img';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api('/products').then(setProducts).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const shown = products.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      (p.title + p.description + (p.vendor?.shopName || '')).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <h1>Good things, made by people you can trust.</h1>
          <p>Browse products from independent vendors. Every shop is checked and approved by our team.</p>
          <input className="search" placeholder="Search products or shops" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="hero-links">
            <span>{products.length} products live</span>
            <Link to="/register">Open your shop</Link>
          </div>
        </div>
        <div className="stack" aria-hidden="true">
          {products.slice(0, 3).map((p, i) => (
            <div key={p._id} className={`stack-card s${i}`}>
              <Img src={p.image} alt={p.title} />
            </div>
          ))}
        </div>
      </section>

      <section className="wrap">
        <div className="chips">
          {categories.map((c) => (
            <button key={c} className={`pill ${c === category ? 'on' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {loading ? (
          <p className="center">Loading products…</p>
        ) : shown.length === 0 ? (
          <p className="empty">No products match your search. Try a different word or category.</p>
        ) : (
          <div className="grid">{shown.map((p) => <ProductCard key={p._id} p={p} />)}</div>
        )}
      </section>
    </main>
  );
}

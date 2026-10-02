import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useUi } from '../Ui';
import ProductCard from '../components/ProductCard';
import I3, { catIcon } from '../components/Icons3D';

const perks = [['truck', 'Free delivery', 'On orders above ₹499'], ['return', 'Easy returns', '7-day hassle-free'], ['shield', 'Secure & trusted', 'Verified sellers only'], ['headset', '24×7 support', "We're always here"]];

export default function Home() {
  const { openAuth, toast } = useUi();
  const [params] = useSearchParams();
  const search = params.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    api('/products').then(setProducts).catch((e) => toast(e.message, 'bad')).finally(() => setLoading(false));
  }, []);

  const cats = ['All', ...new Set(products.map((p) => p.category))];
  const shown = products
    .filter((p) => (category === 'All' || p.category === category) && (p.title + p.description + p.category + (p.vendor?.shopName || '')).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0));

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <div className="hero-text">
            <span className="tagline"><I3 n="bolt" s={22} />Big savings, every day</span>
            <h1>Shop smart with <span>Go shop</span></h1>
            <p>Discover handpicked products from verified sellers across India — delivered fast, priced right.</p>
            <div className="hero-cta">
              <a className="btn" href="#products">Shop now</a>
              <button className="btn ghost-w" onClick={() => openAuth('register')}>Start selling</button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <I3 n="bag" s={150} className="f1" /><I3 n="gift" s={84} className="f2" /><I3 n="tag" s={72} className="f3" /><I3 n="heart" s={60} className="f4" />
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="perks">
          {perks.map(([i, t, d]) => <div key={t}><I3 n={i} s={46} /><span><b>{t}</b><small>{d}</small></span></div>)}
        </section>

        <section className="cats" aria-label="Categories">
          {cats.map((c) => (
            <button key={c} className={c === category ? 'on' : ''} onClick={() => setCategory(c)}>
              <I3 n={c === 'All' ? 'bag' : catIcon(c)} s={52} /><span>{c}</span>
            </button>
          ))}
        </section>

        <section id="products">
          <div className="sec-h">
            <h2>{search ? `Results for “${search}”` : category === 'All' ? 'Trending products' : category} <small>{shown.length} items</small></h2>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="new">Newest first</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option>
            </select>
          </div>
          {loading ? (
            <div className="grid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="card sk"><div className="card-img" /><div className="card-body"><i /><i /><i /></div></div>)}</div>
          ) : shown.length === 0 ? (
            <div className="empty"><I3 n="search" s={56} /><h3>No products found</h3><p>Try a different keyword or category.</p></div>
          ) : (
            <div className="grid">{shown.map((p, i) => <ProductCard key={p._id} p={p} i={i} />)}</div>
          )}
        </section>
      </div>
    </main>
  );
}

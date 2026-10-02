import Img from './Img';
import I3 from './Icons3D';
import { money } from '../api';
import { useUi } from '../Ui';

export default function ProductCard({ p, i = 0 }) {
  const { wish, toggleWish, addToCart } = useUi();
  const liked = wish.includes(p._id);
  const out = p.stock <= 0;
  return (
    <article className="card" style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}>
      <div className="card-img">
        <Img src={p.image} alt={p.title} />
        <button className={`heart ${liked ? 'on' : ''}`} aria-label="Wishlist" onClick={() => toggleWish(p)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" /></svg>
        </button>
        {out && <div className="sold">Sold out</div>}
        {!out && p.stock <= 10 && <span className="low">Only {p.stock} left</span>}
      </div>
      <div className="card-body">
        <span className="chip">{p.category}</span>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <div className="seller"><I3 n="store" s={20} />{p.vendor?.shopName}</div>
        <div className="card-foot">
          <b className="price">{money(p.price)}</b>
          <button className="btn sm" disabled={out} onClick={() => addToCart(p)}><I3 n="cart" s={16} flat />Add</button>
        </div>
      </div>
    </article>
  );
}

import Img from './Img';
import { money } from '../api';

export default function ProductCard({ p }) {
  return (
    <article className="card">
      <div className="card-img">
        <Img src={p.image} alt={p.title} />
        <b className="price">{money(p.price)}</b>
      </div>
      <div className="card-body">
        <span className="chip">{p.category}</span>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <div className="card-foot">
          <span>{p.vendor?.shopName}</span>
          <span className={p.stock > 0 ? 'ok' : 'out'}>{p.stock > 0 ? `${p.stock} in stock` : 'Sold out'}</span>
        </div>
      </div>
    </article>
  );
}

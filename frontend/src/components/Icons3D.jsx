// Glossy 3D-style icons, pure SVG (no image files). <I3 n="bag" s={48} /> ; add flat for a plain line icon.
const G = {
  bag: ['#b4a2ff', '#6c4cf1', 'M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2'],
  truck: ['#b4a2ff', '#6c4cf1', 'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 18.5h.01M17 18.5h.01'],
  shield: ['#6ee7a8', '#12a05c', 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4'],
  return: ['#ffc46b', '#fb641b', 'M4 12a8 8 0 0114-5M20 4v4h-4M20 12a8 8 0 01-14 5M4 20v-4h4'],
  tag: ['#ff8fae', '#ff3f6c', 'M3 12V4h8l10 10-8 8zM7.5 8.5h.01'],
  gift: ['#ff8fae', '#e0245e', 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-4 0M12 7c2-4 6-3 4 0'],
  heart: ['#ff8fae', '#ff3f6c', 'M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z'],
  cart: ['#ffc46b', '#fb641b', 'M3 4h3l2 11h10l2-8H7M9 20h.01M17 20h.01'],
  home: ['#ffd86b', '#f5a300', 'M4 11l8-7 8 7v9H4zM10 20v-6h4v6'],
  shirt: ['#c4a6ff', '#7c4dff', 'M8 4L3 8l3 3 2-1v10h8V10l2 1 3-3-5-4a4 4 0 01-8 0'],
  book: ['#6ee7d8', '#0e9f8e', 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11'],
  mug: ['#ff9d7a', '#e8542a', 'M5 8h11v8a4 4 0 01-4 4H9a4 4 0 01-4-4zM16 10h2a2 2 0 010 5h-2'],
  box: ['#a9b8d0', '#5b6b88', 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8'],
  phone: ['#7fdcff', '#2a8be0', 'M7 3h10v18H7zM11 18h2'],
  bolt: ['#ffe97a', '#f5b800', 'M13 2L4 14h7l-1 8 9-12h-7z'],
  store: ['#b4a2ff', '#6c4cf1', 'M4 9l1-5h14l1 5M4 9a3 3 0 006 0 3 3 0 006 0 3 3 0 004 0M5 12v8h14v-8'],
  user: ['#b4a2ff', '#6c4cf1', 'M12 12a4 4 0 100-8 4 4 0 000 8M4 21a8 8 0 0116 0'],
  headset: ['#6ee7a8', '#12a05c', 'M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3z'],
  search: [0, 0, 'M11 18a7 7 0 100-14 7 7 0 000 14M21 21l-5-5'],
  close: [0, 0, 'M6 6l12 12M18 6L6 18'],
  eye: [0, 0, 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6'],
  check: [0, 0, 'M5 12l5 5 9-10'],
  alert: [0, 0, 'M12 8v5M12 17h.01M12 3l10 18H2z'],
  chevron: [0, 0, 'M6 9l6 6 6-6'],
  logout: [0, 0, 'M9 4H5v16h4M16 8l4 4-4 4M20 12H9'],
  dash: [0, 0, 'M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z'],
};
export const catIcon = (c = '') =>
  /fashion|cloth|wear|kurta|shoe/i.test(c) ? 'shirt' : /home|decor|furnit|lamp/i.test(c) ? 'home' : /station|book|art/i.test(c) ? 'book' :
  /kitchen|food|mug|dining/i.test(c) ? 'mug' : /phone|electr|gadget|mobile/i.test(c) ? 'phone' : /offer|deal|gift/i.test(c) ? 'gift' : 'box';

export default function I3({ n, s = 44, flat, className = '' }) {
  const [c1, c2, d] = G[n] || G.box;
  const id = `g${n}${s}`;
  if (flat || !c1)
    return <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
  return (
    <svg className={`i3 ${className}`} width={s} height={s} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".65" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="44" rx="14" ry="2.6" fill="#0f1a33" opacity=".18" />
      <rect x="4" y="4" width="40" height="38" rx="13" fill={c2} opacity=".55" transform="translate(0 2.5)" />
      <rect x="4" y="3" width="40" height="38" rx="13" fill={`url(#${id})`} />
      <rect x="6.5" y="4.5" width="35" height="17" rx="10" fill={`url(#${id}h)`} />
      <g transform="translate(11 10) scale(1.1)" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} stroke="#0003" transform="translate(0 .8)" /><path d={d} />
      </g>
    </svg>
  );
}

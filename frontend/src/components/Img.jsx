import { useState } from 'react';

// Shows the image. If the link is empty or broken, shows the first letter instead.
export default function Img({ src, alt, className = '' }) {
  const [bad, setBad] = useState(false);
  return src && !bad ? (
    <img className={className} src={src} alt={alt} loading="lazy" onError={() => setBad(true)} />
  ) : (
    <span className={`img-fallback ${className}`}>{(alt || '?')[0]}</span>
  );
}

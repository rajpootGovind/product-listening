import { useState } from 'react';

// const [toast, show] = useToast();  ->  show('Saved') and put {toast} in your page
export function useToast() {
  const [t, setT] = useState(null);
  const show = (text, type = 'ok') => {
    setT({ text, type });
    setTimeout(() => setT(null), 2800);
  };
  return [t && <div className={`toast ${t.type}`} role="status">{t.text}</div>, show];
}

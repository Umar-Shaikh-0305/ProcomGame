import { useEffect } from 'react';
import { GAME } from './config.js';
export const Logo = ({ s = 64 }) => (
  <svg viewBox="-50 -50 100 100" width={s} height={s} aria-hidden="true">
    {[...Array(8)].map((_, i) => {
      const p = (t) => [(48 * Math.sin(t)).toFixed(1), (-48 * Math.cos(t)).toFixed(1)];
      const [a, b] = p((i * Math.PI) / 4), [c, d] = p(((i + 1) * Math.PI) / 4);
      return <path key={i} d={`M0 0L${a} ${b}A48 48 0 0 1 ${c} ${d}Z`} fill={i % 2 ? '#e6e6e6' : '#c8102e'} stroke="#050505" strokeWidth="2" />;
    })}
  </svg>
);
export const Brand = () => (
  <div className="brand"><Logo s={44} /><div><small>UMBRELLA CORPORATION</small><h1>{GAME}</h1></div></div>
);
export function Modal({ title, onClose, children }) {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [onClose]);
  return (
    <div className="modal" onClick={onClose}>
      <div className="panel box" onClick={(e) => e.stopPropagation()}>
        <div className="mh"><h2>{title}</h2><button className="btn ghost" onClick={onClose}>CLOSE</button></div>
        {children}
      </div>
    </div>
  );
}

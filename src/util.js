import { useState, useEffect, useCallback } from 'react';
import { CARDS, LAYOUT } from './config.js';
const K = 'code21-state';
const load = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch { return {}; } };
export function useStore() {
  const [s, set] = useState(load);
  const up = useCallback((p) => set((o) => {
    const n = { ...o, ...(typeof p === 'function' ? p(o) : p) };
    try { localStorage.setItem(K, JSON.stringify(n)); } catch { /* ignore */ }
    return n;
  }), []);
  return [s, up];
}
export const useNow = (ms = 250) => {
  const [n, set] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => set(Date.now()), ms); return () => clearInterval(i); }, [ms]);
  return n;
};
const p2 = (n) => String(n).padStart(2, '0');
export const fmt = (ms, hours = true) => {
  const t = Math.ceil(Math.max(0, ms) / 1000), s = t % 60;
  return hours ? `${p2(Math.floor(t / 3600))}:${p2(Math.floor((t % 3600) / 60))}:${p2(s)}` : `${p2(Math.floor(t / 60))}:${p2(s)}`;
};
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
// pick an unseen card of a tier (tier 0 = any tier); recycle only when the pool runs out
export const draw = (tier, seen, onBoard) => {
  const fit = CARDS.filter((c) => (!tier || c.tier === tier) && !onBoard.includes(c.id));
  const fresh = fit.filter((c) => !seen.includes(c.id));
  const from = fresh.length ? fresh : fit;
  return from[Math.floor(Math.random() * from.length)];
};
export const deal = () => {
  const slots = [], seen = [];
  LAYOUT.forEach((tier) => { const c = draw(tier, seen, slots.map((x) => x.id)); slots.push({ id: c.id, gold: !tier }); seen.push(c.id); });
  return { slots, seen };
};

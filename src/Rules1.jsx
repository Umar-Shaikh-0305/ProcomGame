import { ROUND1_MIN } from './config.js';
import { Brand } from './ui.jsx';
import { deal } from './util.js';

const RULES = [
  ['⏱️ General Rules & Duration', [
    'Duration: 60 minutes total for Round 1.',
    'No Card Limit: Play as many cards as you can within the 60-minute limit.',
    'One Attempt: You get only one attempt per card. A submitted card leaves the board and is replaced by a new card of the same difficulty.',
    'Wallet Carryover: Points earned in your wallet carry over directly into Round 2.']],
  ['🃏 Turn & Play Flow', [
    'Pick a Card: Select any face-down card on your board.',
    'Decision Timer (7 Seconds): Once revealed, you have 7 seconds to decide whether to play the card or pass.',
    'Timeout / Pass: If the 7-second clock runs out without a decision, the card returns to your board and the board reshuffles.',
    'Solving: Once you confirm to Play, the timer stops—there is no time limit to solve the code and submit your answer.',
    'Give Up: Returning/giving up a card incurs a small fixed cost.']],
  ['🏆 Scoring & Penalties', [
    'Points by Difficulty: Point values are based on card difficulty tier, not the value of the variable (x):',
    '★ Easy: +5 points (Penalty for wrong answer: −3 points)',
    '★★ Medium: +10 points (Penalty for wrong answer: −5 points)',
    '★★★ Hard: +20 points (Penalty for wrong answer: −10 points)',
    'Wrong Answer Penalty: An incorrect submission costs half of the card\'s potential value.',
    'Zero Floor: Your team wallet starts at 0 and never drops below 0.']],
  ['🌟 The Golden Card (High-Risk / High-Reward)', [
    'Hidden Tier: One card on each board glows gold with a ? symbol; its difficulty tier is hidden until revealed.',
    'Double Reward: Correctly solving a Golden Card pays 2× points.',
    'Double Penalty: A wrong answer on a Golden Card costs 2× penalty (e.g., −20 points on a hard card).']],
  ['🛡️ Fair Play System', [
    'Unique Question Pools: Questions (100–150 total) are split into 6 equal pools (A through F) with identical difficulty balances.',
    'No Neighbor Sharing: Adjacent teams (front, back, left, right) draw from different pools, ensuring adjacent seats never share identical cards.']],
];

export const RulesBody = () => RULES.map(([h, items]) => (
  <section className="panel" key={h}>
    <h3>{h}</h3>
    <ul>{items.map((t) => {
      const m = t.match(/^(★+)\s*(.*)$/), r = m ? m[2] : t, i = r.indexOf(':');
      return <li key={t} className={m ? 'sub' : ''}>{m && <span className="stars">{m[1]}</span>}{i > 0 ? <><b>{r.slice(0, i)}:</b>{r.slice(i + 1)}</> : r}</li>;
    })}</ul>
  </section>
));

export default function Rules1({ me, setMe, go }) {
  const start = () => {
    if (!me.endAt) setMe({ endAt: Date.now() + ROUND1_MIN * 60000, wallet: 0, ok: 0, bad: 0, ...deal() });
    go('round1');
  };
  return (
    <>
      <header className="top"><Brand /><h2>ROUND 1 · RULES & TERMS</h2></header>
      <main className="rules">
        <RulesBody />
        <div className="btns"><button className="btn ghost" onClick={() => go('rounds')}>BACK</button><button className="btn" onClick={start}>CONTINUE »</button></div>
      </main>
    </>
  );
}

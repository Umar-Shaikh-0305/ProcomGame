import { useState } from 'react';
import { ROUND1_MIN, PTS, TEAMS } from './config.js';
import { useNow, fmt } from './util.js';
import { Brand, Logo, Modal } from './ui.jsx';
import { RulesBody } from './Rules1.jsx';

function RoundCard({ n, tag, ms, red, dot, st, sub, label, off, onClick }) {
  return (
    <section className={'panel rc' + (red ? ' red' : '')}>
      <h2>ROUND {n}</h2>
      <p className="tag">{tag}</p>
      <div className="row">
        <div className={'ring' + (red ? ' r' : '')}><b>{fmt(ms)}</b><small>TIME REMAINING</small></div>
        <div className="stat"><small><i className={'dot ' + dot} /> STATUS</small><strong>{st}</strong><p>{sub}</p></div>
      </div>
      <button className="btn wide" disabled={off} onClick={onClick}>{off ? '🔒 ' : ''}{label}</button>
    </section>
  );
}

export default function Rounds({ s, me, up, go, startAt }) {
  const [modal, setModal] = useState(null), close = () => setModal(null);
  const rows = Object.entries(TEAMS).map(([k, t]) => ({ k, pool: t.pool, w: s.teams?.[k]?.wallet || 0 })).sort((a, b) => b.w - a.w || a.k.localeCompare(b.k));
  const now = useNow(), r1 = startAt - now, r2 = startAt + (ROUND1_MIN + 10) * 60000 - now;
  const run = me.endAt && me.endAt > now, ended = me.endAt && me.endAt <= now;
  const a = ended ? { st: 'ROUND ENDED', sub: `Final wallet: ${me.wallet || 0} pts`, dot: 'off', label: 'ROUND 1 CLOSED', off: true, ms: 0 }
    : run ? { st: 'IN PROGRESS', sub: 'Round timer is running', dot: 'on', label: 'RESUME ROUND 1', ms: me.endAt - now, onClick: () => go('round1') }
    : r1 > 0 ? { st: 'LOCKED', sub: 'Unlocks when timer reaches 0', dot: 'off', label: 'START ROUND 1', off: true, ms: r1 }
    : { st: 'ACCESS GRANTED', sub: 'Round 1 is open', dot: 'on', label: 'START ROUND 1', ms: 0, onClick: () => go('rules1') };
  return (
    <>
      <header className="top">
        <Brand />
        <div className="who"><span>Welcome, {s.user}</span><button className="btn ghost" onClick={() => up({ user: null, screen: 'login' })}>Logout</button></div>
      </header>
      <div className="title"><h2>COMPETITION ROUNDS</h2><p className="sp mute">CHOOSE YOUR MISSION</p></div>
      <main className="rounds">
        <RoundCard n={1} tag="THE OUTBREAK BEGINS" red={!ended} {...a} />
        <RoundCard n={2} tag="THE FINAL CHALLENGE" ms={Math.max(0, r2)} dot="off" st="LOCKED" sub="Complete Round 1 to unlock" label="ROUND 2 LOCKED" off />
      </main>
      <div className="quick">
        <button className="btn ghost" onClick={() => setModal('rules')}>General rules</button>
        <button className="btn ghost" onClick={() => setModal('points')}>Points table</button>
      </div>
      <footer className="foot">
        <Logo s={28} /><span>“SURVIVE. SOLVE. COMPLETE.”</span>
        <button onClick={() => { localStorage.clear(); location.reload(); }}>RESET DEMO</button>
      </footer>
      {modal === 'rules' && <Modal title="GENERAL RULES · ROUND 1" onClose={close}><div className="rules mrules"><RulesBody /></div></Modal>}
      {modal === 'points' && (
        <Modal title="POINTS TABLE" onClose={close}>
          <table className="tbl"><thead><tr><th>Card</th><th>Correct</th><th>Wrong</th></tr></thead><tbody>
            {[1, 2, 3].map((n) => <tr key={n}><td>{'★'.repeat(n)} {['Easy', 'Medium', 'Hard'][n - 1]}</td><td>+{PTS[n][0]}</td><td>−{PTS[n][1]}</td></tr>)}
            <tr><td>Golden Card</td><td>×2</td><td>×2</td></tr>
          </tbody></table>
          <h3 className="sbh">SCOREBOARD</h3>
          <table className="tbl"><thead><tr><th>#</th><th>Team</th><th>Pool</th><th>Points</th></tr></thead><tbody>
            {rows.map((r, i) => <tr key={r.k} className={r.k === s.user ? 'me' : ''}><td>{i + 1}</td><td>{r.k.toUpperCase()}</td><td>{r.pool}</td><td>{r.w}</td></tr>)}
          </tbody></table>
          <p className="mute">Scores come from this device only until a backend is connected.</p>
        </Modal>
      )}
    </>
  );
}

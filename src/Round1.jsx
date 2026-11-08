import { useState, useEffect, useRef } from 'react';
import { GAME, BG, CARDS, TEAMS, PTS, DECIDE_SEC, GIVE_UP_COST } from './config.js';
import { useNow, fmt, shuffle, draw, deal } from './util.js';

const byId = (id) => CARDS.find((c) => c.id === id);

export default function Round1({ s, me, setMe, go }) {
  const now = useNow();
  const left = Math.max(0, me.endAt - now), over = left === 0, danger = !over && left <= 60000;
  const slots = me.slots || [];
  const [pick, setPick] = useState(null), [phase, setPhase] = useState('idle');
  const [dec, setDec] = useState(DECIDE_SEC * 1000), [val, setVal] = useState(''), [msg, setMsg] = useState(null);
  const side = useRef(null);

  const flash = (t, c) => { setMsg({ t, c }); setTimeout(() => setMsg(null), 2600); };
  const back = () => { setPhase('idle'); setPick(null); setVal(''); };
  const pass = (t) => { back(); setMe((p) => ({ slots: shuffle(p.slots || []) })); flash(t, 'warn'); };

  useEffect(() => { if (!me.slots) setMe(deal()); }, []);
  // 7-second decision clock: runs only while deciding, stops on Play
  useEffect(() => {
    if (phase !== 'decide') return;
    const end = Date.now() + DECIDE_SEC * 1000;
    const i = setInterval(() => {
      const l = end - Date.now();
      if (l <= 0) { clearInterval(i); pass('TIME OUT – CARD RETURNED, BOARD RESHUFFLED'); } else setDec(l);
    }, 100);
    return () => clearInterval(i);
  }, [phase]);
  // round over: discard anything typed but not submitted
  useEffect(() => { if (over) back(); }, [over]);
  useEffect(() => { if (phase === 'decide') side.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [phase]);

  const choose = (c, gold) => {
    if (phase !== 'idle' || over) return;
    setPick({ ...c, gold }); setDec(DECIDE_SEC * 1000); setVal(''); setMsg(null); setPhase('decide');
  };
  const [w, l] = pick ? PTS[pick.tier].map((n) => n * (pick.gold ? 2 : 1)) : [0, 0];
  const submit = () => {
    if (over || val.trim() === '') return;
    const ok = Number(val) === pick.ans, d = ok ? w : -l, seen = me.seen || [], ids = slots.map((x) => x.id);
    // the card leaves the board; a fresh card of the same tier (any tier for the Golden slot) takes its place
    const next = slots.map((x) => (x.id !== pick.id ? x : { id: draw(x.gold ? 0 : pick.tier, seen, ids).id, gold: x.gold }));
    setMe({ wallet: Math.max(0, (me.wallet || 0) + d), ok: (me.ok || 0) + (ok ? 1 : 0), bad: (me.bad || 0) + (ok ? 0 : 1), slots: next, seen: [...new Set([...seen, ...next.map((x) => x.id)])] });
    back(); flash(ok ? `MISSION COMPLETED  +${w}` : `WRONG ANSWER  −${l}`, ok ? 'ok' : 'bad');
  };
  const giveUp = () => { setMe((p) => ({ wallet: Math.max(0, (p.wallet || 0) - GIVE_UP_COST) })); pass(`CARD RETURNED  −${GIVE_UP_COST}`); };

  return (
    <>
      <header className="rh">
        <span className="l">ROUND 1</span><span className="c">{GAME}</span>
        <span className={'tm' + (danger ? ' d' : '')}>⏱ {fmt(left, false)}</span>
      </header>
      <div className="strip">
        <span>TEAM {s.user.toUpperCase()} · POOL {TEAMS[s.user]?.pool}</span>
        <span>WALLET <b>{me.wallet || 0}</b> PTS</span>
        <span>CORRECT {me.ok || 0} · WRONG {me.bad || 0}</span>
        {danger && <em>UNSUBMITTED ANSWERS WILL BE LOST</em>}
      </div>
      <main className="game">
        <section className="panel">
          <h3>SPECIMEN BOARD</h3>
          <p className="mute">Pick any face-down card. You have {DECIDE_SEC} seconds to decide whether to solve or reshuffle. A solved or failed card is replaced by a new one of the same tier, with no limit until time runs out.</p>
          <div className="board">
            {slots.map(({ id, gold }) => {
              const c = byId(id), p = PTS[c.tier];
              return (
                <button key={id} className={'card' + (gold ? ' gold' : '') + (pick?.id === id ? ' sel' : '')} disabled={phase !== 'idle' || over} onClick={() => choose(c, gold)}>
                  <span className="n">#{id}</span>
                  {gold ? <span className="q">?</span> : <span className="st">{'★'.repeat(c.tier)}</span>}
                  <span>{gold ? 'GOLDEN CARD' : 'TIER ' + c.tier}</span>
                  <span className="ft">{gold ? '×2 REWARD' : `+${p[0]} / −${p[1]}`}</span>
                </button>
              );
            })}
          </div>
        </section>
        <aside className="panel side" ref={side}>
          {!pick ? (
            <div className="idle"><h3>AWAITING SPECIMEN</h3><p className="mute">Select a card from the board to view its code.</p>{msg && <div className={'flash ' + msg.c}>{msg.t}</div>}</div>
          ) : (
            <>
              <div className="sh">
                <div><small className="mute">TIER {pick.tier}{pick.gold ? ' · GOLDEN ×2' : ''}</small><h2>{pick.n}</h2></div>
                <div className="val"><small className="mute">VALUE</small><b>+{w}</b></div>
              </div>
              {phase === 'decide' ? (
                <div className="clock"><div><span>DECISION CLOCK ACTIVE</span><b>{(dec / 1000).toFixed(1)} s to decide</b></div><div className="bar"><i style={{ width: (dec / (DECIDE_SEC * 10)) + '%' }} /></div></div>
              ) : <div className="clock off">DECISION CLOCK STOPPED · SOLVE AT YOUR PACE (ROUND TIMER RUNNING)</div>}
              <pre>{pick.code}</pre>
              {phase === 'decide' ? (
                <div className="btns"><button className="btn" onClick={() => setPhase('solve')}>ACCEPT & SOLVE</button><button className="btn ghost" onClick={() => pass('CARD RETURNED – BOARD RESHUFFLED')}>PASS / RESHUFFLE</button></div>
              ) : (
                <>
                  <label>Final value of x<input autoFocus inputMode="numeric" value={val} placeholder="Enter value" onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} /></label>
                  <p className="mute">Wrong answer: −{l} pts</p>
                  <div className="btns"><button className="btn" onClick={submit}>SUBMIT</button><button className="btn ghost" onClick={giveUp}>GIVE UP (−{GIVE_UP_COST})</button></div>
                </>
              )}
            </>
          )}
        </aside>
      </main>
      {over && (
        <div className="lock" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.78),rgba(0,0,0,.9)),url(${BG.locked})` }}>
          <h1 className="big small">SYSTEM LOCKED</h1><p className="sp red">TIME EXPIRED</p>
          <p>Final wallet: <b>{me.wallet || 0}</b> pts · Correct {me.ok || 0} · Wrong {me.bad || 0}</p>
          <button className="btn" onClick={() => go('rounds')}>BACK TO ROUNDS</button>
        </div>
      )}
    </>
  );
}

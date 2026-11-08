import { useState } from 'react';
import { Logo } from './ui.jsx';
import { TEAMS } from './config.js';

export default function Login({ up }) {
  const [u, setU] = useState(''), [p, setP] = useState(''), [show, setShow] = useState(false), [st, setSt] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    const name = u.trim().toLowerCase(), t = TEAMS[name];
    if (!t || t.pw !== p) return setSt('bad');
    setSt('ok');
    setTimeout(() => up({ user: name, screen: 'rounds' }), 800);
  };
  const edit = (set) => (e) => { set(e.target.value); setSt(null); };
  return (
    <main className="center">
      <Logo s={96} />
      <p className="sp">UMBRELLA CORPORATION</p>
      <h1 className="big">CODE21</h1>
      <h2 className="sub">THE MANSION</h2>
      <p className="sp red">ONLINE COMPETITION</p>
      <p className="sp mute">DECODE · SOLVE · SURVIVE</p>
      <form className="panel login" onSubmit={submit}>
        <input placeholder="Enter Username" value={u} onChange={edit(setU)} autoComplete="username" />
        <div className="pw">
          <input type={show ? 'text' : 'password'} placeholder="Enter Password" value={p} onChange={edit(setP)} autoComplete="current-password" />
          <button type="button" onClick={() => setShow(!show)}>{show ? 'HIDE' : 'SHOW'}</button>
        </div>
        {st && <div className={'flash ' + st}>{st === 'ok' ? 'ACCESS GRANTED' : 'ACCESS DENIED – INVALID CREDENTIALS'}</div>}
        <button className="btn" disabled={st === 'ok'}>ENTER FACILITY »</button>
        <small className="mute">Demo login: team01 / code21</small>
      </form>
    </main>
  );
}

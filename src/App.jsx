import { useEffect } from 'react';
import { BG, ROUND1_START, START_DELAY_SEC } from './config.js';
import { useStore } from './util.js';
import Login from './Login.jsx';
import Rounds from './Rounds.jsx';
import Rules1 from './Rules1.jsx';
import Round1 from './Round1.jsx';

const SCREENS = { login: Login, rounds: Rounds, rules1: Rules1, round1: Round1 }; // add/remove pages here

export default function App() {
  const [s, up] = useStore();
  const me = (s.teams || {})[s.user] || {};
  const setMe = (p) => up((o) => {
    const cur = (o.teams || {})[o.user] || {};
    return { teams: { ...o.teams, [o.user]: { ...cur, ...(typeof p === 'function' ? p(cur) : p) } } };
  });
  useEffect(() => { if (!s.startAt) up({ startAt: Date.now() + START_DELAY_SEC * 1000 }); }, []);
  const startAt = ROUND1_START ? +new Date(ROUND1_START) : s.startAt || Date.now() + START_DELAY_SEC * 1000;
  let screen = s.user ? s.screen || 'rounds' : 'login';
  if (screen === 'round1' && !me.endAt) screen = 'rules1';
  const Screen = SCREENS[screen] || Login;
  return (
    <>
      <div className="bg" style={{ backgroundImage: `url(${BG[screen] || BG.login})` }} />
      <Screen s={s} me={me} up={up} setMe={setMe} go={(x) => up({ screen: x })} startAt={startAt} />
    </>
  );
}

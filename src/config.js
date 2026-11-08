export const GAME = 'CODE21 – THE MANSION';
export const ROUND1_MIN = 60;       // Round 1 duration (minutes)
export const DECIDE_SEC = 7;        // decision timer per card (seconds)
export const GIVE_UP_COST = 2;      // placeholder until confirmed
export const START_DELAY_SEC = 20;  // demo: Round 1 opens this long after first visit
export const ROUND1_START = null;   // real start, e.g. '2026-12-01T10:00:00'
export const LAYOUT = [1, 1, 2, 2, 2, 3, 3, 0]; // board slots by tier; 0 = Golden Card (hidden tier)
export const PTS = { 1: [5, 3], 2: [10, 5], 3: [20, 10] }; // tier: [reward, penalty]
export const TEAMS = {
  team01: { pw: 'code21', pool: 'A' },
  team02: { pw: 'code21', pool: 'B' },
  team03: { pw: 'code21', pool: 'C' },
};
export const BG = { login: '/bg/login.jpg', rounds: '/bg/rounds.jpg', rules1: '/bg/rules1.jpg', round1: '/bg/round1.jpg', locked: '/bg/locked.jpg' };

// Card codes: n = name, tier 1-3, ans = final value of x, gold = Golden Card
export const CARDS = [
  { id: 1, tier: 1, n: 'ARRAY INDEX', ans: 16, code: `int a[] = {3, 7, 2, 9};\nint x = a[1] + a[3];` },
  { id: 2, tier: 1, n: 'STACK TOP', ans: 6, code: `stack<int> s;\ns.push(4); s.push(6); s.push(1);\ns.pop();\nint x = s.top();` },
  { id: 3, tier: 2, n: 'T-VIRUS BUFFER QUEUE', ans: 18, code: `queue<int> q;\nfor (int i = 1; i <= 5; i++)\n  q.push(i * 2);\nwhile (q.size() > 2)\n  q.pop();\nint x = q.front() + q.back();` },
  { id: 4, tier: 2, n: 'STACK SURGERY', ans: 24, code: `stack<int> s;\nfor (int i = 1; i <= 6; i++) {\n  s.push(i);\n  if (i % 3 == 0) { s.pop(); s.pop(); }\n}\nint x = s.size() * 10 + s.top();` },
  { id: 5, tier: 3, n: 'RECURSION LOOP', ans: 7, code: `int f(int n) {\n  if (n <= 2) return n;\n  return f(n - 1) + f(n - 3);\n}\nint x = f(6);` },
  { id: 6, tier: 3, n: 'QUEUE + STACK', ans: 25, code: `stack<int> s; queue<int> q;\nfor (int i = 1; i <= 5; i++) q.push(i);\nwhile (!q.empty()) {\n  s.push(q.front()); q.pop();\n  if (!q.empty()) { q.push(q.front()); q.pop(); }\n}\nint x = s.top() * 10 + s.size();` },
  { id: 7, tier: 2, n: 'BUBBLE PASS', ans: 15, code: `int a[] = {5, 1, 4, 2, 3};\nfor (int i = 0; i < 4; i++)\n  if (a[i] > a[i + 1])\n    swap(a[i], a[i + 1]);\nint x = a[0] * 10 + a[4];` },
  { id: 8, tier: 3, n: 'BINARY SEARCH', ans: 205, code: `int a[] = {2, 4, 6, 8, 10, 12, 14};\nint lo = 0, hi = 6, mid, steps = 0;\nwhile (lo <= hi) {\n  mid = (lo + hi) / 2; steps++;\n  if (a[mid] == 12) break;\n  if (a[mid] < 12) lo = mid + 1;\n  else hi = mid - 1;\n}\nint x = steps * 100 + mid;` },
  { id: 9, tier: 1, n: 'QUEUE FRONT', ans: 5, code: `queue<int> q;\nq.push(3); q.push(5); q.push(9);\nq.pop();\nint x = q.front();` },
  { id: 10, tier: 1, n: 'ARRAY SUM', ans: 10, code: `int a[] = {2, 5, 3};\nint x = 0;\nfor (int i = 0; i < 3; i++)\n  x += a[i];` },
  { id: 11, tier: 1, n: 'STACK SIZE', ans: 7, code: `stack<int> s;\ns.push(8); s.push(5);\nint x = s.top() + s.size();` },
  { id: 12, tier: 2, n: 'PAIR PRODUCT', ans: 44, code: `int a[] = {1, 2, 3, 4, 5, 6};\nint x = 0;\nfor (int i = 0; i < 6; i += 2)\n  x += a[i] * a[i + 1];` },
  { id: 13, tier: 2, n: 'QUEUE FOLD', ans: 26, code: `queue<int> q;\nfor (int i = 1; i <= 4; i++) q.push(i);\nint x = 0;\nwhile (!q.empty()) {\n  x = x * 2 + q.front();\n  q.pop();\n}` },
  { id: 14, tier: 3, n: 'DOUBLE RECURSION', ans: 19, code: `int f(int n) {\n  if (n == 0) return 1;\n  return 2 * f(n - 1) + n;\n}\nint x = f(3);` },
  { id: 15, tier: 3, n: 'MONOTONIC STACK', ans: 105, code: `stack<int> s;\nint a[] = {3, 1, 4, 1, 5};\nfor (int i = 0; i < 5; i++) {\n  while (!s.empty() && s.top() < a[i]) s.pop();\n  s.push(a[i]);\n}\nint x = s.size() * 100 + s.top();` },
];

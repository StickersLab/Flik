export const LEVELS = [
  { level: 1,  name: 'Novice',      min: 0,    color: '#aaa' },
  { level: 2,  name: 'Curieux',     min: 50,   color: '#8fb8a8' },
  { level: 3,  name: 'Régulier',    min: 150,  color: '#7aa8c4' },
  { level: 4,  name: 'Focalisé',    min: 320,  color: '#6a90b8' },
  { level: 5,  name: 'Discipliné',  min: 560,  color: '#5a78ac' },
  { level: 6,  name: 'Maître',      min: 900,  color: '#8a6aac' },
  { level: 7,  name: 'Expert',      min: 1400, color: '#ac6a8a' },
  { level: 8,  name: 'Visionnaire', min: 2100, color: '#c8783c' },
  { level: 9,  name: 'Sage',        min: 3000, color: '#c8a030' },
  { level: 10, name: 'Légende',     min: 4200, color: '#1a1a1a' },
];

export function getLevel(points) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.min) current = l;
    else break;
  }
  return current;
}

export function getNextLevel(points) {
  for (const l of LEVELS) {
    if (points < l.min) return l;
  }
  return null; // max level
}

export function getLevelProgress(points) {
  const current = getLevel(points);
  const next = getNextLevel(points);
  if (!next) return 1;
  const range = next.min - current.min;
  const progress = points - current.min;
  return Math.min(1, progress / range);
}

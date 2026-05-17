// ─────────────────────────────────────────────────────────────
//  FLIK — Theme definitions
//  tier: 0=free  1=3cr  2=10cr  3=20cr  4=35cr
// ─────────────────────────────────────────────────────────────

export const THEMES = [
  // ── FREE ───────────────────────────────────────────────────
  {
    id: 'naturel', name: 'Naturel', tier: 0, cost: 0,
    desc: 'Papier doux, lumière du matin.',
    bg: '#f5f3ee', card: '#ffffff', cardBack: '#111111',
    text: '#1a1a1a', muted: '#aaa', chain: '#e8e2d6', accent: '#1a1a1a',
    soundSet: 'naturel',
  },
  {
    id: 'miel', name: 'Miel', tier: 0, cost: 0,
    desc: 'Chaleur dorée, ambre et douceur.',
    bg: '#fdf6e3', card: '#fffbf0', cardBack: '#3d2b1a',
    text: '#3d2b1a', muted: '#b5946a', chain: '#f0e0c0', accent: '#c8a050',
    soundSet: 'miel',
  },
  {
    id: 'velours', name: 'Velours', tier: 0, cost: 0,
    desc: 'Profondeur violette, toucher soyeux.',
    bg: '#1a1228', card: '#221630', cardBack: '#0d0a1a',
    text: '#e8e0f0', muted: '#9080b0', chain: '#2d1f40', accent: '#c080f0',
    soundSet: 'velours',
  },
  {
    id: 'nuit', name: 'Nuit', tier: 0, cost: 0,
    desc: 'Silence nocturne, bleu profond.',
    bg: '#0d1117', card: '#161b22', cardBack: '#010409',
    text: '#c9d1d9', muted: '#6e7681', chain: '#21262d', accent: '#58a6ff',
    soundSet: 'nuit',
  },
  {
    id: 'foret', name: 'Forêt', tier: 0, cost: 0,
    desc: 'Vert moussu, air frais des sous-bois.',
    bg: '#1a2e1e', card: '#1f3422', cardBack: '#0d1a10',
    text: '#d4e8c2', muted: '#7a9a70', chain: '#2a4030', accent: '#7cbf5a',
    soundSet: 'foret',
  },

  // ── TIER 1 — 3 crédits ────────────────────────────────────
  {
    id: 'kraft', name: 'Kraft', tier: 1, cost: 3,
    desc: 'Papier brun brut, authenticité.',
    bg: '#d4b896', card: '#e0c8a8', cardBack: '#3d2a18',
    text: '#2d1a0a', muted: '#8a6a40', chain: '#c8a878', accent: '#8a5a20',
    soundSet: 'kraft',
  },
  {
    id: 'ardoise', name: 'Ardoise', tier: 1, cost: 3,
    desc: 'Gris pierre, minimalisme nordique.',
    bg: '#e4e4e4', card: '#efefef', cardBack: '#2a2a2a',
    text: '#2a2a2a', muted: '#888888', chain: '#d4d4d4', accent: '#4a4a4a',
    soundSet: 'ardoise',
  },
  {
    id: 'brume', name: 'Brume', tier: 1, cost: 3,
    desc: 'Bleu pâle, brouillard du matin.',
    bg: '#e8eef4', card: '#f2f6fa', cardBack: '#2a3a4a',
    text: '#2a3a4a', muted: '#8a9aaa', chain: '#d8e4ee', accent: '#4a7aaa',
    soundSet: 'naturel',
  },
  {
    id: 'terrecuite', name: 'Terre cuite', tier: 1, cost: 3,
    desc: 'Ocre chaud, méditerranée.',
    bg: '#e8d0b8', card: '#f0dcc8', cardBack: '#4a2a18',
    text: '#3a1808', muted: '#a07050', chain: '#d8b898', accent: '#b04020',
    soundSet: 'naturel',
  },

  // ── TIER 2 — 10 crédits ───────────────────────────────────
  {
    id: 'marbre', name: 'Marbre', tier: 2, cost: 10,
    desc: 'Blanc pur, veines grises, luxe discret.',
    bg: '#f2f0ed', card: '#fafafa', cardBack: '#1a1a1a',
    text: '#1a1a1a', muted: '#999999', chain: '#e4e0d8', accent: '#888888',
    soundSet: 'marbre',
  },
  {
    id: 'encre', name: 'Encre de Chine', tier: 2, cost: 10,
    desc: 'Noir encre, écriture ancienne.',
    bg: '#0a0a12', card: '#12121e', cardBack: '#000000',
    text: '#e8e0d0', muted: '#888888', chain: '#1e1e2e', accent: '#e8d090',
    soundSet: 'naturel',
  },
  {
    id: 'cuir', name: 'Cuir', tier: 2, cost: 10,
    desc: 'Brun profond, bureau d\'artisan.',
    bg: '#3d2a1a', card: '#4a3220', cardBack: '#1a0a00',
    text: '#f0e0c0', muted: '#a08060', chain: '#5a3a22', accent: '#d0a060',
    soundSet: 'kraft',
  },
  {
    id: 'minuit', name: 'Minuit', tier: 2, cost: 10,
    desc: 'Bleu nuit, étoiles lointaines.',
    bg: '#0a0d1a', card: '#10152a', cardBack: '#050810',
    text: '#d0d8f0', muted: '#6070a0', chain: '#18203a', accent: '#6080d0',
    soundSet: 'nuit',
  },
  {
    id: 'cerise', name: 'Cerise', tier: 2, cost: 10,
    desc: 'Rouge sombre, passion retenue.',
    bg: '#1a0a10', card: '#240e18', cardBack: '#0a0008',
    text: '#f0d0d8', muted: '#a06070', chain: '#2e1a22', accent: '#e04080',
    soundSet: 'velours',
  },

  // ── TIER 3 — 20 crédits ───────────────────────────────────
  {
    id: 'neontokyo', name: 'Néon Tokyo', tier: 3, cost: 20,
    desc: 'Électrique, cyberpunk, néons violets.',
    bg: '#0a0218', card: '#140330', cardBack: '#000010',
    text: '#ff80ff', muted: '#8040c0', chain: '#1e0840', accent: '#00ffff',
    soundSet: 'neontokyo',
  },
  {
    id: 'lava', name: 'Lava', tier: 3, cost: 20,
    desc: 'Rouge incandescent, chaleur intense.',
    bg: '#1a0800', card: '#280c00', cardBack: '#0a0000',
    text: '#ffd0a0', muted: '#c06020', chain: '#3a1200', accent: '#ff4000',
    soundSet: 'lava',
  },
  {
    id: 'arctic', name: 'Arctic', tier: 3, cost: 20,
    desc: 'Blanc glacial, air pur du nord.',
    bg: '#e8f0f8', card: '#f0f8ff', cardBack: '#0a2a4a',
    text: '#0a2a4a', muted: '#6090b8', chain: '#d8eaf8', accent: '#00aaee',
    soundSet: 'nuit',
  },
  {
    id: 'vaporwave', name: 'Vaporwave', tier: 3, cost: 20,
    desc: 'Rétro 80s, synthé et nostalgie.',
    bg: '#1a0a2a', card: '#240e38', cardBack: '#0a0014',
    text: '#ff80d0', muted: '#9040a0', chain: '#2e1248', accent: '#80ffff',
    soundSet: 'vaporwave',
  },
  {
    id: 'goldrush', name: 'Gold Rush', tier: 3, cost: 20,
    desc: 'Or pur, ambition sans limites.',
    bg: '#0a0800', card: '#140c00', cardBack: '#000000',
    text: '#ffd040', muted: '#c0a030', chain: '#1e1200', accent: '#ffd040',
    soundSet: 'marbre',
  },
  {
    id: 'emeraude', name: 'Émeraude', tier: 3, cost: 20,
    desc: 'Vert gemme, précieux et rare.',
    bg: '#041a0a', card: '#082010', cardBack: '#020a04',
    text: '#a0f0b0', muted: '#40a060', chain: '#0c2a14', accent: '#30d060',
    soundSet: 'foret',
  },

  // ── TIER 4 — 35 crédits ───────────────────────────────────
  {
    id: 'glitch', name: 'Glitch', tier: 4, cost: 35,
    desc: 'Erreur système, beautés corrompues.',
    bg: '#000000', card: '#050510', cardBack: '#0a0a28',
    text: '#00ffaa', muted: '#4040a0', chain: '#0a1020', accent: '#ff0080',
    soundSet: 'matrix',
  },
  {
    id: 'matrix', name: 'Matrix', tier: 4, cost: 35,
    desc: 'Pluie de code, réalité simulée.',
    bg: '#000800', card: '#001000', cardBack: '#000000',
    text: '#00ff41', muted: '#008020', chain: '#001800', accent: '#00ff41',
    soundSet: 'matrix',
  },
  {
    id: 'holographique', name: 'Holographique', tier: 4, cost: 35,
    desc: 'Irisé, dimensions superposées.',
    bg: '#0a0818', card: '#100f28', cardBack: '#040312',
    text: '#e0c8ff', muted: '#8068c8', chain: '#181528', accent: '#ff80ff',
    soundSet: 'cosmic',
  },
  {
    id: 'obsidienne', name: 'Obsidienne', tier: 4, cost: 35,
    desc: 'Noir volcanique, tranchant et pur.',
    bg: '#0a0a0a', card: '#111111', cardBack: '#000000',
    text: '#d0c8b8', muted: '#606060', chain: '#1a1a1a', accent: '#888888',
    soundSet: 'marbre',
  },
  {
    id: 'solaire', name: 'Solaire', tier: 4, cost: 35,
    desc: 'Éclat du soleil, énergie pure.',
    bg: '#fff8e8', card: '#fffaef', cardBack: '#1a1000',
    text: '#1a1000', muted: '#c08030', chain: '#f8e8c0', accent: '#f0a000',
    soundSet: 'miel',
  },
  {
    id: 'cosmic', name: 'Cosmic', tier: 4, cost: 35,
    desc: 'Infini stellaire, poussière d\'étoiles.',
    bg: '#020410', card: '#040820', cardBack: '#000000',
    text: '#d0c0f0', muted: '#6050a0', chain: '#080c20', accent: '#c0a0ff',
    soundSet: 'cosmic',
  },
];

export const FREE_THEMES    = THEMES.filter((t) => t.tier === 0).map((t) => t.id);
export const DEFAULT_THEME  = 'naturel';

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export const TIER_LABELS = ['Gratuit', '3 🪙', '10 🪙', '20 🪙', '35 🪙'];

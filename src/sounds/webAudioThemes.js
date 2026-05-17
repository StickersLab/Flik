// ─────────────────────────────────────────────────────────────
//  FLIK — Procedural Web Audio synthesis per sound theme
//  Used on web (Platform.OS === 'web') to provide theme-specific sounds.
//  Each theme exports { crumple, whoosh, ding }.
// ─────────────────────────────────────────────────────────────

let _ctx = null;
function ctx() {
  if (!_ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _ctx;
}

// Resume AudioContext after user gesture (needed by browsers)
export function resumeAudio() {
  try { ctx()?.resume(); } catch (_) {}
}

// ── Helpers ──────────────────────────────────────────────────
function noise(c, dur, { hpFreq = 800, gainPeak = 0.5, decay = 1.5 } = {}) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = hpFreq;
  const g = c.createGain();
  g.gain.setValueAtTime(gainPeak, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur * decay);
  src.connect(hp); hp.connect(g); g.connect(c.destination);
  src.start(); src.stop(c.currentTime + dur);
}

function tone(c, freq, dur, { type = 'sine', gainPeak = 0.3, attack = 0.01 } = {}) {
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gainPeak, c.currentTime + attack);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  osc.connect(g); g.connect(c.destination);
  osc.start(); osc.stop(c.currentTime + dur);
}

function chord(c, freqs, dur, opts = {}) {
  freqs.forEach((f) => tone(c, f, dur, opts));
}

// ── NATUREL ──────────────────────────────────────────────────
const naturel = {
  crumple() {
    const c = ctx(); if (!c) return;
    noise(c, 0.4, { hpFreq: 1800, gainPeak: 0.7, decay: 1 });
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.35), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.8) * 0.35;
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1200, c.currentTime);
    bp.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.35);
    bp.Q.value = 0.7;
    const g = c.createGain();
    g.gain.setValueAtTime(0.5, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
    src.connect(bp); bp.connect(g); g.connect(c.destination); src.start();
  },
  ding() {
    const c = ctx(); if (!c) return;
    chord(c, [880, 1320], 0.8, { gainPeak: 0.2, attack: 0.01 });
  },
};

// ── MIEL ─────────────────────────────────────────────────────
const miel = {
  crumple() {
    const c = ctx(); if (!c) return;
    noise(c, 0.5, { hpFreq: 600, gainPeak: 0.4, decay: 1.2 }); // parchemin doux
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Bourdon doux
    tone(c, 180, 0.4, { type: 'sine', gainPeak: 0.15, attack: 0.05 });
    noise(c, 0.3, { hpFreq: 400, gainPeak: 0.15, decay: 1 });
  },
  ding() {
    const c = ctx(); if (!c) return;
    chord(c, [523, 659, 784], 1.2, { type: 'sine', gainPeak: 0.12, attack: 0.02 }); // cloche dorée
  },
};

// ── VELOURS ──────────────────────────────────────────────────
const velours = {
  crumple() {
    const c = ctx(); if (!c) return;
    noise(c, 0.4, { hpFreq: 400, gainPeak: 0.3, decay: 1.5 }); // tissu feutré
    tone(c, 60, 0.4, { type: 'sine', gainPeak: 0.08 });
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    noise(c, 0.5, { hpFreq: 200, gainPeak: 0.25, decay: 1 });
    tone(c, 90, 0.5, { type: 'sine', gainPeak: 0.1, attack: 0.08 });
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Jazz validation — 7th chord
    chord(c, [392, 494, 587, 698], 1.5, { type: 'sine', gainPeak: 0.08, attack: 0.03 });
  },
};

// ── NUIT ─────────────────────────────────────────────────────
const nuit = {
  crumple() {
    const c = ctx(); if (!c) return;
    noise(c, 0.3, { hpFreq: 200, gainPeak: 0.5, decay: 0.8 });
    tone(c, 40, 0.3, { type: 'sine', gainPeak: 0.2 });
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Vent nocturne
    noise(c, 0.6, { hpFreq: 100, gainPeak: 0.2, decay: 1 });
    tone(c, 200, 0.6, { type: 'sine', gainPeak: 0.06, attack: 0.15 });
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Carillon lointain
    chord(c, [741, 988, 1109], 2.0, { type: 'sine', gainPeak: 0.1, attack: 0.01 });
  },
};

// ── FORÊT ─────────────────────────────────────────────────────
const foret = {
  crumple() {
    const c = ctx(); if (!c) return;
    noise(c, 0.5, { hpFreq: 1200, gainPeak: 0.35, decay: 1.2 }); // feuilles
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Brise
    noise(c, 0.5, { hpFreq: 300, gainPeak: 0.2, decay: 1 });
    tone(c, 260, 0.5, { type: 'sine', gainPeak: 0.06, attack: 0.1 });
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Chant d'oiseau — deux notes rapides
    tone(c, 1200, 0.15, { gainPeak: 0.2, attack: 0.01 });
    setTimeout(() => tone(c, 1600, 0.25, { gainPeak: 0.15, attack: 0.01 }), 180);
  },
};

// ── KRAFT ─────────────────────────────────────────────────────
const kraft = {
  crumple() {
    const c = ctx(); if (!c) return;
    noise(c, 0.3, { hpFreq: 2500, gainPeak: 0.8, decay: 0.9 }); // déchirure
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Glissement papier
    noise(c, 0.4, { hpFreq: 600, gainPeak: 0.4, decay: 1 });
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Tap bois sec
    tone(c, 300, 0.1, { type: 'triangle', gainPeak: 0.4, attack: 0.005 });
    tone(c, 600, 0.08, { type: 'triangle', gainPeak: 0.2, attack: 0.005 });
  },
};

// ── ARDOISE ──────────────────────────────────────────────────
const ardoise = {
  crumple() {
    const c = ctx(); if (!c) return;
    noise(c, 0.3, { hpFreq: 3000, gainPeak: 0.5, decay: 0.7 }); // craie
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    noise(c, 0.4, { hpFreq: 800, gainPeak: 0.35, decay: 1 }); // frottement
  },
  ding() {
    const c = ctx(); if (!c) return;
    tone(c, 1046, 0.6, { type: 'triangle', gainPeak: 0.3, attack: 0.005 }); // ping métal
  },
};

// ── MARBRE ───────────────────────────────────────────────────
const marbre = {
  crumple() {
    const c = ctx(); if (!c) return;
    // Choc pierre sourd
    tone(c, 80, 0.3, { type: 'triangle', gainPeak: 0.4, attack: 0.002 });
    noise(c, 0.2, { hpFreq: 400, gainPeak: 0.3, decay: 0.7 });
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Glissement marbre
    noise(c, 0.5, { hpFreq: 200, gainPeak: 0.3, decay: 1 });
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Résonance marbre — longue
    chord(c, [440, 880], 2.5, { type: 'sine', gainPeak: 0.15, attack: 0.02 });
  },
};

// ── NÉON TOKYO ───────────────────────────────────────────────
const neontokyo = {
  crumple() {
    const c = ctx(); if (!c) return;
    // Glitch électrique
    for (let i = 0; i < 6; i++) {
      setTimeout(() => tone(c, 80 + Math.random() * 200, 0.04, { type: 'square', gainPeak: 0.3 }), i * 30);
    }
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Laser doux
    const osc = c.createOscillator(); osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.3);
    const g = c.createGain();
    g.gain.setValueAtTime(0.2, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    osc.connect(g); g.connect(c.destination); osc.start(); osc.stop(c.currentTime + 0.3);
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Synthé montant
    const osc = c.createOscillator(); osc.type = 'square';
    osc.frequency.setValueAtTime(220, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.3);
    const g = c.createGain();
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8);
    osc.connect(g); g.connect(c.destination); osc.start(); osc.stop(c.currentTime + 0.8);
  },
};

// ── LAVA ─────────────────────────────────────────────────────
const lava = {
  crumple() {
    const c = ctx(); if (!c) return;
    // Grondement sourd
    tone(c, 40, 0.5, { type: 'sawtooth', gainPeak: 0.3, attack: 0.02 });
    noise(c, 0.4, { hpFreq: 80, gainPeak: 0.4, decay: 0.9 });
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Flamme
    noise(c, 0.5, { hpFreq: 100, gainPeak: 0.4, decay: 1 });
    tone(c, 60, 0.5, { type: 'sawtooth', gainPeak: 0.15, attack: 0.05 });
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Explosion douce
    noise(c, 0.2, { hpFreq: 50, gainPeak: 0.6, decay: 0.5 });
    tone(c, 120, 0.4, { gainPeak: 0.2 });
  },
};

// ── VAPORWAVE ─────────────────────────────────────────────────
const vaporwave = {
  crumple() {
    const c = ctx(); if (!c) return;
    // Cassette rebobinée
    noise(c, 0.4, { hpFreq: 600, gainPeak: 0.3, decay: 1 });
    const osc = c.createOscillator(); osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, c.currentTime);
    osc.frequency.linearRampToValueAtTime(100, c.currentTime + 0.4);
    const g = c.createGain(); g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
    osc.connect(g); g.connect(c.destination); osc.start(); osc.stop(c.currentTime + 0.4);
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Synthé rétro glissant
    const osc = c.createOscillator(); osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, c.currentTime + 0.5);
    const g = c.createGain(); g.gain.setValueAtTime(0.2, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
    osc.connect(g); g.connect(c.destination); osc.start(); osc.stop(c.currentTime + 0.5);
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Arcade win
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => tone(c, f, 0.15, { type: 'square', gainPeak: 0.12, attack: 0.01 }), i * 80);
    });
  },
};

// ── MATRIX ───────────────────────────────────────────────────
const matrix = {
  crumple() {
    const c = ctx(); if (!c) return;
    // Erreur système
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        noise(c, 0.05, { hpFreq: 4000, gainPeak: 0.5, decay: 0.5 });
      }, i * 50);
    }
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Data whoosh
    const osc = c.createOscillator(); osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.4);
    const g = c.createGain(); g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
    osc.connect(g); g.connect(c.destination); osc.start(); osc.stop(c.currentTime + 0.4);
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Bip validation
    [880, 1320].forEach((f, i) => {
      setTimeout(() => tone(c, f, 0.12, { type: 'square', gainPeak: 0.2, attack: 0.005 }), i * 100);
    });
  },
};

// ── COSMIC ───────────────────────────────────────────────────
const cosmic = {
  crumple() {
    const c = ctx(); if (!c) return;
    // Distorsion spatiale
    noise(c, 0.5, { hpFreq: 100, gainPeak: 0.3, decay: 1.5 });
    tone(c, 55, 0.5, { gainPeak: 0.15, attack: 0.05 });
  },
  whoosh() {
    const c = ctx(); if (!c) return;
    // Warp
    const osc = c.createOscillator(); osc.type = 'sine';
    osc.frequency.setValueAtTime(200, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, c.currentTime + 0.7);
    const g = c.createGain(); g.gain.setValueAtTime(0.2, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.7);
    osc.connect(g); g.connect(c.destination); osc.start(); osc.stop(c.currentTime + 0.7);
  },
  ding() {
    const c = ctx(); if (!c) return;
    // Cristal — harmoniques pures
    chord(c, [528, 1056, 1584, 2112], 3.0, { gainPeak: 0.08, attack: 0.03 });
  },
};

// ── Registry ─────────────────────────────────────────────────
const SOUND_SETS = {
  naturel, miel, velours, nuit, foret,
  kraft, ardoise, marbre,
  neontokyo, lava, vaporwave, matrix, cosmic,
};

export function getSoundSet(soundSetId) {
  return SOUND_SETS[soundSetId] ?? naturel;
}

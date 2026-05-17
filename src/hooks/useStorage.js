import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FREE_THEMES, DEFAULT_THEME } from '../data/themes';

const KEYS = {
  queue:          'flik_queue',
  done:           'flik_done',
  incubator:      'flik_incubator',
  points:         'flik_points',
  credits:        'flik_credits',
  streak:         'flik_streak',
  bestStreak:     'flik_best_streak',
  lastDate:       'flik_last_date',
  lastValidated:  'flik_last_validated',  // anti-cheat
  purchasedThemes:'flik_purchased_themes',
  currentTheme:   'flik_current_theme',
  deletedCount:   'flik_deleted_count',
  dailyDone:      'flik_daily_done',      // { "2024-05-17": 3, ... }
  soundsEnabled:  'flik_sounds_enabled',
  language:       'flik_language',
};

const POINTS_PER_TASK  = 10;
const CREDITS_PER_100  = 1;   // 100 pts = 1 credit
const MIN_VALID_MS     = 5 * 60 * 1000; // 5 minutes anti-triche

function streakBonus(streak) { return streak * 2; }

function today() { return new Date().toDateString(); }
function dateKey() { return new Date().toISOString().slice(0, 10); }

function detectLanguage() {
  if (typeof navigator === 'undefined') return 'fr';
  const lang = (navigator.language || 'fr').slice(0, 2).toLowerCase();
  return ['fr','en','es','de','it','pt','ja','ru','uk'].includes(lang) ? lang : 'fr';
}

export function useStorage(initialQueue) {
  const [queue,           setQueue]           = useState([]);
  const [doneList,        setDoneList]        = useState([]);
  const [incubatorList,   setIncubatorList]   = useState([]);
  const [points,          setPoints]          = useState(0);
  const [credits,         setCredits]         = useState(0);
  const [streak,          setStreak]          = useState(0);
  const [bestStreak,      setBestStreak]      = useState(0);
  const [streakPtsToday,  setStreakPtsToday]  = useState(0);
  const [streakCrToday,   setStreakCrToday]   = useState(0); // credit bonus today
  const [purchasedThemes, setPurchasedThemes] = useState(FREE_THEMES);
  const [currentThemeId,  setCurrentThemeId]  = useState(DEFAULT_THEME);
  const [deletedCount,    setDeletedCount]    = useState(0);
  const [dailyDone,       setDailyDone]       = useState({});
  const [soundsEnabled,   setSoundsEnabled]   = useState(true);
  const [language,        setLanguage]        = useState('fr');
  const [lastValidated,   setLastValidated]   = useState(0);
  const [loaded,          setLoaded]          = useState(false);

  // ── Load ────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const vals = await AsyncStorage.multiGet(Object.values(KEYS));
        const kv = {};
        Object.keys(KEYS).forEach((k, i) => { kv[k] = vals[i][1]; });

        const todayStr  = today();
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);

        const savedStreak = kv.streak ? parseInt(kv.streak) : 0;
        const savedBest   = kv.bestStreak ? parseInt(kv.bestStreak) : 0;
        let   newStreak   = savedStreak;
        let   bonusPts    = 0;
        let   bonusCr     = 0;
        let   pts         = kv.points ? parseInt(kv.points) : 0;
        let   cr          = kv.credits ? parseInt(kv.credits) : 0;

        if (kv.lastDate !== todayStr) {
          if (kv.lastDate === yesterday.toDateString()) {
            newStreak = savedStreak + 1;
          } else if (kv.lastDate) {
            newStreak = 1;
          } else {
            newStreak = 1;
          }

          bonusPts = streakBonus(newStreak);
          pts += bonusPts;

          // Credit milestones
          if (newStreak === 7)  { bonusCr = 5;  cr += 5; }
          if (newStreak === 30) { bonusCr = 20; cr += 20; }

          await AsyncStorage.multiSet([
            [KEYS.streak,   String(newStreak)],
            [KEYS.lastDate, todayStr],
            [KEYS.points,   String(pts)],
            [KEYS.credits,  String(cr)],
            [KEYS.bestStreak, String(Math.max(newStreak, savedBest))],
          ]);
        }

        setQueue(kv.queue ? JSON.parse(kv.queue) : initialQueue);
        setDoneList(kv.done ? JSON.parse(kv.done) : []);
        setIncubatorList(kv.incubator ? JSON.parse(kv.incubator) : []);
        setPoints(pts);
        setCredits(cr);
        setStreak(newStreak);
        setBestStreak(Math.max(newStreak, savedBest));
        setStreakPtsToday(bonusPts);
        setStreakCrToday(bonusCr);
        setPurchasedThemes(kv.purchasedThemes ? JSON.parse(kv.purchasedThemes) : FREE_THEMES);
        setCurrentThemeId(kv.currentTheme ?? DEFAULT_THEME);
        setDeletedCount(kv.deletedCount ? parseInt(kv.deletedCount) : 0);
        setDailyDone(kv.dailyDone ? JSON.parse(kv.dailyDone) : {});
        setSoundsEnabled(kv.soundsEnabled !== 'false');
        setLanguage(kv.language ?? detectLanguage());
        setLastValidated(kv.lastValidated ? parseInt(kv.lastValidated) : 0);
      } catch {
        setQueue(initialQueue);
      }
      setLoaded(true);
    }
    load();
  }, []);

  // ── Auto-save ───────────────────────────────────────────────
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.queue, JSON.stringify(queue)).catch(() => {}); }, [queue, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.done, JSON.stringify(doneList)).catch(() => {}); }, [doneList, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.incubator, JSON.stringify(incubatorList)).catch(() => {}); }, [incubatorList, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.points, String(points)).catch(() => {}); }, [points, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.credits, String(credits)).catch(() => {}); }, [credits, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.purchasedThemes, JSON.stringify(purchasedThemes)).catch(() => {}); }, [purchasedThemes, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.currentTheme, currentThemeId).catch(() => {}); }, [currentThemeId, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.deletedCount, String(deletedCount)).catch(() => {}); }, [deletedCount, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.dailyDone, JSON.stringify(dailyDone)).catch(() => {}); }, [dailyDone, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.soundsEnabled, String(soundsEnabled)).catch(() => {}); }, [soundsEnabled, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEYS.language, language).catch(() => {}); }, [language, loaded]);

  // ── Actions ─────────────────────────────────────────────────
  function validateTask() {
    const now = Date.now();
    const canScore = (now - lastValidated) >= MIN_VALID_MS;
    if (canScore) {
      const newPts = points + POINTS_PER_TASK;
      setPoints(newPts);
      setLastValidated(now);
      AsyncStorage.setItem(KEYS.lastValidated, String(now)).catch(() => {});

      // Convert points to credits
      const newCredits = Math.floor(newPts / 100);
      const oldCredits = Math.floor(points / 100);
      if (newCredits > oldCredits) {
        setCredits((c) => c + (newCredits - oldCredits));
      }

      // Record daily stat
      const dk = dateKey();
      setDailyDone((d) => ({ ...d, [dk]: (d[dk] || 0) + 1 }));
    }
    return canScore ? POINTS_PER_TASK : 0;
  }

  function addPoints(amount) {
    setPoints((p) => p + amount);
  }

  function spendCredits(amount) {
    if (credits < amount) return false;
    setCredits((c) => c - amount);
    return true;
  }

  function unlockTheme(themeId, cost) {
    if (!spendCredits(cost)) return false;
    setPurchasedThemes((prev) => prev.includes(themeId) ? prev : [...prev, themeId]);
    return true;
  }

  function incrementDeleted() {
    setDeletedCount((n) => n + 1);
  }

  function updateLanguage(lang) {
    setLanguage(lang);
  }

  function updateSoundsEnabled(val) {
    setSoundsEnabled(val);
  }

  function updateTheme(id) {
    setCurrentThemeId(id);
  }

  return {
    queue, setQueue,
    doneList, setDoneList,
    incubatorList, setIncubatorList,
    points, credits, streak, bestStreak,
    streakPtsToday, streakCrToday,
    purchasedThemes, currentThemeId,
    deletedCount, dailyDone,
    soundsEnabled, language,
    loaded,
    validateTask,
    addPoints,
    spendCredits,
    unlockTheme,
    incrementDeleted,
    updateLanguage,
    updateSoundsEnabled,
    updateTheme,
    setBestStreak,
  };
}

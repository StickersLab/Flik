import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  queue:    'flik_queue',
  done:     'flik_done',
  points:   'flik_points',
  streak:   'flik_streak',
  lastDate: 'flik_last_date',
};

// Points gagnés par ouverture = streak * 2 (ex: jour 5 = +10 pts)
function streakBonus(streak) {
  return streak * 2;
}

export function useStorage(initialQueue) {
  const [queue,    setQueue]    = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [points,   setPoints]   = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [streakPtsToday, setStreakPtsToday] = useState(0); // pts gagnés à l'ouverture
  const [loaded,   setLoaded]   = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [savedQueue, savedDone, savedPoints, savedStreak, savedLastDate] =
          await Promise.all([
            AsyncStorage.getItem(KEYS.queue),
            AsyncStorage.getItem(KEYS.done),
            AsyncStorage.getItem(KEYS.points),
            AsyncStorage.getItem(KEYS.streak),
            AsyncStorage.getItem(KEYS.lastDate),
          ]);

        const today     = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const currentStreak = savedStreak ? parseInt(savedStreak) : 0;
        let newStreak = currentStreak;
        let bonusEarned = 0;
        let basePoints = savedPoints ? parseInt(savedPoints) : 0;

        if (savedLastDate !== today) {
          // Calculer le nouveau streak
          if (savedLastDate === yesterday.toDateString()) {
            newStreak = currentStreak + 1;
          } else if (savedLastDate) {
            newStreak = 1; // streak cassé
          } else {
            newStreak = 1; // premier jour
          }

          // Bonus de streak
          bonusEarned = streakBonus(newStreak);
          basePoints += bonusEarned;

          await AsyncStorage.setItem(KEYS.streak,   String(newStreak));
          await AsyncStorage.setItem(KEYS.lastDate, today);
          await AsyncStorage.setItem(KEYS.points,   String(basePoints));
        }

        setQueue(savedQueue ? JSON.parse(savedQueue) : initialQueue);
        setDoneList(savedDone ? JSON.parse(savedDone) : []);
        setPoints(basePoints);
        setStreak(newStreak);
        setStreakPtsToday(bonusEarned);
      } catch {
        setQueue(initialQueue);
      }
      setLoaded(true);
    }
    load();
  }, []);

  // Auto-save
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEYS.queue, JSON.stringify(queue)).catch(() => {});
  }, [queue, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEYS.done, JSON.stringify(doneList)).catch(() => {});
  }, [doneList, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEYS.points, String(points)).catch(() => {});
  }, [points, loaded]);

  function addPoints(amount) {
    setPoints((p) => p + amount);
  }

  return {
    queue, setQueue,
    doneList, setDoneList,
    points, streak, streakPtsToday,
    addPoints,
    loaded,
  };
}

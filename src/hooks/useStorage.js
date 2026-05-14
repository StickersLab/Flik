import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  queue: 'flik_queue',
  done: 'flik_done',
};

export function useStorage(initialQueue) {
  const [queue, setQueue] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const isFirstLoad = useRef(true);

  // Charger au démarrage
  useEffect(() => {
    async function load() {
      try {
        const [savedQueue, savedDone] = await Promise.all([
          AsyncStorage.getItem(KEYS.queue),
          AsyncStorage.getItem(KEYS.done),
        ]);
        setQueue(savedQueue ? JSON.parse(savedQueue) : initialQueue);
        setDoneList(savedDone ? JSON.parse(savedDone) : []);
      } catch {
        setQueue(initialQueue);
        setDoneList([]);
      }
      setLoaded(true);
    }
    load();
  }, []);

  // Sauvegarder automatiquement à chaque changement
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEYS.queue, JSON.stringify(queue)).catch(() => {});
  }, [queue, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEYS.done, JSON.stringify(doneList)).catch(() => {});
  }, [doneList, loaded]);

  return { queue, setQueue, doneList, setDoneList, loaded };
}

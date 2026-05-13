import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// Place MP3 files in assets/sounds/:
//   crumple.mp3  — papier froissé (swipe gauche)
//   whoosh.mp3   — air (swipe droite)
//   ding.mp3     — validation (swipe haut)

export function useSounds() {
  const sounds = useRef({});

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        const assets = {
          crumple: require('../../assets/sounds/crumple.mp3'),
          whoosh: require('../../assets/sounds/whoosh.mp3'),
          ding: require('../../assets/sounds/ding.mp3'),
        };

        for (const [key, source] of Object.entries(assets)) {
          const { sound } = await Audio.Sound.createAsync(source);
          if (mounted) sounds.current[key] = sound;
        }
      } catch {
        // Sounds unavailable — app works without them
      }
    }

    load();

    return () => {
      mounted = false;
      Object.values(sounds.current).forEach((s) => s?.unloadAsync());
    };
  }, []);

  async function play(name) {
    try {
      const sound = sounds.current[name];
      if (!sound) return;
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch {
      // Ignore playback errors
    }
  }

  return {
    playCrumple: () => play('crumple'),
    playWhoosh: () => play('whoosh'),
    playDing: () => play('ding'),
  };
}

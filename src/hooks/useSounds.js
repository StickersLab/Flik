import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { getSoundSet, resumeAudio } from '../sounds/webAudioThemes';

// On web: Web Audio API synthesis (theme-specific)
// On native: expo-av with MP3 files (same for all themes)

export function useSounds(soundsEnabled = true) {
  const nativeSounds = useRef({});
  const soundSetRef  = useRef('naturel');

  useEffect(() => {
    if (Platform.OS === 'web') return; // web uses WebAudio, no setup needed

    let mounted = true;
    async function load() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const assets = {
          crumple: require('../../assets/sounds/crumple.mp3'),
          whoosh:  require('../../assets/sounds/whoosh.mp3'),
          ding:    require('../../assets/sounds/ding.mp3'),
        };
        for (const [key, source] of Object.entries(assets)) {
          const { sound } = await Audio.Sound.createAsync(source);
          if (mounted) nativeSounds.current[key] = sound;
        }
      } catch { /* sounds unavailable */ }
    }
    load();
    return () => {
      mounted = false;
      Object.values(nativeSounds.current).forEach((s) => s?.unloadAsync());
    };
  }, []);

  function setSoundTheme(soundSetId) {
    soundSetRef.current = soundSetId;
  }

  async function playNative(name) {
    try {
      const sound = nativeSounds.current[name];
      if (!sound) return;
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch { /* ignore */ }
  }

  function playWeb(name) {
    resumeAudio();
    const set = getSoundSet(soundSetRef.current);
    set[name]?.();
  }

  function play(name) {
    if (!soundsEnabled) return;
    if (Platform.OS === 'web') {
      playWeb(name);
    } else {
      playNative(name);
    }
  }

  return {
    playCrumple:    () => play('crumple'),
    playWhoosh:     () => play('whoosh'),
    playDing:       () => play('ding'),
    setSoundTheme,
  };
}

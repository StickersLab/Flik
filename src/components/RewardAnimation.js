import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

// type: 'task' | 'levelup' | 'streak'
export function RewardAnimation({ visible, type = 'task', points = 10, levelName = '', onDone }) {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale     = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!visible) return;
    opacity.setValue(0);
    translateY.setValue(0);
    scale.setValue(0.5);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1.15, useNativeDriver: true, damping: 8 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.delay(type === 'levelup' ? 1200 : 500),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -70, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 0,   duration: 500, useNativeDriver: true }),
      ]),
    ]).start(() => onDone && onDone());
  }, [visible]);

  if (!visible) return null;

  if (type === 'levelup') {
    return (
      <Animated.View style={[styles.container, { opacity, transform: [{ translateY }, { scale }] }]} pointerEvents="none">
        <Text style={styles.levelUpLabel}>NIVEAU SUPÉRIEUR</Text>
        <Text style={styles.levelUpName}>{levelName}</Text>
        <Text style={styles.stars}>✦ ✦ ✦</Text>
      </Animated.View>
    );
  }

  if (type === 'streak') {
    return (
      <Animated.View style={[styles.container, { opacity, transform: [{ translateY }, { scale }] }]} pointerEvents="none">
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={styles.points}>+{points} pts</Text>
        <Text style={styles.sub}>STREAK BONUS</Text>
      </Animated.View>
    );
  }

  // type === 'task'
  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }, { scale }] }]} pointerEvents="none">
      <Text style={styles.stars}>✦ ✦ ✦</Text>
      <Text style={styles.points}>+{points} pts</Text>
      <Text style={styles.sub}>ACCOMPLI</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    gap: 6,
    zIndex: 999,
  },
  stars:      { fontSize: 14, color: '#c8a96e', letterSpacing: 6 },
  streakEmoji:{ fontSize: 36 },
  points: {
    fontFamily: 'PlayfairDisplay_900Black',
    fontSize: 42,
    color: '#1a1a1a',
    letterSpacing: 2,
  },
  sub: {
    fontFamily: 'DMSans_300Light',
    fontSize: 10,
    letterSpacing: 5,
    color: '#aaa',
    textTransform: 'uppercase',
  },
  levelUpLabel: {
    fontFamily: 'DMSans_300Light',
    fontSize: 10,
    letterSpacing: 5,
    color: '#aaa',
    textTransform: 'uppercase',
  },
  levelUpName: {
    fontFamily: 'PlayfairDisplay_900Black',
    fontSize: 38,
    color: '#1a1a1a',
    letterSpacing: 3,
  },
});

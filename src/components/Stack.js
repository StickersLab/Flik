import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated as RNAnimated } from 'react-native';
import { TopCard, BackCard } from './Card';

export function Stack({ queue, onSwipe, undoEntry, theme }) {
  const visible = queue.slice(0, 3);
  if (queue.length === 0) return null;

  return (
    <View style={styles.stack}>
      {visible.length > 2 && (
        <BackCard key={`back-2-${visible[2].id}`} depth={2} theme={theme} />
      )}
      {visible.length > 1 && (
        <BackCard key={`back-1-${visible[1].id}`} depth={1} theme={theme} />
      )}
      <TopCard
        key={`top-${visible[0].id}`}
        task={visible[0]}
        onSwipe={onSwipe}
        entryFrom={undoEntry ? 'left' : 'none'}
        theme={theme}
      />
    </View>
  );
}

export function ClearedScreen({ visible, theme }) {
  const opacity   = React.useRef(new RNAnimated.Value(0)).current;
  const translateY = React.useRef(new RNAnimated.Value(20)).current;
  const th = theme || { text: '#1a1a1a', muted: '#aaa' };

  useEffect(() => {
    if (visible) {
      RNAnimated.parallel([
        RNAnimated.timing(opacity,    { toValue: 1, duration: 600, useNativeDriver: true }),
        RNAnimated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 18 }),
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(20);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <RNAnimated.View style={[styles.cleared, { opacity }]}>
      <RNAnimated.Text style={[styles.clearedWord, { color: th.text, transform: [{ translateY }] }]}>
        CLEARED
      </RNAnimated.Text>
      <Text style={[styles.clearedSub, { color: th.muted }]}>pile vidée</Text>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: 300, height: 360, position: 'relative',
    alignItems: 'center', justifyContent: 'center',
  },
  cleared: { position: 'absolute', alignItems: 'center', gap: 12 },
  clearedWord: {
    fontFamily: 'PlayfairDisplay_900Black', fontSize: 48, letterSpacing: 10,
  },
  clearedSub: {
    fontFamily: 'DMSans_300Light', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase',
  },
});

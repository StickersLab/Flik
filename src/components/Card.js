import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';

const SWIPE_X = 80;
const SWIPE_Y = 80;

const DEFAULT_THEME_COLORS = {
  card: '#ffffff', cardBack: '#111111', text: '#1a1a1a',
  muted: '#aaa', chain: '#e8e2d6',
};

function getFontSize(title) {
  if (title.length < 18) return 26;
  if (title.length < 35) return 21;
  return 17;
}

export function TopCard({ task, onSwipe, entryFrom = 'none', theme }) {
  const tx = useSharedValue(entryFrom === 'left' ? -750 : 0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(entryFrom === 'none' ? 1 : 0.92);

  useEffect(() => {
    if (entryFrom === 'left') {
      tx.value = withSpring(0, { damping: 18, stiffness: 120 });
      scale.value = withSpring(1, { damping: 18 });
    }
  }, []);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_X) {
        tx.value = withTiming(-750, { duration: 320 }, (done) => {
          if (done) runOnJS(onSwipe)('left');
        });
        ty.value = withTiming(60, { duration: 320 });
      } else if (e.translationX > SWIPE_X) {
        tx.value = withTiming(750, { duration: 320 }, (done) => {
          if (done) runOnJS(onSwipe)('right');
        });
        ty.value = withTiming(-40, { duration: 320 });
      } else if (e.translationY < -SWIPE_Y) {
        ty.value = withTiming(-750, { duration: 320 }, (done) => {
          if (done) runOnJS(onSwipe)('up');
        });
      } else {
        tx.value = withSpring(0, { damping: 15 });
        ty.value = withSpring(0, { damping: 15 });
      }
    });

  const animStyle = useAnimatedStyle(() => {
    const rotate = interpolate(tx.value, [-200, 0, 200], [-15, 0, 15], Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: tx.value },
        { translateY: ty.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
    };
  });

  const th = theme || DEFAULT_THEME_COLORS;
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, styles.cardFront, {
        backgroundColor: th.card,
        borderColor: th.chain,
        ...Platform.select({
          web: { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
          default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5 },
        }),
      }, animStyle]}>
        <Text style={[styles.watermark, { color: `${th.text}08` }]}>F</Text>
        <CardContent task={task} theme={th} />
      </Animated.View>
    </GestureDetector>
  );
}

export function BackCard({ depth, theme }) {
  const th = theme || DEFAULT_THEME_COLORS;
  const offset = depth * 9;
  const sc = 1 - depth * 0.05;
  return (
    <View style={[styles.card, { backgroundColor: th.cardBack, transform: [{ translateY: offset }, { scale: sc }] }]}>
      <Text style={[styles.backLogo, { color: `${th.card}40` }]}>FLIK</Text>
    </View>
  );
}

function CardContent({ task, theme: th }) {
  return (
    <>
      <Text style={[styles.label, { color: th.muted }]}>tâche</Text>
      <Text style={[styles.title, { fontSize: getFontSize(task.title), color: th.text }]}>
        {task.title}
      </Text>
      <View style={styles.bottom}>
        {task.hasChain && (
          <View style={[styles.chainBadge, { backgroundColor: th.chain }]}>
            <Text style={[styles.chainText, { color: th.muted }]}>
              ⛓ {task.chainNote ? task.chainNote : 'action requise'}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: 300,
    height: 340,
    borderRadius: 24,
  },
  cardFront: {
    borderWidth: 0.5,
    padding: 36,
    justifyContent: 'space-between',
    zIndex: 10,
    overflow: 'hidden',
  },
  cardBack: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  watermark: {
    position: 'absolute',
    fontFamily: 'PlayfairDisplay_900Black',
    fontSize: 180,
    color: 'rgba(0,0,0,0.035)',
    alignSelf: 'center',
    top: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    pointerEvents: 'none',
  },
  backLogo: {
    fontFamily: 'PlayfairDisplay_900Black',
    fontSize: 28,
    letterSpacing: 8,
    color: '#2a2a2a',
  },
  label: {
    fontFamily: 'DMSans_300Light',
    fontSize: 10,
    letterSpacing: 3,
    color: '#aaa',
    textTransform: 'uppercase',
    zIndex: 1,
  },
  title: {
    fontFamily: 'PlayfairDisplay_500Medium',
    color: '#1a1a1a',
    lineHeight: 32,
    flex: 1,
    paddingTop: 8,
    zIndex: 1,
  },
  bottom: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
  chainBadge: {
    backgroundColor: '#e8e2d6',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 12,
    maxWidth: 220,
  },
  chainText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: '#888',
    letterSpacing: 1.5,
  },
});

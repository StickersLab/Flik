import React from 'react';
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

function getFontSize(title) {
  if (title.length < 18) return 26;
  if (title.length < 35) return 21;
  return 17;
}

export function TopCard({ task, onSwipe }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_X) {
        tx.value = withTiming(-700, { duration: 350 });
        ty.value = withTiming(60, { duration: 350 });
        runOnJS(onSwipe)('left');
      } else if (e.translationX > SWIPE_X) {
        tx.value = withTiming(700, { duration: 350 });
        ty.value = withTiming(-40, { duration: 350 });
        runOnJS(onSwipe)('right');
      } else if (e.translationY < -SWIPE_Y) {
        ty.value = withTiming(-700, { duration: 350 });
        runOnJS(onSwipe)('up');
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
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, styles.cardFront, animStyle]}>
        <CardContent task={task} />
      </Animated.View>
    </GestureDetector>
  );
}

export function BackCard({ depth }) {
  const offset = depth * 9;
  const scale = 1 - depth * 0.05;
  return (
    <View
      style={[
        styles.card,
        styles.cardBack,
        { transform: [{ translateY: offset }, { scale }] },
      ]}
    >
      <Text style={styles.backLogo}>FLIK</Text>
    </View>
  );
}

function CardContent({ task }) {
  return (
    <>
      <Text style={styles.label}>tâche</Text>
      <Text style={[styles.title, { fontSize: getFontSize(task.title) }]}>
        {task.title}
      </Text>
      <View style={styles.bottom}>
        {task.hasChain && (
          <View style={styles.chainBadge}>
            <Text style={styles.chainText}>⛓ action</Text>
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
    backgroundColor: '#ffffff',
    borderWidth: 0.5,
    borderColor: '#e0ddd6',
    padding: 36,
    justifyContent: 'space-between',
    zIndex: 10,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
      },
    }),
  },
  cardBack: {
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
  },
  title: {
    fontFamily: 'PlayfairDisplay_500Medium',
    color: '#1a1a1a',
    lineHeight: 32,
    flex: 1,
    textAlignVertical: 'center',
    paddingTop: 8,
  },
  bottom: {
    alignItems: 'flex-end',
  },
  chainBadge: {
    backgroundColor: '#e8e2d6',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  chainText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: '#888',
    letterSpacing: 1.5,
  },
});

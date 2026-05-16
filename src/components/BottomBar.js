import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getLevel, getNextLevel, getLevelProgress } from '../data/levels';

export function BottomBar({ activeTab, onTabChange, doneCount, streak, points }) {
  const level    = getLevel(points);
  const next     = getNextLevel(points);
  const progress = getLevelProgress(points);

  return (
    <View style={styles.wrapper}>
      {/* Barre de progression du niveau */}
      <View style={styles.levelRow}>
        <Text style={[styles.levelName, { color: level.color }]}>
          Nv.{level.level} {level.name}
        </Text>
        <Text style={styles.levelPts}>
          {next ? `${points} / ${next.min} pts` : `${points} pts — MAX`}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${Math.round(progress * 100)}%`, backgroundColor: level.color }]} />
      </View>

      {/* Navigation + stats */}
      <View style={styles.bar}>
        {/* Streak + Points */}
        <View style={styles.stats}>
          {streak > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statNum}>{streak}j</Text>
            </View>
          )}
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statNum}>{points}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.nav}>
          <NavItem id="flux" label="flux" active={activeTab === 'flux'} onPress={onTabChange}>
            <CardIcon active={activeTab === 'flux'} />
          </NavItem>
          <NavItem id="fait" label="fait" active={activeTab === 'fait'} onPress={onTabChange} badge={doneCount}>
            <CheckIcon active={activeTab === 'fait'} />
          </NavItem>
        </View>
      </View>
    </View>
  );
}

function NavItem({ id, label, active, onPress, badge, children }) {
  return (
    <TouchableOpacity style={[styles.item, active && styles.itemActive]} onPress={() => onPress(id)} activeOpacity={0.7}>
      <View>
        {children}
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function CardIcon({ active }) {
  return (
    <View style={[styles.iconRect, active && styles.iconRectActive]}>
      <View style={[styles.iconLine, active && styles.iconLineActive]} />
    </View>
  );
}

function CheckIcon({ active }) {
  return (
    <View style={styles.checkWrap}>
      <Text style={[styles.checkText, active && styles.checkTextActive]}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#f5f3ee', paddingBottom: 36, paddingTop: 8 },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginBottom: 6,
  },
  levelName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 11,
    letterSpacing: 1,
  },
  levelPts: {
    fontFamily: 'DMSans_300Light',
    fontSize: 10,
    color: '#aaa',
    letterSpacing: 1,
  },
  progressTrack: {
    height: 2,
    backgroundColor: '#e8e2d6',
    marginHorizontal: 28,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: 2,
    borderRadius: 2,
    minWidth: 4,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  stats: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statEmoji: { fontSize: 14 },
  statNum: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 13, color: '#1a1a1a' },
  nav: { flexDirection: 'row', gap: 32 },
  item: { alignItems: 'center', gap: 4, opacity: 0.3 },
  itemActive: { opacity: 1 },
  label: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 9,
    letterSpacing: 2,
    color: '#1a1a1a',
    textTransform: 'uppercase',
  },
  labelActive: { color: '#1a1a1a' },
  iconRect: { width: 22, height: 16, borderWidth: 1.8, borderColor: '#1a1a1a', borderRadius: 3, justifyContent: 'center' },
  iconRectActive: { borderColor: '#1a1a1a' },
  iconLine: { height: 1.8, backgroundColor: '#1a1a1a', marginHorizontal: 3, marginTop: 4 },
  iconLineActive: { backgroundColor: '#1a1a1a' },
  checkWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  checkText: { fontSize: 20, color: '#1a1a1a' },
  checkTextActive: { color: '#1a1a1a' },
  badge: {
    position: 'absolute', top: -4, right: -8,
    backgroundColor: '#1a1a1a', width: 16, height: 16,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 9, color: '#f5f3ee' },
});

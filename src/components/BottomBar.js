import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getLevel, getNextLevel, getLevelProgress } from '../data/levels';
import { t } from '../i18n/strings';

export function BottomBar({ activeTab, onTabChange, doneCount, incubatorCount, points, theme, lang }) {
  const level    = getLevel(points);
  const next     = getNextLevel(points);
  const progress = getLevelProgress(points);

  const tabs = [
    { id: 'flux',       label: t(lang, 'flux'),       icon: <CardIcon active={activeTab === 'flux'} theme={theme} /> },
    { id: 'fait',       label: t(lang, 'fait'),       icon: <CheckIcon active={activeTab === 'fait'} theme={theme} />, badge: doneCount },
    { id: 'incubateur', label: t(lang, 'incubateur'), icon: <ClockIcon active={activeTab === 'incubateur'} theme={theme} />, badge: incubatorCount },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.bg }]}>
      {/* Level progress bar */}
      <View style={styles.levelRow}>
        <Text style={[styles.levelName, { color: level.color }]}>
          Nv.{level.level} {level.name}
        </Text>
        <Text style={[styles.levelPts, { color: theme.muted }]}>
          {next ? `${points} / ${next.min}` : `${points} — MAX`}
        </Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: theme.chain }]}>
        <View style={[styles.progressBar, { width: `${Math.round(progress * 100)}%`, backgroundColor: level.color }]} />
      </View>

      {/* Tabs */}
      <View style={styles.bar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.item, activeTab === tab.id && styles.itemActive]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <View>
              {tab.icon}
              {tab.badge > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                  <Text style={[styles.badgeText, { color: theme.bg }]}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, { color: theme.text }, activeTab === tab.id && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function CardIcon({ active, theme }) {
  return (
    <View style={[styles.iconRect, { borderColor: theme.text, opacity: active ? 1 : 0.4 }]}>
      <View style={[styles.iconLine, { backgroundColor: theme.text }]} />
    </View>
  );
}

function CheckIcon({ active, theme }) {
  return (
    <View style={[styles.checkWrap, { opacity: active ? 1 : 0.4 }]}>
      <Text style={[styles.checkText, { color: theme.text }]}>✓</Text>
    </View>
  );
}

function ClockIcon({ active, theme }) {
  return (
    <View style={[styles.checkWrap, { opacity: active ? 1 : 0.4 }]}>
      <Text style={[styles.checkText, { color: theme.text }]}>◷</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingBottom: 36, paddingTop: 8 },
  levelRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 28, marginBottom: 6,
  },
  levelName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 11, letterSpacing: 1 },
  levelPts:  { fontFamily: 'DMSans_300Light', fontSize: 10, letterSpacing: 1 },
  progressTrack: {
    height: 2, marginHorizontal: 28, borderRadius: 2, marginBottom: 12, overflow: 'hidden',
  },
  progressBar: { height: 2, borderRadius: 2, minWidth: 4 },
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingHorizontal: 28,
  },
  item: { alignItems: 'center', gap: 4, opacity: 0.35 },
  itemActive: { opacity: 1 },
  label: {
    fontFamily: 'PlayfairDisplay_400Regular', fontSize: 9,
    letterSpacing: 2, textTransform: 'uppercase',
  },
  labelActive: {},
  badge: {
    position: 'absolute', top: -4, right: -8,
    width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 9 },
  iconRect: { width: 22, height: 16, borderWidth: 1.8, borderRadius: 3, justifyContent: 'center' },
  iconLine: { height: 1.8, marginHorizontal: 3, marginTop: 4 },
  checkWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  checkText: { fontSize: 20 },
});

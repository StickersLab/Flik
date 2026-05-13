import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = [
  {
    id: 'flux',
    label: 'flux',
    icon: (active) => (
      <View style={[styles.iconRect, active && styles.iconActive]}>
        <View style={[styles.iconLine, active && styles.iconLineActive]} />
      </View>
    ),
  },
  {
    id: 'incubateur',
    label: 'incubateur',
    icon: (active, badge) => (
      <View>
        <HexIcon active={active} />
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    ),
  },
  {
    id: 'fait',
    label: 'fait',
    icon: (active) => <CheckIcon active={active} />,
  },
];

function HexIcon({ active }) {
  return (
    <View style={[styles.hexWrap, active && styles.hexActive]}>
      <Text style={[styles.hexText, active && styles.hexTextActive]}>◆</Text>
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

export function BottomBar({ activeTab, onTabChange, doneCount }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const badge = tab.id === 'fait' ? doneCount : 0;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            {tab.icon(isActive, badge)}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingBottom: 36,
    paddingTop: 12,
    justifyContent: 'space-around',
    backgroundColor: '#f5f3ee',
  },
  item: {
    alignItems: 'center',
    gap: 4,
    opacity: 0.3,
  },
  itemActive: {
    opacity: 1,
  },
  label: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 9,
    letterSpacing: 2,
    color: '#1a1a1a',
    textTransform: 'uppercase',
  },
  labelActive: {
    color: '#1a1a1a',
  },
  iconRect: {
    width: 22,
    height: 16,
    borderWidth: 1.8,
    borderColor: '#1a1a1a',
    borderRadius: 3,
  },
  iconActive: {
    borderColor: '#1a1a1a',
  },
  iconLine: {
    height: 1.8,
    backgroundColor: '#1a1a1a',
    marginTop: 5,
    marginHorizontal: 2,
  },
  iconLineActive: {
    backgroundColor: '#1a1a1a',
  },
  hexWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexActive: {},
  hexText: {
    fontSize: 18,
    color: '#1a1a1a',
  },
  hexTextActive: {
    color: '#1a1a1a',
  },
  checkWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 20,
    color: '#1a1a1a',
  },
  checkTextActive: {
    color: '#1a1a1a',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#1a1a1a',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 9,
    color: '#f5f3ee',
  },
});

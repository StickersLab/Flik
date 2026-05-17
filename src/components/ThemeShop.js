import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Platform,
} from 'react-native';
import { THEMES, TIER_LABELS } from '../data/themes';
import { getSoundSet, resumeAudio } from '../sounds/webAudioThemes';
import { t } from '../i18n/strings';

// ─────────────────────────────────────────────────────────────
//  ThemeShop — full-screen overlay
// ─────────────────────────────────────────────────────────────

export function ThemeShop({
  visible, onClose,
  currentTheme, purchasedThemes, credits,
  onUnlock, onApply,
  lang,
}) {
  const [preview, setPreview] = useState(null); // theme id being previewed

  if (!visible) return null;

  const previewTheme = preview ? THEMES.find((t) => t.id === preview) : null;

  return (
    <View style={[styles.overlay, { backgroundColor: currentTheme.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={previewTheme ? () => setPreview(null) : onClose} activeOpacity={0.7}>
          <Text style={[styles.back, { color: currentTheme.muted }]}>
            {previewTheme ? '←' : '✕'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentTheme.text }]}>
          {previewTheme ? previewTheme.name.toUpperCase() : t(lang, 'boutique')}
        </Text>
        <View style={[styles.creditsBadge, { backgroundColor: currentTheme.chain }]}>
          <Text style={[styles.creditsText, { color: currentTheme.text }]}>🪙 {credits}</Text>
        </View>
      </View>

      {previewTheme ? (
        <PreviewPanel
          theme={previewTheme}
          currentTheme={currentTheme}
          purchased={purchasedThemes.includes(previewTheme.id)}
          credits={credits}
          onUnlock={() => onUnlock(previewTheme.id, previewTheme.cost)}
          onApply={() => { onApply(previewTheme.id); setPreview(null); onClose(); }}
          lang={lang}
        />
      ) : (
        <ThemeGrid
          currentThemeId={currentTheme.id}
          purchasedThemes={purchasedThemes}
          onSelect={setPreview}
          lang={lang}
        />
      )}
    </View>
  );
}

// ── Grid ─────────────────────────────────────────────────────
function ThemeGrid({ currentThemeId, purchasedThemes, onSelect }) {
  const tiers = [0, 1, 2, 3, 4];
  return (
    <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
      {tiers.map((tier) => {
        const group = THEMES.filter((t) => t.tier === tier);
        return (
          <View key={tier}>
            <Text style={styles.tierLabel}>
              {tier === 0 ? '🆓 Gratuit' : `🔒 Tier ${tier} — ${TIER_LABELS[tier]}`}
            </Text>
            <View style={styles.row}>
              {group.map((th) => {
                const owned = purchasedThemes.includes(th.id);
                const active = th.id === currentThemeId;
                return (
                  <TouchableOpacity
                    key={th.id}
                    style={[styles.card, { backgroundColor: th.card, borderColor: active ? th.accent : 'transparent', borderWidth: active ? 2 : 0 }]}
                    onPress={() => onSelect(th.id)}
                    activeOpacity={0.85}
                  >
                    {/* Mini card preview */}
                    <View style={[styles.cardBg, { backgroundColor: th.bg }]}>
                      <View style={[styles.cardMini, { backgroundColor: th.card, borderColor: th.chain }]}>
                        <Text style={[styles.cardMiniF, { color: `${th.text}20` }]}>F</Text>
                      </View>
                    </View>
                    <Text style={[styles.cardName, { color: th.text, backgroundColor: th.card }]} numberOfLines={1}>{th.name}</Text>
                    {!owned && (
                      <View style={[styles.lockBadge, { backgroundColor: th.card }]}>
                        <Text style={[styles.lockText, { color: th.muted }]}>🔒 {th.cost}</Text>
                      </View>
                    )}
                    {active && (
                      <View style={[styles.activeDot, { backgroundColor: th.accent }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

// ── Preview panel ─────────────────────────────────────────────
function PreviewPanel({ theme, currentTheme, purchased, credits, onUnlock, onApply, lang }) {
  const canAfford = credits >= theme.cost;
  const [soundPlaying, setSoundPlaying] = useState(null);

  function testSound(type) {
    setSoundPlaying(type);
    resumeAudio();
    const set = getSoundSet(theme.soundSet);
    set[type]?.();
    setTimeout(() => setSoundPlaying(null), 800);
  }

  return (
    <ScrollView contentContainerStyle={styles.preview}>
      {/* Live preview card */}
      <View style={[styles.previewArena, { backgroundColor: theme.bg }]}>
        <View style={[styles.previewBack2, { backgroundColor: theme.cardBack, transform: [{ translateY: 18 }, { scale: 0.92 }] }]} />
        <View style={[styles.previewBack1, { backgroundColor: theme.cardBack, transform: [{ translateY: 9 }, { scale: 0.96 }] }]} />
        <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.chain }]}>
          <Text style={[styles.previewCardLabel, { color: theme.muted }]}>TÂCHE</Text>
          <Text style={[styles.previewCardF, { color: `${theme.text}08` }]}>F</Text>
          <Text style={[styles.previewCardTitle, { color: theme.text }]}>Appeler le dentiste</Text>
          <View style={[styles.previewChain, { backgroundColor: theme.chain }]}>
            <Text style={[styles.previewChainText, { color: theme.muted }]}>⛓ action requise</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={[styles.previewDesc, { color: currentTheme.muted }]}>{theme.desc}</Text>

      {/* Sound test buttons */}
      <Text style={[styles.soundLabel, { color: currentTheme.muted }]}>TESTER LES SONS</Text>
      <View style={styles.soundBtns}>
        {[
          { id: 'crumple', label: '← Supprimer' },
          { id: 'whoosh',  label: '→ Plus tard' },
          { id: 'ding',    label: '↑ Fait' },
        ].map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.soundBtn, { backgroundColor: soundPlaying === s.id ? theme.accent : theme.chain }]}
            onPress={() => testSound(s.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.soundBtnText, { color: soundPlaying === s.id ? theme.bg : theme.text }]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      {purchased ? (
        <TouchableOpacity style={[styles.unlockBtn, { backgroundColor: theme.accent }]} onPress={onApply} activeOpacity={0.8}>
          <Text style={[styles.unlockBtnText, { color: theme.bg }]}>{t(lang, 'appliquer')}</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={[styles.costText, { color: currentTheme.muted }]}>
            {theme.cost} 🪙  •  {t(lang, 'solde')} : {credits} 🪙
          </Text>
          <TouchableOpacity
            style={[styles.unlockBtn, { backgroundColor: canAfford ? '#f0c040' : currentTheme.chain, opacity: canAfford ? 1 : 0.6 }]}
            onPress={canAfford ? onUnlock : null}
            activeOpacity={0.8}
          >
            <Text style={[styles.unlockBtnText, { color: canAfford ? '#1a1a1a' : currentTheme.muted }]}>
              {canAfford ? t(lang, 'debloquer') : t(lang, 'insuffisant')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 500,
    ...(Platform.OS === 'web' ? { position: 'fixed' } : {}),
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16,
  },
  back:  { fontSize: 22, paddingRight: 12 },
  title: { fontFamily: 'PlayfairDisplay_900Black', fontSize: 18, letterSpacing: 4, flex: 1, textAlign: 'center' },
  creditsBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  creditsText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 12 },
  tierLabel: {
    fontFamily: 'DMSans_400Regular', fontSize: 10,
    letterSpacing: 2, color: '#aaa',
    textTransform: 'uppercase', paddingHorizontal: 16, paddingVertical: 10,
  },
  grid: { paddingBottom: 80 },
  row: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  card: {
    width: '44%', margin: '3%',
    borderRadius: 16, overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    }),
  },
  cardBg: { height: 80, alignItems: 'center', justifyContent: 'center' },
  cardMini: {
    width: 52, height: 62, borderRadius: 8,
    borderWidth: 0.5, alignItems: 'center', justifyContent: 'center',
  },
  cardMiniF: { fontFamily: 'PlayfairDisplay_900Black', fontSize: 28 },
  cardName: {
    fontFamily: 'PlayfairDisplay_500Medium', fontSize: 12,
    letterSpacing: 1, textAlign: 'center', paddingVertical: 6,
  },
  lockBadge: {
    position: 'absolute', top: 6, right: 6,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10,
  },
  lockText: { fontSize: 9, fontFamily: 'DMSans_400Regular' },
  activeDot: {
    position: 'absolute', top: 6, left: 6,
    width: 8, height: 8, borderRadius: 4,
  },
  // Preview
  preview: { paddingHorizontal: 24, paddingBottom: 80 },
  previewArena: {
    height: 200, borderRadius: 20, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    position: 'relative',
  },
  previewCard: {
    width: 200, height: 140, borderRadius: 16,
    borderWidth: 0.5, padding: 16,
    justifyContent: 'space-between', zIndex: 3,
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
    }),
  },
  previewBack1: { position: 'absolute', width: 200, height: 140, borderRadius: 16, zIndex: 2 },
  previewBack2: { position: 'absolute', width: 200, height: 140, borderRadius: 16, zIndex: 1 },
  previewCardLabel: { fontFamily: 'DMSans_300Light', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' },
  previewCardF: { position: 'absolute', fontFamily: 'PlayfairDisplay_900Black', fontSize: 90, alignSelf: 'center', top: 20 },
  previewCardTitle: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 15, lineHeight: 20 },
  previewChain: { alignSelf: 'flex-end', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  previewChainText: { fontFamily: 'DMSans_400Regular', fontSize: 9, letterSpacing: 1 },
  previewDesc: { fontFamily: 'DMSans_400Regular', fontSize: 13, letterSpacing: 0.5, textAlign: 'center', marginBottom: 24 },
  soundLabel: { fontFamily: 'DMSans_400Regular', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 },
  soundBtns: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 24 },
  soundBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  soundBtnText: { fontFamily: 'DMSans_400Regular', fontSize: 11, letterSpacing: 1 },
  costText: { fontFamily: 'DMSans_400Regular', fontSize: 11, letterSpacing: 1, textAlign: 'center', marginBottom: 12 },
  unlockBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  unlockBtnText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 13, letterSpacing: 3 },
});

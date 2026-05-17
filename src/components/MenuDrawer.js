import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView, TextInput, Switch, Platform,
} from 'react-native';
import { t, LANG_NAMES } from '../i18n/strings';

// ─────────────────────────────────────────────────────────────
//  MenuDrawer — slides from the right
//  Sections: profile | themes | stats | settings | feedback
// ─────────────────────────────────────────────────────────────

export function MenuDrawer({
  visible, onClose, section, onSection,
  theme, lang,
  // profile
  userName, userEmail, streak, points, credits,
  // stats
  doneCount, deletedCount, incubatorCount, bestStreak, dailyDone,
  // settings
  soundsEnabled, onToggleSounds, onLanguage,
  // themes (delegated to ThemeShop)
  onOpenShop,
  // feedback
  onSignOut,
}) {
  const tx = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(tx, {
      toValue: visible ? 0 : 300,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null; // keep it cheap when hidden
  const s = lang;

  return (
    <>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.drawer, { backgroundColor: theme.bg, transform: [{ translateX: tx }] }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.drawerContent}>

          {/* ── User info ── */}
          <View style={[styles.userSection, { borderBottomColor: theme.chain }]}>
            <Text style={[styles.userName, { color: theme.text }]}>{userName || '—'}</Text>
            <Text style={[styles.userEmail, { color: theme.muted }]}>{userEmail || ''}</Text>
            <View style={styles.userStats}>
              <Pill emoji="🔥" value={`${streak}j`} theme={theme} />
              <Pill emoji="⭐" value={String(points)} theme={theme} />
              <Pill emoji="🪙" value={String(credits)} theme={theme} />
            </View>
          </View>

          {/* ── Nav items ── */}
          {[
            { id: 'profile', icon: '👤', label: t(s, 'monProfil') },
            { id: 'themes',  icon: '🎨', label: t(s, 'themes') },
            { id: 'stats',   icon: '📊', label: t(s, 'mesStats') },
            { id: 'settings',icon: '⚙️', label: t(s, 'parametres') },
            { id: 'feedback',icon: '💬', label: t(s, 'feedback') },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, section === item.id && { backgroundColor: theme.chain }, { borderBottomColor: theme.chain }]}
              onPress={() => onSection(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.navChevron, { color: theme.muted }]}>›</Text>
            </TouchableOpacity>
          ))}

          {/* ── Section content ── */}
          {section === 'profile' && (
            <ProfileSection
              theme={theme} lang={s}
              userName={userName} email={userEmail}
              streak={streak} bestStreak={bestStreak}
              points={points} credits={credits}
            />
          )}
          {section === 'themes' && (
            <ThemesSection theme={theme} lang={s} onOpenShop={onOpenShop} />
          )}
          {section === 'stats' && (
            <StatsSection
              theme={theme} lang={s}
              doneCount={doneCount} deletedCount={deletedCount}
              incubatorCount={incubatorCount} bestStreak={bestStreak}
              dailyDone={dailyDone}
            />
          )}
          {section === 'settings' && (
            <SettingsSection
              theme={theme} lang={s}
              soundsEnabled={soundsEnabled}
              onToggleSounds={onToggleSounds}
              currentLang={lang}
              onLanguage={onLanguage}
            />
          )}
          {section === 'feedback' && (
            <FeedbackSection theme={theme} lang={s} />
          )}

          {/* ── Logout ── */}
          <TouchableOpacity style={styles.logout} onPress={onSignOut} activeOpacity={0.7}>
            <Text style={[styles.logoutText, { color: theme.muted }]}>{t(s, 'seDeconnecter')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </>
  );
}

// ── Pill stat ────────────────────────────────────────────────
function Pill({ emoji, value, theme }) {
  return (
    <View style={[styles.pill, { backgroundColor: theme.chain }]}>
      <Text style={styles.pillEmoji}>{emoji}</Text>
      <Text style={[styles.pillValue, { color: theme.text, fontFamily: 'PlayfairDisplay_700Bold' }]}>{value}</Text>
    </View>
  );
}

// ── Sections ─────────────────────────────────────────────────
function ProfileSection({ theme, lang, userName, email, streak, bestStreak, points, credits }) {
  return (
    <View style={styles.section}>
      <StatRow label={t(lang, 'meilleureStreak')} value={`${bestStreak} ${t(lang, 'jours')}`} theme={theme} />
      <StatRow label="Points totaux" value={String(points)} theme={theme} />
      <StatRow label={t(lang, 'solde')} value={`${credits} 🪙`} theme={theme} />
    </View>
  );
}

function ThemesSection({ theme, lang, onOpenShop }) {
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={[styles.shopBtn, { backgroundColor: theme.accent }]}
        onPress={onOpenShop}
        activeOpacity={0.8}
      >
        <Text style={[styles.shopBtnText, { color: theme.bg }]}>🎨  {t(lang, 'boutique')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function StatsSection({ theme, lang, doneCount, deletedCount, incubatorCount, bestStreak, dailyDone }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayNames = [t(lang,'dim'),t(lang,'lun'),t(lang,'mar'),t(lang,'mer'),t(lang,'jeu'),t(lang,'ven'),t(lang,'sam')];
    days.push({ label: dayNames[d.getDay()], count: dailyDone[key] || 0 });
  }
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <View style={styles.section}>
      <StatRow label={t(lang, 'tachesAccomplies')} value={String(doneCount)} theme={theme} />
      <StatRow label={t(lang, 'tachesSupprimees')} value={String(deletedCount)} theme={theme} />
      <StatRow label={t(lang, 'tachesIncubateur')} value={String(incubatorCount)} theme={theme} />
      <StatRow label={t(lang, 'meilleureStreak')} value={`${bestStreak} ${t(lang,'jours')}`} theme={theme} />

      {/* Weekly bar chart */}
      <View style={styles.chart}>
        {days.map((d, i) => (
          <View key={i} style={styles.chartCol}>
            <View style={[styles.chartBar, {
              height: Math.max(4, (d.count / maxCount) * 60),
              backgroundColor: d.count > 0 ? theme.accent : theme.chain,
            }]} />
            <Text style={[styles.chartLabel, { color: theme.muted }]}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SettingsSection({ theme, lang, soundsEnabled, onToggleSounds, currentLang, onLanguage }) {
  return (
    <View style={styles.section}>
      <View style={[styles.settingRow, { borderBottomColor: theme.chain }]}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>{t(lang, 'sons')}</Text>
        <Switch
          value={soundsEnabled}
          onValueChange={onToggleSounds}
          trackColor={{ false: theme.chain, true: theme.accent }}
          thumbColor={theme.card}
        />
      </View>
      <Text style={[styles.settingGroupLabel, { color: theme.muted }]}>{t(lang, 'langue')}</Text>
      {Object.entries(LANG_NAMES).map(([code, name]) => (
        <TouchableOpacity
          key={code}
          style={[styles.langRow, { borderBottomColor: theme.chain }]}
          onPress={() => onLanguage(code)}
          activeOpacity={0.7}
        >
          <Text style={[styles.langName, { color: currentLang === code ? theme.accent : theme.text }]}>{name}</Text>
          {currentLang === code && <Text style={{ color: theme.accent }}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function FeedbackSection({ theme, lang }) {
  const [text, setText] = React.useState('');
  const [sent, setSent]   = React.useState(false);

  function send() {
    if (!text.trim()) return;
    // In production: send to an API
    console.log('[Feedback]', text);
    setSent(true);
    setText('');
  }

  return (
    <View style={styles.section}>
      {sent ? (
        <Text style={[styles.thankYou, { color: theme.accent }]}>{t(lang, 'merci')}</Text>
      ) : (
        <>
          <TextInput
            style={[styles.feedbackInput, { borderColor: theme.chain, color: theme.text }]}
            multiline
            numberOfLines={4}
            value={text}
            onChangeText={setText}
            placeholder={t(lang, 'votreSuggestion')}
            placeholderTextColor={theme.muted}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: theme.accent }]}
            onPress={send}
            activeOpacity={0.8}
          >
            <Text style={[styles.sendBtnText, { color: theme.bg }]}>{t(lang, 'envoyer')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

function StatRow({ label, value, theme }) {
  return (
    <View style={[styles.statRow, { borderBottomColor: theme.chain }]}>
      <Text style={[styles.statLabel, { color: theme.muted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 400,
    ...(Platform.OS === 'web' ? { position: 'fixed' } : {}),
  },
  drawer: {
    position: 'absolute', top: 0, right: 0, bottom: 0,
    width: 290,
    zIndex: 401,
    ...(Platform.OS === 'web' ? { position: 'fixed' } : {}),
    ...Platform.select({
      web: { boxShadow: '-4px 0 20px rgba(0,0,0,0.15)' },
      default: { shadowColor: '#000', shadowOffset: { width: -2, height: 0 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 10 },
    }),
  },
  drawerContent: { paddingBottom: 48 },
  userSection: {
    paddingTop: 64, paddingHorizontal: 28, paddingBottom: 20,
    borderBottomWidth: 0.5, marginBottom: 8,
  },
  userName:  { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, letterSpacing: 1 },
  userEmail: { fontFamily: 'DMSans_400Regular', fontSize: 11, marginTop: 4, letterSpacing: 0.5 },
  userStats: { flexDirection: 'row', gap: 8, marginTop: 12 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pillEmoji: { fontSize: 12 },
  pillValue: { fontSize: 12 },
  navItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 28, paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  navIcon:    { fontSize: 16, marginRight: 12 },
  navLabel:   { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 16, flex: 1, letterSpacing: 0.5 },
  navChevron: { fontFamily: 'DMSans_400Regular', fontSize: 20 },
  section:    { paddingHorizontal: 28, paddingTop: 16 },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 0.5,
  },
  statLabel: { fontFamily: 'DMSans_400Regular', fontSize: 12, letterSpacing: 0.5 },
  statValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 13 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 20, height: 80 },
  chartCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartBar: { width: '100%', borderRadius: 3, minHeight: 4 },
  chartLabel: { fontFamily: 'DMSans_400Regular', fontSize: 9, letterSpacing: 1 },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 0.5,
  },
  settingLabel: { fontFamily: 'DMSans_400Regular', fontSize: 14 },
  settingGroupLabel: {
    fontFamily: 'DMSans_400Regular', fontSize: 10,
    letterSpacing: 2, textTransform: 'uppercase', marginTop: 20, marginBottom: 8,
  },
  langRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 0.5,
  },
  langName: { fontFamily: 'DMSans_400Regular', fontSize: 14 },
  feedbackInput: {
    fontFamily: 'DMSans_400Regular', fontSize: 14,
    borderWidth: 1, borderRadius: 10,
    padding: 12, minHeight: 100, textAlignVertical: 'top',
  },
  sendBtn: {
    marginTop: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
  },
  sendBtnText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 13, letterSpacing: 3 },
  thankYou: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, letterSpacing: 2, textAlign: 'center', paddingTop: 20 },
  shopBtn: {
    paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8,
  },
  shopBtnText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 13, letterSpacing: 3 },
  logout: { paddingHorizontal: 28, paddingTop: 32 },
  logoutText: { fontFamily: 'DMSans_400Regular', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
});

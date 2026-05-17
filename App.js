import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, SafeAreaView, StatusBar, Platform, ScrollView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
} from '@expo-google-fonts/playfair-display';
import { DMSans_300Light, DMSans_400Regular } from '@expo-google-fonts/dm-sans';

import { Stack, ClearedScreen }  from './src/components/Stack';
import { BottomBar }             from './src/components/BottomBar';
import { AddModal }              from './src/components/AddModal';
import { RewardAnimation }       from './src/components/RewardAnimation';
import { MenuDrawer }            from './src/components/MenuDrawer';
import { ThemeShop }             from './src/components/ThemeShop';
import { useSounds }             from './src/hooks/useSounds';
import { useStorage }            from './src/hooks/useStorage';
import { initialTasks }          from './src/data/initialTasks';
import { getLevel }              from './src/data/levels';
import { getTheme }              from './src/data/themes';
import { t }                     from './src/i18n/strings';

let _nextId = 100;
function nextId() { return String(++_nextId); }

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    DMSans_300Light,
    DMSans_400Regular,
  });

  const storage = useStorage(initialTasks);
  const {
    queue, setQueue,
    doneList, setDoneList,
    incubatorList, setIncubatorList,
    points, credits, streak, bestStreak,
    streakPtsToday, streakCrToday,
    purchasedThemes, currentThemeId,
    deletedCount, dailyDone,
    soundsEnabled, language,
    loaded,
    validateTask, incrementDeleted,
    unlockTheme, updateTheme,
    updateSoundsEnabled, updateLanguage,
  } = storage;

  const theme = getTheme(currentThemeId);
  const lang  = language;

  const { playCrumple, playWhoosh, playDing, setSoundTheme } = useSounds(soundsEnabled);

  // Keep sound theme in sync
  useEffect(() => {
    if (loaded) setSoundTheme(theme.soundSet);
  }, [currentThemeId, loaded]);

  const [undoAction,  setUndoAction]  = useState(null);
  const [activeTab,   setActiveTab]   = useState('flux');
  const [showModal,   setShowModal]   = useState(false);
  const [undoEntry,   setUndoEntry]   = useState(false);
  const [showMenu,    setShowMenu]    = useState(false);
  const [menuSection, setMenuSection] = useState(null);
  const [showShop,    setShowShop]    = useState(false);

  const [reward, setReward] = useState({ visible: false, type: 'task', pts: 0, levelName: '' });

  const undoOpacity    = useRef(new Animated.Value(0)).current;
  const undoTranslateY = useRef(new Animated.Value(10)).current;
  const undoTimer      = useRef(null);
  const prevLevelRef   = useRef(null);

  // Streak bonus reward on open
  useEffect(() => {
    if (!loaded || (streakPtsToday === 0 && streakCrToday === 0)) return;
    const timer = setTimeout(() => {
      setReward({ visible: true, type: 'streak', pts: streakPtsToday, levelName: '' });
    }, 800);
    return () => clearTimeout(timer);
  }, [loaded]);

  useEffect(() => {
    if (loaded) prevLevelRef.current = getLevel(points).level;
  }, [loaded]);

  function showUndoToast() {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    Animated.parallel([
      Animated.timing(undoOpacity,    { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(undoTranslateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
    undoTimer.current = setTimeout(hideUndoToast, 5000);
  }

  function hideUndoToast() {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    Animated.parallel([
      Animated.timing(undoOpacity,    { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(undoTranslateY, { toValue: 10, duration: 250, useNativeDriver: true }),
    ]).start(() => setUndoAction(null));
  }

  function checkLevelUp(newPoints) {
    const prevLevel = prevLevelRef.current;
    const newLevel  = getLevel(newPoints);
    if (prevLevel && newLevel.level > prevLevel) {
      prevLevelRef.current = newLevel.level;
      setTimeout(() => {
        setReward({ visible: true, type: 'levelup', pts: 0, levelName: newLevel.name });
      }, 800);
    } else {
      prevLevelRef.current = newLevel.level;
    }
  }

  const handleSwipe = useCallback((direction) => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      const [top, ...rest] = prev;

      if (direction === 'left') {
        playCrumple();
        incrementDeleted();
        setUndoAction({ task: top, direction: 'left' });
        showUndoToast();
        return rest;
      }

      if (direction === 'right') {
        playWhoosh();
        // Right swipe → incubateur
        setIncubatorList((inc) => [...inc, { ...top, incubatedAt: new Date().toISOString() }]);
        setUndoAction({ task: top, direction: 'right' });
        showUndoToast();
        return rest;
      }

      if (direction === 'up') {
        playDing();
        setDoneList((done) => [{ ...top, completedAt: new Date().toISOString() }, ...done]);
        const earned = validateTask();
        if (earned > 0) {
          setReward({ visible: true, type: 'task', pts: earned, levelName: '' });
          checkLevelUp(points + earned);
        }
        return rest;
      }

      return prev;
    });
  }, [points]);

  function handleUndo() {
    if (!undoAction) return;
    hideUndoToast();

    if (undoAction.direction === 'left') {
      setUndoEntry(true);
      setQueue((prev) => [undoAction.task, ...prev]);
      setTimeout(() => setUndoEntry(false), 50);
    } else if (undoAction.direction === 'right') {
      // Remove from incubateur, put back in flux
      setIncubatorList((inc) => inc.filter((t) => t.id !== undoAction.task.id));
      setUndoEntry(false);
      setQueue((prev) => [undoAction.task, ...prev]);
    }
  }

  function handleAdd(task) {
    setQueue((prev) => [...prev, { ...task, id: nextId() }]);
  }

  function restoreFromIncubator(taskId) {
    setIncubatorList((inc) => inc.filter((t) => t.id !== taskId));
    const task = incubatorList.find((t) => t.id === taskId);
    if (task) {
      const { incubatedAt: _, ...clean } = task;
      setQueue((prev) => [clean, ...prev]);
    }
  }

  // ── Menu handlers ─────────────────────────────────────────
  function openMenu() {
    setMenuSection(null);
    setShowMenu(true);
  }

  function handleUnlockTheme(themeId, cost) {
    const ok = unlockTheme(themeId, cost);
    if (ok) setReward({ visible: true, type: 'task', pts: 0, levelName: '' });
    return ok;
  }

  const undoMessage = undoAction?.direction === 'right' ? t(lang, 'remiseEnPile') : t(lang, 'supprimee');

  if ((!fontsLoaded && !fontError) || !loaded) return null;

  return (
    <GestureHandlerRootView
      style={{ flex: 1, ...(Platform.OS === 'web' && { height: '100vh' }) }}
    >
      <StatusBar barStyle={theme.text === '#1a1a1a' ? 'dark-content' : 'light-content'} />
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <View style={[styles.app, { backgroundColor: theme.bg }]}>

          {/* ── Header ───────────────────────────────────────── */}
          <View style={styles.header}>
            {/* Hamburger */}
            <TouchableOpacity onPress={openMenu} activeOpacity={0.7} style={styles.hamburger}>
              <View style={[styles.hLine, { backgroundColor: theme.text }]} />
              <View style={[styles.hLine, { backgroundColor: theme.text }]} />
              <View style={[styles.hLine, { backgroundColor: theme.text }]} />
            </TouchableOpacity>

            {/* Logo */}
            <Text style={[styles.logo, { color: theme.text }]}>FLIK</Text>

            {/* Stats */}
            <View style={styles.headerStats}>
              {streak > 0 && (
                <View style={styles.statChip}>
                  <Text style={styles.statEmoji}>🔥</Text>
                  <Text style={[styles.statVal, { color: theme.text }]}>{t(lang, 'streak', streak)}</Text>
                </View>
              )}
              <View style={styles.statChip}>
                <Text style={styles.statEmoji}>⭐</Text>
                <Text style={[styles.statVal, { color: theme.text }]}>{points}</Text>
              </View>
              <TouchableOpacity
                style={[styles.statChip, styles.creditChip, { backgroundColor: theme.chain }]}
                onPress={() => { setShowMenu(true); setMenuSection('themes'); }}
                activeOpacity={0.8}
              >
                <Text style={styles.statEmoji}>🪙</Text>
                <Text style={[styles.statVal, { color: theme.text }]}>{credits}</Text>
              </TouchableOpacity>
              {/* Add button */}
              <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.text }]} onPress={() => setShowModal(true)} activeOpacity={0.85}>
                <Text style={[styles.addBtnText, { color: theme.bg }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Arena ────────────────────────────────────────── */}
          <View style={styles.arena}>
            {activeTab === 'flux' && (
              <>
                <Stack queue={queue} onSwipe={handleSwipe} undoEntry={undoEntry} theme={theme} />
                <ClearedScreen visible={queue.length === 0} theme={theme} />

                <RewardAnimation
                  visible={reward.visible}
                  type={reward.type}
                  points={reward.pts}
                  levelName={reward.levelName}
                  onDone={() => setReward((r) => ({ ...r, visible: false }))}
                />

                <View style={styles.counterArea}>
                  <Text style={[styles.counterNum, { color: theme.text }]}>{queue.length}</Text>
                  <Text style={[styles.counterLbl, { color: theme.muted }]}>{t(lang, 'restantes')}</Text>
                </View>

                {/* Undo toast */}
                <Animated.View
                  style={[styles.undoToast, { backgroundColor: theme.text, opacity: undoOpacity, transform: [{ translateY: undoTranslateY }] }]}
                  pointerEvents="box-none"
                >
                  <Text style={[styles.undoText, { color: theme.bg }]}>{undoMessage}</Text>
                  <TouchableOpacity onPress={handleUndo} activeOpacity={0.7}>
                    <Text style={[styles.undoBtn, { color: '#f0c040' }]}>{t(lang, 'annuler')}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}

            {activeTab === 'fait' && (
              <DoneList doneList={doneList} theme={theme} lang={lang} />
            )}

            {activeTab === 'incubateur' && (
              <IncubateurList
                list={incubatorList}
                onRestore={restoreFromIncubator}
                theme={theme}
                lang={lang}
              />
            )}
          </View>

          <BottomBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            doneCount={doneList.length}
            incubatorCount={incubatorList.length}
            points={points}
            theme={theme}
            lang={lang}
          />
        </View>
      </SafeAreaView>

      <AddModal visible={showModal} onClose={() => setShowModal(false)} onAdd={handleAdd} />

      {showMenu && (
        <MenuDrawer
          visible={showMenu}
          onClose={() => { setShowMenu(false); setMenuSection(null); }}
          section={menuSection}
          onSection={setMenuSection}
          theme={theme}
          lang={lang}
          userName=""
          userEmail=""
          streak={streak}
          points={points}
          credits={credits}
          doneCount={doneList.length}
          deletedCount={deletedCount}
          incubatorCount={incubatorList.length}
          bestStreak={bestStreak}
          dailyDone={dailyDone}
          soundsEnabled={soundsEnabled}
          onToggleSounds={updateSoundsEnabled}
          onLanguage={updateLanguage}
          onOpenShop={() => { setShowMenu(false); setShowShop(true); }}
          onSignOut={() => {}}
        />
      )}

      {showShop && (
        <ThemeShop
          visible={showShop}
          onClose={() => setShowShop(false)}
          currentTheme={theme}
          purchasedThemes={purchasedThemes}
          credits={credits}
          onUnlock={handleUnlockTheme}
          onApply={updateTheme}
          lang={lang}
        />
      )}
    </GestureHandlerRootView>
  );
}

// ── Tab lists ─────────────────────────────────────────────────
function DoneList({ doneList, theme, lang }) {
  return (
    <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
      <Text style={[styles.listTitle, { color: theme.text }]}>{t(lang, 'fait').toUpperCase()}</Text>
      {doneList.length === 0 ? (
        <Text style={[styles.listEmpty, { color: theme.muted }]}>{t(lang, 'aucuneTacheFaite')}</Text>
      ) : doneList.map((task) => (
        <View key={task.id + (task.completedAt || '')} style={[styles.listItem, { borderBottomColor: theme.chain }]}>
          <Text style={[styles.listItemText, { color: theme.text }]}>{task.title}</Text>
          {task.chainNote ? <Text style={[styles.listItemNote, { color: theme.muted }]}>↳ {task.chainNote}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

function IncubateurList({ list, onRestore, theme, lang }) {
  return (
    <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
      <Text style={[styles.listTitle, { color: theme.text }]}>{t(lang, 'incubateur').toUpperCase()}</Text>
      {list.length === 0 ? (
        <Text style={[styles.listEmpty, { color: theme.muted }]}>{t(lang, 'aucuneTacheIncubateur')}</Text>
      ) : list.map((task) => (
        <View key={task.id} style={[styles.listItem, { borderBottomColor: theme.chain }]}>
          <Text style={[styles.listItemText, { color: theme.text, flex: 1 }]}>{task.title}</Text>
          <TouchableOpacity
            style={[styles.restoreBtn, { backgroundColor: theme.chain }]}
            onPress={() => onRestore(task.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.restoreBtnText, { color: theme.muted }]}>{t(lang, 'restaurer')}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:  { flex: 1 },
  app:   { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  hamburger: { gap: 5, padding: 4 },
  hLine: { width: 22, height: 1.5, borderRadius: 1 },
  logo: {
    fontFamily: 'PlayfairDisplay_900Black', fontSize: 24, letterSpacing: 6,
    position: 'absolute', left: 0, right: 0, textAlign: 'center',
  },
  headerStats: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  creditChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statEmoji: { fontSize: 12 },
  statVal: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 12 },
  addBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginLeft: 4,
  },
  addBtnText: { fontSize: 20, lineHeight: 22, fontWeight: '300' },
  arena:  { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  counterArea: { marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 6 },
  counterNum: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 15 },
  counterLbl: { fontFamily: 'DMSans_300Light', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  undoToast: {
    position: 'absolute', bottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30,
  },
  undoText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 12, letterSpacing: 1 },
  undoBtn:  { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 10, letterSpacing: 3 },
  listContainer: { flex: 1, width: '100%' },
  listContent: { paddingHorizontal: 32, paddingTop: 8 },
  listTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 13, letterSpacing: 4, marginBottom: 16 },
  listItem: {
    borderBottomWidth: 0.5, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center',
  },
  listItemText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16, flex: 1 },
  listItemNote: { fontFamily: 'DMSans_300Light', fontSize: 12, marginTop: 3 },
  listEmpty: { fontFamily: 'DMSans_300Light', fontSize: 13, letterSpacing: 1, fontStyle: 'italic' },
  restoreBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  restoreBtnText: { fontFamily: 'DMSans_400Regular', fontSize: 10, letterSpacing: 1 },
});

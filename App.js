import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, SafeAreaView, StatusBar, Platform,
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

import { Stack, ClearedScreen } from './src/components/Stack';
import { BottomBar }            from './src/components/BottomBar';
import { AddModal }             from './src/components/AddModal';
import { RewardAnimation }      from './src/components/RewardAnimation';
import { useSounds }            from './src/hooks/useSounds';
import { useStorage }           from './src/hooks/useStorage';
import { initialTasks }         from './src/data/initialTasks';
import { getLevel }             from './src/data/levels';

let _nextId = 100;
function nextId() { return String(++_nextId); }

const POINTS_PER_TASK = 10;

// undoAction : { task, direction, insertedAt? }
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    DMSans_300Light,
    DMSans_400Regular,
  });

  const {
    queue, setQueue, doneList, setDoneList,
    points, streak, streakPtsToday,
    addPoints, loaded,
  } = useStorage(initialTasks);

  const [undoAction, setUndoAction] = useState(null); // { task, direction, insertedAt }
  const [activeTab,  setActiveTab]  = useState('flux');
  const [showModal,  setShowModal]  = useState(false);
  const [undoEntry,  setUndoEntry]  = useState(false);

  // Animations récompense
  const [reward, setReward] = useState({ visible: false, type: 'task', pts: 0, levelName: '' });

  // Toast undo
  const undoOpacity   = useRef(new Animated.Value(0)).current;
  const undoTranslateY = useRef(new Animated.Value(10)).current;
  const undoTimer     = useRef(null);
  const prevLevelRef  = useRef(null);

  const { playCrumple, playWhoosh, playDing } = useSounds();

  // Afficher le bonus de streak à l'ouverture
  useEffect(() => {
    if (!loaded || streakPtsToday === 0) return;
    const timer = setTimeout(() => {
      setReward({ visible: true, type: 'streak', pts: streakPtsToday, levelName: '' });
    }, 800);
    return () => clearTimeout(timer);
  }, [loaded]);

  // Initialiser le niveau de référence
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
        setUndoAction({ task: top, direction: 'left' });
        showUndoToast();
        return rest;
      }

      if (direction === 'right') {
        playWhoosh();
        const pos = Math.max(1, Math.floor(Math.random() * (rest.length || 1)) + 1);
        const next = [...rest];
        next.splice(pos, 0, top);
        setUndoAction({ task: top, direction: 'right', insertedAt: pos });
        showUndoToast();
        return next;
      }

      if (direction === 'up') {
        playDing();
        setDoneList((done) => [{ ...top, completedAt: new Date().toISOString() }, ...done]);
        const newPts = points + POINTS_PER_TASK;
        addPoints(POINTS_PER_TASK);
        setReward({ visible: true, type: 'task', pts: POINTS_PER_TASK, levelName: '' });
        checkLevelUp(newPts);
        return rest;
      }

      return prev;
    });
  }, [points]);

  function handleUndo() {
    if (!undoAction) return;
    hideUndoToast();

    if (undoAction.direction === 'left') {
      // Remettre en tête de pile depuis la gauche
      setUndoEntry(true);
      setQueue((prev) => [undoAction.task, ...prev]);
      setTimeout(() => setUndoEntry(false), 50);
    } else if (undoAction.direction === 'right') {
      // Retrouver la carte dans la pile et la remettre en tête
      setUndoEntry(false);
      setQueue((prev) => {
        const q = [...prev];
        const idx = q.findIndex((t) => t.id === undoAction.task.id);
        if (idx > -1) q.splice(idx, 1);
        return [undoAction.task, ...q];
      });
    }
  }

  function handleAdd(task) {
    setQueue((prev) => [...prev, { ...task, id: nextId() }]);
  }

  const undoMessage = undoAction?.direction === 'right' ? 'remise en pile' : 'supprimée';

  if ((!fontsLoaded && !fontError) || !loaded) return null;

  return (
    <GestureHandlerRootView
      style={{ flex: 1, ...(Platform.OS === 'web' && { height: '100vh' }) }}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.app}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>FLIK</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)} activeOpacity={0.85}>
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Arena */}
          <View style={styles.arena}>
            {activeTab === 'flux' && (
              <>
                <Stack queue={queue} onSwipe={handleSwipe} undoEntry={undoEntry} />
                <ClearedScreen visible={queue.length === 0} />

                <RewardAnimation
                  visible={reward.visible}
                  type={reward.type}
                  points={reward.pts}
                  levelName={reward.levelName}
                  onDone={() => setReward((r) => ({ ...r, visible: false }))}
                />

                <View style={styles.counterArea}>
                  <Text style={styles.counterNum}>{queue.length}</Text>
                  <Text style={styles.counterLbl}>restantes</Text>
                </View>

                {/* Toast undo */}
                <Animated.View
                  style={[styles.undoToast, { opacity: undoOpacity, transform: [{ translateY: undoTranslateY }] }]}
                  pointerEvents="box-none"
                >
                  <Text style={styles.undoText}>{undoMessage}</Text>
                  <TouchableOpacity onPress={handleUndo} activeOpacity={0.7}>
                    <Text style={styles.undoBtn}>ANNULER</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}

            {activeTab === 'fait' && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>FAIT</Text>
                {doneList.length === 0 ? (
                  <Text style={styles.listEmpty}>aucune tâche accomplie</Text>
                ) : (
                  doneList.map((t) => (
                    <View key={t.id + (t.completedAt || '')} style={styles.listItem}>
                      <Text style={styles.listItemText}>{t.title}</Text>
                      {t.chainNote ? (
                        <Text style={styles.listItemNote}>↳ {t.chainNote}</Text>
                      ) : null}
                    </View>
                  ))
                )}
              </View>
            )}
          </View>

          <BottomBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            doneCount={doneList.length}
            streak={streak}
            points={points}
          />
        </View>
      </SafeAreaView>

      <AddModal visible={showModal} onClose={() => setShowModal(false)} onAdd={handleAdd} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: '#f5f3ee' },
  app:   { flex: 1, backgroundColor: '#f5f3ee' },
  header: {
    paddingHorizontal: 28, paddingTop: 16, paddingBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { fontFamily: 'PlayfairDisplay_900Black', fontSize: 26, letterSpacing: 6, color: '#1a1a1a' },
  addBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: '#f5f3ee', fontSize: 22, lineHeight: 24, fontWeight: '300' },
  arena:  { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  counterArea: { marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 6 },
  counterNum: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 15, color: '#1a1a1a' },
  counterLbl: { fontFamily: 'DMSans_300Light', fontSize: 10, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase' },
  undoToast: {
    position: 'absolute', bottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#1a1a1a', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30,
  },
  undoText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 12, letterSpacing: 1, color: '#f5f3ee' },
  undoBtn:  { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 10, letterSpacing: 3, color: '#f0c040' },
  listContainer: { width: '100%', paddingHorizontal: 32 },
  listTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 13, letterSpacing: 4, color: '#1a1a1a', marginBottom: 16 },
  listItem:  { borderBottomWidth: 0.5, borderBottomColor: '#e0ddd6', paddingVertical: 12 },
  listItemText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16, color: '#1a1a1a' },
  listItemNote: { fontFamily: 'DMSans_300Light', fontSize: 12, color: '#aaa', marginTop: 3 },
  listEmpty: { fontFamily: 'DMSans_300Light', fontSize: 13, letterSpacing: 1, color: '#aaa', fontStyle: 'italic' },
});

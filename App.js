import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_300Light,
  DMSans_400Regular,
} from '@expo-google-fonts/dm-sans';

import { Stack, ClearedScreen } from './src/components/Stack';
import { BottomBar } from './src/components/BottomBar';
import { AddModal } from './src/components/AddModal';
import { useSounds } from './src/hooks/useSounds';
import { initialTasks } from './src/data/initialTasks';

let _nextId = 100;
function nextId() {
  return String(++_nextId);
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    DMSans_300Light,
    DMSans_400Regular,
  });

  const [queue, setQueue] = useState(initialTasks);
  const [doneList, setDoneList] = useState([]);
  const [removedTask, setRemovedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('flux');
  const [showModal, setShowModal] = useState(false);

  const undoOpacity = useRef(new Animated.Value(0)).current;
  const undoTranslateY = useRef(new Animated.Value(10)).current;
  const undoTimer = useRef(null);

  const { playCrumple, playWhoosh, playDing } = useSounds();

  function showUndoToast() {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    Animated.parallel([
      Animated.timing(undoOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(undoTranslateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
    undoTimer.current = setTimeout(hideUndoToast, 5000);
  }

  function hideUndoToast() {
    Animated.parallel([
      Animated.timing(undoOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(undoTranslateY, { toValue: 10, duration: 250, useNativeDriver: true }),
    ]).start();
  }

  const handleSwipe = useCallback((direction) => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      const [top, ...rest] = prev;

      if (direction === 'left') {
        playCrumple();
        setRemovedTask(top);
        showUndoToast();
        return rest;
      }

      if (direction === 'right') {
        playWhoosh();
        const pos = Math.floor(Math.random() * rest.length) + 1;
        const next = [...rest];
        next.splice(pos, 0, top);
        return next;
      }

      if (direction === 'up') {
        playDing();
        setDoneList((done) => [top, ...done]);
        return rest;
      }

      return prev;
    });
  }, []);

  function handleUndo() {
    if (!removedTask) return;
    setQueue((prev) => [removedTask, ...prev]);
    setRemovedTask(null);
    hideUndoToast();
  }

  function handleAdd(task) {
    setQueue((prev) => [...prev, { ...task, id: nextId() }]);
  }

  if (!fontsLoaded) return null;

  const isFlux = activeTab === 'flux';
  const isFait = activeTab === 'fait';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.app}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>FLIK</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowModal(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Arena */}
          <View style={styles.arena}>
            {isFlux && (
              <>
                <Stack queue={queue} onSwipe={handleSwipe} />
                <ClearedScreen visible={queue.length === 0} />

                {/* Counter */}
                <View style={styles.counterArea}>
                  <Text style={styles.counterNum}>{queue.length}</Text>
                  <Text style={styles.counterLbl}>restantes</Text>
                </View>

                {/* Undo toast */}
                <Animated.View
                  style={[
                    styles.undoToast,
                    { opacity: undoOpacity, transform: [{ translateY: undoTranslateY }] },
                  ]}
                  pointerEvents="box-none"
                >
                  <Text style={styles.undoText}>supprimée</Text>
                  <TouchableOpacity onPress={handleUndo} activeOpacity={0.7}>
                    <Text style={styles.undoBtn}>ANNULER</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}

            {isFait && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>FAIT</Text>
                {doneList.length === 0 ? (
                  <Text style={styles.listEmpty}>aucune tâche accomplie</Text>
                ) : (
                  doneList.map((t) => (
                    <View key={t.id} style={styles.listItem}>
                      <Text style={styles.listItemText}>{t.title}</Text>
                    </View>
                  ))
                )}
              </View>
            )}

            {activeTab === 'incubateur' && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>INCUBATEUR</Text>
                <Text style={styles.listEmpty}>les tâches reportées reviennent dans la pile</Text>
              </View>
            )}
          </View>

          <BottomBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            doneCount={doneList.length}
          />
        </View>
      </SafeAreaView>

      <AddModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f3ee',
  },
  app: {
    flex: 1,
    backgroundColor: '#f5f3ee',
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'PlayfairDisplay_900Black',
    fontSize: 26,
    letterSpacing: 6,
    color: '#1a1a1a',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#f5f3ee',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '300',
  },
  arena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  counterArea: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  counterNum: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    color: '#1a1a1a',
  },
  counterLbl: {
    fontFamily: 'DMSans_300Light',
    fontSize: 10,
    letterSpacing: 2,
    color: '#aaa',
    textTransform: 'uppercase',
  },
  undoToast: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  undoText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 12,
    letterSpacing: 1,
    color: '#f5f3ee',
  },
  undoBtn: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 10,
    letterSpacing: 3,
    color: '#f0c040',
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 32,
    gap: 12,
  },
  listTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 13,
    letterSpacing: 4,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  listItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0ddd6',
    paddingVertical: 12,
  },
  listItemText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 16,
    color: '#1a1a1a',
  },
  listEmpty: {
    fontFamily: 'DMSans_300Light',
    fontSize: 13,
    letterSpacing: 1,
    color: '#aaa',
    fontStyle: 'italic',
  },
});

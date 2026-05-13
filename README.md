# FLIK

Gestionnaire de tâches par swipe — React Native / Expo.

## Démarrage rapide

```bash
npm install
npx expo start
```

Scannez le QR code avec **Expo Go** (iOS/Android).

## Gestes

| Geste | Action | Son |
|-------|--------|-----|
| ← Swipe gauche | Suppression définitive | Papier froissé |
| → Swipe droite | Réinsertion aléatoire dans la pile | Air / whoosh |
| ↑ Swipe haut | Tâche accomplie | Ding de validation |

## Structure

```
App.js                    # État global, fonts, layout racine
src/
  components/
    Card.js               # TopCard (gesture) + BackCard (statique)
    Stack.js              # Pile de cartes + écran CLEARED
    BottomBar.js          # Navigation flux / incubateur / fait
    AddModal.js           # Modal ajout de tâche
  hooks/
    useSounds.js          # expo-av — chargement et lecture des sons
  data/
    initialTasks.js       # Tâches de démo
assets/
  sounds/
    crumple.mp3           # Remplacer par un vrai son de papier froissé
    whoosh.mp3            # Remplacer par un vrai son d'air
    ding.mp3              # Remplacer par un vrai son de validation
```

## Sons

Les fichiers dans `assets/sounds/` sont des silences placeholder.
Remplacez-les par vos propres MP3 (durée recommandée : 0.3–0.5s).

## Dépendances clés

- `react-native-gesture-handler` — détection des swipes
- `react-native-reanimated` — animations fluides (thread UI)
- `expo-av` — lecture audio
- `@expo-google-fonts/playfair-display` — typographie

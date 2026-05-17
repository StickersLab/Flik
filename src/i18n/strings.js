const fr = {
  // Header
  streak: (n) => `${n}j`,
  // Arena
  restantes: 'restantes',
  cleared: 'CLEARED',
  clearedSub: 'pile vidée',
  // Undo
  supprimee: 'supprimée',
  remiseEnPile: 'remise en pile',
  annuler: 'ANNULER',
  // Modal ajout
  nouvelleTache: 'NOUVELLE TÂCHE',
  queFautIlFaire: 'que faut-il faire ?',
  actionRequise: 'action requise avant',
  prerequis: 'que faut-il faire en premier ?',
  ajouter: 'AJOUTER',
  annulerBtn: 'ANNULER',
  // Bottom bar tabs
  flux: 'flux',
  fait: 'fait',
  incubateur: 'incubateur',
  // Tabs content
  aucuneTacheFaite: 'aucune tâche accomplie',
  aucuneTacheIncubateur: 'aucune tâche en attente',
  restaurer: 'remettre',
  // Reward
  accompli: 'ACCOMPLI',
  niveauSup: 'NIVEAU SUPÉRIEUR',
  streakBonus: 'STREAK BONUS',
  // Menu sections
  monProfil: 'Mon profil',
  themes: 'Thèmes',
  mesStats: 'Mes stats',
  parametres: 'Paramètres',
  feedback: 'Feedback',
  seDeconnecter: 'Se déconnecter',
  // Stats
  tachesAccomplies: 'Tâches accomplies',
  tachesSupprimees: 'Tâches supprimées',
  tachesIncubateur: 'En incubateur',
  meilleureStreak: 'Meilleure streak',
  jours: 'jours',
  // Settings
  sons: 'Sons',
  notifications: 'Notifications',
  langue: 'Langue',
  // Theme shop
  boutique: 'BOUTIQUE',
  mesThemes: 'MES THÈMES',
  debloquer: 'DÉBLOQUER',
  solde: 'Solde',
  insuffisant: 'Crédits insuffisants',
  debloque: 'DÉBLOQUÉ ✓',
  appliquer: 'APPLIQUER',
  // Feedback
  votreSuggestion: 'Votre suggestion...',
  envoyer: 'ENVOYER',
  merci: 'Merci ! 🙏',
  // Days
  lun: 'L', mar: 'M', mer: 'M', jeu: 'J', ven: 'V', sam: 'S', dim: 'D',
};

const en = {
  streak: (n) => `${n}d`,
  restantes: 'remaining',
  cleared: 'CLEARED',
  clearedSub: 'all done',
  supprimee: 'deleted',
  remiseEnPile: 'put back',
  annuler: 'UNDO',
  nouvelleTache: 'NEW TASK',
  queFautIlFaire: 'what needs doing?',
  actionRequise: 'action required first',
  prerequis: 'what needs doing first?',
  ajouter: 'ADD',
  annulerBtn: 'CANCEL',
  flux: 'flux',
  fait: 'done',
  incubateur: 'later',
  aucuneTacheFaite: 'no completed tasks',
  aucuneTacheIncubateur: 'nothing waiting',
  restaurer: 'restore',
  accompli: 'DONE',
  niveauSup: 'LEVEL UP',
  streakBonus: 'STREAK BONUS',
  monProfil: 'My Profile',
  themes: 'Themes',
  mesStats: 'My Stats',
  parametres: 'Settings',
  feedback: 'Feedback',
  seDeconnecter: 'Sign out',
  tachesAccomplies: 'Tasks completed',
  tachesSupprimees: 'Tasks deleted',
  tachesIncubateur: 'In incubator',
  meilleureStreak: 'Best streak',
  jours: 'days',
  sons: 'Sounds',
  notifications: 'Notifications',
  langue: 'Language',
  boutique: 'SHOP',
  mesThemes: 'MY THEMES',
  debloquer: 'UNLOCK',
  solde: 'Balance',
  insuffisant: 'Not enough credits',
  debloque: 'UNLOCKED ✓',
  appliquer: 'APPLY',
  votreSuggestion: 'Your suggestion...',
  envoyer: 'SEND',
  merci: 'Thank you! 🙏',
  lun: 'M', mar: 'T', mer: 'W', jeu: 'T', ven: 'F', sam: 'S', dim: 'S',
};

export const LANG_NAMES = {
  fr: '🇫🇷 Français', en: '🇬🇧 English',
  es: '🇪🇸 Español', de: '🇩🇪 Deutsch',
  it: '🇮🇹 Italiano', pt: '🇵🇹 Português',
  ja: '🇯🇵 日本語', ru: '🇷🇺 Русский', uk: '🇺🇦 Українська',
};

const STRINGS = { fr, en };

// Fallback: fr if not translated
export function t(lang, key, ...args) {
  const dict = STRINGS[lang] ?? fr;
  const val = dict[key] ?? fr[key];
  if (typeof val === 'function') return val(...args);
  return val ?? key;
}

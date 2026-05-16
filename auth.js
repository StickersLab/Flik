// ============================================================
//  FLIK — Auth module (Supabase)
//  Remplace les deux constantes ci-dessous par tes vraies clés
//  Supabase > Settings > API
// ============================================================
const SUPABASE_URL  = 'https://kgmvwroihbclxwtymhps.supabase.co';
const SUPABASE_ANON = 'sb_publishable_8Nu-CWwP7ysv2-RI_RP1wA_9iUm9WhT';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// Page actuelle
const PAGE = window.location.pathname.split('/').pop();

// ── Redirection automatique ──────────────────────────────────
async function guardAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session && PAGE !== 'login.html' && PAGE !== 'signup.html') {
    window.location.href = 'login.html';
  }
  if (session && (PAGE === 'login.html' || PAGE === 'signup.html')) {
    window.location.href = 'flik.html';
  }
  return session;
}

// ── Inscription ──────────────────────────────────────────────
async function signUp(name, email, password) {
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) throw error;
  return data;
}

// ── Connexion email ──────────────────────────────────────────
async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ── Connexion Google ─────────────────────────────────────────
async function signInGoogle() {
  await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://stickerslab.github.io/Flik/flik.html' },
  });
}

// ── Connexion Apple ──────────────────────────────────────────
async function signInApple() {
  await sb.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: 'https://stickerslab.github.io/Flik/flik.html' },
  });
}

// ── Mot de passe oublié ───────────────────────────────────────
async function resetPassword(email) {
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset.html',
  });
  if (error) throw error;
}

// ── Déconnexion ──────────────────────────────────────────────
async function signOut() {
  await sb.auth.signOut();
  window.location.href = 'login.html';
}

// ── Utilisateur courant ───────────────────────────────────────
async function getUser() {
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

// ── Tâches : lecture / écriture (données isolées par user) ───
async function loadTasks() {
  const { data, error } = await sb
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

async function saveTasks(tasks) {
  const user = await getUser();
  if (!user) return;

  // Supprimer toutes les tâches de l'utilisateur puis réinsérer
  await sb.from('tasks').delete().eq('user_id', user.id);

  if (tasks.length === 0) return;

  const rows = tasks.map((t) => ({
    user_id:    user.id,
    title:      t.title,
    has_chain:  t.hasChain || false,
    chain_note: t.chainNote || '',
    task_id:    t.id,
  }));

  const { error } = await sb.from('tasks').insert(rows);
  if (error) throw error;
}

async function saveDone(doneList) {
  const user = await getUser();
  if (!user) return;

  await sb.from('done_tasks').delete().eq('user_id', user.id);

  if (doneList.length === 0) return;

  const rows = doneList.map((t) => ({
    user_id:      user.id,
    title:        t.title,
    has_chain:    t.hasChain || false,
    chain_note:   t.chainNote || '',
    task_id:      t.id,
    completed_at: t.completedAt || new Date().toISOString(),
  }));

  const { error } = await sb.from('done_tasks').insert(rows);
  if (error) throw error;
}

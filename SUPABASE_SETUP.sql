-- ============================================================
--  FLIK — Configuration Supabase
--  Colle ce SQL dans : Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Table des tâches en cours
CREATE TABLE IF NOT EXISTS tasks (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id     TEXT,
  title       TEXT NOT NULL,
  has_chain   BOOLEAN DEFAULT FALSE,
  chain_note  TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des tâches accomplies
CREATE TABLE IF NOT EXISTS done_tasks (
  id           BIGSERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id      TEXT,
  title        TEXT NOT NULL,
  has_chain    BOOLEAN DEFAULT FALSE,
  chain_note   TEXT DEFAULT '',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activer Row Level Security (RLS)
ALTER TABLE tasks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE done_tasks ENABLE ROW LEVEL SECURITY;

-- 4. Politiques : chaque utilisateur voit UNIQUEMENT ses données

-- Tasks
CREATE POLICY "tasks: select own" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tasks: insert own" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks: delete own" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Done tasks
CREATE POLICY "done: select own" ON done_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "done: insert own" ON done_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "done: delete own" ON done_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
--  PROVIDERS SOCIAUX (à activer dans l'interface Supabase)
--  Supabase > Authentication > Providers
--  - Google : activer, coller Client ID + Secret Google Cloud
--  - Apple  : activer, coller Key ID + Team ID + Private Key
-- ============================================================

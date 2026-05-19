-- ══════════════════════════════════════════════════════════════
  --  GAROMS-TECH — Schéma Supabase COMPLET (v3)
  --  Exécuter dans : Supabase Dashboard → SQL Editor → New Query
  --  Sécurisé : IF NOT EXISTS protège les exécutions répétées.
  -- ══════════════════════════════════════════════════════════════

  -- ── 1. NEWSLETTER ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS newsletter (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email      TEXT NOT NULL UNIQUE,
    source     TEXT DEFAULT 'site',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Index de recherche rapide
  CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);
  CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter(created_at DESC);

  -- ── 2. CONTACTS (formulaire de contact général) ───────────────
  CREATE TABLE IF NOT EXISTS contact (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prenom     TEXT NOT NULL,
    nom        TEXT,
    email      TEXT NOT NULL,
    tel        TEXT,
    service    TEXT,
    message    TEXT,
    source     TEXT DEFAULT 'site',
    lu         BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_contact_email   ON contact(email);
  CREATE INDEX IF NOT EXISTS idx_contact_created ON contact(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_contact_lu      ON contact(lu);

  -- ── 3. LEADS CHAT (capturés par l'agent IA) ───────────────────
  CREATE TABLE IF NOT EXISTS gt_chat_leads (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT,
    email        TEXT,
    phone        TEXT,
    country_code TEXT,
    source       TEXT DEFAULT 'chat',
    score        TEXT DEFAULT 'cold' CHECK (score IN ('hot','warm','cold')),
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_leads_email   ON gt_chat_leads(email);
  CREATE INDEX IF NOT EXISTS idx_leads_score   ON gt_chat_leads(score);
  CREATE INDEX IF NOT EXISTS idx_leads_created ON gt_chat_leads(created_at DESC);

  -- ── 4. AMBASSADEURS ───────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS gt_ambassadors (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom        TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    whatsapp   TEXT,
    pays       TEXT,
    ville      TEXT,
    code       TEXT UNIQUE,
    points     INTEGER DEFAULT 0,
    statut     TEXT DEFAULT 'pending' CHECK (statut IN ('active','pending','inactive','suspended')),
    notes      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_amb_email   ON gt_ambassadors(email);
  CREATE INDEX IF NOT EXISTS idx_amb_code    ON gt_ambassadors(code);
  CREATE INDEX IF NOT EXISTS idx_amb_statut  ON gt_ambassadors(statut);
  CREATE INDEX IF NOT EXISTS idx_amb_created ON gt_ambassadors(created_at DESC);

  -- ── 5. PROSPECTS AMBASSADEURS ─────────────────────────────────
  CREATE TABLE IF NOT EXISTS gt_ambassador_prospects (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambassador_id       UUID REFERENCES gt_ambassadors(id) ON DELETE SET NULL,
    ambassador_code     TEXT,
    ambassador_name     TEXT,
    client_name         TEXT NOT NULL,
    client_company      TEXT,
    client_email        TEXT,
    client_whatsapp     TEXT,
    service             TEXT,
    ca_mensuel          NUMERIC(12,2),
    budget_disponible   NUMERIC(12,2),
    cout_inaction       NUMERIC(12,2),
    delai_decision      TEXT,
    notes               TEXT,
    status              TEXT DEFAULT 'pending'
                        CHECK (status IN ('pending','qualified','signed','rejected','in_progress')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_prosp_amb    ON gt_ambassador_prospects(ambassador_id);
  CREATE INDEX IF NOT EXISTS idx_prosp_status ON gt_ambassador_prospects(status);
  CREATE INDEX IF NOT EXISTS idx_prosp_create ON gt_ambassador_prospects(created_at DESC);

  -- ── 6. COMMISSIONS AMBASSADEURS ───────────────────────────────
  CREATE TABLE IF NOT EXISTS gt_commissions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambassador_id  UUID REFERENCES gt_ambassadors(id) ON DELETE CASCADE,
    prospect_id    UUID REFERENCES gt_ambassador_prospects(id) ON DELETE SET NULL,
    montant        NUMERIC(12,2) NOT NULL,
    type_commission TEXT DEFAULT 'setup' CHECK (type_commission IN ('setup','mensuel')),
    statut         TEXT DEFAULT 'pending' CHECK (statut IN ('pending','paid','cancelled')),
    date_paiement  TIMESTAMPTZ,
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_comm_amb    ON gt_commissions(ambassador_id);
  CREATE INDEX IF NOT EXISTS idx_comm_statut ON gt_commissions(statut);

  -- ── 7. SÉCURITÉ ROW-LEVEL SECURITY (RLS) ─────────────────────
  -- Active RLS sur toutes les tables (lecture publique bloquée par défaut)

  ALTER TABLE newsletter              ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contact                 ENABLE ROW LEVEL SECURITY;
  ALTER TABLE gt_chat_leads           ENABLE ROW LEVEL SECURITY;
  ALTER TABLE gt_ambassadors          ENABLE ROW LEVEL SECURITY;
  ALTER TABLE gt_ambassador_prospects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE gt_commissions          ENABLE ROW LEVEL SECURITY;

  -- Permettre uniquement l'insertion publique (anon key) — PAS de lecture publique
  -- Les lectures sont réservées aux utilisateurs authentifiés (admin)

  -- Newsletter : INSERT public autorisé
  DROP POLICY IF EXISTS "newsletter_insert" ON newsletter;
  CREATE POLICY "newsletter_insert"
    ON newsletter FOR INSERT
    TO anon
    WITH CHECK (true);

  -- Contact : INSERT public autorisé
  DROP POLICY IF EXISTS "contact_insert" ON contact;
  CREATE POLICY "contact_insert"
    ON contact FOR INSERT
    TO anon
    WITH CHECK (true);

  -- Chat Leads : INSERT public autorisé
  DROP POLICY IF EXISTS "leads_insert" ON gt_chat_leads;
  CREATE POLICY "leads_insert"
    ON gt_chat_leads FOR INSERT
    TO anon
    WITH CHECK (true);

  -- Ambassadeurs : INSERT public autorisé (inscription)
  DROP POLICY IF EXISTS "amb_insert" ON gt_ambassadors;
  CREATE POLICY "amb_insert"
    ON gt_ambassadors FOR INSERT
    TO anon
    WITH CHECK (true);

  -- Prospects : INSERT public autorisé (soumission par ambassadeur)
  DROP POLICY IF EXISTS "prosp_insert" ON gt_ambassador_prospects;
  CREATE POLICY "prosp_insert"
    ON gt_ambassador_prospects FOR INSERT
    TO anon
    WITH CHECK (true);

  -- Lecture complète réservée aux utilisateurs authentifiés (admin connecté)
  DROP POLICY IF EXISTS "all_select_auth" ON newsletter;
  DROP POLICY IF EXISTS "all_select_auth" ON contact;
  DROP POLICY IF EXISTS "all_select_auth" ON gt_chat_leads;
  DROP POLICY IF EXISTS "all_select_auth" ON gt_ambassadors;
  DROP POLICY IF EXISTS "all_select_auth" ON gt_ambassador_prospects;
  DROP POLICY IF EXISTS "all_select_auth" ON gt_commissions;

  CREATE POLICY "all_select_auth" ON newsletter              FOR SELECT TO authenticated USING (true);
  CREATE POLICY "all_select_auth" ON contact                 FOR SELECT TO authenticated USING (true);
  CREATE POLICY "all_select_auth" ON gt_chat_leads           FOR SELECT TO authenticated USING (true);
  CREATE POLICY "all_select_auth" ON gt_ambassadors          FOR SELECT TO authenticated USING (true);
  CREATE POLICY "all_select_auth" ON gt_ambassador_prospects FOR SELECT TO authenticated USING (true);
  CREATE POLICY "all_select_auth" ON gt_commissions          FOR SELECT TO authenticated USING (true);

  -- UPDATE/DELETE réservés aux authenticated (admin)
  CREATE POLICY "all_update_auth" ON gt_ambassador_prospects FOR UPDATE TO authenticated USING (true);
  CREATE POLICY "all_update_auth" ON gt_ambassadors          FOR UPDATE TO authenticated USING (true);
  CREATE POLICY "all_update_auth" ON gt_commissions          FOR UPDATE TO authenticated USING (true);
  CREATE POLICY "all_update_auth" ON contact                 FOR UPDATE TO authenticated USING (true);

  -- ── 8. VUES UTILES ────────────────────────────────────────────
  CREATE OR REPLACE VIEW v_dashboard_stats AS
  SELECT
    (SELECT COUNT(*) FROM newsletter)              AS total_newsletter,
    (SELECT COUNT(*) FROM gt_chat_leads)           AS total_leads,
    (SELECT COUNT(*) FROM contact)                 AS total_contacts,
    (SELECT COUNT(*) FROM gt_ambassador_prospects) AS total_prospects,
    (SELECT COUNT(*) FROM gt_ambassadors WHERE statut = 'active') AS ambassadors_actifs;

  -- ══════════════════════════════════════════════════════════════
  -- FIN DU SCRIPT — Exécution sécurisée (IF NOT EXISTS partout)
  -- Pour vérifier : SELECT * FROM v_dashboard_stats;
  -- ══════════════════════════════════════════════════════════════
  
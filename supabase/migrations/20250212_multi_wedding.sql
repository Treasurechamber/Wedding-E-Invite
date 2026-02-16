-- Multi-couple support: wedding_id on rsvps, wedding_admins for per-wedding admin access

-- 1. Add wedding_id to rsvps (default 'default' for existing rows)
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS wedding_id TEXT NOT NULL DEFAULT 'default';

-- 2. wedding_admins: each couple gets admin access to their wedding's RSVPs only
CREATE TABLE IF NOT EXISTS wedding_admins (
  wedding_id TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (wedding_id, email)
);
ALTER TABLE wedding_admins ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own wedding_admin rows only
CREATE POLICY "Authenticated can read own wedding_admins"
  ON wedding_admins FOR SELECT
  USING (auth.role() = 'authenticated' AND email = (auth.jwt()->>'email'));

-- 3. Ensure wedding_content supports multiple rows (id = slug, already does)
-- 4. Migrate existing admin_users to wedding_admins for 'default' (if admin_users exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
    INSERT INTO wedding_admins (wedding_id, email)
      SELECT 'default', email FROM admin_users
    ON CONFLICT (wedding_id, email) DO NOTHING;
  END IF;
END $$;

-- 5. RLS: Admins can only read RSVPs for weddings they're in wedding_admins
DROP POLICY IF EXISTS "Authenticated users can view RSVPs" ON rsvps;
CREATE POLICY "Wedding admins can view their wedding RSVPs"
  ON rsvps FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND wedding_id IN (SELECT wedding_id FROM wedding_admins WHERE email = (auth.jwt()->>'email'))
  );

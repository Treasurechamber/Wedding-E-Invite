-- Separate tables for Master and Admin, each with email + password (hashed)
-- Run this in Supabase SQL Editor

-- 1. Admin users: email + password_hash (for /admin RSVP dashboard only)
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Master users: add password_hash column (for /master content editor)
ALTER TABLE master_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
-- Existing master_users may have NULL password_hash; new ones will have it set
-- master_users: service role manages (setup/login/save APIs use service role)
DROP POLICY IF EXISTS "Authenticated can read master_users" ON master_users;

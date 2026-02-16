-- Allow authenticated users to read master_users (needed for Master/Manage pages)
CREATE POLICY "Authenticated can read master_users"
  ON master_users FOR SELECT
  USING (auth.role() = 'authenticated');

-- Wedding RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER NOT NULL,
  plus_one_name TEXT,
  dietary_restrictions JSONB DEFAULT '[]',
  dietary_notes TEXT,
  song_request TEXT,
  message TEXT
);

-- Enable Row Level Security
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Public can insert (RSVP form)
CREATE POLICY "Anyone can insert RSVP"
  ON rsvps FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view (dashboard)
CREATE POLICY "Authenticated users can view RSVPs"
  ON rsvps FOR SELECT
  USING (auth.role() = 'authenticated');

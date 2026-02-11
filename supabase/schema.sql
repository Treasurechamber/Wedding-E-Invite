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

-- Wedding content (master content dashboard)
CREATE TABLE IF NOT EXISTS wedding_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wedding_content ENABLE ROW LEVEL SECURITY;

-- Public can read content
CREATE POLICY "Anyone can read wedding content"
  ON wedding_content FOR SELECT
  USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update wedding content"
  ON wedding_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert default content
INSERT INTO wedding_content (id, data) VALUES ('default', '{
  "coupleNames": "Sophia & Alexander",
  "coupleInitials": "S & A",
  "weddingDate": "2025-09-14T16:00:00",
  "weddingDateDisplay": "September 14, 2025",
  "weddingTime": "4:00 PM",
  "rsvpDeadline": "August 1, 2025",
  "hashtag": "#SophiaAndAlexander2025",
  "heroSlides": [
    "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3951915/pexels-photo-3951915.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/265705/pexels-photo-265705.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1600"
  ],
  "ceremony": {
    "name": "Al Tawahin (Kalaa Weddings)",
    "time": "4:00 PM",
    "address": "Al Tawahin (Kalaa Weddings), القلعة، عين بعال",
    "mapUrl": "https://www.google.com/maps/dir//Al+Tawahin+(+Kalaa+Weddings),+%D8%A7%D9%84%D9%82%D9%84%D8%B9%D8%A9%D8%8C+%D8%B9%D9%8A%D9%86+%D8%A8%D8%B9%D8%A7%D9%84"
  },
  "reception": {
    "name": "Al Tawahin (Kalaa Weddings) – Grand Hall",
    "time": "6:00 PM",
    "address": "Al Tawahin (Kalaa Weddings), القلعة، عين بعال",
    "mapUrl": "https://www.google.com/maps/dir//Al+Tawahin+(+Kalaa+Weddings),+%D8%A7%D9%84%D9%82%D9%84%D8%B9%D8%A9%D8%8C+%D8%B9%D9%8A%D9%86+%D8%A8%D8%B9%D8%A7%D9%84"
  },
  "events": [
    { "time": "3:30 PM", "title": "Guest Arrival" },
    { "time": "4:00 PM", "title": "Ceremony" },
    { "time": "5:00 PM", "title": "Cocktail Hour" },
    { "time": "6:00 PM", "title": "Reception & Dinner" },
    { "time": "8:00 PM", "title": "First Dance" },
    { "time": "11:00 PM", "title": "Last Dance" }
  ],
  "venueCards": [
    { "title": "Garden Terrace", "subtitle": "Sunset Ceremony", "src": "/venue/k1.jpg" },
    { "title": "Grand Hall", "subtitle": "Reception & Dinner", "src": "/venue/k2.jpg" }
  ],
  "mapEmbedUrl": "https://www.google.com/maps?q=Al+Tawahin+(Kalaa+Weddings),+%D8%A7%D9%84%D9%82%D9%84%D8%B9%D8%A9%D8%8C+%D8%B9%D9%8A%D9%86+%D8%A8%D8%B9%D8%A7%D9%84&output=embed"
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

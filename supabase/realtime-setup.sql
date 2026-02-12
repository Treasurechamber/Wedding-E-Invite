-- Enable Realtime for wedding_content so Dashboard updates appear instantly on the live site
-- Run this once in Supabase SQL Editor: Database → SQL Editor → New query

ALTER PUBLICATION supabase_realtime ADD TABLE wedding_content;

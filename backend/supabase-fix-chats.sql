-- Fix chats table and ensure proper UUID types
-- Execute this in Supabase SQL Editor

-- Check chats table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'chats' 
ORDER BY ordinal_position;

-- Ensure proper UUID types
ALTER TABLE chats ALTER COLUMN buyer_id TYPE UUID USING buyer_id::UUID;
ALTER TABLE chats ALTER COLUMN seller_id TYPE UUID USING seller_id::UUID;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_chats_buyer ON chats(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chats_seller ON chats(seller_id);
CREATE INDEX IF NOT EXISTS idx_chats_created ON chats(created_at DESC);

-- Ensure RLS is disabled for development
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;

-- Or if you want RLS enabled, use these policies:
-- ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow authenticated to view chats" ON chats FOR SELECT TO authenticated USING (true);
-- CREATE POLICY "Allow authenticated to create chats" ON chats FOR INSERT TO authenticated WITH CHECK (true);

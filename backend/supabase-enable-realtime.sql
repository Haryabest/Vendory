-- Enable Realtime for chats and messages (SIMPLIFIED)
-- Execute this in Supabase SQL Editor

-- Enable realtime for chats table
ALTER PUBLICATION supabase_realtime ADD TABLE chats;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Add columns if they don't exist
ALTER TABLE chats ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_chats_buyer_seller ON chats(buyer_id, seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their chats" ON chats;
DROP POLICY IF EXISTS "Users can create chats" ON chats;
DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- Simple RLS policies - allow all authenticated users (restrict in your app logic)
CREATE POLICY "Allow authenticated to view chats"
ON chats FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated to create chats"
ON chats FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to view messages"
ON messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated to send messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to update messages"
ON messages FOR UPDATE
TO authenticated
USING (true);

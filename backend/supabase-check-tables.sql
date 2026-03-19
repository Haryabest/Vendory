-- Check and fix table structures
-- Execute this in Supabase SQL Editor

-- Check messages table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY ordinal_position;

-- Check chats table structure  
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chats' 
ORDER BY ordinal_position;

-- Fix sender_id type if needed
ALTER TABLE messages ALTER COLUMN sender_id TYPE UUID USING sender_id::UUID;

-- Fix chat_id type if needed
ALTER TABLE messages ALTER COLUMN chat_id TYPE UUID USING chat_id::UUID;

-- Fix buyer_id type if needed
ALTER TABLE chats ALTER COLUMN buyer_id TYPE UUID USING buyer_id::UUID;

-- Fix seller_id type if needed
ALTER TABLE chats ALTER COLUMN seller_id TYPE UUID USING seller_id::UUID;

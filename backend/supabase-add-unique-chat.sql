-- Add unique constraint to prevent duplicate chats
-- Execute this in Supabase SQL Editor

-- Сначала удалим дубликаты (оставим самый старый чат для каждой пары)
DELETE FROM chats a USING chats b
WHERE a.id < b.id 
  AND a.buyer_id = b.buyer_id 
  AND a.seller_id = b.seller_id;

-- Добавим unique constraint
ALTER TABLE chats ADD CONSTRAINT unique_chat UNIQUE (buyer_id, seller_id);

-- Проверим что constraint создан
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'chats';

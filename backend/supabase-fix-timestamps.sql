-- Fix all tables created_at and updated_at columns
-- Execute this in Supabase SQL Editor

-- Fix products table
ALTER TABLE products ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE products ALTER COLUMN updated_at SET DEFAULT NOW();

-- Fix product_items table
ALTER TABLE product_items ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix product_images table
-- No timestamp columns

-- Fix product_categories table
ALTER TABLE product_categories ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix product_tags table
-- No timestamp columns

-- Fix product_tag_relations table
-- No timestamp columns

-- Fix orders table
ALTER TABLE orders ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE orders ALTER COLUMN updated_at SET DEFAULT NOW();

-- Fix order_items table
-- No timestamp columns

-- Fix order_status_history table
ALTER TABLE order_status_history ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix payments table
ALTER TABLE payments ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix payment_methods table
ALTER TABLE payment_methods ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix transactions table
ALTER TABLE transactions ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix withdrawals table
ALTER TABLE withdrawals ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix deposits table
ALTER TABLE deposits ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix reviews table
ALTER TABLE reviews ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix seller_reviews table
ALTER TABLE seller_reviews ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix chats table
ALTER TABLE chats ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix messages table
ALTER TABLE messages ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix message_attachments table
-- No timestamp columns

-- Fix favorites table
ALTER TABLE favorites ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix cart_items table
ALTER TABLE cart_items ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix disputes table
ALTER TABLE disputes ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix dispute_messages table
ALTER TABLE dispute_messages ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix notifications table
ALTER TABLE notifications ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix login_attempts table
ALTER TABLE login_attempts ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix banned_ips table
ALTER TABLE banned_ips ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix audit_logs table
ALTER TABLE audit_logs ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix user_settings table
ALTER TABLE user_settings ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix user_sessions table
ALTER TABLE user_sessions ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix users table
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();

-- Fix sellers table
ALTER TABLE sellers ALTER COLUMN created_at SET DEFAULT NOW();

-- Fix seller_verification table
ALTER TABLE seller_verification ALTER COLUMN created_at SET DEFAULT NOW();

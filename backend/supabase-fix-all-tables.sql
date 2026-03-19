-- Fix all tables with UUID auto-generation
-- Execute this in Supabase SQL Editor

-- Fix products table
ALTER TABLE products ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix product_items table
ALTER TABLE product_items ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix product_images table
ALTER TABLE product_images ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix product_categories table
ALTER TABLE product_categories ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix product_tags table
ALTER TABLE product_tags ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix orders table
ALTER TABLE orders ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix order_items table
ALTER TABLE order_items ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix order_status_history table
ALTER TABLE order_status_history ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix payments table
ALTER TABLE payments ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix payment_methods table
ALTER TABLE payment_methods ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix transactions table
ALTER TABLE transactions ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix withdrawals table
ALTER TABLE withdrawals ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix deposits table
ALTER TABLE deposits ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix reviews table
ALTER TABLE reviews ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix seller_reviews table
ALTER TABLE seller_reviews ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix chats table
ALTER TABLE chats ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix messages table
ALTER TABLE messages ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix message_attachments table
ALTER TABLE message_attachments ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix favorites table
-- No change needed (composite primary key)

-- Fix cart_items table
ALTER TABLE cart_items ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix disputes table
ALTER TABLE disputes ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix dispute_messages table
ALTER TABLE dispute_messages ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix notifications table
ALTER TABLE notifications ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix login_attempts table
ALTER TABLE login_attempts ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix banned_ips table
ALTER TABLE banned_ips ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix audit_logs table
ALTER TABLE audit_logs ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix user_settings table
ALTER TABLE user_settings ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix user_sessions table
ALTER TABLE user_sessions ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix users table
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix sellers table
ALTER TABLE sellers ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix seller_verification table
ALTER TABLE seller_verification ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add views and favorites count to products table
-- Execute this in Supabase SQL Editor

-- Add columns if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;

-- Set default values for existing rows
UPDATE products SET views_count = 0 WHERE views_count IS NULL;
UPDATE products SET favorites_count = 0 WHERE favorites_count IS NULL;

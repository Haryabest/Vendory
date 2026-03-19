-- Add username and avatar to sellers table for faster access
-- Execute this in Supabase SQL Editor

-- Add columns to sellers table
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS username VARCHAR(100);
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update existing sellers with data from auth metadata (if available)
-- This is a workaround since we can't easily join with auth.users

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sellers_username ON sellers(username);

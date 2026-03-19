-- Fix users table access
-- Execute this in Supabase SQL Editor

-- Check if users table exists and create if not
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'buyer',
  balance DECIMAL(10,2) DEFAULT 0,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;

-- Disable RLS for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

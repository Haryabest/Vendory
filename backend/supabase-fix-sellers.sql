-- Fix for sellers table ID generation
-- Execute this in Supabase SQL Editor

-- Drop the existing sellers table and recreate with proper defaults
DROP TABLE IF EXISTS seller_verification CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;

-- Recreate sellers table with proper ID generation
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate seller_verification table
CREATE TABLE seller_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID UNIQUE REFERENCES sellers(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  documents_url TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant permissions
GRANT ALL ON sellers TO authenticated;
GRANT ALL ON seller_verification TO authenticated;
GRANT ALL ON SEQUENCE sellers_id_seq TO authenticated;

-- Disable RLS for development
ALTER TABLE sellers DISABLE ROW LEVEL SECURITY;
ALTER TABLE seller_verification DISABLE ROW LEVEL SECURITY;

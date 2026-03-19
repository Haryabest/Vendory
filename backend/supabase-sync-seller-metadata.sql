-- Update sellers table to sync with user metadata (FIXED)
-- Execute this in Supabase SQL Editor

-- Update existing sellers with username and avatar from user_metadata
UPDATE sellers s
SET 
  username = (SELECT raw_user_meta_data->>'username' FROM auth.users WHERE id::text = s.user_id::text),
  avatar_url = (SELECT raw_user_meta_data->>'avatar_url' FROM auth.users WHERE id::text = s.user_id::text)
WHERE username IS NULL OR avatar_url IS NULL;

-- Create function to sync user metadata with sellers
CREATE OR REPLACE FUNCTION sync_seller_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sellers 
  SET 
    username = NEW.raw_user_meta_data->>'username',
    avatar_url = NEW.raw_user_meta_data->>'avatar_url'
  WHERE user_id::text = NEW.id::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync on user update
DROP TRIGGER IF EXISTS on_user_update_sync_seller ON auth.users;
CREATE TRIGGER on_user_update_sync_seller
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION sync_seller_metadata();

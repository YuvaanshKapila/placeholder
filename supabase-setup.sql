-- NeuroNav Database Setup for Supabase
-- Run this in the Supabase SQL Editor

-- Create the user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  user_email TEXT,
  user_name TEXT,
  neurodivergencies JSONB DEFAULT '[]'::jsonb,
  crowd_sensitivity TEXT DEFAULT 'medium' CHECK (crowd_sensitivity IN ('low', 'medium', 'high')),
  sound_sensitivity TEXT DEFAULT 'medium' CHECK (sound_sensitivity IN ('low', 'medium', 'high')),
  light_sensitivity TEXT DEFAULT 'medium' CHECK (light_sensitivity IN ('low', 'medium', 'high')),
  touch_avoidance TEXT DEFAULT 'medium' CHECK (touch_avoidance IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_user_preferences_updated_at ON user_preferences(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Policy: Users can read their own preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences
  FOR SELECT
  USING (true);  -- Allow all reads for now (you can restrict this later)

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert their own preferences"
  ON user_preferences
  FOR INSERT
  WITH CHECK (true);  -- Allow all inserts for now

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update their own preferences"
  ON user_preferences
  FOR UPDATE
  USING (true)  -- Allow all updates for now
  WITH CHECK (true);

-- Policy: Users can delete their own preferences
CREATE POLICY "Users can delete their own preferences"
  ON user_preferences
  FOR DELETE
  USING (true);  -- Allow all deletes for now

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on updates
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for easy querying
CREATE OR REPLACE VIEW user_preferences_summary AS
SELECT
  user_id,
  user_name,
  user_email,
  neurodivergencies,
  crowd_sensitivity,
  sound_sensitivity,
  light_sensitivity,
  touch_avoidance,
  created_at,
  updated_at
FROM user_preferences
ORDER BY updated_at DESC;

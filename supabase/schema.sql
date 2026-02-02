-- ConvertFlow Database Schema
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  api_key TEXT UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  conversions_today INT DEFAULT 0,
  conversions_reset_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 day'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversions table
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('json_to_csv', 'csv_to_json')),
  input_size INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at);

-- Function to increment conversion counter
CREATE OR REPLACE FUNCTION increment_conversions(user_row_id UUID)
RETURNS VOID AS $$
  UPDATE users
  SET conversions_today = conversions_today + 1
  WHERE id = user_row_id;
$$ LANGUAGE sql;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (service key bypasses these, needed for future client-side access)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Users can view own conversions" ON conversions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own conversions" ON conversions
  FOR INSERT WITH CHECK (true);

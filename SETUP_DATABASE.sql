-- AgriAssist Database Setup Script
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'officer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weather forecasts
CREATE TABLE IF NOT EXISTS public.weather (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector TEXT NOT NULL,
  cell TEXT NOT NULL,
  forecast TEXT NOT NULL,
  forecast_rw TEXT NOT NULL,
  temperature NUMERIC NOT NULL,
  rainfall NUMERIC NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pest and disease alerts
CREATE TABLE IF NOT EXISTS public.pests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_rw TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_rw TEXT NOT NULL,
  treatment_rw TEXT NOT NULL,
  image_url TEXT,
  crops_affected TEXT[] NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market prices
CREATE TABLE IF NOT EXISTS public.market (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  market_name TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Livestock advisories
CREATE TABLE IF NOT EXISTS public.livestock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_rw TEXT NOT NULL,
  content_rw TEXT NOT NULL,
  category TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('farmer', 'officer', 'admin')),
  farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp BIGINT NOT NULL,
  read_at BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_weather_timestamp ON public.weather(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_weather_sector ON public.weather(sector);
CREATE INDEX IF NOT EXISTS idx_pests_timestamp ON public.pests(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_market_timestamp ON public.market(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_market_product ON public.market(product);
CREATE INDEX IF NOT EXISTS idx_livestock_timestamp ON public.livestock(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_farmer_id ON public.messages(farmer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Everyone can read weather" ON public.weather;
DROP POLICY IF EXISTS "Officers can insert weather" ON public.weather;
DROP POLICY IF EXISTS "Officers can update weather" ON public.weather;
DROP POLICY IF EXISTS "Officers can delete weather" ON public.weather;
DROP POLICY IF EXISTS "Everyone can read pests" ON public.pests;
DROP POLICY IF EXISTS "Officers can insert pests" ON public.pests;
DROP POLICY IF EXISTS "Officers can update pests" ON public.pests;
DROP POLICY IF EXISTS "Officers can delete pests" ON public.pests;
DROP POLICY IF EXISTS "Everyone can read market" ON public.market;
DROP POLICY IF EXISTS "Officers can insert market" ON public.market;
DROP POLICY IF EXISTS "Officers can update market" ON public.market;
DROP POLICY IF EXISTS "Officers can delete market" ON public.market;
DROP POLICY IF EXISTS "Everyone can read livestock" ON public.livestock;
DROP POLICY IF EXISTS "Officers can insert livestock" ON public.livestock;
DROP POLICY IF EXISTS "Officers can update livestock" ON public.livestock;
DROP POLICY IF EXISTS "Officers can delete livestock" ON public.livestock;
DROP POLICY IF EXISTS "Farmers can read own messages" ON public.messages;
DROP POLICY IF EXISTS "Officers can read all messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;

-- Users table policies
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Weather policies (Officers write, Everyone reads)
CREATE POLICY "Everyone can read weather" ON public.weather FOR SELECT USING (true);
CREATE POLICY "Officers can insert weather" ON public.weather FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can update weather" ON public.weather FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can delete weather" ON public.weather FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);

-- Pests policies (Officers write, Everyone reads)
CREATE POLICY "Everyone can read pests" ON public.pests FOR SELECT USING (true);
CREATE POLICY "Officers can insert pests" ON public.pests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can update pests" ON public.pests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can delete pests" ON public.pests FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);

-- Market policies (Officers write, Everyone reads)
CREATE POLICY "Everyone can read market" ON public.market FOR SELECT USING (true);
CREATE POLICY "Officers can insert market" ON public.market FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can update market" ON public.market FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can delete market" ON public.market FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);

-- Livestock policies (Officers write, Everyone reads)
CREATE POLICY "Everyone can read livestock" ON public.livestock FOR SELECT USING (true);
CREATE POLICY "Officers can insert livestock" ON public.livestock FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can update livestock" ON public.livestock FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can delete livestock" ON public.livestock FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);

-- Messages policies (Users can read their own messages, Officers see all)
CREATE POLICY "Farmers can read own messages" ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR 
  (auth.uid() = farmer_id AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'farmer'))
);
CREATE POLICY "Officers can read all messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- ============================================
-- 5. ENABLE REALTIME FOR ALL TABLES
-- ============================================

-- Note: If you get "already member of publication" error, Realtime is already enabled!
-- This section wraps commands in error handling to ignore duplicates.

DO $$ 
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.weather;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pests;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.market;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.livestock;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ============================================
-- 6. CREATE SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Sample weather data
INSERT INTO public.weather (sector, cell, forecast, forecast_rw, temperature, rainfall, timestamp) VALUES
('Nyagatare', 'Karama', 'Sunny with light rain expected', 'Izuba ryinshi, imvura nkeya itegerejwe', 28, 5, EXTRACT(EPOCH FROM NOW()) * 1000),
('Rwimiyaga', 'Musheli', 'Cloudy with moderate rain', 'Ibicu byinshi, imvura yo hagati', 25, 15, EXTRACT(EPOCH FROM NOW()) * 1000);

-- Sample pest data
INSERT INTO public.pests (name_rw, name_en, description_rw, treatment_rw, crops_affected, timestamp) VALUES
('Inzoka y''ibigori', 'Maize Stalk Borer', 'Ibyonnyi bikomeye ku bigori', 'Koresha imiti ya Cypermethrin', ARRAY['Ibigori', 'Amasaka'], EXTRACT(EPOCH FROM NOW()) * 1000),
('Indwara y''ibishyimbo', 'Bean Rust', 'Indwara ikora ku mababi y''ibishyimbo', 'Koresha fungicide', ARRAY['Ibishyimbo'], EXTRACT(EPOCH FROM NOW()) * 1000);

-- Sample market data
INSERT INTO public.market (product, price, unit, market_name, timestamp) VALUES
('Ibigori', 350, 'kg', 'Isoko rya Nyagatare', EXTRACT(EPOCH FROM NOW()) * 1000),
('Ibishyimbo', 800, 'kg', 'Isoko rya Nyagatare', EXTRACT(EPOCH FROM NOW()) * 1000),
('Amata', 400, 'liter', 'Isoko rya Rwimiyaga', EXTRACT(EPOCH FROM NOW()) * 1000);

-- Sample livestock data
INSERT INTO public.livestock (title_rw, content_rw, category, timestamp) VALUES
('Gukingira Inka', 'Inka zigomba gukingirwa buri mezi atandatu kurwanya indwara', 'Ubuzima', EXTRACT(EPOCH FROM NOW()) * 1000),
('Kurisha Inka', 'Inka zigomba kurisha ibyatsi byiza kandi byinshi', 'Imfashanyo', EXTRACT(EPOCH FROM NOW()) * 1000);

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify tables were created
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verify realtime is enabled
SELECT 
  schemaname, 
  tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

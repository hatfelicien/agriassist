# Supabase Setup Guide for AgriAssist

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New project"
5. Fill in:
   - Name: AgriAssist
   - Database Password: (save this securely)
   - Region: Choose closest to Rwanda (e.g., eu-central-1)
6. Click "Create new project"
7. Wait 2-3 minutes for setup

## Step 2: Get API Credentials

1. In your project dashboard, click "Settings" (gear icon)
2. Click "API" in sidebar
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Configure Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Tables

Go to **SQL Editor** in Supabase dashboard and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'officer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather table
CREATE TABLE weather (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector TEXT NOT NULL,
  cell TEXT NOT NULL,
  forecast TEXT NOT NULL,
  forecast_rw TEXT NOT NULL,
  temperature NUMERIC NOT NULL,
  rainfall NUMERIC NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pests table
CREATE TABLE pests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_rw TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_rw TEXT NOT NULL,
  treatment_rw TEXT NOT NULL,
  image_url TEXT,
  crops_affected TEXT[] NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market table
CREATE TABLE market (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  market_name TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Livestock table
CREATE TABLE livestock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_rw TEXT NOT NULL,
  content_rw TEXT NOT NULL,
  category TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('farmer', 'officer')),
  farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_weather_timestamp ON weather(timestamp DESC);
CREATE INDEX idx_pests_timestamp ON pests(timestamp DESC);
CREATE INDEX idx_market_timestamp ON market(timestamp DESC);
CREATE INDEX idx_livestock_timestamp ON livestock(timestamp DESC);
CREATE INDEX idx_messages_timestamp ON messages(timestamp ASC);
CREATE INDEX idx_messages_farmer ON messages(farmer_id);
```

## Step 5: Set Row Level Security (RLS) Policies

Run this SQL to enable security:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE market ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Weather policies
CREATE POLICY "Anyone authenticated can read weather" ON weather FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Officers can insert weather" ON weather FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can update weather" ON weather FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can delete weather" ON weather FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);

-- Pests policies
CREATE POLICY "Anyone authenticated can read pests" ON pests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Officers can insert pests" ON pests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can update pests" ON pests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can delete pests" ON pests FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);

-- Market policies
CREATE POLICY "Anyone authenticated can read market" ON market FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Officers can insert market" ON market FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can update market" ON market FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can delete market" ON market FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);

-- Livestock policies
CREATE POLICY "Anyone authenticated can read livestock" ON livestock FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Officers can insert livestock" ON livestock FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can update livestock" ON livestock FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Officers can delete livestock" ON livestock FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);

-- Messages policies
CREATE POLICY "Users can read own messages" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR 
  auth.uid() = farmer_id OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer')
);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
);
```

## Step 6: Enable Realtime

1. Go to **Database** > **Replication**
2. Enable realtime for these tables:
   - ✅ weather
   - ✅ pests
   - ✅ market
   - ✅ livestock
   - ✅ messages
3. Click "Save"

## Step 7: Install Dependencies

```bash
cd Desktop\AgriAssist
npm install
```

## Step 8: Run the Application

```bash
npm run dev
```

Visit: http://localhost:5173

## Step 9: Test the Application

### Create Extension Officer Account
1. Click "Create Account"
2. Email: officer@test.com
3. Password: Officer123!
4. Role: Extension Officer
5. Click "Register"

### Add Data (Officer Dashboard)
1. Click "Weather" tab
2. Fill form:
   - Sector: Nyagatare
   - Cell: Karangazi
   - Forecast: Partly cloudy with rain expected
   - Forecast (Kinyarwanda): Ibihe byiza, imvura ishobora kugwa
   - Temperature: 24
   - Rainfall: 15
3. Click "Create"

### Create Farmer Account
1. Logout
2. Click "Create Account"
3. Email: farmer@test.com
4. Password: Farmer123!
5. Role: Farmer
6. Click "Register"

### Test Features (Farmer View)
1. View weather forecasts
2. View pest alerts
3. View market prices
4. View livestock advisories
5. Click "Chat with Officers"
6. Send a message

## Database Schema

### users
- id (UUID, PK)
- email (TEXT)
- role (TEXT: 'farmer' | 'officer')
- created_at (TIMESTAMP)

### weather
- id (UUID, PK)
- sector (TEXT)
- cell (TEXT)
- forecast (TEXT)
- forecast_rw (TEXT)
- temperature (NUMERIC)
- rainfall (NUMERIC)
- timestamp (BIGINT)

### pests
- id (UUID, PK)
- name_rw (TEXT)
- name_en (TEXT)
- description_rw (TEXT)
- treatment_rw (TEXT)
- image_url (TEXT)
- crops_affected (TEXT[])
- timestamp (BIGINT)

### market
- id (UUID, PK)
- product (TEXT)
- price (NUMERIC)
- unit (TEXT)
- market_name (TEXT)
- timestamp (BIGINT)

### livestock
- id (UUID, PK)
- title_rw (TEXT)
- content_rw (TEXT)
- category (TEXT)
- timestamp (BIGINT)

### messages
- id (UUID, PK)
- text (TEXT)
- sender_id (UUID, FK)
- sender_email (TEXT)
- sender_role (TEXT)
- farmer_id (UUID, FK)
- timestamp (BIGINT)

## Features

✅ **Authentication** - Email/password with Supabase Auth
✅ **Real-time Updates** - Instant data sync across all users
✅ **Role-Based Access** - Farmers (read) vs Officers (write)
✅ **Secure** - Row Level Security policies
✅ **Scalable** - PostgreSQL database
✅ **Free Tier** - 500MB database, 2GB bandwidth/month

## Troubleshooting

### Error: Invalid API key
- Check `.env` file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart dev server after changing `.env`

### Error: Permission denied
- Verify RLS policies are created
- Check user is authenticated
- Verify user role in `users` table

### Error: Table does not exist
- Run all SQL commands in Step 4
- Check table names match exactly

### Data not updating in real-time
- Enable Realtime replication in Step 6
- Check browser console for errors

## Production Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Add environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Deploy

### Database
- Supabase handles all backend infrastructure
- No additional deployment needed
- Automatic backups on paid plans

## Cost (Free Tier)

- **Database**: 500MB storage
- **Bandwidth**: 2GB/month
- **Auth**: Unlimited users
- **Realtime**: Unlimited connections
- **API Requests**: Unlimited

**Sufficient for 10,000+ farmers**

Upgrade to Pro ($25/month) for:
- 8GB database
- 50GB bandwidth
- Daily backups
- Priority support

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

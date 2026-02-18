# 🚀 SUPABASE SETUP GUIDE - STEP BY STEP

## ✅ Your Credentials (Already Configured)
```
URL: https://wcwoezciqsxvmxkfrsyn.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 STEP 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Login to your account
3. Select project: **wcwoezciqsxvmxkfrsyn**

---

## 📋 STEP 2: Run Database Setup SQL

### Option A: Copy-Paste Method (Recommended)

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open file: `SETUP_DATABASE.sql`
4. Copy ALL content (Ctrl+A, Ctrl+C)
5. Paste into SQL Editor
6. Click **RUN** button (bottom right)
7. Wait for "Success. No rows returned" message

### Option B: Upload File Method

1. In Supabase Dashboard, click **SQL Editor**
2. Click **New Query**
3. Click the **Upload** icon
4. Select `SETUP_DATABASE.sql`
5. Click **RUN**

---

## 📋 STEP 3: Verify Tables Created

1. In Supabase Dashboard, click **Table Editor** (left sidebar)
2. You should see 6 tables:
   - ✅ users
   - ✅ weather
   - ✅ pests
   - ✅ market
   - ✅ livestock
   - ✅ messages

3. Click each table to verify columns exist

---

## 📋 STEP 4: Enable Realtime (CRITICAL)

### Method 1: Via Dashboard (Easiest)

1. Click **Database** → **Replication** (left sidebar)
2. Find **supabase_realtime** publication
3. Click **Edit**
4. Check ALL these tables:
   - ☑️ users
   - ☑️ weather
   - ☑️ pests
   - ☑️ market
   - ☑️ livestock
   - ☑️ messages
5. Click **Save**

### Method 2: Via SQL (If Method 1 doesn't work)

Run this in SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weather;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market;
ALTER PUBLICATION supabase_realtime ADD TABLE public.livestock;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
```

---

## 📋 STEP 5: Verify RLS Policies

1. Click **Authentication** → **Policies** (left sidebar)
2. You should see policies for each table:
   - users: 3 policies
   - weather: 4 policies
   - pests: 4 policies
   - market: 4 policies
   - livestock: 4 policies
   - messages: 4 policies

If policies are missing, re-run the SQL script.

---

## 📋 STEP 6: Test Database Connection

### Test 1: Check Sample Data

1. Click **Table Editor** → **weather**
2. You should see 2 sample weather forecasts
3. Click **market** → should see 3 sample prices
4. Click **pests** → should see 2 sample pests
5. Click **livestock** → should see 2 sample advisories

### Test 2: Test from App

1. Open terminal in AgriAssist folder
2. Run: `npm run dev`
3. Open: http://localhost:5173
4. Click **Register**
5. Create account:
   - Email: `farmer@test.com`
   - Password: `test123456`
   - Role: **Farmer**
6. If registration succeeds → Database is working! ✅

---

## 📋 STEP 7: Create Test Accounts

### Create Officer Account
1. Register with:
   - Email: `officer@test.com`
   - Password: `test123456`
   - Role: **Extension Officer**

### Create Farmer Account
1. Register with:
   - Email: `farmer@test.com`
   - Password: `test123456`
   - Role: **Farmer**

---

## 🔧 TROUBLESHOOTING

### Issue: "relation does not exist"
**Solution**: Tables not created. Re-run SETUP_DATABASE.sql

### Issue: "permission denied for table"
**Solution**: RLS policies not applied. Re-run SETUP_DATABASE.sql

### Issue: "new row violates row-level security policy"
**Solution**: 
1. Go to **Authentication** → **Policies**
2. Temporarily disable RLS for testing:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.market DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestock DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
```

### Issue: Real-time not working
**Solution**: 
1. Check **Database** → **Replication**
2. Ensure all tables are checked
3. Restart app: `npm run dev`

### Issue: Can't login after registration
**Solution**: 
1. Go to **Authentication** → **Users**
2. Find your user
3. Click **...** → **Confirm email**

---

## ✅ VERIFICATION CHECKLIST

After completing all steps, verify:

- [ ] 6 tables exist in Table Editor
- [ ] Sample data visible in tables
- [ ] Realtime enabled for all tables
- [ ] RLS policies show in Authentication → Policies
- [ ] Can register new user
- [ ] Can login as farmer
- [ ] Can login as officer
- [ ] Officer can add weather data
- [ ] Farmer can view weather data
- [ ] Chat works between farmer and officer

---

## 🎉 SETUP COMPLETE!

Once all checkboxes are ✅, your database is ready!

Next step: Deploy the app
- Run: `npm run build`
- Deploy to Vercel/Netlify
- Share with Nyagatare farmers! 🌾

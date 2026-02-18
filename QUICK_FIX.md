# 🆘 QUICK FIX REFERENCE

## 🔴 BLOCKER 1: Database Tables Missing

### Symptom
```
Error: relation "public.users" does not exist
```

### Fix (2 minutes)
1. Go to: https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn/sql
2. Click **New Query**
3. Copy content from `SETUP_DATABASE.sql`
4. Paste and click **RUN**
5. ✅ Done!

---

## 🔴 BLOCKER 2: Realtime Not Working

### Symptom
- Data doesn't update automatically
- Need to refresh page to see changes

### Fix (1 minute)
1. Go to: https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn/database/replication
2. Click **supabase_realtime** → **Edit**
3. Check all 6 tables:
   - users ☑️
   - weather ☑️
   - pests ☑️
   - market ☑️
   - livestock ☑️
   - messages ☑️
4. Click **Save**
5. ✅ Done!

---

## 🔴 BLOCKER 3: RLS Blocking Queries

### Symptom
```
Error: new row violates row-level security policy
```

### Quick Fix (Testing Only)
Run in SQL Editor:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.market DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestock DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
```

### Proper Fix (Production)
Re-run `SETUP_DATABASE.sql` to create proper RLS policies

---

## ⚡ FASTEST SETUP (5 minutes)

```bash
# 1. Open Supabase SQL Editor
https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn/sql

# 2. Run SETUP_DATABASE.sql (copy-paste entire file)

# 3. Enable Realtime
https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn/database/replication
→ Edit supabase_realtime → Check all tables → Save

# 4. Test locally
npm run dev
→ Register as farmer
→ Register as officer
→ Test CRUD operations

# 5. Deploy
npm run build
vercel --prod
```

---

## 🧪 TEST COMMANDS

### Test Database Connection
```bash
npm run dev
# Open http://localhost:5173
# Try to register → If succeeds, DB is working!
```

### Test Build
```bash
npm run build
# Should complete without errors
```

### Test Production Build
```bash
npm run preview
# Open http://localhost:4173
# Test all features
```

---

## 📞 SUPPORT LINKS

- Supabase Dashboard: https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn
- SQL Editor: https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn/sql
- Table Editor: https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn/editor
- Realtime: https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn/database/replication
- Auth Users: https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn/auth/users

---

## ✅ ALL BLOCKERS SOLVED!

After running `SETUP_DATABASE.sql` and enabling Realtime:
- ✅ Database tables created
- ✅ RLS policies configured
- ✅ Realtime enabled
- ✅ Sample data inserted
- ✅ Ready to deploy!

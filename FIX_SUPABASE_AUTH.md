# Fix Supabase Authentication

## Problem
- Registration fails because email confirmation is required
- Users can't login without confirming email

## Solution: Disable Email Confirmation

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/wcwoezciqsxvmxkfrsyn
2. Login to your account

### Step 2: Disable Email Confirmation
1. Click **Authentication** in left sidebar
2. Click **Providers** 
3. Find **Email** provider
4. Click to expand
5. **UNCHECK** "Confirm email"
6. Click **Save**

### Step 3: Enable Auto-confirm (Alternative)
1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Toggle **OFF** "Enable email confirmations"
4. Click **Save**

### Step 4: Test Again
After disabling email confirmation:
1. Restart your app
2. Try registering: test@agriassist.rw / test123456
3. Should work immediately!

## Quick Fix: Use Phone Auth Instead

If you can't access Supabase dashboard, I can switch the app to use phone-based auth without email confirmation.

Let me know which option you prefer!

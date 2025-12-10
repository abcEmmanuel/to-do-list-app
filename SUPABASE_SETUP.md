# Supabase Setup Guide

This guide will help you set up Supabase for your to-do list app.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **Sign Up** and create an account
3. Click **New Project**
4. Fill in the details:
   - **Project Name**: `todo-list-app` (or your choice)
   - **Database Password**: Create a strong password and save it
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Select **Free** for testing
5. Click **Create new project** and wait for it to initialize (2-3 minutes)

## Step 2: Create the Todos Table

Once your project is ready:

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this SQL code:

```sql
-- Create the todos table
CREATE TABLE todos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access
CREATE POLICY "Allow public select" ON todos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert" ON todos
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON todos
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete" ON todos
  FOR DELETE
  TO public
  USING (true);
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

## Step 3: Get Your API Keys

1. Click **Settings** in the left sidebar (at the bottom)
2. Click **API** under Project Settings
3. You'll see two important keys:
   - **Project URL** (under "Project API Keys")
   - **anon public** (under "Project API Keys")

Copy both of these - you'll need them next.

## Step 4: Configure Environment Variables

### For Local Development:

1. In the root of your project, create a file named `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Replace:
   - `your-project-ref` with your actual project ref (from the URL)
   - `your-anon-key-here` with the anon key you copied

3. Save the file

4. Restart your development server:
   ```bash
   npm run dev
   ```

### For Vercel Deployment:

1. Go to [vercel.com](https://vercel.com) and log in
2. Open your **to-do-list-app** project
3. Click **Settings** → **Environment Variables**
4. Add two variables:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: `https://your-project-ref.supabase.co`
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **Value**: your anon key
5. Click **Save**
6. **Redeploy** your project:
   - Go to **Deployments**
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**

## Step 5: Test the Connection

### Local Testing:

1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Open DevTools (F12) → Console
4. Try adding a todo
5. Check the console for messages:
   - ✅ Success message = working!
   - ❌ Error message = check the error details

### Vercel Testing:

1. Go to your deployed Vercel URL
2. Open DevTools (F12) → Console
3. Try adding a todo
4. Check for error messages

## Common Issues & Solutions

### Issue 1: "Supabase not configured"
**Cause**: Environment variables are not set
**Solution**:
- For local: Create `.env.local` with your keys
- For Vercel: Add Environment Variables in Project Settings and redeploy

### Issue 2: "Row Level Security (RLS) is preventing inserts"
**Cause**: RLS policies not set up correctly
**Solution**: Run the SQL policies from Step 2 again in Supabase SQL Editor

### Issue 3: "Table todos does not exist"
**Cause**: The table wasn't created
**Solution**: Run the CREATE TABLE SQL from Step 2

### Issue 4: Getting "CORS" errors
**Cause**: Usually a Supabase configuration issue
**Solution**:
1. Go to Supabase Settings → API
2. Scroll to "CORS Configuration"
3. Make sure your Vercel URL is added (e.g., `https://your-app.vercel.app`)

### Issue 5: Can see todos but can't add new ones
**Cause**: INSERT policy might be missing or RLS is disabled
**Solution**:
1. Go to Authentication → Policies in Supabase
2. Make sure the `todos` table has an INSERT policy
3. Test with the SQL from Step 2

## Verify Your Setup

To verify everything is working:

1. **Test with curl** (from terminal):
   ```bash
   curl -X GET 'https://your-project-ref.supabase.co/rest/v1/todos' \
     -H 'apikey: your-anon-key' \
     -H 'Content-Type: application/json'
   ```

2. **Check Supabase Dashboard**:
   - Go to **Table Editor** in Supabase
   - Click **todos** table
   - You should see your added items there

3. **Check Console Logs**:
   - Open your app
   - Press F12 → Console
   - You should see ✅ messages confirming operations

## Getting Help

If you're still having issues:

1. **Check the DEBUGGING.md** file in the repo
2. **Check Supabase Docs**: https://supabase.com/docs
3. **Check the browser console** for detailed error messages
4. **Check Supabase Project Logs**: Settings → Logs (in Supabase dashboard)

## Next Steps

Once everything is working:
- Add more features (categories, due dates, etc.)
- Set up authentication for user-specific todos
- Deploy with confidence!

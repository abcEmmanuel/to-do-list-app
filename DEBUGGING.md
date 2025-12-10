# Debugging Guide for To-Do App

## Add Button Not Working - Common Issues

### 1. **Check Browser Console for Errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages from "Insert error"

### 2. **Row Level Security (RLS) Issue (Most Common)**
   If you see an error like "new row violates row-level security policy", your Supabase table has RLS enabled.

   **Fix in Supabase Dashboard:**
   - Go to Authentication → Policies
   - Find your `todos` table
   - Either **disable RLS** for testing, or
   - **Add RLS policies** to allow unauthenticated inserts:
     ```sql
     CREATE POLICY "Allow public insert" ON todos
     FOR INSERT
     TO public
     WITH CHECK (true);
     
     CREATE POLICY "Allow public select" ON todos
     FOR SELECT
     TO public
     USING (true);
     
     CREATE POLICY "Allow public update" ON todos
     FOR UPDATE
     TO public
     USING (true);
     
     CREATE POLICY "Allow public delete" ON todos
     FOR DELETE
     TO public
     USING (true);
     ```

### 3. **Check Environment Variables**
   On Vercel, verify that these are set:
   - `NEXT_PUBLIC_SUPABASE_URL` - your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - your Supabase anon key

   Check in Vercel Dashboard:
   - Project Settings → Environment Variables

### 4. **Check Supabase Table Schema**
   Ensure your `todos` table has these columns:
   - `id` (auto-incrementing primary key)
   - `content` (text)
   - `done` (boolean, default: false)
   - `created_at` (timestamp, optional)

   **Create table if missing:**
   ```sql
   CREATE TABLE todos (
     id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
     content TEXT NOT NULL,
     done BOOLEAN NOT NULL DEFAULT false,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### 5. **Test with Browser Console**
   ```javascript
   // Run in console on deployed site
   const { getSupabase } = await import('/lib/supabaseClient.js');
   const client = getSupabase();
   const result = await client.from('todos').select('*');
   console.log(result);
   ```

### 6. **Check Insert Response**
   The app now logs detailed error messages. Check:
   - Browser Console for the exact error
   - Network tab in DevTools to see the API response

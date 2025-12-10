# To‑Do List App (Next.js + Supabase)

A modern, minimalist to‑do list application built with **Next.js** and **Supabase**, ready to deploy on **Vercel**.

## Features

✅ **Add tasks** - Create new to-do items  
✅ **Toggle done** - Mark tasks complete/incomplete  
✅ **Delete tasks** - Remove completed or unwanted tasks  
✅ **Persistent storage** - All tasks saved in Supabase database  
✅ **Modern UI** - Beautiful gradient design with smooth animations  
✅ **Responsive** - Works on desktop, tablet, and mobile  

## Quick Start

### 1. Set up Supabase

**👉 [Follow the detailed Supabase setup guide here](./SUPABASE_SETUP.md)**

This guide includes:
- Creating a Supabase project
- Setting up the `todos` table
- Getting your API keys
- Configuring environment variables
- Troubleshooting common issues

### 2. Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase keys
cp .env.example .env.local
# Then edit .env.local and add your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Import the repo into [Vercel](https://vercel.com)
3. Add Environment Variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
4. Click Deploy — Vercel will build and deploy automatically

## Troubleshooting

Having issues? Check these files:
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase configuration guide
- **[DEBUGGING.md](./DEBUGGING.md)** - Debugging common issues

Common problems:
- ❌ "Add button doesn't work" → Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) Step 5
- ❌ "Supabase not configured" → Set environment variables
- ❌ "RLS preventing inserts" → Run the SQL policies from [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Hosting**: [Vercel](https://vercel.com/)
- **Styling**: CSS-in-JS with styled JSX

## Project Structure

```
├── pages/
│   ├── _app.js           # Next.js app wrapper
│   └── index.js          # Main to-do list page
├── lib/
│   └── supabaseClient.js # Supabase client setup
├── styles/
│   └── globals.css       # Global styles
├── .env.example          # Example environment variables
├── package.json          # Dependencies
└── README.md             # This file
```

## Notes

- This app uses the **client-side anon key** for simplicity. For production apps with private data, add server-side API routes and the `service_role` key.
- You can enable [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security) policies for better security.
- All data is stored in Supabase's PostgreSQL database and persists across sessions.

## License

MIT


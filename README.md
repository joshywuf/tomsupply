# Smart Tom School Supplies Online

A lightweight web app MVP for Smart Tom School Supplies Online, built for a Supabase-backed online ordering flow. It supports:

- student signup and login
- one-time school ID verification upload
- placing printing and supply orders
- tracking order status
- next-day pickup verification workflow

## Tech Stack

- Vite + vanilla JavaScript
- Supabase Auth
- Supabase Database
- Supabase Storage

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your Supabase project values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the app:

```bash
npm run dev
```

5. Open the URL shown in the terminal.

## Supabase setup

1. Create a new Supabase project.
2. Run the SQL from `supabase/schema.sql` in the SQL editor.
3. Create the storage buckets:
   - `school_id_uploads`
   - `order_files`
4. Enable Email auth in Authentication > Providers.
5. Update the app settings in `.env`.

## Core user flow

- Students sign up and log in.
- They upload a back-to-back school ID photo for verification.
- They place a printing or supplies order.
- Smart Tom processes and packs the order overnight.
- On pickup day, the student presents a physical ID and the staff verifies it.

## Demo notes

This project is intentionally a lean MVP for a student ordering workflow and is designed to be expanded into a production storefront later.

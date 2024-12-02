# Database Setup

## 1. Create Supabase Project

1. Sign up at [Supabase](https://supabase.com) and create a new project
2. Wait for your database to be ready

## 2. Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Create a new query
3. Copy the contents of [`db/schema/schema.sql`](https://github.com/christex-foundation/pipeline/blob/main/db/schema/schema.sql) and paste it into the editor
4. Run the query to create all necessary tables

## 3. Get API Keys

1. In your Supabase dashboard, go to Project Settings (gear icon)
2. Navigate to the API tab
3. Copy these values:
   - Project URL
   - `anon` public key (for client-side use)
   - `service_role` key (for server-side use only)

## 4. Configure Environment Variables

Create a `.env` file in your project root and add:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPERBASE_ANON_KEY=your_anon_key
PRIVATE_SUPABASE_SERVICE_KEY=your_service_role_key
```

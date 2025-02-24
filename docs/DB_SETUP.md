# 📌 Database Setup
Follow these steps to set up your Supabase database for the project.

1. **Create a Supabase Project**
    * Sign up at [Supabase](https://supabase.com/) and create a new project.
    * Wait for the database setup to complete.

2. **Set Up the Database Schema**
    * Open your **Supabase dashboard** and navigate to the **SQL Editor**.
    * Click **"New Query"** to create a new SQL script.
    * Copy the contents of [db/schema/schema.sql](https://github.com/christex-foundation/pipeline/blob/6b5d23fb78cb5f2220e77411a3814747d15fcc24/db/schema/schema.sql).
    * Paste it into the editor and **run the query** to create the necessary tables.

3. **Get API Keys**
    * In your Supabase dashboard, go to **Project Settings** (⚙️ gear icon).
    * Navigate to the **API** tab.
    * Copy the following values:
        * **Project URL**
        * **anon public key** (for client-side use)
        * **service_role key** (⚠️ for server-side use only)
 
4. **Configure Environment Variables**
    * Create a **.env** file in your project root.
    * Add the following variables with your Supabase credentials:

    ```
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    PRIVATE_SUPABASE_SERVICE_KEY=your_service_role_key
    ```
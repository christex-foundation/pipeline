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

3. **Set Up Supabase Storage (for image uploads)**

    The app needs a place to store images that users upload — profile pictures, profile banners, and project banners. These are saved in a Supabase Storage "bucket" named **`pipeline-images`**.

    You need to do **two things** to make uploads work:

    1. **Create the bucket.**
    2. **Add permissions (policies)** so logged-in users are allowed to upload.

    If you skip either one, uploads will fail.

    **Step 3a — Create the bucket**

    * In your Supabase dashboard, click **Storage** in the left sidebar.
    * Click **New bucket**.
    * Name it exactly `pipeline-images` (lowercase, with a hyphen).
    * Turn **Public bucket** to **ON**.
    * Click **Save**.

    **Step 3b — Add the permissions**

    * Go to the **SQL Editor** and click **New Query**.
    * Open [db/schema/storage_policies.sql](../db/schema/storage_policies.sql), copy everything inside it, paste it into the editor, and click **Run**.
    * You should see "Success. No rows returned."

    That's it — the bucket now allows anyone to view images and lets signed-in users upload their own.

    **Step 3c — Test that it works**

    After you finish steps 4 and 5 below:

    * Run `npm run dev`.
    * Sign in, go to `/project/create`, and create a project with a banner image.
    * If the image shows up on the project page, your storage is working.

    **If something goes wrong:**

    * **"Bucket not found"** — the bucket name is wrong. Re-check step 3a.
    * **"row-level security policy" error** — you skipped step 3b. Run the SQL file again.
    * **Image doesn't load on the page** — the bucket isn't public. Open it in Supabase and flip the **Public** toggle on.

4. **Get API Keys**
    * In your Supabase dashboard, go to **Project Settings** (⚙️ gear icon).
    * Navigate to the **API** tab.
    * Copy the following values:
        * **Project URL**
        * **anon public key** (for client-side use)
        * **service_role key** (⚠️ for server-side use only)
 
5. **Configure Environment Variables**
    * Create a **.env** file in your project root.
    * Add the following variables with your Supabase credentials:

    ```
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    PRIVATE_SUPABASE_SERVICE_KEY=your_service_role_key
    ```
    
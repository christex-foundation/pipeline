# 📌 Storage Setup

Set up Supabase Storage so the app can save images that users upload — profile pictures, profile banners, and project banners. All of these are kept in a Supabase Storage "bucket" named **`pipeline-images`**.

> Complete [Database Setup](./DB_SETUP.md) before following these steps.

You need to do **two things** to make uploads work:

1. **Create the bucket.**
2. **Add permissions (policies)** so logged-in users are allowed to upload.

If you skip either one, uploads will fail.

## 1. Create the bucket

* In your Supabase dashboard, click **Storage** in the left sidebar.
* Click **New bucket**.
* Name it exactly `pipeline-images` (lowercase, with a hyphen).
* Turn **Public bucket** to **ON**.
* Click **Save**.

## 2. Add the permissions

* Go to the **SQL Editor** and click **New Query**.
* Open [db/schema/storage_policies.sql](../db/schema/storage_policies.sql), copy everything inside it, paste it into the editor, and click **Run**.
* You should see "Success. No rows returned."

That's it — the bucket now allows anyone to view images and lets signed-in users upload their own.

## 3. Test that it works

* Run `npm run dev`.
* Sign in, go to `/project/create`, and create a project with a banner image.
* If the image shows up on the project page, your storage is working.

## Troubleshooting

* **"Bucket not found"** — the bucket name is wrong. Re-check step 1.
* **"row-level security policy" error** — you skipped step 2. Run the SQL file again.
* **Image doesn't load on the page** — the bucket isn't public. Open it in Supabase and flip the **Public** toggle on.

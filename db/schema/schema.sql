CREATE TABLE IF NOT EXISTS public.projects (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NULL,
    title text NULL,
    bio text NULL,
    github_repo text NULL,
    funding_goal double precision NULL,
    current_funding double precision NULL,
    status text NULL,
    updated_at timestamp with time zone NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    country text NULL,
    details text NULL,
    email text NULL,
    portfolio text NULL,
    linkedin text NULL,
    twitter text NULL,
    website text NULL,
    other text NULL,
    bank_acct text NULL,
    wallet_address text NULL,
    image text NULL,
    banner_image text NULL,
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.bookmark_project (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NULL,
    project_id uuid NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT bookmark_project_pkey PRIMARY KEY (id),
    CONSTRAINT bookmark_project_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT bookmark_project_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NULL,
    description text NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    sdg_id smallint NULL,
    image text NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.category_project (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    category_id uuid NULL,
    project_id uuid NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT category_project_pkey PRIMARY KEY (id),
    CONSTRAINT category_project_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT category_project_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.dpg_status (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NULL,
    criteria text NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT dpg_status_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.profile (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    user_type text NULL,
    github text NULL,
    skills json NULL,
    interests json[] NULL,
    points integer NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL,
    image text NULL,
    bio text NULL,
    country text NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT profile_user_id_key UNIQUE (user_id),
    CONSTRAINT profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.project_dpg_status (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    project_id uuid NULL,
    status_id uuid NULL,
    CONSTRAINT project_dpg_status_pkey PRIMARY KEY (id),
    CONSTRAINT project_dpg_status_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT project_dpg_status_status_id_fkey FOREIGN KEY (status_id) REFERENCES dpg_status(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.project_members (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NULL,
    project_id uuid NULL,
    creator_id uuid NULL,
    CONSTRAINT project_members_pkey PRIMARY KEY (id),
    CONSTRAINT project_members_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES auth.users(id),
    CONSTRAINT project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT project_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.project_resource (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NULL,
    type_resource text NULL,
    title text NULL,
    link text NULL,
    country text NULL,
    reason text NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NULL,
    CONSTRAINT project_resource_pkey PRIMARY KEY (id),
    CONSTRAINT project_resource_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT project_resource_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.project_updates (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NULL,
    body text NULL,
    user_id uuid NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
    project_id uuid NULL,
    CONSTRAINT project_updates_pkey PRIMARY KEY (id),
    CONSTRAINT project_updates_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT project_updates_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.project_update_comment (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NULL,
    project_id uuid NULL,
    update_id uuid NULL,
    body text NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT project_update_comment_pkey PRIMARY KEY (id),
    CONSTRAINT project_update_comment_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT project_update_comment_update_id_fkey FOREIGN KEY (update_id) REFERENCES project_updates(id),
    CONSTRAINT project_update_comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) TABLESPACE pg_default;

INSERT INTO
  public.categories (title, description, created_at, sdg_id, image)
VALUES
  ('No Poverty', 
   'End poverty in all its forms everywhere', 
   NOW(), 
   1, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-01.jpg?t=2024-11-18T16%3A05%3A17.510Z'),
   
  ('Zero Hunger', 
   'End hunger, achieve food security, improve nutrition, and promote sustainable agriculture', 
   NOW(), 
   2, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-02.jpg?t=2024-11-18T16%3A07%3A24.534Z'),
   
  ('Good Health and Well-being', 
   'Ensure healthy lives and promote well-being for all at all ages', 
   NOW(), 
   3, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-03.jpg?t=2024-11-18T16%3A07%3A45.633Z'),
   
  ('Quality Education', 
   'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all', 
   NOW(), 
   4, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-04.jpg?t=2024-11-18T16%3A08%3A10.025Z'),
   
  ('Gender Equality', 
   'Achieve gender equality and empower all women and girls.', 
   NOW(), 
   5, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-05.jpg'),
   
  ('Clean Water and Sanitation', 
   'Ensure availability and sustainable management of water and sanitation for all', 
   NOW(), 
   6, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-06.jpg'),
   
  ('Affordable and Clean Energy', 
   'Ensure access to affordable, reliable, sustainable, and modern energy for all.', 
   NOW(), 
   7, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-07.jpg'),
   
  ('Decent Work and Economic Growth', 
   'Promote sustained, inclusive, and sustainable economic growth, full and productive employment, and decent work for all.', 
   NOW(), 
   8, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-08.jpg'),
   
  ('Industry, Innovation, and Infrastructure', 
   'Build resilient infrastructure, promote inclusive and sustainable industrialisation, and foster innovation.', 
   NOW(), 
   9, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-09.jpg'),
   
  ('Reduce Inequality', 
   'Reduce inequality within and among countries.', 
   NOW(), 
   10, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-10.jpg'),
   
  ('Sustainable Cities and Communities', 
   'Make cities and human settlements inclusive, safe, resilient, and sustainable.', 
   NOW(), 
   11, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-11.jpg'),
   
  ('Responsible Consumption and Production', 
   'Ensure sustainable consumption and production patterns.', 
   NOW(), 
   12, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-12.jpg'),
   
  ('Climate Action', 
   'Take urgent action to combat climate change and its impacts.', 
   NOW(), 
   13, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-13.jpg'),
   
  ('Life Below Water', 
   'Conserve and sustainably use the oceans, seas, and marine resources for sustainable development.', 
   NOW(), 
   14, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-14.jpg'),
   
  ('Life on Land', 
   'Protect, restore, and promote sustainable use of terrestrial ecosystems, manage forests, combat desertification, halt and reverse land degradation, and halt biodiversity loss.', 
   NOW(), 
   15, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-15.jpg'),
   
  ('Peace, Justice, and Strong Institutions', 
   'Promote peaceful and inclusive societies, provide access to justice for all, and build effective, accountable, and inclusive institutions.', 
   NOW(), 
   16, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-16.jpg'),
   
  ('Partnerships for the Goals', 
   'Strengthen the means of implementation and revitalise the global partnership for sustainable development.', 
   NOW(), 
   17, 
   'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/SDGs/E_SDG_Icons-17.jpg');

INSERT INTO
  public.dpg_status (NAME, criteria, created_at)
VALUES
  ('Platform Independence', 
   'The solution can operate across different platforms without significant modifications.', 
   NOW()),

  ('Clear Ownership', 
   'The ownership and management structure of the solution are clearly defined.', 
   NOW()),

  ('Relevance to Sustainable Development Goals', 
   'The solution directly contributes to achieving one or more Sustainable Development Goals.', 
   NOW()),

  ('Adherence to Privacy and Applicable Laws', 
   'The solution complies with all relevant privacy regulations and legal frameworks.', 
   NOW()),

  ('Documentation', 
   'Comprehensive and accessible documentation is provided for users and developers.', 
   NOW()),

  ('Adherence to Standards & Best Practices', 
   'The solution follows recognized standards and best practices to ensure quality and reliability.', 
   NOW()),

  ('Use of Approved Open Licenses', 
   'The solution is released under an approved open-source license.', 
   NOW()),

  ('Do No Harm By Design', 
   'The solution is intentionally designed to avoid causing harm to users or society.', 
   NOW()),

  ('Mechanism for Extracting Data and Content', 
   'Users can extract their data and content easily without vendor lock-in.', 
   NOW());


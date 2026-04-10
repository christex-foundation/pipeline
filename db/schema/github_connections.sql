CREATE TABLE IF NOT EXISTS public.github_connections (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    github_user_id bigint NOT NULL,
    github_username text NOT NULL,
    access_token text NOT NULL,
    scopes text NOT NULL,
    connected_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT github_connections_pkey PRIMARY KEY (id),
    CONSTRAINT github_connections_user_id_key UNIQUE (user_id),
    CONSTRAINT github_connections_github_user_id_key UNIQUE (github_user_id),
    CONSTRAINT github_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.github_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connection"
    ON public.github_connections FOR SELECT USING (auth.uid() = user_id);

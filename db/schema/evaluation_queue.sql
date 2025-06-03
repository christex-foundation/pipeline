-- Create evaluation_queue table for storing DPG evaluation tasks
CREATE TABLE IF NOT EXISTS public.evaluation_queue (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    github_url text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    started_at timestamp with time zone NULL,
    completed_at timestamp with time zone NULL,
    retry_count integer NOT NULL DEFAULT 0,
    error text NULL,
    result jsonb NULL,
    CONSTRAINT evaluation_queue_pkey PRIMARY KEY (id),
    CONSTRAINT evaluation_queue_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id)
) TABLESPACE pg_default;

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS evaluation_queue_status_idx ON public.evaluation_queue (status);

-- Create function to create the evaluation_queue table if it doesn't exist
CREATE OR REPLACE FUNCTION create_evaluation_queue_if_not_exists()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'evaluation_queue') THEN
        CREATE TABLE public.evaluation_queue (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            project_id uuid NOT NULL,
            github_url text NOT NULL,
            status text NOT NULL DEFAULT 'pending',
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            started_at timestamp with time zone NULL,
            completed_at timestamp with time zone NULL,
            retry_count integer NOT NULL DEFAULT 0,
            error text NULL,
            result jsonb NULL,
            CONSTRAINT evaluation_queue_pkey PRIMARY KEY (id),
            CONSTRAINT evaluation_queue_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id)
        );
        
        CREATE INDEX evaluation_queue_status_idx ON public.evaluation_queue (status);
    END IF;
END;
$$ LANGUAGE plpgsql;
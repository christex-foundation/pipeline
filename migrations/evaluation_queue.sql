-- Create evaluation_queue table for Vercel cron job implementation
-- This replaces the Redis/BullMQ queue with a database-backed queue

-- Function to create the evaluation_queue table if it doesn't exist
CREATE OR REPLACE FUNCTION create_evaluation_queue_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'evaluation_queue') THEN
    -- Create the evaluation_queue table
    CREATE TABLE public.evaluation_queue (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
      github_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      started_at TIMESTAMP WITH TIME ZONE,
      completed_at TIMESTAMP WITH TIME ZONE,
      retry_count INTEGER DEFAULT 0,
      result JSONB,
      error TEXT
    );

    -- Create an index on status for faster queries
    CREATE INDEX evaluation_queue_status_idx ON public.evaluation_queue(status);
    
    -- Create an index on project_id for faster lookups
    CREATE INDEX evaluation_queue_project_id_idx ON public.evaluation_queue(project_id);
    
    -- Enable RLS
    ALTER TABLE public.evaluation_queue ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for service role access
    CREATE POLICY "Service role can do all operations on evaluation_queue"
      ON public.evaluation_queue
      FOR ALL
      TO service_role
      USING (true);
      
    -- Create policy for authenticated users to read their own projects' evaluations
    CREATE POLICY "Authenticated users can read their own projects' evaluations"
      ON public.evaluation_queue
      FOR SELECT
      TO authenticated
      USING (
        project_id IN (
          SELECT id FROM public.projects
          WHERE id = evaluation_queue.project_id
          AND owner_id = auth.uid()
        )
      );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create the table if it doesn't exist
SELECT create_evaluation_queue_if_not_exists();
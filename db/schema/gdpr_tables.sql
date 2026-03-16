-- GDPR Compliance Tables Migration
-- Tables for consent management, privacy requests, and data processing audit logs

-- User consent tracking for cookies and data processing
CREATE TABLE IF NOT EXISTS public.user_consents (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN ('cookies_necessary', 'cookies_functional', 'cookies_analytics', 'marketing', 'data_processing')),
    consented BOOLEAN NOT NULL DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT user_consents_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_user_consents_type ON public.user_consents(consent_type);

-- Privacy requests tracking (data access, deletion, rectification)
CREATE TABLE IF NOT EXISTS public.privacy_requests (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('data_access', 'data_deletion', 'data_rectification', 'data_portability', 'objection')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    requested_at timestamp with time zone NOT NULL DEFAULT NOW(),
    completed_at timestamp with time zone,
    CONSTRAINT privacy_requests_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_privacy_requests_user_id ON public.privacy_requests(user_id);
CREATE INDEX idx_privacy_requests_status ON public.privacy_requests(status);

-- Data processing audit logs for GDPR compliance
CREATE TABLE IF NOT EXISTS public.data_processing_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL CHECK (action IN ('data_access', 'data_export', 'data_deletion', 'data_update', 'consent_granted', 'consent_withdrawn', 'account_created', 'account_anonymized')),
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT data_processing_logs_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_data_processing_logs_user_id ON public.data_processing_logs(user_id);
CREATE INDEX idx_data_processing_logs_action ON public.data_processing_logs(action);
CREATE INDEX idx_data_processing_logs_created_at ON public.data_processing_logs(created_at);

-- Enable RLS
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_processing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_consents
CREATE POLICY "Users can view own consents" ON public.user_consents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents" ON public.user_consents
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own consents" ON public.user_consents
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for privacy_requests
CREATE POLICY "Users can view own requests" ON public.privacy_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON public.privacy_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests" ON public.privacy_requests
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for data_processing_logs
CREATE POLICY "Users can view own logs" ON public.data_processing_logs
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage all logs" ON public.data_processing_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Function to automatically log data processing activities
CREATE OR REPLACE FUNCTION public.log_data_processing(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_entity_type VARCHAR(50) DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.data_processing_logs (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
    VALUES (
        p_user_id,
        p_action,
        p_entity_type,
        p_entity_id,
        p_details,
        (SELECT client_ip FROM auth.current_session()),
        (SELECT user_agent FROM auth.current_session())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

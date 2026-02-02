-- Tabelle für benutzerdefinierte Formular-Designs
CREATE TABLE IF NOT EXISTS public.user_form_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    org_id UUID REFERENCES organizations(id),
    
    name TEXT NOT NULL DEFAULT 'Neues Design',
    design_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Sharing
    is_default BOOLEAN DEFAULT FALSE,
    shared_with_org BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_form_designs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own designs"
ON public.user_form_designs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view org shared designs"
ON public.user_form_designs
FOR SELECT
USING (
    shared_with_org = true 
    AND org_id = user_organization_id(auth.uid())
);

CREATE POLICY "Users can create own designs"
ON public.user_form_designs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own designs"
ON public.user_form_designs
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own designs"
ON public.user_form_designs
FOR DELETE
USING (auth.uid() = user_id);

-- Tabelle für KI-Nutzungsprotokoll
CREATE TABLE IF NOT EXISTS public.ai_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Was
    action TEXT NOT NULL,
    app_id TEXT DEFAULT 'formulare',
    form_slug TEXT,
    
    -- Tokens
    input_tokens INTEGER,
    output_tokens INTEGER,
    model TEXT DEFAULT 'claude-3-5-sonnet',
    
    -- Kosten (in Cent)
    cost_cents INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Users can only view own usage
CREATE POLICY "Users can view own ai usage"
ON public.ai_usage_log
FOR SELECT
USING (auth.uid() = user_id);

-- No client inserts - only via edge functions with service role
CREATE POLICY "Block client ai usage inserts"
ON public.ai_usage_log
FOR INSERT
WITH CHECK (false);

-- Index für Rate-Limiting
CREATE INDEX idx_ai_usage_user_date ON public.ai_usage_log(user_id, created_at);
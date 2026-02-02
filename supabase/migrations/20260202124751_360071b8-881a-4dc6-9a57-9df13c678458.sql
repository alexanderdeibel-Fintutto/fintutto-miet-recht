-- ===========================================
-- PHASE 1: FORMULARE SHOP DATABASE SCHEMA
-- ===========================================

-- 1. Add persona column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS persona TEXT DEFAULT 'unknown';

-- 2. Create form_templates table
CREATE TABLE public.form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'sonstige',
  persona TEXT NOT NULL DEFAULT 'beide', -- 'vermieter' | 'mieter' | 'beide'
  price_cents INTEGER NOT NULL DEFAULT 0,
  stripe_price_id TEXT,
  tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'basic' | 'premium'
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  template_content TEXT,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create bundles table
CREATE TABLE public.bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  stripe_price_id TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create bundle_form_templates junction table
CREATE TABLE public.bundle_form_templates (
  bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  form_template_id UUID NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, form_template_id)
);

-- 5. Create form_purchases table
CREATE TABLE public.form_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  form_template_id UUID REFERENCES public.form_templates(id),
  bundle_id UUID REFERENCES public.bundles(id),
  stripe_payment_intent TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  purchased_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT purchase_type_check CHECK (
    (form_template_id IS NOT NULL AND bundle_id IS NULL) OR
    (form_template_id IS NULL AND bundle_id IS NOT NULL)
  )
);

-- 6. Create generated_documents table
CREATE TABLE public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  form_template_id UUID REFERENCES public.form_templates(id),
  form_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_url TEXT,
  status TEXT DEFAULT 'draft', -- 'draft' | 'generated'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create user_form_drafts table
CREATE TABLE public.user_form_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  form_template_id UUID NOT NULL REFERENCES public.form_templates(id),
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_step INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, form_template_id)
);

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================
ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_form_drafts ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- RLS POLICIES: form_templates (public read)
-- ===========================================
CREATE POLICY "Anyone can view active form templates"
ON public.form_templates FOR SELECT
USING (is_active = true);

-- ===========================================
-- RLS POLICIES: bundles (public read)
-- ===========================================
CREATE POLICY "Anyone can view active bundles"
ON public.bundles FOR SELECT
USING (is_active = true);

-- ===========================================
-- RLS POLICIES: bundle_form_templates (public read)
-- ===========================================
CREATE POLICY "Anyone can view bundle form relationships"
ON public.bundle_form_templates FOR SELECT
USING (true);

-- ===========================================
-- RLS POLICIES: form_purchases
-- ===========================================
CREATE POLICY "Users can view own purchases"
ON public.form_purchases FOR SELECT
USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for clients - handled by service role in webhooks

-- ===========================================
-- RLS POLICIES: generated_documents
-- ===========================================
CREATE POLICY "Users can view own generated documents"
ON public.generated_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own generated documents"
ON public.generated_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated documents"
ON public.generated_documents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated documents"
ON public.generated_documents FOR DELETE
USING (auth.uid() = user_id);

-- ===========================================
-- RLS POLICIES: user_form_drafts
-- ===========================================
CREATE POLICY "Users can view own drafts"
ON public.user_form_drafts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own drafts"
ON public.user_form_drafts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
ON public.user_form_drafts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
ON public.user_form_drafts FOR DELETE
USING (auth.uid() = user_id);

-- ===========================================
-- VIEW: v_user_available_forms
-- ===========================================
CREATE OR REPLACE VIEW public.v_user_available_forms AS
SELECT 
  auth.uid() as user_id,
  ft.id as form_template_id,
  ft.slug,
  ft.name,
  ft.tier,
  ft.price_cents,
  CASE
    WHEN ft.tier = 'free' THEN true
    WHEN EXISTS (
      SELECT 1 FROM public.form_purchases fp 
      WHERE fp.user_id = auth.uid() 
      AND fp.form_template_id = ft.id 
      AND fp.status = 'completed'
    ) THEN true
    WHEN EXISTS (
      SELECT 1 FROM public.form_purchases fp 
      JOIN public.bundle_form_templates bft ON bft.bundle_id = fp.bundle_id
      WHERE fp.user_id = auth.uid() 
      AND bft.form_template_id = ft.id 
      AND fp.status = 'completed'
    ) THEN true
    WHEN EXISTS (
      SELECT 1 FROM public.user_subscriptions us 
      WHERE us.user_id = auth.uid() 
      AND us.app_id = 'formulare' 
      AND us.status = 'active'
      AND us.plan_id IN ('basic', 'pro')
    ) THEN true
    ELSE false
  END as has_access
FROM public.form_templates ft
WHERE ft.is_active = true;

-- ===========================================
-- HELPER FUNCTION: Check form access
-- ===========================================
CREATE OR REPLACE FUNCTION public.user_has_form_access(_user_id uuid, _form_template_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.v_user_available_forms
    WHERE user_id = _user_id 
    AND form_template_id = _form_template_id 
    AND has_access = true
  )
$$;

-- ===========================================
-- TRIGGER: Update updated_at on generated_documents
-- ===========================================
CREATE TRIGGER update_generated_documents_updated_at
BEFORE UPDATE ON public.generated_documents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ===========================================
-- TRIGGER: Update updated_at on user_form_drafts
-- ===========================================
CREATE TRIGGER update_user_form_drafts_updated_at
BEFORE UPDATE ON public.user_form_drafts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ===========================================
-- INDEXES for performance
-- ===========================================
CREATE INDEX idx_form_templates_slug ON public.form_templates(slug);
CREATE INDEX idx_form_templates_category ON public.form_templates(category);
CREATE INDEX idx_form_templates_persona ON public.form_templates(persona);
CREATE INDEX idx_form_templates_tier ON public.form_templates(tier);
CREATE INDEX idx_bundles_slug ON public.bundles(slug);
CREATE INDEX idx_form_purchases_user_id ON public.form_purchases(user_id);
CREATE INDEX idx_generated_documents_user_id ON public.generated_documents(user_id);
CREATE INDEX idx_user_form_drafts_user_id ON public.user_form_drafts(user_id);
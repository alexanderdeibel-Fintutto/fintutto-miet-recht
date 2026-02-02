-- =============================================
-- SECURITY FIX: Hide sensitive business data
-- =============================================

-- 1. Create a public view for bundles that hides stripe_price_id
CREATE OR REPLACE VIEW public.v_bundles_public
WITH (security_invoker = true) AS
SELECT 
  id,
  slug,
  name,
  description,
  price_cents,
  thumbnail_url,
  is_active,
  created_at
FROM public.bundles
WHERE is_active = true;

-- Grant access to the view
GRANT SELECT ON public.v_bundles_public TO anon, authenticated;

-- 2. Create a user-facing view for ai_usage_log that hides cost_cents
CREATE OR REPLACE VIEW public.v_ai_usage_user
WITH (security_invoker = true) AS
SELECT 
  id,
  user_id,
  action,
  app_id,
  form_slug,
  input_tokens,
  output_tokens,
  model,
  created_at
FROM public.ai_usage_log;

-- Grant access to the view
GRANT SELECT ON public.v_ai_usage_user TO authenticated;

-- 3. Drop the existing user SELECT policy on ai_usage_log (users should use view)
DROP POLICY IF EXISTS "Users can view own ai usage" ON public.ai_usage_log;

-- 4. Create restrictive policy - deny direct SELECT, users must use view
CREATE POLICY "Deny direct user select on ai_usage_log"
ON public.ai_usage_log
FOR SELECT
TO authenticated
USING (false);

-- 5. Verify v_user_available_forms has security_invoker (recreate if needed)
-- First check: the view should already have security_invoker=true based on memory
-- If not, we recreate it. Since we can't conditionally recreate, we'll ensure it's correct.

-- Drop and recreate v_user_available_forms with explicit security_invoker
DROP VIEW IF EXISTS public.v_user_available_forms;

CREATE OR REPLACE VIEW public.v_user_available_forms
WITH (security_invoker = true) AS
SELECT 
  ft.id AS form_template_id,
  auth.uid() AS user_id,
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
      JOIN public.bundle_form_templates bft ON fp.bundle_id = bft.bundle_id
      WHERE fp.user_id = auth.uid()
      AND bft.form_template_id = ft.id
      AND fp.status = 'completed'
    ) THEN true
    WHEN EXISTS (
      SELECT 1 FROM public.user_subscriptions us
      WHERE us.user_id = auth.uid()
      AND us.status = 'active'
      AND us.app_id = 'formulare'
    ) THEN true
    ELSE false
  END AS has_access
FROM public.form_templates ft
WHERE ft.is_active = true;

-- Grant access to the view
GRANT SELECT ON public.v_user_available_forms TO authenticated;
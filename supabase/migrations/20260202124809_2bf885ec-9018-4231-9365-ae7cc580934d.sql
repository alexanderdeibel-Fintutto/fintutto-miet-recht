-- Fix: Recreate view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.v_user_available_forms;

CREATE VIEW public.v_user_available_forms 
WITH (security_invoker = true)
AS
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
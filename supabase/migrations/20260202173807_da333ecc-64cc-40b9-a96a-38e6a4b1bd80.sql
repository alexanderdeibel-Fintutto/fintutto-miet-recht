-- ===========================================
-- SECURITY FIX: Recreate v_user_available_forms with security_invoker
-- This ensures the view respects RLS on underlying tables
-- and can only be queried by authenticated users
-- ===========================================

-- Drop the existing view
DROP VIEW IF EXISTS public.v_user_available_forms;

-- Recreate the view with security_invoker = true
-- This makes the view execute with the permissions of the calling user
-- rather than the view owner, preventing privilege escalation
CREATE VIEW public.v_user_available_forms
WITH (security_invoker = true)
AS
SELECT 
    auth.uid() AS user_id,
    ft.id AS form_template_id,
    ft.slug,
    ft.name,
    ft.tier,
    ft.price_cents,
    CASE
        WHEN ft.tier = 'free'::text THEN true
        WHEN EXISTS (
            SELECT 1
            FROM public.form_purchases fp
            WHERE fp.user_id = auth.uid() 
              AND fp.form_template_id = ft.id 
              AND fp.status = 'completed'::text
        ) THEN true
        WHEN EXISTS (
            SELECT 1
            FROM public.form_purchases fp
            JOIN public.bundle_form_templates bft ON bft.bundle_id = fp.bundle_id
            WHERE fp.user_id = auth.uid() 
              AND bft.form_template_id = ft.id 
              AND fp.status = 'completed'::text
        ) THEN true
        WHEN EXISTS (
            SELECT 1
            FROM public.user_subscriptions us
            WHERE us.user_id = auth.uid() 
              AND us.app_id = 'formulare'::text 
              AND us.status = 'active'::text 
              AND us.plan_id = ANY (ARRAY['basic'::text, 'pro'::text])
        ) THEN true
        ELSE false
    END AS has_access
FROM public.form_templates ft
WHERE ft.is_active = true;

-- Grant select permission only to authenticated users
REVOKE ALL ON public.v_user_available_forms FROM anon;
GRANT SELECT ON public.v_user_available_forms TO authenticated;
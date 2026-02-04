-- Fix 1: Secure v_ai_usage_user view by recreating it with security_barrier and built-in user filter
-- Drop and recreate with proper security settings
DROP VIEW IF EXISTS public.v_ai_usage_user;

CREATE VIEW public.v_ai_usage_user
WITH (security_barrier = true, security_invoker = true) AS
SELECT 
  id,
  user_id,
  action,
  app_id,
  form_slug,
  model,
  input_tokens,
  output_tokens,
  created_at
FROM public.ai_usage_log
WHERE user_id = auth.uid();

-- The view now:
-- 1. Has security_barrier = true to prevent information leakage
-- 2. Has security_invoker = true to use the calling user's permissions
-- 3. Built-in WHERE clause ensures users can ONLY see their own data
-- Note: cost_cents is intentionally excluded from the view
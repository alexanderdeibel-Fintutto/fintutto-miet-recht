-- Create a public view for form_templates that hides sensitive data
CREATE OR REPLACE VIEW public.v_form_templates_public
WITH (security_invoker = true)
AS
SELECT
  id,
  slug,
  name,
  description,
  category,
  persona,
  tier,
  price_cents,
  thumbnail_url,
  seo_title,
  seo_description,
  seo_keywords,
  sort_order,
  is_active,
  created_at
  -- Explicitly excluding: stripe_price_id, fields, template_content
FROM public.form_templates
WHERE is_active = true;

-- Add RLS policy for the public form templates view
-- (View uses security_invoker, so underlying table RLS applies)

-- Ensure v_ai_usage_user has security_invoker enabled
ALTER VIEW public.v_ai_usage_user SET (security_invoker = true);

-- Grant SELECT on the new public views
GRANT SELECT ON public.v_form_templates_public TO anon, authenticated;
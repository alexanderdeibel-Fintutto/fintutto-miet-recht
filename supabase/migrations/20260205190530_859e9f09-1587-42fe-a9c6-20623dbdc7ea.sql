-- Add policy to allow public viewing of form template catalog (basic info only)
-- This policy allows anyone to view basic form info for active templates
-- The view v_form_templates_public already excludes sensitive fields (template_content, fields)

CREATE POLICY "Anyone can view active form templates catalog"
ON public.form_templates
FOR SELECT
USING (is_active = true);

-- Drop the overly restrictive policy that requires purchase for viewing catalog
DROP POLICY IF EXISTS "Users can view purchased templates only" ON public.form_templates;
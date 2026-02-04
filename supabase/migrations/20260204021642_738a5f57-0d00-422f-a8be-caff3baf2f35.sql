-- Fix: Restrict form_templates direct access to protect premium content
-- The sensitive fields (fields, template_content) should only be accessible 
-- through the RPC function get_form_template_with_access which has proper checks

-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Users can view templates they have access to" ON public.form_templates;

-- Create a restrictive policy that only allows direct SELECT for templates 
-- where the user has actually purchased/has access (not just free tier)
-- This forces public browsing to use v_form_templates_public view
CREATE POLICY "Users can view purchased templates only" 
ON public.form_templates 
FOR SELECT 
USING (
  (is_active = true) AND user_has_form_access(auth.uid(), id)
);

-- Note: The v_form_templates_public view (which excludes sensitive fields) 
-- and the get_form_template_with_access RPC function handle all other access patterns
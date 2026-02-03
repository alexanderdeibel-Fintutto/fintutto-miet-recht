-- Create secure RPC function to get form template with access check
CREATE OR REPLACE FUNCTION public.get_form_template_with_access(template_slug text)
RETURNS TABLE (
  id uuid,
  slug text,
  name text,
  description text,
  category text,
  persona text,
  tier text,
  price_cents integer,
  fields jsonb,
  template_content text,
  thumbnail_url text,
  seo_title text,
  seo_description text,
  seo_keywords text[],
  sort_order integer,
  is_active boolean,
  created_at timestamptz,
  has_access boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_template_id uuid;
  v_tier text;
  v_has_access boolean := false;
BEGIN
  -- Get template ID and tier
  SELECT ft.id, ft.tier INTO v_template_id, v_tier
  FROM form_templates ft
  WHERE ft.slug = template_slug AND ft.is_active = true;

  IF v_template_id IS NULL THEN
    RETURN; -- Return empty result if template not found
  END IF;

  -- Check access: free tier always has access, otherwise check user access
  IF v_tier = 'free' THEN
    v_has_access := true;
  ELSIF auth.uid() IS NOT NULL THEN
    v_has_access := user_has_form_access(auth.uid(), v_template_id);
  END IF;

  -- Return data based on access level
  IF v_has_access THEN
    -- Full access - return all fields
    RETURN QUERY
    SELECT ft.id, ft.slug, ft.name, ft.description, ft.category,
           ft.persona, ft.tier, ft.price_cents, ft.fields, ft.template_content,
           ft.thumbnail_url, ft.seo_title, ft.seo_description, ft.seo_keywords,
           ft.sort_order, ft.is_active, ft.created_at, true as has_access
    FROM form_templates ft
    WHERE ft.id = v_template_id;
  ELSE
    -- No access - return public data only (hide fields, template_content, stripe_price_id)
    RETURN QUERY
    SELECT ft.id, ft.slug, ft.name, ft.description, ft.category,
           ft.persona, ft.tier, ft.price_cents, '[]'::jsonb as fields,
           NULL::text as template_content, ft.thumbnail_url, ft.seo_title,
           ft.seo_description, ft.seo_keywords, ft.sort_order, ft.is_active,
           ft.created_at, false as has_access
    FROM form_templates ft
    WHERE ft.id = v_template_id;
  END IF;
END;
$$;

-- Remove overly permissive public access policy
DROP POLICY IF EXISTS "Anyone can view active form templates" ON form_templates;

-- Create restrictive policy: only users with access can see full templates
CREATE POLICY "Users can view templates they have access to"
ON form_templates FOR SELECT
USING (
  is_active = true AND
  (tier = 'free' OR user_has_form_access(auth.uid(), id))
);
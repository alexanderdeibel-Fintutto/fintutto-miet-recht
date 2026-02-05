-- Create a function to get featured forms with usage-based ranking
CREATE OR REPLACE FUNCTION public.get_featured_forms(limit_count INTEGER DEFAULT 6)
RETURNS TABLE (
  slug TEXT,
  name TEXT,
  description TEXT,
  category TEXT,
  tier TEXT,
  usage_count BIGINT,
  priority_score INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH usage_stats AS (
    SELECT 
      gd.form_slug,
      COUNT(*) as doc_count
    FROM generated_documents gd
    WHERE gd.created_at > NOW() - INTERVAL '90 days'
    GROUP BY gd.form_slug
  ),
  priority_forms AS (
    -- Known high-priority forms get a boost
    SELECT unnest(ARRAY[
      'mietvertrag-standard',
      'kuendigung-mieter', 
      'uebergabeprotokoll',
      'nebenkostenabrechnung',
      'maengelanzeige',
      'selbstauskunft',
      'mietvertrag-moebliert',
      'mieterhoehung'
    ]) as priority_slug,
    generate_series(100, 93, -1) as priority_boost
  )
  SELECT 
    ft.slug,
    ft.name,
    ft.description,
    ft.category,
    ft.tier,
    COALESCE(us.doc_count, 0) as usage_count,
    COALESCE(pf.priority_boost, 0) + COALESCE(us.doc_count::INTEGER * 10, 0) as priority_score
  FROM form_templates ft
  LEFT JOIN usage_stats us ON ft.slug = us.form_slug
  LEFT JOIN priority_forms pf ON ft.slug = pf.priority_slug
  WHERE ft.is_active = true
  ORDER BY priority_score DESC, ft.sort_order ASC
  LIMIT limit_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_featured_forms(INTEGER) TO anon, authenticated;
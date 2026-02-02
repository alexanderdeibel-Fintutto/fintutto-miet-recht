-- Enable RLS on v_bundles_public view (public data with explicit control)
ALTER VIEW public.v_bundles_public SET (security_invoker = true);

-- Enable RLS on v_user_available_forms view (user-specific data)
ALTER VIEW public.v_user_available_forms SET (security_invoker = true);

-- Note: These views already use security_invoker which means RLS policies 
-- from the underlying tables are applied. The views themselves don't need
-- separate policies as they inherit from their base tables.
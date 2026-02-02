-- Fix overly permissive organization creation
-- Allow users to create organizations ONLY if they don't already have one

-- First drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;

-- Create a helper function to check if user has an organization
CREATE OR REPLACE FUNCTION public.user_has_organization(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND organization_id IS NOT NULL
  )
$$;

-- Create a more restrictive policy that only allows users without an org to create one
CREATE POLICY "Users can create organization if they dont have one"
  ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT user_has_organization(auth.uid())
  );
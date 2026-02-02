-- Create a trigger to assign 'vermieter' role when a user creates their first organization
-- This replaces the client-side role insertion attempt

CREATE OR REPLACE FUNCTION public.assign_vermieter_on_org_create()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  creator_user_id uuid;
BEGIN
  -- Find the user who just linked to this organization
  SELECT user_id INTO creator_user_id
  FROM public.profiles
  WHERE organization_id = NEW.id
  LIMIT 1;
  
  -- If a user is found, assign the vermieter role
  IF creator_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (creator_user_id, 'vermieter')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger function to assign role when profile is linked to organization
CREATE OR REPLACE FUNCTION public.assign_vermieter_on_profile_org_link()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger when organization_id changes from NULL to a value
  IF OLD.organization_id IS NULL AND NEW.organization_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'vermieter')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table (when user links to an organization)
DROP TRIGGER IF EXISTS on_profile_org_link ON public.profiles;
CREATE TRIGGER on_profile_org_link
  AFTER UPDATE OF organization_id ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_vermieter_on_profile_org_link();

-- Enable INSERT on organizations (needed since we're removing RLS blocking)
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
CREATE POLICY "Users can create organizations"
  ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
-- Add explicit denial of public/anonymous access to profiles table
-- Defense-in-depth: ensures unauthenticated users cannot access profile data

CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous insert on profiles"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update on profiles"
ON public.profiles
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete on profiles"
ON public.profiles
FOR DELETE
TO anon
USING (false);
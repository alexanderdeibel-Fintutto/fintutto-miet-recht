-- Add explicit denial of public/anonymous access to units table
-- This ensures unauthenticated users cannot access unit data even if other policies have gaps

CREATE POLICY "Deny anonymous access to units"
ON public.units
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous insert on units"
ON public.units
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update on units"
ON public.units
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete on units"
ON public.units
FOR DELETE
TO anon
USING (false);
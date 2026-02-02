-- Add restrictive write policies to user_roles table to prevent privilege escalation
-- Roles should ONLY be managed server-side via the handle_new_user trigger

-- Deny all client-side INSERT operations
CREATE POLICY "No client inserts to user_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Deny all client-side UPDATE operations  
CREATE POLICY "No client updates to user_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

-- Deny all client-side DELETE operations
CREATE POLICY "No client deletes to user_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);
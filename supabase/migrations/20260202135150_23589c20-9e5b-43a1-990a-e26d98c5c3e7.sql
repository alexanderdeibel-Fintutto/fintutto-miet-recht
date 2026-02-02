-- ===========================================
-- SECURITY FIX 1: Block client-side subscription writes
-- Prevents users from creating fake premium subscriptions
-- ===========================================

-- Drop the vulnerable INSERT policy that allows clients to create subscriptions
DROP POLICY IF EXISTS "Users can create own subscription" ON public.user_subscriptions;

-- Create a blocking policy - subscriptions should ONLY be created by service role (webhooks)
CREATE POLICY "Block client subscription inserts" 
ON public.user_subscriptions 
FOR INSERT 
TO authenticated 
WITH CHECK (false);

-- Also block updates to prevent manipulation of existing subscriptions
CREATE POLICY "Block client subscription updates" 
ON public.user_subscriptions 
FOR UPDATE 
TO authenticated 
USING (false);

-- Block deletes as well
CREATE POLICY "Block client subscription deletes" 
ON public.user_subscriptions 
FOR DELETE 
TO authenticated 
USING (false);

-- ===========================================
-- SECURITY FIX 2: Make subscription_tier read-only in profiles
-- Prevents users from directly setting their tier to premium
-- ===========================================

-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a new policy that prevents subscription_tier modifications
-- Users can update their profile EXCEPT for subscription_tier field
CREATE POLICY "Users can update own profile except subscription_tier" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  subscription_tier = (SELECT subscription_tier FROM public.profiles WHERE user_id = auth.uid())
);

-- ===========================================
-- SECURITY FIX 3: Messages organization isolation
-- Prevents cross-organization messaging abuse
-- ===========================================

-- Drop the vulnerable INSERT policy
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

-- Create organization-scoped messaging policy
CREATE POLICY "Users can send messages within organization scope"
ON public.messages 
FOR INSERT 
TO authenticated
WITH CHECK (
  sender_id = auth.uid() AND (
    -- Same organization
    EXISTS (
      SELECT 1 FROM public.profiles p1
      JOIN public.profiles p2 ON p1.organization_id = p2.organization_id
      WHERE p1.user_id = auth.uid() 
        AND p2.user_id = recipient_id
        AND p1.organization_id IS NOT NULL
    )
    OR
    -- Landlord to their tenant (via lease relationship)
    EXISTS (
      SELECT 1 FROM public.leases l
      JOIN public.units u ON l.unit_id = u.id  
      JOIN public.buildings b ON u.building_id = b.id
      JOIN public.profiles p ON p.organization_id = b.organization_id
      WHERE p.user_id = auth.uid() AND l.tenant_id = recipient_id
    )
    OR
    -- Tenant to their landlord (reverse direction)
    EXISTS (
      SELECT 1 FROM public.leases l
      JOIN public.units u ON l.unit_id = u.id  
      JOIN public.buildings b ON u.building_id = b.id
      JOIN public.profiles p ON p.organization_id = b.organization_id
      WHERE l.tenant_id = auth.uid() AND p.user_id = recipient_id
    )
  )
);
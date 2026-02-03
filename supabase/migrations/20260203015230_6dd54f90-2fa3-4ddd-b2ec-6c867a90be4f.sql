-- Fix 1: Add explicit deny policies to form_purchases table
-- These make the security intent explicit and prevent future misconfigurations

CREATE POLICY "Block client-side purchase creation"
ON form_purchases FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Block client-side purchase updates"
ON form_purchases FOR UPDATE TO authenticated
USING (false);

CREATE POLICY "Block client-side purchase deletion"
ON form_purchases FOR DELETE TO authenticated
USING (false);

-- Fix 2: Update bundle_form_templates to require authentication
-- This prevents competitors from seeing product bundling strategy

DROP POLICY IF EXISTS "Anyone can view bundle form relationships" ON bundle_form_templates;

CREATE POLICY "Authenticated users can view bundle form relationships"
ON bundle_form_templates FOR SELECT TO authenticated
USING (true);

-- Fix 3: Remove public access to bundles base table (stripe_price_id exposure)
-- The v_bundles_public view already exists and excludes stripe_price_id
-- We'll make bundles table only accessible to authenticated users

DROP POLICY IF EXISTS "Anyone can view active bundles" ON bundles;

CREATE POLICY "Authenticated users can view active bundles"
ON bundles FOR SELECT TO authenticated
USING (is_active = true);
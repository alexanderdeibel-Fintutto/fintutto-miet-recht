-- Remove redundant email column from profiles table
-- Email is already available via auth.users and the application uses user.email from auth context

ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;
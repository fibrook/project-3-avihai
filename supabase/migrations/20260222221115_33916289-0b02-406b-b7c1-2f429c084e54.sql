
-- Drop the security definer view and recreate as a regular function
DROP VIEW IF EXISTS public.vacation_follower_counts;

-- Create a regular function instead
CREATE OR REPLACE FUNCTION public.get_vacation_follower_counts()
RETURNS TABLE(vacation_id UUID, follower_count INT)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT vacation_id, COUNT(*)::INT AS follower_count
  FROM public.followers
  GROUP BY vacation_id
$$;

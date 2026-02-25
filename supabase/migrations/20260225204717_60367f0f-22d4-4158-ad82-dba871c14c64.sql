
-- Function to get email by username for login
CREATE OR REPLACE FUNCTION public.get_email_by_username(_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.email
  FROM auth.users au
  JOIN public.profiles p ON p.id = au.id
  WHERE p.username = _username
  LIMIT 1
$$;

-- Storage bucket for vacation images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vacation-images', 'vacation-images', true);

-- Allow anyone authenticated to upload to vacation-images
CREATE POLICY "Admins can upload vacation images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vacation-images'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow public read access
CREATE POLICY "Anyone can view vacation images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vacation-images');

-- Allow admins to delete vacation images
CREATE POLICY "Admins can delete vacation images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vacation-images'
  AND public.has_role(auth.uid(), 'admin')
);

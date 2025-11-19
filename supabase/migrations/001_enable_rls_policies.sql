-- Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clipper ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = user_id AND isActive = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get clipper id from auth
CREATE OR REPLACE FUNCTION public.get_clipper_id(user_id TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT id FROM public.clipper 
    WHERE id = user_id AND isActive = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ADMINS table policies
-- Only admins can view admin records
CREATE POLICY "Admins can view all admin records" ON public.admins
  FOR SELECT
  USING (is_admin(auth.uid()::text));

-- Only super admins can insert/update/delete admin records
CREATE POLICY "Super admins can manage admin records" ON public.admins
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE id = auth.uid()::text 
      AND role = 'super_admin' 
      AND isActive = true
    )
  );

-- CLIPPER table policies
-- Clippers can view their own record
CREATE POLICY "Clippers can view own record" ON public.clipper
  FOR SELECT
  USING (id = auth.uid()::text OR is_admin(auth.uid()::text));

-- Admins can view all clipper records
CREATE POLICY "Admins can view all clippers" ON public.clipper
  FOR SELECT
  USING (is_admin(auth.uid()::text));

-- Admins can manage clipper records
CREATE POLICY "Admins can manage clippers" ON public.clipper
  FOR ALL
  USING (is_admin(auth.uid()::text));

-- VIDEOS table policies
-- Clippers can view their own videos
CREATE POLICY "Clippers can view own videos" ON public.videos
  FOR SELECT
  USING (clipperId = auth.uid()::text OR is_admin(auth.uid()::text));

-- Clippers can insert their own videos
CREATE POLICY "Clippers can submit videos" ON public.videos
  FOR INSERT
  WITH CHECK (clipperId = auth.uid()::text);

-- Admins can manage all videos
CREATE POLICY "Admins can manage all videos" ON public.videos
  FOR ALL
  USING (is_admin(auth.uid()::text));

-- STRIKES table policies
-- Clippers can view their own strikes
CREATE POLICY "Clippers can view own strikes" ON public.strikes
  FOR SELECT
  USING (clipperId = auth.uid()::text OR is_admin(auth.uid()::text));

-- Only admins can create/update strikes
CREATE POLICY "Admins can manage strikes" ON public.strikes
  FOR ALL
  USING (is_admin(auth.uid()::text));

-- MANUAL_REVIEW_QUEUE table policies
-- Only admins can access manual review queue
CREATE POLICY "Admins can access manual reviews" ON public.manual_review_queue
  FOR ALL
  USING (is_admin(auth.uid()::text));

-- ACTIVITIES table policies
-- Clippers can view their own activities
CREATE POLICY "Clippers can view own activities" ON public.activities
  FOR SELECT
  USING (clipperId = auth.uid()::text OR is_admin(auth.uid()::text));

-- System can insert activities (using service role)
CREATE POLICY "System can log activities" ON public.activities
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all activities
CREATE POLICY "Admins can view all activities" ON public.activities
  FOR SELECT
  USING (is_admin(auth.uid()::text));

-- SETTINGS table policies
-- Everyone can read settings
CREATE POLICY "Public can read settings" ON public.settings
  FOR SELECT
  USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL
  USING (is_admin(auth.uid()::text));

-- PAYMENT_RECORDS table policies
-- Clippers can view their own payment records
CREATE POLICY "Clippers can view own payments" ON public.payment_records
  FOR SELECT
  USING (clipperId = auth.uid()::text OR is_admin(auth.uid()::text));

-- Only admins can create/update payment records
CREATE POLICY "Admins can manage payments" ON public.payment_records
  FOR ALL
  USING (is_admin(auth.uid()::text));
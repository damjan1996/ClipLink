-- ===============================================
-- Fix RLS Policies für ClipLink
-- ===============================================
-- Dieses Script passt die RLS-Policies an, damit sie richtig funktionieren

-- Zuerst alle bestehenden Policies löschen (außer service_role)
DO $$ 
BEGIN
    -- Lösche alle nicht-service_role Policies
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS "' || policyname || '" ON ' || schemaname || '.' || tablename || ';', E'\n')
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND policyname NOT LIKE '%service role%'
    );
END $$;

-- ===============================================
-- Helper Functions
-- ===============================================

-- Funktion zum Prüfen ob User ein Admin ist
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = user_id::text AND "isActive" = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion zum Prüfen ob User ein Clipper ist
CREATE OR REPLACE FUNCTION public.is_clipper(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.clipper 
    WHERE id = user_id::text AND "isActive" = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- ADMINS Table Policies
-- ===============================================

-- Admins können sich selbst und andere Admins sehen
CREATE POLICY "Admins can view admins" ON public.admins
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

-- Super Admins können Admins verwalten
CREATE POLICY "Super admins can insert admins" ON public.admins
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE id = auth.uid()::text 
      AND role = 'super_admin' 
      AND "isActive" = true
    )
  );

CREATE POLICY "Super admins can update admins" ON public.admins
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE id = auth.uid()::text 
      AND role = 'super_admin' 
      AND "isActive" = true
    )
  );

CREATE POLICY "Super admins can delete admins" ON public.admins
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE id = auth.uid()::text 
      AND role = 'super_admin' 
      AND "isActive" = true
    )
  );

-- ===============================================
-- CLIPPER Table Policies
-- ===============================================

-- Clipper können ihre eigenen Daten sehen
CREATE POLICY "Clippers can view own record" ON public.clipper
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      id = auth.uid()::text OR 
      is_admin(auth.uid())
    )
  );

-- Admins können alle Clipper verwalten
CREATE POLICY "Admins can insert clippers" ON public.clipper
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can update clippers" ON public.clipper
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete clippers" ON public.clipper
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

-- ===============================================
-- VIDEOS Table Policies
-- ===============================================

-- Clipper können ihre eigenen Videos sehen
CREATE POLICY "Clippers can view own videos" ON public.videos
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      "clipperId" = auth.uid()::text OR 
      is_admin(auth.uid())
    )
  );

-- Clipper können Videos einreichen
CREATE POLICY "Clippers can submit videos" ON public.videos
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    "clipperId" = auth.uid()::text AND
    is_clipper(auth.uid())
  );

-- Nur Admins können Videos updaten
CREATE POLICY "Admins can update videos" ON public.videos
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

-- Nur Admins können Videos löschen
CREATE POLICY "Admins can delete videos" ON public.videos
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

-- ===============================================
-- STRIKES Table Policies
-- ===============================================

-- Clipper können ihre eigenen Strikes sehen
CREATE POLICY "Clippers can view own strikes" ON public.strikes
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      "clipperId" = auth.uid()::text OR 
      is_admin(auth.uid())
    )
  );

-- Nur Admins können Strikes verwalten
CREATE POLICY "Admins can insert strikes" ON public.strikes
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can update strikes" ON public.strikes
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete strikes" ON public.strikes
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

-- ===============================================
-- MANUAL_REVIEW_QUEUE Table Policies
-- ===============================================

-- Nur Admins können die Review Queue sehen und verwalten
CREATE POLICY "Admins can view review queue" ON public.manual_review_queue
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert review items" ON public.manual_review_queue
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can update review items" ON public.manual_review_queue
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete review items" ON public.manual_review_queue
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

-- ===============================================
-- ACTIVITIES Table Policies
-- ===============================================

-- Clipper können ihre eigenen Aktivitäten sehen
CREATE POLICY "Clippers can view own activities" ON public.activities
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      "clipperId" = auth.uid()::text OR 
      is_admin(auth.uid())
    )
  );

-- Jeder authentifizierte User kann Activities loggen
CREATE POLICY "Authenticated users can log activities" ON public.activities
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- ===============================================
-- SETTINGS Table Policies
-- ===============================================

-- Jeder kann Settings lesen (bereits in Original-Query)
-- Nur Admins können Settings verwalten
CREATE POLICY "Admins can update settings" ON public.settings
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert settings" ON public.settings
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete settings" ON public.settings
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

-- ===============================================
-- PAYMENT_RECORDS Table Policies
-- ===============================================

-- Clipper können ihre eigenen Payment Records sehen
CREATE POLICY "Clippers can view own payments" ON public.payment_records
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      "clipperId" = auth.uid()::text OR 
      is_admin(auth.uid())
    )
  );

-- Nur Admins können Payment Records verwalten
CREATE POLICY "Admins can insert payments" ON public.payment_records
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can update payments" ON public.payment_records
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete payments" ON public.payment_records
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND is_admin(auth.uid())
  );

-- ===============================================
-- Special Case: Allow system to create certain records
-- ===============================================

-- Erlaube dem System (via service role) Videos in die Review Queue zu setzen
CREATE POLICY "System can add videos to review queue" ON public.manual_review_queue
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR 
    (auth.uid() IS NOT NULL AND is_admin(auth.uid()))
  );
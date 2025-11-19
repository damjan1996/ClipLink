-- ===============================================
-- Authentication Setup für ClipLink
-- ===============================================
-- Dieses Script richtet die Authentifizierung für Clipper und Admins ein

-- ===============================================
-- Auth Schema Setup
-- ===============================================

-- Erstelle Trigger für automatisches User-Mapping
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
BEGIN
  -- Prüfe ob der User ein Admin ist
  IF EXISTS (SELECT 1 FROM public.admins WHERE email = NEW.email) THEN
    -- Update Admin ID to match auth.users ID
    UPDATE public.admins 
    SET id = NEW.id::text 
    WHERE email = NEW.email;
    
    user_role := 'admin';
    SELECT username INTO user_name FROM public.admins WHERE id = NEW.id::text;
    
  -- Prüfe ob der User ein Clipper ist
  ELSIF EXISTS (SELECT 1 FROM public.clipper WHERE email = NEW.email) THEN
    -- Update Clipper ID to match auth.users ID
    UPDATE public.clipper 
    SET id = NEW.id::text 
    WHERE email = NEW.email;
    
    user_role := 'clipper';
    SELECT name INTO user_name FROM public.clipper WHERE id = NEW.id::text;
  ELSE
    -- Wenn User nicht existiert, erstelle einen neuen Clipper
    INSERT INTO public.clipper (id, email, name) 
    VALUES (NEW.id::text, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'New Clipper'));
    
    user_role := 'clipper';
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', 'New Clipper');
  END IF;
  
  -- Update user metadata
  UPDATE auth.users 
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', user_role, 'name', user_name)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für neue User
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================
-- Login Functions
-- ===============================================

-- Admin Login Function
CREATE OR REPLACE FUNCTION public.admin_login(username_input TEXT, password_input TEXT)
RETURNS TABLE(
  success BOOLEAN,
  user_id TEXT,
  email TEXT,
  message TEXT
) AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Finde Admin
  SELECT * INTO admin_record 
  FROM public.admins 
  WHERE username = username_input 
  AND password = password_input
  AND "isActive" = true;
  
  IF admin_record IS NULL THEN
    RETURN QUERY SELECT 
      false AS success,
      NULL::TEXT AS user_id,
      NULL::TEXT AS email,
      'Invalid credentials or account inactive' AS message;
  ELSE
    -- Update last login
    UPDATE public.admins 
    SET "lastLogin" = NOW() 
    WHERE id = admin_record.id;
    
    RETURN QUERY SELECT 
      true AS success,
      admin_record.id AS user_id,
      admin_record.email AS email,
      'Login successful' AS message;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clipper Login Function
CREATE OR REPLACE FUNCTION public.clipper_login(email_input TEXT, password_input TEXT)
RETURNS TABLE(
  success BOOLEAN,
  user_id TEXT,
  email TEXT,
  message TEXT
) AS $$
DECLARE
  clipper_record RECORD;
BEGIN
  -- Finde Clipper
  SELECT * INTO clipper_record 
  FROM public.clipper 
  WHERE email = email_input 
  AND password = password_input
  AND "isActive" = true
  AND "paymentBlocked" = false;
  
  IF clipper_record IS NULL THEN
    -- Prüfe ob Account geblockt ist
    IF EXISTS (
      SELECT 1 FROM public.clipper 
      WHERE email = email_input 
      AND ("isActive" = false OR "paymentBlocked" = true)
    ) THEN
      RETURN QUERY SELECT 
        false AS success,
        NULL::TEXT AS user_id,
        NULL::TEXT AS email,
        'Account is blocked or inactive' AS message;
    ELSE
      RETURN QUERY SELECT 
        false AS success,
        NULL::TEXT AS user_id,
        NULL::TEXT AS email,
        'Invalid credentials' AS message;
    END IF;
  ELSE
    -- Update last activity
    UPDATE public.clipper 
    SET "lastActivity" = NOW() 
    WHERE id = clipper_record.id;
    
    RETURN QUERY SELECT 
      true AS success,
      clipper_record.id AS user_id,
      clipper_record.email AS email,
      'Login successful' AS message;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- JWT Claims für Custom Auth
-- ===============================================

-- Funktion zum Generieren von Custom Claims
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  claims := event->'claims';
  
  -- Hole die User Role aus den Metadaten
  SELECT raw_user_meta_data->>'role' INTO user_role
  FROM auth.users
  WHERE id = (event->>'user_id')::uuid;
  
  -- Füge custom claims hinzu
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  
  -- Füge Admin-spezifische Claims hinzu
  IF user_role = 'admin' THEN
    claims := jsonb_set(claims, '{is_admin}', 'true'::jsonb);
    
    -- Prüfe ob Super Admin
    IF EXISTS (
      SELECT 1 FROM public.admins 
      WHERE id = (event->>'user_id')::text 
      AND role = 'super_admin'
    ) THEN
      claims := jsonb_set(claims, '{is_super_admin}', 'true'::jsonb);
    END IF;
  END IF;
  
  -- Return modified claims
  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- Grant necessary permissions
-- ===============================================

-- Grant USAGE on auth schema to postgres (needed for triggers)
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres;

-- ===============================================
-- Test Data mit korrekten Auth-IDs
-- ===============================================

-- Erstelle Test-User in auth.users für den Test-Admin
-- WICHTIG: Dies muss über Supabase Auth API gemacht werden, nicht direkt in SQL
-- Verwende die Supabase Dashboard Auth Section oder die Auth API

-- Beispiel für Auth API Call (nicht direkt in SQL ausführbar):
/*
POST https://YOUR_PROJECT.supabase.co/auth/v1/signup
{
  "email": "admin@cliplink.com",
  "password": "admin123",
  "data": {
    "name": "Admin User",
    "role": "admin"
  }
}

POST https://YOUR_PROJECT.supabase.co/auth/v1/signup
{
  "email": "test@clipper.com", 
  "password": "test123",
  "data": {
    "name": "Test Clipper",
    "role": "clipper"
  }
}
*/
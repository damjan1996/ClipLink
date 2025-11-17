-- ===============================================
-- ClipLink Supabase Database Setup
-- ===============================================
-- Führe diese SQL-Anweisungen im Supabase SQL Editor aus
-- (Dashboard → SQL Editor → New query)

-- 1. Admins Tabelle
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastLogin" TIMESTAMP WITH TIME ZONE,
    "isActive" BOOLEAN DEFAULT true
);

-- 2. Clipper Tabelle
CREATE TABLE IF NOT EXISTS public.clipper (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    password TEXT,
    "registeredChannels" JSONB,
    strikes INTEGER DEFAULT 0,
    "paymentBlocked" BOOLEAN DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    "totalEarnings" DECIMAL(10,2) DEFAULT 0.0,
    "totalViews" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastActivity" TIMESTAMP WITH TIME ZONE
);

-- 3. Videos Tabelle (Haupttabelle für Link-System)
CREATE TABLE IF NOT EXISTS public.videos (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clipperId" TEXT NOT NULL REFERENCES public.clipper(id),
    "videoLink" TEXT NOT NULL,
    platform TEXT NOT NULL,
    title TEXT,
    description TEXT,
    "thumbnailUrl" TEXT,
    duration INTEGER,
    "uploadDate" TIMESTAMP WITH TIME ZONE,
    "submissionDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "viewCount" INTEGER DEFAULT 0,
    "lastViewCheck" TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    "bonusEligible" BOOLEAN DEFAULT false,
    "paidOut" BOOLEAN DEFAULT false,
    "bonusAmount" DECIMAL(10,2),
    notes TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    metadata JSONB
);

-- 4. Strikes Tabelle
CREATE TABLE IF NOT EXISTS public.strikes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clipperId" TEXT NOT NULL REFERENCES public.clipper(id),
    "videoId" TEXT NOT NULL REFERENCES public.videos(id),
    reason TEXT NOT NULL,
    type TEXT DEFAULT 'duplicate' CHECK (type IN ('duplicate', 'policy_violation', 'fake_content')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    "issuedDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- 5. Manual Review Queue Tabelle
CREATE TABLE IF NOT EXISTS public.manual_review_queue (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "videoId" TEXT NOT NULL REFERENCES public.videos(id),
    reason TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    "addedToQueue" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed BOOLEAN DEFAULT false,
    "reviewedBy" TEXT,
    "adminId" TEXT REFERENCES public.admins(id),
    "reviewDecision" TEXT CHECK ("reviewDecision" IN ('approve', 'reject')),
    "reviewedAt" TIMESTAMP WITH TIME ZONE,
    "reviewNotes" TEXT
);

-- 6. Activities Tabelle (Logging)
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clipperId" TEXT REFERENCES public.clipper(id),
    "videoId" TEXT REFERENCES public.videos(id),
    "adminId" TEXT REFERENCES public.admins(id),
    type TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Settings Tabelle
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'string',
    description TEXT,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Payment Records Tabelle
CREATE TABLE IF NOT EXISTS public.payment_records (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clipperId" TEXT NOT NULL REFERENCES public.clipper(id),
    "videoId" TEXT REFERENCES public.videos(id),
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('base_payment', 'bonus', 'penalty')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    description TEXT,
    metadata JSONB,
    "processedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- Indizes für Performance
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_videos_clipper ON public.videos("clipperId");
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_platform ON public.videos(platform);
CREATE INDEX IF NOT EXISTS idx_videos_submission_date ON public.videos("submissionDate");
CREATE INDEX IF NOT EXISTS idx_videos_view_count ON public.videos("viewCount");
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON public.activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_manual_review_reviewed ON public.manual_review_queue(reviewed);

-- ===============================================
-- Initiale Daten einfügen
-- ===============================================

-- Default Admin User
INSERT INTO public.admins (username, email, password, role) 
VALUES ('admin', 'admin@cliplink.com', 'admin123', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Test Clipper
INSERT INTO public.clipper (name, email, username, password) 
VALUES ('Test Clipper', 'test@clipper.com', 'testclipper', 'test123')
ON CONFLICT (email) DO NOTHING;

-- Standard Settings
INSERT INTO public.settings (key, value, type, description) VALUES
('bonus_per_10k_views', '10', 'number', 'Bonus amount in EUR for every 10k views'),
('min_views_for_bonus', '10000', 'number', 'Minimum views required for bonus eligibility'),
('max_strikes_allowed', '3', 'number', 'Maximum strikes before payment block')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    "updatedAt" = NOW();

-- ===============================================
-- Row Level Security (RLS) Policies
-- ===============================================

-- Aktiviere RLS für alle Tabellen
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clipper ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- Policies für Service Role (erlaubt alle Operationen für Backend)
CREATE POLICY "Service role can manage all admins" ON public.admins 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all clipper" ON public.clipper 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all videos" ON public.videos 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all strikes" ON public.strikes 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all manual_review_queue" ON public.manual_review_queue 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all activities" ON public.activities 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all settings" ON public.settings 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all payment_records" ON public.payment_records 
    FOR ALL USING (auth.role() = 'service_role');

-- Policies für Anonymous/Authenticated (nur Lesen für öffentliche Daten)
CREATE POLICY "Anyone can read settings" ON public.settings 
    FOR SELECT USING (true);

-- ===============================================
-- Funktionen für Bonus-Berechnung
-- ===============================================

-- Funktion zum automatischen Setzen von bonusEligible
CREATE OR REPLACE FUNCTION update_bonus_eligibility()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."viewCount" >= 10000 AND NEW.status = 'approved' THEN
        NEW."bonusEligible" = true;
        NEW."bonusAmount" = 10.0;
    ELSE
        NEW."bonusEligible" = false;
        NEW."bonusAmount" = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für automatische Bonus-Berechnung
CREATE TRIGGER trigger_update_bonus_eligibility
    BEFORE INSERT OR UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION update_bonus_eligibility();

-- ===============================================
-- Zusätzliche Hilfsfunktionen
-- ===============================================

-- Funktion zum Abrufen monatlicher Statistiken
CREATE OR REPLACE FUNCTION get_monthly_stats(target_year INT, target_month INT)
RETURNS TABLE (
    total_videos BIGINT,
    approved_videos BIGINT,
    total_views BIGINT,
    bonus_eligible_videos BIGINT,
    total_bonus_amount DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_videos,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_videos,
        COALESCE(SUM("viewCount"), 0) as total_views,
        COUNT(*) FILTER (WHERE "bonusEligible" = true) as bonus_eligible_videos,
        COALESCE(SUM("bonusAmount"), 0) as total_bonus_amount
    FROM public.videos 
    WHERE EXTRACT(YEAR FROM "submissionDate") = target_year 
    AND EXTRACT(MONTH FROM "submissionDate") = target_month;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- FERTIG! 
-- ===============================================
-- Führe dieses SQL-Skript im Supabase SQL Editor aus
-- Danach ist deine Datenbank bereit für ClipLink!
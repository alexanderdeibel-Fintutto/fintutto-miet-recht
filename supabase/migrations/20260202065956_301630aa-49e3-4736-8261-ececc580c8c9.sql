-- ═══════════════════════════════════════════════════════════════════
-- PHASE 1: ORGANISATIONEN & BENUTZER
-- ═══════════════════════════════════════════════════════════════════

-- 1.1 Organizations-Tabelle
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT, -- 'vermieter', 'hausverwaltung', 'makler'
  stripe_customer_id TEXT,
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Profiles-Tabelle erweitern
ALTER TABLE public.profiles 
ADD COLUMN organization_id UUID REFERENCES public.organizations(id),
ADD COLUMN avatar_url TEXT;

-- 1.3 Neue Rollen zum ENUM hinzufügen
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'vermieter';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'mieter';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'hausmeister';

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 2: IMMOBILIEN-TABELLEN
-- ═══════════════════════════════════════════════════════════════════

-- 2.1 Buildings (Gebäude)
CREATE TABLE public.buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'DE',
  total_units INTEGER DEFAULT 0,
  total_area DECIMAL(10,2),
  year_built INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Units (Einheiten)
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE NOT NULL,
  unit_number TEXT NOT NULL,
  floor INTEGER,
  area DECIMAL(10,2),
  rooms DECIMAL(3,1),
  type TEXT DEFAULT 'apartment', -- 'apartment', 'commercial', 'parking'
  status TEXT DEFAULT 'available', -- 'rented', 'available', 'maintenance'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 3: MIETVERTRÄGE
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE public.leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID NOT NULL, -- References profiles.user_id
  start_date DATE NOT NULL,
  end_date DATE,
  rent_amount DECIMAL(10,2) NOT NULL,
  utilities_advance DECIMAL(10,2) DEFAULT 0,
  deposit_amount DECIMAL(10,2),
  payment_day INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active', -- 'active', 'terminated', 'pending'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 4: ZÄHLER & ABLESUNGEN
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE public.meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
  meter_number TEXT NOT NULL,
  meter_type TEXT NOT NULL, -- 'electricity', 'gas', 'water_cold', 'water_hot', 'heating'
  installation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.meter_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID REFERENCES public.meters(id) ON DELETE CASCADE NOT NULL,
  reading_date DATE NOT NULL,
  reading_value DECIMAL(12,3) NOT NULL,
  submitted_by UUID NOT NULL, -- References profiles.user_id
  source TEXT DEFAULT 'manual', -- 'manual', 'ocr', 'api'
  confidence DECIMAL(3,2),
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 5: BETRIEBSKOSTEN
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE public.operating_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'calculated', 'sent'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.operating_cost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operating_cost_id UUID REFERENCES public.operating_costs(id) ON DELETE CASCADE NOT NULL,
  cost_type TEXT NOT NULL, -- BetrKV Kategorien
  amount DECIMAL(12,2) NOT NULL,
  allocation_key TEXT DEFAULT 'area', -- 'area', 'units', 'persons', 'consumption'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 6: AUFGABEN & NACHRICHTEN
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
  created_by UUID NOT NULL, -- References profiles.user_id
  assigned_to UUID, -- References profiles.user_id
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'repair', 'maintenance', 'inspection'
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL, -- References profiles.user_id
  recipient_id UUID NOT NULL, -- References profiles.user_id
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 7: DOCUMENTS-TABELLE ERWEITERN
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.documents 
ADD COLUMN organization_id UUID REFERENCES public.organizations(id),
ADD COLUMN file_url TEXT,
ADD COLUMN file_size INTEGER;

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 8: HELPER-FUNKTIONEN
-- ═══════════════════════════════════════════════════════════════════

-- Holt die Organization-ID des Benutzers
CREATE OR REPLACE FUNCTION public.user_organization_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = _user_id
$$;

-- Prüft ob Benutzer Zugriff auf Gebäude hat
CREATE OR REPLACE FUNCTION public.user_has_building_access(_user_id uuid, _building_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.buildings b
    JOIN public.profiles p ON p.organization_id = b.organization_id
    WHERE p.user_id = _user_id AND b.id = _building_id
  )
$$;

-- Prüft ob Benutzer Zugriff auf Unit hat (über Building)
CREATE OR REPLACE FUNCTION public.user_has_unit_access(_user_id uuid, _unit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.units u
    JOIN public.buildings b ON b.id = u.building_id
    JOIN public.profiles p ON p.organization_id = b.organization_id
    WHERE p.user_id = _user_id AND u.id = _unit_id
  )
$$;

-- Prüft ob Benutzer Mieter einer Unit ist
CREATE OR REPLACE FUNCTION public.user_is_tenant_of_unit(_user_id uuid, _unit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.leases l
    WHERE l.tenant_id = _user_id 
      AND l.unit_id = _unit_id
      AND l.status = 'active'
  )
$$;

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 9: ROW-LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════

-- Organizations RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization"
ON public.organizations FOR SELECT
TO authenticated
USING (id = public.user_organization_id(auth.uid()));

CREATE POLICY "Users can update their organization"
ON public.organizations FOR UPDATE
TO authenticated
USING (id = public.user_organization_id(auth.uid()));

-- Buildings RLS
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view buildings in their org"
ON public.buildings FOR SELECT
TO authenticated
USING (organization_id = public.user_organization_id(auth.uid()));

CREATE POLICY "Users can create buildings in their org"
ON public.buildings FOR INSERT
TO authenticated
WITH CHECK (organization_id = public.user_organization_id(auth.uid()));

CREATE POLICY "Users can update buildings in their org"
ON public.buildings FOR UPDATE
TO authenticated
USING (organization_id = public.user_organization_id(auth.uid()));

CREATE POLICY "Users can delete buildings in their org"
ON public.buildings FOR DELETE
TO authenticated
USING (organization_id = public.user_organization_id(auth.uid()));

-- Units RLS
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view units in their buildings"
ON public.units FOR SELECT
TO authenticated
USING (public.user_has_building_access(auth.uid(), building_id));

CREATE POLICY "Tenants can view their rented units"
ON public.units FOR SELECT
TO authenticated
USING (public.user_is_tenant_of_unit(auth.uid(), id));

CREATE POLICY "Users can create units in their buildings"
ON public.units FOR INSERT
TO authenticated
WITH CHECK (public.user_has_building_access(auth.uid(), building_id));

CREATE POLICY "Users can update units in their buildings"
ON public.units FOR UPDATE
TO authenticated
USING (public.user_has_building_access(auth.uid(), building_id));

CREATE POLICY "Users can delete units in their buildings"
ON public.units FOR DELETE
TO authenticated
USING (public.user_has_building_access(auth.uid(), building_id));

-- Leases RLS
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org users can view leases in their units"
ON public.leases FOR SELECT
TO authenticated
USING (public.user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Tenants can view their own leases"
ON public.leases FOR SELECT
TO authenticated
USING (tenant_id = auth.uid());

CREATE POLICY "Org users can create leases"
ON public.leases FOR INSERT
TO authenticated
WITH CHECK (public.user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Org users can update leases"
ON public.leases FOR UPDATE
TO authenticated
USING (public.user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Org users can delete leases"
ON public.leases FOR DELETE
TO authenticated
USING (public.user_has_unit_access(auth.uid(), unit_id));

-- Meters RLS
ALTER TABLE public.meters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org users can view meters"
ON public.meters FOR SELECT
TO authenticated
USING (public.user_has_unit_access(auth.uid(), unit_id));

CREATE POLICY "Tenants can view meters in their units"
ON public.meters FOR SELECT
TO authenticated
USING (public.user_is_tenant_of_unit(auth.uid(), unit_id));

CREATE POLICY "Org users can manage meters"
ON public.meters FOR ALL
TO authenticated
USING (public.user_has_unit_access(auth.uid(), unit_id));

-- Meter Readings RLS
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org users can view meter readings"
ON public.meter_readings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.meters m
    WHERE m.id = meter_id
    AND public.user_has_unit_access(auth.uid(), m.unit_id)
  )
);

CREATE POLICY "Users can view their submitted readings"
ON public.meter_readings FOR SELECT
TO authenticated
USING (submitted_by = auth.uid());

CREATE POLICY "Users can create readings"
ON public.meter_readings FOR INSERT
TO authenticated
WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Org users can update readings"
ON public.meter_readings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.meters m
    WHERE m.id = meter_id
    AND public.user_has_unit_access(auth.uid(), m.unit_id)
  )
);

-- Operating Costs RLS
ALTER TABLE public.operating_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org users can view operating costs"
ON public.operating_costs FOR SELECT
TO authenticated
USING (public.user_has_building_access(auth.uid(), building_id));

CREATE POLICY "Org users can manage operating costs"
ON public.operating_costs FOR ALL
TO authenticated
USING (public.user_has_building_access(auth.uid(), building_id));

-- Operating Cost Items RLS
ALTER TABLE public.operating_cost_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org users can view cost items"
ON public.operating_cost_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.operating_costs oc
    WHERE oc.id = operating_cost_id
    AND public.user_has_building_access(auth.uid(), oc.building_id)
  )
);

CREATE POLICY "Org users can manage cost items"
ON public.operating_cost_items FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.operating_costs oc
    WHERE oc.id = operating_cost_id
    AND public.user_has_building_access(auth.uid(), oc.building_id)
  )
);

-- Tasks RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org users can view tasks in their buildings"
ON public.tasks FOR SELECT
TO authenticated
USING (
  building_id IS NOT NULL AND public.user_has_building_access(auth.uid(), building_id)
);

CREATE POLICY "Users can view tasks assigned to them"
ON public.tasks FOR SELECT
TO authenticated
USING (assigned_to = auth.uid());

CREATE POLICY "Users can view tasks they created"
ON public.tasks FOR SELECT
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "Org users can create tasks"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid() AND
  (building_id IS NULL OR public.user_has_building_access(auth.uid(), building_id))
);

CREATE POLICY "Org users can update tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() OR
  assigned_to = auth.uid() OR
  (building_id IS NOT NULL AND public.user_has_building_access(auth.uid(), building_id))
);

CREATE POLICY "Org users can delete tasks"
ON public.tasks FOR DELETE
TO authenticated
USING (
  created_by = auth.uid() OR
  (building_id IS NOT NULL AND public.user_has_building_access(auth.uid(), building_id))
);

-- Messages RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages they sent"
ON public.messages FOR SELECT
TO authenticated
USING (sender_id = auth.uid());

CREATE POLICY "Users can view messages they received"
ON public.messages FOR SELECT
TO authenticated
USING (recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their sent messages"
ON public.messages FOR UPDATE
TO authenticated
USING (sender_id = auth.uid());

CREATE POLICY "Recipients can mark messages as read"
ON public.messages FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid());
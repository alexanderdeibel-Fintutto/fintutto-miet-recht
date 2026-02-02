

# Plan: Datenbank-Erweiterung zum Immobilienverwaltungssystem

## Ubersicht

Erweiterung der bestehenden Datenbank um ein vollstandiges Immobilienverwaltungssystem mit Organisationen, Gebauden, Einheiten, Mietvertragen, Zahlern und Betriebskosten.

---

## Phase 1: Kern-Tabellen (Organisationen und Benutzer)

### 1.1 Organizations-Tabelle

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT, -- 'vermieter', 'hausverwaltung', 'makler'
  stripe_customer_id TEXT,
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 Profiles-Tabelle erweitern (NICHT neue users-Tabelle)

Die bestehende `profiles` Tabelle wird um `organization_id` erweitert. Rollen bleiben in der sicheren `user_roles` Tabelle.

```sql
ALTER TABLE profiles 
ADD COLUMN organization_id UUID REFERENCES organizations(id),
ADD COLUMN avatar_url TEXT;
```

### 1.3 Neue Rollen zum ENUM hinzufugen

```sql
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'vermieter';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'mieter';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'hausmeister';
```

---

## Phase 2: Immobilien-Tabellen

### 2.1 Buildings (Gebaude)

```sql
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
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
```

### 2.2 Units (Einheiten)

```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE NOT NULL,
  unit_number TEXT NOT NULL,
  floor INTEGER,
  area DECIMAL(10,2),
  rooms DECIMAL(3,1),
  type TEXT DEFAULT 'apartment', -- 'apartment', 'commercial', 'parking'
  status TEXT DEFAULT 'available', -- 'rented', 'available', 'maintenance'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 3: Mietvertrage

### 3.1 Leases-Tabelle

```sql
CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
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
```

---

## Phase 4: Zahler und Ablesungen

### 4.1 Meters-Tabelle

```sql
CREATE TABLE meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
  meter_number TEXT NOT NULL,
  meter_type TEXT NOT NULL, -- 'electricity', 'gas', 'water_cold', 'water_hot', 'heating'
  installation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Meter-Readings-Tabelle

```sql
CREATE TABLE meter_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID REFERENCES meters(id) ON DELETE CASCADE NOT NULL,
  reading_date DATE NOT NULL,
  reading_value DECIMAL(12,3) NOT NULL,
  submitted_by UUID NOT NULL, -- References profiles.user_id
  source TEXT DEFAULT 'manual', -- 'manual', 'ocr', 'api'
  confidence DECIMAL(3,2),
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 5: Betriebskosten

### 5.1 Operating-Costs-Tabelle

```sql
CREATE TABLE operating_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'calculated', 'sent'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 Operating-Cost-Items-Tabelle

```sql
CREATE TABLE operating_cost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operating_cost_id UUID REFERENCES operating_costs(id) ON DELETE CASCADE NOT NULL,
  cost_type TEXT NOT NULL, -- BetrKV Kategorien
  amount DECIMAL(12,2) NOT NULL,
  allocation_key TEXT DEFAULT 'area', -- 'area', 'units', 'persons', 'consumption'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 6: Aufgaben und Nachrichten

### 6.1 Tasks-Tabelle

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
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
```

### 6.2 Messages-Tabelle

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL, -- References profiles.user_id
  recipient_id UUID NOT NULL, -- References profiles.user_id
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 7: Row-Level Security (RLS)

### Sicherheits-Hilfsfunktionen

```sql
-- Pruft ob Benutzer zur gleichen Organisation gehort
CREATE OR REPLACE FUNCTION public.user_organization_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = _user_id
$$;

-- Pruft ob Benutzer Zugriff auf Gebaude hat
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
```

### RLS-Policies fur alle Tabellen

- **organizations**: Nur Mitglieder sehen ihre Organisation
- **buildings**: Nur Organisations-Mitglieder sehen Gebaude
- **units**: Zugriff uber Gebaude-Zugehorigkeit
- **leases**: Vermieter sehen alle, Mieter nur eigene
- **meters/meter_readings**: Uber Unit-Zugehorigkeit
- **tasks**: Ersteller, Zugewiesene und Org-Admins
- **messages**: Nur Sender und Empfanger

---

## Phase 8: Bestehende documents-Tabelle erweitern

```sql
ALTER TABLE documents 
ADD COLUMN organization_id UUID REFERENCES organizations(id),
ADD COLUMN file_url TEXT,
ADD COLUMN file_size INTEGER;
```

---

## Technische Details

### Datenanderungen
- 10 neue Tabellen erstellen
- 2 bestehende Tabellen erweitern (profiles, documents)
- 1 Enum erweitern (app_role)
- 2 Helper-Funktionen erstellen
- ~15 RLS-Policies erstellen

### Code-Anderungen erforderlich
- `useAuth.tsx`: organization_id zum Profile-Interface hinzufugen
- `types.ts`: Wird automatisch aktualisiert
- Neue Seiten fur Immobilienverwaltung (optional, separater Task)

### Abhangigkeiten
- Keine Breaking Changes fur bestehende Funktionalitat
- Neue Spalten sind nullable wo notwendig


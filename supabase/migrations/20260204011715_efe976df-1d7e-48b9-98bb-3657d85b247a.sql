-- Products table for all Fintutto apps
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id text NOT NULL,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  stripe_price_id text,
  features jsonb DEFAULT '[]'::jsonb,
  icon_url text,
  app_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Cross-sell triggers table
CREATE TABLE public.ai_cross_sell_triggers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_app_id text NOT NULL,
  target_app_id text NOT NULL,
  trigger_type text NOT NULL DEFAULT 'app_start',
  trigger_context text,
  headline text NOT NULL,
  message text NOT NULL,
  cta_text text DEFAULT 'Jetzt entdecken',
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_cross_sell_triggers ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable (prices visible to all)
CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (is_active = true);

-- Cross-sell triggers readable by authenticated users
CREATE POLICY "Authenticated users can view active triggers"
ON public.ai_cross_sell_triggers FOR SELECT
TO authenticated
USING (is_active = true);

-- Insert sample products for Fintutto apps
INSERT INTO public.products (app_id, name, description, price_cents, features, app_url, sort_order) VALUES
('vermietify', 'Vermietify', 'Professionelle Immobilienverwaltung für Vermieter', 1990, '["Mieterverwaltung", "Nebenkostenabrechnung", "Dokumentenmanagement", "Zählerablesung"]', 'https://vermietify.de', 1),
('hausmeisterpro', 'HausmeisterPro', 'Digitale Hausmeister-App für effizientes Gebäudemanagement', 1490, '["Aufgabenverwaltung", "Wartungsplanung", "Protokollierung", "Team-Kommunikation"]', 'https://hausmeisterpro.de', 2),
('formulare', 'Mietrecht Formulare', 'Rechtssichere Mietrecht-Formulare und Vorlagen', 0, '["Mietverträge", "Kündigungen", "Übergabeprotokolle", "Rechner"]', 'https://ft-formular.lovable.app', 3);

-- Insert sample cross-sell triggers
INSERT INTO public.ai_cross_sell_triggers (source_app_id, target_app_id, trigger_type, headline, message, cta_text, priority) VALUES
('formulare', 'vermietify', 'app_start', 'Mehr als nur Formulare?', 'Mit Vermietify verwalten Sie Ihre Immobilien professionell – inklusive Mieterverwaltung, Nebenkostenabrechnung und automatischer Dokumentenerstellung.', 'Vermietify entdecken', 10),
('formulare', 'hausmeisterpro', 'app_start', 'Gebäude effizient verwalten', 'HausmeisterPro hilft Ihnen bei Wartung, Aufgabenplanung und Team-Koordination für Ihre Immobilien.', 'HausmeisterPro testen', 5);

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
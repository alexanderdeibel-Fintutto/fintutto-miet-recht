

# Vollstandiger Implementierungsplan: Formulare Shop

## Ubersicht

Dieses Projekt transformiert die bestehende Formulare-App in einen vollwertigen E-Commerce-Shop fur Mietrecht-Dokumente mit dynamischen Formular-Wizards, Einzelkauf-Optionen, Bundles und einem optimierten Onboarding-Flow.

---

## Phase 1: Datenbank-Schema

### 1.1 Neue Tabellen erstellen

```text
+---------------------------+
|      form_templates       |
+---------------------------+
| id (UUID, PK)             |
| slug (TEXT, UNIQUE)       |
| name (TEXT)               |
| description (TEXT)        |
| category (TEXT)           |
| persona (TEXT)            |  -- 'vermieter' | 'mieter' | 'beide'
| price_cents (INTEGER)     |
| stripe_price_id (TEXT)    |
| tier (TEXT)               |  -- 'free' | 'basic' | 'premium'
| fields (JSONB)            |  -- Wizard-Feld-Definitionen
| template_content (TEXT)   |  -- PDF-Template
| thumbnail_url (TEXT)      |
| sort_order (INTEGER)      |
| is_active (BOOLEAN)       |
| seo_title (TEXT)          |
| seo_description (TEXT)    |
| seo_keywords (TEXT[])     |
| created_at (TIMESTAMPTZ)  |
+---------------------------+

+---------------------------+
|         bundles           |
+---------------------------+
| id (UUID, PK)             |
| slug (TEXT, UNIQUE)       |
| name (TEXT)               |
| description (TEXT)        |
| price_cents (INTEGER)     |
| stripe_price_id (TEXT)    |
| thumbnail_url (TEXT)      |
| is_active (BOOLEAN)       |
| created_at (TIMESTAMPTZ)  |
+---------------------------+

+---------------------------+
|   bundle_form_templates   |
+---------------------------+
| bundle_id (UUID, FK)      |
| form_template_id (UUID,FK)|
+---------------------------+

+---------------------------+
|      form_purchases       |
+---------------------------+
| id (UUID, PK)             |
| user_id (UUID, FK)        |
| form_template_id (UUID)   |  -- NULL wenn Bundle
| bundle_id (UUID)          |  -- NULL wenn Einzelkauf
| stripe_payment_intent (T) |
| amount_cents (INTEGER)    |
| status (TEXT)             |
| purchased_at (TIMESTAMPTZ)|
+---------------------------+

+---------------------------+
|   generated_documents     |
+---------------------------+
| id (UUID, PK)             |
| user_id (UUID, FK)        |
| form_template_id (UUID,FK)|
| form_slug (TEXT)          |
| title (TEXT)              |
| input_data (JSONB)        |
| pdf_url (TEXT)            |
| status (TEXT)             |  -- 'draft' | 'generated'
| created_at (TIMESTAMPTZ)  |
| updated_at (TIMESTAMPTZ)  |
+---------------------------+

+---------------------------+
|    user_form_drafts       |
+---------------------------+
| id (UUID, PK)             |
| user_id (UUID, FK)        |
| form_template_id (UUID,FK)|
| draft_data (JSONB)        |
| current_step (INTEGER)    |
| updated_at (TIMESTAMPTZ)  |
+---------------------------+
```

### 1.2 Datenbank-View

```sql
CREATE VIEW v_user_available_forms AS
SELECT 
  u.id as user_id,
  ft.id as form_template_id,
  ft.slug,
  CASE
    WHEN ft.tier = 'free' THEN true
    WHEN fp.id IS NOT NULL THEN true
    WHEN us.plan_id IN ('basic', 'pro') THEN true
    ELSE false
  END as has_access
FROM auth.users u
CROSS JOIN form_templates ft
LEFT JOIN form_purchases fp ON fp.user_id = u.id 
  AND (fp.form_template_id = ft.id 
       OR fp.bundle_id IN (SELECT bundle_id FROM bundle_form_templates WHERE form_template_id = ft.id))
LEFT JOIN user_subscriptions us ON us.user_id = u.id AND us.app_id = 'formulare';
```

### 1.3 RLS Policies
- Users konnen eigene Purchases, Drafts und Generated Documents sehen
- form_templates und bundles sind offentlich lesbar
- Schreibzugriff auf form_purchases nur uber Service Role (Webhooks)

---

## Phase 2: Edge Functions

### 2.1 `create-form-checkout` (Einzelkauf)

```text
Input: { formTemplateId, successUrl, cancelUrl }

Flow:
1. User authentifizieren
2. Preis aus form_templates laden
3. Stripe Checkout Session erstellen (mode: "payment")
4. Metadata: { form_template_id, user_id }
5. URL zuruckgeben
```

### 2.2 `create-bundle-checkout` (Bundle-Kauf)

```text
Input: { bundleId, successUrl, cancelUrl }

Flow:
1. User authentifizieren
2. Bundle + Preis laden
3. Stripe Checkout Session erstellen (mode: "payment")
4. Metadata: { bundle_id, user_id }
5. URL zuruckgeben
```

### 2.3 `stripe-webhook` (erweitern)

```text
Neue Events:
- checkout.session.completed (mode: payment)
  -> form_purchases INSERT
  -> E-Mail-Bestatigung (optional)

Prufung:
- Wenn metadata.form_template_id: Einzelkauf
- Wenn metadata.bundle_id: Bundle-Kauf
```

### 2.4 `generate-pdf` (neues Feature)

```text
Input: { formTemplateId, inputData }

Flow:
1. Template laden
2. Daten in Template einfugen
3. PDF generieren (via Lovable AI oder externer Service)
4. In Storage hochladen
5. URL zuruckgeben
```

---

## Phase 3: Frontend - Seiten

### 3.1 Landing Page (/) - Redesign

```text
+--------------------------------------------------+
|  [Logo]                    [Anmelden] [Starten]  |
+--------------------------------------------------+
|                                                  |
|        Mietrecht-Formulare in Minuten            |
|                                                  |
|   [__________________] [Suchen]                  |
|                                                  |
|   [Vermieter] [Mieter] [Alle]                   |
|                                                  |
+--------------------------------------------------+
|        Beliebte Formulare                        |
|                                                  |
|   +------+  +------+  +------+                  |
|   |Card 1|  |Card 2|  |Card 3|                  |
|   +------+  +------+  +------+                  |
|   +------+  +------+  +------+                  |
|   |Card 4|  |Card 5|  |Card 6|                  |
|   +------+  +------+  +------+                  |
|                                                  |
|           [Alle Formulare ansehen]               |
+--------------------------------------------------+
|        Bundles - Mehr sparen                     |
|                                                  |
|   +------------+  +------------+                 |
|   |Vermieter   |  |Mieter      |                |
|   |Starter-Kit |  |Schutz-Paket|                |
|   |  ab 29 EUR |  |  ab 19 EUR |                |
|   +------------+  +------------+                 |
+--------------------------------------------------+
|        Testimonials (Slider)                     |
+--------------------------------------------------+
|        FAQ (Accordion)                           |
+--------------------------------------------------+
|        Footer                                    |
+--------------------------------------------------+
```

### 3.2 Kategorie-Seiten (/vermieter, /mieter)

```text
Route: /vermieter oder /mieter

+--------------------------------------------------+
|  Breadcrumb: Home > Vermieter                    |
+--------------------------------------------------+
|  Filter: [Alle] [Vertrage] [Schreiben] [Proto.] |
|  Sortierung: [Beliebt v] [Preis] [A-Z]          |
+--------------------------------------------------+
|                                                  |
|   +------+  +------+  +------+  +------+        |
|   |Form  |  |Form  |  |Form  |  |Form  |        |
|   |Card  |  |Card  |  |Card  |  |Card  |        |
|   |4,99  |  |GRATIS|  |9,99  |  |4,99  |        |
|   +------+  +------+  +------+  +------+        |
|                                                  |
|   [Pagination]                                   |
+--------------------------------------------------+
```

### 3.3 Formular-Seite (/formulare/[slug])

```text
Route: /formulare/:slug (dynamisch)

Desktop Layout:
+--------------------------------------------------+
|  [Back]  Mietvertrag erstellen                   |
+--------------------------------------------------+
|                           |                      |
|   FormWizard              |   FormPreview        |
|   +------------------+    |   +-------------+    |
|   | Schritt 1 von 5  |    |   | Live-       |    |
|   |                  |    |   | Vorschau    |    |
|   | [Feld 1]         |    |   |             |    |
|   | [Feld 2]         |    |   |             |    |
|   | [Feld 3]         |    |   |             |    |
|   |                  |    |   |             |    |
|   | [Zuruck] [Weiter]|    |   |             |    |
|   +------------------+    |   +-------------+    |
|                           |                      |
+--------------------------------------------------+

Mobile Layout:
+---------------------------+
|  [Back]  Mietvertrag      |
+---------------------------+
|   FormWizard              |
|   +------------------+    |
|   | Schritt 1 von 5  |    |
|   |                  |    |
|   | [Feld 1]         |    |
|   | [Feld 2]         |    |
|   +------------------+    |
+---------------------------+
|  Sticky Footer            |
|  4,99 EUR  [Erstellen]    |
+---------------------------+
```

### 3.4 Bundle-Seite (/bundles/[slug])

```text
Route: /bundles/:bundleSlug

+--------------------------------------------------+
|  Vermieter Starter-Kit                           |
|  Alles was Sie brauchen fur den Start            |
+--------------------------------------------------+
|                                                  |
|  Enthalten (5 Formulare):                        |
|  - Mietvertrag                                   |
|  - Ubergabeprotokoll                             |
|  - Kundigung Vermieter                           |
|  - Mahnung                                       |
|  - Nebenkostenabrechnung                         |
|                                                  |
+--------------------------------------------------+
|  Preisvergleich:                                 |
|  Einzeln: 34,95 EUR                              |
|  Bundle:  24,99 EUR  (Sie sparen 29%)            |
|                                                  |
|  [Bundle kaufen - 24,99 EUR]                     |
+--------------------------------------------------+
```

### 3.5 Meine Formulare (/meine-formulare)

```text
Route: /meine-formulare (Protected)

+--------------------------------------------------+
|  Meine Formulare                                 |
|  [Gekauft] [Entwurfe] [Erstellt]                |
+--------------------------------------------------+
|                                                  |
|  +------------------------------------------+   |
|  | Mietvertrag - Wohnung Musterstr. 1       |   |
|  | Erstellt: 15.01.2026                      |   |
|  | [Download] [Bearbeiten] [Loschen]         |   |
|  +------------------------------------------+   |
|  | Kundigung - Mieter Muller                 |   |
|  | Erstellt: 10.01.2026                      |   |
|  | [Download] [Bearbeiten] [Loschen]         |   |
|  +------------------------------------------+   |
|                                                  |
+--------------------------------------------------+
```

---

## Phase 4: Frontend - Komponenten

### 4.1 FormWizard

```typescript
interface FormWizardProps {
  templateId: string;
  initialData?: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
}

Features:
- Dynamische Schritte basierend auf form_templates.fields
- Zod-Validation pro Schritt
- LocalStorage-Persistence (Entwurf speichern)
- Progress-Indicator
- Paywall-Trigger bei letztem Schritt (wenn nicht berechtigt)
```

### 4.2 FormPreview

```typescript
interface FormPreviewProps {
  templateId: string;
  data: Record<string, any>;
}

Features:
- Live-Vorschau wahrend Eingabe
- PDF-ahnliches Styling
- Responsive (versteckt auf Mobile)
- Placeholder fur leere Felder
```

### 4.3 PriceModal

```typescript
interface PriceModalProps {
  templateId: string;
  onCheckout: () => void;
}

Features:
- Zeigt Einzelpreis
- Alternative: Passendes Bundle (falls gunstiger)
- Alternative: Flatrate-Abo (falls mehrere Formulare)
- Stripe Checkout Button
```

### 4.4 FormCard

```typescript
interface FormCardProps {
  template: FormTemplate;
  hasAccess: boolean;
}

Features:
- Thumbnail
- Name + Kurzbeschreibung
- Preis-Badge (GRATIS / 4,99 EUR / PREMIUM)
- Hover-Effekt mit mehr Details
- Click -> /formulare/[slug]
```

### 4.5 BundleCard

```typescript
interface BundleCardProps {
  bundle: Bundle;
  formCount: number;
  savings: number;
}

Features:
- Bundle-Name + Beschreibung
- "X Formulare enthalten" Badge
- Ersparnis-Anzeige (z.B. "Spare 29%")
- Click -> /bundles/[slug]
```

### 4.6 PersonaWizard (Onboarding)

```typescript
Features:
- Frage: "Sind Sie Vermieter oder Mieter?"
- Optional: Weitere Fragen (Anzahl Wohnungen, etc.)
- Speichert in profiles.persona
- Skippable
```

---

## Phase 5: Onboarding-Flow

### 5.1 Flow-Diagramm

```text
User startet Formular
        |
        v
   Eingaben in LocalStorage
        |
        v
   Bei Paywall-Trigger (Schritt X oder "Erstellen")
        |
        v
   +-------------------+
   | Modal: E-Mail     |
   | eingeben          |
   +-------------------+
        |
        v
   Magic Link senden (Supabase Auth)
        |
        v
   Nach Login
        |
        v
   +-------------------+
   | Persona-Wizard    |
   | (optional)        |
   +-------------------+
        |
        v
   Formular fortsetzen (Daten aus LocalStorage)
        |
        v
   Bei Checkout
        |
        v
   Stripe Payment
        |
        v
   +-------------------+
   | PDF generieren    |
   | Download anbieten |
   | Cross-Sell zeigen |
   +-------------------+
```

### 5.2 LocalStorage-Schema

```typescript
interface FormDraft {
  templateId: string;
  currentStep: number;
  data: Record<string, any>;
  lastUpdated: string;
}

// Key: `form_draft_${slug}`
```

---

## Phase 6: Routing-Anderungen

### 6.1 Neue Routes in App.tsx

```typescript
// Offentliche Seiten
<Route path="/" element={<Landing />} />
<Route path="/vermieter" element={<CategoryPage persona="vermieter" />} />
<Route path="/mieter" element={<CategoryPage persona="mieter" />} />
<Route path="/formulare/:slug" element={<FormularPage />} />
<Route path="/bundles/:bundleSlug" element={<BundlePage />} />

// Geschutzte Seiten
<Route path="/meine-formulare" element={<ProtectedRoute><MeineFormulare /></ProtectedRoute>} />
```

### 6.2 SEO-Optimierung

```typescript
// Neue Komponente: SEOHead
interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
}

// In jeder Formular-Seite:
<SEOHead 
  title={template.seo_title || `${template.name} erstellen | FinTuttO`}
  description={template.seo_description}
  keywords={template.seo_keywords}
  canonical={`https://formulare.fintutto.de/${template.slug}`}
/>
```

---

## Phase 7: Stripe-Integration erweitern

### 7.1 Einmalzahlung (One-Time Payment)

```typescript
// Edge Function: create-form-checkout
const session = await stripe.checkout.sessions.create({
  mode: "payment",  // Nicht "subscription"
  line_items: [{ price: template.stripe_price_id, quantity: 1 }],
  metadata: { form_template_id: templateId, user_id: userId },
  success_url: `/formulare/${slug}?success=true`,
  cancel_url: `/formulare/${slug}`,
});
```

### 7.2 Webhook-Handler erweitern

```typescript
// checkout.session.completed handler
if (session.mode === 'payment') {
  const { form_template_id, bundle_id, user_id } = session.metadata;
  
  await supabase.from('form_purchases').insert({
    user_id,
    form_template_id: form_template_id || null,
    bundle_id: bundle_id || null,
    stripe_payment_intent: session.payment_intent,
    amount_cents: session.amount_total,
    status: 'completed',
    purchased_at: new Date().toISOString(),
  });
}
```

---

## Phase 8: Seed-Daten

### 8.1 Form Templates (Beispiel)

```sql
INSERT INTO form_templates (slug, name, category, persona, price_cents, tier, fields) VALUES
('mietvertrag', 'Mietvertrag', 'vertraege', 'vermieter', 499, 'free', '[
  {"step": 1, "title": "Vermieter", "fields": [
    {"name": "vermieter_name", "type": "text", "label": "Name", "required": true},
    {"name": "vermieter_adresse", "type": "textarea", "label": "Adresse", "required": true}
  ]},
  {"step": 2, "title": "Mieter", "fields": [
    {"name": "mieter_name", "type": "text", "label": "Name", "required": true},
    {"name": "mieter_adresse", "type": "textarea", "label": "Adresse", "required": true}
  ]},
  {"step": 3, "title": "Objekt", "fields": [
    {"name": "objekt_adresse", "type": "textarea", "label": "Adresse des Mietobjekts", "required": true},
    {"name": "objekt_groesse", "type": "number", "label": "Wohnflache (qm)", "required": true}
  ]}
]');
```

### 8.2 Bundles (Beispiel)

```sql
INSERT INTO bundles (slug, name, description, price_cents) VALUES
('vermieter-starter', 'Vermieter Starter-Kit', '5 wichtige Formulare fur Vermieter', 2499),
('mieter-schutz', 'Mieter Schutz-Paket', '4 Formulare zum Schutz Ihrer Rechte', 1999);
```

---

## Dateistruktur nach Implementierung

```text
src/
├── components/
│   ├── forms/
│   │   ├── FormWizard.tsx
│   │   ├── FormPreview.tsx
│   │   ├── FormCard.tsx
│   │   ├── BundleCard.tsx
│   │   └── PriceModal.tsx
│   ├── landing/
│   │   ├── HeroSearch.tsx
│   │   ├── PersonaTabs.tsx
│   │   ├── PopularForms.tsx
│   │   ├── BundleSection.tsx
│   │   ├── Testimonials.tsx
│   │   └── FAQ.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── SEOHead.tsx
│   └── onboarding/
│       └── PersonaWizard.tsx
├── pages/
│   ├── Landing.tsx (neu)
│   ├── CategoryPage.tsx (neu)
│   ├── FormularPage.tsx (neu)
│   ├── BundlePage.tsx (neu)
│   └── MeineFormulare.tsx (neu)
├── hooks/
│   ├── useFormTemplates.ts (neu)
│   ├── useFormAccess.ts (neu)
│   ├── useFormDraft.ts (neu)
│   └── useBundles.ts (neu)
└── lib/
    └── form-utils.ts (neu)

supabase/
└── functions/
    ├── create-form-checkout/ (neu)
    ├── create-bundle-checkout/ (neu)
    ├── stripe-webhook/ (erweitern)
    └── generate-pdf/ (neu)
```

---

## Implementierungsreihenfolge

| Phase | Aufgabe | Abhangigkeiten |
|-------|---------|----------------|
| 1 | Datenbank-Schema + Seed-Daten | Keine |
| 2 | Edge Functions (Checkout, Webhook) | Phase 1 |
| 3 | Hooks (useFormTemplates, useFormAccess) | Phase 1 |
| 4 | FormCard + BundleCard Komponenten | Phase 3 |
| 5 | Landing Page Redesign | Phase 4 |
| 6 | Kategorie-Seiten | Phase 4 |
| 7 | FormWizard + FormPreview | Phase 3 |
| 8 | Formular-Seite (/formulare/[slug]) | Phase 7 |
| 9 | Bundle-Seite | Phase 4 |
| 10 | Meine Formulare Seite | Phase 3 |
| 11 | Onboarding/Persona-Wizard | Phase 8 |
| 12 | PDF-Generierung | Phase 8 |
| 13 | SEO-Optimierung | Phase 8 |

---

## Geschatzter Aufwand

- **Phase 1-2 (Backend)**: 2-3 Iterationen
- **Phase 3-4 (Basis-Komponenten)**: 2 Iterationen
- **Phase 5-6 (Landing + Kategorien)**: 2 Iterationen
- **Phase 7-8 (FormWizard + Seiten)**: 3-4 Iterationen
- **Phase 9-13 (Rest)**: 3-4 Iterationen

**Gesamt**: ca. 12-16 Iterationen



# Vollständige Implementierung: Formular-Shop-System

## Zusammenfassung

Transformation der bestehenden Formulare-App zu einem vollwertigen Shop-System mit:
- Neue Landing Page mit Hero-Suche, Persona-Tabs und Formular-Grid
- Dynamische Formular-Seiten mit mehrstufigem Wizard
- Bundle-System mit Preisvergleich
- "Meine Formulare" Bereich mit Gekauft/Entwürfe/Erstellt Tabs
- Stripe-Integration für Einmalzahlungen

---

## Phase 1: Neue Seitenstruktur und Routing

### 1.1 App.tsx Routing erweitern

Neue Routes hinzufügen:

```text
/                         -> Neue Shop Landing Page
/vermieter                -> Kategorie-Seite Vermieter
/mieter                   -> Kategorie-Seite Mieter
/formulare/[slug]         -> Dynamische Formular-Detail-Seite
/bundles/[slug]           -> Bundle-Detail-Seite
/meine-formulare          -> Benutzer-Dokumente (Gekauft/Entwürfe/Erstellt)
```

### 1.2 Neue Seiten erstellen

| Datei | Beschreibung |
|-------|--------------|
| `src/pages/shop/ShopLanding.tsx` | Hero, Suche, Tabs, Grid |
| `src/pages/shop/CategoryPage.tsx` | Filter, Sortierung, Grid |
| `src/pages/shop/FormDetailPage.tsx` | Wizard + Preview |
| `src/pages/shop/BundleDetailPage.tsx` | Bundle-Infos + CTA |
| `src/pages/shop/MyForms.tsx` | Tabs: Gekauft/Entwürfe/Erstellt |

---

## Phase 2: Komponenten-Bibliothek

### 2.1 FormCard Komponente
```text
src/components/shop/FormCard.tsx
- Thumbnail, Name, Preis-Badge
- Tier-Tag (FREE/BASIC/PREMIUM)
- Kategorie-Anzeige
- Hover-Effekt mit Kurzbeschreibung
```

### 2.2 BundleCard Komponente
```text
src/components/shop/BundleCard.tsx
- Bundle-Thumbnail
- "X Formulare enthalten" Badge
- Ersparnis-Anzeige (vs. Einzelkauf)
- CTA-Button
```

### 2.3 FormWizard Komponente
```text
src/components/shop/FormWizard.tsx
- Props: templateId, initialData, onComplete
- Dynamische Schritte aus form_templates.fields
- Zod-Validierung pro Schritt
- LocalStorage-Persistence
- Fortschrittsanzeige
- Paywall-Trigger bei finalem Schritt
```

### 2.4 FormPreview Komponente
```text
src/components/shop/FormPreview.tsx
- Live-Vorschau des Dokuments
- PDF-ähnliches Styling
- Responsive (versteckt auf Mobile)
```

### 2.5 PriceModal Komponente
```text
src/components/shop/PriceModal.tsx
- Preis + Alternativen (Bundle, Abo)
- Stripe Checkout Integration
- Login-Aufforderung falls nicht angemeldet
```

### 2.6 ShopHeader Komponente
```text
src/components/shop/ShopHeader.tsx
- Logo "FinTuttO Formulare"
- Suche
- Navigation (Kategorien, Bundles)
- Login/Profil-Button
```

---

## Phase 3: Daten-Hooks

### 3.1 useFormTemplates Hook
```text
src/hooks/useFormTemplates.ts
- Alle aktiven Templates laden
- Filter nach Persona, Kategorie, Tier
- Sortierung (beliebt, preis, a-z)
```

### 3.2 useBundles Hook
```text
src/hooks/useBundles.ts
- Aktive Bundles laden
- Enthaltene Formulare (JOIN mit bundle_form_templates)
- Ersparnis berechnen
```

### 3.3 useFormAccess Hook
```text
src/hooks/useFormAccess.ts
- Nutzt v_user_available_forms View
- Prüft Zugriff auf bestimmtes Formular
- Berücksichtigt: Tier, Einzelkauf, Bundle, Abo
```

### 3.4 useFormDraft Hook
```text
src/hooks/useFormDraft.ts
- LocalStorage + Supabase Sync
- Speichert Wizard-Fortschritt
- Lädt bestehende Entwürfe
```

---

## Phase 4: Edge Functions

### 4.1 create-form-checkout
```text
supabase/functions/create-form-checkout/index.ts
- mode: "payment" (Einmalzahlung)
- Metadata: form_template_id, user_id
- Success-URL mit Formular-Slug
```

### 4.2 create-bundle-checkout
```text
supabase/functions/create-bundle-checkout/index.ts
- mode: "payment" (Einmalzahlung)
- Metadata: bundle_id, user_id
- Success-URL zu /meine-formulare
```

### 4.3 stripe-webhook (erweitern)
```text
supabase/functions/stripe-webhook/index.ts
- checkout.session.completed Handler
- Unterscheidung: Subscription vs. Payment
- Bei Payment: Eintrag in form_purchases erstellen
```

---

## Phase 5: Seiten-Implementierung

### 5.1 ShopLanding (/)

**Layout:**
```text
+------------------------------------------+
|  ShopHeader                              |
+------------------------------------------+
|  Hero: "60+ Formulare für Vermieter..."  |
|  [Suchfeld]                              |
+------------------------------------------+
|  Tabs: [Vermieter] [Mieter] [Alle]       |
+------------------------------------------+
|  Beliebte Formulare (6er Grid)           |
|  [FormCard] [FormCard] [FormCard]        |
|  [FormCard] [FormCard] [FormCard]        |
+------------------------------------------+
|  Bundles Section                         |
|  [BundleCard] [BundleCard] [BundleCard]  |
+------------------------------------------+
|  Testimonials (optional)                 |
+------------------------------------------+
|  FAQ Accordion                           |
+------------------------------------------+
```

### 5.2 CategoryPage (/vermieter, /mieter)

**Features:**
- Filter-Leiste: Kategorie (Verträge, Schreiben, Protokolle, etc.)
- Sortierung: Beliebt | Preis | A-Z
- Grid mit FormCards
- Pagination oder Infinite Scroll

### 5.3 FormDetailPage (/formulare/[slug])

**Desktop Layout:**
```text
+----------------------+-------------------+
| FormWizard           | FormPreview       |
| [Schritt 1 von 4]    | (Live-Dokument)   |
| [Eingabefelder]      |                   |
| [Weiter]             |                   |
+----------------------+-------------------+
```

**Mobile Layout:**
```text
+----------------------+
| FormWizard           |
| [Schritt 1 von 4]    |
| [Eingabefelder]      |
+----------------------+
| Sticky Footer:       |
| €9,99 [Kaufen]       |
+----------------------+
```

### 5.4 BundleDetailPage (/bundles/[slug])

**Inhalt:**
- Bundle-Name und Beschreibung
- Preis + Ersparnis-Badge
- Liste enthaltener Formulare (mit Links)
- Preisvergleich-Tabelle (Einzeln vs. Bundle)
- CTA: "Bundle kaufen"

### 5.5 MyForms (/meine-formulare)

**Tabs:**
1. **Gekauft**: Gekaufte Formulare + Bundles aus form_purchases
2. **Entwürfe**: Unfertige Formulare aus user_form_drafts
3. **Erstellt**: Fertige PDFs aus generated_documents

**Aktionen pro Eintrag:**
- Öffnen/Bearbeiten
- PDF herunterladen
- Löschen

---

## Phase 6: Datenbank-Erweiterungen

### 6.1 Stripe Price IDs hinzufügen

```sql
-- Form Templates mit Stripe Price IDs versehen
UPDATE form_templates SET stripe_price_id = 'price_xxx' 
WHERE slug = 'mietvertrag-moebliert';
-- etc. für alle kostenpflichtigen Formulare

-- Bundles mit Stripe Price IDs versehen
UPDATE bundles SET stripe_price_id = 'price_xxx' 
WHERE slug = 'vermieter-starter';
```

### 6.2 Fehlende Formulare anlegen

Laut Slug-Liste fehlen noch viele Formulare. Diese müssen in form_templates eingefügt werden:

```sql
INSERT INTO form_templates (slug, name, category, persona, tier, price_cents, fields) VALUES
('wohnungsgeberbestaetigung', 'Wohnungsgeberbestätigung', 'sonstige', 'vermieter', 'free', 0, '[]'),
('mietbescheinigung', 'Mietbescheinigung', 'sonstige', 'vermieter', 'free', 0, '[]'),
-- ... weitere 50+ Formulare
```

---

## Phase 7: Styling und Branding

### 7.1 Farbanpassung

Primary Color auf Indigo #6366F1 setzen (bereits konfiguriert in index.css).

### 7.2 Neue CSS-Klassen

```css
.form-card-hover { ... }
.price-badge { ... }
.tier-free { ... }
.tier-basic { ... }
.tier-premium { ... }
```

---

## Technische Details

### Datei-Struktur nach Implementierung:

```text
src/
├── components/
│   ├── shop/
│   │   ├── FormCard.tsx
│   │   ├── BundleCard.tsx
│   │   ├── FormWizard.tsx
│   │   ├── FormPreview.tsx
│   │   ├── PriceModal.tsx
│   │   ├── ShopHeader.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── PersonaTabs.tsx
│   └── ... (bestehende)
├── hooks/
│   ├── useFormTemplates.ts
│   ├── useBundles.ts
│   ├── useFormAccess.ts
│   ├── useFormDraft.ts
│   └── ... (bestehende)
├── pages/
│   ├── shop/
│   │   ├── ShopLanding.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── FormDetailPage.tsx
│   │   ├── BundleDetailPage.tsx
│   │   └── MyForms.tsx
│   └── ... (bestehende)
└── lib/
    ├── formConstants.ts    (Slug-Liste, Kategorien)
    └── ... (bestehende)

supabase/functions/
├── create-form-checkout/
│   └── index.ts
├── create-bundle-checkout/
│   └── index.ts
├── stripe-webhook/
│   └── index.ts
└── ... (bestehende)
```

### Implementierungs-Reihenfolge:

1. **Hooks und Daten-Layer** (useFormTemplates, useBundles, useFormAccess)
2. **Basis-Komponenten** (FormCard, BundleCard, ShopHeader)
3. **ShopLanding** als neue Startseite
4. **CategoryPage** für /vermieter und /mieter
5. **FormWizard und FormPreview**
6. **FormDetailPage** mit Wizard-Integration
7. **Edge Functions** für Checkout
8. **BundleDetailPage**
9. **MyForms** mit Tabs
10. **Stripe-Webhook** erweitern
11. **Datenbank-Seed** (fehlende Formulare)

### Geschätzte Dateien:

| Kategorie | Anzahl |
|-----------|--------|
| Neue Seiten | 5 |
| Neue Komponenten | 10 |
| Neue Hooks | 4 |
| Edge Functions | 2-3 |
| Migrationen | 2-3 |
| **Gesamt** | ~25 Dateien |

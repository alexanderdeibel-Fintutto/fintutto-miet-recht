
# Fintutto Formulare - Implementierungsplan

## Übersicht
Eine vollständige deutsche Mietrecht-Formulare und Rechner App mit Benutzerauthentifizierung, professioneller PDF-Generierung und Freemium-Monetarisierung.

---

## 1. Design System & Grundstruktur

### Farbschema
- **Primary**: #4F46E5 (Indigo)
- **Secondary**: #7C3AED (Violett)
- **Success**: #10B981 (Grün)
- **Hero Gradient**: linear-gradient(135deg, #4F46E5 → #7C3AED)

### Typografie
- Schrift: Inter (Google Fonts)
- Monospace: JetBrains Mono

### Layout
- Responsive Design mit Tab-Navigation (Formulare, Rechner, Meine Dokumente)
- Konsistente Karten mit 12px Border-Radius und Schatten
- Deutsche Sprache mit formeller Anrede (Sie)

---

## 2. Authentifizierung & Benutzerverwaltung

- **Registrierung/Anmeldung** per E-Mail/Passwort
- **Benutzerprofil** mit Name und E-Mail
- **Geschützter Bereich** für "Meine Dokumente"
- **Rollenbasierte Zugänge** (Free/Premium-Benutzer)

---

## 3. Formulare-Seite

### Kategorien (Accordion-Struktur)

**Mietverträge**
- Standard-Mietvertrag
- Mietvertrag möblierte Wohnung
- WG-Mietvertrag
- Gewerbemietvertrag

**Kündigungen**
- Kündigung durch Mieter (ordentlich)
- Kündigung durch Vermieter (ordentlich)
- Sonderkündigung (außerordentlich)

**Abrechnungen**
- Nebenkostenabrechnung
- Heizkostenabrechnung

**Protokolle**
- Übergabeprotokoll (Ein-/Auszug)
- Mängelprotokoll

**Sonstiges**
- Mieterhöhungsverlangen
- Mietminderungsschreiben
- Kautionsvereinbarung
- Mahnschreiben

### Formular-Builder
- Interaktive Eingabefelder (Text, Datum, Checkbox, Dropdown)
- **Live-Vorschau** auf der rechten Seite
- Validierung der Pflichtfelder
- Auto-Speichern während der Bearbeitung

### Aktionen
- PDF-Download (professionell serverseitig generiert)
- Speichern in "Meine Dokumente"
- Als Entwurf speichern

---

## 4. Rechner-Seite

### Renditerechner
- **Eingaben**: Kaufpreis, Kaufnebenkosten, Jahreskaltmiete, Instandhaltungskosten
- **Ergebnisse**: Brutto-Rendite, Netto-Rendite, Eigenkapitalrendite

### Finanzierungsrechner
- **Eingaben**: Darlehenssumme, Zinssatz, Tilgungssatz, Laufzeit
- **Ergebnisse**: Monatliche Rate, Zinsanteil, Tilgungsanteil, Tilgungsplan

### Nebenkostenrechner
- **Eingaben**: Gesamtkosten je Position, Wohnungsfläche, Gesamtfläche
- **Ergebnisse**: Mieteranteil pro Position, Gesamtsumme Mieteranteil

### Kaufnebenkostenrechner
- **Eingaben**: Kaufpreis, Bundesland
- **Ergebnisse**: Grunderwerbsteuer (je nach Bundesland), Notarkosten, Grundbuchkosten, Maklerprovision, Gesamtnebenkosten

### Features
- Ergebnisse speichern
- PDF-Export der Berechnungen
- Verlauf der Berechnungen einsehbar

---

## 5. Meine Dokumente

### Dokumenten-Tabelle
- **Spalten**: Name, Typ (Formular/Berechnung), Erstellt am, Status
- **Sortierung und Filterung** nach Typ und Datum

### Aktionen pro Dokument
- Ansehen (Vorschau)
- Bearbeiten (zurück zum Formular)
- PDF herunterladen
- Löschen (mit Bestätigung)

### Premium-Feature
- Unbegrenzter Speicher für Premium-Benutzer
- Free-Benutzer: 5 Dokumente Limit

---

## 6. Freemium-Monetarisierung (Stripe)

### Kostenloser Plan
- Zugang zu Basis-Formularen (Standard-Mietvertrag, Kündigung Mieter, Übergabeprotokoll)
- Alle Rechner nutzbar
- Maximal 5 gespeicherte Dokumente

### Premium-Plan
- **Alle** Formulare freigeschaltet
- Unbegrenzter Dokumentenspeicher
- Prioritäts-Support
- Monatlich oder jährlich abrechenbar

### Stripe-Integration
- Sichere Zahlungsabwicklung
- Abonnement-Verwaltung im Profil
- Upgrade/Downgrade-Optionen

---

## 7. Backend (Supabase)

### Datenbank-Tabellen
- **profiles**: Benutzerdaten, Abonnement-Status
- **user_roles**: Rollenbasierte Berechtigungen
- **documents**: Gespeicherte Formulare (user_id, title, type, content_json, created_at)
- **calculations**: Gespeicherte Berechnungen (user_id, type, input_json, result_json, created_at)
- **subscriptions**: Stripe-Abonnement-Daten

### Edge Functions
- **generate-pdf**: Professionelle PDF-Generierung für Formulare
- **stripe-webhook**: Verarbeitung von Stripe-Events
- **create-checkout**: Stripe Checkout-Session erstellen

### Sicherheit
- Row-Level Security auf allen Tabellen
- Benutzer sehen nur eigene Dokumente
- Sichere API-Schlüssel-Verwaltung

---

## 8. Seiten-Übersicht

1. **Landing Page** - Produktvorstellung, Features, Pricing
2. **Login/Registrierung** - Authentifizierungsseiten
3. **Dashboard** - Hauptbereich mit Tab-Navigation
4. **Formular-Editor** - Dynamischer Formular-Builder mit Vorschau
5. **Rechner** - Vier spezialisierte Rechner
6. **Meine Dokumente** - Dokumentenverwaltung
7. **Profil/Einstellungen** - Kontoverwaltung, Abonnement
8. **Pricing** - Plan-Auswahl und Checkout

---

## Zusammenfassung

Diese App bietet deutschen Mietern und Vermietern eine vollständige Lösung für rechtskonforme Formulare und wichtige Berechnungen. Mit dem Freemium-Modell können Benutzer die Basis-Funktionen kostenlos testen, während Premium-Benutzer Zugang zu allen Formularen und unbegrenztem Speicher erhalten.

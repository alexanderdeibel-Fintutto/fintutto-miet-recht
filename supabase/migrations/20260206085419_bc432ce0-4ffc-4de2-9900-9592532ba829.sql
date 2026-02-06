-- Update form_templates with field definitions for FREE tier forms

-- 1. Wohnungsgeberbestätigung (Official confirmation of residence for authorities)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Vermieter / Wohnungsgeber",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters/Wohnungsgebers", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Mieter / Meldepflichtige Person",
    "fields": [
      {"name": "mieter_name", "label": "Vollständiger Name", "type": "text", "required": true},
      {"name": "mieter_geburtsdatum", "label": "Geburtsdatum", "type": "date", "required": true},
      {"name": "bisherige_anschrift", "label": "Bisherige Anschrift", "type": "address", "required": false}
    ]
  },
  {
    "step": 3,
    "title": "Wohnung",
    "fields": [
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true},
      {"name": "einzugsdatum", "label": "Einzugsdatum", "type": "date", "required": true},
      {"name": "auszugsdatum", "label": "Auszugsdatum (bei Auszug)", "type": "date", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Art der Meldung",
    "fields": [
      {"name": "meldeart", "label": "Art der Meldung", "type": "select", "options": ["Einzug (Anmeldung)", "Auszug (Abmeldung)"], "required": true},
      {"name": "zusaetzliche_personen", "label": "Weitere einziehende Personen", "type": "textarea", "required": false, "placeholder": "Name, Geburtsdatum (eine Person pro Zeile)"}
    ]
  }
]'::jsonb
WHERE slug = 'wohnungsgeberbestaetigung';

-- 2. Mietbescheinigung (Rent confirmation for various purposes)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Vermieter",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "mieter_geburtsdatum", "label": "Geburtsdatum", "type": "date", "required": false}
    ]
  },
  {
    "step": 3,
    "title": "Mietverhältnis",
    "fields": [
      {"name": "wohnung_adresse", "label": "Anschrift der Mietwohnung", "type": "address", "required": true},
      {"name": "mietbeginn", "label": "Mietbeginn", "type": "date", "required": true},
      {"name": "kaltmiete", "label": "Kaltmiete (EUR)", "type": "currency", "required": true},
      {"name": "nebenkosten", "label": "Nebenkosten-Vorauszahlung (EUR)", "type": "currency", "required": true},
      {"name": "gesamtmiete", "label": "Warmmiete gesamt (EUR)", "type": "currency", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Bestätigung",
    "fields": [
      {"name": "verwendungszweck", "label": "Verwendungszweck", "type": "select", "options": ["Wohngeldantrag", "Sozialleistungen", "Arbeitgeber", "Behörde", "Bank/Kredit", "Sonstiges"], "required": true},
      {"name": "zahlungsverhalten", "label": "Zahlungsverhalten", "type": "select", "options": ["Miete wird pünktlich gezahlt", "Miete wird regelmäßig gezahlt", "Es bestehen Mietrückstände"], "required": true},
      {"name": "mietrueckstand", "label": "Höhe Mietrückstand (EUR)", "type": "currency", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'mietbescheinigung';

-- 3. Mietschuldenfreiheitsbescheinigung (Rent-debt-free confirmation)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Vermieter",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Mietverhältnis",
    "fields": [
      {"name": "wohnung_adresse", "label": "Anschrift der Mietwohnung", "type": "address", "required": true},
      {"name": "mietbeginn", "label": "Mietbeginn", "type": "date", "required": true},
      {"name": "mietende", "label": "Mietende (falls beendet)", "type": "date", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Bestätigung",
    "fields": [
      {"name": "schuldenfreiheit", "label": "Bestätigung", "type": "select", "options": ["Es bestehen keine Mietrückstände", "Es bestehen offene Forderungen"], "required": true},
      {"name": "offene_forderung", "label": "Höhe offener Forderungen (EUR)", "type": "currency", "required": false},
      {"name": "stichtag", "label": "Stichtag der Bescheinigung", "type": "date", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'mietschuldenfreiheit';

-- 4. SEPA-Lastschriftmandat (SEPA direct debit mandate)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Zahlungsempfänger (Vermieter)",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true},
      {"name": "glaeubiger_id", "label": "Gläubiger-ID (falls vorhanden)", "type": "text", "required": false},
      {"name": "mandatsreferenz", "label": "Mandatsreferenz", "type": "text", "required": false, "placeholder": "Wird vom Vermieter vergeben"}
    ]
  },
  {
    "step": 2,
    "title": "Zahlungspflichtiger (Mieter)",
    "fields": [
      {"name": "mieter_name", "label": "Name des Kontoinhabers", "type": "text", "required": true},
      {"name": "mieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Bankverbindung",
    "fields": [
      {"name": "iban", "label": "IBAN", "type": "iban", "required": true},
      {"name": "bic", "label": "BIC (bei ausländischen Banken)", "type": "text", "required": false},
      {"name": "bank_name", "label": "Name der Bank", "type": "text", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Mandat",
    "fields": [
      {"name": "mandatsart", "label": "Art des Mandats", "type": "select", "options": ["Wiederkehrende Zahlung (Miete)", "Einmalige Zahlung"], "required": true},
      {"name": "betrag", "label": "Abbuchungsbetrag (EUR)", "type": "currency", "required": true},
      {"name": "verwendungszweck", "label": "Verwendungszweck", "type": "text", "required": true, "placeholder": "z.B. Miete Musterstraße 1"}
    ]
  }
]'::jsonb
WHERE slug = 'sepa-lastschrift';

-- 5. Schlüsselquittung (Key receipt)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Übergeber",
    "fields": [
      {"name": "uebergeber_name", "label": "Name des Übergebers", "type": "text", "required": true},
      {"name": "uebergeber_rolle", "label": "Rolle", "type": "select", "options": ["Vermieter", "Hausverwaltung", "Vormieter", "Sonstige"], "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Empfänger",
    "fields": [
      {"name": "empfaenger_name", "label": "Name des Empfängers", "type": "text", "required": true},
      {"name": "empfaenger_rolle", "label": "Rolle", "type": "select", "options": ["Mieter", "Vermieter", "Hausmeister", "Sonstige"], "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Objekt",
    "fields": [
      {"name": "objekt_adresse", "label": "Anschrift des Objekts", "type": "address", "required": true},
      {"name": "wohnungsnummer", "label": "Wohnungs-/Einheitsnummer", "type": "text", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Schlüssel",
    "fields": [
      {"name": "schluessel_liste", "label": "Übergebene Schlüssel", "type": "textarea", "required": true, "placeholder": "z.B.:\n2x Hauseingangsschlüssel\n2x Wohnungsschlüssel\n1x Briefkastenschlüssel\n1x Kellerschlüssel"},
      {"name": "uebergabedatum", "label": "Übergabedatum", "type": "date", "required": true},
      {"name": "uebergabeart", "label": "Art der Übergabe", "type": "select", "options": ["Übergabe bei Einzug", "Übergabe bei Auszug", "Zusätzliche Schlüssel", "Ersatzschlüssel"], "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'schluessel-quittung';

-- 6. Hausordnung (House rules)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Objekt",
    "fields": [
      {"name": "objekt_name", "label": "Objektbezeichnung", "type": "text", "required": true, "placeholder": "z.B. Wohnanlage Musterstraße 1-5"},
      {"name": "objekt_adresse", "label": "Anschrift", "type": "address", "required": true},
      {"name": "verwalter_name", "label": "Verwalter/Eigentümer", "type": "text", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Ruhezeiten",
    "fields": [
      {"name": "ruhezeit_mittag", "label": "Mittagsruhe", "type": "select", "options": ["12:00 - 14:00 Uhr", "13:00 - 15:00 Uhr", "Keine Mittagsruhe"], "required": true},
      {"name": "ruhezeit_nacht_von", "label": "Nachtruhe von", "type": "text", "required": true, "placeholder": "22:00"},
      {"name": "ruhezeit_nacht_bis", "label": "Nachtruhe bis", "type": "text", "required": true, "placeholder": "06:00"},
      {"name": "ruhezeit_sonntag", "label": "Sonn- und Feiertagsruhe", "type": "checkbox", "required": false}
    ]
  },
  {
    "step": 3,
    "title": "Gemeinschaftseinrichtungen",
    "fields": [
      {"name": "treppenhaus_reinigung", "label": "Treppenhausreinigung", "type": "select", "options": ["Wöchentlich wechselnd", "Durch Reinigungsdienst", "Durch Hausmeister"], "required": true},
      {"name": "waschkueche", "label": "Waschküchen-Regelung", "type": "textarea", "required": false, "placeholder": "Nutzungszeiten und Regeln"},
      {"name": "muellentsorgung", "label": "Müllentsorgung", "type": "textarea", "required": true, "placeholder": "Standort der Tonnen, Trennungsregeln"}
    ]
  },
  {
    "step": 4,
    "title": "Weitere Regelungen",
    "fields": [
      {"name": "tierhaltung", "label": "Tierhaltung", "type": "select", "options": ["Erlaubt", "Nur Kleintiere erlaubt", "Nur mit Genehmigung", "Nicht erlaubt"], "required": true},
      {"name": "grillverbot", "label": "Grillen auf Balkon/Terrasse", "type": "select", "options": ["Erlaubt", "Nur Elektrogrill erlaubt", "Nicht erlaubt"], "required": true},
      {"name": "zusaetzliche_regeln", "label": "Zusätzliche Regelungen", "type": "textarea", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'hausordnung';

-- 7. Vollmacht (Power of attorney for rental matters)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Vollmachtgeber",
    "fields": [
      {"name": "vollmachtgeber_name", "label": "Name des Vollmachtgebers", "type": "text", "required": true},
      {"name": "vollmachtgeber_adresse", "label": "Anschrift", "type": "address", "required": true},
      {"name": "vollmachtgeber_geburtsdatum", "label": "Geburtsdatum", "type": "date", "required": false}
    ]
  },
  {
    "step": 2,
    "title": "Bevollmächtigter",
    "fields": [
      {"name": "bevollmaechtigter_name", "label": "Name des Bevollmächtigten", "type": "text", "required": true},
      {"name": "bevollmaechtigter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Umfang der Vollmacht",
    "fields": [
      {"name": "vollmacht_art", "label": "Art der Vollmacht", "type": "select", "options": ["Generalvollmacht (alle Mietangelegenheiten)", "Einzelvollmacht (spezifische Handlung)"], "required": true},
      {"name": "vollmacht_bezug", "label": "Bezug zum Mietobjekt", "type": "address", "required": true},
      {"name": "vollmacht_umfang", "label": "Umfang/Befugnisse", "type": "textarea", "required": true, "placeholder": "z.B. Vertragsabschluss, Schlüsselübergabe, Kommunikation mit Vermieter"}
    ]
  },
  {
    "step": 4,
    "title": "Gültigkeit",
    "fields": [
      {"name": "gueltig_ab", "label": "Gültig ab", "type": "date", "required": true},
      {"name": "gueltig_bis", "label": "Gültig bis (leer = unbefristet)", "type": "date", "required": false},
      {"name": "widerruflich", "label": "Widerruflichkeit", "type": "select", "options": ["Jederzeit widerruflich", "Unwiderruflich"], "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'vollmacht';
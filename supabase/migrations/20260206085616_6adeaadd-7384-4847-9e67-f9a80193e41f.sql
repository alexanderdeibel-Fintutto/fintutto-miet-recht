-- Update form_templates with field definitions for BASIC tier forms

-- 1. Mietminderungsschreiben
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "mieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Vermieter",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Mangel",
    "fields": [
      {"name": "mangel_beschreibung", "label": "Beschreibung des Mangels", "type": "textarea", "required": true, "placeholder": "Beschreiben Sie den Mangel detailliert..."},
      {"name": "mangel_seit", "label": "Mangel besteht seit", "type": "date", "required": true},
      {"name": "mangel_gemeldet", "label": "Erstmeldung an Vermieter", "type": "date", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Mietminderung",
    "fields": [
      {"name": "minderungsquote", "label": "Minderungsquote (%)", "type": "number", "required": true},
      {"name": "aktuelle_miete", "label": "Aktuelle Warmmiete (EUR)", "type": "currency", "required": true},
      {"name": "minderung_ab", "label": "Minderung ab Datum", "type": "date", "required": true},
      {"name": "fristsetzung", "label": "Frist zur Mängelbeseitigung", "type": "date", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'mietminderung';

-- 2. Untermieterlaubnis
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Hauptmieter",
    "fields": [
      {"name": "hauptmieter_name", "label": "Name des Hauptmieters", "type": "text", "required": true},
      {"name": "hauptmieter_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Vermieter",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Untermieter",
    "fields": [
      {"name": "untermieter_name", "label": "Name des Untermieters", "type": "text", "required": true},
      {"name": "untermieter_geburtsdatum", "label": "Geburtsdatum", "type": "date", "required": false},
      {"name": "untermieter_beruf", "label": "Beruf/Tätigkeit", "type": "text", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Untermietverhältnis",
    "fields": [
      {"name": "untervermietung_grund", "label": "Grund der Untervermietung", "type": "select", "options": ["Berufliche Abwesenheit", "Finanzielle Gründe", "Studium/Ausbildung", "Familiäre Gründe", "Sonstiges"], "required": true},
      {"name": "untervermietung_beginn", "label": "Beginn der Untervermietung", "type": "date", "required": true},
      {"name": "untervermietung_ende", "label": "Ende (falls befristet)", "type": "date", "required": false},
      {"name": "untermiete_betrag", "label": "Monatliche Untermiete (EUR)", "type": "currency", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'untermieterlaubnis';

-- 3. Nachtragsvereinbarung
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Vertragsparteien",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Ursprünglicher Vertrag",
    "fields": [
      {"name": "wohnung_adresse", "label": "Anschrift des Mietobjekts", "type": "address", "required": true},
      {"name": "vertrag_datum", "label": "Datum des Ursprungsvertrags", "type": "date", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Änderungen",
    "fields": [
      {"name": "aenderung_art", "label": "Art der Änderung", "type": "select", "options": ["Mietanpassung", "Personenänderung", "Nutzungsänderung", "Vertragslaufzeit", "Sonstige Vereinbarung"], "required": true},
      {"name": "aenderung_beschreibung", "label": "Beschreibung der Änderung", "type": "textarea", "required": true, "placeholder": "Beschreiben Sie die Vertragsänderung detailliert..."},
      {"name": "gueltig_ab", "label": "Gültig ab", "type": "date", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'nachtragsvereinbarung';

-- 4. Ratenzahlungsvereinbarung
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Gläubiger (Vermieter)",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Schuldner (Mieter)",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "mieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Forderung",
    "fields": [
      {"name": "forderung_grund", "label": "Art der Forderung", "type": "select", "options": ["Mietrückstände", "Nebenkostennachzahlung", "Schadensersatz", "Kaution", "Sonstiges"], "required": true},
      {"name": "forderung_betrag", "label": "Gesamtforderung (EUR)", "type": "currency", "required": true},
      {"name": "forderung_zeitraum", "label": "Zeitraum der Forderung", "type": "text", "required": false, "placeholder": "z.B. Januar - März 2024"}
    ]
  },
  {
    "step": 4,
    "title": "Ratenzahlung",
    "fields": [
      {"name": "rate_betrag", "label": "Monatliche Rate (EUR)", "type": "currency", "required": true},
      {"name": "rate_anzahl", "label": "Anzahl der Raten", "type": "number", "required": true},
      {"name": "erste_rate_datum", "label": "Erste Rate fällig am", "type": "date", "required": true},
      {"name": "zahlungstag", "label": "Monatlicher Zahlungstag", "type": "select", "options": ["1.", "15.", "Letzter des Monats"], "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'ratenzahlung';

-- 5. Betretungsrecht-Ankündigung
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
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Grund und Termin",
    "fields": [
      {"name": "betretungsgrund", "label": "Grund des Betretens", "type": "select", "options": ["Reparatur/Instandhaltung", "Zählerablesung", "Besichtigung durch Kaufinteressent", "Besichtigung durch Nachmieter", "Schädlingsbekämpfung", "Rauchmelder-Prüfung", "Sonstiges"], "required": true},
      {"name": "grund_details", "label": "Nähere Beschreibung", "type": "textarea", "required": false},
      {"name": "termin_datum", "label": "Datum", "type": "date", "required": true},
      {"name": "termin_uhrzeit", "label": "Uhrzeit", "type": "text", "required": true, "placeholder": "z.B. 10:00 - 12:00 Uhr"}
    ]
  },
  {
    "step": 4,
    "title": "Durchführende Person",
    "fields": [
      {"name": "durchfuehrende_person", "label": "Name der Person/Firma", "type": "text", "required": true},
      {"name": "kontakt_telefon", "label": "Kontakttelefon", "type": "text", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'betretungsrecht';

-- 6. Eigentümerwechsel-Mitteilung
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Neuer Eigentümer",
    "fields": [
      {"name": "neuer_eigentuemer_name", "label": "Name des neuen Eigentümers", "type": "text", "required": true},
      {"name": "neuer_eigentuemer_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "wohnung_adresse", "label": "Anschrift der Mietwohnung", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Eigentümerwechsel",
    "fields": [
      {"name": "alter_eigentuemer_name", "label": "Name des bisherigen Eigentümers", "type": "text", "required": true},
      {"name": "wechsel_datum", "label": "Datum des Eigentümerwechsels", "type": "date", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Neue Bankverbindung",
    "fields": [
      {"name": "neue_iban", "label": "Neue IBAN für Mietzahlungen", "type": "iban", "required": true},
      {"name": "neue_bank", "label": "Name der Bank", "type": "text", "required": false},
      {"name": "erste_zahlung_datum", "label": "Erste Zahlung an neue Bankverbindung", "type": "date", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'eigentuemerwechsel';

-- 7. Besichtigungstermin
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Vermieter/Makler",
    "fields": [
      {"name": "anbieter_name", "label": "Name", "type": "text", "required": true},
      {"name": "anbieter_firma", "label": "Firma (optional)", "type": "text", "required": false},
      {"name": "anbieter_telefon", "label": "Telefon", "type": "text", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Interessent",
    "fields": [
      {"name": "interessent_name", "label": "Name des Interessenten", "type": "text", "required": true},
      {"name": "interessent_email", "label": "E-Mail", "type": "text", "required": false},
      {"name": "interessent_telefon", "label": "Telefon", "type": "text", "required": false}
    ]
  },
  {
    "step": 3,
    "title": "Objekt",
    "fields": [
      {"name": "objekt_adresse", "label": "Anschrift des Objekts", "type": "address", "required": true},
      {"name": "objekt_beschreibung", "label": "Objektbeschreibung", "type": "text", "required": false, "placeholder": "z.B. 3-Zimmer-Wohnung, 2. OG"}
    ]
  },
  {
    "step": 4,
    "title": "Termin",
    "fields": [
      {"name": "termin_datum", "label": "Datum", "type": "date", "required": true},
      {"name": "termin_uhrzeit", "label": "Uhrzeit", "type": "text", "required": true, "placeholder": "z.B. 14:00 Uhr"},
      {"name": "treffpunkt", "label": "Treffpunkt", "type": "text", "required": false, "placeholder": "z.B. Vor dem Hauseingang"}
    ]
  }
]'::jsonb
WHERE slug = 'besichtigungstermin';

-- 8. Widerspruch Mieterhöhung
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "mieter_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Vermieter",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Mieterhöhung",
    "fields": [
      {"name": "erhoehung_datum", "label": "Datum des Erhöhungsverlangens", "type": "date", "required": true},
      {"name": "aktuelle_miete", "label": "Aktuelle Kaltmiete (EUR)", "type": "currency", "required": true},
      {"name": "geforderte_miete", "label": "Geforderte neue Kaltmiete (EUR)", "type": "currency", "required": true},
      {"name": "erhoehung_ab", "label": "Erhöhung verlangt ab", "type": "date", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Widerspruchsgründe",
    "fields": [
      {"name": "widerspruch_grund", "label": "Grund des Widerspruchs", "type": "select", "options": ["Überschreitung der Kappungsgrenze", "Ortsübliche Vergleichsmiete nicht erreicht", "Formelle Fehler im Erhöhungsverlangen", "Sperrfrist nicht eingehalten", "Härtefall", "Sonstige Gründe"], "required": true},
      {"name": "widerspruch_begruendung", "label": "Ausführliche Begründung", "type": "textarea", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'widerspruch-mieterhoehung';
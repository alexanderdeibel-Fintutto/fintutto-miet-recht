-- Update form_templates with field definitions for PREMIUM tier forms

-- 1. Staffelmietvertrag
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
      {"name": "mieter_adresse", "label": "Aktuelle Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Mietobjekt",
    "fields": [
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true},
      {"name": "wohnflaeche", "label": "Wohnfläche (m²)", "type": "number", "required": true},
      {"name": "zimmer", "label": "Anzahl Zimmer", "type": "number", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Staffelmiete",
    "fields": [
      {"name": "miete_anfang", "label": "Anfangsmiete kalt (EUR)", "type": "currency", "required": true},
      {"name": "nebenkosten", "label": "Nebenkosten-Vorauszahlung (EUR)", "type": "currency", "required": true},
      {"name": "staffel_1_datum", "label": "1. Staffel ab", "type": "date", "required": true},
      {"name": "staffel_1_betrag", "label": "1. Staffel Kaltmiete (EUR)", "type": "currency", "required": true},
      {"name": "staffel_2_datum", "label": "2. Staffel ab", "type": "date", "required": false},
      {"name": "staffel_2_betrag", "label": "2. Staffel Kaltmiete (EUR)", "type": "currency", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'staffelmietvertrag';

-- 2. Indexmietvertrag
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
      {"name": "mieter_adresse", "label": "Aktuelle Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Mietobjekt",
    "fields": [
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true},
      {"name": "wohnflaeche", "label": "Wohnfläche (m²)", "type": "number", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Indexklausel",
    "fields": [
      {"name": "anfangsmiete", "label": "Anfangsmiete kalt (EUR)", "type": "currency", "required": true},
      {"name": "nebenkosten", "label": "Nebenkosten-Vorauszahlung (EUR)", "type": "currency", "required": true},
      {"name": "basisindex", "label": "Basisindex (Verbraucherpreisindex)", "type": "number", "required": true, "placeholder": "z.B. 117.4"},
      {"name": "anpassung_intervall", "label": "Anpassungsintervall", "type": "select", "options": ["Jährlich", "Halbjährlich", "Nach Indexänderung > 3%"], "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'indexmietvertrag';

-- 3. Stellplatz-/Garagenmietvertrag
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
      {"name": "mieter_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Stellplatz/Garage",
    "fields": [
      {"name": "objekt_art", "label": "Art des Objekts", "type": "select", "options": ["Stellplatz (Freifläche)", "Tiefgaragenstellplatz", "Einzelgarage", "Doppelgarage", "Carport"], "required": true},
      {"name": "objekt_adresse", "label": "Standort/Adresse", "type": "address", "required": true},
      {"name": "stellplatz_nummer", "label": "Stellplatz-/Garagennummer", "type": "text", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Mietkonditionen",
    "fields": [
      {"name": "miete_betrag", "label": "Monatliche Miete (EUR)", "type": "currency", "required": true},
      {"name": "mietbeginn", "label": "Mietbeginn", "type": "date", "required": true},
      {"name": "kuendigungsfrist", "label": "Kündigungsfrist", "type": "select", "options": ["1 Monat", "2 Monate", "3 Monate"], "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'stellplatz-garage';

-- 4. Mietaufhebungsvertrag
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
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true},
      {"name": "mietvertrag_datum", "label": "Datum des Mietvertrags", "type": "date", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Aufhebung",
    "fields": [
      {"name": "aufhebung_datum", "label": "Aufhebung zum Datum", "type": "date", "required": true},
      {"name": "auszugstermin", "label": "Auszugstermin", "type": "date", "required": true},
      {"name": "abfindung", "label": "Abfindung/Umzugshilfe (EUR)", "type": "currency", "required": false},
      {"name": "kaution_regelung", "label": "Kautionsregelung", "type": "select", "options": ["Rückzahlung nach Abrechnung", "Sofortige Rückzahlung", "Verrechnung mit offenen Forderungen"], "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'mietaufhebung';

-- 5. Kautionsabrechnung
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Vermieter",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "vermieter_adresse", "label": "Anschrift", "type": "address", "required": true},
      {"name": "vermieter_iban", "label": "IBAN für Rückzahlung", "type": "iban", "required": false}
    ]
  },
  {
    "step": 2,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "mieter_neue_adresse", "label": "Neue Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Kaution",
    "fields": [
      {"name": "wohnung_adresse", "label": "Anschrift der ehemaligen Wohnung", "type": "address", "required": true},
      {"name": "kaution_betrag", "label": "Eingezahlte Kaution (EUR)", "type": "currency", "required": true},
      {"name": "kaution_zinsen", "label": "Aufgelaufene Zinsen (EUR)", "type": "currency", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Abrechnung",
    "fields": [
      {"name": "abzug_schaeden", "label": "Abzug für Schäden (EUR)", "type": "currency", "required": false},
      {"name": "abzug_nebenkosten", "label": "Abzug für NK-Nachzahlung (EUR)", "type": "currency", "required": false},
      {"name": "abzug_miete", "label": "Abzug für Mietrückstände (EUR)", "type": "currency", "required": false},
      {"name": "auszahlungsbetrag", "label": "Auszahlungsbetrag (EUR)", "type": "currency", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'kautionsabrechnung';

-- 6. Abmahnung
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
    "title": "Verstoß",
    "fields": [
      {"name": "verstoss_art", "label": "Art des Verstoßes", "type": "select", "options": ["Zahlungsverzug", "Ruhestörung", "Unerlaubte Tierhaltung", "Unerlaubte Untervermietung", "Beschädigung der Mietsache", "Verletzung der Hausordnung", "Sonstiger Verstoß"], "required": true},
      {"name": "verstoss_beschreibung", "label": "Beschreibung des Verstoßes", "type": "textarea", "required": true},
      {"name": "verstoss_datum", "label": "Datum des Verstoßes", "type": "date", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Aufforderung",
    "fields": [
      {"name": "abmahnung_nummer", "label": "Abmahnung Nummer", "type": "select", "options": ["1. Abmahnung", "2. Abmahnung", "Letzte Abmahnung vor Kündigung"], "required": true},
      {"name": "frist_datum", "label": "Frist zur Behebung/Unterlassung", "type": "date", "required": true},
      {"name": "kuendigung_androhung", "label": "Kündigung androhen", "type": "checkbox", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'abmahnung';

-- 7. Mieterselbstauskunft
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Persönliche Daten",
    "fields": [
      {"name": "name", "label": "Vollständiger Name", "type": "text", "required": true},
      {"name": "geburtsdatum", "label": "Geburtsdatum", "type": "date", "required": true},
      {"name": "aktuelle_adresse", "label": "Aktuelle Anschrift", "type": "address", "required": true},
      {"name": "telefon", "label": "Telefonnummer", "type": "text", "required": true},
      {"name": "email", "label": "E-Mail-Adresse", "type": "text", "required": false}
    ]
  },
  {
    "step": 2,
    "title": "Berufliche Situation",
    "fields": [
      {"name": "beruf", "label": "Beruf/Tätigkeit", "type": "text", "required": true},
      {"name": "arbeitgeber", "label": "Arbeitgeber", "type": "text", "required": false},
      {"name": "beschaeftigt_seit", "label": "Beschäftigt seit", "type": "date", "required": false},
      {"name": "nettoeinkommen", "label": "Monatliches Nettoeinkommen (EUR)", "type": "currency", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Aktuelle Wohnsituation",
    "fields": [
      {"name": "aktueller_vermieter", "label": "Name des aktuellen Vermieters", "type": "text", "required": false},
      {"name": "wohndauer", "label": "Wohndauer in aktueller Wohnung", "type": "text", "required": false, "placeholder": "z.B. 3 Jahre"},
      {"name": "kuendigungsgrund", "label": "Grund für den Umzug", "type": "textarea", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Weitere Angaben",
    "fields": [
      {"name": "personen_anzahl", "label": "Anzahl einziehender Personen", "type": "number", "required": true},
      {"name": "haustiere", "label": "Haustiere", "type": "select", "options": ["Keine", "Hund", "Katze", "Kleintiere", "Mehrere"], "required": true},
      {"name": "insolvenz", "label": "Insolvenzverfahren beantragt/eröffnet?", "type": "select", "options": ["Nein", "Ja"], "required": true},
      {"name": "raeumungsklage", "label": "Räumungsklage gegen Sie anhängig?", "type": "select", "options": ["Nein", "Ja"], "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'mieterselbstauskunft';

-- 8. Modernisierungsankündigung
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
    "title": "Modernisierungsmaßnahmen",
    "fields": [
      {"name": "massnahmen_beschreibung", "label": "Beschreibung der Maßnahmen", "type": "textarea", "required": true},
      {"name": "massnahmen_beginn", "label": "Voraussichtlicher Beginn", "type": "date", "required": true},
      {"name": "massnahmen_dauer", "label": "Voraussichtliche Dauer", "type": "text", "required": true, "placeholder": "z.B. 6 Wochen"}
    ]
  },
  {
    "step": 4,
    "title": "Mieterhöhung",
    "fields": [
      {"name": "modernisierungskosten", "label": "Anteilige Modernisierungskosten (EUR)", "type": "currency", "required": true},
      {"name": "mieterhoehung_betrag", "label": "Mieterhöhung pro Monat (EUR)", "type": "currency", "required": true},
      {"name": "neue_miete_ab", "label": "Neue Miete ab", "type": "date", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'modernisierung';

-- 9. Mietbürgschaftserklärung
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Bürge",
    "fields": [
      {"name": "buerge_name", "label": "Name des Bürgen", "type": "text", "required": true},
      {"name": "buerge_adresse", "label": "Anschrift", "type": "address", "required": true},
      {"name": "buerge_geburtsdatum", "label": "Geburtsdatum", "type": "date", "required": false}
    ]
  },
  {
    "step": 2,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "verhaeltnis_mieter", "label": "Verhältnis zum Mieter", "type": "select", "options": ["Elternteil", "Ehepartner/Lebenspartner", "Verwandter", "Arbeitgeber", "Sonstiges"], "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Mietverhältnis",
    "fields": [
      {"name": "vermieter_name", "label": "Name des Vermieters", "type": "text", "required": true},
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Bürgschaft",
    "fields": [
      {"name": "buergschaft_art", "label": "Art der Bürgschaft", "type": "select", "options": ["Selbstschuldnerische Bürgschaft", "Ausfallbürgschaft"], "required": true},
      {"name": "buergschaft_betrag", "label": "Maximale Bürgschaftssumme (EUR)", "type": "currency", "required": true},
      {"name": "buergschaft_dauer", "label": "Gültigkeit", "type": "select", "options": ["Unbefristet", "Befristet auf 1 Jahr", "Befristet auf 2 Jahre", "Bis zum Ende des Mietverhältnisses"], "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'mietbuergschaft';
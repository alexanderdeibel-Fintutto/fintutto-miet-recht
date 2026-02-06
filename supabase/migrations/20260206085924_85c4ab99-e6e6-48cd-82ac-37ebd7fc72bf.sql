-- Update remaining form_templates with field definitions

-- 1. Mieterhoehung-Standard (Basic)
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
    "title": "Aktuelle Miete",
    "fields": [
      {"name": "aktuelle_kaltmiete", "label": "Aktuelle Kaltmiete (EUR)", "type": "currency", "required": true},
      {"name": "letzte_erhoehung", "label": "Datum der letzten Erhöhung", "type": "date", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Mieterhöhung",
    "fields": [
      {"name": "neue_kaltmiete", "label": "Neue Kaltmiete (EUR)", "type": "currency", "required": true},
      {"name": "erhoehung_grund", "label": "Begründung", "type": "select", "options": ["Anpassung an ortsübliche Vergleichsmiete", "Modernisierung", "Indexanpassung"], "required": true},
      {"name": "wirksam_ab", "label": "Wirksam ab", "type": "date", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'mieterhoehung-standard';

-- 2. Maengelanzeige (Basic - hat dedizierte Route aber braucht auch fields für GenericForm fallback)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true}
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
      {"name": "mangel_ort", "label": "Ort des Mangels", "type": "select", "options": ["Wohnzimmer", "Schlafzimmer", "Küche", "Bad/WC", "Flur", "Balkon/Terrasse", "Keller", "Heizung", "Elektrik", "Außenbereich", "Sonstiges"], "required": true},
      {"name": "mangel_beschreibung", "label": "Beschreibung des Mangels", "type": "textarea", "required": true},
      {"name": "mangel_seit", "label": "Mangel besteht seit", "type": "date", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Fristsetzung",
    "fields": [
      {"name": "frist_datum", "label": "Frist zur Behebung", "type": "date", "required": true},
      {"name": "mietminderung_angekuendigt", "label": "Mietminderung angekündigt", "type": "checkbox", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'maengelanzeige';

-- 3. Anlage V (Premium)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Steuerpflichtiger",
    "fields": [
      {"name": "steuerpflichtiger_name", "label": "Name", "type": "text", "required": true},
      {"name": "steuernummer", "label": "Steuernummer", "type": "text", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Mietobjekt",
    "fields": [
      {"name": "objekt_adresse", "label": "Anschrift des Mietobjekts", "type": "address", "required": true},
      {"name": "eigentumsanteil", "label": "Eigentumsanteil (%)", "type": "number", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Einnahmen",
    "fields": [
      {"name": "mieteinnahmen", "label": "Mieteinnahmen (EUR/Jahr)", "type": "currency", "required": true},
      {"name": "nebenkosten_einnahmen", "label": "Nebenkosten-Vorauszahlungen (EUR/Jahr)", "type": "currency", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Werbungskosten",
    "fields": [
      {"name": "abschreibung", "label": "AfA (Abschreibung, EUR)", "type": "currency", "required": true},
      {"name": "zinsen", "label": "Schuldzinsen (EUR)", "type": "currency", "required": false},
      {"name": "erhaltungsaufwand", "label": "Erhaltungsaufwand (EUR)", "type": "currency", "required": false},
      {"name": "verwaltungskosten", "label": "Verwaltungskosten (EUR)", "type": "currency", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'anlage-v';

-- 4. Besichtigungsprotokoll (Premium)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Objekt",
    "fields": [
      {"name": "objekt_adresse", "label": "Anschrift", "type": "address", "required": true},
      {"name": "objekt_typ", "label": "Objekttyp", "type": "select", "options": ["Wohnung", "Einfamilienhaus", "Doppelhaushälfte", "Reihenhaus", "Mehrfamilienhaus"], "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Teilnehmer",
    "fields": [
      {"name": "vermieter_name", "label": "Vermieter/Makler", "type": "text", "required": true},
      {"name": "interessent_name", "label": "Interessent", "type": "text", "required": true},
      {"name": "besichtigung_datum", "label": "Datum der Besichtigung", "type": "date", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Objektdaten",
    "fields": [
      {"name": "wohnflaeche", "label": "Wohnfläche (m²)", "type": "number", "required": true},
      {"name": "zimmer", "label": "Anzahl Zimmer", "type": "number", "required": true},
      {"name": "baujahr", "label": "Baujahr", "type": "number", "required": false},
      {"name": "heizungsart", "label": "Heizungsart", "type": "select", "options": ["Zentralheizung Gas", "Zentralheizung Öl", "Fernwärme", "Wärmepumpe", "Etagenheizung", "Nachtspeicher"], "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Zustand",
    "fields": [
      {"name": "allgemeinzustand", "label": "Allgemeinzustand", "type": "select", "options": ["Sehr gut", "Gut", "Befriedigend", "Renovierungsbedürftig"], "required": true},
      {"name": "bemerkungen", "label": "Besondere Bemerkungen", "type": "textarea", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'wohnungsbesichtigung';

-- 5. SCHUFA-Anforderung (Premium)
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
    "title": "Mietinteressent",
    "fields": [
      {"name": "interessent_name", "label": "Name des Interessenten", "type": "text", "required": true},
      {"name": "interessent_adresse", "label": "Aktuelle Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Wohnung",
    "fields": [
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true},
      {"name": "kaltmiete", "label": "Geplante Kaltmiete (EUR)", "type": "currency", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Anforderung",
    "fields": [
      {"name": "auskunft_art", "label": "Art der Auskunft", "type": "select", "options": ["SCHUFA-BonitätsAuskunft", "SCHUFA-Selbstauskunft", "Beides"], "required": true},
      {"name": "frist", "label": "Einreichungsfrist", "type": "date", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'schufa-anforderung';

-- 6. Bank-Exposé (Premium)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Eigentümer",
    "fields": [
      {"name": "eigentuemer_name", "label": "Name des Eigentümers", "type": "text", "required": true},
      {"name": "eigentuemer_adresse", "label": "Anschrift", "type": "address", "required": true}
    ]
  },
  {
    "step": 2,
    "title": "Objekt",
    "fields": [
      {"name": "objekt_adresse", "label": "Anschrift des Objekts", "type": "address", "required": true},
      {"name": "objekt_typ", "label": "Objekttyp", "type": "select", "options": ["Eigentumswohnung", "Mehrfamilienhaus", "Einfamilienhaus", "Gewerbeimmobilie"], "required": true},
      {"name": "baujahr", "label": "Baujahr", "type": "number", "required": true},
      {"name": "wohnflaeche", "label": "Wohnfläche (m²)", "type": "number", "required": true}
    ]
  },
  {
    "step": 3,
    "title": "Mieteinnahmen",
    "fields": [
      {"name": "mieteinnahmen_monat", "label": "Monatliche Mieteinnahmen (EUR)", "type": "currency", "required": true},
      {"name": "leerstand", "label": "Aktueller Leerstand", "type": "select", "options": ["Kein Leerstand", "Teilweise vermietet", "Vollständig leerstehend"], "required": true},
      {"name": "mietvertrag_laufzeit", "label": "Mietvertragslaufzeiten", "type": "textarea", "required": false}
    ]
  },
  {
    "step": 4,
    "title": "Finanzierung",
    "fields": [
      {"name": "kaufpreis", "label": "Kaufpreis/Verkehrswert (EUR)", "type": "currency", "required": true},
      {"name": "darlehensbetrag", "label": "Gewünschter Darlehensbetrag (EUR)", "type": "currency", "required": true},
      {"name": "eigenkapital", "label": "Eigenkapital (EUR)", "type": "currency", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'bank-expose';

-- 7. Indexanpassung (Premium)
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
    "title": "Index",
    "fields": [
      {"name": "basisindex", "label": "Basisindex (bei Vertragsbeginn)", "type": "number", "required": true},
      {"name": "aktueller_index", "label": "Aktueller Verbraucherpreisindex", "type": "number", "required": true},
      {"name": "index_monat", "label": "Index-Monat", "type": "text", "required": true, "placeholder": "z.B. Januar 2024"}
    ]
  },
  {
    "step": 4,
    "title": "Mietanpassung",
    "fields": [
      {"name": "aktuelle_miete", "label": "Aktuelle Kaltmiete (EUR)", "type": "currency", "required": true},
      {"name": "neue_miete", "label": "Neue Kaltmiete (EUR)", "type": "currency", "required": true},
      {"name": "wirksam_ab", "label": "Anpassung wirksam ab", "type": "date", "required": true}
    ]
  }
]'::jsonb
WHERE slug = 'index-anpassung';

-- 8. Widerspruch Nebenkostenabrechnung (Premium)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true}
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
    "title": "Nebenkostenabrechnung",
    "fields": [
      {"name": "abrechnungszeitraum", "label": "Abrechnungszeitraum", "type": "text", "required": true, "placeholder": "z.B. 01.01.2023 - 31.12.2023"},
      {"name": "nachzahlung_betrag", "label": "Geforderte Nachzahlung (EUR)", "type": "currency", "required": true},
      {"name": "abrechnung_datum", "label": "Datum der Abrechnung", "type": "date", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Widerspruchsgründe",
    "fields": [
      {"name": "widerspruch_grund", "label": "Grund des Widerspruchs", "type": "select", "options": ["Formelle Fehler", "Fehlerhafte Umlageschlüssel", "Nicht umlagefähige Kosten enthalten", "Rechenfehler", "Verspätete Zustellung", "Fehlende Belege"], "required": true},
      {"name": "widerspruch_details", "label": "Detaillierte Begründung", "type": "textarea", "required": true},
      {"name": "belegeinsicht", "label": "Belegeinsicht anfordern", "type": "checkbox", "required": false}
    ]
  }
]'::jsonb
WHERE slug = 'widerspruch-nk';

-- 9. Sonderkündigung (Premium)
UPDATE form_templates SET fields = '[
  {
    "step": 1,
    "title": "Mieter",
    "fields": [
      {"name": "mieter_name", "label": "Name des Mieters", "type": "text", "required": true},
      {"name": "wohnung_adresse", "label": "Anschrift der Wohnung", "type": "address", "required": true}
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
    "title": "Kündigungsgrund",
    "fields": [
      {"name": "kuendigung_grund", "label": "Grund der Sonderkündigung", "type": "select", "options": ["Modernisierungsmaßnahmen", "Tod des Mieters (Erbe)", "Mieterhöhung nach Modernisierung", "Gesundheitliche Gründe", "Berufliche Versetzung", "Sonstiger wichtiger Grund"], "required": true},
      {"name": "grund_details", "label": "Nähere Erläuterung", "type": "textarea", "required": true}
    ]
  },
  {
    "step": 4,
    "title": "Kündigung",
    "fields": [
      {"name": "kuendigung_zum", "label": "Kündigung zum", "type": "date", "required": true},
      {"name": "nachweise", "label": "Beigefügte Nachweise", "type": "textarea", "required": false, "placeholder": "z.B. Ärztliches Attest, Arbeitsvertrag"}
    ]
  }
]'::jsonb
WHERE slug = 'sonderkuendigung';
import { jsPDF } from 'jspdf'
import { MietvertragData } from '@/types/mietvertrag'
import { formatCurrency, formatDate } from '@/lib/utils'

// PDF-Konfiguration
const PDF_CONFIG = {
  margin: 20,
  lineHeight: 6,
  fontSize: {
    title: 16,
    subtitle: 12,
    heading: 11,
    normal: 10,
    small: 9,
  },
  colors: {
    primary: '#1e40af',
    black: '#000000',
    gray: '#6b7280',
    lightGray: '#e5e7eb',
  }
}

interface PDFContext {
  doc: jsPDF
  y: number
  pageHeight: number
  margin: number
}

// Hilfsfunktionen
function checkPageBreak(ctx: PDFContext, requiredSpace: number): void {
  if (ctx.y + requiredSpace > ctx.pageHeight - ctx.margin) {
    ctx.doc.addPage()
    ctx.y = ctx.margin
  }
}

function addTitle(ctx: PDFContext, text: string): void {
  checkPageBreak(ctx, 20)
  ctx.doc.setFontSize(PDF_CONFIG.fontSize.title)
  ctx.doc.setFont('helvetica', 'bold')
  ctx.doc.setTextColor(PDF_CONFIG.colors.primary)
  ctx.doc.text(text, ctx.margin, ctx.y)
  ctx.y += 10
}

function addSubtitle(ctx: PDFContext, text: string): void {
  checkPageBreak(ctx, 15)
  ctx.doc.setFontSize(PDF_CONFIG.fontSize.subtitle)
  ctx.doc.setFont('helvetica', 'bold')
  ctx.doc.setTextColor(PDF_CONFIG.colors.black)
  ctx.doc.text(text, ctx.margin, ctx.y)
  ctx.y += 8
}

function addHeading(ctx: PDFContext, text: string): void {
  checkPageBreak(ctx, 12)
  ctx.y += 4
  ctx.doc.setFontSize(PDF_CONFIG.fontSize.heading)
  ctx.doc.setFont('helvetica', 'bold')
  ctx.doc.setTextColor(PDF_CONFIG.colors.black)
  ctx.doc.text(text, ctx.margin, ctx.y)
  ctx.y += 6
}

function addParagraph(ctx: PDFContext, text: string, indent: number = 0): void {
  ctx.doc.setFontSize(PDF_CONFIG.fontSize.normal)
  ctx.doc.setFont('helvetica', 'normal')
  ctx.doc.setTextColor(PDF_CONFIG.colors.black)

  const maxWidth = ctx.doc.internal.pageSize.getWidth() - (ctx.margin * 2) - indent
  const lines = ctx.doc.splitTextToSize(text, maxWidth)

  for (const line of lines) {
    checkPageBreak(ctx, PDF_CONFIG.lineHeight)
    ctx.doc.text(line, ctx.margin + indent, ctx.y)
    ctx.y += PDF_CONFIG.lineHeight
  }
}

function addLabelValue(ctx: PDFContext, label: string, value: string, indent: number = 0): void {
  checkPageBreak(ctx, PDF_CONFIG.lineHeight)
  ctx.doc.setFontSize(PDF_CONFIG.fontSize.normal)
  ctx.doc.setFont('helvetica', 'bold')
  ctx.doc.setTextColor(PDF_CONFIG.colors.gray)
  ctx.doc.text(label + ':', ctx.margin + indent, ctx.y)

  ctx.doc.setFont('helvetica', 'normal')
  ctx.doc.setTextColor(PDF_CONFIG.colors.black)
  ctx.doc.text(value, ctx.margin + 50 + indent, ctx.y)
  ctx.y += PDF_CONFIG.lineHeight
}

function addSeparator(ctx: PDFContext): void {
  ctx.y += 4
  ctx.doc.setDrawColor(PDF_CONFIG.colors.lightGray)
  ctx.doc.line(ctx.margin, ctx.y, ctx.doc.internal.pageSize.getWidth() - ctx.margin, ctx.y)
  ctx.y += 6
}

function addSignatureLine(ctx: PDFContext, label: string, name: string, imageData?: string | null): void {
  checkPageBreak(ctx, 50)

  const signWidth = 70
  const lineY = ctx.y + 25

  // Unterschriftsbild wenn vorhanden
  if (imageData) {
    try {
      ctx.doc.addImage(imageData, 'PNG', ctx.margin, ctx.y, signWidth, 20)
    } catch (e) {
      // Fallback wenn Bild nicht geladen werden kann
    }
  }

  // Unterschriftslinie
  ctx.doc.setDrawColor(PDF_CONFIG.colors.black)
  ctx.doc.line(ctx.margin, lineY, ctx.margin + signWidth, lineY)

  // Label
  ctx.doc.setFontSize(PDF_CONFIG.fontSize.small)
  ctx.doc.setFont('helvetica', 'normal')
  ctx.doc.setTextColor(PDF_CONFIG.colors.gray)
  ctx.doc.text(label, ctx.margin, lineY + 5)

  // Name
  ctx.doc.setTextColor(PDF_CONFIG.colors.black)
  ctx.doc.text(name, ctx.margin, lineY + 10)

  ctx.y = lineY + 15
}

// Adresse formatieren
function formatAddress(address: { strasse: string; hausnummer: string; plz: string; ort: string; zusatz?: string }): string {
  const parts = []
  if (address.strasse && address.hausnummer) {
    parts.push(`${address.strasse} ${address.hausnummer}`)
  }
  if (address.zusatz) {
    parts.push(address.zusatz)
  }
  if (address.plz && address.ort) {
    parts.push(`${address.plz} ${address.ort}`)
  }
  return parts.join(', ')
}

// Personenname formatieren
function formatPerson(person: { anrede: string; titel?: string; vorname: string; nachname: string }): string {
  const parts = []
  if (person.anrede === 'firma') {
    parts.push(person.vorname) // Bei Firma ist vorname = Firmenname
  } else {
    if (person.titel) parts.push(person.titel)
    parts.push(person.vorname)
    parts.push(person.nachname)
  }
  return parts.filter(Boolean).join(' ')
}

// Hauptfunktion: PDF generieren
export async function generateMietvertragPDF(data: MietvertragData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const ctx: PDFContext = {
    doc,
    y: PDF_CONFIG.margin,
    pageHeight: doc.internal.pageSize.getHeight(),
    margin: PDF_CONFIG.margin
  }

  // === DECKBLATT ===
  ctx.y = 40
  addTitle(ctx, 'MIETVERTRAG')
  addSubtitle(ctx, 'über Wohnraum')

  ctx.y += 20
  addParagraph(ctx, `Erstellt am: ${formatDate(new Date())}`)
  ctx.y += 10

  // Kurzübersicht
  addHeading(ctx, 'Mietobjekt')
  addParagraph(ctx, formatAddress(data.objektAdresse))
  if (data.wohnflaeche) {
    addParagraph(ctx, `${data.wohnflaeche} m² | ${data.zimmeranzahl || '—'} Zimmer`)
  }

  ctx.y += 10
  addHeading(ctx, 'Vertragsparteien')
  addLabelValue(ctx, 'Vermieter', formatPerson(data.vermieter))
  addLabelValue(ctx, 'Mieter', data.mieter.map(m => formatPerson(m)).join(', '))

  ctx.y += 10
  addHeading(ctx, 'Mietkonditionen')
  const gesamtmiete = (data.kaltmiete || 0) + (data.nebenkostenVorauszahlung || 0) + (data.heizkostenVorauszahlung || 0)
  addLabelValue(ctx, 'Gesamtmiete', `${formatCurrency(gesamtmiete)} monatlich`)
  addLabelValue(ctx, 'Mietbeginn', data.mietdauer.startDate ? formatDate(data.mietdauer.startDate) : '—')

  // === NEUE SEITE: VERTRAGSTEXT ===
  doc.addPage()
  ctx.y = PDF_CONFIG.margin

  // Präambel
  addSubtitle(ctx, '§ 1 Vertragsparteien')
  ctx.y += 4

  addParagraph(ctx, 'Zwischen')
  ctx.y += 2
  addParagraph(ctx, formatPerson(data.vermieter), 10)
  addParagraph(ctx, formatAddress(data.vermieterAdresse), 10)
  if (data.vermieter.telefon) addParagraph(ctx, `Tel.: ${data.vermieter.telefon}`, 10)
  if (data.vermieter.email) addParagraph(ctx, `E-Mail: ${data.vermieter.email}`, 10)
  addParagraph(ctx, '- nachfolgend „Vermieter" genannt -', 10)

  ctx.y += 4
  addParagraph(ctx, 'und')
  ctx.y += 2

  data.mieter.forEach((mieter, index) => {
    addParagraph(ctx, formatPerson(mieter), 10)
    if (mieter.geburtsdatum) addParagraph(ctx, `geb. am ${formatDate(mieter.geburtsdatum)}`, 10)
  })
  addParagraph(ctx, formatAddress(data.mieterAdresse), 10)
  addParagraph(ctx, '- nachfolgend „Mieter" genannt -', 10)

  ctx.y += 4
  addParagraph(ctx, 'wird folgender Mietvertrag geschlossen:')

  addSeparator(ctx)

  // § 2 Mietobjekt
  addSubtitle(ctx, '§ 2 Mietgegenstand')
  ctx.y += 4

  addParagraph(ctx, `Der Vermieter vermietet dem Mieter zu Wohnzwecken folgende Räume:`)
  ctx.y += 2
  addParagraph(ctx, `Anschrift: ${formatAddress(data.objektAdresse)}`, 10)
  if (data.objektLage.etage) {
    const etageMap: Record<string, string> = {
      'eg': 'Erdgeschoss', 'hg': 'Hochparterre', 'dg': 'Dachgeschoss', 'ug': 'Untergeschoss',
      '1': '1. OG', '2': '2. OG', '3': '3. OG', '4': '4. OG', '5': '5. OG', '6+': '6. OG oder höher'
    }
    const lageMap: Record<string, string> = {
      'links': 'links', 'rechts': 'rechts', 'mitte': 'Mitte', 'vorne': 'vorne', 'hinten': 'hinten'
    }
    addParagraph(ctx, `Lage: ${etageMap[data.objektLage.etage] || data.objektLage.etage}${data.objektLage.lage ? ', ' + (lageMap[data.objektLage.lage] || data.objektLage.lage) : ''}`, 10)
  }
  addParagraph(ctx, `Wohnfläche: ca. ${data.wohnflaeche || '—'} m² (Abweichungen bis 10% sind unerheblich)`, 10)
  addParagraph(ctx, `Zimmeranzahl: ${data.zimmeranzahl || '—'} Zimmer`, 10)

  // Zubehör
  const zubehoer = []
  if (data.hatBalkon) zubehoer.push('Balkon')
  if (data.hatTerrasse) zubehoer.push('Terrasse')
  if (data.hatGarten) zubehoer.push('Gartennutzung')
  if (data.hatKeller) zubehoer.push(`Kellerraum ${data.kellerNummer || ''}`.trim())
  if (data.hatStellplatz) zubehoer.push(`PKW-Stellplatz ${data.stellplatzNummer || ''}`.trim())
  if (data.hatGarage) zubehoer.push(`Garage ${data.garagenNummer || ''}`.trim())
  if (data.hatEinbaukueche) zubehoer.push('Einbauküche')

  if (zubehoer.length > 0) {
    ctx.y += 2
    addParagraph(ctx, `Mitvermietet werden: ${zubehoer.join(', ')}`)
  }

  if (data.ausstattungSonstige) {
    addParagraph(ctx, `Sonstige Ausstattung: ${data.ausstattungSonstige}`)
  }

  addSeparator(ctx)

  // § 3 Mietdauer
  addSubtitle(ctx, '§ 3 Mietzeit')
  ctx.y += 4

  addParagraph(ctx, `Das Mietverhältnis beginnt am ${data.mietdauer.startDate ? formatDate(data.mietdauer.startDate) : '____________'}.`)

  if (data.mietdauer.isUnbefristet) {
    addParagraph(ctx, 'Das Mietverhältnis läuft auf unbestimmte Zeit.')
    ctx.y += 2
    addParagraph(ctx, 'Die ordentliche Kündigung ist beiderseits unter Einhaltung der gesetzlichen Kündigungsfristen möglich. Für den Mieter beträgt die Kündigungsfrist 3 Monate. Für den Vermieter verlängert sich die Kündigungsfrist nach 5 und 8 Jahren seit Überlassung des Wohnraums um jeweils 3 Monate (§ 573c BGB).')
  } else if (data.mietdauer.endDate) {
    addParagraph(ctx, `Das Mietverhältnis ist befristet und endet am ${formatDate(data.mietdauer.endDate)}, ohne dass es einer Kündigung bedarf.`)
    if (data.befristungsgrund) {
      addParagraph(ctx, `Befristungsgrund gem. § 575 BGB: ${data.befristungsgrund}`)
    }
  }

  addSeparator(ctx)

  // § 4 Miete
  addSubtitle(ctx, '§ 4 Miete und Nebenkosten')
  ctx.y += 4

  addParagraph(ctx, '(1) Die monatliche Miete setzt sich wie folgt zusammen:')
  ctx.y += 2
  addLabelValue(ctx, 'Kaltmiete (Nettomiete)', formatCurrency(data.kaltmiete || 0), 10)
  addLabelValue(ctx, 'Betriebskostenvorauszahlung', formatCurrency(data.nebenkostenVorauszahlung || 0), 10)
  addLabelValue(ctx, 'Heizkostenvorauszahlung', formatCurrency(data.heizkostenVorauszahlung || 0), 10)
  ctx.doc.setFont('helvetica', 'bold')
  addLabelValue(ctx, 'Gesamtmiete', formatCurrency(gesamtmiete), 10)
  ctx.doc.setFont('helvetica', 'normal')

  ctx.y += 4
  addParagraph(ctx, `(2) Die Miete ist monatlich im Voraus, spätestens bis zum ${data.zahlungsFaelligkeit}. Werktag eines Monats, auf folgendes Konto zu überweisen:`)
  if (data.vermieterIBAN) {
    addParagraph(ctx, `IBAN: ${data.vermieterIBAN}`, 10)
  }

  ctx.y += 4
  addParagraph(ctx, '(3) Über die Betriebskosten wird jährlich abgerechnet. Die Abrechnung erfolgt spätestens 12 Monate nach Ende des Abrechnungszeitraums.')

  // Staffel-/Indexmiete
  if (data.staffelmiete.enabled) {
    ctx.y += 4
    addParagraph(ctx, '(4) Die Vertragsparteien vereinbaren eine Staffelmiete gemäß § 557a BGB.')
  } else if (data.indexmiete.enabled) {
    ctx.y += 4
    addParagraph(ctx, `(4) Die Vertragsparteien vereinbaren eine Indexmiete gemäß § 557b BGB. Basis ist der Verbraucherpreisindex des Statistischen Bundesamts (Basisjahr: ${data.indexmiete.basisjahr}).`)
  }

  addSeparator(ctx)

  // § 5 Kaution
  addSubtitle(ctx, '§ 5 Mietsicherheit (Kaution)')
  ctx.y += 4

  addParagraph(ctx, `(1) Der Mieter leistet eine Mietsicherheit in Höhe von ${formatCurrency(data.kaution || 0)}.`)

  const kautionsartText: Record<string, string> = {
    barkaution: 'als Barkaution, die auf ein Mietkautionskonto einzuzahlen ist',
    sparbuch: 'in Form eines verpfändeten Sparbuchs',
    buergschaft: 'in Form einer selbstschuldnerischen Bankbürgschaft',
    kautionsversicherung: 'in Form einer Kautionsversicherung'
  }
  if (data.kautionsart) {
    addParagraph(ctx, `(2) Die Kaution wird geleistet ${kautionsartText[data.kautionsart] || ''}.`)
  }

  if (data.ratenzahlungKaution && data.kaution) {
    addParagraph(ctx, `(3) Der Mieter ist berechtigt, die Kaution in drei gleichen Monatsraten zu zahlen (§ 551 Abs. 2 BGB). Die erste Rate ist zu Beginn des Mietverhältnisses fällig.`)
  }

  addParagraph(ctx, `(${data.ratenzahlungKaution ? '4' : '3'}) Die Kaution wird nach Beendigung des Mietverhältnisses und Rückgabe der Mietsache unter Berücksichtigung etwaiger Gegenforderungen des Vermieters zurückerstattet.`)

  addSeparator(ctx)

  // § 6 Sondervereinbarungen
  addSubtitle(ctx, '§ 6 Sonstige Vereinbarungen')
  ctx.y += 4

  // Tierhaltung
  const tierhaltungText: Record<string, string> = {
    erlaubt: 'Die Haltung von Haustieren ist gestattet.',
    verboten: 'Die Haltung von Haustieren ist nicht gestattet. Kleintiere in artgerechter Haltung sind hiervon ausgenommen.',
    genehmigungspflichtig: 'Die Haltung von Hunden und Katzen bedarf der vorherigen Zustimmung des Vermieters, die nur aus wichtigem Grund verweigert werden kann. Kleintiere sind erlaubt.'
  }
  addParagraph(ctx, `(1) Tierhaltung: ${tierhaltungText[data.tierhaltung]}`)

  // Untervermietung
  const untervermietungText: Record<string, string> = {
    erlaubt: 'Eine Untervermietung ist gestattet.',
    verboten: 'Eine Untervermietung ist nicht gestattet.',
    genehmigungspflichtig: 'Eine Untervermietung bedarf der vorherigen Zustimmung des Vermieters. Bei berechtigtem Interesse ist die Erlaubnis zu erteilen (§ 553 BGB).'
  }
  addParagraph(ctx, `(2) Untervermietung: ${untervermietungText[data.untervermietung]}`)

  // Schönheitsreparaturen
  if (data.schoenheitsreparaturen === 'mieter') {
    addParagraph(ctx, '(3) Schönheitsreparaturen: Der Mieter übernimmt die Schönheitsreparaturen während der Mietzeit, wenn und soweit Renovierungsbedarf besteht. Starre Fristen gelten nicht.')
  } else if (data.schoenheitsreparaturen === 'vermieter') {
    addParagraph(ctx, '(3) Schönheitsreparaturen verbleiben beim Vermieter.')
  }

  // Kleinreparaturen
  if (data.kleinreparaturen.enabled) {
    addParagraph(ctx, `(4) Kleinreparaturen: Der Mieter trägt die Kosten für Kleinreparaturen an Gegenständen, die seinem häufigen Zugriff ausgesetzt sind, bis zu einem Betrag von ${formatCurrency(data.kleinreparaturen.einzelbetrag || 0)} je Einzelfall und maximal ${formatCurrency(data.kleinreparaturen.jahresbetrag || 0)} pro Jahr.`)
  }

  // Sonstige
  if (data.sonstigeVereinbarungen) {
    ctx.y += 4
    addParagraph(ctx, `Weitere Vereinbarungen: ${data.sonstigeVereinbarungen}`)
  }

  addSeparator(ctx)

  // § 7 Schlussbestimmungen
  addSubtitle(ctx, '§ 7 Schlussbestimmungen')
  ctx.y += 4

  addParagraph(ctx, '(1) Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.')
  addParagraph(ctx, '(2) Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird hierdurch die Gültigkeit der übrigen Bestimmungen nicht berührt.')
  addParagraph(ctx, '(3) Der Mieter hat den Mietvertrag und ggf. beigefügte Anlagen (Hausordnung, Übergabeprotokoll) erhalten.')

  // === NEUE SEITE: UNTERSCHRIFTEN ===
  doc.addPage()
  ctx.y = PDF_CONFIG.margin

  addSubtitle(ctx, 'Unterschriften')
  ctx.y += 10

  // Ort, Datum
  const signatureDate = data.unterschriftVermieter.signedAt
    ? formatDate(data.unterschriftVermieter.signedAt)
    : formatDate(new Date())
  const signatureLocation = data.unterschriftVermieter.signedLocation || '____________'

  addParagraph(ctx, `${signatureLocation}, den ${signatureDate}`)
  ctx.y += 20

  // Vermieter
  addSignatureLine(
    ctx,
    'Vermieter',
    formatPerson(data.vermieter),
    data.unterschriftVermieter.imageData
  )

  ctx.y += 20

  // Mieter
  data.mieter.forEach((mieter, index) => {
    addSignatureLine(
      ctx,
      index === 0 ? 'Mieter' : `Mieter ${index + 1}`,
      formatPerson(mieter),
      data.unterschriftMieter[index]?.imageData
    )
    ctx.y += 15
  })

  // Fußzeile auf jeder Seite
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(PDF_CONFIG.colors.gray)
    doc.text(
      `Mietvertrag – Seite ${i} von ${totalPages}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
    doc.text(
      `Erstellt mit Mietrecht Formulare | ${formatDate(new Date())}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    )
  }

  // PDF speichern
  const filename = `Mietvertrag_${data.objektAdresse.strasse?.replace(/\s/g, '_') || 'Wohnung'}_${formatDate(new Date()).replace(/\./g, '-')}.pdf`
  doc.save(filename)
}

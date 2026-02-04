import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  Eye,
  Edit2,
  Copy,
  FolderOpen,
  FileSignature,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Key,
  Users,
  Euro,
  Home,
  Loader2,
  LogIn
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { useDocuments, Document } from '@/hooks/useDocuments'

const dokumentTypen = [
  { id: 'alle', label: 'Alle Dokumente' },
  { id: 'mietvertrag', label: 'Mietverträge', icon: FileSignature },
  { id: 'kuendigung', label: 'Kündigungen', icon: FileText },
  { id: 'uebergabeprotokoll', label: 'Übergabeprotokolle', icon: ClipboardList },
  { id: 'betriebskosten', label: 'Betriebskosten', icon: Euro },
  { id: 'mieterhoehung', label: 'Mieterhöhungen', icon: TrendingUp },
  { id: 'maengelanzeige', label: 'Mängelanzeigen', icon: AlertTriangle },
  { id: 'untermietvertrag', label: 'Untermietverträge', icon: Key },
  { id: 'selbstauskunft', label: 'Selbstauskünfte', icon: Users },
]

const neueFormulare = [
  { id: 'mietvertrag', label: 'Mietvertrag', href: '/formulare/mietvertrag', icon: FileSignature },
  { id: 'kuendigung', label: 'Kündigung', href: '/formulare/kuendigung', icon: FileText },
  { id: 'uebergabeprotokoll', label: 'Übergabeprotokoll', href: '/formulare/uebergabeprotokoll', icon: ClipboardList },
  { id: 'betriebskosten', label: 'Betriebskosten', href: '/formulare/betriebskosten', icon: Euro },
  { id: 'mieterhoehung', label: 'Mieterhöhung', href: '/formulare/mieterhoehung', icon: TrendingUp },
  { id: 'maengelanzeige', label: 'Mängelanzeige', href: '/formulare/maengelanzeige', icon: AlertTriangle },
  { id: 'untermietvertrag', label: 'Untermietvertrag', href: '/formulare/untermietvertrag', icon: Key },
  { id: 'selbstauskunft', label: 'Selbstauskunft', href: '/formulare/selbstauskunft', icon: Users },
]

const getDocumentIcon = (formSlug: string) => {
  const iconMap: Record<string, React.ElementType> = {
    mietvertrag: FileSignature,
    kuendigung: FileText,
    uebergabeprotokoll: ClipboardList,
    betriebskosten: Euro,
    mieterhoehung: TrendingUp,
    maengelanzeige: AlertTriangle,
    untermietvertrag: Key,
    selbstauskunft: Users,
  }
  return iconMap[formSlug] || FileText
}

const getDocumentColor = (formSlug: string) => {
  const colorMap: Record<string, string> = {
    mietvertrag: 'blue',
    kuendigung: 'red',
    uebergabeprotokoll: 'green',
    betriebskosten: 'purple',
    mieterhoehung: 'orange',
    maengelanzeige: 'yellow',
    untermietvertrag: 'cyan',
    selbstauskunft: 'pink',
  }
  return colorMap[formSlug] || 'gray'
}

export default function MeineDokumente() {
  const navigate = useNavigate()
  const { documents, isLoading, isAuthenticated, deleteDocument } = useDocuments()
  const [suchbegriff, setSuchbegriff] = useState('')
  const [filterTyp, setFilterTyp] = useState('alle')
  const [filterStatus, setFilterStatus] = useState('alle')

  const gefilterteDokumente = documents.filter(dok => {
    const matchSuche = dok.title.toLowerCase().includes(suchbegriff.toLowerCase())
    const matchTyp = filterTyp === 'alle' || dok.form_slug === filterTyp
    const matchStatus = filterStatus === 'alle' || dok.status === filterStatus
    return matchSuche && matchTyp && matchStatus
  })

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Entwurf</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Fertig</Badge>
      case 'sent':
        return <Badge variant="default" className="bg-blue-600">Gesendet</Badge>
      default:
        return <Badge variant="secondary">Entwurf</Badge>
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Möchten Sie dieses Dokument wirklich löschen?')) {
      await deleteDocument(id)
    }
  }

  const handleEdit = (doc: Document) => {
    // Navigate to the form with the document data
    const formPath = `/formulare/${doc.form_slug}`
    // Store the data to be loaded
    localStorage.setItem(`${doc.form_slug}-draft`, JSON.stringify(doc.input_data))
    navigate(formPath)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h1 className="font-semibold">Meine Dokumente</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <LogIn className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Anmeldung erforderlich</h3>
              <p className="text-muted-foreground mb-6">
                Melden Sie sich an, um Ihre gespeicherten Dokumente zu sehen.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/register')}>
                  Registrieren
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Anmelden
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h1 className="font-semibold">Meine Dokumente</h1>
                  <p className="text-sm text-muted-foreground">
                    {documents.length} Dokumente gespeichert
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Neues Dokument</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {neueFormulare.map((formular) => (
                  <Link key={formular.id} to={formular.href}>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2">
                      <formular.icon className="h-4 w-4" />
                      <span className="text-sm">{formular.label}</span>
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Dokumenttyp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {dokumentTypen.map((typ) => (
                  <Button
                    key={typ.id}
                    variant={filterTyp === typ.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2 h-auto py-2"
                    onClick={() => setFilterTyp(typ.id)}
                  >
                    {typ.icon && <typ.icon className="h-4 w-4" />}
                    <span className="text-sm">{typ.label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Übersicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entwürfe</span>
                  <span className="font-medium">
                    {documents.filter(d => d.status === 'draft').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fertig</span>
                  <span className="font-medium">
                    {documents.filter(d => d.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gesendet</span>
                  <span className="font-medium">
                    {documents.filter(d => d.status === 'sent').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Dokumente durchsuchen..."
                  value={suchbegriff}
                  onChange={(e) => setSuchbegriff(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Status</SelectItem>
                  <SelectItem value="draft">Entwürfe</SelectItem>
                  <SelectItem value="completed">Fertig</SelectItem>
                  <SelectItem value="sent">Gesendet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Dokumente werden geladen...</p>
                </CardContent>
              </Card>
            ) : gefilterteDokumente.length === 0 ? (
              <Card className="py-12">
                <CardContent className="text-center">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Keine Dokumente gefunden</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {suchbegriff || filterTyp !== 'alle' || filterStatus !== 'alle'
                      ? 'Versuchen Sie andere Suchkriterien'
                      : 'Erstellen Sie Ihr erstes Dokument'}
                  </p>
                  <Link to="/formulare/mietvertrag">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Neues Dokument
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {gefilterteDokumente.map((dok) => {
                  const Icon = getDocumentIcon(dok.form_slug)
                  const color = getDocumentColor(dok.form_slug)
                  
                  return (
                    <Card key={dok.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-${color}-100`}>
                            <Icon className={`h-6 w-6 text-${color}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold truncate">{dok.title}</h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {dok.form_slug.replace(/-/g, ' ')}
                                </p>
                              </div>
                              {getStatusBadge(dok.status)}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Erstellt: {dok.created_at ? formatDate(dok.created_at) : '-'}
                              </span>
                              {dok.created_at !== dok.updated_at && dok.updated_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Geändert: {formatDate(dok.updated_at)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Bearbeiten"
                              onClick={() => handleEdit(dok)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {dok.pdf_url && (
                              <Button variant="ghost" size="icon" title="PDF herunterladen" asChild>
                                <a href={dok.pdf_url} download>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Löschen"
                              onClick={() => handleDelete(dok.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Cloud-Speicherung</p>
                    <p className="mt-1">
                      Ihre Dokumente werden sicher in der Cloud gespeichert und sind von überall aus zugänglich.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

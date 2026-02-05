import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormulareSection } from '@/components/home/FormulareSection'

export default function FormulareIndex() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Alle Formulare</h1>
                  <p className="text-sm text-muted-foreground">Übersicht aller verfügbaren Dokumente</p>
                </div>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/meine-dokumente">
                <Button variant="ghost">Meine Dokumente</Button>
              </Link>
              <Link to="/hilfe">
                <Button variant="ghost">Hilfe</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* All Forms with compact variant */}
      <FormulareSection variant="compact" />
    </div>
  )
}

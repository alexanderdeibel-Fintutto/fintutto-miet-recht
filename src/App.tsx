import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

// Pages
import HomePage from '@/pages/HomePage'
import MeineDokumente from '@/pages/MeineDokumente'
import Hilfe from '@/pages/Hilfe'
import Impressum from '@/pages/Impressum'
import Datenschutz from '@/pages/Datenschutz'
import AGB from '@/pages/AGB'

// Formulare
import Mietvertrag from '@/pages/formulare/Mietvertrag'
import Kuendigung from '@/pages/formulare/Kuendigung'
import Uebergabeprotokoll from '@/pages/formulare/Uebergabeprotokoll'
import Betriebskosten from '@/pages/formulare/Betriebskosten'
import Mieterhoehung from '@/pages/formulare/Mieterhoehung'
import Maengelanzeige from '@/pages/formulare/Maengelanzeige'
import Selbstauskunft from '@/pages/formulare/Selbstauskunft'
import Untermietvertrag from '@/pages/formulare/Untermietvertrag'

// Rechner
import Mietpreisrechner from '@/pages/rechner/Mietpreisrechner'
import Nebenkostenrechner from '@/pages/rechner/Nebenkostenrechner'
import Kautionsrechner from '@/pages/rechner/Kautionsrechner'
import Kuendigungsfristrechner from '@/pages/rechner/Kuendigungsfristrechner'

function App() {
  return (
    <>
      <Routes>
        {/* Hauptseiten */}
        <Route path="/" element={<HomePage />} />
        <Route path="/meine-dokumente" element={<MeineDokumente />} />
        <Route path="/hilfe" element={<Hilfe />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/agb" element={<AGB />} />

        {/* Formulare */}
        <Route path="/formulare/mietvertrag" element={<Mietvertrag />} />
        <Route path="/formulare/kuendigung" element={<Kuendigung />} />
        <Route path="/formulare/uebergabeprotokoll" element={<Uebergabeprotokoll />} />
        <Route path="/formulare/betriebskosten" element={<Betriebskosten />} />
        <Route path="/formulare/mieterhoehung" element={<Mieterhoehung />} />
        <Route path="/formulare/maengelanzeige" element={<Maengelanzeige />} />
        <Route path="/formulare/selbstauskunft" element={<Selbstauskunft />} />
        <Route path="/formulare/untermietvertrag" element={<Untermietvertrag />} />

        {/* Rechner */}
        <Route path="/rechner/mietpreis" element={<Mietpreisrechner />} />
        <Route path="/rechner/nebenkosten" element={<Nebenkostenrechner />} />
        <Route path="/rechner/kaution" element={<Kautionsrechner />} />
        <Route path="/rechner/kuendigungsfrist" element={<Kuendigungsfristrechner />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App

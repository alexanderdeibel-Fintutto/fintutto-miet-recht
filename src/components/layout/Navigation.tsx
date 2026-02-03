'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Calculator, FolderOpen, HelpCircle, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Start', icon: Home },
  { href: '/meine-dokumente', label: 'Meine Dokumente', icon: FolderOpen },
  { href: '/hilfe', label: 'Hilfe', icon: HelpCircle },
]

const formularLinks = [
  { href: '/formulare/mietvertrag', label: 'Mietvertrag' },
  { href: '/formulare/kuendigung', label: 'Kündigung' },
  { href: '/formulare/uebergabeprotokoll', label: 'Übergabeprotokoll' },
  { href: '/formulare/betriebskosten', label: 'Betriebskosten' },
  { href: '/formulare/mieterhoehung', label: 'Mieterhöhung' },
  { href: '/formulare/maengelanzeige', label: 'Mängelanzeige' },
  { href: '/formulare/selbstauskunft', label: 'Selbstauskunft' },
  { href: '/formulare/untermietvertrag', label: 'Untermietvertrag' },
]

const rechnerLinks = [
  { href: '/rechner/mietpreis', label: 'Mietpreisrechner' },
  { href: '/rechner/nebenkosten', label: 'Nebenkostenrechner' },
  { href: '/rechner/kaution', label: 'Kautionsrechner' },
  { href: '/rechner/kuendigungsfrist', label: 'Kündigungsfrist' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">Mietrecht Formulare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Formulare Dropdown */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Formulare
              </Button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white border rounded-lg shadow-lg p-2 min-w-[200px]">
                  {formularLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant={pathname === link.href ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Rechner Dropdown */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="gap-2">
                <Calculator className="h-4 w-4" />
                Rechner
              </Button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white border rounded-lg shadow-lg p-2 min-w-[200px]">
                  {rechnerLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant={pathname === link.href ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-4">
              {/* Main Links */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={pathname === item.href ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Formulare */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">FORMULARE</p>
                <div className="space-y-1">
                  {formularLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={pathname === link.href ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Rechner */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">RECHNER</p>
                <div className="space-y-1">
                  {rechnerLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={pathname === link.href ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

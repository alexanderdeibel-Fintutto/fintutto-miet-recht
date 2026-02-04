import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: () => void
  onRegister?: () => void
  title?: string
  description?: string
}

export function AuthRequiredDialog({
  open,
  onOpenChange,
  onLogin,
  onRegister,
  title = "Anmeldung erforderlich",
  description = "Um Ihr Dokument zu speichern, müssen Sie sich anmelden oder ein Konto erstellen. Ihr Entwurf wurde temporär gespeichert."
}: AuthRequiredDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          {onRegister && (
            <Button variant="outline" onClick={onRegister}>
              <UserPlus className="h-4 w-4 mr-2" />
              Registrieren
            </Button>
          )}
          <AlertDialogAction onClick={onLogin}>
            <LogIn className="h-4 w-4 mr-2" />
            Anmelden
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

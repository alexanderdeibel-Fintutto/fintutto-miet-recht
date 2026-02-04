import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Json } from '@/integrations/supabase/types'

interface SaveFormOptions {
  formSlug: string
  title: string
  inputData: Record<string, unknown>
  status?: 'draft' | 'completed'
}

export function useFormSave() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [pendingData, setPendingData] = useState<SaveFormOptions | null>(null)

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user ?? null
  }

  const saveForm = async (options: SaveFormOptions): Promise<boolean> => {
    setIsLoading(true)
    try {
      const user = await checkAuth()

      if (!user) {
        // User not logged in - store pending data and show auth prompt
        setPendingData(options)
        setShowAuthDialog(true)
        
        // Also save to localStorage as backup
        const draftKey = `form-draft-${options.formSlug}`
        localStorage.setItem(draftKey, JSON.stringify({
          ...options,
          savedAt: new Date().toISOString()
        }))
        
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melden Sie sich an, um Ihr Dokument zu speichern.",
        })
        setIsLoading(false)
        return false
      }

      // User is logged in - save to database
      const { error } = await supabase
        .from('generated_documents')
        .insert([{
          user_id: user.id,
          form_slug: options.formSlug,
          title: options.title,
          input_data: options.inputData as unknown as Json,
          status: options.status || 'draft'
        }])

      if (error) throw error

      // Clear localStorage draft
      localStorage.removeItem(`form-draft-${options.formSlug}`)
      localStorage.removeItem(`${options.formSlug}-draft`)

      toast({
        title: "Dokument gespeichert",
        description: "Ihr Dokument wurde erfolgreich gespeichert.",
        variant: "success"
      })

      // Navigate to documents page
      navigate('/meine-dokumente')
      return true
    } catch (error) {
      console.error('Error saving form:', error)
      toast({
        title: "Fehler",
        description: "Das Dokument konnte nicht gespeichert werden.",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const saveAfterAuth = async () => {
    if (!pendingData) return false
    setShowAuthDialog(false)
    return saveForm(pendingData)
  }

  const redirectToLogin = () => {
    if (pendingData) {
      // Store redirect info
      sessionStorage.setItem('post-login-redirect', '/meine-dokumente')
      sessionStorage.setItem('pending-form-save', JSON.stringify(pendingData))
    }
    navigate('/login')
  }

  return {
    saveForm,
    saveAfterAuth,
    redirectToLogin,
    isLoading,
    showAuthDialog,
    setShowAuthDialog,
    pendingData
  }
}

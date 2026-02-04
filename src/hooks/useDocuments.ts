import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Json } from '@/integrations/supabase/types'

export interface Document {
  id: string
  form_slug: string
  title: string
  input_data: Json
  status: string | null
  pdf_url: string | null
  created_at: string | null
  updated_at: string | null
}

export function useDocuments() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setIsAuthenticated(false)
        setDocuments([])
        return
      }

      setIsAuthenticated(true)

      const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Fehler",
        description: "Dokumente konnten nicht geladen werden.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_documents')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDocuments(prev => prev.filter(d => d.id !== id))
      toast({
        title: "Gelöscht",
        description: "Das Dokument wurde gelöscht.",
      })
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      toast({
        title: "Fehler",
        description: "Das Dokument konnte nicht gelöscht werden.",
        variant: "destructive"
      })
      return false
    }
  }

  const updateDocumentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('generated_documents')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setDocuments(prev => prev.map(d => 
        d.id === id ? { ...d, status, updated_at: new Date().toISOString() } : d
      ))
      return true
    } catch (error) {
      console.error('Error updating document:', error)
      return false
    }
  }

  useEffect(() => {
    fetchDocuments()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchDocuments()
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    documents,
    isLoading,
    isAuthenticated,
    fetchDocuments,
    deleteDocument,
    updateDocumentStatus
  }
}

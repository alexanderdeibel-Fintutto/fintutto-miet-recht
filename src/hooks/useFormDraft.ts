import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const DRAFT_STORAGE_PREFIX = 'form_draft_';

export interface FormDraftData {
  formTemplateId: string;
  currentStep: number;
  data: Record<string, unknown>;
  lastUpdated: string;
}

// Local storage helpers
const getLocalDraft = (formTemplateId: string): FormDraftData | null => {
  const stored = localStorage.getItem(`${DRAFT_STORAGE_PREFIX}${formTemplateId}`);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const setLocalDraft = (formTemplateId: string, data: FormDraftData): void => {
  localStorage.setItem(`${DRAFT_STORAGE_PREFIX}${formTemplateId}`, JSON.stringify(data));
};

const removeLocalDraft = (formTemplateId: string): void => {
  localStorage.removeItem(`${DRAFT_STORAGE_PREFIX}${formTemplateId}`);
};

export function useFormDraft(formTemplateId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localDraft, setLocalDraftState] = useState<FormDraftData | null>(null);

  // Load local draft on mount
  useEffect(() => {
    if (formTemplateId) {
      const draft = getLocalDraft(formTemplateId);
      setLocalDraftState(draft);
    }
  }, [formTemplateId]);

  // Fetch server draft if user is logged in
  const { data: serverDraft, isLoading: isLoadingServerDraft } = useQuery({
    queryKey: ['form-draft', formTemplateId, user?.id],
    queryFn: async () => {
      if (!user || !formTemplateId) return null;

      const { data, error } = await supabase
        .from('user_form_drafts')
        .select('*')
        .eq('user_id', user.id)
        .eq('form_template_id', formTemplateId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return {
          formTemplateId: data.form_template_id,
          currentStep: data.current_step || 1,
          data: data.draft_data as Record<string, unknown>,
          lastUpdated: data.updated_at || new Date().toISOString(),
        } as FormDraftData;
      }

      return null;
    },
    enabled: !!user && !!formTemplateId,
  });

  // Merge local and server drafts - prefer the more recent one
  const draft = (() => {
    if (!localDraft && !serverDraft) return null;
    if (!localDraft) return serverDraft;
    if (!serverDraft) return localDraft;

    // Compare timestamps and use the more recent one
    const localTime = new Date(localDraft.lastUpdated).getTime();
    const serverTime = new Date(serverDraft.lastUpdated).getTime();

    return localTime > serverTime ? localDraft : serverDraft;
  })();

  // Save draft mutation
  const saveMutation = useMutation({
    mutationFn: async (draftData: Omit<FormDraftData, 'formTemplateId' | 'lastUpdated'>) => {
      if (!formTemplateId) return;

      const newDraft: FormDraftData = {
        formTemplateId,
        currentStep: draftData.currentStep,
        data: draftData.data,
        lastUpdated: new Date().toISOString(),
      };

      // Always save to local storage
      setLocalDraft(formTemplateId, newDraft);
      setLocalDraftState(newDraft);

      // If user is logged in, sync to server
      if (user) {
        // Check if draft exists
        const { data: existingDraft } = await supabase
          .from('user_form_drafts')
          .select('id')
          .eq('user_id', user.id)
          .eq('form_template_id', formTemplateId)
          .maybeSingle();

        if (existingDraft) {
          // Update existing draft
          const { error: updateError } = await supabase
            .from('user_form_drafts')
            .update({
              current_step: draftData.currentStep,
              draft_data: draftData.data as unknown as Record<string, never>,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingDraft.id);

          if (updateError) throw updateError;
        } else {
          // Insert new draft
          const { error: insertError } = await supabase
            .from('user_form_drafts')
            .insert([{
              user_id: user.id,
              form_template_id: formTemplateId,
              current_step: draftData.currentStep,
              draft_data: draftData.data as unknown as Record<string, never>,
            }]);

          if (insertError) throw insertError;
        }
      }

      return newDraft;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-draft', formTemplateId] });
    },
  });

  // Delete draft mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!formTemplateId) return;

      // Remove from local storage
      removeLocalDraft(formTemplateId);
      setLocalDraftState(null);

      // Remove from server if user is logged in
      if (user) {
        const { error } = await supabase
          .from('user_form_drafts')
          .delete()
          .eq('user_id', user.id)
          .eq('form_template_id', formTemplateId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-draft', formTemplateId] });
    },
  });

  // Sync local draft to server after login
  const syncLocalToServer = useCallback(async () => {
    if (!user || !formTemplateId) return;

    const local = getLocalDraft(formTemplateId);
    if (!local) return;

    await saveMutation.mutateAsync({
      currentStep: local.currentStep,
      data: local.data,
    });
  }, [user, formTemplateId, saveMutation]);

  return {
    draft,
    isLoading: isLoadingServerDraft,
    saveDraft: saveMutation.mutate,
    deleteDraft: deleteMutation.mutate,
    syncLocalToServer,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook to get all user drafts
export function useUserDrafts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-drafts', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_form_drafts')
        .select(`
          *,
          form_templates (
            id,
            slug,
            name,
            tier,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

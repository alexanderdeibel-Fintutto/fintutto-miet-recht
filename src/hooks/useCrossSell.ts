import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useEffect, useState } from 'react'

export interface CrossSellTrigger {
  id: string
  source_app_id: string
  target_app_id: string
  trigger_type: string
  trigger_context: string | null
  headline: string
  message: string
  cta_text: string
  priority: number
  is_active: boolean
}

interface UserSubscription {
  app_id: string
  status: string
}

const CURRENT_APP_ID = 'formulare'
const DISMISSED_KEY = 'cross_sell_dismissed'

export function useCrossSellTriggers() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(DISMISSED_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Clear dismissed items older than 7 days
        const now = Date.now()
        const valid = Object.entries(parsed)
          .filter(([_, timestamp]) => now - (timestamp as number) < 7 * 24 * 60 * 60 * 1000)
        setDismissedIds(valid.map(([id]) => id))
        localStorage.setItem(DISMISSED_KEY, JSON.stringify(Object.fromEntries(valid)))
      } catch {
        setDismissedIds([])
      }
    }
  }, [])

  const dismissTrigger = (id: string) => {
    const stored = localStorage.getItem(DISMISSED_KEY)
    const dismissed = stored ? JSON.parse(stored) : {}
    dismissed[id] = Date.now()
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed))
    setDismissedIds(prev => [...prev, id])
  }

  // Get user's active subscriptions
  const { data: userSubscriptions } = useQuery({
    queryKey: ['user-subscriptions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('app_id, status')
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (error) throw error
      return data as UserSubscription[]
    },
    staleTime: 1000 * 60 * 5,
  })

  // Get cross-sell triggers for current app
  const { data: triggers, ...rest } = useQuery({
    queryKey: ['cross-sell-triggers', CURRENT_APP_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_cross_sell_triggers')
        .select('*')
        .eq('source_app_id', CURRENT_APP_ID)
        .eq('trigger_type', 'app_start')
        .eq('is_active', true)
        .order('priority', { ascending: false })

      if (error) throw error
      return data as CrossSellTrigger[]
    },
    staleTime: 1000 * 60 * 5,
  })

  // Filter triggers: only show for apps user doesn't have
  const activeUserAppIds = userSubscriptions?.map(s => s.app_id) || []
  
  const filteredTriggers = triggers?.filter(trigger => 
    !activeUserAppIds.includes(trigger.target_app_id) &&
    !dismissedIds.includes(trigger.id)
  ) || []

  return {
    ...rest,
    triggers: filteredTriggers,
    dismissTrigger,
    hasActiveTrigger: filteredTriggers.length > 0,
    topTrigger: filteredTriggers[0] || null,
  }
}

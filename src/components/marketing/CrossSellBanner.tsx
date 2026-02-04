import { X, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCrossSellTriggers } from '@/hooks/useCrossSell'
import { useProducts } from '@/hooks/useProducts'
import { cn } from '@/lib/utils'

interface CrossSellBannerProps {
  className?: string
  variant?: 'inline' | 'floating'
}

export function CrossSellBanner({ className, variant = 'inline' }: CrossSellBannerProps) {
  const { topTrigger, dismissTrigger, hasActiveTrigger } = useCrossSellTriggers()
  const { data: products } = useProducts()

  if (!hasActiveTrigger || !topTrigger) return null

  const targetProduct = products?.find(p => p.app_id === topTrigger.target_app_id)

  const handleDismiss = () => {
    dismissTrigger(topTrigger.id)
  }

  const handleCTA = () => {
    if (targetProduct?.app_url) {
      window.open(targetProduct.app_url, '_blank', 'noopener,noreferrer')
    }
  }

  if (variant === 'floating') {
    return (
      <div className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-right-5 duration-300",
        className
      )}>
        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm">{topTrigger.headline}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1 -mr-2 text-muted-foreground hover:text-foreground"
                    onClick={handleDismiss}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {topTrigger.message}
                </p>
                {targetProduct && (
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" onClick={handleCTA} className="gap-1.5">
                      {topTrigger.cta_text}
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    {targetProduct.price_cents > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ab {(targetProduct.price_cents / 100).toFixed(2)} €/Monat
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className={cn(
      "border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex p-3 rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold">{topTrigger.headline}</h4>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {topTrigger.message}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {targetProduct && (
              <Button onClick={handleCTA} className="gap-1.5 whitespace-nowrap">
                {topTrigger.cta_text}
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

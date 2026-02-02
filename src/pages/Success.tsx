import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';

export default function Success() {
  const navigate = useNavigate();
  const { refresh, plan, loading } = useSubscription();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Refresh subscription status
    refresh();
    
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [refresh]);

  const planNames: Record<string, string> = {
    free: 'Kostenlos',
    basic: 'Basic',
    pro: 'Pro',
    business: 'Business',
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles 
                className="h-4 w-4"
                style={{ 
                  color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-bounce-once">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <CardTitle className="text-2xl">
            Willkommen bei {planNames[plan] || 'Premium'}!
          </CardTitle>
          <CardDescription className="text-base">
            Ihre Zahlung war erfolgreich. Vielen Dank für Ihr Vertrauen!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                'Subscription wird aktiviert...'
              ) : (
                <>
                  Ihr <span className="font-semibold text-foreground">{planNames[plan]}</span>-Plan 
                  ist jetzt aktiv. Alle Premium-Funktionen stehen Ihnen ab sofort zur Verfügung.
                </>
              )}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/dashboard/formulare')} 
              className="w-full gap-2"
              size="lg"
            >
              Zur App
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/profil')} 
              variant="outline"
              className="w-full"
            >
              Zum Profil
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

import { Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature?: string;
  requiredPlan?: 'basic' | 'pro' | 'business';
  variant?: 'card' | 'inline' | 'modal';
  className?: string;
}

export function UpgradePrompt({ 
  feature = 'Diese Funktion', 
  requiredPlan = 'pro',
  variant = 'card',
  className = ''
}: UpgradePromptProps) {
  const navigate = useNavigate();

  const planNames: Record<string, string> = {
    basic: 'Basic',
    pro: 'Pro',
    business: 'Business',
  };

  const planName = planNames[requiredPlan] || 'Premium';

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
        <Lock className="h-4 w-4" />
        <span className="text-sm">
          {feature} ist im {planName}-Plan verfügbar.{' '}
          <Button 
            variant="link" 
            className="h-auto p-0 text-sm"
            onClick={() => navigate('/pricing')}
          >
            Jetzt upgraden
          </Button>
        </span>
      </div>
    );
  }

  return (
    <Card className={`border-dashed bg-muted/30 ${className}`}>
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
          <Lock className="h-6 w-6 text-secondary" />
        </div>
        <CardTitle className="text-lg">{planName}-Feature</CardTitle>
        <CardDescription>
          {feature} ist im {planName}-Plan verfügbar.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button 
          onClick={() => navigate('/pricing')}
          className="gap-2"
        >
          <Crown className="h-4 w-4" />
          Jetzt upgraden
        </Button>
      </CardContent>
    </Card>
  );
}

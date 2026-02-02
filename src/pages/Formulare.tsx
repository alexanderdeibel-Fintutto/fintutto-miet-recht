import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FORM_CATEGORIES, FREE_TIER_LIMITS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Mail, Calculator, ClipboardList, MoreHorizontal, Lock, Crown } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Mail,
  Calculator,
  ClipboardList,
  MoreHorizontal,
};

export default function Formulare() {
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  const handleSelectForm = (formId: string, isPremiumForm: boolean) => {
    if (isPremiumForm && !isPremium) {
      // Navigate to pricing or show upgrade modal
      navigate('/dashboard/profil?upgrade=true');
      return;
    }
    navigate(`/dashboard/formulare/${formId}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Formulare</h1>
          <p className="text-muted-foreground">
            Wählen Sie ein Formular aus, um es auszufüllen und als PDF zu exportieren.
          </p>
        </div>

        {!isPremium && (
          <Card className="mb-6 border-secondary bg-secondary/5">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-secondary" />
                <div>
                  <p className="font-medium">Upgrade auf Premium</p>
                  <p className="text-sm text-muted-foreground">
                    Erhalten Sie Zugang zu allen {FORM_CATEGORIES.reduce((acc, cat) => acc + cat.forms.length, 0)} Formularen
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => navigate('/dashboard/profil?upgrade=true')}>
                Upgrade
              </Button>
            </CardContent>
          </Card>
        )}

        <Accordion type="single" collapsible className="space-y-4">
          {FORM_CATEGORIES.map((category) => {
            const IconComponent = iconMap[category.icon] || FileText;
            return (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border rounded-xl bg-background px-6 card-shadow"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{category.title}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.forms.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2 pb-4">
                    {category.forms.map((form) => {
                      const isLocked = form.isPremium && !isPremium;
                      return (
                        <button
                          key={form.id}
                          onClick={() => handleSelectForm(form.id, form.isPremium)}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-colors text-left ${
                            isLocked
                              ? 'bg-muted/50 hover:bg-muted'
                              : 'hover:bg-accent hover:border-primary'
                          }`}
                        >
                          <span className={isLocked ? 'text-muted-foreground' : ''}>
                            {form.title}
                          </span>
                          {isLocked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              Verfügbar
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </DashboardLayout>
  );
}

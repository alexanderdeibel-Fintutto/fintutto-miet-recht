import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { useFormDraft } from '@/hooks/useFormDraft';
import { cn } from '@/lib/utils';
import type { Json } from '@/integrations/supabase/types';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea' | 'checkbox' | 'select';
  placeholder?: string;
  required?: boolean;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

interface FormStep {
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormWizardProps {
  templateId: string;
  fields: Json;
  initialData?: Record<string, unknown>;
  onComplete: (data: Record<string, unknown>) => void;
  onStepChange?: (step: number) => void;
  className?: string;
}

// Parse fields from JSON to typed structure
function parseFields(fields: Json): FormStep[] {
  if (!fields || !Array.isArray(fields)) {
    return [{
      title: 'Formular ausfüllen',
      fields: [],
    }];
  }

  // Check if fields is already in steps format or flat field array
  const firstItem = fields[0];
  if (firstItem && typeof firstItem === 'object' && 'title' in firstItem && 'fields' in firstItem) {
    return fields as unknown as FormStep[];
  }

  // Convert flat array to single step
  return [{
    title: 'Formular ausfüllen',
    fields: fields as unknown as FormField[],
  }];
}

export function FormWizard({ 
  templateId, 
  fields, 
  initialData = {}, 
  onComplete,
  onStepChange,
  className 
}: FormWizardProps) {
  const steps = parseFields(fields);
  const { draft, saveDraft, isSaving } = useFormDraft(templateId);
  
  const [currentStep, setCurrentStep] = useState(draft?.currentStep || 0);
  const [formData, setFormData] = useState<Record<string, unknown>>(
    draft?.data || initialData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load draft data on mount
  useEffect(() => {
    if (draft) {
      setFormData(draft.data);
      setCurrentStep(draft.currentStep);
    }
  }, [draft]);

  // Auto-save on data change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        saveDraft({ currentStep, data: formData });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, currentStep, saveDraft]);

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateStep = (): boolean => {
    const stepFields = currentStepData?.fields || [];
    const newErrors: Record<string, string> = {};

    stepFields.forEach((field) => {
      const value = formData[field.name];
      
      if (field.required && (value === undefined || value === '' || value === null)) {
        newErrors[field.name] = `${field.label} ist erforderlich`;
      }

      if (field.validation) {
        if (field.type === 'number' && typeof value === 'number') {
          if (field.validation.min !== undefined && value < field.validation.min) {
            newErrors[field.name] = field.validation.message || `Mindestens ${field.validation.min}`;
          }
          if (field.validation.max !== undefined && value > field.validation.max) {
            newErrors[field.name] = field.validation.message || `Maximal ${field.validation.max}`;
          }
        }

        if (field.validation.pattern && typeof value === 'string') {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            newErrors[field.name] = field.validation.message || 'Ungültiges Format';
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];

    const commonProps = {
      id: field.name,
      placeholder: field.placeholder,
      className: cn(error && "border-destructive"),
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={4}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.name}
              checked={(value as boolean) || false}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-sm font-normal cursor-pointer">
              {field.label}
            </Label>
          </div>
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Bitte wählen...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            step={field.step || 1}
            value={(value as number) || ''}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
          />
        );

      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        );
    }
  };

  if (!currentStepData) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          Keine Felder für dieses Formular konfiguriert.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Schritt {currentStep + 1} von {steps.length}
          </span>
          {isSaving && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Speichern...
            </span>
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
            {currentStepData.description && (
              <p className="text-sm text-muted-foreground mt-1">{currentStepData.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {currentStepData.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                {field.type !== 'checkbox' && (
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                )}
                {renderField(field)}
                {errors[field.name] && (
                  <p className="text-sm text-destructive">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>

        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Abschließen
            </>
          ) : (
            <>
              Weiter
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormTemplate } from '@/hooks/useFormTemplates';

interface FormPreviewProps {
  template: FormTemplate;
  formData: Record<string, unknown>;
  className?: string;
}

// Helper to replace placeholders in template
function renderTemplate(content: string, data: Record<string, unknown>): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    if (value === undefined || value === null || value === '') {
      return `[${key}]`;
    }
    return String(value);
  });
}

// Helper to format date for German locale
function formatDate(value: unknown): string {
  if (!value) return '';
  try {
    return new Date(String(value)).toLocaleDateString('de-DE');
  } catch {
    return String(value);
  }
}

// Default template content when none is provided
const DEFAULT_TEMPLATE = `
{{vermieter_name}}
{{vermieter_adresse}}

{{mieter_name}}
{{mieter_adresse}}

{{ort}}, den {{datum}}

Betreff: {{betreff}}

Sehr geehrte Damen und Herren,

{{inhalt}}

Mit freundlichen Grüßen,

{{unterschrift}}
`;

export function FormPreview({ template, formData, className }: FormPreviewProps) {
  const templateContent = template.template_content || DEFAULT_TEMPLATE;
  
  // Process the template with form data
  const renderedContent = renderTemplate(templateContent, formData);
  
  // Format dates in the content
  const formattedContent = renderedContent.replace(
    /(\d{4}-\d{2}-\d{2})/g,
    (match) => formatDate(match)
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-0">
        {/* Document header */}
        <div className="bg-muted/50 border-b p-4 flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium text-sm">{template.name}</h4>
            <p className="text-xs text-muted-foreground">Vorschau</p>
          </div>
        </div>

        {/* Document preview area - styled like A4 paper */}
        <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          <div 
            className="mx-auto bg-white dark:bg-card shadow-lg border rounded-sm"
            style={{ 
              maxWidth: '595px', // A4 width at 72dpi
              minHeight: '842px', // A4 height at 72dpi
              padding: '60px 50px',
              fontFamily: 'Georgia, serif',
              fontSize: '11px',
              lineHeight: '1.6',
            }}
          >
            <pre 
              className="whitespace-pre-wrap font-serif text-foreground"
              style={{ fontFamily: 'inherit' }}
            >
              {formattedContent}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

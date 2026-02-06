import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Home, 
  ArrowLeft, 
  Construction, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Loader2,
  Download,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useFormTemplate, FormStepDefinition } from '@/hooks/useFormTemplate'
import { DynamicField } from '@/components/wizard/DynamicField'
import { toast } from 'sonner'

export default function GenericForm() {
  const { slug } = useParams<{ slug: string }>()
  const { data: template, isLoading, error } = useFormTemplate(slug)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const hasFields = template?.fields && template.fields.length > 0
  const steps = template?.fields || []
  const totalSteps = steps.length
  const isLastStep = currentStep === totalSteps - 1
  const currentStepData = steps[currentStep]
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateCurrentStep = (): boolean => {
    if (!currentStepData) return true
    
    const newErrors: Record<string, string> = {}
    
    for (const field of currentStepData.fields) {
      if (field.required) {
        const value = formData[field.name]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.name] = `${field.label} ist erforderlich`
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (isLastStep) {
        handleSubmit()
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const handleSubmit = () => {
    // For now, just show success - later integrate PDF generation
    toast.success('Formular erfolgreich erstellt!', {
      description: 'Die PDF-Generierung wird in Kürze hinzugefügt.'
    })
    console.log('Form data:', formData)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link to="/formulare">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Formular nicht gefunden</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">
            Das Formular "{slug}" wurde nicht gefunden.
          </p>
          <Link to="/formulare">
            <Button>Zurück zur Übersicht</Button>
          </Link>
        </div>
      </div>
    )
  }

  // If no fields defined, show "Coming Soon" 
  if (!hasFields) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/formulare">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">{template.name}</h1>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              </div>
              <nav className="flex items-center gap-4">
                <Link to="/meine-dokumente">
                  <Button variant="ghost">Meine Dokumente</Button>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Construction className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl">{template.name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center gap-2">
                  {template.tier === 'premium' && <Badge>Premium</Badge>}
                  {template.tier === 'free' && <Badge variant="secondary">Gratis</Badge>}
                  {template.tier === 'basic' && <Badge variant="outline">Basic</Badge>}
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 font-medium mb-1">
                    Formular in Entwicklung
                  </p>
                  <p className="text-amber-700 text-sm">
                    Dieses Formular wird derzeit entwickelt und steht in Kürze zur Verfügung. 
                    Bitte schauen Sie später wieder vorbei oder nutzen Sie eines unserer 
                    bereits verfügbaren Formulare.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/formulare">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Alle Formulare ansehen
                    </Button>
                  </Link>
                  <Link to="/formulare/mietvertrag">
                    <Button className="w-full sm:w-auto">
                      Mietvertrag erstellen
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Dynamic wizard view
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/formulare">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{template.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    Schritt {currentStep + 1} von {totalSteps}
                  </p>
                </div>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/meine-dokumente">
                <Button variant="ghost">Meine Dokumente</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Step indicators */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => index < currentStep && setCurrentStep(index)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors
                  ${index === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index < currentStep 
                      ? 'bg-primary/20 text-primary cursor-pointer hover:bg-primary/30' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}
                disabled={index > currentStep}
              >
                {index < currentStep ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                )}
                {step.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Schritt {currentStep + 1}</Badge>
                {template.tier === 'free' && <Badge variant="secondary">Gratis</Badge>}
              </div>
              <CardTitle className="text-xl">{currentStepData?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStepData?.fields.map((field) => (
                <DynamicField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleFieldChange}
                  error={errors[field.name]}
                />
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            
            <Button onClick={handleNext}>
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Formular erstellen
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
      </div>
    </div>
  )
}

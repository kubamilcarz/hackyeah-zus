import { useStepProgression, STEPS, STEP_PATHS } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { ZusButton } from '@/components/ui/zus-button'
import { ResetLink } from './reset-button'

interface FlowNavigationProps {
  className?: string
  showProgress?: boolean
}

export function FlowNavigation({ className = '', showProgress = true }: FlowNavigationProps) {
  const router = useRouter()
  const {
    currentStep,
    completedSteps,
    nextStep,
    previousStep,
    completeCurrentStep
  } = useStepProgression()

  const handleNext = () => {
    completeCurrentStep()
    const nextStepNumber = currentStep + 1
    if (nextStepNumber <= 8) {
      nextStep()
      router.push(STEP_PATHS[nextStepNumber as keyof typeof STEP_PATHS])
    }
  }

  const handlePrevious = () => {
    const prevStepNumber = currentStep - 1
    if (prevStepNumber >= 1) {
      previousStep()
      router.push(STEP_PATHS[prevStepNumber as keyof typeof STEP_PATHS])
    }
  }

  const getStepName = (step: number) => {
    const names = {
      [STEPS.WELCOME]: 'Witaj',
      [STEPS.SIGNUP]: 'Rejestracja',
      [STEPS.FIRST_SURVEY]: 'Ankieta wstępna',
      [STEPS.MISSING_DATA]: 'Dane uzupełniające',
      [STEPS.ADD_SOURCES]: 'Źródła emerytalne',
      [STEPS.RESULT]: 'Wynik',
      [STEPS.SECOND_SURVEY]: 'Druga ankieta',
      [STEPS.DASHBOARD]: 'Panel'
    }
    return names[step as keyof typeof names] || `Krok ${step}`
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showProgress && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Krok {currentStep} z 8</span>
            <span className="text-sm text-gray-600">{getStepName(currentStep)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / 8) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <ZusButton
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Wstecz
          </ZusButton>
          
          {currentStep > 1 && (
            <ResetLink className="text-xs" />
          )}
        </div>

        <ZusButton
          onClick={handleNext}
          disabled={currentStep === 8}
        >
          {currentStep === 8 ? 'Zakończ' : 'Dalej'}
        </ZusButton>
      </div>
    </div>
  )
}

// Step indicator component for showing all steps
export function StepIndicator() {
  const { currentStep, completedSteps, canProceedToStep } = useStepProgression()
  const router = useRouter()

  const handleStepClick = (step: number) => {
    if (canProceedToStep(step)) {
      router.push(STEP_PATHS[step as keyof typeof STEP_PATHS])
    }
  }

  const getStepStatus = (step: number) => {
    if (completedSteps.includes(step)) return 'completed'
    if (step === currentStep) return 'current'
    if (canProceedToStep(step)) return 'available'
    return 'disabled'
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {Array.from({ length: 8 }, (_, i) => i + 1).map((step) => {
        const status = getStepStatus(step)
        const isClickable = status === 'available' || status === 'completed'

        return (
          <button
            key={step}
            onClick={() => handleStepClick(step)}
            disabled={!isClickable}
            className={`
              w-8 h-8 rounded-full text-sm font-medium transition-all duration-200
              ${status === 'completed' 
                ? 'bg-green-500 text-white' 
                : status === 'current'
                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                : status === 'available'
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {step}
          </button>
        )
      })}
    </div>
  )
}

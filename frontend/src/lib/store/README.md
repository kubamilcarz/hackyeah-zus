# State Management with Jotai

This project uses [Jotai](https://jotai.org/) for state management, implementing a unidirectional data flow architecture based on the user flow defined in `docs/flow.md`.

## Architecture Overview

### State Structure

The state is organized around the 8-step user flow:

1. **Welcome Screen** (`welcomeAtom`) - Expected retirement amount
2. **Signup** (`signupAtom`) - Demographics and employment data
3. **First Survey** (`quizAtom`) - Quiz data (currently ignored)
4. **Missing Data** (`missingDataAtom`) - Estimated amounts and medical leave
5. **Add Sources** (`retirementSourcesAtom`) - IKZE, IKE, PPK data
6. **Result** (`resultAtom`) - Calculation results
7. **Second Survey** (`quizAtom`) - Additional quiz data
8. **Dashboard** (`dashboardAtom`) - Dashboard state

### Key Files

- `src/lib/store/atoms.ts` - All Jotai atoms and state definitions
- `src/lib/store/hooks.ts` - Custom hooks for easier state management
- `src/lib/store/provider.tsx` - Jotai provider component
- `src/lib/store/index.ts` - Barrel exports

## Usage Examples

### Basic State Access

```tsx
import { useWelcomeForm, useSignupForm, useStepProgression } from '@/lib/store'

function MyComponent() {
  const { data, updateExpectedRetirement } = useWelcomeForm()
  const { data: signupData, updateField } = useSignupForm()
  const { currentStep, nextStep, completeCurrentStep } = useStepProgression()
  
  return (
    <div>
      <p>Current step: {currentStep}</p>
      <p>Expected retirement: {data.expectedRetirement}</p>
      <button onClick={() => updateExpectedRetirement(5000)}>
        Set retirement goal
      </button>
    </div>
  )
}
```

### Step Navigation

```tsx
import { useStepProgression, STEPS, STEP_PATHS } from '@/lib/store'

function NavigationExample() {
  const { 
    currentStep, 
    nextStep, 
    previousStep, 
    completeCurrentStep,
    canProceedToStep 
  } = useStepProgression()
  
  const handleNext = () => {
    completeCurrentStep() // Mark current step as done
    nextStep() // Move to next step
    router.push(STEP_PATHS[currentStep + 1])
  }
  
  return (
    <button 
      onClick={handleNext}
      disabled={currentStep >= 8}
    >
      Next Step
    </button>
  )
}
```

### Calculated Values

```tsx
import { useRetirementCalculation } from '@/lib/store'

function CalculationDisplay() {
  const calculation = useRetirementCalculation()
  
  if (!calculation) {
    return <p>Enter your data to see calculations</p>
  }
  
  return (
    <div>
      <p>Working years: {calculation.workingYears}</p>
      <p>Monthly contribution: {calculation.monthlyContribution} PLN</p>
      <p>Estimated pension: {calculation.estimatedMonthlyPension} PLN/month</p>
    </div>
  )
}
```

### Data Persistence

All main state atoms use `atomWithStorage` for automatic localStorage persistence:

- Data persists across browser sessions
- Each atom has a unique localStorage key (e.g., 'zus-welcome', 'zus-signup')
- Data is automatically restored on page refresh

### Form Integration

Each step has a corresponding form hook:

```tsx
// Welcome page
const { data, updateExpectedRetirement, isComplete } = useWelcomeForm()

// Signup page  
const { data, updateField, updateMultipleFields, isComplete } = useSignupForm()

// Missing data page
const { data, updateField, isComplete } = useMissingDataForm()

// Retirement sources page
const { data, updateSource, addCustomSource, removeSource } = useRetirementSourcesForm()
```

## State Flow

```
Welcome → Signup → FirstSurvey → MissingData → AddSources → Result → SecondSurvey → Dashboard
   ↓         ↓          ↓            ↓            ↓         ↓           ↓           ↓
Expected  Demographics Quiz       Estimated   IKZE/IKE   Results   Quiz2     Dashboard
Amount    & Salary     Data       Amounts     /PPK Data            Data      Data
```

## Components

### Flow Navigation

Use `FlowNavigation` component for consistent step navigation:

```tsx
import { FlowNavigation } from '@/components/flow/flow-navigation'

function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <FlowNavigation showProgress={true} />
    </div>
  )
}
```

### Step Indicator

Show all steps with `StepIndicator`:

```tsx
import { StepIndicator } from '@/components/flow/flow-navigation'

function Layout() {
  return (
    <div>
      <StepIndicator />
      {/* Page content */}
    </div>
  )
}
```

## Development Tools

### Debug Component

A debug component shows current state (visible in bottom-right in development):

```tsx
// Already included in layout.tsx
import { DataFlowDemo } from '@/components/debug/data-flow-demo'
```

### Reset State

For development/testing:

```tsx
import { useResetAllData } from '@/lib/store'

function DevTools() {
  const resetData = useResetAllData()
  
  return (
    <button onClick={() => resetData()}>
      Reset All Data
    </button>
  )
}
```

## TypeScript Support

All state is fully typed:

```tsx
interface SignupData {
  age?: number
  gender?: 'male' | 'female' | 'other'
  grossSalary?: number
  workStartYear?: number
  plannedRetirementYear?: number
  email?: string
  password?: string
}
```

## Best Practices

1. **Use form hooks** - Don't access atoms directly in components
2. **Complete steps** - Always call `completeCurrentStep()` before navigation
3. **Check step completion** - Use `canProceedToStep()` for navigation guards
4. **Persist important data** - Use `atomWithStorage` for data that should survive refreshes
5. **Keep calculations derived** - Use computed atoms for calculations based on user data

## Adding New State

1. Define the interface in `atoms.ts`
2. Create the atom with `atomWithStorage` 
3. Add to `userDataAtom` for combined access
4. Create form hook in `hooks.ts`
5. Export from `index.ts`

Example:

```tsx
// 1. Define interface
interface NewStepData {
  someField?: string
}

// 2. Create atom
export const newStepAtom = atomWithStorage<NewStepData>('zus-new-step', {})

// 3. Add to userDataAtom
export const userDataAtom = atom((get) => ({
  // ... existing fields
  newStep: get(newStepAtom),
}))

// 4. Create hook
export const useNewStepForm = () => {
  const [data, setData] = useAtom(newStepAtom)
  
  const updateField = (field: keyof NewStepData, value: any) => {
    setData({ ...data, [field]: value })
  }
  
  return { data, updateField }
}
```

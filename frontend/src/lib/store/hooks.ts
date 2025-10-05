"use client";
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  welcomeAtom,
  signupAtom,
  quizAtom,
  missingDataAtom,
  retirementSourcesAtom,
  resultAtom,
  dashboardAtom,
  currentStepAtom,
  completedStepsAtom,
  isStepCompletedAtom,
  canProceedToStepAtom,
  retirementCalculationAtom,
  userDataAtom,
  resetAllDataAtom,
  type SignupData,
  type MissingData,
  type RetirementSources
} from './atoms'

// Step navigation hooks
export const useCurrentStep = () => useAtom(currentStepAtom)
export const useCompletedSteps = () => useAtom(completedStepsAtom)
export const useIsStepCompleted = () => useAtomValue(isStepCompletedAtom)
export const useCanProceedToStep = () => useAtomValue(canProceedToStepAtom)

// Data hooks
export const useWelcomeData = () => useAtom(welcomeAtom)
export const useSignupData = () => useAtom(signupAtom)
export const useQuizData = () => useAtom(quizAtom)
export const useMissingData = () => useAtom(missingDataAtom)
export const useRetirementSources = () => useAtom(retirementSourcesAtom)
export const useResultData = () => useAtom(resultAtom)
export const useDashboardData = () => useAtom(dashboardAtom)

// Read-only hooks
export const useRetirementCalculation = () => useAtomValue(retirementCalculationAtom)
export const useUserData = () => useAtomValue(userDataAtom)

// Action hooks
export const useResetAllData = () => useSetAtom(resetAllDataAtom)

// Step progression helper
export const useStepProgression = () => {
  const [currentStep, setCurrentStep] = useCurrentStep()
  const [completedSteps, setCompletedSteps] = useCompletedSteps()
  const canProceedToStep = useCanProceedToStep()

  const completeCurrentStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 8) {
      setCurrentStep(step)
    }
  }

  const nextStep = () => {
    completeCurrentStep()
    const next = currentStep + 1
    if (next <= 8) { // Max 8 steps based on flow
      setCurrentStep(next)
    }
  }

  const previousStep = () => {
    const prev = currentStep - 1
    if (prev >= 1) {
      setCurrentStep(prev)
    }
  }

  return {
    currentStep,
    completedSteps,
    completeCurrentStep,
    goToStep,
    nextStep,
    previousStep,
    canProceedToStep
  }
}

// Form data helpers
export const useWelcomeForm = () => {
  const [data, setData] = useWelcomeData()
  
  const updateExpectedRetirement = (expectedRetirement: number) => {
    setData({ ...data, expectedRetirement })
  }

  return {
    data,
    updateExpectedRetirement,
    isComplete: Boolean(data.expectedRetirement && data.expectedRetirement > 0)
  }
}

export const useSignupForm = () => {
  const [data, setData] = useSignupData()
  
  const updateField = (field: keyof SignupData, value: SignupData[keyof SignupData]) => {
    setData({ ...data, [field]: value })
  }

  const updateMultipleFields = (fields: Partial<SignupData>) => {
    setData({ ...data, ...fields })
  }

  const isComplete = Boolean(
    data.age && 
    data.gender && 
    data.grossSalary && 
    data.workStartYear && 
    data.plannedRetirementYear &&
    data.email
  )

  return {
    data,
    updateField,
    updateMultipleFields,
    isComplete
  }
}

export const useMissingDataForm = () => {
  const [data, setData] = useMissingData()
  
  const updateField = (field: keyof MissingData, value: MissingData[keyof MissingData]) => {
    setData({ ...data, [field]: value })
  }

  const isComplete = Boolean(
    data.mainAccountAmount !== undefined || 
    data.subAccountAmount !== undefined
  )

  return {
    data,
    updateField,
    isComplete
  }
}

export const useRetirementSourcesForm = () => {
  const [data, setData] = useRetirementSources()
  
  const updateSource = (source: keyof RetirementSources, value: number) => {
    setData({ ...data, [source]: value })
  }

  const addCustomSource = (name: string, value: number) => {
    setData({ ...data, [name]: value })
  }

  const removeSource = (source: string) => {
    const newData = { ...data }
    delete newData[source]
    setData(newData)
  }

  return {
    data,
    updateSource,
    addCustomSource,
    removeSource
  }
}

// Flow constants
export const STEPS = {
  WELCOME: 1,
  SIGNUP: 2,
  FIRST_SURVEY: 3,
  MISSING_DATA: 4,
  ADD_SOURCES: 5,
  RESULT: 6,
  SECOND_SURVEY: 7,
  DASHBOARD: 8
} as const

export const STEP_PATHS = {
  [STEPS.WELCOME]: '/',
  [STEPS.SIGNUP]: '/signup',
  [STEPS.FIRST_SURVEY]: '/firstSurvey',
  [STEPS.MISSING_DATA]: '/missingData',
  [STEPS.ADD_SOURCES]: '/addSources',
  [STEPS.RESULT]: '/result',
  [STEPS.SECOND_SURVEY]: '/secondSurvey',
  [STEPS.DASHBOARD]: '/dashboard'
} as const

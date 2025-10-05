import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// Types for our data flow
export interface WelcomeData {
  expectedRetirement?: number
}

export interface SignupData {
  age?: number
  gender?: 'male' | 'female' | 'other'
  grossSalary?: number
  workStartYear?: number
  plannedRetirementYear?: number
  email?: string
  password?: string
}

export interface QuizData {
  // This can be ignored for now based on flow.md
  firstQuizAnswers?: Record<string, unknown>
  secondQuizAnswers?: Record<string, unknown>
}

export interface MissingData {
  mainAccountAmount?: number      // Konto główne
  subAccountAmount?: number       // Subkonto (wraz z OFE)
  medicalLeaveDays?: number
}

export interface RetirementSources {
  ikze?: number
  ike?: number
  ppk?: number
  [key: string]: number | undefined
}

export interface ResultData {
  projection?: {
    monthlyPension?: number
    totalContributions?: number
    workingYears?: number
  }
  postalCode?: string
}

export interface DashboardData {
  // WIP data from dashboard
  [key: string]: unknown
}

// Atoms with localStorage persistence for the main flow data
export const welcomeAtom = atomWithStorage<WelcomeData>('zus-welcome', {})
export const signupAtom = atomWithStorage<SignupData>('zus-signup', {})
export const quizAtom = atomWithStorage<QuizData>('zus-quiz', {})
export const missingDataAtom = atomWithStorage<MissingData>('zus-missing-data', {})
export const retirementSourcesAtom = atomWithStorage<RetirementSources>('zus-retirement-sources', {})
export const resultAtom = atomWithStorage<ResultData>('zus-result', {})
export const dashboardAtom = atomWithStorage<DashboardData>('zus-dashboard', {})

// Flow control atoms
export const currentStepAtom = atomWithStorage<number>('zus-current-step', 1)
export const completedStepsAtom = atomWithStorage<number[]>('zus-completed-steps', [])

// Derived atoms for calculations
export const isStepCompletedAtom = atom((get) => (step: number) => {
  const completedSteps = get(completedStepsAtom)
  return completedSteps.includes(step)
})

export const canProceedToStepAtom = atom((get) => (targetStep: number) => {
  const completedSteps = get(completedStepsAtom)
  // Can proceed if previous step is completed
  return targetStep === 1 || completedSteps.includes(targetStep - 1)
})

// Computed data atoms
export const retirementCalculationAtom = atom((get) => {
  const signup = get(signupAtom)
  const sources = get(retirementSourcesAtom)
  
  // Basic calculation logic (this can be expanded)
  if (!signup.grossSalary || !signup.workStartYear || !signup.plannedRetirementYear) {
    return null
  }
  
  const workingYears = signup.plannedRetirementYear - signup.workStartYear
  const monthlyContribution = signup.grossSalary * 0.1976 // ZUS contribution rate
  const totalContributions = monthlyContribution * 12 * workingYears
  
  const additionalSources = Object.values(sources).reduce((sum, value) => (sum || 0) + (value || 0), 0)
  
  return {
    workingYears,
    monthlyContribution,
    totalContributions,
    additionalSources,
    estimatedMonthlyPension: (totalContributions + (additionalSources || 0)) / (signup.age ? (85 - signup.age) : 20) / 12
  }
})

// Combined user data atom for easy access
export const userDataAtom = atom((get) => ({
  welcome: get(welcomeAtom),
  signup: get(signupAtom),
  quiz: get(quizAtom),
  missingData: get(missingDataAtom),
  retirementSources: get(retirementSourcesAtom),
  result: get(resultAtom),
  dashboard: get(dashboardAtom),
  currentStep: get(currentStepAtom),
  completedSteps: get(completedStepsAtom),
  calculation: get(retirementCalculationAtom)
}))

// Reset atom for clearing all data
export const resetAllDataAtom = atom(null, (get, set) => {
  set(welcomeAtom, {})
  set(signupAtom, {})
  set(quizAtom, {})
  set(missingDataAtom, {})
  set(retirementSourcesAtom, {})
  set(resultAtom, {})
  set(dashboardAtom, {})
  set(currentStepAtom, 1)
  set(completedStepsAtom, [])
  
  // Also clear localStorage to ensure clean reset
  if (typeof window !== 'undefined') {
    localStorage.removeItem('zus-welcome')
    localStorage.removeItem('zus-signup')
    localStorage.removeItem('zus-quiz')
    localStorage.removeItem('zus-missing-data')
    localStorage.removeItem('zus-retirement-sources')
    localStorage.removeItem('zus-result')
    localStorage.removeItem('zus-dashboard')
    localStorage.removeItem('zus-current-step')
    localStorage.removeItem('zus-completed-steps')
  }
})

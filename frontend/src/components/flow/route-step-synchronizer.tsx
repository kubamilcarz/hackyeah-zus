"use client";

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useStepProgression, STEP_PATHS, STEPS } from '@/lib/store'

// Map paths to steps
const PATH_TO_STEP: Record<string, number> = {
  [STEP_PATHS[STEPS.WELCOME]]: STEPS.WELCOME,
  [STEP_PATHS[STEPS.SIGNUP]]: STEPS.SIGNUP,
  [STEP_PATHS[STEPS.FIRST_SURVEY]]: STEPS.FIRST_SURVEY,
  [STEP_PATHS[STEPS.MISSING_DATA]]: STEPS.MISSING_DATA,
  [STEP_PATHS[STEPS.ADD_SOURCES]]: STEPS.ADD_SOURCES,
  [STEP_PATHS[STEPS.RESULT]]: STEPS.RESULT,
  [STEP_PATHS[STEPS.SECOND_SURVEY]]: STEPS.SECOND_SURVEY,
  [STEP_PATHS[STEPS.DASHBOARD]]: STEPS.DASHBOARD,
}

export function RouteStepSynchronizer() {
  const pathname = usePathname()
  const { currentStep, goToStep } = useStepProgression()

  useEffect(() => {
    const stepForPath = PATH_TO_STEP[pathname]
    if (stepForPath && stepForPath !== currentStep) {
      goToStep(stepForPath)
    }
  }, [pathname, currentStep, goToStep])

  return null // This is a logic-only component
}

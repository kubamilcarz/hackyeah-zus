"use client";

import { useStepProgression, STEP_PATHS } from '@/lib/store'
import { useRouter } from 'next/navigation'

export function BackButton() {
  const { currentStep, previousStep } = useStepProgression()
  const router = useRouter()

  // Don't show back button on step 1
  if (currentStep <= 1) {
    return null
  }

  const handleBack = () => {
    const prevStepNumber = currentStep - 1
    if (prevStepNumber >= 1) {
      previousStep()
      router.push(STEP_PATHS[prevStepNumber as keyof typeof STEP_PATHS])
    }
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-50 transition-colors"
      title="Wróć do poprzedniego kroku"
      aria-label="Wróć do poprzedniego kroku"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="transform"
      >
        <path d="M19 12H5"/>
        <path d="M12 19l-7-7 7-7"/>
      </svg>
      <span 
        className="text-sm font-medium hidden sm:inline"
        style={{ 
          fontSize: `calc(0.875rem * var(--font-scale))`,
          color: 'rgb(var(--color-text))'
        }}
      >
        Wstecz
      </span>
    </button>
  )
}

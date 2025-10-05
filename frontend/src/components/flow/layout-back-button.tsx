"use client";

import { useStepProgression, STEP_PATHS } from '@/lib/store'
import { useRouter } from 'next/navigation'

export function LayoutBackButton() {
  const { currentStep, previousStep } = useStepProgression()
  const router = useRouter()

  // Only show back button when we're on step 2 or higher
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
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
      aria-label="Wróć do poprzedniego kroku"
      title="Wróć do poprzedniego kroku"
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
        <path d="m12 19-7-7 7-7"/>
      </svg>
      <span 
        className="hidden sm:inline text-sm font-medium"
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

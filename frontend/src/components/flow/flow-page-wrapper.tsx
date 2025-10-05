"use client";

import { StepIndicator } from './flow-navigation'
import { useStepProgression } from '@/lib/store'

interface FlowPageWrapperProps {
  children: React.ReactNode
  showStepIndicator?: boolean
  className?: string
}

export function FlowPageWrapper({ 
  children, 
  showStepIndicator = true,
  className = "" 
}: FlowPageWrapperProps) {
  const { currentStep } = useStepProgression()

  return (
    <div className={`min-h-screen ${className}`}>
      {showStepIndicator && currentStep > 1 && (
        <div className="w-full bg-gray-50 border-b">
          <div className="max-w-6xl mx-auto">
            <StepIndicator />
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

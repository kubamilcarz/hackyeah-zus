"use client";

import { useResetAllData, useStepProgression } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { ZusButton } from '@/components/ui/zus-button'

interface ResetButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  children?: React.ReactNode
  className?: string
  confirmMessage?: string
  redirectTo?: string
}

export function ResetButton({ 
  variant = 'secondary', 
  size = 'md',
  children = 'Zacznij od nowa',
  className = '',
  confirmMessage = 'Czy na pewno chcesz zacząć od nowa? Wszystkie wprowadzone dane zostaną utracone.',
  redirectTo = '/'
}: ResetButtonProps) {
  const resetAllData = useResetAllData()
  const { goToStep } = useStepProgression()
  const router = useRouter()

  const handleReset = () => {
    const confirmed = window.confirm(confirmMessage)
    
    if (confirmed) {
      // Reset all data
      resetAllData()
      
      // Go back to step 1
      goToStep(1)
      
      // Redirect to home or specified page
      router.push(redirectTo)
    }
  }

  return (
    <ZusButton
      variant={variant}
      size={size}
      onClick={handleReset}
      className={className}
    >
      {children}
    </ZusButton>
  )
}

// Subtle reset link version
export function ResetLink({ 
  children = 'Zacznij od nowa',
  className = '',
  confirmMessage = 'Czy na pewno chcesz zacząć od nowa? Wszystkie wprowadzone dane zostaną utracone.',
  redirectTo = '/'
}: Omit<ResetButtonProps, 'variant' | 'size'>) {
  const resetAllData = useResetAllData()
  const { goToStep } = useStepProgression()
  const router = useRouter()

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault()
    const confirmed = window.confirm(confirmMessage)
    
    if (confirmed) {
      resetAllData()
      goToStep(1)
      router.push(redirectTo)
    }
  }

  return (
    <button
      onClick={handleReset}
      className={`text-sm underline hover:no-underline transition-all ${className}`}
      style={{ 
        color: 'rgb(var(--color-text) / 0.7)',
        fontSize: `calc(0.875rem * var(--font-scale))`
      }}
    >
      {children}
    </button>
  )
}

// Icon-only reset button for compact spaces
export function ResetIconButton({ 
  className = '',
  confirmMessage = 'Czy na pewno chcesz zacząć od nowa?',
  redirectTo = '/'
}: Pick<ResetButtonProps, 'className' | 'confirmMessage' | 'redirectTo'>) {
  const resetAllData = useResetAllData()
  const { goToStep } = useStepProgression()
  const router = useRouter()

  const handleReset = () => {
    const confirmed = window.confirm(confirmMessage)
    
    if (confirmed) {
      resetAllData()
      goToStep(1)
      router.push(redirectTo)
    }
  }

  return (
    <button
      onClick={handleReset}
      className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${className}`}
      title="Zacznij od nowa"
      aria-label="Zacznij od nowa"
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
    </button>
  )
}

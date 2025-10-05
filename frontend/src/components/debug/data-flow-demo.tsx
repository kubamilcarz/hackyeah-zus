"use client";
import { useUserData, useRetirementCalculation, useResetAllData } from '@/lib/store'

export function DataFlowDemo() {
  const userData = useUserData()
  const calculation = useRetirementCalculation()
  const resetAllData = useResetAllData()

  if (!userData.welcome.expectedRetirement && !userData.signup.age) {
    return null
  }

  return (
    <div 
      className="fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg border z-50 opacity-50 hover:opacity-100 transition-opacity pointer-events-auto"
      style={{
        backgroundColor: 'rgb(var(--color-card))',
        borderColor: 'rgb(var(--color-accent) / 0.3)',
        color: 'rgb(var(--color-text))'
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-sm">State Demo</h4>
        <button
          onClick={() => resetAllData()}
          className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
          title="Reset all data"
        >
          Reset
        </button>
      </div>
      <div className="text-xs space-y-1">
        <div>
          <strong>Current Step:</strong> {userData.currentStep}
        </div>
        {userData.welcome.expectedRetirement && (
          <div>
            <strong>Expected Retirement:</strong> {userData.welcome.expectedRetirement} PLN
          </div>
        )}
        {userData.signup.age && (
          <div>
            <strong>Age:</strong> {userData.signup.age}
          </div>
        )}
        {userData.signup.grossSalary && (
          <div>
            <strong>Salary:</strong> {userData.signup.grossSalary} PLN
          </div>
        )}
        {calculation && (
          <div>
            <strong>Calculated Pension:</strong> {Math.round(calculation.estimatedMonthlyPension)} PLN/mo
          </div>
        )}
        <div>
          <strong>Completed Steps:</strong> {userData.completedSteps.join(', ') || 'None'}
        </div>
      </div>
    </div>
  )
}

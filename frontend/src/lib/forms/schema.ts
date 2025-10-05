import { z } from "zod"

// Existing form schemas (if any)

// Types for dashboard data structure - ensure all components receive properly typed data
export interface UserPersonalInfo {
  name: string
  age: number
  currentSalary: number
  retirementAge: number
  profession?: string
  workYears?: number
}

export interface PensionData {
  currentContributions: number
  projectedPension: number
  additionalSavings: number
  monthlyContributions?: number
  estimatedRetirementIncome?: number
}

export interface RiskScenario {
  name: string
  probability: number
  impact: number
  description?: string
}

export interface RiskProfile {
  level: 'conservative' | 'moderate' | 'aggressive'
  scenarios: RiskScenario[]
  riskTolerance?: number
}

export interface UserData {
  personalInfo: UserPersonalInfo
  pensionData: PensionData
  riskProfile: RiskProfile
}

// Mock data factory functions for consistent data generation
export function createMockUserData(): UserData {
  return {
    personalInfo: {
      name: "Jan Kowalski",
      age: 35,
      currentSalary: 8500,
      retirementAge: 67,
      profession: "Analityk IT",
      workYears: 12
    },
    pensionData: {
      currentContributions: 1700,
      projectedPension: 3200,
      additionalSavings: 50000,
      monthlyContributions: 500,
      estimatedRetirementIncome: 4200
    },
    riskProfile: {
      level: 'moderate',
      riskTolerance: 6,
      scenarios: [
        { 
          name: 'Kryzys ekonomiczny', 
          probability: 0.2, 
          impact: -0.3,
          description: 'Spadek wartości inwestycji o 30%'
        },
        { 
          name: 'Stabilny wzrost', 
          probability: 0.6, 
          impact: 0.05,
          description: 'Regularny wzrost inwestycji 5% rocznie'
        },
        { 
          name: 'Boom gospodarczy', 
          probability: 0.2, 
          impact: 0.15,
          description: 'Znaczny wzrost wartości inwestycji'
        }
      ]
    }
  }
};
export const simSchema = z.object({
  age: z.number().int().min(16).max(80),
  sex: z.enum(["F","M", "O"]),
  grossSalary: z.number().min(0),
  workStartYear: z.number().int(),
  retireYear: z.number().int(),
  includeSickLeave: z.boolean(),
  includeIKZE: z.boolean().optional(),
  includePPK: z.boolean().optional(),
});
export type SimInput = z.infer<typeof simSchema>;
"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ZusText, ZusButton, ZusInput, ZusSelect } from "@/components/ui/";
import { PueLoginPanel } from "@/components/pue/pue-panel";
import { useSignupForm, useStepProgression } from "@/lib/store";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 70 }, (_, i) => currentYear - i).reverse();
const RETIRE_YEARS = Array.from({ length: 60 }, (_, i) => currentYear + i);

export default function SignUpFormPage() {
  const router = useRouter();
  const { data: signupData, updateField, updateMultipleFields } = useSignupForm();
  const { completeCurrentStep, nextStep, currentStep } = useStepProgression();

  // Initialize with default values if not set
  useEffect(() => {
    if (!signupData.age) {
      updateMultipleFields({
        age: 30,
        gender: 'male',
        grossSalary: 9000,
        workStartYear: currentYear - 6,
        plannedRetirementYear: currentYear + 35
      });
    }
  }, [signupData.age, updateMultipleFields]);

  // Ensure we're on the correct step
  useEffect(() => {
    if (currentStep !== 2) {
    }
  }, [currentStep]);

  // Salary: keep arrows stepping by 500 (typing freeform still allowed)
  const onSalaryKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? 500 : -500;
        const currentSalary = signupData.grossSalary || 0;
        const newSalary = Math.max(0, Math.round((currentSalary + delta) / 500) * 500);
        updateField('grossSalary', newSalary);
      }
    },
    [signupData.grossSalary, updateField]
  );

  const onSalaryChange = useCallback(
    (valueStr: string) => {
      const raw = Number(valueStr.replace(/\s/g, "").replace(",", "."));
      updateField('grossSalary', Number.isFinite(raw) ? raw : 0);
    },
    [updateField]
  );

  const isValid = useMemo(() => {
    return (
      Number.isFinite(signupData.age) &&
      signupData.age! >= 16 &&
      (signupData.gender === "female" || signupData.gender === "male") &&
      Number.isFinite(signupData.grossSalary) &&
      signupData.grossSalary! >= 0 &&
      Number.isFinite(signupData.workStartYear) &&
      Number.isFinite(signupData.plannedRetirementYear) &&
      signupData.plannedRetirementYear! > signupData.workStartYear!
    );
  }, [signupData]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    
    completeCurrentStep();
    nextStep();
    router.push('/firstSurvey');
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto py-12 px-4">
      <form onSubmit={onSubmit} noValidate className="bg-zus-card rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-17">
          {/* LEFT: Demographics */}
          <div className="p-6 md:p-8 flex flex-col gap-8 md:col-span-8">
            <div className="flex flex-col">
              <h2 className="mt-2 text-xl leading-7 font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.375rem * var(--font-scale))` }}>
                Twoje dane
              </h2>

              <ZusText className="mt-2 text-neutral-600">
                Wypełnij podstawowe informacje demograficzne. Te dane pomogą nam
                lepiej dopasować prognozę i porównania kontekstowe.
              </ZusText>
            </div>

            <div className="flex flex-row gap-4">
              <div className="flex flex-col items-stretch flex-1">
                {/* Age */}
                <ZusInput
                  id="age"
                  label="Wiek"
                  type="number"
                  min={16}
                  max={80}
                  step={1}
                  value={signupData.age || 30}
                  onChange={(e) => updateField('age', parseInt(e.target.value || "0", 10))}
                  required
                  hintAction={{
                    label: "Minimalny wiek: 16 lat.",
                    onClick: (e) => e.preventDefault(),
                  }}
                />
              </div>

            <ZusSelect
                options={[
                { value: "female", label: "Kobieta" },
                { value: "male", label: "Mężczyzna" },
                ]}
                label="Płeć"
                value={signupData.gender || "male"}
                onChange={(value) => updateField('gender', value as 'male' | 'female')}
                className="flex-1"
            />
            </div>

            {/* Salary */}
            <ZusInput
              id="salary"
              label="Pensja brutto (PLN / m-c)"
              type="number"
              min={0}
              step={500}
              value={Number.isFinite(signupData.grossSalary) ? signupData.grossSalary : 0}
              onChange={(e) => onSalaryChange(e.target.value)}
              onKeyDown={onSalaryKeyDown}
              aria-describedby="salary-help"
              required
              hintAction={{
                label: "trzałki ↑/↓ zmieniają kwotę o 500.",
                onClick: (e) => e.preventDefault(),
              }}
            />

            {/* Work start year (picker left as native select for now) */}
            <div>
              <label
                htmlFor="startYear"
                className="block text-sm font-medium text-neutral-800"
                style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}
              >
                Rok rozpoczęcia pracy
              </label>
              <ZusSelect
                options={YEARS.map((y) => ({
                  value: y.toString(),
                  label: y.toString(),
                }))}
                id="startYear"
                value={signupData.workStartYear || currentYear - 6}
                onChange={(value) => updateField('workStartYear', parseInt(value, 10))}
              />
            </div>

            {/* Planned retirement year (picker left as native select for now) */}
            <div>
              <label
                htmlFor="retireYear"
                className="block text-sm font-medium text-neutral-800"
                style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}
              >
                Planowany rok przejścia na emeryturę
              </label>
              <ZusSelect
                options={RETIRE_YEARS.map((y) => ({
                  value: y.toString(),
                  label: y.toString(),
                }))}
                id="retireYear"
                value={signupData.plannedRetirementYear || currentYear + 35}
                onChange={(value) => updateField('plannedRetirementYear', parseInt(value, 10))}
                hintText="Musi być później niż rok rozpoczęcia pracy."
              />
            </div>

            <ZusButton type="submit" className="mt-6 w-40 ml-auto">
              Kontynuuj
            </ZusButton>
          </div>

          {/* Divider with "LUB" */}
          <div className="flex flex-col items-center justify-center my-6 md:col-span-1">
            <div className="w-px h-20 bg-gray-300"></div>
            <span className="py-4 text-sm text-gray-500 font-medium" style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}>LUB</span>
            <div className="w-px h-20 bg-gray-300"></div>
          </div>

          <div className="md:col-span-8">
            <PueLoginPanel />
          </div>
        </div>
      </form>
    </div>
  );
}

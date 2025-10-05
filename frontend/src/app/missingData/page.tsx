"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ZusText, ZusButton } from "@/components/zus-ui";
import { ZusInput } from "@/components/ui/zus-input";
import { useMissingDataForm, useSignupForm, useStepProgression } from "@/lib/store";

// Rough % for emerytalna składka (employee+employer); purely indicative for the UI hint.
const PENSION_RATE = 0.1952;

function monthsSinceStartYear(startYear: number) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1..12
  const totalNow = y * 12 + m;
  const totalStart = startYear * 12 + 1; // assume Jan of start year
  return Math.max(0, totalNow - totalStart);
}

export default function ExtraDataPage() {
  const router = useRouter();
  const { data: signupData } = useSignupForm();
  const { data: missingData, updateField } = useMissingDataForm();
  const { completeCurrentStep, nextStep } = useStepProgression();

  // Get data from signup step
  const salary = signupData.grossSalary || 9000;
  const startYear = signupData.workStartYear || new Date().getFullYear() - 6;

  // --- local state
  const [useEstimatedFunds, setUseEstimatedFunds] = useState<boolean>(true);
  const [fundsNow, setFundsNow] = useState<number | "">("");
  const [sickDays12m, setSickDays12m] = useState<number | "">(missingData.medicalLeaveDays || "");

  const estimatedFunds = useMemo(() => {
    if (!Number.isFinite(salary) || !Number.isFinite(startYear)) return 0;
    const months = monthsSinceStartYear(startYear);
    // extremely rough: gross * months * 19.52%
    return Math.max(0, Math.round(salary * months * PENSION_RATE));
  }, [salary, startYear]);

  const isValid = useMemo(() => {
    // Nothing is strictly required here. We allow skipping.
    // If not using estimate, require a non-negative number for funds.
    if (!useEstimatedFunds) {
      return (
        fundsNow !== "" &&
        Number.isFinite(Number(fundsNow)) &&
        Number(fundsNow) >= 0
      );
    }
    return true;
  }, [useEstimatedFunds, fundsNow]);

  function goPredict() {
    // Save data to state
    updateField('estimatedAmount', useEstimatedFunds ? estimatedFunds : Number(fundsNow || 0));
    updateField('medicalLeaveDays', Number(sickDays12m || 0));
    
    // Complete step and navigate
    completeCurrentStep();
    nextStep();
    router.push('/addSources');
  }

  function skipAndUseEstimates() {
    // Save estimated data to state
    updateField('estimatedAmount', estimatedFunds);
    updateField('medicalLeaveDays', 0);
    
    // Complete step and navigate
    completeCurrentStep();
    nextStep();
    router.push('/addSources');
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4">
    <div className="bg-zus-card rounded-2xl">
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h2 className="mt-2 text-xl leading-7 font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.375rem * var(--font-scale))` }}>
            Dane uzupełniające
          </h2>
          <ZusText variant="body" className="mt-2">
            Te informacje zwykle nie są wprost dostępne w PUE ZUS. Podaj je, aby
            poprawić dokładność prognozy. Jeśli ich nie znasz – możemy użyć
            prostych szacunków na podstawie Twojej pensji i stażu pracy.
          </ZusText>
        </div>

        {/* Info message about PUE/EZUS data */}
        <div className="bg-zus-bg border rounded-lg p-4" style={{ borderColor: `rgb(var(--color-accent) / 0.3)` }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: `rgb(var(--color-accent))` }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium" style={{ fontSize: `calc(0.875rem * var(--font-scale))`, color: `rgb(var(--color-text))` }}>
                Informacja o danych
              </h3>
              <ZusText variant="small" className="mt-1 opacity-80">
                Te dane musisz zaczytać ze swojego konta PUE ZUS lub eZUS. Jeśli nie masz dostępu 
                do tych informacji, możesz skorzystać z naszych szacunków opartych na podanych wcześniej danych.
              </ZusText>
            </div>
          </div>
        </div>

        {/* Funds now – progressive disclosure, unified button styles */}
        <div className="bg-zus-bg p-4 rounded-md space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="fundsNow"
              className="block text-sm font-bold text-neutral-800"
              style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}
            >
              Zgromadzone środki (PLN)
            </label>

            {useEstimatedFunds ? (
              <ZusButton
                variant="ghost"
                size="small"
                type="button"
                onClick={() => {
                  setUseEstimatedFunds(false);
                  setFundsNow(estimatedFunds);
                }}
                aria-controls="funds-manual"
                aria-expanded="false"
              >
                Zmień
              </ZusButton>
            ) : (
              <ZusButton
                variant="ghost"
                size="small"
                type="button"
                onClick={() => setUseEstimatedFunds(true)}
                aria-controls="funds-estimate"
                aria-expanded="false"
              >
                Użyj szacunku
              </ZusButton>
            )}
          </div>

          {useEstimatedFunds ? (
            <div id="funds-estimate" className="space-y-2">
              <p className="text-base leading-6 text-neutral-800" style={{ fontSize: `calc(0.9375rem * var(--font-scale))` }}>
                Szacowana kwota:{" "}
                <span className="font-semibold">
                  {new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                    maximumFractionDigits: 0,
                  }).format(estimatedFunds)}
                </span>
              </p>

              <details className="text-sm text-neutral-700" style={{ fontSize: `calc(0.8125rem * var(--font-scale))` }}>
                <summary className="cursor-pointer select-none">
                  Jak to policzyliśmy?
                </summary>
                <div className="mt-1">
                  Prosta metoda:{" "}
                  <code>pensja × liczba miesięcy pracy × 19,52%</code>. To
                  orientacyjna wartość — dokładne dane pobierzemy z eZUS po
                  zalogowaniu.
                </div>
              </details>
            </div>
          ) : (
            <div id="funds-manual" className="space-y-2">
              <ZusInput
                id="fundsNow"
                label="Wpisz łączną kwotę (PLN)"
                type="number"
                min={0}
                step={100}
                value={fundsNow === "" ? "" : String(fundsNow)}
                onChange={(e) =>
                  setFundsNow(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-64"
              />
              <p className="zus-text-small mt-1 text-gray-700">
                Jeśli nie podasz kwoty, użyjemy prostego szacunku.
              </p>
            </div>
          )}
        </div>

        {/* Sick leaves */}
        <div className="bg-zus-bg p-4 rounded-md space-y-3">
  <div className="flex items-center justify-between gap-4">
    <label htmlFor="sickDays12m" className="block text-sm font-bold text-neutral-800" style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}>
      Zwolnienia lekarskie (dni, ostatnie 12 mies.)
    </label>

    {sickDays12m === "" ? (
      <ZusButton
        variant="ghost"
        size="small"
        type="button"
        onClick={() => setSickDays12m(0)} // prefill when entering edit mode
        aria-controls="sickdays-edit"
        aria-expanded="false"
      >
        Dodaj
      </ZusButton>
    ) : (
      <ZusButton
        variant="ghost"
        size="small"
        type="button"
        onClick={() => setSickDays12m("")}
        aria-controls="sickdays-view"
        aria-expanded="false"
      >
        Nie podawaj
      </ZusButton>
    )}
  </div>

  {sickDays12m === "" ? (
    <div id="sickdays-view" className="space-y-2">
      <p className="text-base leading-6 text-neutral-800" style={{ fontSize: `calc(0.9375rem * var(--font-scale))` }}>Nie podano</p>
      <details className="text-sm text-neutral-700" style={{ fontSize: `calc(0.8125rem * var(--font-scale))` }}>
        <summary className="cursor-pointer select-none">Do czego tego użyjemy?</summary>
        <div className="mt-1">
          Liczba dni L4 pomaga dokładniej odwzorować historię składek i świadczeń.
          Jeśli pominiesz, użyjemy wartości domyślnej (0 dni).
        </div>
      </details>
    </div>
  ) : (
    <div id="sickdays-edit" className="space-y-2">
      <ZusInput
        id="sickDays12m"
        label="Liczba dni"
        type="number"
        min={0}
        step={1}
        value={String(sickDays12m)}
        onChange={(e) => setSickDays12m(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-40"
      />
      <p className="zus-text-small text-gray-700">
        Pole opcjonalne — zostaw puste, jeśli nie wiesz.
      </p>
    </div>
  )}
</div>
        {/* Big CTA */}
        <div className="flex flex-row gap-4 items-center">
          <ZusButton
            type="button"
            variant="ghost"
            className="w-full h-12 text-[15px]"
            onClick={skipAndUseEstimates}
            disabled={!isValid}
            aria-disabled={!isValid}
          >
            Pomiń i użyj szacunków
          </ZusButton>

          <ZusButton
            type="button"
            variant="primary"
            className="w-full h-12 text-[15px]"
            onClick={goPredict}
            disabled={!isValid}
            aria-disabled={!isValid}
          >
            Zaprognozuj moją przyszłą emeryturę
          </ZusButton>
        </div>
      </div>
    </div>
    </div>
  );
}

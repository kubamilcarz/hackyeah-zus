"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ZusText, ZusButton } from "@/components/zus-ui";
import { ZusInput } from "@/components/ui/zus-input";

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
  const params = useSearchParams();

  // read prior screen (best-effort)
  const age = Number(params.get("age") ?? "30");
  const sex = params.get("sex") ?? "M";
  const salary = Number(params.get("grossSalary") ?? "9000");
  const startYear = Number(
    params.get("workStartYear") ?? `${new Date().getFullYear() - 6}`
  );
  const retireYear = Number(
    params.get("retireYear") ?? `${new Date().getFullYear() + 35}`
  );

  // --- local state
  const [useEstimatedFunds, setUseEstimatedFunds] = useState<boolean>(true);
  const [fundsNow, setFundsNow] = useState<number | "">("");
  const [sickDays12m, setSickDays12m] = useState<number | "">("");

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
    const q = new URLSearchParams({
      age: String(age),
      sex,
      grossSalary: String(Math.round(Number(salary))),
      workStartYear: String(startYear),
      retireYear: String(retireYear),
      // extras
      fundsNow: String(
        useEstimatedFunds ? estimatedFunds : Math.round(Number(fundsNow || 0))
      ),
      fundsSource: useEstimatedFunds ? "estimated" : "user",
      sickDays12m: String(Number(sickDays12m || 0)),
    });
    router.push(`/addSources?${q.toString()}`);
  }

  function skipAndUseEstimates() {
    // Force estimates + zero sick days if user wants to skip
    const q = new URLSearchParams({
      age: String(age),
      sex,
      grossSalary: String(Math.round(Number(salary))),
      workStartYear: String(startYear),
      retireYear: String(retireYear),
      fundsNow: String(estimatedFunds),
      fundsSource: "estimated",
      sickDays12m: "0",
    });
    router.push(`/addSources?${q.toString()}`);
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto py-12 px-4">
    <div className="bg-zus-card rounded-2xl">
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h2 className="mt-2 text-[22px] leading-7 font-semibold text-[rgb(var(--zus-black))]">
            Dane uzupełniające
          </h2>
          <ZusText variant="body" className="mt-2">
            Te informacje zwykle nie są wprost dostępne w PUE ZUS. Podaj je, aby
            poprawić dokładność prognozy. Jeśli ich nie znasz – możemy użyć
            prostych szacunków na podstawie Twojej pensji i stażu pracy.
          </ZusText>
        </div>

        {/* Funds now – progressive disclosure, unified button styles */}
        <div className="bg-zus-bg p-4 rounded-md space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="fundsNow"
              className="block text-[14px] font-bold text-neutral-800"
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
              <p className="text-[15px] leading-6 text-neutral-800">
                Szacowana kwota:{" "}
                <span className="font-semibold">
                  {new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                    maximumFractionDigits: 0,
                  }).format(estimatedFunds)}
                </span>
              </p>

              <details className="text-[13px] text-neutral-700">
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
    <label htmlFor="sickDays12m" className="block text-[14px] font-bold text-neutral-800">
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
      <p className="text-[15px] leading-6 text-neutral-800">Nie podano</p>
      <details className="text-[13px] text-neutral-700">
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

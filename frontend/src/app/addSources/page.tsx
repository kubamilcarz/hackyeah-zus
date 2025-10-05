"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ZusText,
  ZusInput,
  ZusButton,
} from "@/components/zus-ui";
import { useStepProgression, useRetirementSourcesForm, useSignupData, useWelcomeData } from "@/lib/store";

function fmtPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

// illustrative factor ONLY for UI preview (replace with real calc later)
const REAL_POWER_FACTOR = 0.70;

// Average life expectancy data for pension calculation
const RETIREMENT_AGE = 67; // Current retirement age in Poland
const AVERAGE_LIFE_EXPECTANCY = 78; // Average life expectancy in Poland
const PENSION_YEARS = AVERAGE_LIFE_EXPECTANCY - RETIREMENT_AGE; // ~11 years
const PENSION_MONTHS = PENSION_YEARS * 12; // ~132 months

// Simple Popover Component
function InfoPopover({ children, content }: { children: React.ReactNode; content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isOpen && (
        <div className="absolute z-[9999] w-64 p-3 mt-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg -translate-x-1/2 left-1/2">
          <div className="relative">
            {/* Arrow pointing up */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-200"></div>
              <div className="w-0 h-0 border-l-7 border-r-7 border-b-7 border-l-transparent border-r-transparent border-b-white absolute top-1 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="text-neutral-700">{content}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddSourcesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { completeCurrentStep, nextStep } = useStepProgression();
  const { updateSource } = useRetirementSourcesForm();
  const [data, setData] = useSignupData()
  const [welcomeData, _] = useWelcomeData()
  const [dataToShow, setDataToShow] = useState<any>(null);
  
  useEffect(() => {
    fetch('http://20.86.144.2:8000/api/calc/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, expectedRetirement: welcomeData.expectedRetirement })
    }).then(res => {
      if (!res.ok) {
        console.error('Tracking API responded with status:', res.status);
      } return res.json();
    }).then(data => {   
      setDataToShow(data);
    }).catch(err => {
      console.error('Error sending tracking data:', err)
    })
  }, []);

  // Base from previous step(s) or backend
  const zusNominal = Number(params.get("zusPension") ?? "2964"); // fallback like in screenshot

  const realToday = Math.round(zusNominal * REAL_POWER_FACTOR);
  
  // Calculate monthly pension amount based on life expectancy
  const monthlyPensionNominal = Math.round(zusNominal / PENSION_MONTHS);
  const monthlyPensionReal = Math.round(realToday / PENSION_MONTHS);

  // Savings toggles + amounts
  const [ikeOn, setIkeOn] = useState(false);
  const [ikzeOn, setIkzeOn] = useState(false);
  const [ppkOn, setPpkOn] = useState(false);
  const [ppeOn, setPpeOn] = useState(false);
  const [otherOn, setOtherOn] = useState(false);

  const [ike, setIke] = useState<string>("");
  const [ikze, setIkze] = useState<string>("");
  const [ppk, setPpk] = useState<string>("");
  const [ppe, setPpe] = useState<string>("");
  const [other, setOther] = useState<string>("");

  const monthlyTotal = useMemo(() => {
    const sum =
      (ikeOn ? Number(ike || 0) : 0) +
      (ikzeOn ? Number(ikze || 0) : 0) +
      (ppkOn ? Number(ppk || 0) : 0) +
      (ppeOn ? Number(ppe || 0) : 0) +
      (otherOn ? Number(other || 0) : 0);
    return Math.max(0, Math.round(sum));
  }, [ikeOn, ikzeOn, ppkOn, ppeOn, otherOn, ike, ikze, ppk, ppe, other]);

  const canContinue = true; // everything optional on this step

  function goNext() {
    // Save retirement sources to state with explicit localStorage backup
    const sourcesToSave = {
      ike: ikeOn ? Number(ike || 0) : 0,
      ikze: ikzeOn ? Number(ikze || 0) : 0,
      ppk: ppkOn ? Number(ppk || 0) : 0,
      ppe: ppeOn ? Number(ppe || 0) : 0
    };
    
    console.log('Saving retirement sources:', sourcesToSave);
    
    // Save using the hook
    updateSource('ike', sourcesToSave.ike);
    updateSource('ikze', sourcesToSave.ikze);
    updateSource('ppk', sourcesToSave.ppk);
    updateSource('ppe', sourcesToSave.ppe);
    
    // Also save directly to localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('zus-retirement-sources', JSON.stringify(sourcesToSave));
      console.log('Saved to localStorage:', sourcesToSave);
    }
    
    completeCurrentStep();
    nextStep();
    
    // Use router.push with simplified URL - state management will handle the data
    router.push("/result");
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto py-12 px-4">
    <div className="bg-zus-card rounded-2xl">
        <div className="p-6 md:p-8 lg:p-10 space-y-8">
          <header className="space-y-2 text-center">
            <h1 className="text-xl md:text-2xl font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.5rem * var(--font-scale))` }}>
              Twoja prognoza emerytalna
            </h1>
            <ZusText className="text-neutral-700">
              Poniżej możesz dodać dobrowolne oszczędzanie i uwzględnić zwolnienia lekarskie.
              To pomoże doprecyzować ostateczną prognozę.
            </ZusText>
          </header>

          {/* Top tiles: nominal vs real today */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Tile 
              tone="primary" 
              title="Emerytura z ZUS" 
              subtitle={`${fmtPLN(dataToShow?.monthlyPension || monthlyPensionNominal)}/miesiąc przez ~${PENSION_YEARS} lat`}
              value={fmtPLN(dataToShow?.retirementSum || zusNominal)}
              infoText={`To jest łączna kwota emerytury z ZUS w wartościach nominalnych (${fmtPLN(zusNominal)}), którą otrzymasz przez około ${PENSION_YEARS} lat emerytury. Oznacza to miesięczne świadczenie w wysokości ${fmtPLN(monthlyPensionNominal)}, ale jego siła nabywcza będzie mniejsza niż dzisiaj ze względu na inflację.`}
            />
            <Tile 
              tone="success" 
              title="Siła nabywcza dziś" 
              subtitle={`${fmtPLN(dataToShow?.realMonthlyPension || monthlyPensionReal)}/miesiąc w dzisiejszych cenach`}
              value={fmtPLN(dataToShow?.retirementSum * dataToShow?.realMonthlyPension / dataToShow?.monthlyPension ||realToday)}
              infoText={`To jest wartość Twojej przyszłej emerytury przeliczona na dzisiejszą siłę nabywczą (łącznie ${fmtPLN(realToday)}). Pokazuje, ile będziesz mógł faktycznie kupić za swoją emeryturę w porównaniu do obecnych cen - około ${fmtPLN(monthlyPensionReal)} miesięcznie przez ${PENSION_YEARS} lat.`}
            />
          </div>

          {/* Savings section */}
          <section className="mt-2 bg-zus-bg p-6 rounded-xl">
            <h2 className="text-center text-lg md:text-xl font-semibold text-neutral-900" style={{ fontSize: `calc(1.125rem * var(--font-scale))` }}>
              Czy oszczędzasz dodatkowo na emeryturę?
            </h2>
            <ZusText className="text-center mt-1">Zaznacz formy oszczędzania i podaj miesięczne kwoty.</ZusText>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SavingsCard
                checked={ikeOn}
                onToggle={(v) => {
                  setIkeOn(v);
                  if (v && ike === "") setIke("0");
                }}
                title="IKE (Indywidualne Konto Emerytalne)"
                description="Ulga podatkowa do 1 360 zł rocznie. Środki dostępne po 60. roku życia."
                value={ike}
                onValue={setIke}
                calculatorUrl="https://www.gov.pl/web/rodzina/ike-indywidualne-konto-emerytalne"
                calculatorLabel="Więcej"
              />

              <SavingsCard
                checked={ikzeOn}
                onToggle={(v) => {
                  setIkzeOn(v);
                  if (v && ikze === "") setIkze("0");
                }}
                title="IKZE (Indywidualne Konto Zabezpieczenia Emerytalnego)"
                description="Ulga podatkowa do 9 440 zł rocznie. Środki dostępne po osiągnięciu wieku emerytalnego."
                value={ikze}
                onValue={setIkze}
                calculatorUrl="https://www.gov.pl/web/rodzina/ikze-indywidualne-konto-zabezpieczenia-emerytalnego"
                calculatorLabel="Więcej"
              />

              <SavingsCard
                checked={ppkOn}
                onToggle={(v) => {
                  setPpkOn(v);
                  if (v && ppk === "") setPpk("0");
                }}
                title="PPK (Pracownicze Plany Kapitałowe)"
                description="2% Twojej składki + 1,5% od pracodawcy + dopłaty od państwa. Automatyczne inwestowanie."
                value={ppk}
                onValue={setPpk}
                calculatorUrl="https://www.mojeppk.pl/kalkulator"
              />

              <SavingsCard
                checked={ppeOn}
                onToggle={(v) => {
                  setPpeOn(v);
                  if (v && ppe === "") setPpe("0");
                }}
                title="PPE (Pracowniczy Program Emerytalny)"
                description="Program emerytalny organizowany przez pracodawcę. Często z dopłatą firmy."
                value={ppe}
                onValue={setPpe}
                calculatorUrl="https://www.zus.pl/slownik/-/letter/p/pracowniczy-program-emerytalny/22170"
                calculatorLabel="Więcej"
              />

              <SavingsCard
                checked={otherOn}
                onToggle={(v) => {
                  setOtherOn(v);
                  if (v && other === "") setOther("0");
                }}
                title="Inne oszczędności"
                description="Lokaty, fundusze inwestycyjne, nieruchomości, akcje lub inne formy oszczędzania."
                value={other}
                onValue={setOther}
                placeholder="Miesięczna kwota (zł)"
              />
            </div>

            {/* Monthly total preview */}
            <div className="mt-4 flex items-center justify-end">
              <div className="text-sm text-neutral-700" style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}>
                Suma miesięcznych wpłat: <span className="font-semibold">{fmtPLN(monthlyTotal)}</span>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="pt-2 w-80 mx-auto">
            <ZusButton
              variant="primary"
              type="button"
              className="w-full h-12 text-base"
              disabled={!canContinue}
              aria-disabled={!canContinue}
              onClick={goNext}
            >
              Oblicz ostateczną prognozę
            </ZusButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Local UI helpers (kept tiny to avoid bloating the kit) --- */

function Tile({
  title,
  subtitle,
  value,
  tone = "primary",
  infoText,
}: {
  title: string;
  subtitle: string;
  value: string;
  tone?: "primary" | "success";
  infoText?: string;
}) {
  const isSuccess = tone === "success";
  const bgColor = isSuccess ? "bg-[var(--color-zus-green-bg)]" : "bg-zus-bg";
  const titleColor = isSuccess ? "text-[var(--zus-green)]" : "text-[#2E6AA2]";

  const circlesColor = isSuccess ? "fill-[var(--zus-green)]/5" : "fill-[#2E6AA2]/5";

  return (
    <div className={`relative rounded-xl p-5 md:p-6 transition-transform ${bgColor}`}>
      {/* Decorative background circles */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <circle cx="170" cy="-10" r="90" className={circlesColor} />
        <circle cx="30" cy="180" r="50" className={circlesColor} />
      </svg>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className={`text-sm font-semibold ${titleColor}`} style={{ fontSize: `calc(0.8125rem * var(--font-scale))` }}>
            {title}
          </div>
          {infoText && (
            <InfoPopover content={infoText}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-help transition-colors hover:bg-opacity-10 hover:bg-current ${titleColor}`}>
                <span className="text-xs font-bold">i</span>
              </div>
            </InfoPopover>
          )}
        </div>
        <div className="mt-1 text-3xl md:text-4xl font-extrabold text-[rgb(var(--zus-black))] transition-transform duration-300 group-hover:scale-[1.02]" style={{ fontSize: `calc(1.875rem * var(--font-scale))` }}>
          {value}
        </div>
        <div className="mt-1 text-sm text-neutral-700" style={{ fontSize: `calc(0.8125rem * var(--font-scale))` }}>{subtitle}</div>
      </div>
    </div>
  );
}

function SavingsCard({
  checked,
  onToggle,
  title,
  description,
  value,
  onValue,
  placeholder = "Wartość konta (zł)",
  calculatorUrl,
  calculatorLabel = "Kalkulator",
}: {
  checked: boolean;
  onToggle: (v: boolean) => void;
  title: string;
  description: string;
  value: string;
  onValue: (v: string) => void;
  placeholder?: string;
  calculatorUrl?: string;
  calculatorLabel?: string;
}) {
  return (
    <div 
      className={`rounded-xl border border-zus p-5 cursor-pointer transition-colors ${
        checked ? 'border-[#2E6AA2] bg-blue/100' : 'hover:bg-zus-card bg-zus-bg'
      }`}
      onClick={() => onToggle(!checked)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-neutral-700" style={{ fontSize: `calc(0.9375rem * var(--font-scale))` }}>{title}</div>
          <p className="zus-text-small mt-1 text-neutral-700">{description}</p>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-neutral-700 select-none pointer-events-none" style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border border-[#2E6AA2] accent-[#2E6AA2]"
            checked={checked}
            readOnly
          />
          {/* <span>{checked ? "Uwzględnione" : "Dodaj"}</span> */}
        </label>
      </div>

      {checked ? (
        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <ZusInput
                id={`${title}-amount`}
                label={placeholder}
                type="number"
                min={0}
                step={50}
                value={value}
                onChange={(e) => onValue(e)}
              />
            </div>
            {calculatorUrl && (
              <div className="pb-2">
                <a
                  href={calculatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-[#2E6AA2] hover:text-[#1f4a7a] transition-colors underline"
                  style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}
                >
                  {calculatorLabel}
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
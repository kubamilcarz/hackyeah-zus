"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ZusButton } from "@/components/zus-ui";
import { ZusText } from "@/components/ui/zus-text";
import { ZusInput } from "@/components/ui/zus-input";
import { ResetButton } from "@/components/flow/reset-button";
import { useStepProgression, useRetirementCalculation, useUserData, useResultData, useWelcomeData, useSignupData } from "@/lib/store";
import { useReactToPrint } from "react-to-print";

// PDF-friendly component that contains the content to print
const PrintableContent = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <div ref={ref} className="p-8 bg-white text-black">
      {children}
    </div>
  )
);

PrintableContent.displayName = "PrintableContent";

function fmtPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

export default function ResultPage() {
  const params = useSearchParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
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
  
  // State management hooks
  const { completeCurrentStep, nextStep } = useStepProgression();
  const calculation = useRetirementCalculation();
  const userData = useUserData();
  const [resultData, setResultData] = useResultData();

  // Handle postal code change
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResultData({
      ...resultData,
      postalCode: e.target.value
    });
  };

  // PDF export functionality
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Raport emerytalny - ${userData.signup?.email || 'użytkownik'}`,
    onAfterPrint: () => {
      console.log("PDF generated successfully");
    },
  });

  // Navigation to next step using router + state management
  const handleNextToSurvey = () => {
    completeCurrentStep();
    nextStep();
    router.push("/secondSurvey"); // Router navigation + state will be synced by RouteStepSynchronizer
  };

  // Use calculation from state if available, otherwise fall back to URL params
  const zusPension = Number(fmtPLN(dataToShow?.retirementSum)) || Number(params.get("zusPension") ?? 2964);
  const realToday = zusPension * 0.7;
  const monthlySavings = (Number(localStorage.getItem('monthlyTotal')) ?? 0) * 0.6;

  // const monthlySavings = Number(fmtPLN(dataToShow?.retirementSum) ?? 0);

  // Simulated total for now — replace with backend calc later
  const projectedWithSavings = zusPension + monthlySavings; // simplified illustrative model

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4">
      <PrintableContent ref={printRef}>
        <div className="bg-zus-card rounded-2xl">
          <div className="p-8 md:p-10 space-y-10">
          {/* Header */}
          <header className="space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}>
              Twoja prognoza emerytalna
            </h1>
            <ZusText className="text-neutral-700">
              Szacunkowa wysokość przyszłego świadczenia na podstawie Twoich danych.
            </ZusText>
          </header>

          {/* Top tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Tile
              tone="primary"
              title="Emerytura z ZUS"
              subtitle="Kwota nominalna"
              value={fmtPLN(zusPension)}
            />
            <Tile
              tone="success"
              title="Siła nabywcza dziś"
              subtitle="Uwzględnia inflację"
              value={fmtPLN(realToday)}
            />
            <Tile
              tone="neutral"
              title="Z oszczędności"
              subtitle="Prognozowany miesięczny dodatek"
              value={fmtPLN(projectedWithSavings - zusPension)}
            />
          </div>

          {/* Additional Information Section */}
          <section className="bg-zus-bg rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-neutral-700" style={{ fontSize: `calc(1.125rem * var(--font-scale))` }}>
              Dodatkowe informacje
            </h3>
            
            <ZusText className="text-neutral-800 leading-relaxed">
              Twoje zaprognozowane świadczenie emerytalne w wysokości <strong>{fmtPLN(projectedWithSavings)}</strong> {" "}
              odnosi się do prognozowanego średniego świadczenia w roku przejścia na emeryturę. Stopa zastąpienia 
              (stosunek prognozowanego świadczenia do Twojego obecnego wynagrodzenia zindeksowanego) wynosi {" "}
              <strong>
                {userData.signup?.grossSalary 
                  ? `${Math.round((projectedWithSavings / userData.signup.grossSalary) * 100)}%`
                  : "nieokreślona"}
              </strong>.
            </ZusText>
          </section>

          {/* Postal Code Input */}
          <div className="max-w-sm">
            <ZusInput
              id="postalCode"
              label="Kod pocztowy (opcjonalnie)"
              placeholder="np. 00-000"
              value={resultData.postalCode || ''}
              onChange={handlePostalCodeChange}
              maxLength={6}
            />
          </div>

          {/* Conclusions / Wnioski */}
          <section className="bg-zus-bg rounded-xl p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-neutral-700" style={{ fontSize: `calc(1.125rem * var(--font-scale))` }}>
              Wnioski
            </h2>

            <ZusText className="text-neutral-800 leading-relaxed">
              Na podstawie wprowadzonych danych Twoja <strong>prognozowana emerytura</strong>{" "}
              wynosi około <strong>{fmtPLN(projectedWithSavings)}</strong> miesięcznie.
            </ZusText>

            {userData.welcome.expectedRetirement && (
              <ZusText className="text-neutral-800 leading-relaxed">
                Twoja oczekiwana emerytura to <strong>{fmtPLN(userData.welcome.expectedRetirement)}</strong>.{" "}
                {projectedWithSavings >= userData.welcome.expectedRetirement 
                  ? "Gratulacje! Prawdopodobnie osiągniesz swój cel."
                  : "Warto rozważyć zwiększenie oszczędności emerytowych."
                }
              </ZusText>
            )}

            <ZusText className="text-neutral-800 leading-relaxed">
              Warto rozważyć regularne oszczędzanie w ramach IKE, IKZE lub PPK — każda z tych
              form pozwala zwiększyć świadczenie o kilka–kilkanaście procent, zwłaszcza przy
              dłuższym okresie oszczędzania.
            </ZusText>

            <ZusText className="text-neutral-800 leading-relaxed">
              Nawet niewielkie miesięczne wpłaty (np. {fmtPLN(200)}) mogą w dłuższej perspektywie
              wygenerować zauważalny dodatek do emerytury.
            </ZusText>
          </section>

          {/* CTA */}
          <div className="flex flex-col md:flex-row gap-3 justify-between pt-4 print:hidden">
            <ResetButton 
              variant="ghost" 
              size="md"
            />

            <div className="flex flex-col md:flex-row gap-3 justify-center pt-4">
              <ZusButton 
                variant="outline" 
                type="button"
                onClick={handlePrint}
              >
                Pobierz raport PDF
              </ZusButton>

            <ZusButton 
              variant="primary" 
              type="button" 
              className="px-8"
              onClick={handleNextToSurvey}
            >
              Sprawdź inne prognozy
            </ZusButton>
            </div>
            </div>
          </div>
        </div>
      </PrintableContent>
    </div>
  );
}

/* --- Tiles --- */
function Tile({
  title,
  subtitle,
  value,
  tone = "primary",
}: {
  title: string;
  subtitle: string;
  value: string;
  tone?: "primary" | "success" | "neutral";
}) {
  const bg =
    tone === "success"
      ? "bg-[var(--color-zus-green-bg)]"
      : tone === "neutral"
      ? "bg-card/20"
      : "bg-zus-bg";
  const getTitleStyle = () => {
    if (tone === "success") return { color: "rgb(var(--zus-green))" };
    if (tone === "neutral") return { color: "rgb(var(--color-text) / 0.7)" };
    return { color: "rgb(var(--color-accent))" };
  };
  const circleColor =
    tone === "success"
      ? "fill-[var(--zus-green)]/10"
      : tone === "neutral"
      ? "fill-neutral-400/10"
      : "fill-[#2E6AA2]/10";

  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-5 md:p-6 ${bg} transition-transform`}
    >
      {/* background circles */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full scale-100 transition-transform duration-700 ease-out group-hover:scale-110"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <circle cx="170" cy="30" r="60" className={circleColor} />
        <circle cx="30" cy="180" r="50" className={circleColor} />
      </svg>

      <div className="relative z-10">
        <div 
          className="text-sm font-semibold" 
          style={{ 
            fontSize: `calc(0.8125rem * var(--font-scale))`,
            ...getTitleStyle()
          }}
        >
          {title}
        </div>
        <div 
          className="mt-1 text-3xl md:text-4xl font-extrabold transition-transform duration-300 group-hover:scale-[1.02]" 
          style={{ 
            fontSize: `calc(1.875rem * var(--font-scale))`,
            color: `rgb(var(--color-text))`
          }}
        >
          {value}
        </div>
        <div 
          className="mt-1 text-sm" 
          style={{ 
            fontSize: `calc(0.8125rem * var(--font-scale))`,
            color: `rgb(var(--color-text) / 0.7)`
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
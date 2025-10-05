"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ZusButton } from "@/components/zus-ui";
import { ZusText } from "@/components/ui/zus-text";
import { ZusInput } from "@/components/ui/zus-input";
import { ResetButton } from "@/components/flow/reset-button";
import { useStepProgression, useRetirementCalculation, useUserData, useResultData } from "@/lib/store";
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
  
  // State management hooks
  const { completeCurrentStep, nextStep } = useStepProgression();
  const calculation = useRetirementCalculation();
  const userData = useUserData();
  const [resultData, setResultData] = useResultData();

  // State for AI-generated conclusions
  const [conclusions, setConclusions] = useState<string[]>([]);
  const [isLoadingConclusions, setIsLoadingConclusions] = useState(true);
  const [conclusionsError, setConclusionsError] = useState<string | null>(null);
  const [hasFetchedConclusions, setHasFetchedConclusions] = useState(false);

  // Memoize key user data to prevent unnecessary re-renders
  const userDataKey = useMemo(() => {
    return JSON.stringify({
      age: userData.signup?.age,
      expectedRetirement: userData.welcome?.expectedRetirement,
      grossSalary: userData.signup?.grossSalary,
      estimatedPension: userData.calculation?.estimatedMonthlyPension
    });
  }, [
    userData.signup?.age,
    userData.welcome?.expectedRetirement, 
    userData.signup?.grossSalary,
    userData.calculation?.estimatedMonthlyPension
  ]);

  // Fetch personalized conclusions on page load
  useEffect(() => {
    const fetchConclusions = async () => {
      try {
        setIsLoadingConclusions(true);
        setConclusionsError(null);

        const response = await fetch('/api/retirement-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch retirement analysis');
        }

        const data = await response.json();
        setConclusions(data.conclusions || []);
        setHasFetchedConclusions(true);
      } catch (error) {
        console.error('Error fetching conclusions:', error);
        setConclusionsError('Nie udało się wygenerować spersonalizowanych wniosków. Spróbuj odświeżyć stronę.');
      } finally {
        setIsLoadingConclusions(false);
      }
    };

    // Only fetch if we have some user data and haven't fetched conclusions yet
    if ((userData.signup?.age || userData.welcome?.expectedRetirement) && !hasFetchedConclusions) {
      fetchConclusions();
    } else if (!userData.signup?.age && !userData.welcome?.expectedRetirement) {
      setIsLoadingConclusions(false);
    }
  }, [userDataKey, hasFetchedConclusions, userData]);

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
  const zusPension = calculation?.estimatedMonthlyPension || Number(params.get("zusPension") ?? 2964);
  const realToday = Number(params.get("realPowerToday") ?? 2075);
  const monthlySavings = Number(params.get("monthlyTotal") ?? 0);

  // Simulated total for now — replace with backend calc later
  const projectedWithSavings = zusPension + monthlySavings * 0.3; // simplified illustrative model

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
            <div className="flex items-center gap-3">
              <Image 
                src="/ema-wiewior.svg" 
                alt="Ema" 
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <h2 className="text-lg md:text-xl font-semibold text-neutral-700" style={{ fontSize: `calc(1.125rem * var(--font-scale))` }}>
                Spersonalizowane wnioski
              </h2>
            </div>

            {isLoadingConclusions ? (
              <div className="flex items-center gap-3 p-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zus-green"></div>
                <ZusText className="text-neutral-600">
                  Ema analizuje Twoje dane i przygotowuje spersonalizowane wnioski...
                </ZusText>
              </div>
            ) : conclusionsError ? (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <ZusText className="text-red-700">
                  {conclusionsError}
                </ZusText>
              </div>
            ) : conclusions.length > 0 ? (
              <div className="space-y-4">
                {conclusions.map((conclusion, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white border border-zus-gray/20">
                    <ZusText className="text-neutral-800 leading-relaxed">
                      {conclusion}
                    </ZusText>
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-lg bg-zus-green/10 border border-zus-green/20">
                  <ZusText className="text-sm text-zus-green">
                    💡 Te wnioski zostały wygenerowane przez Emę na podstawie Twoich danych. 
                    Pamiętaj, że to tylko szacunki - zawsze warto skonsultować się z doradcą finansowym.
                  </ZusText>
                </div>
              </div>
            ) : (
              // Fallback to original content if no conclusions
              <div className="space-y-4">
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
              </div>
            )}
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
"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWelcomeForm, useStepProgression } from "@/lib/store";
import {
  ZusButton,
  ZusText,
  ZusInput,
  ZusHeading,
  ZusAlert,
} from "@/components/zus-ui";

function fmtPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

// placeholders; swap with real data later
const MINIMALNA = 1588;
const SREDNIA = 3200;
const WYZSZA = 5000;
const NET_RATE = 0.85; // illustrative for UI only

// Retirement groups data
const RETIREMENT_GROUPS = [
  {
    id: 'below-minimum',
    label: 'Poniżej minimalnej',
    value: 1200,
    description: 'Osoby, które nie przepracowały wymaganych 25 lat (kobiety) / 20 lat (mężczyźni). Świadczenie może być niższe od emerytury minimalnej.',
    tone: 'warning' as const
  },
  {
    id: 'minimum',
    label: 'Minimalna emerytura',
    value: MINIMALNA,
    description: 'Gwarantowana minimalna emerytura dla osób spełniających wymagania dotyczące okresu składkowego.',
    tone: 'soft' as const
  },
  {
    id: 'average',
    label: 'Średnia w Polsce',
    value: SREDNIA,
    description: 'Średnia wysokość emerytury wypłacanej przez ZUS w Polsce. Dotyczy większości emerytów.',
    tone: 'neutral' as const
  },
  {
    id: 'higher',
    label: 'Wyższa emerytura',
    value: WYZSZA,
    description: 'Wyższe świadczenia emerytalne osiągane przez osoby z długim stażem pracy i wyższymi zarobkami.',
    tone: 'success' as const
  }
];

export default function WelcomeStart() {
  const router = useRouter();
  const { data: welcomeData, updateExpectedRetirement } = useWelcomeForm();
  const { completeCurrentStep, nextStep, currentStep } = useStepProgression();
  
  // Local UI state for netto/brutto toggle
  const [netto, setNetto] = useState<boolean>(false);
  
  // Use state value or default to 4000
  const value = welcomeData.expectedRetirement || 4000;

  // Ensure we're on the correct step when this page loads
  React.useEffect(() => {
    if (currentStep !== 1) {
      // This page should be step 1
      // The RouteStepSynchronizer will handle this
    }
  }, [currentStep]);

  const onNumberKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 500 : -500;
      const newValue = Math.max(0, Math.round(((value || 0) + delta) / 500) * 500);
      updateExpectedRetirement(newValue);
    }
  }, [value, updateExpectedRetirement]);

  const onNumberChange = useCallback((valueStr: string) => {
    const raw = valueStr.replace(/\s/g, "").replace(",", ".");
    const num = Number(raw);
    updateExpectedRetirement(Number.isFinite(num) ? num : 0);
  }, [updateExpectedRetirement]);

  const handleProceedToSignup = () => {
    if (isValid && value > 0) {
      // Ensure the data is saved to state
      updateExpectedRetirement(value);
      completeCurrentStep();
      nextStep();
      router.push("/signup");
    }
  };

  const comparisonData = useMemo(() => {
    const f = netto ? NET_RATE : 1;
    const groups = RETIREMENT_GROUPS.map(group => ({
      ...group,
      displayValue: Math.round(group.value * f)
    }));
    
    const userExpected = {
      id: 'user-expected',
      label: 'Twoja oczekiwana',
      value: value || 0,
      displayValue: Math.round((value || 0) * f),
      description: 'Kwota emerytury, którą chciałbyś osiągnąć. Sprawdzimy, jak ją zrealizować.',
      tone: 'primary' as const,
      isUserTarget: true
    };
    
    return [...groups, userExpected];
  }, [value, netto]);

  const ciekawostkaText = useMemo(() => {
    if ((value || 0) >= 6000)
      return "Wyższe świadczenia zwykle wynikają z dłuższej pracy i dłuższych okresów składkowych.";
    if ((value || 0) >= 4000)
      return "Przesunięcie przejścia o 5 lat potrafi istotnie podnieść świadczenie.";
    return "Okresy L4 również wpływają na podstawę — w symulatorze możesz je uwzględnić.";
  }, [value]);

  const isValid = (value || 0) > 0;
  const maxForScale = useMemo(() => {
    const allValues = comparisonData.map(item => item.displayValue);
    return Math.max(...allValues, 1);
  }, [comparisonData]);

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: 'rgb(var(--color-bg))',
        color: 'rgb(var(--color-text))'
      }}
    >
      <div className="max-w-6xl mx-auto py-8 px-4">

        {/* Main Content - Calculator Focus */}
        <div className="max-w-4xl mx-auto">
          {/* Primary Calculator Section */}
          <div className="mb-8">
                <div 
                  className="p-8 space-y-8 rounded-2xl"
                  style={{
                    backgroundColor: 'rgb(var(--color-card))',
                    border: '1px solid rgb(var(--color-accent) / 0.2)',
                    color: 'rgb(var(--color-text))'
                  }}
                >
                  {/* Input Section */}
                  <div className="text-center space-y-6">
                    <div>
                      <ZusHeading level={2} className="mb-4 text-zus-navy">
                        Zacznij od swojego celu
                      </ZusHeading>
                      <ZusText variant="body-large">
                        Podaj kwotę emerytury, o której marzysz. Sprawdzimy, jak ją osiągnąć.
                      </ZusText>
                    </div>

                    <div className="max-w-md mx-auto">
                      <ZusInput
                        id="kwota"
                        label="Oczekiwana kwota emerytury (miesięcznie, brutto)"
                        type="number"
                        min={0}
                        max={1_000_000}
                        step={500}
                        value={Number.isFinite(value) ? value.toString() : "0"}
                        onChange={onNumberChange}
                        onKeyDown={onNumberKeyDown}
                        required
                        className="text-center"
                        hintAction={{
                          label: "Użyj strzałek ↑/↓, aby zmieniać co 500 zł.",
                          onClick: (e) => e.preventDefault(),
                        }}
                      />
                    </div>
                  </div>

                  {/* Comparison */}
                  <div 
                    className="rounded-xl p-6 space-y-6"
                    style={{
                      backgroundColor: 'rgb(var(--color-bg))',
                      border: '1px solid rgb(var(--color-text) / 0.1)',
                      color: 'rgb(var(--color-text))'
                    }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <ZusHeading level={4}>Jak to wygląda w porównaniu?</ZusHeading>
                      <div className="flex items-center gap-2">
                        <span 
                          style={{ 
                            fontSize: `calc(0.875rem * var(--font-scale))`,
                            color: 'rgb(var(--color-text) / 0.7)'
                          }}
                        >
                          Widok:
                        </span>
                        <div 
                          className="flex items-center gap-1 border rounded-md p-1"
                          style={{
                            backgroundColor: 'rgb(var(--color-card))',
                            borderColor: 'rgb(var(--color-text) / 0.2)'
                          }}
                        >
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded transition-colors ${!netto ? "shadow-sm" : ""}`}
                            style={{
                              fontSize: `calc(0.875rem * var(--font-scale))`,
                              backgroundColor: !netto ? 'rgb(0, 65, 110)' : 'transparent',
                              color: !netto ? 'white' : 'rgb(var(--color-text))',
                              border: !netto ? '1px solid rgb(0, 65, 110)' : '1px solid transparent'
                            }}
                            onClick={() => setNetto(false)}
                          >
                            Brutto
                          </button>
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded transition-colors ${netto ? "shadow-sm" : ""}`}
                            style={{
                              fontSize: `calc(0.875rem * var(--font-scale))`,
                              backgroundColor: netto ? 'rgb(0, 65, 110)' : 'transparent',
                              color: netto ? 'white' : 'rgb(var(--color-text))',
                              border: netto ? '1px solid rgb(0, 65, 110)' : '1px solid transparent'
                            }}
                            onClick={() => setNetto(true)}
                          >
                            Netto
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {comparisonData.map((item) => (
                        <ComparisonBar 
                          key={item.id}
                          label={item.label}
                          value={item.displayValue}
                          max={maxForScale}
                          tone={item.tone}
                          emphasis={'isUserTarget' in item ? item.isUserTarget : false}
                          description={item.description}
                        />
                      ))}
                    </div>

                    {/* Insight */}
                    <ZusAlert variant="info" title="💡 Wskazówka eksperta">
                      {ciekawostkaText}
                    </ZusAlert>
                  </div>

                  {/* CTA */}
                  <div className="text-center">
                    <ZusButton
                      variant="primary"
                      size="large"
                      type="button"
                      className="w-full max-w-md font-semibold"
                      disabled={!isValid}
                      aria-disabled={!isValid}
                      onClick={handleProceedToSignup}
                    >
                      Rozpocznij szczegółową symulację
                    </ZusButton>
                    <p 
                      className="mt-3"
                      style={{
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: 'rgb(var(--color-text) / 0.6)'
                      }}
                    >
                      Bezpłatne • Zabiera 5 minut • Natychmiastowe wyniki
                    </p>
                  </div>
                </div>
          </div>

          {/* Subtle Benefits Section - Less Overwhelming */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div 
              className="text-center p-3 rounded-lg" 
              style={{ 
                backgroundColor: 'rgb(var(--color-success) / 0.1)', 
                borderLeft: '3px solid rgb(var(--color-success))',
                color: 'rgb(var(--color-text))'
              }}
            >
              <div 
                className="mb-2" 
                style={{ 
                  fontSize: `calc(1.25rem * var(--font-scale))`,
                  color: 'rgb(var(--color-success))' 
                }}
              >
                ✓
              </div>
              <div 
                className="font-medium mb-1" 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: 'rgb(var(--color-text))'
                }}
              >
                Precyzyjne obliczenia
              </div>
              <div 
                style={{ 
                  fontSize: `calc(0.75rem * var(--font-scale))`,
                  color: 'rgb(var(--color-text) / 0.7)'
                }}
              >
                Oparte na przepisach ZUS
              </div>
            </div>
            <div 
              className="text-center p-3 rounded-lg" 
              style={{ 
                backgroundColor: 'rgb(var(--color-accent) / 0.1)', 
                borderLeft: '3px solid rgb(var(--color-accent))',
                color: 'rgb(var(--color-text))'
              }}
            >
              <div 
                className="mb-2" 
                style={{ 
                  fontSize: `calc(1.25rem * var(--font-scale))`,
                  color: 'rgb(var(--color-accent))' 
                }}
              >
                📊
              </div>
              <div 
                className="font-medium mb-1" 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: 'rgb(var(--color-text))'
                }}
              >
                Różne scenariusze
              </div>
              <div 
                style={{ 
                  fontSize: `calc(0.75rem * var(--font-scale))`,
                  color: 'rgb(var(--color-text) / 0.7)'
                }}
              >
                Sprawdź różne opcje
              </div>
            </div>
            <div 
              className="text-center p-3 rounded-lg" 
              style={{ 
                backgroundColor: 'rgb(var(--color-warning) / 0.1)', 
                borderLeft: '3px solid rgb(var(--color-warning))',
                color: 'rgb(var(--color-text))'
              }}
            >
              <div 
                className="mb-2" 
                style={{ 
                  fontSize: `calc(1.25rem * var(--font-scale))`,
                  color: 'rgb(var(--color-warning))' 
                }}
              >
                💡
              </div>
              <div 
                className="font-medium mb-1" 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: 'rgb(var(--color-text))'
                }}
              >
                Praktyczne porady
              </div>
              <div 
                style={{ 
                  fontSize: `calc(0.75rem * var(--font-scale))`,
                  color: 'rgb(var(--color-text) / 0.7)'
                }}
              >
                Jak zwiększyć emeryturę
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center">
          <ZusText variant="small">
            Symulator wykorzystuje aktualne przepisy emerytalne obowiązujące w Polsce. 
            Wyniki mają charakter orientacyjny i nie stanowią decyzji administracyjnej ZUS.
          </ZusText>
        </div>
      </div>
    </div>
  );
}

/* --- UI bits --- */

function ComparisonBar({
  label,
  value,
  max,
  tone = "neutral",
  emphasis = false,
  description,
}: {
  label: string;
  value: number;
  max: number;
  tone?: "neutral" | "primary" | "soft" | "warning" | "success";
  emphasis?: boolean;
  description?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const pct = Math.max(0.05, Math.min(1, value / max)); // keep tiny visible sliver
  const barBase = "h-4 rounded-lg transition-all duration-500";
  
  // Bar classes for CSS control
  const getBarClass = () => {
    if (tone === "primary") {
      return "comparison-bar-primary";
    } else if (tone === "soft") {
      return "comparison-bar-soft";
    } else if (tone === "warning") {
      return "comparison-bar-warning";
    } else if (tone === "success") {
      return "comparison-bar-success";
    } else {
      return "comparison-bar-neutral";
    }
  };

  // Styles using CSS variables for contrast support
  const getBarStyle = () => {
    if (tone === "primary") {
      return {
        backgroundColor: `rgb(0, 65, 110)`, // ZUS Navy
        boxShadow: emphasis ? '0 0 0 2px rgba(0, 65, 110, 0.3), 0 2px 8px rgba(0, 65, 110, 0.2)' : undefined,
      };
    } else if (tone === "soft") {
      return {
        backgroundColor: `rgba(146, 150, 158, 0.6)`, // ZUS Gray with opacity
      };
    } else if (tone === "warning") {
      return {
        backgroundColor: `rgb(234, 179, 8)`, // Warning yellow
      };
    } else if (tone === "success") {
      return {
        backgroundColor: `rgb(34, 197, 94)`, // Success green
      };
    } else {
      return {
        backgroundColor: `rgba(146, 150, 158, 0.8)`, // ZUS Gray with opacity
      };
    }
  };

  // Container style using CSS variables
  const containerStyle = {
    backgroundColor: `rgba(146, 150, 158, 0.1)`, // ZUS Gray with opacity
    borderColor: `rgba(146, 150, 158, 0.3)`, // ZUS Gray with opacity
  };

  return (
    <div className="w-full relative">
      <div className="flex items-baseline justify-between mb-1.5">
        <span 
          className={`${emphasis ? "font-semibold" : ""}`} 
          style={{ 
            fontSize: `calc(0.875rem * var(--font-scale))`,
            color: emphasis ? 'rgb(var(--color-text))' : 'rgb(var(--color-text) / 0.8)'
          }}
        >
          {label}
          {emphasis && (
            <span 
              className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'rgb(0, 65, 110)',
                color: 'white'
              }}
            >
              Twój cel
            </span>
          )}
        </span>
        <span 
          className={`${emphasis ? "font-semibold" : ""}`} 
          style={{ 
            fontSize: `calc(0.875rem * var(--font-scale))`,
            color: emphasis ? 'rgb(var(--color-text))' : 'rgb(var(--color-text) / 0.7)'
          }}
        >
          {fmtPLN(value)}
        </span>
      </div>
      <div 
        className="w-full border rounded-lg p-1 comparison-bar-container cursor-pointer relative"
        style={containerStyle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className={`${barBase} ${getBarClass()}`}
          style={{ 
            width: `${pct * 100}%`,
            ...getBarStyle()
          }}
          title={`${label}: ${fmtPLN(value)}`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuenow={value}
          aria-valuemax={max}
          aria-label={label}
        />
        
        {/* Tooltip */}
        {description && showTooltip && (
          <div 
            className="absolute z-10 p-3 rounded-lg shadow-lg max-w-xs -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full"
            style={{
              backgroundColor: 'rgb(var(--color-card))',
              border: '1px solid rgb(var(--color-text) / 0.2)',
              color: 'rgb(var(--color-text))'
            }}
          >
            <div 
              className="font-medium mb-1"
              style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}
            >
              {label}
            </div>
            <div 
              style={{ 
                fontSize: `calc(0.75rem * var(--font-scale))`,
                color: 'rgb(var(--color-text) / 0.8)'
              }}
            >
              {description}
            </div>
            {/* Arrow */}
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgb(var(--color-card))'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
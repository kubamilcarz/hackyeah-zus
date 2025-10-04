"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ZusButton,
  ZusCard,
  ZusCardBody,
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
const SREDNIA = 3200;
const MINIMALNA = 1588;
const NET_RATE = 0.85; // illustrative for UI only

export default function WelcomeStart() {
  const router = useRouter();
  const [value, setValue] = useState<number>(4000);
  const [netto, setNetto] = useState<boolean>(false);

  const onNumberKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 500 : -500;
      setValue((v) => Math.max(0, Math.round(((v || 0) + delta) / 500) * 500));
    }
  }, []);

  const onNumberChange = useCallback((value: string) => {
    const raw = value.replace(/\s/g, "").replace(",", ".");
    const num = Number(raw);
    setValue(Number.isFinite(num) ? num : 0);
  }, []);

  const [minVal, avgVal, yourVal] = useMemo(() => {
    const f = netto ? NET_RATE : 1;
    return [Math.round(MINIMALNA * f), Math.round(SREDNIA * f), Math.round((value || 0) * f)];
  }, [value, netto]);

  const ciekawostkaText = useMemo(() => {
    if ((value || 0) >= 6000)
      return "Wyższe świadczenia zwykle wynikają z dłuższej pracy i dłuższych okresów składkowych.";
    if ((value || 0) >= 4000)
      return "Przesunięcie przejścia o 5 lat potrafi istotnie podnieść świadczenie.";
    return "Okresy L4 również wpływają na podstawę — w symulatorze możesz je uwzględnić.";
  }, [value]);

  const isValid = (value || 0) > 0;
  const maxForScale = Math.max(minVal, avgVal, yourVal) || 1;

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
                      <ZusHeading level={2} className="mb-4">
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
                              backgroundColor: !netto ? 'rgb(var(--color-accent))' : 'transparent',
                              color: !netto ? 'rgb(var(--color-bg))' : 'rgb(var(--color-text) / 0.7)'
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
                              backgroundColor: netto ? 'rgb(var(--color-accent))' : 'transparent',
                              color: netto ? 'rgb(var(--color-bg))' : 'rgb(var(--color-text) / 0.7)'
                            }}
                            onClick={() => setNetto(true)}
                          >
                            Netto
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <ComparisonBar label="Minimalna emerytura" value={minVal} max={maxForScale} tone="soft" />
                      <ComparisonBar label="Średnia w Polsce" value={avgVal} max={maxForScale} tone="neutral" />
                      <ComparisonBar label="Twoja oczekiwana" value={yourVal} max={maxForScale} tone="primary" emphasis />
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
                      onClick={() => router.push("/signup")}
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
}: {
  label: string;
  value: number;
  max: number;
  tone?: "neutral" | "primary" | "soft";
  emphasis?: boolean;
}) {
  const pct = Math.max(0.05, Math.min(1, value / max)); // keep tiny visible sliver
  const barBase = "h-4 rounded-lg transition-all duration-500";
  
  // Bar classes for CSS control
  const getBarClass = () => {
    if (tone === "primary") {
      return "comparison-bar-primary";
    } else if (tone === "soft") {
      return "comparison-bar-soft";
    } else {
      return "comparison-bar-neutral";
    }
  };

  // Styles using CSS variables for contrast support
  const getBarStyle = () => {
    if (tone === "primary") {
      return {
        backgroundColor: `rgb(var(--color-primary))`,
      };
    } else if (tone === "soft") {
      return {
        backgroundColor: `rgb(var(--color-neutral) / 0.6)`,
      };
    } else {
      return {
        backgroundColor: `rgb(var(--color-neutral) / 0.8)`,
      };
    }
  };

  // Container style using CSS variables
  const containerStyle = {
    backgroundColor: `rgb(var(--color-neutral) / 0.1)`,
    borderColor: `rgb(var(--color-neutral) / 0.3)`,
  };

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <span 
          className={`${emphasis ? "font-semibold" : ""}`} 
          style={{ 
            fontSize: `calc(0.875rem * var(--font-scale))`,
            color: emphasis ? 'rgb(var(--color-text))' : 'rgb(var(--color-text) / 0.8)'
          }}
        >
          {label}
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
        className="w-full border rounded-lg p-1 comparison-bar-container"
        style={containerStyle}
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
      </div>
    </div>
  );
}
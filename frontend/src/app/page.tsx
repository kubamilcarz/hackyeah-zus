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
  ZusBadge,
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
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(248, 249, 250)' }}>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <ZusHeading level={1} className="mb-4">
            Symulator Emerytury ZUS
          </ZusHeading>
          <ZusText variant="lead" className="text-center max-w-3xl mx-auto mb-6">
            Bezpłatne narzędzie Zakładu Ubezpieczeń Społecznych do planowania emerytury. 
            Sprawdź, jakie świadczenie możesz otrzymać i jak je zwiększyć.
          </ZusText>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-8" style={{ color: 'rgb(142, 146, 156)' }}>
            <div className="flex items-center gap-2">
              <span style={{ color: 'rgb(0, 153, 63)' }}>🔒</span>
              <span>Bezpieczne i poufne</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: 'rgb(63, 132, 210)' }}>⚡</span>
              <span>Natychmiastowe wyniki</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: 'rgb(255, 179, 79)' }}>📊</span>
              <span>Personalizowane prognozy</span>
            </div>
          </div>
        </div>

        {/* Main Content - Calculator Focus */}
        <div className="max-w-4xl mx-auto">
          {/* Primary Calculator Section */}
          <div className="mb-8">
                <div 
                  className="p-8 space-y-8 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 65, 110, 0.1) 0%, rgba(63, 132, 210, 0.05) 100%)',
                  }}
                >
                  {/* Input Section */}
                  <div className="text-center space-y-6">
                    <div>
                      <ZusHeading level={2} className="mb-4 text-zus-navy">
                        Zacznij od swojego celu
                      </ZusHeading>
                      <ZusText className="text-lg text-gray-700">
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
                  <div className="bg-white rounded-xl p-6 space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <ZusHeading level={4}>Jak to wygląda w porównaniu?</ZusHeading>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: 'rgb(142, 146, 156)' }}>Widok:</span>
                        <div className="flex items-center gap-1 bg-gray-100 border rounded-md p-1">
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded text-sm transition-colors ${!netto ? "bg-white shadow-sm" : "hover:bg-gray-50"}`}
                            style={{ color: !netto ? 'rgb(0, 65, 110)' : 'rgb(142, 146, 156)' }}
                            onClick={() => setNetto(false)}
                          >
                            Brutto
                          </button>
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded text-sm transition-colors ${netto ? "bg-white shadow-sm" : "hover:bg-gray-50"}`}
                            style={{ color: netto ? 'rgb(0, 65, 110)' : 'rgb(142, 146, 156)' }}
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
                    <p className="text-sm text-gray-600 mt-3">
                      Bezpłatne • Zabiera 5 minut • Natychmiastowe wyniki
                    </p>
                  </div>
                </div>
          </div>

          {/* Subtle Benefits Section - Less Overwhelming */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 153, 63, 0.05)', borderLeft: '3px solid rgb(0, 153, 63)' }}>
              <div className="text-xl mb-2" style={{ color: 'rgb(0, 153, 63)' }}>✓</div>
              <div className="font-medium text-sm mb-1" style={{ color: 'rgb(0, 65, 110)' }}>Precyzyjne obliczenia</div>
              <div className="text-xs" style={{ color: 'rgb(142, 146, 156)' }}>Oparte na przepisach ZUS</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(63, 132, 210, 0.05)', borderLeft: '3px solid rgb(63, 132, 210)' }}>
              <div className="text-xl mb-2" style={{ color: 'rgb(63, 132, 210)' }}>📊</div>
              <div className="font-medium text-sm mb-1" style={{ color: 'rgb(0, 65, 110)' }}>Różne scenariusze</div>
              <div className="text-xs" style={{ color: 'rgb(142, 146, 156)' }}>Sprawdź różne opcje</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 179, 79, 0.05)', borderLeft: '3px solid rgb(255, 179, 79)' }}>
              <div className="text-xl mb-2" style={{ color: 'rgb(255, 179, 79)' }}>💡</div>
              <div className="font-medium text-sm mb-1" style={{ color: 'rgb(0, 65, 110)' }}>Praktyczne porady</div>
              <div className="text-xs" style={{ color: 'rgb(142, 146, 156)' }}>Jak zwiększyć emeryturę</div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center">
          <ZusText variant="small" className="text-gray-500">
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

  // Fallback inline styles using ZUS colors
  const getBarStyle = () => {
    if (tone === "primary") {
      return {
        backgroundColor: `rgb(0, 65, 110)`, // ZUS Navy
      };
    } else if (tone === "soft") {
      return {
        backgroundColor: `rgba(142, 146, 156, 0.6)`, // ZUS Gray
      };
    } else {
      return {
        backgroundColor: `rgba(142, 146, 156, 0.8)`, // ZUS Gray darker
      };
    }
  };

  // Container style using ZUS colors
  const containerStyle = {
    backgroundColor: `rgba(142, 146, 156, 0.1)`, // Light ZUS gray background
    borderColor: `rgba(142, 146, 156, 0.3)`, // ZUS gray border
  };

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <span 
          className={`text-sm ${emphasis ? "font-semibold" : ""}`} 
          style={{ 
            color: emphasis ? 'rgb(0, 65, 110)' : 'rgba(0, 65, 110, 0.8)'
          }}
        >
          {label}
        </span>
        <span 
          className={`text-sm ${emphasis ? "font-semibold" : ""}`} 
          style={{ 
            color: emphasis ? 'rgb(0, 65, 110)' : 'rgba(0, 65, 110, 0.7)'
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
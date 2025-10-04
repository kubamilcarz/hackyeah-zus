"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ZusButton,
  ZusCardBody,
  ZusText,
  ZusInput,
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
    <div className="min-h-screen max-w-6xl mx-auto py-12 px-4">
    <div className="bg-zus-card rounded-2xl">
        <div className="p-8 md:p-12 space-y-8">
          {/* Headline */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl leading-tight font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.75rem * var(--font-scale))` }}>
              Zbuduj spokojny obraz swojej emerytury
            </h1>
            <ZusText className="text-zus-secondary">
              Zaczniemy od Twoich oczekiwań — później dopasujemy plan i pokażemy, jak do nich dojść.
            </ZusText>
          </div>

          {/* Input */}
          <div className="flex flex-col items-center gap-4">
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
              hintAction={{
                label: "Użyj strzałek ↑/↓, aby zmieniać co 500 zł.",
                onClick: (e) => e.preventDefault(),
              }}
            />

            {/* Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              <InfoChip label="Twoja oczekiwana" value={fmtPLN(value || 0)} tone="primary" />
              <InfoChip label="Średnia w Polsce" value={fmtPLN(SREDNIA)} />
              <InfoChip label="Minimalna" value={fmtPLN(MINIMALNA)} tone="soft" />
            </div>
          </div>

          {/* Interactive comparison (replaces chart) */}
          <ZusCardBody>
            <div className="bg-zus rounded-xl p-6 md:p-7 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-base font-semibold text-neutral-700" style={{ fontSize: `calc(1rem * var(--font-scale))` }}>Jak to wygląda w porównaniu?</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zus-secondary" style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}>Widok:</span>
                  <div className="flex items-center gap-1 bg-zus-bg border rounded-md p-1">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded ${!netto ? "bg-zus-card text-[#2E6AA2]" : "text-neutral-800 hover:bg-neutral-600"}`}
                      onClick={() => setNetto(false)}
                    >
                      Brutto
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded ${netto ? "bg-zus-card text-[#2E6AA2]" : "text-neutral-800 hover:bg-neutral-600"}`}
                      onClick={() => setNetto(true)}
                    >
                      Netto
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <ComparisonBar label="Minimalna" value={minVal} max={maxForScale} tone="soft" />
                <ComparisonBar label="Średnia" value={avgVal} max={maxForScale} tone="neutral" />
                <ComparisonBar label="Twoja oczekiwana" value={yourVal} max={maxForScale} tone="primary" emphasis />
              </div>

              {/* Friendly tip */}
              <div 
                className="mt-2 flex items-start gap-3 border rounded-md p-3"
                style={{
                  backgroundColor: `rgb(var(--color-bg))`,
                  borderColor: `rgb(var(--color-text) / 0.2)`,
                }}
              >
                <span aria-hidden className="text-lg" style={{ fontSize: `calc(1.125rem * var(--font-scale))` }}>💡</span>
                <div>
                  <div 
                    className="text-sm font-semibold" 
                    style={{ 
                      fontSize: `calc(0.8125rem * var(--font-scale))`,
                      color: `rgb(var(--color-text))`
                    }}
                  >
                    Mała wskazówka
                  </div>
                  <ZusText className="mt-1">{ciekawostkaText}</ZusText>
                </div>
              </div>
            </div>
          </ZusCardBody>

          {/* CTA */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <ZusButton
              variant="primary"
              type="button"
              className="w-full max-w-md"
              disabled={!isValid}
              aria-disabled={!isValid}
              onClick={() => router.push("/signup")}
            >
              Rozpocznij symulację
            </ZusButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- UI bits --- */

function InfoChip({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "primary" | "soft";
}) {
  const base = "rounded-lg p-4 text-center";
  const styles =
    tone === "primary"
      ? "bg-zus-green-bg text-[rgb(var(--zus-black))]"
      : tone === "soft"
      ? "bg-zus-bg text-neutral-700"
      : "bg-zus-bg text-neutral-700";
  return (
    <div className={`${base} ${styles}`}>
      <div className="text-sm font-medium text-zus-secondary" style={{ fontSize: `calc(0.8125rem * var(--font-scale))` }}>{label}</div>
      <div className="mt-1 text-xl font-semibold" style={{ fontSize: `calc(1.25rem * var(--font-scale))` }}>{value}</div>
    </div>
  );
}

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

  // Fallback inline styles for regular mode
  const getBarStyle = () => {
    if (tone === "primary") {
      return {
        backgroundColor: `#2E6AA2`, // ZUS blue
      };
    } else if (tone === "soft") {
      return {
        backgroundColor: `rgba(100, 116, 139, 0.8)`, // Slate with good opacity
      };
    } else {
      return {
        backgroundColor: `rgba(71, 85, 105, 0.9)`, // Darker slate with high opacity
      };
    }
  };

  // Container style for contrast support - this will be overridden by CSS in high contrast modes
  const containerStyle = {
    backgroundColor: `rgba(148, 163, 184, 0.15)`, // Light slate background for regular mode
    borderColor: `rgba(100, 116, 139, 0.4)`, // Visible border for regular mode
  };

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <span 
          className={`text-sm ${emphasis ? "font-semibold" : ""}`} 
          style={{ 
            fontSize: `calc(0.875rem * var(--font-scale))`,
            color: emphasis ? `rgb(var(--color-text))` : `rgb(var(--color-text) / 0.8)`
          }}
        >
          {label}
        </span>
        <span 
          className={`text-sm ${emphasis ? "font-semibold" : ""}`} 
          style={{ 
            fontSize: `calc(0.875rem * var(--font-scale))`,
            color: emphasis ? `rgb(var(--color-text))` : `rgb(var(--color-text) / 0.7)`
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
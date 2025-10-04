"use client";
import { useState } from "react";
import { ZusText } from "@/components/ui/zus-text";
import CustomDataEntrySection from "@/components/dashboard/custom-data-entry-section";

// Types for data structure - ensure all components receive properly typed data
interface UserData {
  personalInfo: {
    name: string;
    age: number;
    currentSalary: number;
    retirementAge: number;
  };
  pensionData: {
    currentContributions: number;
    projectedPension: number;
    additionalSavings: number;
  };
  riskProfile: {
    level: "conservative" | "moderate" | "aggressive";
    scenarios: Array<{
      name: string;
      probability: number;
      impact: number;
    }>;
  };
}
import React from "react";
import { KnowledgeQuizTile } from "@/components/dashboard/knowledge-quiz";

// Mock data
const pensionData = {
  nominalPension: 2300,
  realValue: 1800,
  targetPension: 4200,
  yearsToRetirement: 25,
};

const fmtPLN = (amount: number) => `${amount.toLocaleString()} zł`;

export default function DashboardPage() {
  const [salaryAdjustment, setSalaryAdjustment] = useState(0);
  const [inflationSlider, setInflationSlider] = useState(3.0);
  const [additionalSavings, setAdditionalSavings] = useState(0);

  // Calculations
  const adjustedSalary =
    pensionData.nominalPension * (1 + salaryAdjustment / 100);
  const adjustedRealValue =
    pensionData.nominalPension /
    Math.pow(1 + inflationSlider / 100, pensionData.yearsToRetirement);
  const savingsImpact = additionalSavings * 0.3; // simplified calculation

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "rgb(var(--color-bg))",
        color: "rgb(var(--color-text))",
      }}
    >
      {/* Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid currentColor;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid currentColor;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col gap-8">
        <div className="bg-zus-card rounded-2xl">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            {/* Header */}
            <header className="space-y-3 mb-8">
              <h1
                className="text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]"
                style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}
              >
                Twój panel emerytalny
              </h1>
              <ZusText variant="body" className="text-neutral-600 max-w-2xl">
                Przegląd Twojej prognozy i narzędzia do planowania przyszłości.
                Sprawdź aktualny stan swoich oszczędności emerytalnych i poznaj
                opcje ich zwiększenia.
              </ZusText>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OverviewTile
                tone="primary"
                icon="🏛️"
                title="Prognoza ZUS"
                subtitle="Miesięczna emerytura nominalna"
                value={fmtPLN(adjustedSalary)}
                description="Na podstawie Twojej historii składek"
                interactive={{
                  type: "slider",
                  label: "Symulacja podwyżki wynagrodzenia",
                  value: salaryAdjustment,
                  min: -20,
                  max: 50,
                  step: 5,
                  suffix: "%",
                  onChange: setSalaryAdjustment,
                  helpText:
                    "Wyższe składki = wyższa emerytura. Każde 100 zł podwyżki to ~25 zł więcej emerytury miesięcznie.",
                }}
              />

              <OverviewTile
                tone="success"
                icon="💰"
                title="Siła nabywcza dziś"
                subtitle="Wartość w dzisiejszych pieniądzach"
                value={fmtPLN(adjustedRealValue)}
                description={`Uwzględnia inflację ${inflationSlider.toFixed(
                  1
                )}% rocznie`}
                interactive={{
                  type: "slider",
                  label: "Przewidywana inflacja",
                  value: inflationSlider,
                  min: 1.0,
                  max: 6.0,
                  step: 0.5,
                  suffix: "%",
                  onChange: setInflationSlider,
                  helpText:
                    "Inflacja zmniejsza siłę nabywczą. Niższa inflacja = większa wartość emerytury w przyszłości.",
                }}
                insight={{
                  type: "info",
                  text: "Inflacja zmniejsza wartość pieniądza w czasie",
                }}
              />

              <OverviewTile
                tone="accent"
                icon={
                  adjustedSalary + savingsImpact >= pensionData.targetPension
                    ? "🎯"
                    : "📈"
                }
                title={
                  adjustedSalary + savingsImpact >= pensionData.targetPension
                    ? "Cel osiągnięty!"
                    : "Cel emerytalny"
                }
                subtitle="Twoja oczekiwana emerytura"
                value={fmtPLN(pensionData.targetPension)}
                description={
                  adjustedSalary + savingsImpact >= pensionData.targetPension
                    ? `Gratulacje! Osiągniesz swój cel z dodatkową oszczędnością!`
                    : `Brakuje: ${fmtPLN(
                        Math.max(
                          0,
                          pensionData.targetPension -
                            adjustedSalary -
                            savingsImpact
                        )
                      )} miesięcznie`
                }
                progress={Math.round(
                  ((adjustedSalary + savingsImpact) /
                    pensionData.targetPension) *
                    100
                )}
                insight={{
                  type: "info",
                  text: "Aby osiągnąć swój cel emerytalny, zwiększ swoje wynagrodzenie brutto lub zacznij oszczędzać innymi metodami",
                }}
              />
            </div>
          </div>
          </div>

        <KnowledgeQuizTile />

        <CustomDataEntrySection />
      </div>
    </div>
  );
}

// Component interfaces
interface OverviewTileProps {
  tone: "primary" | "success" | "accent";
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  description: string;
  progress?: number;
  interactive?: {
    type: "clickable" | "hover" | "slider";
    label?: string;
    onClick?: () => void;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
    onChange?: (value: number) => void;
    helpText?: string;
  };
  insight?: {
    type: "info" | "warning" | "success";
    text: string;
  };
}
// OverviewTile component
function OverviewTile({
  tone,
  icon,
  title,
  subtitle,
  value,
  description,
  progress,
  interactive,
  insight,
}: OverviewTileProps) {
  const [showHelp, setShowHelp] = useState(false);

  const getBgColor = () => {
    switch (tone) {
      case "success":
        return "bg-green-50";
      case "accent":
        return "bg-orange-50";
      default:
        return "bg-blue-50";
    }
  };

  const getValueColor = () => {
    switch (tone) {
      case "success":
        return "text-green-600";
      case "accent":
        return "text-orange-600";
      default:
        return "text-blue-600";
    }
  };

  const getCircleColor = () => {
    switch (tone) {
      case "success":
        return "fill-green-500/10";
      case "accent":
        return "fill-orange-500/10";
      default:
        return "fill-blue-500/10";
    }
  };

  const getInsightBg = () => {
    if (!insight) return "";
    switch (insight.type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${getBgColor()} h-full`}
    >
      {/* Decorative background circles */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <circle cx="170" cy="-10" r="90" className={getCircleColor()} />
        <circle cx="30" cy="180" r="50" className={getCircleColor()} />
      </svg>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <div
                className="text-lg font-semibold text-neutral-700"
                style={{ fontSize: `calc(1rem * var(--font-scale))` }}
              >
                {title}
              </div>
              <ZusText variant="small" className="text-neutral-600">
                {subtitle}
              </ZusText>
            </div>
          </div>
        </div>

        {/* Main Value */}
        <div className="space-y-2">
          <div
            className={`text-2xl font-extrabold ${getValueColor()}`}
            style={{ fontSize: `calc(1.5rem * var(--font-scale))` }}
          >
            {value}
          </div>
          <ZusText variant="small" className="text-neutral-600">
            {description}
          </ZusText>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Postęp celu</span>
              <span className={getValueColor()}>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-current h-2 rounded-full transition-all duration-500 ${getValueColor()}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Interactive Controls */}
        {interactive && interactive.type === "slider" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-700">
                {interactive.label}
              </label>
              <button
                onMouseEnter={() => setShowHelp(true)}
                onMouseLeave={() => setShowHelp(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                ❓
              </button>
            </div>

            <div className="relative">
              <input
                type="range"
                min={interactive.min}
                max={interactive.max}
                step={interactive.step}
                value={interactive.value}
                onChange={(e) => interactive.onChange?.(Number(e.target.value))}
                className={`slider w-full h-2 rounded-lg appearance-none cursor-pointer ${getValueColor()}`}
                style={{
                  background: `linear-gradient(to right, currentColor 0%, currentColor ${
                    ((interactive.value! - interactive.min!) /
                      (interactive.max! - interactive.min!)) *
                    100
                  }%, rgba(0,0,0,0.1) ${
                    ((interactive.value! - interactive.min!) /
                      (interactive.max! - interactive.min!)) *
                    100
                  }%, rgba(0,0,0,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>
                  {interactive.min}
                  {interactive.suffix}
                </span>
                <span className={`font-medium ${getValueColor()}`}>
                  {interactive.value}
                  {interactive.suffix}
                </span>
                <span>
                  {interactive.max}
                  {interactive.suffix}
                </span>
              </div>
            </div>

            {/* Help Text */}
            {showHelp && interactive.helpText && (
              <div className="absolute z-20 bottom-full mb-2 left-0 right-0 bg-gray-900 text-white text-xs p-2 rounded shadow-lg">
                {interactive.helpText}
              </div>
            )}
          </div>
        )}

        {/* Insight */}
        {insight && (
          <div className={`p-3 rounded-lg border text-sm ${getInsightBg()}`}>
            {insight.text}
          </div>
        )}
      </div>
    </div>
  );
}

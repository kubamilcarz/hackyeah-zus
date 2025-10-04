"use client";
import { useState, useEffect, useRef } from "react";
import { ZusText } from "@/components/ui/zus-text";
import CustomDataEntrySection from "@/components/dashboard/custom-data-entry-section";

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
  const additionalSavings = 0; // Currently not used but kept for future functionality
  // PPK + IKZE, PPE additional savings states
  const [ppkContribution, setPpkContribution] = useState(0);
  const [ikzeContribution, setIkzeContribution] = useState(0);
  const [ppeContribution, setPpeContribution] = useState(0);
  
  // Sticky bar state
  const [isSticky, setIsSticky] = useState(false);
  const tilesRef = useRef<HTMLDivElement>(null);

  // Scroll detection for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (tilesRef.current) {
        const rect = tilesRef.current.getBoundingClientRect();
        setIsSticky(rect.bottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculations
  const adjustedSalary =
    pensionData.nominalPension * (1 + salaryAdjustment / 100);
  const adjustedRealValue =
    pensionData.nominalPension /
    Math.pow(1 + inflationSlider / 100, pensionData.yearsToRetirement);
  const savingsImpact = additionalSavings * 0.3; // simplified calculation
  
  // Additional retirement savings impact (PPK + IKZE + PPE)
  const totalAdditionalSavings = ppkContribution + ikzeContribution + ppeContribution;
  const additionalRetirementImpact = totalAdditionalSavings * 0.85; // Higher impact for dedicated retirement products

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "rgb(var(--color-bg))",
        color: "rgb(var(--color-text))",
      }}
    >
      {/* Sticky Top Bar */}
      {isSticky && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <StickyTile
                icon="🏛️"
                title="Prognoza ZUS"
                value={fmtPLN(adjustedSalary)}
                tone="primary"
              />
              <StickyTile
                icon="💰"
                title="Siła nabywcza dziś"
                value={fmtPLN(adjustedRealValue)}
                tone="success"
              />
              <StickyTile
                icon={
                  adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                    ? "🎯"
                    : "📈"
                }
                title={
                  adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                    ? "Cel osiągnięty!"
                    : "Cel emerytalny"
                }
                value={fmtPLN(pensionData.targetPension)}
                tone="accent"
                progress={Math.round(
                  ((adjustedSalary + savingsImpact + additionalRetirementImpact) /
                    pensionData.targetPension) *
                    100
                )}
              />
            </div>
          </div>
        </div>
      )}
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

      <div className={`max-w-7xl mx-auto py-8 px-4 flex flex-col gap-8 ${isSticky ? 'pt-24' : ''}`}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" ref={tilesRef}>
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
                  adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                    ? "🎯"
                    : "📈"
                }
                title={
                  adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                    ? "Cel osiągnięty!"
                    : "Cel emerytalny"
                }
                subtitle="Twoja oczekiwana emerytura"
                value={fmtPLN(pensionData.targetPension)}
                description={
                  adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                    ? `Gratulacje! Osiągniesz swój cel z dodatkową oszczędnością!`
                    : `Brakuje: ${fmtPLN(
                        Math.max(
                          0,
                          pensionData.targetPension -
                            adjustedSalary -
                            savingsImpact -
                            additionalRetirementImpact
                        )
                      )} miesięcznie`
                }
                progress={Math.round(
                  ((adjustedSalary + savingsImpact + additionalRetirementImpact) /
                    pensionData.targetPension) *
                    100
                )}
                insight={{
                  type: "info",
                  text: totalAdditionalSavings > 0 
                    ? `Uwzględniono dodatkowe oszczędności emerytalne: ${fmtPLN(additionalRetirementImpact)} miesięcznie`
                    : "Aby osiągnąć swój cel emerytalny, zwiększ swoje wynagrodzenie brutto lub zacznij oszczędzać innymi metodami",
                }}
              />
            </div>
          </div>
          </div>

        <KnowledgeQuizTile />

        <CustomDataEntrySection />

        {/* Additional Retirement Savings Section - PPK + IKZE + PPE */}
        <AdditionalRetirementSavingsSection 
          ppkContribution={ppkContribution}
          setPpkContribution={setPpkContribution}
          ikzeContribution={ikzeContribution}
          setIkzeContribution={setIkzeContribution}
          ppeContribution={ppeContribution}
          setPpeContribution={setPpeContribution}
          totalImpact={additionalRetirementImpact}
        />
      </div>
    </div>
  );
}

// Additional Retirement Savings Section Component for PPK + IKZE + PPE
interface AdditionalRetirementSavingsSectionProps {
  ppkContribution: number;
  setPpkContribution: (value: number) => void;
  ikzeContribution: number;
  setIkzeContribution: (value: number) => void;
  ppeContribution: number;
  setPpeContribution: (value: number) => void;
  totalImpact: number;
}

function AdditionalRetirementSavingsSection({
  ppkContribution,
  setPpkContribution,
  ikzeContribution,
  setIkzeContribution,
  ppeContribution,
  setPpeContribution,
  totalImpact,
}: AdditionalRetirementSavingsSectionProps) {
  const totalContributions = ppkContribution + ikzeContribution + ppeContribution;

  return (
    <div className="bg-zus-card rounded-2xl">
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <header className="space-y-3">
          <h1
            className="text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]"
            style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}
          >
            Dodatkowe oszczędności emerytalne
          </h1>
          <ZusText variant="body" className="text-neutral-600 max-w-2xl">
            Zwiększ swoją przyszłą emeryturę dzięki dodatkowym produktom emerytalnym. 
            Te składki będą bezpośrednio wpływać na Twoją prognozę emerytalną w pierwszym rzędzie.
          </ZusText>
        </header>

        {/* Impact Summary */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">💰</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-800">
                Wpływ na prognozę emerytalną
              </h4>
              <ZusText variant="small" className="text-neutral-600">
                Dodatkowe produkty emerytalne zwiększą Twoją miesięczną emeryturę o około{" "}
                <span className="font-semibold text-purple-600">
                  {totalImpact.toLocaleString()} zł
                </span>{" "}
                miesięcznie przy obecnych ustawieniach.
              </ZusText>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-purple-600">💵</span>
                  <span>Łączne składki: {totalContributions.toLocaleString()} zł/mies.</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600">📈</span>
                  <span>Szacowany zwrot: {(totalImpact / Math.max(totalContributions, 1) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PPK Section */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">🏢</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">PPK</h3>
                <ZusText variant="small" className="text-blue-600">
                  Pracownicze Plany Kapitałowe
                </ZusText>
              </div>
            </div>
            
            <div className="space-y-3">
              <ZusText variant="small" className="text-neutral-600">
                Automatyczne składki od pracodawcy + Twoje składki
              </ZusText>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Miesięczna składka PPK: {ppkContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={ppkContribution}
                  onChange={(e) => setPpkContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-200"
                />
                <div className="flex justify-between text-xs text-blue-600">
                  <span>0 zł</span>
                  <span>1000 zł</span>
                </div>
              </div>
              
              <div className="p-2 bg-blue-100 rounded text-xs text-blue-800">
                💡 Pracodawca dokłada minimalnie 1.5% Twojego wynagrodzenia
              </div>
            </div>
          </div>

          {/* IKZE Section */}
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">IKZE</h3>
                <ZusText variant="small" className="text-green-600">
                  Indywidualne Konto Zabezpieczenia Emerytalnego
                </ZusText>
              </div>
            </div>
            
            <div className="space-y-3">
              <ZusText variant="small" className="text-neutral-600">
                Ulga podatkowa do 19% od wpłat
              </ZusText>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Miesięczna wpłata IKZE: {ikzeContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={ikzeContribution}
                  onChange={(e) => setIkzeContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer bg-green-200"
                />
                <div className="flex justify-between text-xs text-green-600">
                  <span>0 zł</span>
                  <span>1000 zł</span>
                </div>
              </div>
              
              <div className="p-2 bg-green-100 rounded text-xs text-green-800">
                💰 Limit roczny: 6760 zł (2024)
              </div>
            </div>
          </div>

          {/* PPE Section */}
          <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold">🛡️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-800">PPE</h3>
                <ZusText variant="small" className="text-orange-600">
                  Pracownicze Programy Emerytalne
                </ZusText>
              </div>
            </div>
            
            <div className="space-y-3">
              <ZusText variant="small" className="text-neutral-600">
                Dodatkowe korzyści od pracodawcy
              </ZusText>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Miesięczna składka PPE: {ppeContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="50"
                  value={ppeContribution}
                  onChange={(e) => setPpeContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer bg-orange-200"
                />
                <div className="flex justify-between text-xs text-orange-600">
                  <span>0 zł</span>
                  <span>800 zł</span>
                </div>
              </div>
              
              <div className="p-2 bg-orange-100 rounded text-xs text-orange-800">
                🏢 Sprawdź dostępność w swoim zakładzie pracy
              </div>
            </div>
          </div>
        </div>

        {/* Action Summary */}
        {totalContributions > 0 && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <div className="space-y-1">
                <h4 className="font-semibold text-neutral-800">
                  Świetny wybór! Twoje dodatkowe oszczędności emerytalne:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Miesięczne składki:</span>
                    <br />
                    <span className="font-semibold text-green-600">
                      {totalContributions.toLocaleString()} zł
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Roczne oszczędności:</span>
                    <br />
                    <span className="font-semibold text-blue-600">
                      {(totalContributions * 12).toLocaleString()} zł
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Dodatkowa emerytura:</span>
                    <br />
                    <span className="font-semibold text-purple-600">
                      +{totalImpact.toLocaleString()} zł/mies.
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Łączny czas:</span>
                    <br />
                    <span className="font-semibold text-orange-600">
                      {pensionData.yearsToRetirement} lat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

// Sticky Tile Component for the top bar
interface StickyTileProps {
  icon: string;
  title: string;
  value: string;
  tone: "primary" | "success" | "accent";
  progress?: number;
}

function StickyTile({ icon, title, value, tone, progress }: StickyTileProps) {
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

  const getBgColor = () => {
    switch (tone) {
      case "success":
        return "hover:bg-green-50";
      case "accent":
        return "hover:bg-orange-50";
      default:
        return "hover:bg-blue-50";
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 bg-white/80 backdrop-blur rounded-xl border border-gray-200 ${getBgColor()} hover:shadow-md transition-all duration-200 cursor-pointer`}>
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-neutral-700 truncate">
          {title}
        </div>
        <div className={`text-xl font-bold ${getValueColor()} truncate`}>
          {value}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className={`bg-current h-1.5 rounded-full transition-all duration-500 ${getValueColor()}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

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
        <div className="fixed top-0 left-0 right-0 z-50 bg-zus-card/95 backdrop-blur-md border-b border-neutral shadow-lg transition-all duration-300">
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
        <div className="bg-zus-card rounded-2xl border border-neutral">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            {/* Header */}
            <header className="space-y-3 mb-8">
              <h1
                className="text-2xl md:text-3xl font-semibold text-primary"
                style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}
              >
                Twój panel emerytalny
              </h1>
              <ZusText variant="body" className="text-neutral max-w-2xl">
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

        {/* Detailed Retirement Analysis Section */}
        <DetailedRetirementAnalysisSection 
          retirementYear={2060}
          currentSalary={5200}
          projectedPension={adjustedSalary}
          targetPension={pensionData.targetPension}
        />

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
            className="text-2xl md:text-3xl font-semibold text-primary"
            style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}
          >
            Dodatkowe oszczędności emerytalne
          </h1>
          <ZusText variant="body" className="text-secondary max-w-2xl">
            Zwiększ swoją przyszłą emeryturę dzięki dodatkowym produktom emerytalnym. 
            Te składki będą bezpośrednio wpływać na Twoją prognozę emerytalną w pierwszym rzędzie.
          </ZusText>
        </header>

        {/* Impact Summary */}
        <div className="p-4 bg-info-light/20 rounded-lg border border-info-light">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-info-light rounded-lg flex items-center justify-center">
              <span className="text-info font-bold">💰</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">
                Wpływ na prognozę emerytalną
              </h4>
              <ZusText variant="small" className="text-secondary">
                Dodatkowe produkty emerytalne zwiększą Twoją miesięczną emeryturę o około{" "}
                <span className="font-semibold text-info">
                  {totalImpact.toLocaleString()} zł
                </span>{" "}
                miesięcznie przy obecnych ustawieniach.
              </ZusText>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-info">💵</span>
                  <span>Łączne składki: {totalContributions.toLocaleString()} zł/mies.</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-success">📈</span>
                  <span>Szacowany zwrot: {(totalImpact / Math.max(totalContributions, 1) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PPK Section */}
          <div className="space-y-4 p-4 bg-info-light/20 rounded-lg border border-info-light">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-info-light rounded-lg flex items-center justify-center">
                <span className="text-info font-bold">🏢</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-info">PPK</h3>
                <ZusText variant="small" className="text-info">
                  Pracownicze Plany Kapitałowe
                </ZusText>
              </div>
            </div>
            
            <div className="space-y-3">
              <ZusText variant="small" className="text-secondary">
                Automatyczne składki od pracodawcy + Twoje składki
              </ZusText>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Miesięczna składka PPK: {ppkContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={ppkContribution}
                  onChange={(e) => setPpkContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer bg-info-light"
                />
                <div className="flex justify-between text-xs text-secondary">
                  <span>0 zł</span>
                  <span>1000 zł</span>
                </div>
              </div>
              
              <div className="p-2 bg-info-light/30 rounded text-xs text-info">
                💡 Pracodawca dokłada minimalnie 1.5% Twojego wynagrodzenia
              </div>
            </div>
          </div>

          {/* IKZE Section */}
          <div className="space-y-4 p-4 bg-success-light/20 rounded-lg border border-success-light">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success-light rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success">IKZE</h3>
                <ZusText variant="small" className="text-success">
                  Indywidualne Konto Zabezpieczenia Emerytalnego
                </ZusText>
              </div>
            </div>
            
            <div className="space-y-3">
              <ZusText variant="small" className="text-secondary">
                Ulga podatkowa do 19% od wpłat
              </ZusText>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Miesięczna wpłata IKZE: {ikzeContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={ikzeContribution}
                  onChange={(e) => setIkzeContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer bg-success-light"
                />
                <div className="flex justify-between text-xs text-success">
                  <span>0 zł</span>
                  <span>1000 zł</span>
                </div>
              </div>
              
              <div className="p-2 bg-success-light/30 rounded text-xs text-success">
                💰 Limit roczny: 6760 zł (2024)
              </div>
            </div>
          </div>

          {/* PPE Section */}
          <div className="space-y-4 p-4 bg-warning-light/20 rounded-lg border border-warning-light">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-warning-light rounded-lg flex items-center justify-center">
                <span className="text-warning font-bold">🛡️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-warning">PPE</h3>
                <ZusText variant="small" className="text-warning">
                  Pracownicze Programy Emerytalne
                </ZusText>
              </div>
            </div>
            
            <div className="space-y-3">
              <ZusText variant="small" className="text-secondary">
                Dodatkowe korzyści od pracodawcy
              </ZusText>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Miesięczna składka PPE: {ppeContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="50"
                  value={ppeContribution}
                  onChange={(e) => setPpeContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer bg-warning-light"
                />
                <div className="flex justify-between text-xs text-secondary">
                  <span>0 zł</span>
                  <span>800 zł</span>
                </div>
              </div>
              
              <div className="p-2 bg-warning-light/30 rounded text-xs text-secondary">
                🏢 Sprawdź dostępność w swoim zakładzie pracy
              </div>
            </div>
          </div>
        </div>

        {/* Action Summary */}
        {totalContributions > 0 && (
          <div className="p-4 bg-success-light/20 rounded-lg border border-success-light">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <div className="space-y-1">
                <h4 className="font-semibold text-primary">
                  Świetny wybór! Twoje dodatkowe oszczędności emerytalne:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-secondary">Miesięczne składki:</span>
                    <br />
                    <span className="font-semibold text-success">
                      {totalContributions.toLocaleString()} zł
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary">Roczne oszczędności:</span>
                    <br />
                    <span className="font-semibold text-info">
                      {(totalContributions * 12).toLocaleString()} zł
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary">Dodatkowa emerytura:</span>
                    <br />
                    <span className="font-semibold text-success">
                      +{totalImpact.toLocaleString()} zł/mies.
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary">Łączny czas:</span>
                    <br />
                    <span className="font-semibold text-warning">
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
        return "bg-success-light border-success";
      case "accent":
        return "bg-warning-light border-warning";
      default:
        return "bg-primary-light border-primary";
    }
  };

  const getValueColor = () => {
    switch (tone) {
      case "success":
        return "text-success";
      case "accent":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  const getIconBg = () => {
    switch (tone) {
      case "success":
        return "bg-success text-white";
      case "accent":
        return "bg-warning text-white";
      default:
        return "bg-primary text-white";
    }
  };

  const getInsightBg = () => {
    if (!insight) return "";
    switch (insight.type) {
      case "warning":
        return "bg-warning-light border-warning text-primary";
      case "success":
        return "bg-success-light border-success text-primary";
      default:
        return "bg-accent-light border-accent text-primary";
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 border-2 ${getBgColor()} h-full`}
    >
      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBg()}`}>
              <span className="text-lg">{icon}</span>
            </div>
            <div>
              <div
                className="text-lg font-semibold text-primary"
                style={{ fontSize: `calc(1rem * var(--font-scale))` }}
              >
                {title}
              </div>
              <ZusText variant="small" className="text-neutral">
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
          <ZusText variant="small" className="text-neutral">
            {description}
          </ZusText>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral">Postęp celu</span>
              <span className={`font-semibold ${getValueColor()}`}>{progress}%</span>
            </div>
            <div className="w-full bg-neutral-light rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getValueColor().replace('text-', 'bg-')}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Interactive Controls */}
        {interactive && interactive.type === "slider" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-primary">
                {interactive.label}
              </label>
              <button
                onMouseEnter={() => setShowHelp(true)}
                onMouseLeave={() => setShowHelp(false)}
                className="text-neutral hover:text-primary transition-colors w-5 h-5 flex items-center justify-center"
              >
                <span className="text-xs">❓</span>
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
                className={`slider w-full h-2 rounded-lg appearance-none cursor-pointer ${getValueColor().replace('text-', 'bg-')}`}
                style={{
                  background: `linear-gradient(to right, var(--color-${tone === 'success' ? 'success' : tone === 'accent' ? 'warning' : 'primary'}) 0%, var(--color-${tone === 'success' ? 'success' : tone === 'accent' ? 'warning' : 'primary'}) ${
                    ((interactive.value! - interactive.min!) /
                      (interactive.max! - interactive.min!)) *
                    100
                  }%, var(--color-neutral-light) ${
                    ((interactive.value! - interactive.min!) /
                      (interactive.max! - interactive.min!)) *
                    100
                  }%, var(--color-neutral-light) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-neutral mt-1">
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
              <div className="absolute z-20 bottom-full mb-2 left-0 right-0 bg-primary text-white text-xs p-3 rounded shadow-lg">
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
        return "text-success";
      case "accent":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  const getBgColor = () => {
    switch (tone) {
      case "success":
        return "hover:bg-success-light";
      case "accent":
        return "hover:bg-warning-light";
      default:
        return "hover:bg-primary-light";
    }
  };

  const getIconBg = () => {
    switch (tone) {
      case "success":
        return "bg-success";
      case "accent":
        return "bg-warning";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 bg-zus-card backdrop-blur rounded-xl border border-neutral ${getBgColor()} hover:shadow-md transition-all duration-200 cursor-pointer`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconBg()}`}>
        <span className="text-white text-lg">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-primary truncate">
          {title}
        </div>
        <div className={`text-xl font-bold ${getValueColor()} truncate`}>
          {value}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-neutral-light rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${getValueColor().replace('text-', 'bg-')}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Detailed Retirement Analysis Section Component
interface DetailedRetirementAnalysisSectionProps {
  retirementYear: number;
  currentSalary: number;
  projectedPension: number;
  targetPension: number;
}

function DetailedRetirementAnalysisSection({
  retirementYear,
  currentSalary,
  projectedPension,
  targetPension,
}: DetailedRetirementAnalysisSectionProps) {
  // Mock calculations - in real app these would come from backend
  const averageBenefitAtRetirement = 2137;
  const salaryWithoutSickLeave = currentSalary * 1.05; // 5% higher without sick leave periods
  const sickLeaveImpact = salaryWithoutSickLeave - currentSalary;

  return (
    <div className="bg-zus-card rounded-2xl">
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <header className="space-y-3">
          <h1
            className="text-2xl md:text-3xl font-semibold text-primary"
            style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}
          >
            Szczegółowa analiza emerytalna
          </h1>
          <ZusText variant="body" className="text-secondary max-w-2xl">
            Poznaj szczegóły swojej przyszłej emerytury, wpływ chorobowego oraz scenariusze 
            opóźnienia przejścia na emeryturę.
          </ZusText>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Projections Card */}
          <div className="space-y-4 p-6 bg-info-light/20 rounded-xl border border-info-light">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-info">Aktualne prognozy</h3>
                <ZusText variant="small" className="text-info">
                  Stan na {retirementYear} rok
                </ZusText>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-zus-card/60 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary">Średnie świadczenie w roku przejścia</span>
                  <span className="font-bold text-lg text-info">
                    {averageBenefitAtRetirement.toLocaleString()} zł
                  </span>
                </div>
                <ZusText variant="small" className="text-neutral mt-1">
                  Średnia emerytura w {retirementYear} roku
                </ZusText>
              </div>

              <div className="bg-zus-card/60 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary">Twoja prognoza ZUS</span>
                  <span className="font-bold text-lg text-info">
                    {projectedPension.toLocaleString()} zł
                  </span>
                </div>
                <div className="mt-2 text-xs">
                  {projectedPension > averageBenefitAtRetirement ? (
                    <span className="text-success flex items-center gap-1">
                      <span>✓</span>
                      <span>O {(projectedPension - averageBenefitAtRetirement).toLocaleString()} zł wyższa od średniej</span>
                    </span>
                  ) : (
                    <span className="text-warning flex items-center gap-1">
                      <span>⚠️</span>
                      <span>O {(averageBenefitAtRetirement - projectedPension).toLocaleString()} zł niższa od średniej</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sick Leave Impact Card */}
          <div className="space-y-4 p-6 bg-success-light/20 rounded-xl border border-success-light">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏥</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-success">Wpływ chorobowego</h3>
                <ZusText variant="small" className="text-success">
                  Analiza nieobecności chorobowych
                </ZusText>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-zus-card/60 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary">Wynagrodzenie bez chorobowego</span>
                  <span className="font-bold text-lg text-success">
                    {salaryWithoutSickLeave.toLocaleString()} zł
                  </span>
                </div>
                <ZusText variant="small" className="text-neutral mt-1">
                  Potencjalne wynagrodzenie bez okresów choroby
                </ZusText>
              </div>

              <div className="bg-zus-card/60 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary">Wpływ na emeryturę</span>
                  <span className="font-bold text-lg text-success">
                    +{Math.round(sickLeaveImpact * 0.25).toLocaleString()} zł
                  </span>
                </div>
                <ZusText variant="small" className="text-neutral mt-1">
                  Szacowany wzrost emerytury bez chorobowego
                </ZusText>
              </div>

              <div className="p-3 bg-success-light/30 rounded-lg border border-success-light">
                <ZusText variant="small" className="text-success">
                  💡 Każdy dzień chorobowy może wpłynąć na wysokość przyszłej emerytury. 
                  Dbaj o zdrowie i minimalizuj nieobecności.
                </ZusText>
              </div>
            </div>
          </div>
        </div>

        {/* Retirement Delay Scenarios - Interactive Chart */}
        <InteractiveRetirementChart 
          baseRetirementYear={retirementYear}
          basePension={projectedPension}
          targetPension={targetPension}
        />

        {/* Target Achievement Analysis - Now integrated into the chart above */}
      </div>
    </div>
  );
}

// Interactive Retirement Chart Component
interface InteractiveRetirementChartProps {
  baseRetirementYear: number;
  basePension: number;
  targetPension: number;
}

function InteractiveRetirementChart({ 
  baseRetirementYear, 
  basePension, 
  targetPension 
}: InteractiveRetirementChartProps) {
  const [selectedYear, setSelectedYear] = useState(baseRetirementYear);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Generate chart data points (mock realistic data)
  const generateChartData = () => {
    const data = [];
    const startYear = baseRetirementYear;
    const endYear = baseRetirementYear + 25;
    
    for (let year = startYear; year <= endYear; year++) {
      const yearsDelay = year - baseRetirementYear;
      // Pension increase formula: diminishing returns over time
      const pensionIncrease = yearsDelay * 68 * (1 - yearsDelay * 0.005);
      const totalPension = basePension + Math.max(0, pensionIncrease);
      
      data.push({
        year,
        yearsDelay,
        pension: totalPension,
        pensionIncrease: Math.max(0, pensionIncrease)
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const maxPension = Math.max(...chartData.map(d => d.pension));
  const minPension = Math.min(...chartData.map(d => d.pension));
  const pensionRange = maxPension - minPension;

  // Calculate target achievement
  const yearlyIncrease = 68;
  const pensionGap = Math.max(0, targetPension - basePension);
  const extraYearsNeeded = Math.ceil(pensionGap / yearlyIncrease);
  const targetRetirementYear = baseRetirementYear + extraYearsNeeded;
  const targetAchievable = targetRetirementYear <= baseRetirementYear + 25;

  // Find selected data point
  const selectedData = chartData.find(d => d.year === selectedYear) || chartData[0];

  // Generate SVG path for the curve (smooth curve using Bezier curves)
  const generatePath = () => {
    const width = 800;
    const height = 300;
    const padding = 40;
    
    const points = chartData.map((d, i) => {
      const x = padding + (i / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.pension - minPension) / pensionRange) * (height - 2 * padding);
      return { x, y };
    });
    
    if (points.length < 2) return '';
    
    // Create smooth curve using quadratic Bezier curves
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      
      if (i === 1) {
        // First curve point
        const controlX = previous.x + (current.x - previous.x) * 0.5;
        const controlY = previous.y;
        path += ` Q ${controlX},${controlY} ${current.x},${current.y}`;
      } else {
        // Smooth transition between points
        const controlX = previous.x + (current.x - previous.x) * 0.5;
        const controlY = previous.y + (current.y - previous.y) * 0.3;
        path += ` Q ${controlX},${controlY} ${current.x},${current.y}`;
      }
    }
    
    return path;
  };

  return (
    <div className="bg-zus-card rounded-2xl">
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📈</span>
            </div>
            <div>
              <h1
                className="text-2xl md:text-3xl font-semibold text-primary"
                style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}
              >
                Scenariusze emerytalne
              </h1>
              <ZusText variant="body" className="text-secondary">
                Przesuń suwak aby zobaczyć jak opóźnienie emerytury wpłynie na wysokość świadczenia
              </ZusText>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Chart */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-info-light/20 rounded-xl border border-info-light">
              {/* Chart SVG */}
              <div className="relative">
                <svg
                  width="100%"
                  height="300"
                  viewBox="0 0 800 300"
                  className="overflow-visible"
                >
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="80" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 30" fill="none" stroke="rgb(var(--color-neutral))" strokeWidth="1" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="800" height="300" fill="url(#grid)" />
                  
                  {/* Chart curve */}
                  <path
                    d={generatePath()}
                    fill="none"
                    stroke="url(#zusGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  
                  {/* Chart area fill */}
                  <path
                    d={`${generatePath()} L 760,260 L 40,260 Z`}
                    fill="url(#zusAreaGradient)"
                    opacity="0.15"
                    className="transition-all duration-300"
                  />
                  
                  {/* ZUS Gradient definition */}
                  <defs>
                    <linearGradient id="zusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(var(--color-primary))" />
                      <stop offset="50%" stopColor="rgb(var(--color-info))" />
                      <stop offset="100%" stopColor="rgb(var(--color-success))" />
                    </linearGradient>
                    <linearGradient id="zusAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(var(--color-info))" />
                      <stop offset="100%" stopColor="rgb(var(--color-info))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Data points */}
                  {chartData.map((d, i) => {
                    const x = 40 + (i / (chartData.length - 1)) * 720;
                    const y = 260 - ((d.pension - minPension) / pensionRange) * 220;
                    const isSelected = d.year === selectedYear;
                    const isHovered = hoveredPoint === i;
                    
                    return (
                      <g key={d.year}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 8 : isHovered ? 6 : 4}
                          fill={isSelected ? "rgb(var(--color-primary))" : isHovered ? "rgb(var(--color-info))" : "#ffffff"}
                          stroke={isSelected ? "#ffffff" : "rgb(var(--color-primary))"}
                          strokeWidth="2"
                          className="cursor-pointer transition-all duration-200"
                          onClick={() => setSelectedYear(d.year)}
                          onMouseEnter={() => setHoveredPoint(i)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        {isSelected && (
                          <text
                            x={x}
                            y={y - 15}
                            textAnchor="middle"
                            className="text-xs font-semibold"
                            fill="rgb(var(--color-primary))"
                          >
                            {d.pension.toLocaleString()} zł
                          </text>
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Target line */}
                  {targetAchievable && (
                    <line
                      x1="40"
                      y1={260 - ((targetPension - minPension) / pensionRange) * 220}
                      x2="760"
                      y2={260 - ((targetPension - minPension) / pensionRange) * 220}
                      stroke="rgb(var(--color-warning))"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  )}
                  
                  {/* Axis labels */}
                  <text x="40" y="295" className="text-xs" fill="rgb(var(--color-secondary))">{baseRetirementYear}</text>
                  <text x="760" y="295" className="text-xs" fill="rgb(var(--color-secondary))" textAnchor="end">
                    {baseRetirementYear + 25}
                  </text>
                  <text x="15" y="260" className="text-xs" fill="rgb(var(--color-secondary))" textAnchor="end">
                    {minPension.toLocaleString()}
                  </text>
                  <text x="15" y="50" className="text-xs" fill="rgb(var(--color-secondary))" textAnchor="end">
                    {maxPension.toLocaleString()}
                  </text>
                </svg>
              </div>
              
              {/* Year Slider */}
              <div className="mt-6 space-y-3">
                <label className="text-sm font-medium text-primary">
                  Rok przejścia na emeryturę: {selectedYear}
                </label>
                <input
                  type="range"
                  min={baseRetirementYear}
                  max={baseRetirementYear + 25}
                  step="1"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer bg-info-light"
                />
                <div className="flex justify-between text-xs text-info">
                  <span>{baseRetirementYear}</span>
                  <span className="font-medium">Wybrany: {selectedYear}</span>
                  <span>{baseRetirementYear + 25}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Year Details */}
          <div className="space-y-4">
            <div className="p-6 bg-primary-light/20 rounded-xl border border-primary-light">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {selectedYear}
                  </div>
                  <div className="text-sm text-secondary">
                    {selectedData.yearsDelay === 0 ? 'Planowany rok emerytury' : `+${selectedData.yearsDelay} lat pracy`}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-zus-card/60 p-3 rounded-lg">
                    <div className="text-xs text-secondary">Miesięczna emerytura</div>
                    <div className="text-xl font-bold text-primary">
                      {selectedData.pension.toLocaleString()} zł
                    </div>
                  </div>
                  
                  {selectedData.yearsDelay > 0 && (
                    <div className="bg-zus-card/60 p-3 rounded-lg">
                      <div className="text-xs text-secondary">Wzrost emerytury</div>
                      <div className="text-lg font-semibold text-success">
                        +{selectedData.pensionIncrease.toLocaleString()} zł
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-zus-card/60 p-3 rounded-lg">
                    <div className="text-xs text-secondary">Wzrost roczny</div>
                    <div className="text-sm font-medium text-info">
                      ~{selectedData.yearsDelay > 0 ? Math.round(selectedData.pensionIncrease / selectedData.yearsDelay) : 68} zł/rok
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Target Achievement Card - INTEGRATED HERE */}
            <div className={`p-6 rounded-xl border-2 ${
              selectedData.pension >= targetPension 
                ? 'bg-success-light/20 border-success-light' 
                : 'bg-warning-light/20 border-warning-light'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {selectedData.pension >= targetPension ? '🎯' : '⏳'}
                  </span>
                  <h4 className={`font-semibold ${
                    selectedData.pension >= targetPension ? 'text-success' : 'text-secondary'
                  }`}>
                    {selectedData.pension >= targetPension ? 'Cel osiągnięty!' : 'Ile dłużej pracować aby osiągnąć cel?'}
                  </h4>
                </div>
                
                {selectedData.pension >= targetPension ? (
                  <div className="space-y-2">
                    <div className="text-sm text-success">
                      Przekroczysz swój cel o {(selectedData.pension - targetPension).toLocaleString()} zł miesięcznie!
                    </div>
                    <div className="text-xs text-success">
                      💡 Możesz rozważyć wcześniejszą emeryturę lub zwiększenie celów oszczędnościowych.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-secondary">
                      Brakuje: {(targetPension - selectedData.pension).toLocaleString()} zł miesięcznie
                    </div>
                    {targetAchievable && (
                      <div className="text-xs text-secondary">
                        💡 Pracuj do {targetRetirementYear} roku aby osiągnąć cel {targetPension.toLocaleString()} zł/mies.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Interactive Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral">
          <div className="flex items-center gap-3">
            <div className="w-4 h-1 rounded" style={{
              background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-info)), rgb(var(--color-success)))'
            }}></div>
            <span className="text-sm text-secondary">Prognoza emerytalna</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-1 bg-warning rounded border-dashed border-2 border-warning"></div>
            <span className="text-sm text-secondary">Cel emerytalny ({targetPension.toLocaleString()} zł)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
            <span className="text-sm text-secondary">Wybrana opcja</span>
          </div>
        </div>
      </div>
    </div>
  );
}

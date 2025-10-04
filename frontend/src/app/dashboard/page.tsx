"use client";

import React from "react";
import { ZusText, ZusHeading } from "@/components/zus-ui";

// Interactive Scenario Components
import { PromotionForecastSection } from "@/components/dashboard/PromotionForecastSection";
import { RetirementSliderSection } from "@/components/dashboard/RetirementSliderSection";
import { AdditionalSavingsSection } from "@/components/dashboard/AdditionalSavingsSection";
import { RiskScenariosSection } from "@/components/dashboard/RiskScenariosSection";

// Educational Components
import { QuizSection } from "@/components/dashboard/QuizSection";

function fmtPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

export default function PensionDashboard() {
  
  // Sample data - in real app this would come from state/API
  const pensionData = {
    nominalPension: 3250,
    targetPension: 4000,
    inflationRate: 0.03,
    yearsToRetirement: 30,
    realValue: 2275, // purchasing power today
    monthlyGap: 750 // gap to target
  };

  // Interactive state for controls
  const [salaryAdjustment, setSalaryAdjustment] = React.useState(0); // percentage adjustment
  const [inflationSlider, setInflationSlider] = React.useState(3.0); // inflation rate
  const [additionalSavings, setAdditionalSavings] = React.useState(0); // monthly savings

  // Calculate dynamic values based on controls
  const adjustedSalary = pensionData.nominalPension * (1 + salaryAdjustment / 100);
  const adjustedRealValue = pensionData.nominalPension / Math.pow(1 + inflationSlider / 100, pensionData.yearsToRetirement);
  const savingsImpact = additionalSavings * 0.3; // simplified calculation

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: 'rgb(var(--color-bg))',
        color: 'rgb(var(--color-text))'
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
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid currentColor;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .slider:focus {
          outline: none;
        }
        
        .slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-zus-card rounded-2xl">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Header */}
            <header className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}>
                Twój panel emerytalny
              </h1>
              <ZusText variant="body" className="text-neutral-600 max-w-2xl">
                Przegląd Twojej prognozy i narzędzia do planowania przyszłości. 
                Sprawdź aktualny stan swoich oszczędności emerytalnych i poznaj opcje ich zwiększenia.
              </ZusText>
            </header>

            {/* 1. Overview Section - Top Row (Large Tiles) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OverviewTile
                tone="primary"
                icon="🏛️"
                title="Prognoza ZUS"
                subtitle="Miesięczna emerytura nominalna"
                value={fmtPLN(adjustedSalary)}
                description="Na podstawie Twojej historii składek"
                showChart={true}
                chartData={{
                  current: adjustedSalary,
                  historical: [2800, 2950, 3100, 3250],
                  projection: [adjustedSalary, adjustedSalary * 1.05, adjustedSalary * 1.1, adjustedSalary * 1.15, adjustedSalary * 1.2]
                }}
                interactive={{
                  type: "slider",
                  label: "Symulacja podwyżki wynagrodzenia",
                  value: salaryAdjustment,
                  min: -20,
                  max: 50,
                  step: 5,
                  suffix: "%",
                  onChange: setSalaryAdjustment,
                  helpText: "Wyższe składki = wyższa emerytura. Każde 100 zł podwyżki to ~25 zł więcej emerytury miesięcznie."
                }}
              />
              
              <OverviewTile
                tone="success"
                icon="💰"
                title="Siła nabywcza dziś"
                subtitle="Wartość w dzisiejszych pieniądzach"
                value={fmtPLN(adjustedRealValue)}
                description={`Uwzględnia inflację ${inflationSlider.toFixed(1)}% rocznie`}
                showChart={true}
                chartData={{
                  nominal: pensionData.nominalPension,
                  real: adjustedRealValue,
                  inflationImpact: pensionData.nominalPension - adjustedRealValue
                }}
                interactive={{
                  type: "slider",
                  label: "Przewidywana inflacja",
                  value: inflationSlider,
                  min: 1.0,
                  max: 6.0,
                  step: 0.5,
                  suffix: "%",
                  onChange: setInflationSlider,
                  helpText: "Inflacja zmniejsza siłę nabywczą. Niższa inflacja = większa wartość emerytury w przyszłości."
                }}
                insight={{
                  type: "info",
                  text: "Inflacja zmniejsza wartość pieniądza w czasie"
                }}
              />

              <OverviewTile
                tone="accent"
                icon={adjustedSalary + savingsImpact >= pensionData.targetPension ? "🎯" : "📈"}
                title={adjustedSalary + savingsImpact >= pensionData.targetPension ? "Cel osiągnięty!" : "Cel emerytalny"}
                subtitle="Twoja oczekiwana emerytura"
                value={fmtPLN(pensionData.targetPension)}
                description={
                  adjustedSalary + savingsImpact >= pensionData.targetPension
                    ? `Gratulacje! Osiągniesz swój cel z dodatkową oszczędnością!`
                    : `Brakuje: ${fmtPLN(Math.max(0, pensionData.targetPension - adjustedSalary - savingsImpact))} miesięcznie`
                }
                progress={Math.round(((adjustedSalary + savingsImpact) / pensionData.targetPension) * 100)}
                interactive={{
                  type: "slider",
                  label: "Dodatkowe oszczędności",
                  value: additionalSavings,
                  min: 0,
                  max: 1000,
                  step: 50,
                  suffix: " zł/mies.",
                  onChange: setAdditionalSavings,
                  helpText: "IKE, IKZE, PPK i inne oszczędności mogą znacząco zwiększyć Twoją przyszłą emeryturę."
                }}
              />
            </div>

            {/* 2. Interactive Scenarios - Second Row */}
            <div className="space-y-6">
              <header className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}>
                    Scenariusze &quot;co jeśli&quot;
                </h1>
                <ZusText variant="body" className="text-neutral-600 max-w-2xl">
                    Sprawdź jak różne decyzje wpłyną na Twoją przyszłą emeryturę
                </ZusText>
            </header>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PromotionForecastSection />
                <RetirementSliderSection />
                <AdditionalSavingsSection />
                <RiskScenariosSection />
                <QuizSection />
                {/* Placeholder for future component */}
                <div className="bg-gray-50 rounded-xl p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">🚧</span>
                    <p className="text-gray-500">Kolejne funkcje</p>
                    <p className="text-sm text-gray-400">już wkrótce</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Planning & Optimization - Coming Soon */}
            <div className="space-y-6">
              <ZusHeading level={2} className="text-zus-navy">
                Planowanie i optymalizacja
              </ZusHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "Symulacja awansu",
                  "Rekomendacje ekspertów", 
                  "Plan oszczędzania",
                  "Raport PDF"
                ].map((title, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 h-32 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">⏳</span>
                      <p className="text-sm text-gray-500">{title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Summary & Export - Bottom Row */}
            <div className="space-y-6">
              <ZusHeading level={2} className="text-zus-navy">
                Podsumowanie
              </ZusHeading>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  "Końcowa prognoza emerytalna",
                  "Eksport i udostępnianie"
                ].map((title, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-8 h-40 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl mb-2 block">📊</span>
                      <p className="text-lg text-gray-500">{title}</p>
                      <p className="text-sm text-gray-400 mt-2">już wkrótce</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Overview Tile Component --- */
interface OverviewTileProps {
  tone: "primary" | "success" | "accent";
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  description: string;
  showChart?: boolean;
  chartData?: {
    current?: number;
    historical?: number[];
    projection?: number[];
    nominal?: number;
    real?: number;
    inflationImpact?: number;
  };
  interactive?: {
    type: "clickable" | "hover" | "slider";
    text?: string;
    onClick?: () => void;
    // Slider-specific props
    label?: string;
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
  progress?: number; // percentage for progress bar
}

function OverviewTile({
  tone,
  icon,
  title,
  subtitle,
  value,
  description,
  showChart,
  chartData,
  interactive,
  insight,
  progress
}: OverviewTileProps) {
  const getBgColor = () => {
    switch (tone) {
      case "success":
        return "bg-[var(--color-zus-green-bg)]";
      case "accent":
        return "bg-blue-50";
      default:
        return "bg-zus-bg";
    }
  };

  const getValueColor = () => {
    switch (tone) {
      case "success":
        return "text-[var(--zus-green)]";
      case "accent":
        return "text-blue-600";
      default:
        return "text-[#2E6AA2]";
    }
  };

  const getCircleColor = () => {
    switch (tone) {
      case "success":
        return "fill-[var(--zus-green)]/5";
      case "accent":
        return "fill-blue-500/5";
      default:
        return "fill-[#2E6AA2]/5";
    }
  };

  const getInsightBg = () => {
    if (!insight) return "";
    switch (insight.type) {
      case "warning":
        return "bg-orange-50 text-orange-800";
      case "success":
        return "bg-green-50 text-green-800";
      default:
        return "bg-blue-50 text-blue-800";
    }
  };

  const renderMiniChart = () => {
    if (!showChart || !chartData) return null;

    // Simple line chart for ZUS projection
    if (chartData.historical && chartData.projection) {
      const allData = [...chartData.historical, ...chartData.projection];
      const max = Math.max(...allData);
      const min = Math.min(...allData);
      const range = max - min;
      
      return (
        <div className="mt-4 h-16 relative">
          <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
            {/* Historical data (solid line) */}
            <polyline
              fill="none"
              stroke={getValueColor().replace('text-', '')}
              strokeWidth="2"
              points={chartData.historical.map((val, i) => 
                `${(i / (chartData.historical!.length - 1)) * 80},${60 - ((val - min) / range) * 50}`
              ).join(' ')}
            />
            {/* Projection (dashed line) */}
            <polyline
              fill="none"
              stroke={getValueColor().replace('text-', '')}
              strokeWidth="2"
              strokeDasharray="4,2"
              points={chartData.projection.map((val, i) => 
                `${80 + (i / (chartData.projection!.length - 1)) * 120},${60 - ((val - min) / range) * 50}`
              ).join(' ')}
            />
            {/* Current point */}
            <circle
              cx="80"
              cy={60 - ((chartData.current! - min) / range) * 50}
              r="3"
              fill={getValueColor().replace('text-', '')}
            />
          </svg>
          <div className="absolute bottom-0 left-0 text-xs text-gray-500">Historia</div>
          <div className="absolute bottom-0 right-0 text-xs text-gray-500">Prognoza</div>
        </div>
      );
    }

    // Inflation impact chart
    if (chartData.nominal && chartData.real) {
      const realPercent = (chartData.real / chartData.nominal) * 100;
      
      return (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Nominalna</span>
            <span>Realna</span>
          </div>
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gray-400 rounded-full`}
              style={{ width: '100%' }}
            />
            <div 
              className={`absolute top-0 left-0 h-full ${getValueColor().replace('text-', 'bg-')} rounded-full`}
              style={{ width: `${realPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{fmtPLN(chartData.nominal)}</span>
            <span>{fmtPLN(chartData.real)}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 cursor-pointer ${getBgColor()} ${
        interactive?.type === "hover" ? "hover:shadow-lg hover:scale-[1.02]" : ""
      }`}
      onClick={interactive?.onClick}
      title={interactive?.text}
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
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="text-sm font-semibold text-neutral-700" style={{ fontSize: `calc(0.8125rem * var(--font-scale))` }}>
              {title}
            </div>
            <ZusText variant="small" className="text-neutral-600">
              {subtitle}
            </ZusText>
          </div>
        </div>

        {/* Value - Now colored based on tone */}
        <div className={`text-3xl md:text-4xl font-extrabold transition-transform duration-300 group-hover:scale-[1.02] ${getValueColor()}`} 
             style={{ fontSize: `calc(1.875rem * var(--font-scale))` }}>
          {value}
        </div> 

        {/* Interactive Controls */}
        {interactive && interactive.type === "slider" && (
          <div className="space-y-3">
            {/* Slider control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <ZusText variant="small" className="font-medium text-neutral-700">
                  {interactive.label}
                </ZusText>
                <span className="text-sm font-bold text-neutral-800">
                  {interactive.value}{interactive.suffix}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={interactive.min}
                  max={interactive.max}
                  step={interactive.step}
                  value={interactive.value}
                  onChange={(e) => interactive.onChange?.(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${getValueColor().replace('text-', '')} 0%, ${getValueColor().replace('text-', '')} ${((interactive.value! - interactive.min!) / (interactive.max! - interactive.min!)) * 100}%, #e5e7eb ${((interactive.value! - interactive.min!) / (interactive.max! - interactive.min!)) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{interactive.min}{interactive.suffix}</span>
                  <span>{interactive.max}{interactive.suffix}</span>
                </div>
              </div>
            </div>

            {interactive.helpText && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <ZusText variant="small" className="text-blue-800 font-medium">
                  🧠 Jak to wpływa?
                </ZusText>
                <ZusText variant="small" className="text-blue-600 mt-1">
                  {interactive.helpText}
                </ZusText>
              </div>
            )}
          </div>
        )}

        {/* Progress bar if provided */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Postęp do celu</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getValueColor().replace('text-', 'bg-')}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          
        )}

        {/* Description */}
        <ZusText variant="small" className="text-neutral-700">
          {description}
        </ZusText>

        {/* Insight */}
        {insight && (
          <div className={`p-3 rounded-lg ${getInsightBg()}`}>
            <ZusText variant="small" className="font-medium">
              💡 {insight.text}
            </ZusText>
          </div>
        )}

        {/* Interactive hint for non-slider types */}
        {interactive && interactive.type !== "slider" && interactive.text && (
          <div className="text-xs text-neutral-500 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
            {interactive.type === "clickable" ? "🖱️" : "👋"} {interactive.text}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { retirementSourcesAtom } from "@/lib/store/atoms";
import CustomDataEntrySection from "@/components/dashboard/custom-data-entry-section";

import React from "react";
import DetailedRetirementAnalysisSection from "@/components/dashboard/detailed-retirement-analysis";
import AdditionalRetirementSavingsSection from "@/components/dashboard/additional-savings";
import OverviewTile from "@/components/dashboard/overview-tile";
import StickyNavigation from "@/components/dashboard/sticky-navigation";
import { ZusButton } from "@/components/zus-ui";
import { ResetButton } from "@/components/flow/reset-button";
import { useReactToPrint } from "react-to-print";

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
  
  // Use atom for retirement sources to read values for calculations
  const [retirementSources] = useAtom(retirementSourcesAtom);
  const ppkContribution = retirementSources.ppk || 0;
  const ikzeContribution = retirementSources.ikze || 0;
  const ppeContribution = retirementSources.ppe || 0;
  
  // Sticky bar state
  const [isSticky, setIsSticky] = useState(false);
  const tilesRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  // React-to-print hook
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Raport Emerytalny ZUS',
  });

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
    <div ref={componentRef}>

    <div
      className="min-h-screen"
      style={{
        backgroundColor: "rgb(var(--color-bg))",
        color: "rgb(var(--color-text))",
      }}
    >
      {/* Sticky Top Bar */}
      {isSticky && (
        <div className="no-print">
          <StickyNavigation
            adjustedSalary={adjustedSalary}
            adjustedRealValue={adjustedRealValue}
            savingsImpact={savingsImpact}
            additionalRetirementImpact={additionalRetirementImpact}
            pensionData={pensionData}
            fmtPLN={fmtPLN}
          />
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

        /* Print styles for better PDF output */
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            transform: scale(0.8);
            transform-origin: top left;
            width: 125%; /* Compensate for the scale */
          }
          
          .no-print {
            display: none !important;
          }
          
          div {
            break-inside: avoid;
          }
          
          /* Force single column layout for print */
          .grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 1rem !important;
            break-inside: avoid;
          }
          
          .grid > * {
            width: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>

      <div className={`max-w-7xl mx-auto py-8 px-4 flex flex-col gap-8 ${isSticky ? 'pt-24' : ''}`}>
        {/* Reference tiles for scroll detection */}
        <div ref={tilesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OverviewTile
            tone="primary"
            icon="ZUS"
            title="Prognoza ZUS"
            subtitle="Przewidywana emerytura"
            value={fmtPLN(adjustedSalary)}
            description="Przy obecnym trendzie składek"
            interactive={{
              type: "slider",
              label: "Wzrost wynagrodzenia",
              value: salaryAdjustment,
              min: -50,
              max: 100,
              step: 5,
              suffix: "%",
              onChange: setSalaryAdjustment,
              helpText: "Przewidywany wzrost wynagrodzenia w ciągu kariery"
            }}
            insight={{
              type: "info",
              text: `Przy ${salaryAdjustment}% wzroście wynagrodzenia, Twoja emerytura wzrośnie o ${fmtPLN(adjustedSalary - pensionData.nominalPension)}`
            }}
          />

          <OverviewTile
            tone="success"
            icon="PLN"
            title="Siła nabywcza dziś"
            subtitle="Wartość w dzisiejszych pieniądzach"
            value={fmtPLN(adjustedRealValue)}
            description={`Za ${pensionData.yearsToRetirement} lat`}
            interactive={{
              type: "slider",
              label: "Inflacja",
              value: inflationSlider,
              min: 0,
              max: 10,
              step: 0.5,
              suffix: "%",
              onChange: setInflationSlider,
              helpText: "Przewidywana średnia inflacja rocznie"
            }}
            insight={{
              type: "warning",
              text: `Przy inflacji ${inflationSlider}% rocznie, siła nabywcza spadnie o ${Math.round((1 - adjustedRealValue/pensionData.nominalPension) * 100)}%`
            }}
          />

          <OverviewTile
            tone="accent"
            icon={
              adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                ? "CEL"
                : "CEL"
            }
            title={
              adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                ? "Cel osiągnięty"
                : "Cel emerytalny"
            }
            subtitle="Docelowa emerytura"
            value={fmtPLN(pensionData.targetPension)}
            description="Kwota potrzebna do komfortowego życia"
            progress={Math.round(
              ((adjustedSalary + savingsImpact + additionalRetirementImpact) /
                pensionData.targetPension) *
                100
            )}
            insight={{
              type: adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension ? "success" : "warning",
              text: adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension 
                ? "Gratulacje! Osiągnąłeś cel emerytalny"
                : `Brakuje ${fmtPLN(pensionData.targetPension - adjustedSalary - savingsImpact - additionalRetirementImpact)} do celu`
            }}
          />
        </div>

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
          totalImpact={additionalRetirementImpact}
        />

        {/* Action Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 pb-4 no-print">
          <ZusButton 
            variant="primary" 
            onClick={handlePrint}
            className="w-full sm:w-auto min-w-[200px]"
          >
            Eksportuj raport
          </ZusButton>
          
          <ResetButton 
            variant="secondary" 
            className="w-full sm:w-auto min-w-[200px]"
          />
        </div>
      </div>
    </div>
    </div>
  );
}

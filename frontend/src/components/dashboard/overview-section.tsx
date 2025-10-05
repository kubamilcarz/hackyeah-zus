import React, { useRef } from 'react';
import OverviewTile from './overview-tile';

interface OverviewSectionProps {
    adjustedSalary: number;
    salaryAdjustment: number;
    setSalaryAdjustment: (value: number) => void;
    adjustedRealValue: number;
    inflationSlider: number;
    setInflationSlider: (value: number) => void;
    savingsImpact: number;
    additionalRetirementImpact: number;
    pensionData: {
        targetPension: number;
    };
    totalAdditionalSavings: number;
    fmtPLN: (value: number) => string;
}

export default function OverviewSection({
    adjustedSalary,
    salaryAdjustment,
    setSalaryAdjustment,
    adjustedRealValue,
    inflationSlider,
    setInflationSlider,
    savingsImpact,
    additionalRetirementImpact,
    pensionData,
    totalAdditionalSavings,
    fmtPLN,
}: OverviewSectionProps) {
    const tilesRef = useRef<HTMLDivElement>(null);

    return (
        <div 
            className="rounded-2xl border"
            style={{
                backgroundColor: `rgb(var(--color-card))`,
                borderColor: `rgb(var(--color-text) / 0.2)`
            }}
        >
            <div className="p-6 md:p-8 flex flex-col gap-6">
                {/* Header */}
                <header className="space-y-3 mb-8">
                    <h1
                        className="font-semibold"
                        style={{ 
                            fontSize: `calc(1.625rem * var(--font-scale))`,
                            color: `rgb(var(--color-text))`
                        }}
                    >
                        Twój panel emerytalny
                    </h1>
                    <div 
                        className="max-w-2xl"
                        style={{ 
                            fontSize: `calc(1rem * var(--font-scale))`,
                            color: `rgb(var(--color-text) / 0.7)`,
                            lineHeight: 1.6
                        }}
                    >
                        Przegląd Twojej prognozy i narzędzia do planowania przyszłości.
                        Sprawdź aktualny stan swoich oszczędności emerytalnych i poznaj
                        opcje ich zwiększenia.
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" ref={tilesRef}>
                    <OverviewTile
                        tone="primary"
                        icon="ZUS"
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
                        }}
                    />

                    <OverviewTile
                        tone="success"
                        icon="PLN"
                        title="Siła nabywcza dziś"
                        subtitle="Wartość w dzisiejszych pieniądzach"
                        value={fmtPLN(adjustedRealValue)}
                        description={`Uwzględnia inflację ${inflationSlider.toFixed(1)}% rocznie`}
                        interactive={{
                            type: "slider",
                            label: "Przewidywana inflacja",
                            value: inflationSlider,
                            min: 1.0,
                            max: 6.0,
                            step: 0.5,
                            suffix: "%",
                            onChange: setInflationSlider,
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
                                ? "CEL"
                                : "CEL"
                        }
                        title={
                            adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                                ? "Cel osiągnięty"
                                : "Cel emerytalny"
                        }
                        subtitle="Twoja oczekiwana emerytura"
                        value={fmtPLN(pensionData.targetPension)}
                        description={
                            adjustedSalary + savingsImpact + additionalRetirementImpact >= pensionData.targetPension
                                ? `Osiągniesz swój cel emerytalny`
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
                                ? `Uwzględniono dodatkowe oszczędności emerytalne`
                                : "Zwiększ wynagrodzenie lub rozpocznij dodatkowe oszczędzanie",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
import StickyTile from "./sticky-tiles";

interface StickyNavigationProps {
  adjustedSalary: number;
  adjustedRealValue: number;
  savingsImpact: number;
  additionalRetirementImpact: number;
  pensionData: {
    nominalPension: number;
    realValue: number;
    targetPension: number;
    yearsToRetirement: number;
  };
  fmtPLN: (amount: number) => string;
}

export default function StickyNavigation({
  adjustedSalary,
  adjustedRealValue,
  savingsImpact,
  additionalRetirementImpact,
  pensionData,
  fmtPLN,
}: StickyNavigationProps) {
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-10 border-b shadow-sm transition-all duration-300"
      style={{
        backgroundColor: `rgb(var(--color-card))`,
        borderColor: `rgb(var(--color-text) / 0.2)`
      }}
    >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <StickyTile
                icon="ZUS"
                title="Prognoza ZUS"
                value={fmtPLN(adjustedSalary)}
                tone="primary"
              />
              <StickyTile
                icon="PLN"
                title="Siła nabywcza dziś"
                value={fmtPLN(adjustedRealValue)}
                tone="success"
              />
              <StickyTile
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
  );
}
import { ZusText } from "../zus-ui";
import InteractiveRetirementChart from "./interactive-chart";

interface DetailedRetirementAnalysisSectionProps {
  retirementYear: number;
  currentSalary: number;
  projectedPension: number;
  targetPension: number;
}

export default function DetailedRetirementAnalysisSection({
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
    <>
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
              Poznaj szczegóły swojej przyszłej emerytury, wpływ chorobowego
              oraz scenariusze opóźnienia przejścia na emeryturę.
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
                  <h3 className="text-xl font-semibold text-info">
                    Aktualne prognozy
                  </h3>
                  <ZusText variant="small" className="text-info">
                    Stan na {retirementYear} rok
                  </ZusText>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zus-card/60 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">
                      Średnie świadczenie w roku przejścia
                    </span>
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
                    <span className="text-sm text-secondary">
                      Twoja prognoza ZUS
                    </span>
                    <span className="font-bold text-lg text-info">
                      {projectedPension.toLocaleString()} zł
                    </span>
                  </div>
                  <div className="mt-2 text-xs">
                    {projectedPension > averageBenefitAtRetirement ? (
                      <span className="text-success flex items-center gap-1">
                        <span>✓</span>
                        <span>
                          O{" "}
                          {(
                            projectedPension - averageBenefitAtRetirement
                          ).toLocaleString()}{" "}
                          zł wyższa od średniej
                        </span>
                      </span>
                    ) : (
                      <span className="text-warning flex items-center gap-1">
                        <span>⚠️</span>
                        <span>
                          O{" "}
                          {(
                            averageBenefitAtRetirement - projectedPension
                          ).toLocaleString()}{" "}
                          zł niższa od średniej
                        </span>
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
                  <h3 className="text-xl font-semibold text-success">
                    Wpływ chorobowego
                  </h3>
                  <ZusText variant="small" className="text-success">
                    Analiza nieobecności chorobowych
                  </ZusText>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zus-card/60 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">
                      Wynagrodzenie bez chorobowego
                    </span>
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
                    <span className="text-sm text-secondary">
                      Wpływ na emeryturę
                    </span>
                    <span className="font-bold text-lg text-success">
                      +{Math.round(sickLeaveImpact * 0.25).toLocaleString()} zł
                    </span>
                  </div>
                  <ZusText variant="small" className="text-neutral mt-1">
                    Szacowany wzrost emerytury bez chorobowego
                  </ZusText>
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg border border-neutral">
                  <ZusText variant="small" className="text-secondary">
                    Każdy dzień chorobowy może wpłynąć na wysokość przyszłej
                    emerytury. Dbaj o zdrowie i minimalizuj nieobecności.
                  </ZusText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InteractiveRetirementChart
        baseRetirementYear={retirementYear}
        basePension={projectedPension}
        targetPension={targetPension}
      />
    </>
  );
}

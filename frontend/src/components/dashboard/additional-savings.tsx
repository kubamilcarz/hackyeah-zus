import { ZusText } from "../zus-ui";

const pensionData = {
  nominalPension: 2300,
  realValue: 1800,
  targetPension: 4200,
  yearsToRetirement: 25,
};

interface AdditionalRetirementSavingsSectionProps {
  ppkContribution: number;
  setPpkContribution: (value: number) => void;
  ikzeContribution: number;
  setIkzeContribution: (value: number) => void;
  ppeContribution: number;
  setPpeContribution: (value: number) => void;
  totalImpact: number;
}

export default function AdditionalRetirementSavingsSection({
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
                  <span className="text-info">Składki:</span>
                  <span>{totalContributions.toLocaleString()} zł/mies.</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-success">Zwrot:</span>
                  <span>{(totalImpact / Math.max(totalContributions, 1) * 100).toFixed(0)}%</span>
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
                <span className="text-info font-bold text-xs">PPK</span>
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
              
              <div className="p-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded text-xs text-secondary">
                Pracodawca dokłada minimalnie 1.5% Twojego wynagrodzenia
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
              
              <div className="p-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded text-xs text-secondary">
                Limit roczny: 6760 zł (2024)
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
              
              <div className="p-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded text-xs text-secondary">
                Sprawdź dostępność w swoim zakładzie pracy
              </div>
            </div>
          </div>
        </div>

        {/* Action Summary */}
        {totalContributions > 0 && (
          <div className="p-4 bg-success-light/20 rounded-lg border border-success-light">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success-light rounded-lg flex items-center justify-center">
                <span className="text-success font-bold text-xs">OK</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-primary">
                  Twoje dodatkowe oszczędności emerytalne
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
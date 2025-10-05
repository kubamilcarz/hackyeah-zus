import { useAtom } from "jotai";
import { retirementSourcesAtom } from "@/lib/store/atoms";
import { useEffect } from "react";

const pensionData = {
  nominalPension: 2300,
  realValue: 1800,
  targetPension: 4200,
  yearsToRetirement: 25,
};

interface AdditionalRetirementSavingsSectionProps {
  totalImpact: number;
}

export default function AdditionalRetirementSavingsSection({
  totalImpact,
}: AdditionalRetirementSavingsSectionProps) {
  const [retirementSources, setRetirementSources] = useAtom(retirementSourcesAtom);
  
  // Force load from localStorage if atom is empty
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('zus-retirement-sources');
      console.log('localStorage data:', savedData);
      
      if (savedData && Object.keys(retirementSources).length === 0) {
        try {
          const parsed = JSON.parse(savedData);
          console.log('Loading from localStorage:', parsed);
          setRetirementSources(parsed);
        } catch (e) {
          console.error('Error parsing retirement sources:', e);
        }
      }
    }
  }, [retirementSources, setRetirementSources]);
  
  const ppkContribution = retirementSources.ppk || 0;
  const ikzeContribution = retirementSources.ikze || 0;
  const ppeContribution = retirementSources.ppe || 0;
  
  console.log('Dashboard retirement sources:', { ppkContribution, ikzeContribution, ppeContribution, retirementSources });
  
  const setPpkContribution = (value: number) => {
    console.log('Setting PPK to:', value);
    const newSources = { ...retirementSources, ppk: value };
    setRetirementSources(newSources);
    // Also update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('zus-retirement-sources', JSON.stringify(newSources));
    }
  };
  
  const setIkzeContribution = (value: number) => {
    console.log('Setting IKZE to:', value);
    const newSources = { ...retirementSources, ikze: value };
    setRetirementSources(newSources);
    // Also update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('zus-retirement-sources', JSON.stringify(newSources));
    }
  };
  
  const setPpeContribution = (value: number) => {
    console.log('Setting PPE to:', value);
    const newSources = { ...retirementSources, ppe: value };
    setRetirementSources(newSources);
    // Also update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('zus-retirement-sources', JSON.stringify(newSources));
    }
  };

  const totalContributions = ppkContribution + ikzeContribution + ppeContribution;

  return (
    <div 
      className="rounded-2xl"
      style={{
        backgroundColor: `rgb(var(--color-card))`,
        borderColor: `rgb(var(--color-text) / 0.2)`,
        border: '1px solid'
      }}
    >
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <header className="space-y-3">
          <h1
            className="font-semibold"
            style={{ 
              fontSize: `calc(1.625rem * var(--font-scale))`,
              color: `rgb(var(--color-text))`
            }}
          >
            Dodatkowe oszczędności emerytalne
          </h1>
          
          {/* Debug info - remove this once working */}
          <div style={{ 
            fontSize: '12px', 
            color: 'gray', 
            fontFamily: 'monospace',
            background: '#f0f0f0',
            padding: '8px',
            borderRadius: '4px'
          }}>
            Debug: PPK={ppkContribution} | IKZE={ikzeContribution} | PPE={ppeContribution} | Total={totalContributions}
            <br/>
            Raw atom: {JSON.stringify(retirementSources)}
            <br/>
            LocalStorage: {typeof window !== 'undefined' ? localStorage.getItem('zus-retirement-sources') || 'null' : 'SSR'}
          </div>
          
          <div 
            className="max-w-2xl"
            style={{ 
              fontSize: `calc(1rem * var(--font-scale))`,
              color: `rgb(var(--color-text) / 0.7)`,
              lineHeight: 1.6
            }}
          >
            Zwiększ swoją przyszłą emeryturę dzięki dodatkowym produktom emerytalnym. 
            Te składki będą bezpośrednio wpływać na Twoją prognozę emerytalną w pierwszym rzędzie.
          </div>
        </header>

        {/* Impact Summary */}
        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
              ? `rgb(var(--color-text) / 0.05)`
              : 'rgba(59, 130, 246, 0.05)', // blue-500/5 for light mode
            borderColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
              ? `rgb(var(--color-text) / 0.2)`
              : 'rgba(59, 130, 246, 0.2)' // blue-500/20 for light mode
          }}
        >
          <div className="flex items-start gap-3">
            <div className="space-y-2">
              <h4 
                className="font-semibold"
                style={{ 
                  fontSize: `calc(1rem * var(--font-scale))`,
                  color: `rgb(var(--color-text))`
                }}
              >
                Wpływ na prognozę emerytalną
              </h4>
              <div 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`,
                  lineHeight: 1.5
                }}
              >
                Dodatkowe produkty emerytalne zwiększą Twoją miesięczną emeryturę o około{" "}
                <span 
                  className="font-semibold"
                  style={{
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text))`
                      : 'rgb(59, 130, 246)' // blue-500 for light mode
                  }}
                >
                  {totalImpact.toLocaleString()} zł
                </span>{" "}
                miesięcznie przy obecnych ustawieniach.
              </div>
              <div 
                className="flex gap-4"
                style={{ fontSize: `calc(0.875rem * var(--font-scale))` }}
              >
                <div className="flex items-center gap-1">
                  <span 
                    style={{
                      color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                        ? `rgb(var(--color-text))`
                        : 'rgb(59, 130, 246)' // blue-500 for light mode
                    }}
                  >
                    Składki:
                  </span>
                  <span style={{ color: `rgb(var(--color-text))` }}>
                    {totalContributions.toLocaleString()} zł/mies.
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span 
                    style={{
                      color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                        ? `rgb(var(--color-text))`
                        : 'rgb(0, 153, 63)' // success color for light mode
                    }}
                  >
                    Zwrot:
                  </span>
                  <span style={{ color: `rgb(var(--color-text))` }}>
                    {(totalImpact / Math.max(totalContributions, 1) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PPK Section */}
          <div 
            className="space-y-4 p-4 rounded-md border"
            style={{
              backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                ? `rgb(var(--color-text) / 0.05)`
                : 'rgba(59, 130, 246, 0.05)', // blue-500/5 for light mode
              borderColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                ? `rgb(var(--color-text) / 0.2)`
                : 'rgba(59, 130, 246, 0.2)' // blue-500/20 for light mode
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{
                  backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.2)`
                    : 'rgba(59, 130, 246, 0.1)' // blue-500/10 for light mode
                }}
              >
                <span 
                  className="font-bold text-xs"
                  style={{
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text))`
                      : 'rgb(59, 130, 246)' // blue-500 for light mode
                  }}
                >
                  PPK
                </span>
              </div>
              <div>
                <h3 
                  className="font-semibold"
                  style={{ 
                    fontSize: `calc(1.125rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text))`
                      : 'rgb(59, 130, 246)' // blue-500 for light mode
                  }}
                >
                  PPK
                </h3>
                <div 
                  style={{ 
                    fontSize: `calc(0.875rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text) / 0.7)`
                      : 'rgb(59, 130, 246)' // blue-500 for light mode
                  }}
                >
                  Pracownicze Plany Kapitałowe
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`
                }}
              >
                Automatyczne składki od pracodawcy + Twoje składki
              </div>
              
              <div className="space-y-2">
                <label 
                  className="font-medium"
                  style={{ 
                    fontSize: `calc(0.875rem * var(--font-scale))`,
                    color: `rgb(var(--color-text))`
                  }}
                >
                  Miesięczna składka PPK: {ppkContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={ppkContribution}
                  onChange={(e) => setPpkContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-md appearance-none cursor-pointer"
                  style={{
                    background: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `linear-gradient(to right, rgb(var(--color-text)) 0%, rgb(var(--color-text)) ${(ppkContribution / 1000) * 100}%, rgb(var(--color-text) / 0.3) ${(ppkContribution / 1000) * 100}%, rgb(var(--color-text) / 0.3) 100%)`
                      : `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${(ppkContribution / 1000) * 100}%, rgb(203, 213, 225) ${(ppkContribution / 1000) * 100}%, rgb(203, 213, 225) 100%)` // blue-500 and slate-300
                  }}
                />
                <div className="flex justify-between">
                  <span 
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: `rgb(var(--color-text) / 0.7)`
                    }}
                  >
                    0 zł
                  </span>
                  <span 
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: `rgb(var(--color-text) / 0.7)`
                    }}
                  >
                    1000 zł
                  </span>
                </div>
              </div>
              
              <div 
                className="p-2 rounded border"
                style={{
                  backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.05)`
                    : 'rgba(59, 130, 246, 0.05)', // blue-500/5 for light mode
                  borderColor: `rgb(var(--color-text) / 0.2)`,
                  fontSize: `calc(0.75rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`
                }}
              >
                Pracodawca dokłada minimalnie 1.5% Twojego wynagrodzenia
              </div>
            </div>
          </div>          {/* IKZE Section */}
                    {/* IKZE Section */}
          <div 
            className="space-y-4 p-4 rounded-md border"
            style={{
              backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                ? `rgb(var(--color-text) / 0.05)`
                : 'rgba(0, 153, 63, 0.05)', // success/5 for light mode
              borderColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                ? `rgb(var(--color-text) / 0.2)`
                : 'rgba(0, 153, 63, 0.2)' // success/20 for light mode
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{
                  backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.2)`
                    : 'rgba(0, 153, 63, 0.1)' // success/10 for light mode
                }}
              >
                <span 
                  className="font-bold"
                  style={{
                    fontSize: `calc(0.75rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text))`
                      : 'rgb(0, 153, 63)' // success color for light mode
                  }}
                >
                  🎯
                </span>
              </div>
              <div>
                <h3 
                  className="font-semibold"
                  style={{ 
                    fontSize: `calc(1.125rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text))`
                      : 'rgb(0, 153, 63)' // success color for light mode
                  }}
                >
                  IKZE
                </h3>
                <div 
                  style={{ 
                    fontSize: `calc(0.875rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text) / 0.7)`
                      : 'rgb(0, 153, 63)' // success color for light mode
                  }}
                >
                  Indywidualne Konto Zabezpieczenia Emerytalnego
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`
                }}
              >
                Ulga podatkowa do 19% od wpłat
              </div>
              
              <div className="space-y-2">
                <label 
                  className="font-medium"
                  style={{ 
                    fontSize: `calc(0.875rem * var(--font-scale))`,
                    color: `rgb(var(--color-text))`
                  }}
                >
                  Miesięczna wpłata IKZE: {ikzeContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={ikzeContribution}
                  onChange={(e) => setIkzeContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-md appearance-none cursor-pointer"
                  style={{
                    background: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `linear-gradient(to right, rgb(var(--color-text)) 0%, rgb(var(--color-text)) ${(ikzeContribution / 1000) * 100}%, rgb(var(--color-text) / 0.3) ${(ikzeContribution / 1000) * 100}%, rgb(var(--color-text) / 0.3) 100%)`
                      : `linear-gradient(to right, rgb(0, 153, 63) 0%, rgb(0, 153, 63) ${(ikzeContribution / 1000) * 100}%, rgb(203, 213, 225) ${(ikzeContribution / 1000) * 100}%, rgb(203, 213, 225) 100%)` // success and slate-300
                  }}
                />
                <div className="flex justify-between">
                  <span 
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                        ? `rgb(var(--color-text) / 0.7)`
                        : 'rgb(0, 153, 63)' // success color for light mode
                    }}
                  >
                    0 zł
                  </span>
                  <span 
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                        ? `rgb(var(--color-text) / 0.7)`
                        : 'rgb(0, 153, 63)' // success color for light mode
                    }}
                  >
                    1000 zł
                  </span>
                </div>
              </div>
              
              <div 
                className="p-2 rounded border"
                style={{
                  backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.05)`
                    : 'rgba(59, 130, 246, 0.05)', // blue-500/5 for light mode
                  borderColor: `rgb(var(--color-text) / 0.2)`,
                  fontSize: `calc(0.75rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`
                }}
              >
                Limit roczny: 6760 zł (2024)
              </div>
            </div>
          </div>

          {/* PPE Section */}
          <div 
            className="space-y-4 p-4 rounded-lg border"
            style={{
              backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                ? `rgb(var(--color-text) / 0.05)`
                : 'rgba(255, 179, 79, 0.05)', // warning/5 for light mode
              borderColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                ? `rgb(var(--color-text) / 0.2)`
                : 'rgba(255, 179, 79, 0.2)' // warning/20 for light mode
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.2)`
                    : 'rgba(255, 179, 79, 0.1)' // warning/10 for light mode
                }}
              >
                <span 
                  className="font-bold"
                  style={{
                    fontSize: `calc(0.75rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text))`
                      : 'rgb(255, 179, 79)' // warning color for light mode
                  }}
                >
                  🛡️
                </span>
              </div>
              <div>
                <h3 
                  className="font-semibold"
                  style={{ 
                    fontSize: `calc(1.125rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text))`
                      : 'rgb(255, 179, 79)' // warning color for light mode
                  }}
                >
                  PPE
                </h3>
                <div 
                  style={{ 
                    fontSize: `calc(0.875rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text) / 0.7)`
                      : 'rgb(255, 179, 79)' // warning color for light mode
                  }}
                >
                  Pracownicze Programy Emerytalne
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`
                }}
              >
                Dodatkowe korzyści od pracodawcy
              </div>
              
              <div className="space-y-2">
                <label 
                  className="font-medium"
                  style={{ 
                    fontSize: `calc(0.875rem * var(--font-scale))`,
                    color: `rgb(var(--color-text))`
                  }}
                >
                  Miesięczna składka PPE: {ppeContribution} zł
                </label>
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="50"
                  value={ppeContribution}
                  onChange={(e) => setPpeContribution(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `linear-gradient(to right, rgb(var(--color-text)) 0%, rgb(var(--color-text)) ${(ppeContribution / 800) * 100}%, rgb(var(--color-text) / 0.3) ${(ppeContribution / 800) * 100}%, rgb(var(--color-text) / 0.3) 100%)`
                      : `linear-gradient(to right, rgb(255, 179, 79) 0%, rgb(255, 179, 79) ${(ppeContribution / 800) * 100}%, rgb(203, 213, 225) ${(ppeContribution / 800) * 100}%, rgb(203, 213, 225) 100%)` // warning and slate-300
                  }}
                />
                <div className="flex justify-between">
                  <span 
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: `rgb(var(--color-text) / 0.7)`
                    }}
                  >
                    0 zł
                  </span>
                  <span 
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: `rgb(var(--color-text) / 0.7)`
                    }}
                  >
                    800 zł
                  </span>
                </div>
              </div>
              
              <div 
                className="p-2 rounded"
                style={{
                  backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.05)`
                    : 'rgba(59, 130, 246, 0.05)', // blue-500/5 for light mode
                  fontSize: `calc(0.75rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`
                }}
              >
                Sprawdź dostępność w swoim zakładzie pracy
              </div>
            </div>
          </div>
        </div>

        {/* Action Summary */}
        {totalContributions > 0 && (
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                ? `rgb(var(--color-text) / 0.05)`
                : 'rgba(34, 197, 94, 0.05)', // green-500/5 for light mode
              borderColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                ? `rgb(var(--color-text) / 0.2)`
                : 'rgba(34, 197, 94, 0.2)' // green-500/20 for light mode
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.2)`
                    : 'rgba(34, 197, 94, 0.1)' // green-500/10 for light mode
                }}
              >
                <span 
                  className="font-bold"
                  style={{
                    fontSize: `calc(0.75rem * var(--font-scale))`,
                    color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `rgb(var(--color-text))`
                      : 'rgb(34, 197, 94)' // green-500 for light mode
                  }}
                >
                  OK
                </span>
              </div>
              <div className="space-y-1">
                <h4 
                  className="font-semibold"
                  style={{ 
                    fontSize: `calc(1rem * var(--font-scale))`,
                    color: `rgb(var(--color-text))`
                  }}
                >
                  Twoje dodatkowe oszczędności emerytalne
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span 
                      style={{ 
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: `rgb(var(--color-text) / 0.7)`
                      }}
                    >
                      Miesięczne składki:
                    </span>
                    <br />
                    <span 
                      className="font-semibold"
                      style={{
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                          ? `rgb(var(--color-text))`
                          : 'rgb(34, 197, 94)' // green-500 for light mode
                      }}
                    >
                      {totalContributions.toLocaleString()} zł
                    </span>
                  </div>
                  <div>
                    <span 
                      style={{ 
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: `rgb(var(--color-text) / 0.7)`
                      }}
                    >
                      Roczne oszczędności:
                    </span>
                    <br />
                    <span 
                      className="font-semibold"
                      style={{
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                          ? `rgb(var(--color-text))`
                          : 'rgb(59, 130, 246)' // blue-500 for light mode
                      }}
                    >
                      {(totalContributions * 12).toLocaleString()} zł
                    </span>
                  </div>
                  <div>
                    <span 
                      style={{ 
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: `rgb(var(--color-text) / 0.7)`
                      }}
                    >
                      Dodatkowa emerytura:
                    </span>
                    <br />
                    <span 
                      className="font-semibold"
                      style={{
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                          ? `rgb(var(--color-text))`
                          : 'rgb(34, 197, 94)' // green-500 for light mode
                      }}
                    >
                      +{totalImpact.toLocaleString()} zł/mies.
                    </span>
                  </div>
                  <div>
                    <span 
                      style={{ 
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: `rgb(var(--color-text) / 0.7)`
                      }}
                    >
                      Łączny czas:
                    </span>
                    <br />
                    <span 
                      className="font-semibold"
                      style={{
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                          ? `rgb(var(--color-text))`
                          : 'rgb(255, 179, 79)' // warning color for light mode
                      }}
                    >
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
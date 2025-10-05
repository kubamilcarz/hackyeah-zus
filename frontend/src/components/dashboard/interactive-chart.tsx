import { useState } from "react";


interface InteractiveRetirementChartProps {
  baseRetirementYear: number;
  basePension: number;
  targetPension: number;
}

/**
 * Interactive Retirement Chart Component
 * 
 * A dashboard-only component that displays an interactive visualization of retirement scenarios.
 * Shows how delaying retirement affects pension amounts through an SVG-based chart with smooth curves.
 * 
 * **Data Flow:**
 * - Takes base retirement parameters (year, pension amount, target pension)
 * - Generates 25 years of projection data using diminishing returns formula
 * - Calculates pension increases: `yearsDelay * 68 * (1 - yearsDelay * 0.005)`
 * - Each additional year of work adds ~68 PLN/month with diminishing returns
 * 
 * **Display Features:**
 * - Interactive SVG chart with smooth Bezier curves
 * - Clickable data points for year selection
 * - Range slider for retirement year adjustment
 * - Real-time pension calculations and target achievement status
 * - Responsive grid layout with chart (2/3) and details panel (1/3)
 * 
 * **Expected Display:**
 * - Main chart showing pension growth curve over 25-year period
 * - Selected year details: pension amount, increase from base, annual growth rate
 * - Target achievement indicator with visual feedback (success/warning states)
 * - Interactive legend explaining chart elements
 * - Dashed line showing target pension threshold when achievable
 * 
 * @param baseRetirementYear - The originally planned retirement year
 * @param basePension - Base monthly pension amount in PLN
 * @param targetPension - Desired monthly pension amount in PLN
 * 
 * @returns Interactive chart component for retirement scenario analysis
 */

export default function InteractiveRetirementChart({ 
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
    const height = 400;
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
      <div className="p-6 md:p-8 flex flex-col gap-6"
        style={{
          backgroundColor: `rgb(var(--color-card))`,
          borderColor: `rgb(var(--color-text) / 0.2)`
        }}
      >
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div>
              <h1
                className="font-semibold"
                style={{ 
                  fontSize: `calc(1.625rem * var(--font-scale))`,
                  color: `rgb(var(--color-text))`
                }}
              >
                Scenariusze emerytalne
              </h1>
              <div 
                style={{ 
                  fontSize: `calc(1rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`,
                  lineHeight: 1.6
                }}
              >
                Przesuń suwak aby zobaczyć jak opóźnienie emerytury wpłynie na wysokość świadczenia
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Chart */}
          <div className="lg:col-span-2">
            <div 
              className="p-6 rounded-lg border h-full flex flex-col"
              style={{
                backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                  ? `rgb(var(--color-text) / 0.05)`
                  : 'rgba(59, 130, 246, 0.05)', // blue-500/5 for light mode
                borderColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                  ? `rgb(var(--color-text) / 0.2)`
                  : 'rgba(59, 130, 246, 0.2)' // blue-500/20 for light mode
              }}
            >
              {/* Chart SVG */}
              <div className="relative flex-1 min-h-[400px]">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 400"
                  className="overflow-visible"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 40" fill="none" stroke="rgb(var(--color-neutral))" strokeWidth="1" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="800" height="400" fill="url(#grid)" />
                  
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
                    d={`${generatePath()} L 760,360 L 40,360 Z`}
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
                    const y = 360 - ((d.pension - minPension) / pensionRange) * 320;
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
                      y1={360 - ((targetPension - minPension) / pensionRange) * 320}
                      x2="760"
                      y2={360 - ((targetPension - minPension) / pensionRange) * 320}
                      stroke="rgb(var(--color-warning))"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  )}
                  
                  {/* Axis labels */}
                  <text x="40" y="395" className="text-xs" fill="rgb(var(--color-secondary))">{baseRetirementYear}</text>
                  <text x="760" y="395" className="text-xs" fill="rgb(var(--color-secondary))" textAnchor="end">
                    {baseRetirementYear + 25}
                  </text>
                  <text x="15" y="360" className="text-xs" fill="rgb(var(--color-secondary))" textAnchor="end">
                    {minPension.toLocaleString()}
                  </text>
                  <text x="15" y="50" className="text-xs" fill="rgb(var(--color-secondary))" textAnchor="end">
                    {maxPension.toLocaleString()}
                  </text>
                </svg>
              </div>
              
              {/* Year Slider */}
              <div className="mt-6 space-y-3">
                <label 
                  className="font-medium"
                  style={{ 
                    fontSize: `calc(0.875rem * var(--font-scale))`,
                    color: `rgb(var(--color-text))`
                  }}
                >
                  Rok przejścia na emeryturę: {selectedYear}
                </label>
                <input
                  type="range"
                  min={baseRetirementYear}
                  max={baseRetirementYear + 25}
                  step="1"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="slider w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                      ? `linear-gradient(to right, rgb(var(--color-accent)) 0%, rgb(var(--color-accent)) ${((selectedYear - baseRetirementYear) / 25) * 100}%, rgb(var(--color-text) / 0.3) ${((selectedYear - baseRetirementYear) / 25) * 100}%, rgb(var(--color-text) / 0.3) 100%)`
                      : `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${((selectedYear - baseRetirementYear) / 25) * 100}%, rgb(203, 213, 225) ${((selectedYear - baseRetirementYear) / 25) * 100}%, rgb(203, 213, 225) 100%)` // blue-600 and slate-300
                  }}
                />
                <div className="flex justify-between">
                  <span 
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: `rgb(var(--color-text) / 0.7)`
                    }}
                  >
                    {baseRetirementYear}
                  </span>
                  <span 
                    className="font-medium"
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                        ? `rgb(var(--color-accent))`
                        : 'rgb(37, 99, 235)' // blue-600
                    }}
                  >
                    Wybrany: {selectedYear}
                  </span>
                  <span 
                    style={{ 
                      fontSize: `calc(0.75rem * var(--font-scale))`,
                      color: `rgb(var(--color-text) / 0.7)`
                    }}
                  >
                    {baseRetirementYear + 25}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Year Details */}
          <div className="space-y-4">
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                  ? `rgb(var(--color-text) / 0.05)`
                  : 'rgba(0, 65, 110, 0.05)', // navy/5 for light mode
                borderColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                  ? `rgb(var(--color-text) / 0.2)`
                  : 'rgba(0, 65, 110, 0.2)' // navy/20 for light mode
              }}
            >
              <div className="space-y-4">
                <div className="text-center">
                  <div 
                    className="font-bold"
                    style={{ 
                      fontSize: `calc(1.875rem * var(--font-scale))`,
                      color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                        ? `rgb(var(--color-text))`
                        : 'rgb(0, 65, 110)' // navy for light mode
                    }}
                  >
                    {selectedYear}
                  </div>
                  <div 
                    style={{ 
                      fontSize: `calc(0.875rem * var(--font-scale))`,
                      color: `rgb(var(--color-text) / 0.7)`
                    }}
                  >
                    {selectedData.yearsDelay === 0 ? 'Planowany rok emerytury' : `+${selectedData.yearsDelay} lat pracy`}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `rgb(var(--color-card) / 0.6)` }}
                  >
                    <div 
                      style={{ 
                        fontSize: `calc(0.75rem * var(--font-scale))`,
                        color: `rgb(var(--color-text) / 0.7)`
                      }}
                    >
                      Miesięczna emerytura
                    </div>
                    <div 
                      className="font-bold"
                      style={{ 
                        fontSize: `calc(1.25rem * var(--font-scale))`,
                        color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                          ? `rgb(var(--color-text))`
                          : 'rgb(0, 65, 110)' // navy for light mode
                      }}
                    >
                      {selectedData.pension.toLocaleString()} zł
                    </div>
                  </div>
                  
                  {selectedData.yearsDelay > 0 && (
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `rgb(var(--color-card) / 0.6)` }}
                    >
                      <div 
                        style={{ 
                          fontSize: `calc(0.75rem * var(--font-scale))`,
                          color: `rgb(var(--color-text) / 0.7)`
                        }}
                      >
                        Wzrost emerytury
                      </div>
                      <div 
                        className="font-semibold"
                        style={{ 
                          fontSize: `calc(1.125rem * var(--font-scale))`,
                          color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                            ? `rgb(var(--color-text))`
                            : 'rgb(0, 153, 63)' // success color for light mode
                        }}
                      >
                        +{selectedData.pensionIncrease.toLocaleString()} zł
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `rgb(var(--color-card) / 0.6)` }}
                  >
                    <div 
                      style={{ 
                        fontSize: `calc(0.75rem * var(--font-scale))`,
                        color: `rgb(var(--color-text) / 0.7)`
                      }}
                    >
                      Wzrost roczny
                    </div>
                    <div 
                      className="font-medium"
                      style={{ 
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                          ? `rgb(var(--color-text))`
                          : 'rgb(63, 132, 210)' // info/blue color for light mode
                      }}
                    >
                      ~{selectedData.yearsDelay > 0 ? Math.round(selectedData.pensionIncrease / selectedData.yearsDelay) : 68} zł/rok
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Target Achievement Card - INTEGRATED HERE */}
            <div 
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: selectedData.pension >= targetPension 
                  ? (document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.05)`
                    : 'rgba(0, 153, 63, 0.05)') // success/5 for light mode
                  : (document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.05)`
                    : 'rgba(255, 179, 79, 0.05)'), // warning/5 for light mode
                borderColor: selectedData.pension >= targetPension 
                  ? (document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.2)`
                    : 'rgba(0, 153, 63, 0.2)') // success/20 for light mode
                  : (document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                    ? `rgb(var(--color-text) / 0.2)`
                    : 'rgba(255, 179, 79, 0.2)') // warning/20 for light mode
              }}
            >
              <div className="space-y-3">
                <h4 
                  className="font-semibold"
                  style={{ 
                    fontSize: `calc(1rem * var(--font-scale))`,
                    color: selectedData.pension >= targetPension 
                      ? (document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                        ? `rgb(var(--color-text))`
                        : 'rgb(0, 153, 63)') // success for light mode
                      : `rgb(var(--color-text) / 0.8)`
                  }}
                >
                  {selectedData.pension >= targetPension ? 'Cel osiągnięty!' : 'Ile dłużej pracować aby osiągnąć cel?'}
                </h4>
                
                {selectedData.pension >= targetPension ? (
                  <div className="space-y-2">
                    <div 
                      style={{ 
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                          ? `rgb(var(--color-text))`
                          : 'rgb(0, 153, 63)' // success for light mode
                      }}
                    >
                      Przekroczysz swój cel o {(selectedData.pension - targetPension).toLocaleString()} zł miesięcznie!
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
                      Możesz rozważyć wcześniejszą emeryturę lub zwiększenie celów oszczędnościowych.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div 
                      style={{ 
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: `rgb(var(--color-text) / 0.7)`
                      }}
                    >
                      Brakuje: {(targetPension - selectedData.pension).toLocaleString()} zł miesięcznie
                    </div>
                    {targetAchievable && (
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
                        Pracuj do {targetRetirementYear} roku aby osiągnąć cel {targetPension.toLocaleString()} zł/mies.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Interactive Legend */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
          style={{ borderColor: `rgb(var(--color-text) / 0.2)` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-1 rounded" style={{
              background: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-info)), rgb(var(--color-success)))'
            }}></div>
            <span 
              style={{ 
                fontSize: `calc(0.875rem * var(--font-scale))`,
                color: `rgb(var(--color-text) / 0.7)`
              }}
            >
              Prognoza emerytalna
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-1 rounded border-dashed border-2"
              style={{ 
                backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                  ? `rgb(var(--color-text))`
                  : 'rgb(255, 179, 79)', // warning color for light mode
                borderColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                  ? `rgb(var(--color-text))`
                  : 'rgb(255, 179, 79)' // warning color for light mode
              }}
            ></div>
            <span 
              style={{ 
                fontSize: `calc(0.875rem * var(--font-scale))`,
                color: `rgb(var(--color-text) / 0.7)`
              }}
            >
              Cel emerytalny ({targetPension.toLocaleString()} zł)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full border-2"
              style={{ 
                backgroundColor: document.documentElement.classList.contains('hc-white') || document.documentElement.classList.contains('hc-yellow')
                  ? `rgb(var(--color-text))`
                  : 'rgb(0, 65, 110)', // primary color for light mode
                borderColor: `rgb(var(--color-card))`
              }}
            ></div>
            <span 
              style={{ 
                fontSize: `calc(0.875rem * var(--font-scale))`,
                color: `rgb(var(--color-text) / 0.7)`
              }}
            >
              Wybrana opcja
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
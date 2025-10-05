import { useState } from "react";
import { ZusText } from "../zus-ui";


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
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
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
          <div className="lg:col-span-2">
            <div className="p-6 bg-info-light/20 rounded-lg border border-info-light h-full flex flex-col">
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
                    <div className="text-xs p-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded border border-neutral text-secondary">
                      Możesz rozważyć wcześniejszą emeryturę lub zwiększenie celów oszczędnościowych.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-warning">
                      Brakuje: {(targetPension - selectedData.pension).toLocaleString()} zł miesięcznie
                    </div>
                    {targetAchievable && (
                      <div className="text-xs p-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded border border-neutral text-secondary">
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
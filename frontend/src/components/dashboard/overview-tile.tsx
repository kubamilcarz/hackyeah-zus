import React from "react";

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
export default function OverviewTile({
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
  const isHighContrast = () => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('hc-white') || 
             document.documentElement.classList.contains('hc-yellow');
    }
    return false;
  };

  const getValueColor = () => {
    const highContrast = isHighContrast();
    if (highContrast) {
      return `rgb(var(--color-text))`;
    }
    switch (tone) {
      case "success":
        return 'rgb(0, 153, 63)'; // success color
      case "accent":
        return 'rgb(255, 179, 79)'; // warning/yellow color
      default:
        return 'rgb(0, 65, 110)'; // primary/navy color
    }
  };

  const getIconBg = () => {
    const highContrast = isHighContrast();
    if (highContrast) {
      return `rgb(var(--color-text) / 0.2)`;
    }
    switch (tone) {
      case "success":
        return 'rgba(0, 153, 63, 0.1)';
      case "accent":
        return 'rgba(255, 179, 79, 0.1)';
      default:
        return 'rgba(0, 65, 110, 0.1)';
    }
  };

  const getIconColor = () => {
    return getValueColor();
  };

  const getProgressBarColor = () => {
    return getValueColor();
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg p-6 transition-all duration-300 h-full border"
      style={{
        backgroundColor: `rgb(var(--color-card))`,
        borderColor: `rgb(var(--color-text) / 0.2)`
      }}
    >
      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: getIconBg() }}
            >
              <span 
                className="font-bold"
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: getIconColor()
                }}
              >
                {icon}
              </span>
            </div>
            <div>
              <div 
                className="font-semibold"
                style={{ 
                  fontSize: `calc(1.125rem * var(--font-scale))`,
                  color: `rgb(var(--color-text))`
                }}
              >
                {title}
              </div>
              <div 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`
                }}
              >
                {subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Main Value */}
        <div className="space-y-2">
          <div 
            className="font-bold"
            style={{ 
              fontSize: `calc(1.5rem * var(--font-scale))`,
              color: getValueColor()
            }}
          >
            {value}
          </div>
          <div 
            style={{ 
              fontSize: `calc(0.875rem * var(--font-scale))`,
              color: `rgb(var(--color-text) / 0.7)`
            }}
          >
            {description}
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span 
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: `rgb(var(--color-text) / 0.7)`
                }}
              >
                Postęp celu
              </span>
              <span 
                className="font-semibold"
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: getValueColor()
                }}
              >
                {progress}%
              </span>
            </div>
            <div 
              className="w-full rounded-full h-2"
              style={{ backgroundColor: `rgb(var(--color-text) / 0.2)` }}
            >
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: getProgressBarColor()
                }}
              />
            </div>
          </div>
        )}

        {/* Interactive Controls */}
        {interactive && interactive.type === "slider" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label 
                className="font-medium"
                style={{ 
                  fontSize: `calc(0.875rem * var(--font-scale))`,
                  color: `rgb(var(--color-text))`
                }}
              >
                {interactive.label}
              </label>
            </div>

            <div className="relative">
              <style dangerouslySetInnerHTML={{
                __html: `
                  .zus-slider-${tone} {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 8px;
                    border-radius: 8px;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                  }
                  
                  .zus-slider-${tone}::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: ${getValueColor()};
                    border: 3px solid ${isHighContrast() ? 'rgb(var(--color-bg))' : '#ffffff'};
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px ${isHighContrast() ? 'rgb(var(--color-text) / 0.3)' : 'rgba(0, 0, 0, 0.1)'};
                    transition: all 0.2s ease;
                  }
                  
                  .zus-slider-${tone}::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 2px ${getValueColor()};
                  }
                  
                  .zus-slider-${tone}::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: ${getValueColor()};
                    border: 3px solid ${isHighContrast() ? 'rgb(var(--color-bg))' : '#ffffff'};
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px ${isHighContrast() ? 'rgb(var(--color-text) / 0.3)' : 'rgba(0, 0, 0, 0.1)'};
                    transition: all 0.2s ease;
                    -moz-appearance: none;
                    border: none;
                  }
                  
                  .zus-slider-${tone}::-moz-range-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 2px ${getValueColor()};
                  }
                  
                  .zus-slider-${tone}::-webkit-slider-track {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 8px;
                    border-radius: 8px;
                    background: transparent;
                  }
                  
                  .zus-slider-${tone}::-moz-range-track {
                    height: 8px;
                    border-radius: 8px;
                    background: transparent;
                    border: none;
                  }
                  
                  .zus-slider-${tone}:focus {
                    outline: 2px solid ${getValueColor()};
                    outline-offset: 3px;
                  }
                  
                  .zus-slider-${tone}:focus::-webkit-slider-thumb {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 3px ${getValueColor()};
                  }
                  
                  .zus-slider-${tone}:focus::-moz-range-thumb {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 3px ${getValueColor()};
                  }
                  
                  /* Add track border for better visibility in light mode */
                  .zus-slider-${tone} {
                    border: 1px solid ${isHighContrast() ? 'rgb(var(--color-text) / 0.4)' : 'rgba(0, 0, 0, 0.1)'};
                    box-shadow: inset 0 1px 2px ${isHighContrast() ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
                  }
                `
              }} />
              <input
                type="range"
                min={interactive.min}
                max={interactive.max}
                step={interactive.step}
                value={interactive.value}
                onChange={(e) => interactive.onChange?.(Number(e.target.value))}
                className={`zus-slider-${tone}`}
                style={{
                  background: `linear-gradient(to right, ${getValueColor()} 0%, ${getValueColor()} ${((interactive.value! - interactive.min!) / (interactive.max! - interactive.min!)) * 100}%, ${isHighContrast() ? 'rgb(var(--color-text) / 0.3)' : 'rgb(var(--color-text) / 0.15)'} ${((interactive.value! - interactive.min!) / (interactive.max! - interactive.min!)) * 100}%, ${isHighContrast() ? 'rgb(var(--color-text) / 0.3)' : 'rgb(var(--color-text) / 0.15)'} 100%)`
                }}
                aria-label={interactive.label}
                aria-valuemin={interactive.min}
                aria-valuemax={interactive.max}
                aria-valuenow={interactive.value}
                aria-valuetext={`${interactive.value}${interactive.suffix || ''}`}
              />
              <div className="flex justify-between mt-2">
                <span
                  style={{ 
                    fontSize: `calc(0.75rem * var(--font-scale))`,
                    color: `rgb(var(--color-text) / 0.7)`
                  }}
                >
                  {interactive.min}
                  {interactive.suffix}
                </span>
                <span 
                  className="font-medium px-2 py-1 rounded"
                  style={{ 
                    fontSize: `calc(0.75rem * var(--font-scale))`,
                    color: getValueColor(),
                    backgroundColor: isHighContrast() ? 'rgb(var(--color-text) / 0.1)' : `${getValueColor()}15`,
                    minWidth: '3rem',
                    textAlign: 'center'
                  }}
                >
                  {interactive.value}
                  {interactive.suffix}
                </span>
                <span
                  style={{ 
                    fontSize: `calc(0.75rem * var(--font-scale))`,
                    color: `rgb(var(--color-text) / 0.7)`
                  }}
                >
                  {interactive.max}
                  {interactive.suffix}
                </span>
              </div>
              {interactive.helpText && (
                <div 
                  className="mt-2 p-2 rounded-md text-xs"
                  style={{
                    backgroundColor: isHighContrast() ? 'rgb(var(--color-text) / 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: `rgb(var(--color-text) / 0.7)`,
                    fontSize: `calc(0.75rem * var(--font-scale))`
                  }}
                >
                  {interactive.helpText}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Insight */}
        {insight && (
          <div 
            className="p-3 rounded-lg border"
            style={{
              borderColor: `rgb(var(--color-text) / 0.2)`,
              backgroundColor: isHighContrast() 
                ? `rgb(var(--color-text) / 0.05)` 
                : 'rgba(59, 130, 246, 0.05)', // blue-500/5
              fontSize: `calc(0.875rem * var(--font-scale))`,
              color: `rgb(var(--color-text) / 0.7)`
            }}
          >
            {insight.text}
          </div>
        )}
      </div>
    </div>
  );
}
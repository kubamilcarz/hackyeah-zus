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
              <input
                type="range"
                min={interactive.min}
                max={interactive.max}
                step={interactive.step}
                value={interactive.value}
                onChange={(e) => interactive.onChange?.(Number(e.target.value))}
                className="slider w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${getValueColor()} 0%, ${getValueColor()} ${((interactive.value! - interactive.min!) / (interactive.max! - interactive.min!)) * 100}%, rgb(var(--color-text) / 0.2) ${((interactive.value! - interactive.min!) / (interactive.max! - interactive.min!)) * 100}%, rgb(var(--color-text) / 0.2) 100%)`
                }}
              />
              <div className="flex justify-between mt-1">
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
                  className="font-medium"
                  style={{ 
                    fontSize: `calc(0.75rem * var(--font-scale))`,
                    color: getValueColor()
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
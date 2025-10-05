interface StickyTileProps {
  icon: string;
  title: string;
  value: string;
  tone: "primary" | "success" | "accent";
  progress?: number;
}

export default function StickyTile({ icon, title, value, tone, progress }: StickyTileProps) {
  const isHighContrast = () => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('hc-white') || 
             document.documentElement.classList.contains('hc-yellow');
    }
    return false;
  };

  const getValueColor = () => {
    const highContrast = isHighContrast();
    switch (tone) {
      case "success":
        return highContrast ? `rgb(var(--color-text))` : 'rgb(0, 153, 63)'; // success color
      case "accent":
        return highContrast ? `rgb(var(--color-text))` : 'rgb(255, 179, 79)'; // warning/yellow color
      default:
        return highContrast ? `rgb(var(--color-text))` : 'rgb(0, 65, 110)'; // primary/navy color
    }
  };

  const getBgColor = () => {
    const highContrast = isHighContrast();
    if (highContrast) {
      return `rgb(var(--color-text) / 0.1)`;
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
    const highContrast = isHighContrast();
    switch (tone) {
      case "success":
        return highContrast ? `rgb(var(--color-text))` : 'rgb(0, 153, 63)';
      case "accent":
        return highContrast ? `rgb(var(--color-text))` : 'rgb(255, 179, 79)';
      default:
        return highContrast ? `rgb(var(--color-text))` : 'rgb(0, 65, 110)';
    }
  };

  const getProgressBarColor = () => {
    return getValueColor();
  };

  return (
    <div 
      className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-sm transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: `rgb(var(--color-card))`,
        borderColor: `rgb(var(--color-text) / 0.2)`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = getBgColor();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `rgb(var(--color-card))`;
      }}
    >
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: getIconBg()
        }}
      >
        <span 
          className="text-xs font-bold"
          style={{ 
            color: getIconColor(),
            fontSize: `calc(0.75rem * var(--font-scale))`
          }}
        >
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div 
          className="font-medium truncate"
          style={{ 
            fontSize: `calc(0.875rem * var(--font-scale))`,
            color: `rgb(var(--color-text))`
          }}
        >
          {title}
        </div>
        <div 
          className="font-bold truncate"
          style={{ 
            fontSize: `calc(1.25rem * var(--font-scale))`,
            color: getValueColor()
          }}
        >
          {value}
        </div>
        {progress !== undefined && (
          <div 
            className="w-full rounded-full h-1.5 mt-2"
            style={{ 
              backgroundColor: `rgb(var(--color-text) / 0.2)`
            }}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: getProgressBarColor()
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
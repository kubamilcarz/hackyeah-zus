"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

type Mode = "regular" | "hc-white" | "hc-yellow";
const CONTRAST_KEY = "contrast-mode";
const FONT_KEY = "font-scale";
const COLLAPSE_KEY = "a11y-collapsed";

export default function ContrastToggle() {
  const [mode, setMode] = useState<Mode>("regular");
  const [scale, setScale] = useState<number>(1);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  /* --- Load user settings --- */
  useEffect(() => {
    const savedMode = (localStorage.getItem(CONTRAST_KEY) as Mode) || "regular";
    const savedScale = parseFloat(localStorage.getItem(FONT_KEY) || "1");
    const savedCollapsed = localStorage.getItem(COLLAPSE_KEY) === "true";

    setMode(savedMode);
    setScale(savedScale);
    setCollapsed(savedCollapsed);

    applyMode(savedMode);
    applyScale(savedScale);
  }, []);

  /* --- Apply helpers --- */
  function applyMode(m: Mode) {
    const html = document.documentElement;
    html.classList.remove("hc-white", "hc-yellow");
    if (m !== "regular") html.classList.add(m);
  }

  function applyScale(next: number) {
    document.documentElement.style.setProperty("--font-scale", String(next));
  }

  function setAndStoreMode(next: Mode) {
    setMode(next);
    // inside ContrastToggle
document.documentElement.classList.remove("hc-white", "hc-yellow");
if (next !== "regular") document.documentElement.classList.add(next);
    localStorage.setItem(CONTRAST_KEY, next);
    applyMode(next);
  }

  function adjustFont(delta: number) {
    const next = Math.min(2.5, Math.max(0.6, parseFloat((scale + delta).toFixed(2))));
    setScale(next);
    localStorage.setItem(FONT_KEY, String(next));
    applyScale(next);
  }

  function resetFont() {
    setScale(1);
    localStorage.setItem(FONT_KEY, "1");
    applyScale(1);
  }

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(COLLAPSE_KEY, String(next));
  }

  /* --- Render --- */
  if (collapsed) {
    return (
  <button
    type="button"
    onClick={toggleCollapse}
    className={clsx(
      "fixed top-3 right-3 z-50 flex items-center gap-2 border font-semibold transition-all",
      "rounded-md px-3.5 py-2 text-[15px] focus-visible:ring-2 focus-visible:ring-offset-2",
      "shadow-sm hover:shadow-md active:scale-[0.98]"
    )}
    style={{
      backgroundColor: `rgb(var(--color-card))`,
      color: `rgb(var(--color-text))`,
      borderColor: `rgb(var(--color-accent) / 0.8)`,
      fontSize: `calc(14px * var(--font-scale))`,
    }}
    aria-label="Pokaż ustawienia dostępności"
  >
    <span
      className="text-[18px]"
      aria-hidden
      style={{ color: `rgb(var(--color-accent))` }}
    >
      ⚙
    </span>
    <span className="tracking-tight">Dostępność</span>
  </button>
);
  }

  return (
    <div
      className="fixed top-3 right-3 z-50 rounded-md backdrop-blur border px-2.5 py-2 shadow-sm"
      style={{
        backgroundColor: `rgb(var(--color-card) / 0.9)`,
        borderColor: `rgb(var(--color-text) / 0.2)`,
      }}
      aria-label="Ustawienia dostępności"
    >
      <div className="flex items-center justify-between gap-2">
        <span 
          className="text-[13px] font-medium"
          style={{ 
            color: `rgb(var(--color-text))`,
            fontSize: `calc(13px * var(--font-scale))`
          }}
        >
          Dostępność
        </span>
        <button
          onClick={toggleCollapse}
          className="text-[13px] hover:opacity-80"
          style={{ 
            color: `rgb(var(--color-text) / 0.7)`,
            fontSize: `calc(13px * var(--font-scale))`
          }}
          aria-label="Zwiń panel"
        >
          ✕
        </button>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex items-center flex-wrap gap-1">
          {/* Contrast */}
          <ToggleBtn label="A" title="Kontrast normalny" active={mode === "regular"} onClick={() => setAndStoreMode("regular")} />
          <ToggleBtn label="A" title="Białe litery na czarnym tle" active={mode === "hc-white"} onClick={() => setAndStoreMode("hc-white")} style={{ color: "#fff", background: "#000" }} />
          <ToggleBtn label="A" title="Żółte litery na czarnym tle" active={mode === "hc-yellow"} onClick={() => setAndStoreMode("hc-yellow")} style={{ color: "#ffd800", background: "#000" }} />

          <div 
            className="mx-1 h-5 w-px" 
            style={{ backgroundColor: `rgb(var(--color-text) / 0.2)` }}
            aria-hidden 
          />

          {/* Font scaling */}
          <ToggleBtn 
            label="A−" 
            title={scale <= 0.6 ? "Minimalna czcionka osiągnięta" : `Zmniejsz czcionkę (obecnie: ${Math.round(scale * 100)}%)`}
            onClick={() => adjustFont(-0.1)}
            disabled={scale <= 0.6}
          />
          <ToggleBtn 
            label="A" 
            title={`Przywróć domyślny rozmiar (obecnie: ${Math.round(scale * 100)}%)`}
            active={scale === 1} 
            onClick={resetFont} 
          />
          <ToggleBtn 
            label="A+" 
            title={scale >= 2.5 ? "Maksymalna czcionka osiągnięta" : `Zwiększ czcionkę (obecnie: ${Math.round(scale * 100)}%)`}
            onClick={() => adjustFont(+0.1)}
            disabled={scale >= 2.5}
          />
        </div>
        
        {/* Scale indicator */}
        <div className="text-center">
          <span 
            className="text-xs"
            style={{ 
              color: scale <= 0.6 || scale >= 2.5 ? `rgb(var(--color-accent))` : `rgb(var(--color-text) / 0.6)`,
              fontSize: `calc(11px * var(--font-scale))`
            }}
          >
            Rozmiar: {Math.round(scale * 100)}%
            {scale <= 0.6 && " (min)"}
            {scale >= 2.5 && " (max)"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* --- Sub-button component --- */
function ToggleBtn({
  label,
  title,
  active,
  onClick,
  style,
  disabled,
}: {
  label: string;
  title: string;
  active?: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const buttonStyle = style ? style : {
    backgroundColor: active ? `rgb(var(--color-accent) / 0.2)` : 'transparent',
    color: disabled ? `rgb(var(--color-text) / 0.3)` : `rgb(var(--color-text))`,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "h-8 min-w-[32px] grid place-items-center rounded text-sm font-semibold select-none focus:outline-none focus-visible:ring-2 transition",
        !disabled && "hover:opacity-80",
        active && !style && "ring-2",
        disabled && "cursor-not-allowed opacity-50"
      )}
      style={{
        ...buttonStyle,
        fontSize: `calc(14px * var(--font-scale))`,
        ...(active && !style && { boxShadow: `0 0 0 2px rgb(var(--color-accent))` }),
      }}
      title={title}
      aria-pressed={!!active}
      onClick={disabled ? undefined : onClick}
    >
      {label}
    </button>
  );
}
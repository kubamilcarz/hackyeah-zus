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
    const next = Math.min(2, Math.max(0.8, parseFloat((scale + delta).toFixed(2))));
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
        className="fixed top-3 right-3 z-50 bg-white/90 border shadow-sm px-3 py-1.5 rounded-full text-sm font-medium text-neutral-800 hover:bg-neutral-100 focus-visible:ring-2"
        aria-label="Pokaż ustawienia dostępności"
      >
        ⚙ Dostępność
      </button>
    );
  }

  return (
    <div
      className="fixed top-3 right-3 z-50 rounded-md bg-white/90 backdrop-blur border px-2.5 py-2 shadow-sm"
      aria-label="Ustawienia dostępności"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-neutral-800">Dostępność</span>
        <button
          onClick={toggleCollapse}
          className="text-[13px] text-neutral-600 hover:text-neutral-800"
          aria-label="Zwiń panel"
        >
          ✕
        </button>
      </div>

      <div className="mt-2 flex items-center flex-wrap gap-1">
        {/* Contrast */}
        <ToggleBtn label="A" title="Kontrast normalny" active={mode === "regular"} onClick={() => setAndStoreMode("regular")} />
        <ToggleBtn label="A" title="Białe litery na czarnym tle" active={mode === "hc-white"} onClick={() => setAndStoreMode("hc-white")} style={{ color: "#fff", background: "#000" }} />
        <ToggleBtn label="A" title="Żółte litery na czarnym tle" active={mode === "hc-yellow"} onClick={() => setAndStoreMode("hc-yellow")} style={{ color: "#ffd800", background: "#000" }} />

        <div className="mx-1 h-5 w-px bg-gray-300" aria-hidden />

        {/* Font scaling */}
        <ToggleBtn label="A−" title="Zmniejsz czcionkę" onClick={() => adjustFont(-0.2)} />
        <ToggleBtn label="A" title="Przywróć domyślny rozmiar" active={scale === 1} onClick={resetFont} />
        <ToggleBtn label="A+" title="Zwiększ czcionkę" onClick={() => adjustFont(+0.2)} />
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
}: {
  label: string;
  title: string;
  active?: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "h-8 min-w-[32px] grid place-items-center rounded text-sm font-semibold select-none focus:outline-none focus-visible:ring-2 transition",
        active ? "ring-2 ring-[var(--focus)]" : "hover:bg-neutral-100"
      )}
      title={title}
      aria-pressed={!!active}
      onClick={onClick}
      style={style}
    >
      {label}
    </button>
  );
}
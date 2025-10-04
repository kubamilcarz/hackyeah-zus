"use client";
import { useEffect, useState } from "react";
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);
  
  return {
    show: (m: string) => setMsg(m),
    Toast: () => msg ? (
      <div 
        aria-live="polite" 
        className="fixed bottom-4 right-4 rounded px-3 py-2 shadow-lg border transition-colors"
        style={{
          backgroundColor: `rgb(var(--color-text))`,
          color: `rgb(var(--color-card))`,
          fontSize: `calc(0.875rem * var(--font-scale))`,
          borderColor: `rgb(var(--color-accent))`
        }}
      >
        {msg}
      </div>
    ) : null
  };
}
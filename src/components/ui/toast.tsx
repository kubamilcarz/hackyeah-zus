"use client";
import { useEffect, useState } from "react";
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  return {
    show: (m: string) => setMsg(m),
    Toast: () => msg ? (
      <div aria-live="polite" className="fixed bottom-4 right-4 bg-black text-white rounded px-3 py-2">
        {msg}
      </div>
    ) : null
  };
}
"use client";

import { usePathname } from "next/navigation";
import { EmaChat } from "@/components/chat/ema-chat";

export function ConditionalEmaChat() {
  const pathname = usePathname();
  
  // Hide EMA chat on admin page
  if (pathname === "/admin") {
    return null;
  }
  
  return <EmaChat />;
}

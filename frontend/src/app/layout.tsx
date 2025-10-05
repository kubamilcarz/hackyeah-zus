import type { Metadata } from "next";
import "./globals.css";
import ContrastToggle from "@/components/constrast-toggle";
import { ConditionalEmaChat } from "@/components/conditional-ema-chat";
import { JotaiProvider } from "@/lib/store";
import { DataFlowDemo } from "@/components/debug/data-flow-demo";
import { LayoutBackButton } from "@/components/flow/layout-back-button";
import { RouteStepSynchronizer } from "@/components/flow/route-step-synchronizer";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Symulator Emerytury ZUS",
  description: "Oficjalny symulator emerytury ZUS - sprawdź jaką emeryturę możesz otrzymać",
};

function PreloadSettings() {
  // runs before paint; no React hooks here
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  try {
    // Load contrast mode
    var contrastKey = 'contrast-mode';
    var contrastMode = localStorage.getItem(contrastKey);
    if (contrastMode === 'hc-white' || contrastMode === 'hc-yellow') {
      document.addEventListener('DOMContentLoaded', function(){
        document.body.classList.add(contrastMode);
      });
    }
    
    // Load font scale
    var fontKey = 'font-scale';
    var fontScale = localStorage.getItem(fontKey);
    if (fontScale) {
      document.documentElement.style.setProperty('--font-scale', fontScale);
    }
  } catch(e) {}
})();
        `.trim(),
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <PreloadSettings />
      </head>
      <body 
        className="antialiased transition-colors duration-300"
        style={{
          backgroundColor: 'rgb(var(--color-bg))',
          color: 'rgb(var(--color-text))',
          fontSize: `calc(1rem * var(--font-scale, 1))`
        }}
      >
        <JotaiProvider>
          <RouteStepSynchronizer />
          <div 
            className="min-h-screen transition-colors duration-300"
            style={{
              backgroundColor: 'rgb(var(--color-bg))',
              color: 'rgb(var(--color-text))'
            }}
          >
            <div 
              className="transition-colors duration-300"
              style={{
                backgroundColor: 'rgb(var(--color-card))'
              }}
            >
              <div 
                className="max-w-6xl flex justify-between items-center px-4"
                style={{
                  padding: `0 1rem`
                }}
              >
                <div className="flex items-center gap-3">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/horizontal.svg"
                      alt="Logo Symulatora Emerytury ZUS"
                      width={200}
                      height={100}
                      className="w-auto h-18 overflow-clip py-2"
                      priority
                    />
                  </Link>
                  <LayoutBackButton />
                </div>

                <div className="flex items-center gap-2">
                  <ContrastToggle />
                </div>
              </div>
            </div>

            {children}
          </div>
          <ConditionalEmaChat />
          <DataFlowDemo />
        </JotaiProvider>
      </body>
    </html>
  );
}

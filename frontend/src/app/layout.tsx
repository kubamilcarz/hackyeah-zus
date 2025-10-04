import type { Metadata } from "next";
import "./globals.css";
import ContrastToggle from "@/components/constrast-toggle";
import { EmaChat } from "@/components/chat/ema-chat";

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
              className="max-w-6xl ml-auto px-4"
              style={{
                padding: `calc(2.25rem * var(--font-scale, 1)) 1rem`
              }}
            >
              <ContrastToggle />
            </div>
          </div>

          {children}
        </div>
        <EmaChat />
      </body>
    </html>
  );
}

"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ZusButton } from "@/components/zus-ui";
import { ZusText } from "@/components/ui/zus-text";

function fmtPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

export default function ResultPage() {
  const params = useSearchParams();
  const router = useRouter();

  const zusPension = Number(params.get("zusPension") ?? 2964);
  const realToday = Number(params.get("realPowerToday") ?? 2075);
  const monthlySavings = Number(params.get("monthlyTotal") ?? 0);

  // Simulated total for now — replace with backend calc later
  const projectedWithSavings = zusPension + monthlySavings * 0.3; // simplified illustrative model

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4">
    <div className="bg-zus-card rounded-2xl">
        <div className="p-8 md:p-10 space-y-10">
          {/* Header */}
          <header className="space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}>
              Twoja prognoza emerytalna
            </h1>
            <ZusText className="text-neutral-700">
              Szacunkowa wysokość przyszłego świadczenia na podstawie Twoich danych.
            </ZusText>
          </header>

          {/* Top tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Tile
              tone="primary"
              title="Emerytura z ZUS"
              subtitle="Kwota nominalna"
              value={fmtPLN(zusPension)}
            />
            <Tile
              tone="success"
              title="Siła nabywcza dziś"
              subtitle="Uwzględnia inflację"
              value={fmtPLN(realToday)}
            />
            <Tile
              tone="neutral"
              title="Z oszczędności"
              subtitle="Prognozowany miesięczny dodatek"
              value={fmtPLN(projectedWithSavings - zusPension)}
            />
          </div>

          {/* Conclusions / Wnioski */}
          <section className="bg-zus-bg rounded-xl p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-neutral-700" style={{ fontSize: `calc(1.125rem * var(--font-scale))` }}>
              Wnioski
            </h2>

            <ZusText className="text-neutral-800 leading-relaxed">
              Na podstawie wprowadzonych danych Twoja <strong>prognozowana emerytura</strong>{" "}
              wynosi około <strong>{fmtPLN(projectedWithSavings)}</strong> miesięcznie.
            </ZusText>

            <ZusText className="text-neutral-800 leading-relaxed">
              Warto rozważyć regularne oszczędzanie w ramach IKE, IKZE lub PPK — każda z tych
              form pozwala zwiększyć świadczenie o kilka–kilkanaście procent, zwłaszcza przy
              dłuższym okresie oszczędzania.
            </ZusText>

            <ZusText className="text-neutral-800 leading-relaxed">
              Nawet niewielkie miesięczne wpłaty (np. {fmtPLN(200)}) mogą w dłuższej perspektywie
              wygenerować zauważalny dodatek do emerytury.
            </ZusText>
          </section>

          {/* CTA */}
          <div className="flex flex-col md:flex-row gap-3 justify-between pt-4">
            <ZusButton 
              variant="ghost" 
              type="button" 
              className="px-8" 
              onClick={() => router.push("/")}
            >
              Zacznij od nowa
            </ZusButton>

            <div className="flex flex-col md:flex-row gap-3 justify-center pt-4">
              <ZusButton variant="outline" type="button" className="px-8">
                Pobierz raport PDF
              </ZusButton>

            <ZusButton 
              variant="primary" 
              type="button" 
              className="px-8"
              onClick={() => router.push("/secondSurvey")}
            >
              Sprawdź inne prognozy
            </ZusButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Tiles --- */
function Tile({
  title,
  subtitle,
  value,
  tone = "primary",
}: {
  title: string;
  subtitle: string;
  value: string;
  tone?: "primary" | "success" | "neutral";
}) {
  const bg =
    tone === "success"
      ? "bg-[var(--color-zus-green-bg)]"
      : tone === "neutral"
      ? "bg-card/20"
      : "bg-zus-bg";
  const getTitleStyle = () => {
    if (tone === "success") return { color: "rgb(var(--zus-green))" };
    if (tone === "neutral") return { color: "rgb(var(--color-text) / 0.7)" };
    return { color: "rgb(var(--color-accent))" };
  };
  const circleColor =
    tone === "success"
      ? "fill-[var(--zus-green)]/10"
      : tone === "neutral"
      ? "fill-neutral-400/10"
      : "fill-[#2E6AA2]/10";

  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-5 md:p-6 ${bg} transition-transform`}
    >
      {/* background circles */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full scale-100 transition-transform duration-700 ease-out group-hover:scale-110"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <circle cx="170" cy="30" r="60" className={circleColor} />
        <circle cx="30" cy="180" r="50" className={circleColor} />
      </svg>

      <div className="relative z-10">
        <div 
          className="text-sm font-semibold" 
          style={{ 
            fontSize: `calc(0.8125rem * var(--font-scale))`,
            ...getTitleStyle()
          }}
        >
          {title}
        </div>
        <div 
          className="mt-1 text-3xl md:text-4xl font-extrabold transition-transform duration-300 group-hover:scale-[1.02]" 
          style={{ 
            fontSize: `calc(1.875rem * var(--font-scale))`,
            color: `rgb(var(--color-text))`
          }}
        >
          {value}
        </div>
        <div 
          className="mt-1 text-sm" 
          style={{ 
            fontSize: `calc(0.8125rem * var(--font-scale))`,
            color: `rgb(var(--color-text) / 0.7)`
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
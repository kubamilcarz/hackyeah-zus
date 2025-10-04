"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ZusText,
  ZusInput,
  ZusButton,
} from "@/components/zus-ui";

function fmtPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

// illustrative factor ONLY for UI preview (replace with real calc later)
const REAL_POWER_FACTOR = 0.70;

export default function SavingsScreen() {
  const router = useRouter();
  const params = useSearchParams();

  // Base from previous step(s) or backend
  const zusNominal = Number(params.get("zusPension") ?? "2964"); // fallback like in screenshot
  const sickDaysFromPrev = params.get("sickDays12m");
  const sickDaysInitial = sickDaysFromPrev === null ? "" : sickDaysFromPrev; // keep as text to allow ""

  const realToday = Math.round(zusNominal * REAL_POWER_FACTOR);

  // Savings toggles + amounts
  const [ikeOn, setIkeOn] = useState(false);
  const [ikzeOn, setIkzeOn] = useState(false);
  const [ppkOn, setPpkOn] = useState(false);
  const [ppeOn, setPpeOn] = useState(false);
  const [otherOn, setOtherOn] = useState(false);

  const [ike, setIke] = useState<string>("");
  const [ikze, setIkze] = useState<string>("");
  const [ppk, setPpk] = useState<string>("");
  const [ppe, setPpe] = useState<string>("");
  const [other, setOther] = useState<string>("");

  // Sick leaves (optional – carried from earlier but editable here too)
  const [sickDays] = useState<string>(String(sickDaysInitial ?? ""));

  const monthlyTotal = useMemo(() => {
    const sum =
      (ikeOn ? Number(ike || 0) : 0) +
      (ikzeOn ? Number(ikze || 0) : 0) +
      (ppkOn ? Number(ppk || 0) : 0) +
      (ppeOn ? Number(ppe || 0) : 0) +
      (otherOn ? Number(other || 0) : 0);
    return Math.max(0, Math.round(sum));
  }, [ikeOn, ikzeOn, ppkOn, ppeOn, otherOn, ike, ikze, ppk, ppe, other]);

  const canContinue = true; // everything optional on this step

  function goNext() {
    const q = new URLSearchParams({
      zusPension: String(zusNominal),
      realPowerToday: String(realToday),
      sickDays12m: String(sickDays === "" ? 0 : Number(sickDays)),
      ikeOn: String(ikeOn),
      ikzeOn: String(ikzeOn),
      ppkOn: String(ppkOn),
      ppeOn: String(ppeOn),
      otherOn: String(otherOn),
      ike: String(ikeOn ? Number(ike || 0) : 0),
      ikze: String(ikzeOn ? Number(ikze || 0) : 0),
      ppk: String(ppkOn ? Number(ppk || 0) : 0),
      ppe: String(ppeOn ? Number(ppe || 0) : 0),
      other: String(otherOn ? Number(other || 0) : 0),
      monthlyTotal: String(monthlyTotal),
    });
    router.push(`/result?${q.toString()}`);
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto py-12 px-4">
    <div className="bg-white rounded-2xl">
        <div className="p-6 md:p-8 lg:p-10 space-y-8">
          <header className="space-y-2 text-center">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-[rgb(var(--zus-black))]">
              Twoja prognoza emerytalna
            </h1>
            <ZusText className="text-neutral-700">
              Poniżej możesz dodać dobrowolne oszczędzanie i uwzględnić zwolnienia lekarskie.
              To pomoże doprecyzować ostateczną prognozę.
            </ZusText>
          </header>

          {/* Top tiles: nominal vs real today */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Tile tone="primary" title="Emerytura z ZUS" subtitle="Kwota nominalna" value={fmtPLN(zusNominal)} />
            <Tile tone="success" title="Siła nabywcza dziś" subtitle="Uwzględnia inflację" value={fmtPLN(realToday)} />
          </div>

          {/* Savings section */}
          <section className="mt-2 bg-gray-50 p-6 rounded-xl">
            <h2 className="text-center text-[18px] md:text-[20px] font-semibold text-neutral-900">
              Czy oszczędzasz dodatkowo na emeryturę?
            </h2>
            <ZusText className="text-center mt-1">Zaznacz formy oszczędzania i podaj miesięczne kwoty.</ZusText>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SavingsCard
                checked={ikeOn}
                onToggle={(v) => {
                  setIkeOn(v);
                  if (v && ike === "") setIke("0");
                }}
                title="IKE (Indywidualne Konto Emerytalne)"
                description="Ulga podatkowa do 1 360 zł rocznie. Środki dostępne po 60. roku życia."
                value={ike}
                onValue={setIke}
              />

              <SavingsCard
                checked={ikzeOn}
                onToggle={(v) => {
                  setIkzeOn(v);
                  if (v && ikze === "") setIkze("0");
                }}
                title="IKZE (Indywidualne Konto Zabezpieczenia Emerytalnego)"
                description="Ulga podatkowa do 9 440 zł rocznie. Środki dostępne po osiągnięciu wieku emerytalnego."
                value={ikze}
                onValue={setIkze}
              />

              <SavingsCard
                checked={ppkOn}
                onToggle={(v) => {
                  setPpkOn(v);
                  if (v && ppk === "") setPpk("0");
                }}
                title="PPK (Pracownicze Plany Kapitałowe)"
                description="2% Twojej składki + 1,5% od pracodawcy + dopłaty od państwa. Automatyczne inwestowanie."
                value={ppk}
                onValue={setPpk}
              />

              <SavingsCard
                checked={ppeOn}
                onToggle={(v) => {
                  setPpeOn(v);
                  if (v && ppe === "") setPpe("0");
                }}
                title="PPE (Pracowniczy Program Emerytalny)"
                description="Program emerytalny organizowany przez pracodawcę. Często z dopłatą firmy."
                value={ppe}
                onValue={setPpe}
              />

              <SavingsCard
                checked={otherOn}
                onToggle={(v) => {
                  setOtherOn(v);
                  if (v && other === "") setOther("0");
                }}
                title="Inne oszczędności"
                description="Lokaty, fundusze inwestycyjne, nieruchomości, akcje lub inne formy oszczędzania."
                value={other}
                onValue={setOther}
                placeholder="Miesięczna kwota (zł)"
              />
            </div>

            {/* Monthly total preview */}
            <div className="mt-4 flex items-center justify-end">
              <div className="text-[14px] text-neutral-700">
                Suma miesięcznych wpłat: <span className="font-semibold">{fmtPLN(monthlyTotal)}</span>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="pt-2 w-80 mx-auto">
            <ZusButton
              variant="primary"
              type="button"
              className="w-full h-12 text-[15px]"
              disabled={!canContinue}
              aria-disabled={!canContinue}
              onClick={goNext}
            >
              Oblicz ostateczną prognozę
            </ZusButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Local UI helpers (kept tiny to avoid bloating the kit) --- */

function Tile({
  title,
  subtitle,
  value,
  tone = "primary",
}: {
  title: string;
  subtitle: string;
  value: string;
  tone?: "primary" | "success";
}) {
  const isSuccess = tone === "success";
  const bgColor = isSuccess ? "bg-[var(--color-zus-green-bg)]" : "bg-[#F3F6FA]";
  const titleColor = isSuccess ? "text-[var(--zus-green)]" : "text-[#2E6AA2]";

  const circlesColor = isSuccess ? "fill-[var(--zus-green)]/5" : "fill-[#2E6AA2]/5";

  return (
    <div className={`relative overflow-hidden rounded-xl p-5 md:p-6 transition-transform ${bgColor}`}>
      {/* Decorative background circles */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <circle cx="170" cy="-10" r="90" className={circlesColor} />
        <circle cx="30" cy="180" r="50" className={circlesColor} />
      </svg>

      {/* Content */}
      <div className="relative z-10">
        <div className={`text-[13px] font-semibold ${titleColor}`}>{title}</div>
        <div className="mt-1 text-3xl md:text-4xl font-extrabold text-[rgb(var(--zus-black))] transition-transform duration-300 group-hover:scale-[1.02]">
          {value}
        </div>
        <div className="mt-1 text-[13px] text-neutral-700">{subtitle}</div>
      </div>
    </div>
  );
}

function SavingsCard({
  checked,
  onToggle,
  title,
  description,
  value,
  onValue,
  placeholder = "Miesięczna wpłata (zł)",
}: {
  checked: boolean;
  onToggle: (v: boolean) => void;
  title: string;
  description: string;
  value: string;
  onValue: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div 
      className={`rounded-xl border p-5 cursor-pointer transition-colors ${
        checked ? 'border-[#2E6AA2] bg-blue-50' : 'hover:bg-gray-50 bg-white'
      }`}
      onClick={() => onToggle(!checked)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[15px] font-semibold text-neutral-900">{title}</div>
          <p className="zus-text-small mt-1 text-neutral-700">{description}</p>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-neutral-700 select-none pointer-events-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border border-[#2E6AA2] accent-[#2E6AA2]"
            checked={checked}
            readOnly
          />
          {/* <span>{checked ? "Uwzględnione" : "Dodaj"}</span> */}
        </label>
      </div>

      {checked ? (
        <div className="mt-4 w-64" onClick={(e) => e.stopPropagation()}>
          <ZusInput
            id={`${title}-amount`}
            label={placeholder}
            type="number"
            min={0}
            step={50}
            value={value}
            onChange={(e) => onValue(e)}
          />
        </div>
      ) : null}
    </div>
  );
}
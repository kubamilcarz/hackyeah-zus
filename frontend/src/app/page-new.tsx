"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ZusCard,
  ZusCardHeader,
  ZusCardBody,
  ZusHeading,
  ZusText,
  ZusButton,
} from "@/components/zus-ui";

// Lazy load chart to keep TTI low
const Bar = dynamic(() => import("react-chartjs-2").then(m => m.Bar), { ssr: false });
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function fmtPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

// placeholders; swap with real data later
const ŚREDNIA = 3200;
const WYSOKA = 5200;
const IKZE_UPLIFT = 0.08;
const PPK_UPLIFT = 0.12;

export default function WelcomeStart() {
  const router = useRouter();

  const [ikze, setIkze] = useState(false);
  const [ppk, setPpk] = useState(false);
  const [value, setValue] = useState<number>(4000);

  // enforce steps of 500 for arrows; allow free typing otherwise
  const onNumberKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setValue(v => {
          const delta = e.key === "ArrowUp" ? 500 : -500;
          const next = Math.max(0, (v || 0) + delta);
          return Math.round(next / 500) * 500;
        });
      }
    },
    []
  );

  const onNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "").replace(",", ".");
    const num = Number(raw);
    if (Number.isFinite(num)) setValue(num);
    else setValue(0);
  }, []);

  const powered = useMemo(() => {
    let v = value || 0;
    if (ikze) v += v * IKZE_UPLIFT;
    if (ppk) v += v * PPK_UPLIFT;
    return Math.round(v);
  }, [value, ikze, ppk]);

  const chartData = useMemo(
    () => ({
      labels: ["Średnia krajowa", "Wysoka", "Twoja docelowa"],
      datasets: [
        {
          label: "Emerytura (PLN)",
          data: [ŚREDNIA, WYSOKA, value || 0],
          backgroundColor: ["#BFC5CE", "#00416E", "#F4F5F6"],
          borderColor: ["#9CA3AF", "#00416E", "#6B7280"],
          borderWidth: 2,
          borderRadius: 8,
        },
        ...(ikze || ppk
          ? [
              {
                label: "Z dodatkowymi oszczędnościami",
                data: [0, 0, powered],
                backgroundColor: "#00993F",
                borderColor: "#059669",
                borderWidth: 2,
                borderRadius: 8,
              },
            ]
          : []),
      ],
    }),
    [value, powered, ikze, ppk]
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        display: true, 
        labels: { 
          usePointStyle: true,
          padding: 15,
          font: {
            size: 14
          }
        } 
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
  };

  const educationalText = useMemo(() => {
    if ((value || 0) >= 6000)
      return "Osoby z najwyższymi świadczeniami zwykle pracowały dłużej i miały dłuższe okresy składkowe.";
    if ((value || 0) >= 4000)
      return "Przesunięcie przejścia na emeryturę o 5 lat często istotnie podnosi świadczenie.";
    return "Okresy chorobowe również wpływają na podstawę — w symulatorze możesz je uwzględnić.";
  }, [value]);

  const isValid = (value || 0) > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <ZusCard variant="default" className="p-0 shadow-lg border-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* LEFT COLUMN */}
            <div className="p-8 lg:p-10">
              <ZusCardHeader className="p-0 mb-8">
                <ZusHeading level={1} className="text-3xl font-bold text-gray-900 mb-4">
                  Ile chcesz otrzymywać na emeryturze?
                </ZusHeading>
                <ZusText className="text-lg text-gray-600 leading-relaxed">
                  Wprowadź kwotę, którą chciałbyś otrzymywać miesięcznie. 
                  Porównamy ją z aktualną średnią krajową i wysokimi świadczeniami.
                </ZusText>
              </ZusCardHeader>

              <ZusCardBody className="p-0 space-y-8">
                {/* Amount field */}
                <div>
                  <label htmlFor="kwota" className="block text-sm font-semibold text-gray-700 mb-3">
                    Docelowa emerytura miesięczna
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id="kwota"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={500}
                      value={Number.isFinite(value) ? value : 0}
                      onChange={onNumberChange}
                      onKeyDown={onNumberKeyDown}
                      className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      aria-describedby="kwota-help"
                      placeholder="np. 4000"
                    />
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap">
                      {fmtPLN(value || 0)}
                    </span>
                  </div>
                  <p id="kwota-help" className="mt-2 text-sm text-gray-500">
                    Użyj strzałek ↑/↓ aby zmieniać wartość o 500 zł lub wpisz kwotę ręcznie
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Dodatkowe oszczędności emerytalne
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={ikze}
                        onChange={(e) => setIkze(e.target.checked)}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">IKZE</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Indywidualne Konto Zabezpieczenia Emerytalnego
                          <br />
                          <span className="text-green-600">Przykładowy wzrost: {Math.round(IKZE_UPLIFT * 100)}%</span>
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={ppk}
                        onChange={(e) => setPpk(e.target.checked)}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">PPK</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Pracownicze Plany Kapitałowe
                          <br />
                          <span className="text-green-600">Przykładowy wzrost: {Math.round(PPK_UPLIFT * 100)}%</span>
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </ZusCardBody>
            </div>

            {/* RIGHT COLUMN */}
            <div className="p-8 lg:p-10 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
              <section className="h-full flex flex-col">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Porównanie z aktualnymi emerytunami
                </h2>
                <div className="flex-1 min-h-[300px]">
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="mt-6 text-sm text-gray-600">
                  <p className="font-medium mb-2">Aktualne dane (2024):</p>
                  <ul className="space-y-1">
                    <li>• Średnia emerytura: {fmtPLN(ŚREDNIA)}</li>
                    <li>• Wysoka emerytura: {fmtPLN(WYSOKA)}</li>
                    <li>• Twój cel: {fmtPLN(value || 0)}</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* BOTTOM ROW (spans both columns) */}
            <div className="lg:col-span-2 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-8 lg:p-10 border-t border-gray-200 bg-blue-50">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Wiedza praktyczna</h3>
                <p className="text-gray-700 leading-relaxed">
                  {educationalText}
                </p>
              </div>

              <ZusButton
                variant="primary"
                size="large"
                disabled={!isValid}
                onClick={() => router.push("/simulator")}
                className="px-8 py-3 text-lg font-semibold whitespace-nowrap"
              >
                Przejdź do symulatora
              </ZusButton>
            </div>
          </div>
        </ZusCard>
      </div>
    </div>
  );
}

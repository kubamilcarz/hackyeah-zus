"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ZusButton } from "@/components/zus-ui";

// Lazy load chart to keep TTI low
const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), {
  ssr: false,
});
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

export default function WelcomeStart() {
  const router = useRouter();
  const [value, setValue] = useState<number>(4000);

  // enforce steps of 500 for arrows; allow free typing otherwise
  const onNumberKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setValue((v) => {
          const delta = e.key === "ArrowUp" ? 500 : -500;
          const next = Math.max(0, (v || 0) + delta);
          return Math.round(next / 500) * 500;
        });
      }
    },
    []
  );

  const onNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\s/g, "").replace(",", ".");
      const num = Number(raw);
      if (Number.isFinite(num)) setValue(num);
      else setValue(0);
    },
    []
  );

  const ciekawostkaText = useMemo(() => {
    if ((value || 0) >= 6000)
      return "Osoby z najwyższymi świadczeniami zwykle pracowały dłużej i miały dłuższe okresy składkowe.";
    if ((value || 0) >= 4000)
      return "Przesunięcie przejścia o 5 lat często istotnie podnosi świadczenie.";
    return "Okresy L4 też wpływają na podstawę — w symulatorze możesz je uwzględnić.";
  }, [value]);

  const isValid = (value || 0) > 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Question Section */}
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold zus-text-green mb-6">
          Jaką emeryturę chciałbyś otrzymywać w przyszłości?
        </h2>

        {/* Input Section */}
        <div className="mb-6 flex justify-center gap-6 items-center">
          <label className="block text-gray-700 font-semibold mb-2">
            Oczekiwana emerytura:
          </label>
          <div className="flex items-center justify-center gap-3">
            <input
              id="kwota"
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              value={Number.isFinite(value) ? value : 0}
              onChange={onNumberChange}
              onKeyDown={onNumberKeyDown}
              className="w-32 px-4 py-2 text-lg text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-600">zł brutto miesięcznie</span>
          </div>
        </div>

        <p className="text-gray-600 mb-8">
          Wprowadź kwotę emerytury, którą chciałbyś otrzymywać miesięcznie
        </p>

        {/* Three Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zus-green rounded-lg p-6 text-center">
            <div className="text-white font-semibold mb-2">
              Twoja oczekiwana emerytura
            </div>
            <div className="text-2xl font-bold text-white">
              {fmtPLN(value || 0)}
            </div>
          </div>

          <div className="bg-zus-gray rounded-lg p-6 text-center">
            <div className="text-gray-700 font-semibold mb-2">
              Średnia emerytura w Polsce
            </div>
            <div className="text-2xl font-bold text-gray-700">
              {fmtPLN(ŚREDNIA)}
            </div>
          </div>

          <div className="bg-zus-red rounded-lg p-6 text-center">
            <div className="text-white font-semibold mb-2">
              Emerytura minimalna
            </div>
            <div className="text-2xl font-bold text-white">1 588 zł</div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Porównanie Twoich oczekiwań z rzeczywistością
          </h3>

          {/* Interactive Chart */}
          <div className="h-64 mb-6">
            <Bar
              data={{
                labels: ["Minimalna", "Średnia", "Twoja oczekiwana"],
                datasets: [
                  {
                    label: "Wysokość emerytury (zł)",
                    data: [1588, ŚREDNIA, value || 0],
                    backgroundColor: ["#DC2626", "#6B7280", "#00993f"],
                    borderColor: ["#DC2626", "#6B7280", "#00993f"],
                    borderWidth: 2,
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${fmtPLN(context.parsed.y)}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => fmtPLN(Number(value)),
                    },
                    grid: { color: "#E5E7EB" },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded mb-6 w-full">
            <div className="flex items-stretch">
              <div className="flex-shrink-0">
                <span className="text-blue-500 text-lg">💡</span>
              </div>
              <div className="ml-3 flex flex-col gap-1 items-start">
                <h4 className="text-sm font-semibold text-blue-800">
                  Czy wiesz, że...
                </h4>
                <p className="text-sm text-blue-700 mt-1">{ciekawostkaText}</p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <ZusButton
            variant="primary"
            size="large"
            disabled={!isValid}
            onClick={() => router.push("/signup")}
            className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Rozpocznij Symulację
          </ZusButton>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ZusHeading, ZusText, ZusInput } from "@/components/zus-ui";

const fmtPLN = (n: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(isFinite(n) ? n : 0)));

export function SalaryChangeSection() {
  const [currentSalary, setCurrentSalary] = useState("8000");
  const [newSalary, setNewSalary] = useState("");
  
  const current = parseInt(currentSalary) || 0;
  const updated = parseInt(newSalary) || current;
  const pensionIncrease = Math.round((updated - current) * 0.4);

  return (
    <div className="bg-zus-card rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">📈</span>
        <ZusHeading level={4}>Awans w pracy</ZusHeading>
      </div>
      <ZusText variant="small" className="text-gray-600 mb-4">
        Zarabiam więcej - jak to wpłynie na emeryturę?
      </ZusText>
      <div className="space-y-4">
        <ZusInput
          id="current-salary"
          label="Obecna pensja"
          type="number"
          value={currentSalary}
          onChange={setCurrentSalary}
          placeholder="8000"
        />
        
        <ZusInput
          id="new-salary"
          label="Nowa pensja po awansie"
          type="number"
          value={newSalary}
          onChange={setNewSalary}
          placeholder="10000"
        />
        
        {newSalary && (
          <div className="p-3 bg-green-50 rounded-lg">
            <ZusText variant="small" className="text-green-800">
              <strong>Wzrost emerytury: +{fmtPLN(pensionIncrease)}</strong>
            </ZusText>
            <ZusText variant="small" className="text-green-600">
              ({Math.round(((updated - current) / current) * 100)}% więcej pensji = {Math.round(((updated - current) * 0.4 / (current * 0.4)) * 100)}% więcej emerytury)
            </ZusText>
          </div>
        )}
      </div>
    </div>
  );
}

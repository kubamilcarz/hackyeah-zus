"use client";

import React, { useState } from "react";
import { ZusHeading, ZusText } from "@/components/zus-ui";

export function AdditionalSavingsSection() {
  const [ikeAmount, setIkeAmount] = useState(0);
  const [ikzeAmount, setIkzeAmount] = useState(0);
  const [ppkAmount, setPpkAmount] = useState(0);
  const [otherAmount, setOtherAmount] = useState(0);
  
  const totalMonthly = ikeAmount + ikzeAmount + ppkAmount + otherAmount;
  const estimatedAnnualReturn = 0.05; // 5% annual return
  const yearsToRetirement = 30;
  
  // Calculate future value of monthly contributions
  const futureValue = totalMonthly * 12 * (Math.pow(1 + estimatedAnnualReturn, yearsToRetirement) - 1) / estimatedAnnualReturn;
  const monthlyPensionIncrease = futureValue * 0.04 / 12; // 4% withdrawal rate
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">💳</span>
        <ZusHeading level={4}>Dodatkowe oszczędzanie</ZusHeading>
      </div>
      <ZusText variant="small" className="text-gray-600 mb-4">
        Ustaw dodatkowe wpłaty na emeryturę
      </ZusText>
      
      <div className="p-3 bg-blue-50 rounded-lg mb-6">
        <ZusText variant="small" className="text-blue-800 font-medium">
          🧠 Jak to wpływa?
        </ZusText>
        <ZusText variant="small" className="text-blue-600 mt-1">
          IKE i IKZE to ulgi podatkowe. PPK ma dopłaty od pracodawcy. Więcej oszczędności = wyższa emerytura.
        </ZusText>
      </div>
      
      <div className="space-y-4">
        {/* IKE */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <ZusText variant="small" className="font-medium">IKE</ZusText>
            <span className="text-sm font-bold">{ikeAmount} zł/mies.</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            value={ikeAmount}
            onChange={(e) => setIkeAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* IKZE */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <ZusText variant="small" className="font-medium">IKZE</ZusText>
            <span className="text-sm font-bold">{ikzeAmount} zł/mies.</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            value={ikzeAmount}
            onChange={(e) => setIkzeAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* PPK */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <ZusText variant="small" className="font-medium">PPK</ZusText>
            <span className="text-sm font-bold">{ppkAmount} zł/mies.</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            value={ppkAmount}
            onChange={(e) => setPpkAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Inne */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <ZusText variant="small" className="font-medium">Inne oszczędności</ZusText>
            <span className="text-sm font-bold">{otherAmount} zł/mies.</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="100"
            value={otherAmount}
            onChange={(e) => setOtherAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Summary */}
        <div className="p-3 bg-green-50 rounded-lg">
          <ZusText variant="small" className="text-green-800 font-medium">
            Łącznie: {totalMonthly} zł/miesięcznie
          </ZusText>
          <ZusText variant="small" className="text-green-600">
            Dodatkowa emerytura: +{monthlyPensionIncrease.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} zł/miesiąc
          </ZusText>
        </div>
      </div>
    </div>
  );
}

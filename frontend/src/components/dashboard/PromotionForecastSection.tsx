"use client";

import React, { useState } from "react";
import { ZusHeading, ZusText, ZusButton } from "@/components/zus-ui";

export function PromotionForecastSection() {
  const [currentSalary, setCurrentSalary] = useState(5000);
  const [promotionIncrease, setPromotionIncrease] = useState(20);
  
  const newSalary = currentSalary * (1 + promotionIncrease / 100);
  const yearlyDifference = (newSalary - currentSalary) * 12;
  const pensionImpact = yearlyDifference * 25 * 0.24; // Rough pension calculation
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">📈</span>
        <ZusHeading level={4}>Awans w pracy</ZusHeading>
      </div>
      <ZusText variant="small" className="text-gray-600 mb-4">
        Zwiększ wynagrodzenie i zobacz wpływ na emeryturę
      </ZusText>
      
      <div className="p-3 bg-blue-50 rounded-lg mb-6">
        <ZusText variant="small" className="text-blue-800 font-medium">
          🧠 Jak to wpływa?
        </ZusText>
        <ZusText variant="small" className="text-blue-600 mt-1">
          Wyższe składki = wyższa emerytura. Każde 100 zł podwyżki to ~25 zł więcej emerytury miesięcznie.
        </ZusText>
      </div>
      
      <div className="space-y-4">
        <div>
          <ZusText variant="small" className="font-medium mb-2">Obecne wynagrodzenie</ZusText>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="3000"
              max="20000"
              step="500"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-bold min-w-[80px]">{currentSalary.toLocaleString('pl-PL')} zł</span>
          </div>
        </div>
        
        <div>
          <ZusText variant="small" className="font-medium mb-2">Planowana podwyżka</ZusText>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={promotionIncrease}
              onChange={(e) => setPromotionIncrease(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-bold min-w-[40px]">{promotionIncrease}%</span>
          </div>
        </div>
        
        <div className="p-3 bg-green-50 rounded-lg">
          <ZusText variant="small" className="text-green-800 font-medium">
            Nowe wynagrodzenie: {newSalary.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} zł
          </ZusText>
          <ZusText variant="small" className="text-green-600">
            Dodatkowa emerytura: +{(pensionImpact/12).toLocaleString('pl-PL', { maximumFractionDigits: 0 })} zł/miesiąc
          </ZusText>
        </div>
        
        <ZusButton variant="primary" size="small" className="w-full">
          Sprawdź szczegóły
        </ZusButton>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ZusHeading, ZusText } from "@/components/zus-ui";

export function RiskScenariosSection() {
  const [riskLevel, setRiskLevel] = useState(30); // 0 = conservative, 100 = aggressive
  
  // Calculate IKZE vs PPK allocation based on risk
  const ikzeAllocation = Math.round(riskLevel);
  const ppkAllocation = 100 - ikzeAllocation;
  
  // Estimated returns based on risk level
  const conservativeReturn = 3; // 3% per year
  const aggressiveReturn = 7; // 7% per year
  const expectedReturn = conservativeReturn + (riskLevel / 100) * (aggressiveReturn - conservativeReturn);
  
  return (
    <div className="bg-zus-card rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">⚖️</span>
        <ZusHeading level={4}>Scenariusz ryzyka</ZusHeading>
      </div>
      <ZusText variant="small" className="text-gray-600 mb-4">
        Ustaw profil ryzyka dla dodatkowych oszczędności
      </ZusText>
      
      <div className="p-3 bg-blue-50 rounded-lg mb-6">
        <ZusText variant="small" className="text-blue-800 font-medium">
          🧠 Jak to wpływa?
        </ZusText>
        <ZusText variant="small" className="text-blue-600 mt-1">
          Większe ryzyko = większy potencjał zysku, ale też strat. Dywersyfikacja chroni kapitał.
        </ZusText>
      </div>
      
      <div className="space-y-6">
        {/* Risk Level Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <ZusText variant="small" className="font-medium">Profil ryzyka</ZusText>
            <span className="text-lg font-bold text-orange-700">
              {riskLevel < 30 ? 'Konserwatywny' : 
               riskLevel < 70 ? 'Umiarkowany' : 
               'Agresywny'}
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={riskLevel}
              onChange={(e) => setRiskLevel(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  var(--zus-green) 0%, 
                  var(--zus-yellow) 50%, 
                  var(--zus-red) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Mało ryzyka</span>
              <span>Dużo ryzyka</span>
            </div>
          </div>
        </div>

        {/* IKZE Allocation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <ZusText variant="small" className="font-medium">IKZE (Individual)</ZusText>
            <span className="text-sm font-bold">{ikzeAllocation}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-zus-navy h-3 rounded-full transition-all duration-300"
              style={{ width: `${ikzeAllocation}%` }}
            />
          </div>
        </div>

        {/* PPK Allocation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <ZusText variant="small" className="font-medium">PPK (Employee Capital Plans)</ZusText>
            <span className="text-sm font-bold">{ppkAllocation}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-zus-yellow h-3 rounded-full transition-all duration-300"
              style={{ width: `${ppkAllocation}%` }}
            />
          </div>
        </div>

        {/* Expected Return */}
        <div className="p-3 bg-orange-50 rounded-lg">
          <ZusText variant="small" className="text-orange-800">
            <strong>Oczekiwany zwrot: {expectedReturn.toFixed(1)}% rocznie</strong>
          </ZusText>
          <ZusText variant="small" className="text-orange-600">
            {riskLevel < 30 ? 'Niższe ryzyko, stabilne zwroty' :
             riskLevel < 70 ? 'Umiarkowane ryzyko i potencjał' :
             'Wyższe ryzyko, wyższy potencjał'}
          </ZusText>
        </div>

        {/* Risk Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>• IKZE: Indywidualne konto emerytalne</div>
          <div>• PPK: Pracownicze Plany Kapitałowe</div>
          <div>• Dywersyfikacja zmniejsza ryzyko</div>
        </div>
      </div>
    </div>
  );
}

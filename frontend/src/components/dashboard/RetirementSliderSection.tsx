"use client";

import React, { useState } from "react";
import { ZusHeading, ZusText } from "@/components/zus-ui";

export function RetirementSliderSection() {
  const [retirementAge, setRetirementAge] = useState(67);
  const [interactiveMonths, setInteractiveMonths] = useState(420); // 35 years default
  
  const standardAge = 67;
  const yearsDifference = retirementAge - standardAge;
  const pensionMultiplier = 1 + (yearsDifference * 0.06); // 6% per year difference
  
  return (
    <div className="bg-zus-card rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">⏰</span>
        <ZusHeading level={4}>Wiek przejścia na emeryturę</ZusHeading>
      </div>
      <ZusText variant="small" className="text-gray-600 mb-4">
        Określ kiedy chcesz przejść na emeryturę
      </ZusText>
      
      <div className="p-3 bg-blue-50 rounded-lg mb-6">
        <ZusText variant="small" className="text-blue-800 font-medium">
          🧠 Jak to wpływa?
        </ZusText>
        <ZusText variant="small" className="text-blue-600 mt-1">
          Każdy rok późniejszej emerytury to +6% świadczenia. Wcześniejsza = mniejsza emerytura.
        </ZusText>
      </div>
      <div className="space-y-6">
        {/* Age Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <ZusText variant="small" className="font-medium">Wiek emerytury</ZusText>
            <span className="text-lg font-bold text-zus-navy">{retirementAge} lat</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="60"
              max="70"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--zus-navy) 0%, var(--zus-navy) ${((retirementAge - 60) / 10) * 100}%, #e5e7eb ${((retirementAge - 60) / 10) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>60</span>
              <span>65</span>
              <span>70</span>
            </div>
          </div>
        </div>

        {/* Months Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <ZusText variant="small" className="font-medium">Okres składkowy</ZusText>
            <span className="text-lg font-bold text-zus-navy">{Math.round(interactiveMonths/12)} lat</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="240"
              max="600"
              step="12"
              value={interactiveMonths}
              onChange={(e) => setInteractiveMonths(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--zus-blue) 0%, var(--zus-blue) ${((interactiveMonths - 240) / 360) * 100}%, #e5e7eb ${((interactiveMonths - 240) / 360) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20 lat</span>
              <span>35 lat</span>
              <span>50 lat</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <ZusText variant="small" className="text-blue-800">
            <strong>Wpływ na emeryturę: {pensionMultiplier > 1 ? '+' : ''}{Math.round((pensionMultiplier - 1) * 100)}%</strong>
          </ZusText>
          <ZusText variant="small" className="text-blue-600">
            {yearsDifference > 0 ? 'Później = wyższa emerytura' : 
             yearsDifference < 0 ? 'Wcześniej = niższa emerytura' : 
             'Standardowy wiek emerytalny'}
          </ZusText>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { ZusHeading, ZusText, ZusButton } from "@/components/zus-ui";

export function QuizSection() {
  return (
    <div className="bg-zus-card rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🧠</span>
        <ZusHeading level={4}>Test wiedzy</ZusHeading>
      </div>
      <ZusText variant="small" className="text-gray-600 mb-4">
        Sprawdź co wiesz o emeryturach
      </ZusText>
      <ZusText variant="small" className="text-gray-700 mb-4">
        Krótki quiz o systemie emerytalnym w Polsce. Dowiedz się, jak działają składki i co wpływa na wysokość świadczenia.
      </ZusText>
      <ZusButton variant="primary" className="w-full">
        Rozpocznij quiz
      </ZusButton>
    </div>
  );
}

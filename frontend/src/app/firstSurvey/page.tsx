"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ZusButton } from "@/components/zus-ui";
import { ZusText } from "@/components/ui/zus-text";
import { KnowledgeQuizTile } from "@/components/dashboard/knowledge-quiz";
import { useStepProgression } from "@/lib/store";

export default function FirstSurvey() {
  const router = useRouter();
  const { completeCurrentStep, nextStep } = useStepProgression();

  const handleNext = () => {
    completeCurrentStep();
    nextStep();
    router.push('/missingData');
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4">
    <div className="bg-zus-card rounded-2xl">
        <div className="p-8 md:p-10 space-y-10">
          {/* Header */}
          <header className="space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}>
              Zanim przejdziesz dalej…
            </h1>
            <ZusText className="text-neutral-700">
              Zrób szybki test wiedzy o emeryturze i sprawdź, ile już wiesz o swojej przyszłości finansowej.
            </ZusText>
          </header>

        <KnowledgeQuizTile />

          {/* CTA */}
          <div className="flex flex-col md:flex-row gap-3 justify-end pt-4">

            <div className="flex flex-col md:flex-row gap-3 justify-center pt-4">
              <ZusButton variant="outline" type="button" className="px-8" onClick={handleNext}>
                Pomiń na teraz
              </ZusButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
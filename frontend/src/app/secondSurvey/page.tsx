"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ZusButton } from "@/components/zus-ui";
import { ZusText } from "@/components/ui/zus-text";
import { KnowledgeQuizTile } from "@/components/dashboard/knowledge-quiz";

export default function FirstSurvey() {
  const params = useSearchParams();
  const router = useRouter();

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4">
    <div className="bg-zus-card rounded-2xl">
        <div className="p-8 md:p-10 space-y-10">
          {/* Header */}
          <header className="space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]" style={{ fontSize: `calc(1.625rem * var(--font-scale))` }}>
              Znasz swój wynik, poznaj zasady
            </h1>
            <ZusText className="text-neutral-700">
              Krótki test pomoże Ci lepiej zrozumieć, jak działa system i na co masz wpływ.
            </ZusText>
          </header>

        <KnowledgeQuizTile />

          {/* CTA */}
          <div className="flex flex-col md:flex-row gap-3 justify-end pt-4">

            <div className="flex flex-col md:flex-row gap-3 justify-center pt-4">
              <ZusButton variant="outline" type="button" className="px-8" onClick={() => router.push('/dashboard')}>
                Pomiń na teraz
              </ZusButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { CallToActionSuggestions } from "@/components/CallToActionSuggestions";
import { CriteriaBreakdown } from "@/components/CriteriaBreakdown";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ImprovedPitchCard } from "@/components/ImprovedPitchCard";
import { LoadingState } from "@/components/LoadingState";
import { MistakesList } from "@/components/MistakesList";
import { PitchInput } from "@/components/PitchInput";
import { RecommendationsList } from "@/components/RecommendationsList";
import { ScoreCard } from "@/components/ScoreCard";
import { ShortPitchCard } from "@/components/ShortPitchCard";
import { StrengthsList } from "@/components/StrengthsList";
import { WeaknessesList } from "@/components/WeaknessesList";
import { WordCounter } from "@/components/WordCounter";
import { PitchAnalysis } from "@/types/pitch";

export default function HomePage() {
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PitchAnalysis | null>(null);

  const words = useMemo(() => pitch.trim().split(/\s+/).filter(Boolean).length, [pitch]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!pitch.trim()) return setError("Le champ est vide.");
    if (words < 20) return setError("Votre pitch est trop court. Minimum 20 mots.");
    if (pitch.length > 1500) return setError("Votre pitch dépasse 1 500 caractères.");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pitch }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "L’analyse a échoué.");
      setResult(data as PitchAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L’analyse a échoué.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-brand">Votre pitch donne-t-il vraiment envie d’en savoir plus ?</h1>
        <p className="mt-3 text-slate-600">Collez votre pitch. Obtenez un score précis, un diagnostic clair et une version améliorée.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <PitchInput value={pitch} onChange={setPitch} />
          <WordCounter words={words} chars={pitch.length} />
          {error && <ErrorMessage message={error} />}
          <AnalyzeButton loading={loading} />
        </form>
      </section>

      <section className="mt-8 space-y-6">
        {loading && <LoadingState />}
        {result && (
          <>
            <ScoreCard score={result.globalScore} label={result.scoreLabel} />
            <DiagnosisCard verdict={result.verdict} />
            <CriteriaBreakdown criteria={result.criteria} />
            <div className="grid gap-6 md:grid-cols-2">
              <StrengthsList items={result.strengths} />
              <WeaknessesList items={result.weaknesses} />
            </div>
            <MistakesList items={result.detectedMistakes} />
            <RecommendationsList items={result.recommendations} />
            <ImprovedPitchCard text={result.improvedPitch} />
            <ShortPitchCard text={result.shortPitch120Words} />
            <CallToActionSuggestions cta={result.callToActions} />
          </>
        )}
      </section>
    </main>
  );
}

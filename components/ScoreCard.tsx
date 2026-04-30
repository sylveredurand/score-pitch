export function ScoreCard({ score, label }: { score: number; label: string }) {
  return <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Score global : {score} / 100</h2><div className="mt-3 h-3 w-full rounded bg-slate-200"><div className="h-3 rounded bg-accent" style={{ width: `${score}%` }} /></div><p className="mt-3 text-sm text-slate-700">{label}</p></section>;
}

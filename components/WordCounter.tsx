interface Props { words: number; chars: number; }
export function WordCounter({ words, chars }: Props) {
  const hint = words < 40 ? "Pitch probablement trop court" : words <= 120 ? "Longueur idéale" : words <= 180 ? "Encore exploitable mais à resserrer" : "Pitch probablement trop long";
  return <div className="text-sm text-slate-600">{words} mots · {chars} caractères — <span className="font-medium">{hint}</span></div>;
}

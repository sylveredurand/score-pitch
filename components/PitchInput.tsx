interface Props { value: string; onChange: (v: string) => void; }
export function PitchInput({ value, onChange }: Props) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={9} className="w-full rounded-2xl border border-slate-300 p-4 text-sm shadow-sm focus:border-accent focus:outline-none" placeholder="Collez votre pitch ici..." />;
}

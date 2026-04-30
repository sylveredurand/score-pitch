export const CRITERIA_CONFIG = [
  { name: "Message unique et lisible", maxScore: 15 },
  { name: "Bénéfice client", maxScore: 15 },
  { name: "Cible identifiée", maxScore: 10 },
  { name: "Problème ou besoin traité", maxScore: 10 },
  { name: "Proposition de valeur", maxScore: 15 },
  { name: "Structure", maxScore: 10 },
  { name: "Concision", maxScore: 10 },
  { name: "Curiosité", maxScore: 5 },
  { name: "Langage clair", maxScore: 5 },
  { name: "Appel à l’action", maxScore: 5 },
] as const;

export function getScoreLabel(score: number): string {
  if (score <= 39) return "Pitch confus. L’idée existe peut-être, mais elle n’est pas encore compréhensible.";
  if (score <= 59) return "Pitch compréhensible, mais trop flou ou trop dispersé pour convaincre.";
  if (score <= 74) return "Pitch correct. Le message passe, mais il manque de précision, de rythme ou d’impact.";
  if (score <= 89) return "Bon pitch. Clair, structuré et crédible, avec encore quelques optimisations possibles.";
  return "Excellent pitch. Clair, synthétique, mémorable et orienté action.";
}

export const MAX_CHARS = 1500;
export const MIN_WORDS = 20;

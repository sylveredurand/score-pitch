export type CriterionName =
  | "Message unique et lisible"
  | "Bénéfice client"
  | "Cible identifiée"
  | "Problème ou besoin traité"
  | "Proposition de valeur"
  | "Structure"
  | "Concision"
  | "Curiosité"
  | "Langage clair"
  | "Appel à l’action";

export interface CriterionResult {
  name: CriterionName;
  score: number;
  maxScore: number;
  comment: string;
  recommendation: string;
}

export interface PitchAnalysis {
  globalScore: number;
  scoreLabel: string;
  verdict: string;
  criteria: CriterionResult[];
  strengths: string[];
  weaknesses: string[];
  detectedMistakes: string[];
  recommendations: string[];
  improvedPitch: string;
  shortPitch120Words: string;
  callToActions: {
    meeting: string;
    curiosity: string;
    conversation: string;
  };
}

import { PitchAnalysis, CriterionResult } from "@/types/pitch";
import { CRITERIA_CONFIG, getScoreLabel } from "@/lib/scoring";

const signals = {
  target: ["entrepreneurs", "dirigeants", "managers", "indépendants", "équipes", "clients", "entreprises", "porteurs de projet"],
  problem: ["difficulté", "blocage", "manque", "perte", "peur", "confusion", "stress", "temps perdu", "inefficacité", "problème"],
  benefit: ["gagner", "clarifier", "améliorer", "augmenter", "réduire", "simplifier", "convaincre", "rassurer", "décider", "vendre", "transformer"],
  cta: ["contactez-moi", "parlons-en", "échangeons", "prenez rendez-vous", "découvrez", "testez", "demandez", "envoyez-moi"],
  vague: ["innovant", "révolutionnaire", "unique", "incroyable", "complet", "performant", "qualitatif", "solution globale", "accompagnement personnalisé", "valeur ajoutée"],
  jargon: ["synergie", "disruptif", "scalable", "omni-canal", "holistique", "protocole", "pipeline", "KPI", "framework"]
};

const sentenceSplit = (t: string) => t.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
const includesOne = (text: string, words: string[]) => words.some((w) => text.includes(w));

export function fallbackAnalysis(pitch: string): PitchAnalysis {
  const text = pitch.toLowerCase();
  const words = pitch.trim().split(/\s+/).filter(Boolean);
  const sentences = sentenceSplit(pitch);
  const avgSentenceLength = sentences.length ? words.length / sentences.length : words.length;

  const hasTarget = includesOne(text, signals.target);
  const hasProblem = includesOne(text, signals.problem);
  const hasBenefit = includesOne(text, signals.benefit);
  const hasCta = includesOne(text, signals.cta);
  const hasVague = includesOne(text, signals.vague);
  const hasJargon = includesOne(text, signals.jargon);

  const criteria: CriterionResult[] = CRITERIA_CONFIG.map(({ name, maxScore }) => ({
    name,
    maxScore,
    score: Math.floor(maxScore * 0.55),
    comment: "Ce critère est partiellement couvert mais manque de force.",
    recommendation: "Rendez ce point plus concret et orienté client."
  }));

  const adjust = (criterion: CriterionResult, value: number, comment: string, recommendation: string) => {
    criterion.score = Math.max(0, Math.min(criterion.maxScore, value));
    criterion.comment = comment;
    criterion.recommendation = recommendation;
  };

  adjust(criteria[2], hasTarget ? 8 : 3, hasTarget ? "La cible est visible." : "La cible reste implicite.", "Nommez clairement votre audience dès la première phrase.");
  adjust(criteria[3], hasProblem ? 8 : 2, hasProblem ? "Le problème client est identifiable." : "Le problème vécu par le client est insuffisant.", "Formulez la douleur client en une phrase claire.");
  adjust(criteria[1], hasBenefit ? 11 : 4, hasBenefit ? "Le bénéfice client apparaît." : "Le bénéfice concret arrive trop tard ou reste flou.", "Ajoutez un résultat observable (temps, ventes, décisions, erreurs). ");
  adjust(criteria[9], hasCta ? 4 : 1, hasCta ? "La fin ouvre une interaction." : "Le pitch se termine sans appel à l’action.", "Terminez par une invitation explicite à poursuivre l’échange.");
  adjust(criteria[6], words.length >= 40 && words.length <= 120 ? 9 : words.length > 180 ? 3 : 6, "Le niveau de concision est perfectible.", "Visez 40 à 120 mots avec des phrases courtes.");
  adjust(criteria[8], hasJargon ? 2 : 4, hasJargon ? "Le vocabulaire contient du jargon." : "Le langage reste globalement accessible.", "Remplacez les termes techniques par des mots concrets.");
  adjust(criteria[0], hasVague ? 7 : 11, hasVague ? "Le message se dilue dans des formulations vagues." : "L’idée principale est relativement lisible.", "Conservez une seule promesse centrale.");

  const globalScore = criteria.reduce((acc, c) => acc + c.score, 0);
  const mistakes: string[] = [];
  if (words.length > 180) mistakes.push("Pitch trop long");
  if (!hasTarget) mistakes.push("Absence de cible claire");
  if (!hasBenefit) mistakes.push("Absence de bénéfice");
  if (avgSentenceLength > 24) mistakes.push("Phrases trop longues");
  if (hasVague) mistakes.push("Vocabulaire flou");
  if (!hasProblem) mistakes.push("Manque de problème client");
  if (!hasCta) mistakes.push("Absence d’appel à l’action");

  return {
    globalScore,
    scoreLabel: getScoreLabel(globalScore),
    verdict: hasBenefit
      ? "Votre pitch est compréhensible, mais le bénéfice client doit arriver plus vite pour capter l’attention immédiatement."
      : "Votre pitch parle de votre solution avant de montrer le problème client et le bénéfice concret. L’impact décroche trop tôt.",
    criteria,
    strengths: [
      hasTarget ? "La cible est identifiable." : "Le ton est professionnel.",
      hasProblem ? "Le problème client est abordé." : "L’intention de convaincre est présente.",
      hasCta ? "La fin ouvre une suite possible." : "Le sujet traité est pertinent pour le marché visé."
    ].slice(0, 3),
    weaknesses: [
      !hasTarget ? "La cible n’est pas assez visible." : "La proposition de valeur manque de précision.",
      !hasBenefit ? "Le bénéfice concret n’est pas mesurable." : "Le bénéfice doit être formulé plus tôt.",
      !hasCta ? "La conclusion ne crée pas d’échange." : "La fin peut être plus engageante."
    ].slice(0, 3),
    detectedMistakes: mistakes,
    recommendations: [
      "Commencez par nommer la cible, puis le problème en une phrase courte.",
      "Ajoutez un bénéfice mesurable: temps gagné, erreurs réduites ou ventes augmentées.",
      "Supprimez les termes vagues et remplacez-les par un exemple concret.",
      "Resserrez les phrases longues pour garder un rythme oral naturel.",
      "Terminez avec une invitation claire à échanger 15 minutes."
    ].slice(0, 5),
    improvedPitch: "J’aide les dirigeants et managers qui manquent de clarté dans leurs prises de parole à structurer un message simple, concret et convaincant. En quelques sessions, ils expliquent mieux leurs décisions, rassurent leurs équipes et accélèrent l’adhésion. Si ce sujet vous concerne, je peux vous montrer un exemple appliqué à votre contexte.",
    shortPitch120Words: "J’accompagne les dirigeants et managers qui ont du mal à faire passer leurs messages clés. Mon travail consiste à transformer leurs idées en pitchs courts, clairs et orientés bénéfices, pour convaincre plus vite et éviter les incompréhensions. La différence: on part d’un problème réel vécu par leur audience, puis on construit une structure simple à dire à l’oral. Résultat: des décisions mieux comprises et plus d’adhésion. Si vous voulez, je peux vous montrer comment appliquer cette méthode à votre prochain message stratégique.",
    callToActions: {
      meeting: "Si ce sujet vous parle, prenons 15 minutes pour voir comment l’appliquer à votre pitch.",
      curiosity: "La vraie question maintenant: voulez-vous voir un exemple concret sur votre propre message ?",
      conversation: "Si vous êtes concerné, échangeons simplement et je vous montre où gagner en impact."
    }
  };
}

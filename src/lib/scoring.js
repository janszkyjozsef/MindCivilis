import { DIMENSIONS, PRIMARY_ATLAS_DIMENSIONS } from "../data/dimensions.js";
import { localize } from "../data/i18n.js";

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const round = (value, digits = 0) => Number(value.toFixed(digits));

export function scoreQuestionnaire(questionnaire, answers = {}) {
  const buckets = {};
  let answered = 0;

  questionnaire.questions.forEach((question) => {
    if (!buckets[question.dimensionId]) {
      buckets[question.dimensionId] = { weighted: 0, answered: 0, total: 0, questionIds: [] };
    }
    const bucket = buckets[question.dimensionId];
    bucket.total += 1;
    const raw = Number(answers[question.id]);
    if (Number.isFinite(raw) && raw >= 1 && raw <= 5) {
      const directed = question.direction === -1 ? 6 - raw : raw;
      bucket.weighted += directed;
      bucket.answered += 1;
      bucket.questionIds.push(question.id);
      answered += 1;
    }
  });

  const dimensions = Object.fromEntries(
    Object.entries(buckets).map(([dimensionId, bucket]) => {
      const score = bucket.answered ? ((bucket.weighted / bucket.answered - 1) / 4) * 100 : 50;
      return [dimensionId, {
        score: round(clamp(score)),
        confidence: round(bucket.answered / bucket.total, 3),
        answered: bucket.answered,
        total: bucket.total,
        questionIds: bucket.questionIds,
      }];
    }),
  );

  const values = Object.values(dimensions).filter((entry) => entry.answered > 0).map((entry) => entry.score);
  const spread = values.length > 1 ? Math.sqrt(values.reduce((sum, value) => sum + (value - values.reduce((a, b) => a + b, 0) / values.length) ** 2, 0) / values.length) : 0;
  const balance = values.length ? values.reduce((sum, value) => sum + (100 - Math.abs(value - 50) * 2), 0) / values.length : 0;
  const dimensionality = clamp((values.length / Math.max(Object.keys(buckets).length, 1)) * 100);

  return {
    questionnaireId: questionnaire.id,
    questionnaireTitle: questionnaire.title,
    completedAt: new Date().toISOString(),
    answered,
    total: questionnaire.questions.length,
    coverage: round(answered / questionnaire.questions.length, 3),
    complexity: round(clamp(balance * 0.58 + dimensionality * 0.32 + clamp(spread * 1.2) * 0.1)),
    dimensions,
  };
}

export function buildProfile(history = []) {
  const newestFirst = [...history].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const scores = {};
  const confidence = {};
  const evidence = {};

  newestFirst.forEach((completion) => {
    Object.entries(completion.dimensions ?? {}).forEach(([dimensionId, result]) => {
      if (!(dimensionId in scores) && result.answered > 0) {
        scores[dimensionId] = result.score;
        confidence[dimensionId] = result.confidence;
        evidence[dimensionId] = {
          questionnaireId: completion.questionnaireId,
          completedAt: completion.completedAt,
          answered: result.answered,
          total: result.total,
        };
      }
    });
  });

  return { scores, confidence, evidence, hasData: Object.keys(scores).length > 0 };
}

export function mergeLiveProfile(history, questionnaire, answers) {
  const base = buildProfile(history);
  if (!questionnaire) return base;
  const live = scoreQuestionnaire(questionnaire, answers);
  Object.entries(live.dimensions).forEach(([dimensionId, result]) => {
    if (result.answered > 0) {
      base.scores[dimensionId] = result.score;
      base.confidence[dimensionId] = result.confidence;
      base.evidence[dimensionId] = {
        questionnaireId: questionnaire.id,
        completedAt: "live",
        answered: result.answered,
        total: result.total,
      };
    }
  });
  base.hasData = Object.keys(base.scores).length > 0;
  return base;
}

export function getProfileMetrics(profile) {
  const ids = Object.keys(profile.scores ?? {});
  const confidences = ids.map((id) => profile.confidence?.[id] ?? 0);
  const scores = ids.map((id) => profile.scores[id]);
  const averageConfidence = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;
  const balance = scores.length ? scores.reduce((sum, value) => sum + (100 - Math.abs(value - 50) * 2), 0) / scores.length : 0;
  const coverage = ids.length / PRIMARY_ATLAS_DIMENSIONS.length;
  return {
    confidence: round(averageConfidence * 100),
    coverage: round(clamp(coverage * 100)),
    complexity: round(clamp(balance * 0.68 + Math.min(ids.length * 3.2, 32))),
    layers: ids.length,
  };
}

export function getTopDimensions(profile, limit = 4) {
  return Object.entries(profile.scores ?? {})
    .filter(([id]) => DIMENSIONS[id])
    .map(([id, score]) => ({ id, score, salience: Math.abs(score - 50), confidence: profile.confidence?.[id] ?? 0 }))
    .sort((a, b) => b.salience * b.confidence - a.salience * a.confidence)
    .slice(0, limit);
}

export function getTensions(profile, limit = 3) {
  const pairs = [
    ["communityValue", "autonomyValue"],
    ["institutionalTrust", "systemCritique"],
    ["reformOrientation", "traditionValue"],
    ["socialEconomy", "achievementValue"],
    ["democraticChecks", "technocracy"],
    ["globalCooperation", "localism"],
    ["civilLiberty", "digitalCaution"],
    ["equalityValue", "meritStructure"],
  ];
  return pairs
    .filter(([a, b]) => Number.isFinite(profile.scores?.[a]) && Number.isFinite(profile.scores?.[b]))
    .map(([a, b]) => ({ a, b, intensity: Math.round((Math.abs(profile.scores[a] - 50) + Math.abs(profile.scores[b] - 50)) / 2) }))
    .sort((x, y) => y.intensity - x.intensity)
    .slice(0, limit);
}

export function bandForScore(score) {
  if (score >= 75) return "high";
  if (score >= 60) return "moderateHigh";
  if (score <= 25) return "low";
  if (score <= 40) return "moderateLow";
  return "balanced";
}

export function interpretDimension(dimensionId, score, lang = "en") {
  const dimension = DIMENSIONS[dimensionId];
  if (!dimension) return "";
  const label = localize(dimension.label, lang);
  const negative = localize(dimension.negativePole, lang);
  const positive = localize(dimension.positivePole, lang);
  const description = localize(dimension.description, lang);
  const band = bandForScore(score);

  const messages = {
    en: {
      high: `${label} currently leans clearly toward ${positive}. ${description}`,
      moderateHigh: `${label} tends toward ${positive}, while leaving room for context. ${description}`,
      balanced: `${label} sits near the middle. That can reflect balance, context dependence or unresolved priorities. ${description}`,
      moderateLow: `${label} tends toward ${negative}, while leaving room for context. ${description}`,
      low: `${label} currently leans clearly toward ${negative}. ${description}`,
    },
    hu: {
      high: `${label} jelenleg egyértelműen a(z) ${positive} pólus felé hajlik. ${description}`,
      moderateHigh: `${label} inkább a(z) ${positive} felé mutat, de teret hagy a helyzetnek. ${description}`,
      balanced: `${label} közel van a középhez. Ez egyensúlyt, helyzetfüggést vagy még nyitott prioritásokat is jelezhet. ${description}`,
      moderateLow: `${label} inkább a(z) ${negative} felé mutat, de teret hagy a helyzetnek. ${description}`,
      low: `${label} jelenleg egyértelműen a(z) ${negative} pólus felé hajlik. ${description}`,
    },
    de: {
      high: `${label} neigt derzeit deutlich zu ${positive}. ${description}`,
      moderateHigh: `${label} tendiert zu ${positive}, lässt aber Raum für den Kontext. ${description}`,
      balanced: `${label} liegt nahe der Mitte. Das kann Ausgleich, Kontextabhängigkeit oder offene Prioritäten bedeuten. ${description}`,
      moderateLow: `${label} tendiert zu ${negative}, lässt aber Raum für den Kontext. ${description}`,
      low: `${label} neigt derzeit deutlich zu ${negative}. ${description}`,
    },
  };
  return messages[lang]?.[band] ?? messages.en[band];
}

export function compareProfiles(a, b) {
  const overlap = Object.keys(a?.scores ?? {}).filter((id) => Number.isFinite(b?.scores?.[id]) && DIMENSIONS[id]);
  const rows = overlap.map((id) => {
    const scoreA = a.scores[id];
    const scoreB = b.scores[id];
    return {
      id,
      scoreA,
      scoreB,
      difference: Math.abs(scoreA - scoreB),
      midpoint: (scoreA + scoreB) / 2,
      confidence: Math.min(a.confidence?.[id] ?? 0.5, b.confidence?.[id] ?? 0.5),
    };
  });
  const strongCommon = rows.filter((row) => row.difference <= 12).sort((x, y) => x.difference - y.difference).slice(0, 4);
  const differences = [...rows].sort((x, y) => y.difference - x.difference).slice(0, 4);
  const confidence = rows.length ? rows.reduce((sum, row) => sum + row.confidence, 0) / rows.length : 0;
  return {
    rows,
    commonGround: strongCommon,
    differences,
    overlap: overlap.length,
    confidence: round(confidence * 100),
  };
}


export const RESEARCH_NOTICE_VERSION = "2026-07-28-v2";
export const MIN_COHORT_SIZE = 10;

export const GENDER_OPTIONS = [
  ["woman", "genderWoman"],
  ["man", "genderMan"],
  ["non-binary", "genderNonBinary"],
  ["self-described", "genderSelfDescribed"],
  ["prefer-not", "preferNot"],
];

export const SETTLEMENT_OPTIONS = [
  ["capital", "settlementCapital"],
  ["large-city", "settlementLargeCity"],
  ["city", "settlementCity"],
  ["town-village", "settlementTownVillage"],
  ["rural", "settlementRural"],
];

export const COHORT_DIMENSIONS = [
  ["age", "cohortAge"],
  ["country", "cohortCountry"],
  ["settlement", "cohortSettlement"],
  ["gender", "cohortGender"],
];

function randomToken() {
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  const base64 = btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return `mc-${base64}`;
}

export function createParticipantToken() {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("secure-random-unavailable");
  }
  return randomToken();
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    throw new Error(payload?.error || `research-api-${response.status}`);
  }
  return payload;
}

export function saveResearchConsent({ token, gender, settlementType, country, age, language }) {
  return apiRequest("/api/research/consent", {
    method: "POST",
    body: JSON.stringify({
      token,
      gender,
      settlementType,
      country,
      age: Number(age),
      language,
      explicitSpecialCategoryConsent: true,
    }),
  });
}

export function submitResearchProfile({ token, profile, completion, includeRaw = false }) {
  return apiRequest("/api/research/results", {
    method: "POST",
    body: JSON.stringify({
      token,
      scores: profile.scores,
      confidence: profile.confidence,
      questionnaireSummary: {
        questionnaireId: completion.questionnaireId,
        answered: completion.answered,
        total: completion.total,
        coverage: completion.coverage,
      },
      ...(includeRaw ? { rawAnswers: completion.rawAnswers } : {}),
    }),
  });
}

export function fetchResearchCohorts(dimension) {
  const safeDimension = COHORT_DIMENSIONS.some(([id]) => id === dimension) ? dimension : "age";
  return apiRequest(`/api/research/cohorts?dimension=${encodeURIComponent(safeDimension)}`, {
    method: "GET",
    headers: {},
  });
}

export function participationAction(token, action) {
  return apiRequest("/api/research/participation", {
    method: "POST",
    body: JSON.stringify({ token, action }),
  });
}

export function downloadResearchExport(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `mindcivilis-research-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

import { buildProfile } from "./scoring.js";

export const STORAGE_KEY = "mindcivilis:web:v1";
export const SCHEMA_VERSION = 2;
export const CONSENT_VERSION = "2026-07-28-v2";

export const initialState = {
  schemaVersion: SCHEMA_VERSION,
  language: "en",
  settings: {
    alias: "",
    ageBand: "",
    country: "",
    region: "",
  },
  drafts: {},
  history: [],
  importedProfiles: [],
  preferences: {
    scoringMode: "blind",
    includeMetadataInExport: false,
  },
  research: {
    mode: null,
    adult: false,
    scoreConsent: false,
    rawConsent: false,
    longitudinalConsent: false,
    pseudonymousId: "",
    participantToken: "",
    gender: "",
    settlementType: "",
    country: "",
    age: "",
    explicitSpecialCategoryConsent: false,
    serverConsentAt: "",
    lastSubmittedAt: "",
    decisionAt: "",
  },
};

function cloneInitial() {
  return JSON.parse(JSON.stringify(initialState));
}

export function loadState() {
  if (typeof window === "undefined") return cloneInitial();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneInitial();
    const parsed = JSON.parse(raw);
    if (parsed?.schemaVersion !== SCHEMA_VERSION) return migrateState(parsed);
    return {
      ...cloneInitial(),
      ...parsed,
      settings: { ...initialState.settings, ...(parsed.settings ?? {}) },
      preferences: { ...initialState.preferences, ...(parsed.preferences ?? {}) },
      research: { ...initialState.research, ...(parsed.research ?? {}) },
      drafts: parsed.drafts ?? {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      importedProfiles: Array.isArray(parsed.importedProfiles) ? parsed.importedProfiles : [],
    };
  } catch {
    return cloneInitial();
  }
}

function migrateState(previous) {
  return {
    ...cloneInitial(),
    language: ["en", "hu", "de"].includes(previous?.language) ? previous.language : "en",
    settings: { ...initialState.settings, ...(previous?.settings ?? {}) },
    history: Array.isArray(previous?.history) ? previous.history : [],
    drafts: previous?.drafts ?? {},
    importedProfiles: Array.isArray(previous?.importedProfiles) ? previous.importedProfiles : [],
    preferences: { ...initialState.preferences, ...(previous?.preferences ?? {}) },
  };
}

export function persistState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, schemaVersion: SCHEMA_VERSION }));
}

export function clearState() {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}

export function makeCurrentProfile(state) {
  const built = buildProfile(state.history);
  return {
    id: "current",
    alias: state.settings.alias || "My MindCivilis Atlas",
    createdAt: state.history.at(-1)?.completedAt ?? new Date().toISOString(),
    scores: built.scores,
    confidence: built.confidence,
    evidence: built.evidence,
  };
}

function compactHistory(history) {
  return history.map((entry) => ({
    questionnaireId: entry.questionnaireId,
    completedAt: entry.completedAt,
    answered: entry.answered,
    total: entry.total,
    coverage: entry.coverage,
    dimensions: Object.fromEntries(Object.entries(entry.dimensions ?? {}).map(([id, result]) => [id, {
      score: result.score,
      confidence: result.confidence,
      answered: result.answered,
      total: result.total,
    }])),
  }));
}

function compactLatestHistory(history) {
  const latestByQuestionnaire = new Map();
  history.forEach((entry) => latestByQuestionnaire.set(entry.questionnaireId, entry));
  return [...latestByQuestionnaire.values()].map((entry) => ({
    questionnaireId: entry.questionnaireId,
    answered: entry.answered,
    total: entry.total,
    coverage: entry.coverage,
    dimensions: Object.fromEntries(Object.entries(entry.dimensions ?? {}).map(([id, result]) => [id, {
      score: result.score,
      confidence: result.confidence,
      answered: result.answered,
      total: result.total,
    }])),
  }));
}

export function createProfileCapsule(state, { includeMetadata = false, includeRaw = false } = {}) {
  const profile = makeCurrentProfile(state);
  const capsule = {
    format: "mindcivilis-profile",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    profile: {
      id: crypto.randomUUID?.() ?? `profile-${Date.now()}`,
      alias: profile.alias,
      createdAt: profile.createdAt,
      scores: profile.scores,
      confidence: profile.confidence,
      evidence: profile.evidence,
    },
    questionnaireHistory: compactHistory(state.history),
    privacy: {
      localFirst: true,
      containsRawAnswers: Boolean(includeRaw),
      containsOptionalDemographics: Boolean(includeMetadata),
    },
  };
  if (includeMetadata) {
    capsule.profile.metadata = {
      ageBand: state.settings.ageBand || undefined,
      country: state.settings.country || undefined,
      region: state.settings.region || undefined,
    };
  }
  if (includeRaw) {
    capsule.rawAnswers = Object.fromEntries(state.history.map((entry, index) => [`${entry.questionnaireId}-${index + 1}`, entry.rawAnswers ?? {}]));
  }
  return capsule;
}

export function parseProfileCapsule(raw) {
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (parsed?.format !== "mindcivilis-profile" || !parsed?.profile || typeof parsed.profile.scores !== "object") {
    throw new Error("invalid-profile-capsule");
  }
  const scores = Object.fromEntries(Object.entries(parsed.profile.scores).filter(([, value]) => Number.isFinite(value) && value >= 0 && value <= 100));
  if (!Object.keys(scores).length) throw new Error("empty-profile-capsule");
  return {
    id: parsed.profile.id || `import-${Date.now()}`,
    alias: String(parsed.profile.alias || "Imported profile").slice(0, 80),
    createdAt: parsed.profile.createdAt || parsed.exportedAt || new Date().toISOString(),
    importedAt: new Date().toISOString(),
    scores,
    confidence: parsed.profile.confidence ?? {},
    metadata: parsed.profile.metadata,
  };
}

export function createResearchPackage(state) {
  if (state.research?.mode !== "research" || !state.research?.adult || !state.research?.scoreConsent) {
    throw new Error("research-consent-required");
  }
  const profile = makeCurrentProfile(state);
  const generatedId = globalThis.crypto?.randomUUID?.() ?? `research-${Date.now()}`;
  const pseudonymousId = state.research.longitudinalConsent
    ? state.research.pseudonymousId || generatedId
    : generatedId;
  return {
    format: "mindcivilis-research-contribution",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    transmission: "none-local-download-only",
    purpose: "Exploratory study of civic identity patterns and questionnaire development.",
    governanceStatus: "No automatic collection. Data controller, ethics process, retention, contact and withdrawal procedure must be defined before collection.",
    consentReceipt: {
      version: CONSENT_VERSION,
      recordedAt: state.research.decisionAt || new Date().toISOString(),
      adultConfirmed: Boolean(state.research.adult),
      scoreLevelConsent: Boolean(state.research.scoreConsent),
      rawResponseConsent: Boolean(state.research.rawConsent),
      longitudinalLinkingConsent: Boolean(state.research.longitudinalConsent),
      voluntary: true,
      automaticUpload: false,
    },
    contribution: {
      pseudonymousId,
      uiLanguage: state.language || "en",
      scores: profile.scores,
      confidence: profile.confidence,
      broadDemographics: {
        ageBand: state.settings.ageBand || undefined,
        country: state.settings.country || undefined,
        region: state.settings.region || undefined,
      },
      questionnaireHistory: state.research.longitudinalConsent
        ? compactHistory(state.history)
        : compactLatestHistory(state.history),
      longitudinalLinking: Boolean(state.research.longitudinalConsent),
      ...(state.research.rawConsent ? {
        rawAnswers: Object.fromEntries(state.history.map((entry, index) => [`${entry.questionnaireId}-${index + 1}`, entry.rawAnswers ?? {}])),
      } : {}),
    },
  };
}

export function downloadJson(data, filename) {
  if (typeof document === "undefined") return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

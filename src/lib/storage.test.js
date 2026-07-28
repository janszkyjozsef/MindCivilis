import { describe, expect, it } from "vitest";
import { createProfileCapsule, createResearchPackage, parseProfileCapsule } from "./storage.js";

const completion = {
  questionnaireId: "political-quick",
  completedAt: "2026-07-14T12:00:00.000Z",
  answered: 20,
  total: 20,
  coverage: 1,
  dimensions: {
    culturalPluralism: { score: 72, confidence: 1, answered: 5, total: 5 },
  },
  rawAnswers: { "pol-1": 2 },
};

const state = {
  language: "en",
  settings: { alias: "Atlas", ageBand: "25-34", country: "HU", region: "budapest" },
  history: [completion],
  importedProfiles: [{ id: "other-person", scores: { culturalPluralism: 12 } }],
  research: {
    mode: "research",
    adult: true,
    scoreConsent: true,
    rawConsent: false,
    longitudinalConsent: false,
    pseudonymousId: "",
    decisionAt: "2026-07-14T11:30:00.000Z",
  },
};

describe("profile capsules", () => {
  it("excludes raw answers and demographics by default", () => {
    const capsule = createProfileCapsule(state);
    expect(capsule.profile.scores.culturalPluralism).toBe(72);
    expect(capsule.profile).not.toHaveProperty("metadata");
    expect(capsule).not.toHaveProperty("rawAnswers");
    expect(parseProfileCapsule(JSON.stringify(capsule)).scores.culturalPluralism).toBe(72);
  });

  it("includes optional data only when explicitly requested", () => {
    const capsule = createProfileCapsule(state, { includeMetadata: true, includeRaw: true });
    expect(capsule.profile.metadata.ageBand).toBe("25-34");
    expect(capsule.rawAnswers["political-quick-1"]["pol-1"]).toBe(2);
  });
});

describe("research package", () => {
  it("records local-only transmission and omits raw answers without the second consent", () => {
    const pack = createResearchPackage(state);
    expect(pack.transmission).toBe("none-local-download-only");
    expect(pack.consentReceipt.recordedAt).toBe("2026-07-14T11:30:00.000Z");
    expect(pack.consentReceipt.scoreLevelConsent).toBe(true);
    expect(pack.contribution).not.toHaveProperty("rawAnswers");
    expect(JSON.stringify(pack)).not.toContain("other-person");
  });

  it("includes raw answers only after separate consent", () => {
    const pack = createResearchPackage({ ...state, research: { ...state.research, rawConsent: true } });
    expect(pack.contribution.rawAnswers["political-quick-1"]["pol-1"]).toBe(2);
  });

  it("fails closed when the required research choices are absent", () => {
    expect(() => createResearchPackage({
      ...state,
      research: { ...state.research, scoreConsent: false, rawConsent: true },
    })).toThrow("research-consent-required");
  });

  it("keeps R1 to the latest undated summary for each questionnaire", () => {
    const later = {
      ...completion,
      completedAt: "2026-07-15T12:00:00.000Z",
      dimensions: { culturalPluralism: { score: 81, confidence: 1, answered: 5, total: 5 } },
    };
    const pack = createResearchPackage({ ...state, history: [completion, later] });
    expect(pack.contribution.questionnaireHistory).toHaveLength(1);
    expect(pack.contribution.questionnaireHistory[0]).not.toHaveProperty("completedAt");
    expect(pack.contribution.questionnaireHistory[0].dimensions.culturalPluralism.score).toBe(81);
  });

  it("uses a stable local pseudonym only after longitudinal consent", () => {
    const later = { ...completion, completedAt: "2026-07-15T12:00:00.000Z" };
    const pack = createResearchPackage({
      ...state,
      history: [completion, later],
      research: { ...state.research, longitudinalConsent: true, pseudonymousId: "stable-study-id" },
    });
    expect(pack.consentReceipt.longitudinalLinkingConsent).toBe(true);
    expect(pack.contribution.pseudonymousId).toBe("stable-study-id");
    expect(pack.contribution.longitudinalLinking).toBe(true);
    expect(pack.contribution.questionnaireHistory).toHaveLength(2);
    expect(pack.contribution.questionnaireHistory[0].completedAt).toBe(completion.completedAt);
  });
});

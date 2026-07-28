import { describe, expect, it } from "vitest";
import { QUESTIONNAIRE_BY_ID, QUESTIONNAIRES, getDocumentedItemCount } from "../data/catalogue.js";
import { compareProfiles, scoreQuestionnaire } from "./scoring.js";

describe("questionnaire inventory", () => {
  it("contains every documented questionnaire and item count", () => {
    expect(QUESTIONNAIRES).toHaveLength(23);
    expect(getDocumentedItemCount()).toBe(497);
    expect(QUESTIONNAIRE_BY_ID["political-quick"].questions).toHaveLength(20);
    expect(QUESTIONNAIRE_BY_ID["political-standard"].questions).toHaveLength(40);
    expect(QUESTIONNAIRE_BY_ID["political-deep"].questions).toHaveLength(80);
    expect(QUESTIONNAIRE_BY_ID["personality-quick"].questions).toHaveLength(20);
    expect(QUESTIONNAIRE_BY_ID["personality-deep"].questions).toHaveLength(45);
    QUESTIONNAIRES.filter((test) => test.category === "exploratory").forEach((test) => expect(test.questions).toHaveLength(8));
  });

  it("keeps nested banks as stable subsets", () => {
    const quick = QUESTIONNAIRE_BY_ID["political-quick"].questions.map((question) => question.id);
    const standard = new Set(QUESTIONNAIRE_BY_ID["political-standard"].questions.map((question) => question.id));
    const deep = new Set(QUESTIONNAIRE_BY_ID["political-deep"].questions.map((question) => question.id));
    quick.forEach((id) => {
      expect(standard.has(id)).toBe(true);
      expect(deep.has(id)).toBe(true);
    });
  });

  it("ships every questionnaire and item in English, Hungarian and German", () => {
    QUESTIONNAIRES.forEach((test) => {
      ["en", "hu", "de"].forEach((lang) => {
        expect(test.title[lang]).toBeTruthy();
        expect(test.description[lang]).toBeTruthy();
      });
      test.questions.forEach((question) => {
        ["en", "hu", "de"].forEach((lang) => expect(question.text[lang]).toBeTruthy());
      });
    });
  });
});

describe("scoring", () => {
  it("applies explicit reverse direction and separates skipped answers", () => {
    const test = {
      id: "example",
      title: { en: "Example" },
      questions: [
        { id: "positive", dimensionId: "culturalPluralism", direction: 1 },
        { id: "reverse", dimensionId: "culturalPluralism", direction: -1 },
        { id: "skip", dimensionId: "culturalPluralism", direction: 1 },
      ],
    };
    const result = scoreQuestionnaire(test, { positive: 5, reverse: 1, skip: 0 });
    expect(result.dimensions.culturalPluralism.score).toBe(100);
    expect(result.dimensions.culturalPluralism.answered).toBe(2);
    expect(result.dimensions.culturalPluralism.total).toBe(3);
    expect(result.coverage).toBeCloseTo(2 / 3, 3);
  });
});

describe("profile comparison", () => {
  it("uses only overlapping dimensions and never invents compatibility", () => {
    const comparison = compareProfiles(
      { scores: { culturalPluralism: 70, socialEconomy: 40 }, confidence: { culturalPluralism: 1, socialEconomy: 1 } },
      { scores: { culturalPluralism: 65, openness: 90 }, confidence: { culturalPluralism: 0.8, openness: 1 } },
    );
    expect(comparison.overlap).toBe(1);
    expect(comparison.rows[0].id).toBe("culturalPluralism");
    expect(comparison.rows[0].difference).toBe(5);
    expect(comparison).not.toHaveProperty("compatibility");
  });
});

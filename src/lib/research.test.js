import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  COHORT_DIMENSIONS,
  createParticipantToken,
  fetchResearchCohorts,
  saveResearchConsent,
} from "./research.js";

describe("research client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates an opaque token without demographic content", () => {
    const token = createParticipantToken();
    expect(token).toMatch(/^mc-[A-Za-z0-9_-]{32}$/);
  });

  it("sends explicit consent and demographics to the dedicated endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    await saveResearchConsent({
      token: "mc-12345678901234567890123456789012",
      gender: "prefer-not",
      settlementType: "city",
      country: "HU",
      age: 38,
      language: "hu",
    });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/research/consent");
    expect(body.explicitSpecialCategoryConsent).toBe(true);
    expect(body).toMatchObject({ country: "HU", age: 38, settlementType: "city" });
  });

  it("falls back to age for an unknown cohort dimension", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ cohorts: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    await fetchResearchCohorts("postal-code");
    expect(fetchMock.mock.calls[0][0]).toBe("/api/research/cohorts?dimension=age");
    expect(COHORT_DIMENSIONS).toHaveLength(4);
  });
});

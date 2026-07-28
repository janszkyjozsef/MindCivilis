import { describe, expect, it } from "vitest";
import { MIN_COHORT_SIZE, ageBand, aggregateCohorts } from "./index.js";

describe("research worker privacy rules", () => {
  it("derives broad age bands from exact ages", () => {
    expect(ageBand(18)).toBe("18-24");
    expect(ageBand(34)).toBe("25-34");
    expect(ageBand(75)).toBe("75-plus");
  });

  it("suppresses cohorts below ten participants", () => {
    const rows = Array.from({ length: MIN_COHORT_SIZE - 1 }, () => ({
      age_band: "25-34",
      scores_json: JSON.stringify({ socialEconomy: 60 }),
    }));
    expect(aggregateCohorts(rows, "age")).toEqual([]);
  });

  it("returns only aggregate score averages once the threshold is met", () => {
    const rows = Array.from({ length: MIN_COHORT_SIZE }, (_, index) => ({
      country: "HU",
      scores_json: JSON.stringify({ socialEconomy: 50 + index }),
    }));
    expect(aggregateCohorts(rows, "country")).toEqual([
      { label: "HU", count: 10, scores: { socialEconomy: 55 } },
    ]);
  });
});

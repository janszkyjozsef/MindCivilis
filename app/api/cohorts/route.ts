import { env } from "cloudflare:workers";
import { MIN_COHORT_SIZE, jsonError } from "@/lib/research";

const DIMENSIONS = {
  age: "age_band",
  country: "country",
  settlement: "settlement_type",
  gender: "gender",
} as const;

export async function GET(request: Request) {
  try {
    const dimensionKey =
      new URL(request.url).searchParams.get("dimension") ?? "age";
    const column =
      DIMENSIONS[dimensionKey as keyof typeof DIMENSIONS] ?? DIMENSIONS.age;

    const result = await env.DB.prepare(
      `SELECT
        ${column} AS label,
        COUNT(*) AS count,
        ROUND(AVG(economic_score)) AS economic,
        ROUND(AVG(social_score)) AS social,
        ROUND(AVG(openness_score)) AS openness
       FROM research_participants
       WHERE completed_at IS NOT NULL
       GROUP BY ${column}
       HAVING COUNT(*) >= ?
       ORDER BY count DESC, label ASC
       LIMIT 30`,
    )
      .bind(MIN_COHORT_SIZE)
      .all();

    return Response.json(
      { dimension: dimensionKey, cohorts: result.results },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  } catch (error) {
    console.error("Cohort aggregation failed", error);
    return jsonError("A csoportátlagok most nem érhetők el.", 500);
  }
}

export const NOTICE_VERSION = "2026-07-28-v2";
export const MIN_COHORT_SIZE = 10;

const GENDERS = new Set(["woman", "man", "non-binary", "self-described", "prefer-not"]);
const SETTLEMENT_TYPES = new Set(["capital", "large-city", "city", "town-village", "rural"]);
const LANGUAGES = new Set(["en", "hu", "de"]);
const COHORT_COLUMNS = {
  age: "age_band",
  country: "country",
  settlement: "settlement_type",
  gender: "gender",
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(data, status = 200, extraHeaders = {}) {
  return withSecurityHeaders(Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  }));
}

function jsonError(message, status = 400) {
  return json({ error: message }, status);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new Error("invalid-json");
  }
}

function isValidToken(token) {
  return typeof token === "string" && /^mc-[A-Za-z0-9_-]{32}$/.test(token);
}

export function ageBand(age) {
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  if (age < 65) return "55-64";
  if (age < 75) return "65-74";
  return "75-plus";
}

async function hashToken(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cleanScoreMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value)
    .filter(([key, score]) => /^[A-Za-z][A-Za-z0-9]{1,48}$/.test(key) && Number.isFinite(score) && score >= 0 && score <= 100)
    .slice(0, 64)
    .map(([key, score]) => [key, Math.round(score * 100) / 100]);
  return entries.length ? Object.fromEntries(entries) : null;
}

function cleanSummary(value) {
  if (!value || typeof value !== "object") return null;
  const questionnaireId = typeof value.questionnaireId === "string"
    ? value.questionnaireId.slice(0, 80)
    : "";
  const answered = Number(value.answered);
  const total = Number(value.total);
  const coverage = Number(value.coverage);
  if (!questionnaireId || !Number.isFinite(answered) || !Number.isFinite(total) || !Number.isFinite(coverage)) return null;
  return {
    questionnaireId,
    answered: Math.max(0, Math.round(answered)),
    total: Math.max(0, Math.round(total)),
    coverage: Math.max(0, Math.min(1, coverage)),
  };
}

async function consent(request, env) {
  const payload = await readJson(request);
  if (!isValidToken(payload.token)) return jsonError("Invalid participation token.");
  if (!GENDERS.has(payload.gender)) return jsonError("Choose a valid gender option.");
  if (!SETTLEMENT_TYPES.has(payload.settlementType)) return jsonError("Choose a valid settlement type.");
  const country = typeof payload.country === "string" ? payload.country.trim().toUpperCase() : "";
  const age = Number(payload.age);
  const language = LANGUAGES.has(payload.language) ? payload.language : "en";
  if (!/^[A-Z]{2,8}$/.test(country)) return jsonError("Choose a valid country.");
  if (!Number.isInteger(age) || age < 18 || age > 110) return jsonError("Research participation is available from age 18 to 110.");
  if (payload.explicitSpecialCategoryConsent !== true) return jsonError("Explicit research consent is required.");

  const participantId = await hashToken(payload.token);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM declined_sessions WHERE participant_id = ?").bind(participantId),
    env.DB.prepare(
      `INSERT INTO research_participants
        (participant_id, gender, settlement_type, country, age, age_band, language, consent_version, consented_at, retention_review_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, '2028-07-28T00:00:00.000Z')
       ON CONFLICT(participant_id) DO UPDATE SET
        gender = excluded.gender,
        settlement_type = excluded.settlement_type,
        country = excluded.country,
        age = excluded.age,
        age_band = excluded.age_band,
        language = excluded.language,
        consent_version = excluded.consent_version,
        consented_at = CURRENT_TIMESTAMP,
        retention_review_at = excluded.retention_review_at`,
    ).bind(
      participantId,
      payload.gender,
      payload.settlementType,
      country,
      age,
      ageBand(age),
      language,
      NOTICE_VERSION,
    ),
  ]);
  return json({ ok: true, noticeVersion: NOTICE_VERSION });
}

async function results(request, env) {
  const payload = await readJson(request);
  if (!isValidToken(payload.token)) return jsonError("Invalid participation token.");
  const scores = cleanScoreMap(payload.scores);
  const confidence = cleanScoreMap(payload.confidence);
  const summary = cleanSummary(payload.questionnaireSummary);
  if (!scores || !summary) return jsonError("The research profile is incomplete.");

  const participantId = await hashToken(payload.token);
  const participant = await env.DB.prepare(
    "SELECT participant_id FROM research_participants WHERE participant_id = ?",
  ).bind(participantId).first();
  if (!participant) return jsonError("Research consent must be saved before a profile can be stored.", 403);

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO research_profiles
        (participant_id, scores_json, confidence_json, questionnaire_summary_json, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(participant_id) DO UPDATE SET
        scores_json = excluded.scores_json,
        confidence_json = excluded.confidence_json,
        questionnaire_summary_json = excluded.questionnaire_summary_json,
        updated_at = CURRENT_TIMESTAMP`,
    ).bind(participantId, JSON.stringify(scores), JSON.stringify(confidence ?? {}), JSON.stringify(summary)),
    env.DB.prepare(
      "UPDATE research_participants SET completed_at = CURRENT_TIMESTAMP WHERE participant_id = ?",
    ).bind(participantId),
  ]);
  return json({ ok: true, storedDimensions: Object.keys(scores).length });
}

export function aggregateCohorts(rows, dimension, minimum = MIN_COHORT_SIZE) {
  const column = COHORT_COLUMNS[dimension] ?? COHORT_COLUMNS.age;
  const groups = new Map();
  for (const row of rows) {
    const label = String(row[column] ?? "").trim();
    if (!label) continue;
    let scores;
    try {
      scores = JSON.parse(String(row.scores_json ?? "{}"));
    } catch {
      continue;
    }
    const current = groups.get(label) ?? { label, count: 0, sums: {}, scoreCounts: {} };
    current.count += 1;
    for (const [id, score] of Object.entries(scores)) {
      if (!Number.isFinite(score)) continue;
      current.sums[id] = (current.sums[id] ?? 0) + score;
      current.scoreCounts[id] = (current.scoreCounts[id] ?? 0) + 1;
    }
    groups.set(label, current);
  }
  return [...groups.values()]
    .filter((group) => group.count >= minimum)
    .map((group) => ({
      label: group.label,
      count: group.count,
      scores: Object.fromEntries(
        Object.keys(group.sums).map((id) => [id, Math.round(group.sums[id] / group.scoreCounts[id])]),
      ),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 30);
}

async function cohorts(request, env) {
  const dimension = new URL(request.url).searchParams.get("dimension") ?? "age";
  const safeDimension = COHORT_COLUMNS[dimension] ? dimension : "age";
  const result = await env.DB.prepare(
    `SELECT p.age_band, p.country, p.settlement_type, p.gender, r.scores_json
     FROM research_participants p
     INNER JOIN research_profiles r ON r.participant_id = p.participant_id
     WHERE p.completed_at IS NOT NULL
     ORDER BY r.updated_at DESC
     LIMIT 5000`,
  ).all();
  return json(
    {
      dimension: safeDimension,
      minimumCohortSize: MIN_COHORT_SIZE,
      cohorts: aggregateCohorts(result.results ?? [], safeDimension),
    },
    200,
    { "Cache-Control": "public, max-age=300" },
  );
}

async function participation(request, env) {
  const payload = await readJson(request);
  if (!isValidToken(payload.token)) return jsonError("Invalid participation token.");
  if (!["export", "delete"].includes(payload.action)) return jsonError("Unknown data action.");
  const participantId = await hashToken(payload.token);

  if (payload.action === "delete") {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM research_profiles WHERE participant_id = ?").bind(participantId),
      env.DB.prepare("DELETE FROM research_participants WHERE participant_id = ?").bind(participantId),
      env.DB.prepare("DELETE FROM declined_sessions WHERE participant_id = ?").bind(participantId),
    ]);
    return json({ ok: true });
  }

  const participant = await env.DB.prepare(
    `SELECT gender, settlement_type, country, age, age_band, language,
      consent_version, consented_at, completed_at, retention_review_at
     FROM research_participants WHERE participant_id = ?`,
  ).bind(participantId).first();
  const profile = await env.DB.prepare(
    `SELECT scores_json, confidence_json, questionnaire_summary_json, updated_at
     FROM research_profiles WHERE participant_id = ?`,
  ).bind(participantId).first();
  return json({
    exportedAt: new Date().toISOString(),
    participant,
    profile: profile ? {
      scores: JSON.parse(String(profile.scores_json ?? "{}")),
      confidence: JSON.parse(String(profile.confidence_json ?? "{}")),
      questionnaireSummary: JSON.parse(String(profile.questionnaire_summary_json ?? "{}")),
      updatedAt: profile.updated_at,
    } : null,
  });
}

async function decline(request, env) {
  const payload = await readJson(request);
  if (!isValidToken(payload.token)) return jsonError("Invalid participation token.");
  const participantId = await hashToken(payload.token);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM research_profiles WHERE participant_id = ?").bind(participantId),
    env.DB.prepare("DELETE FROM research_participants WHERE participant_id = ?").bind(participantId),
    env.DB.prepare(
      `INSERT INTO declined_sessions (participant_id, notice_version, declined_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(participant_id) DO UPDATE SET
        notice_version = excluded.notice_version,
        declined_at = CURRENT_TIMESTAMP`,
    ).bind(participantId, NOTICE_VERSION),
  ]);
  return json({ ok: true });
}

async function handleApi(request, env, pathname) {
  if (!env?.DB?.prepare) return jsonError("Research storage is unavailable.", 503);
  if (pathname === "/api/research/consent" && request.method === "POST") return consent(request, env);
  if (pathname === "/api/research/results" && request.method === "POST") return results(request, env);
  if (pathname === "/api/research/cohorts" && request.method === "GET") return cohorts(request, env);
  if (pathname === "/api/research/participation" && request.method === "POST") return participation(request, env);
  if (pathname === "/api/research/decline" && request.method === "POST") return decline(request, env);
  return jsonError("Research endpoint not found.", 404);
}

export default {
  async fetch(request, env) {
    try {
      const { pathname } = new URL(request.url);
      if (pathname.startsWith("/api/research/")) {
        return await handleApi(request, env, pathname);
      }
      if (!env?.ASSETS?.fetch) {
        return withSecurityHeaders(new Response("MindCivilis static assets are unavailable.", { status: 503 }));
      }
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404 || request.method !== "GET") return withSecurityHeaders(response);
      if (!request.headers.get("accept")?.includes("text/html")) return withSecurityHeaders(response);
      const fallbackUrl = new URL("/index.html", request.url);
      return withSecurityHeaders(await env.ASSETS.fetch(new Request(fallbackUrl, request)));
    } catch (error) {
      console.error("MindCivilis worker request failed", error);
      return jsonError("The request could not be completed.", 500);
    }
  },
};

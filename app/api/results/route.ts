import { env } from "cloudflare:workers";
import {
  calculateScores,
  hashParticipantToken,
  isValidParticipantToken,
  jsonError,
} from "@/lib/research";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      token?: unknown;
      answers?: unknown;
    };
    if (!isValidParticipantToken(payload.token)) {
      return jsonError("Érvénytelen részvételi azonosító.");
    }
    if (!Array.isArray(payload.answers)) {
      return jsonError("Hiányos kérdőív.");
    }

    const answers = payload.answers.map(Number);
    let scores;
    try {
      scores = calculateScores(answers);
    } catch (error) {
      return jsonError(
        error instanceof Error ? error.message : "Érvénytelen válaszok.",
      );
    }

    const participantId = await hashParticipantToken(payload.token);
    const participant = await env.DB.prepare(
      "SELECT participant_id FROM research_participants WHERE participant_id = ?",
    )
      .bind(participantId)
      .first();

    if (!participant) {
      return jsonError(
        "A kérdőív mentéséhez előbb kutatási hozzájárulás szükséges.",
        403,
      );
    }

    await env.DB.batch([
      env.DB.prepare(
        `UPDATE research_participants SET
          economic_score = ?,
          social_score = ?,
          openness_score = ?,
          completed_at = CURRENT_TIMESTAMP
         WHERE participant_id = ?`,
      ).bind(
        scores.economic,
        scores.social,
        scores.openness,
        participantId,
      ),
      env.DB.prepare(
        `INSERT INTO ideology_responses (participant_id, answers_json, created_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(participant_id) DO UPDATE SET
          answers_json = excluded.answers_json,
          created_at = CURRENT_TIMESTAMP`,
      ).bind(participantId, JSON.stringify(answers)),
    ]);

    return Response.json({ ok: true, scores });
  } catch (error) {
    console.error("Result storage failed", error);
    return jsonError(
      "Az eredményt most nem sikerült privát módon menteni. Kérjük, próbálja újra.",
      500,
    );
  }
}

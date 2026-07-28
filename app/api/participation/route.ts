import { env } from "cloudflare:workers";
import {
  hashParticipantToken,
  isValidParticipantToken,
  jsonError,
} from "@/lib/research";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      token?: unknown;
      action?: unknown;
    };
    if (!isValidParticipantToken(payload.token)) {
      return jsonError("Érvénytelen részvételi azonosító.");
    }
    if (payload.action !== "export" && payload.action !== "delete") {
      return jsonError("Ismeretlen adatvédelmi művelet.");
    }

    const participantId = await hashParticipantToken(payload.token);
    if (payload.action === "delete") {
      await env.DB.batch([
        env.DB.prepare(
          "DELETE FROM ideology_responses WHERE participant_id = ?",
        ).bind(participantId),
        env.DB.prepare(
          "DELETE FROM research_participants WHERE participant_id = ?",
        ).bind(participantId),
        env.DB.prepare(
          "DELETE FROM declined_sessions WHERE participant_id = ?",
        ).bind(participantId),
      ]);
      return Response.json({ ok: true });
    }

    const participant = await env.DB.prepare(
      `SELECT gender, settlement_type, country, age, age_band,
        economic_score, social_score, openness_score,
        consent_version, consented_at, completed_at
       FROM research_participants WHERE participant_id = ?`,
    )
      .bind(participantId)
      .first();
    const response = await env.DB.prepare(
      "SELECT answers_json, created_at FROM ideology_responses WHERE participant_id = ?",
    )
      .bind(participantId)
      .first();
    const decline = await env.DB.prepare(
      "SELECT notice_version, declined_at FROM declined_sessions WHERE participant_id = ?",
    )
      .bind(participantId)
      .first();

    return Response.json({
      exportedAt: new Date().toISOString(),
      participant,
      response: response
        ? { ...response, answers_json: JSON.parse(String(response.answers_json)) }
        : null,
      decline,
    });
  } catch (error) {
    console.error("Participation action failed", error);
    return jsonError("A kért adatvédelmi művelet most nem sikerült.", 500);
  }
}

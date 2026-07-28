import { env } from "cloudflare:workers";
import {
  NOTICE_VERSION,
  hashParticipantToken,
  isValidParticipantToken,
  jsonError,
} from "@/lib/research";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { token?: unknown };
    if (!isValidParticipantToken(payload.token)) {
      return jsonError("Érvénytelen részvételi azonosító.");
    }

    const participantId = await hashParticipantToken(payload.token);
    await env.DB.batch([
      env.DB.prepare(
        "DELETE FROM ideology_responses WHERE participant_id = ?",
      ).bind(participantId),
      env.DB.prepare(
        "DELETE FROM research_participants WHERE participant_id = ?",
      ).bind(participantId),
      env.DB.prepare(
        `INSERT INTO declined_sessions (participant_id, notice_version, declined_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(participant_id) DO UPDATE SET
          notice_version = excluded.notice_version,
          declined_at = CURRENT_TIMESTAMP`,
      ).bind(participantId, NOTICE_VERSION),
    ]);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Decline storage failed", error);
    return jsonError(
      "A döntést most nem sikerült biztonságosan rögzíteni. Kérjük, próbálja újra.",
      500,
    );
  }
}

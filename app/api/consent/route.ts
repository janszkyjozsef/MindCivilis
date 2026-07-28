import { env } from "cloudflare:workers";
import {
  GENDERS,
  NOTICE_VERSION,
  SETTLEMENT_TYPES,
  ageBand,
  hashParticipantToken,
  isValidParticipantToken,
  jsonError,
} from "@/lib/research";

type ConsentPayload = {
  token?: unknown;
  gender?: unknown;
  settlementType?: unknown;
  country?: unknown;
  age?: unknown;
  explicitSpecialCategoryConsent?: unknown;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ConsentPayload;
    if (!isValidParticipantToken(payload.token)) {
      return jsonError("Érvénytelen részvételi azonosító.");
    }
    if (
      typeof payload.gender !== "string" ||
      !GENDERS.includes(payload.gender as (typeof GENDERS)[number])
    ) {
      return jsonError("Kérjük, válasszon a nemre vonatkozó lehetőségek közül.");
    }
    if (
      typeof payload.settlementType !== "string" ||
      !SETTLEMENT_TYPES.includes(
        payload.settlementType as (typeof SETTLEMENT_TYPES)[number],
      )
    ) {
      return jsonError("Kérjük, válasszon településtípust.");
    }

    const country =
      typeof payload.country === "string" ? payload.country.trim() : "";
    const age = Number(payload.age);
    if (country.length < 2 || country.length > 80) {
      return jsonError("Kérjük, adjon meg egy országot.");
    }
    if (!Number.isInteger(age) || age < 18 || age > 110) {
      return jsonError("A kutatásban 18 és 110 év közötti személyek vehetnek részt.");
    }
    if (payload.explicitSpecialCategoryConsent !== true) {
      return jsonError(
        "A kutatási részvételhez külön, kifejezett hozzájárulás szükséges.",
      );
    }

    const participantId = await hashParticipantToken(payload.token);
    await env.DB.batch([
      env.DB.prepare(
        "DELETE FROM declined_sessions WHERE participant_id = ?",
      ).bind(participantId),
      env.DB.prepare(
        `INSERT INTO research_participants
          (participant_id, gender, settlement_type, country, age, age_band, consent_version, consented_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(participant_id) DO UPDATE SET
          gender = excluded.gender,
          settlement_type = excluded.settlement_type,
          country = excluded.country,
          age = excluded.age,
          age_band = excluded.age_band,
          consent_version = excluded.consent_version,
          consented_at = CURRENT_TIMESTAMP`,
      ).bind(
        participantId,
        payload.gender,
        payload.settlementType,
        country,
        age,
        ageBand(age),
        NOTICE_VERSION,
      ),
    ]);

    return Response.json({ ok: true, noticeVersion: NOTICE_VERSION });
  } catch (error) {
    console.error("Consent storage failed", error);
    return jsonError(
      "A hozzájárulást most nem sikerült biztonságosan rögzíteni. Kérjük, próbálja újra.",
      500,
    );
  }
}

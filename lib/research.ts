export const NOTICE_VERSION = "2026-07-28-v1";
export const MIN_COHORT_SIZE = 10;

export const GENDERS = [
  "Nő",
  "Férfi",
  "Nem-bináris",
  "Más önmeghatározás",
  "Nem kívánom megadni",
] as const;

export const SETTLEMENT_TYPES = [
  "Főváros",
  "Nagyváros (100 000+ fő)",
  "Város",
  "Község vagy falu",
  "Külterület vagy tanya",
] as const;

export type Axis = "economic" | "social" | "openness";

export type Question = {
  id: string;
  axis: Axis;
  direction: 1 | -1;
  text: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "e1",
    axis: "economic",
    direction: 1,
    text: "Az embereknek nagyobb szabadságot kellene kapniuk abban, hogyan használják a jövedelmüket.",
  },
  {
    id: "e2",
    axis: "economic",
    direction: -1,
    text: "Az államnak erősebben kellene csökkentenie a társadalmi különbségeket.",
  },
  {
    id: "e3",
    axis: "economic",
    direction: 1,
    text: "A piaci verseny általában jobb megoldásokat hoz, mint a központi szabályozás.",
  },
  {
    id: "e4",
    axis: "economic",
    direction: -1,
    text: "A közszolgáltatások egyenlő hozzáférése fontosabb az alacsonyabb adóknál.",
  },
  {
    id: "s1",
    axis: "social",
    direction: -1,
    text: "A felnőttek magánéleti döntéseibe a közösségnek csak kivételesen szabad beleszólnia.",
  },
  {
    id: "s2",
    axis: "social",
    direction: 1,
    text: "A közös normák fenntartása néha indokolhatja az egyéni választások korlátozását.",
  },
  {
    id: "s3",
    axis: "social",
    direction: -1,
    text: "A jogok védelmének a többségi véleménnyel szemben is elsőbbséget kell élveznie.",
  },
  {
    id: "s4",
    axis: "social",
    direction: 1,
    text: "A társadalmi rendhez erős, következetes intézményekre van szükség.",
  },
  {
    id: "o1",
    axis: "openness",
    direction: -1,
    text: "A nemzetközi együttműködés sok problémát hatékonyabban old meg, mint az országok külön-külön.",
  },
  {
    id: "o2",
    axis: "openness",
    direction: 1,
    text: "Egy ország hosszú távú érdekeit gyakran a nemzeti önállóság szolgálja a legjobban.",
  },
  {
    id: "o3",
    axis: "openness",
    direction: -1,
    text: "A kulturális sokféleség többnyire erőforrás egy társadalom számára.",
  },
  {
    id: "o4",
    axis: "openness",
    direction: 1,
    text: "A gyors társadalmi változásokkal szemben érdemes a bevált hagyományokat védeni.",
  },
];

export type Scores = {
  economic: number;
  social: number;
  openness: number;
};

export function calculateScores(answers: number[]): Scores {
  if (
    answers.length !== QUESTIONS.length ||
    answers.some((answer) => !Number.isInteger(answer) || answer < 1 || answer > 5)
  ) {
    throw new Error("Minden kérdéshez 1 és 5 közötti egész válasz szükséges.");
  }

  const sums: Scores = { economic: 0, social: 0, openness: 0 };
  const counts: Scores = { economic: 0, social: 0, openness: 0 };

  QUESTIONS.forEach((question, index) => {
    sums[question.axis] += (answers[index] - 3) * 50 * question.direction;
    counts[question.axis] += 1;
  });

  return {
    economic: Math.round(sums.economic / counts.economic),
    social: Math.round(sums.social / counts.social),
    openness: Math.round(sums.openness / counts.openness),
  };
}

export function ageBand(age: number) {
  if (age < 25) return "18–24 évesek";
  if (age < 35) return "25–34 évesek";
  if (age < 45) return "35–44 évesek";
  if (age < 55) return "45–54 évesek";
  if (age < 65) return "55–64 évesek";
  return "65 évesek és idősebbek";
}

export function isValidParticipantToken(token: unknown): token is string {
  return typeof token === "string" && /^[a-zA-Z0-9-]{20,80}$/.test(token);
}

export async function hashParticipantToken(token: string) {
  const encoded = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const researchParticipants = sqliteTable("research_participants", {
  participantId: text("participant_id").primaryKey(),
  gender: text("gender").notNull(),
  settlementType: text("settlement_type").notNull(),
  country: text("country").notNull(),
  age: integer("age").notNull(),
  ageBand: text("age_band").notNull(),
  economicScore: integer("economic_score"),
  socialScore: integer("social_score"),
  opennessScore: integer("openness_score"),
  consentVersion: text("consent_version").notNull(),
  consentedAt: text("consented_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
});

export const ideologyResponses = sqliteTable("ideology_responses", {
  participantId: text("participant_id").primaryKey(),
  answersJson: text("answers_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const declinedSessions = sqliteTable("declined_sessions", {
  participantId: text("participant_id").primaryKey(),
  noticeVersion: text("notice_version").notNull(),
  declinedAt: text("declined_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

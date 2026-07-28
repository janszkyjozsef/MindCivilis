CREATE TABLE `declined_sessions` (
  `participant_id` text PRIMARY KEY NOT NULL,
  `notice_version` text NOT NULL,
  `declined_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `research_participants` (
  `participant_id` text PRIMARY KEY NOT NULL,
  `gender` text NOT NULL,
  `settlement_type` text NOT NULL,
  `country` text NOT NULL,
  `age` integer NOT NULL,
  `age_band` text NOT NULL,
  `language` text NOT NULL,
  `consent_version` text NOT NULL,
  `consented_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `completed_at` text,
  `retention_review_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `research_profiles` (
  `participant_id` text PRIMARY KEY NOT NULL,
  `scores_json` text NOT NULL,
  `confidence_json` text NOT NULL,
  `questionnaire_summary_json` text NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`participant_id`) REFERENCES `research_participants`(`participant_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `research_participants_completed_idx`
  ON `research_participants` (`completed_at`, `age_band`, `country`, `settlement_type`, `gender`);

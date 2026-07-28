CREATE TABLE `declined_sessions` (
	`participant_id` text PRIMARY KEY NOT NULL,
	`notice_version` text NOT NULL,
	`declined_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ideology_responses` (
	`participant_id` text PRIMARY KEY NOT NULL,
	`answers_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `research_participants` (
	`participant_id` text PRIMARY KEY NOT NULL,
	`gender` text NOT NULL,
	`settlement_type` text NOT NULL,
	`country` text NOT NULL,
	`age` integer NOT NULL,
	`age_band` text NOT NULL,
	`economic_score` integer,
	`social_score` integer,
	`openness_score` integer,
	`consent_version` text NOT NULL,
	`consented_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text
);

CREATE TABLE `offline_flashcards` (
	`id` text PRIMARY KEY NOT NULL,
	`notebook_id` text NOT NULL,
	`front` text NOT NULL,
	`back` text NOT NULL,
	`interval` integer DEFAULT 0 NOT NULL,
	`ease` real DEFAULT 2.5 NOT NULL,
	`due_date` integer,
	`repetitions` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offline_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`notebook_id` text NOT NULL,
	`role` text NOT NULL,
	`text` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offline_notebooks` (
	`notebook_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`cached_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offline_podcasts` (
	`notebook_id` text PRIMARY KEY NOT NULL,
	`local_uri` text NOT NULL,
	`cached_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offline_quizzes` (
	`id` text PRIMARY KEY NOT NULL,
	`notebook_id` text NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correct_answer` text NOT NULL,
	`explanation` text
);
--> statement-breakpoint
CREATE TABLE `offline_roadmap` (
	`notebook_id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`cached_at` integer NOT NULL
);

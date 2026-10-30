CREATE TABLE `donation_events` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text,
	`collection_window_en` text,
	`collection_window_vi` text,
	`destination_en` text,
	`destination_vi` text,
	`status` text NOT NULL,
	`kg_collected` integer,
	`pieces_delivered` integer,
	`kg_recycled` integer,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `donation_signups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`role` text NOT NULL,
	`amount` text,
	`note` text,
	`consent_privacy` integer NOT NULL,
	`consent_recycle` integer NOT NULL,
	`locale` text NOT NULL,
	`event_id` text,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`ip_hash` text
);

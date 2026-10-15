CREATE TABLE `login_attempt` (
	`identifier` text PRIMARY KEY NOT NULL,
	`failures` integer DEFAULT 0 NOT NULL,
	`since` integer NOT NULL,
	`sends` integer DEFAULT 0 NOT NULL,
	`sends_since` integer NOT NULL,
	`day_failures` integer DEFAULT 0 NOT NULL,
	`day_since` integer NOT NULL
);

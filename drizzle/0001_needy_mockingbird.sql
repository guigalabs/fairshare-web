CREATE TABLE `login_attempt` (
	`identifier` text PRIMARY KEY NOT NULL,
	`failures` integer NOT NULL,
	`since` integer NOT NULL
);

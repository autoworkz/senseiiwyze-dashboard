import { pgTable, text, uuid, varchar, jsonb, timestamp, uniqueIndex, foreignKey, smallint, boolean, bigint, integer, unique, json, doublePrecision, index, serial, pgPolicy, check, numeric, inet, primaryKey, pgView, pgSequence, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accountRole = pgEnum("account_role", ['owner', 'member', 'super-owner'])
export const appPermissions = pgEnum("app_permissions", ['roles.manage', 'billing.manage', 'settings.manage', 'members.manage', 'invites.manage', 'tasks.write', 'tasks.delete'])
export const billingProvider = pgEnum("billing_provider", ['stripe', 'lemon-squeezy', 'paddle'])
export const billingProviders = pgEnum("billing_providers", ['stripe'])
export const chatRole = pgEnum("chat_role", ['user', 'assistant'])
export const difficulty = pgEnum("difficulty", ['easy', 'medium', 'hard'])
export const invitationStatus = pgEnum("invitation_status", ['pending', 'accepted', 'expired', 'deleted'])
export const invitationType = pgEnum("invitation_type", ['one-time', '24-hour'])
export const notificationChannel = pgEnum("notification_channel", ['in_app', 'email'])
export const notificationType = pgEnum("notification_type", ['info', 'warning', 'error'])
export const paymentStatus = pgEnum("payment_status", ['pending', 'succeeded', 'failed'])
export const pricingPlanInterval = pgEnum("pricing_plan_interval", ['day', 'week', 'month', 'year'])
export const pricingType = pgEnum("pricing_type", ['one_time', 'recurring'])
export const roleStatus = pgEnum("role_status", ['admin', 'user'])
export const subscriptionItemType = pgEnum("subscription_item_type", ['flat', 'per_seat', 'metered'])
export const subscriptionStatus = pgEnum("subscription_status", ['active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused'])
export const taskstate = pgEnum("taskstate", ['UNTOUCHED', 'ONGOING', 'COMPLETED'])
export const tasktype = pgEnum("tasktype", ['GAME', 'QUIZ', 'FLASHCARD'])

export const answersIdSeq1 = pgSequence("answers_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const userEmloyementStatus = pgTable("user_emloyement_status", {
	employmentStatus: text("employment_status"),
});

export const workplaceType = pgTable("workplace_type", {
	type: text(),
});

export const userEmloyementStatuss = pgTable("user_emloyement_statuss", {
	employmentStatus: text("employment_status"),
});

export const assessments = pgTable("assessments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	type: varchar({ length: 255 }).default('rating').notNull(),
	strategy: jsonb().default({}),
	resultsSchema: jsonb("results_schema").default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	title: text().notNull(),
	description: text().notNull(),
	coverUrl: text("cover_url"),
	estimatedTime: text("estimated_time"),
	metadata: jsonb().default({}).notNull(),
});

export const profiles = pgTable("profiles", {
	email: text().notNull(),
	name: text(),
	workplace: text(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).defaultNow(),
	fdbRef: uuid("fdb_ref"),
	id: uuid().defaultRandom().primaryKey().notNull(),
	topPos: smallint(),
	bottomPos: smallint(),
	leftPos: smallint(),
	rightPos: smallint(),
	profilePhoto: text("profile_photo"),
	userRole: roleStatus("user_role").default('user').notNull(),
	workplaceRef: uuid("workplace_ref"),
	institutionRef: uuid("institution_ref"),
	employmentStatus: text("employment_status"),
	isDeleted: boolean("is_deleted").default(false),
}, (table) => [
	uniqueIndex("profiles_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.institutionRef],
			foreignColumns: [workplaces.id],
			name: "profiles_institution_ref_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.workplaceRef],
			foreignColumns: [workplaces.id],
			name: "profiles_workplace_ref_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const activities = pgTable("activities", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }),
	subcategory: varchar({ length: 255 }),
	description: text(),
	imageUrl: varchar("image_url", { length: 255 }),
	thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
	enabled: boolean().notNull(),
	metaData: jsonb("meta_data"),
	featured: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "activities_category_id_fkey"
		}).onDelete("set null"),
]);

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const answers = pgTable("answers", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "answers_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	answeredAt: timestamp("answered_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	rating: integer().notNull(),
	questionId: integer("question_id").notNull(),
	userId: uuid("user_id").notNull(),
	assessmentId: uuid("assessment_id"),
	response: jsonb().default({}),
	evaluationId: uuid("evaluation_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.assessmentId],
			foreignColumns: [assessments.id],
			name: "answers_assessment_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.evaluationId],
			foreignColumns: [evaluations.id],
			name: "answers_evaluation_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.questionId],
			foreignColumns: [questions.id],
			name: "answers_question_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "answers_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("answers_id_key").on(table.id),
	unique("idx_unique_answers_for_eval").on(table.questionId, table.evaluationId),
]);

export const categories = pgTable("categories", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "categories_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: varchar(),
});

export const constants = pgTable("constants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	key: text().notNull(),
	value: json(),
});

export const gameInfo = pgTable("game_info", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	levelsCompleted: boolean("levels_completed").array(),
	onboardingCompleted: boolean("onboarding_completed"),
	gameId: text("game_id").notNull(),
	profileId: uuid("profile_id").notNull(),
	durations: integer().array(),
}, (table) => [
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "game_info_profile_id_fkey"
		}).onDelete("cascade"),
]);

export const goals = pgTable("goals", {
	id: text().default(gen_random_uuid()).primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	url: text().notNull(),
	visionId: text("vision_id").notNull(),
	topPos: doublePrecision("top_pos"),
	bottomPos: doublePrecision("bottom_pos"),
	leftPos: doublePrecision("left_pos"),
	rightPos: doublePrecision("right_pos"),
	sizeId: text("size_id"),
	createdAt: timestamp({ precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).defaultNow().notNull(),
	clusterClass: text("cluster_class"),
}, (table) => [
	foreignKey({
			columns: [table.sizeId],
			foreignColumns: [sizes.id],
			name: "goals_size_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.visionId],
			foreignColumns: [visionBoards.id],
			name: "goals_vision_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const imageSearch = pgTable("image_search", {
	id: text().primaryKey().notNull(),
	searchTerm: text("search_term").notNull(),
	url: text().notNull(),
});

export const obstacles = pgTable("obstacles", {
	id: text().default(gen_random_uuid()).primaryKey().notNull(),
	name: text(),
	visionId: text("vision_id"),
	goalId: text("goal_id"),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow(),
	isCompleted: boolean("is_completed").default(false),
});

export const profilesCopy = pgTable("profiles_copy", {
	email: text().notNull(),
	name: text(),
	workplace: text(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).defaultNow(),
	fdbRef: uuid("fdb_ref"),
	id: uuid().defaultRandom().primaryKey().notNull(),
	topPos: smallint(),
	bottomPos: smallint(),
	leftPos: smallint(),
	rightPos: smallint(),
	profilePhoto: text("profile_photo"),
	userRole: roleStatus("user_role").default('user').notNull(),
	workplaceRef: uuid("workplace_ref"),
	institutionRef: uuid("institution_ref"),
	employmentStatus: text("employment_status"),
}, (table) => [
	uniqueIndex("profiles_copy_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_copy_id_fkey"
		}),
	foreignKey({
			columns: [table.institutionRef],
			foreignColumns: [workplaces.id],
			name: "profiles_copy_institution_ref_fkey"
		}),
	foreignKey({
			columns: [table.workplaceRef],
			foreignColumns: [workplaces.id],
			name: "profiles_copy_workplace_ref_fkey"
		}),
]);

export const evaluations = pgTable("evaluations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	assessmentId: uuid("assessment_id"),
	results: jsonb().default({}),
	isCompleted: boolean("is_completed").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	workplaceId: uuid("workplace_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.assessmentId],
			foreignColumns: [assessments.id],
			name: "evaluations_assessment_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "evaluations_user_id_fkey1"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.workplaceId],
			foreignColumns: [workplaces.id],
			name: "evaluations_workplace_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const lcaInvitations = pgTable("lca_invitations", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	accountRole: accountRole("account_role").notNull(),
	accountId: uuid("account_id").notNull(),
	token: text().default(generate_token(30)).notNull(),
	invitedByUserId: uuid("invited_by_user_id").notNull(),
	accountTeamName: text("account_team_name"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	invitationType: invitationType("invitation_type").notNull(),
	inviteeEmail: text("invitee_email").notNull(),
	message: text(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [workplaces.id],
			name: "invitations_account_id_fkey"
		}),
	foreignKey({
			columns: [table.invitedByUserId],
			foreignColumns: [profiles.id],
			name: "invitations_invited_by_user_id_fkey"
		}),
	unique("invitations_token_key").on(table.token),
]);

export const activityProgress = pgTable("activity_progress", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	profileId: uuid("profile_id").notNull(),
	activityId: uuid("activity_id").notNull(),
	score: integer(),
	totalScore: integer("total_score"),
	onboardingCompleted: boolean("onboarding_completed"),
	currentTaskOrder: integer("current_task_order").default(1).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_progress_activity_id_fkey"
		}),
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "activity_progress_profile_id_fkey"
		}),
	unique("activity_progress_id_key").on(table.id),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_key").on(table.email),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	activeOrganizationId: text("active_organization_id"),
}, (table) => [
	index("session_token_idx").using("btree", table.token.asc().nullsLast().op("text_ops")),
	index("session_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_fkey"
		}).onDelete("cascade"),
	unique("session_token_key").on(table.token),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("account_provider_id_account_id_idx").using("btree", table.providerId.asc().nullsLast().op("text_ops"), table.accountId.asc().nullsLast().op("text_ops")),
	index("account_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_fkey"
		}).onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("verification_identifier_value_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops"), table.value.asc().nullsLast().op("text_ops")),
]);

export const questions = pgTable("questions", {
	id: serial().primaryKey().notNull(),
	question: text().notNull(),
	category: text().notNull(),
	featLabel: text("feat_label").notNull(),
	assessmentId: uuid("assessment_id"),
	metadata: jsonb().default({}),
}, (table) => [
	uniqueIndex("questions_feat_label_key").using("btree", table.featLabel.asc().nullsLast().op("text_ops")),
	uniqueIndex("questions_question_key").using("btree", table.question.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.assessmentId],
			foreignColumns: [assessments.id],
			name: "fk_questions_assessment"
		}),
]);

export const scores = pgTable("scores", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	score: doublePrecision(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).defaultNow(),
});

export const gameTasks = pgTable("game_tasks", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	activityId: uuid("activity_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	maxScore: integer("max_score").default(1).notNull(),
	order: integer(),
	difficultyLevel: difficulty("difficulty_level"),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "tasks_activity_id_fkey"
		}),
]);

export const sizes = pgTable("sizes", {
	id: text().default(gen_random_uuid()).primaryKey().notNull(),
	height: doublePrecision().default(200).notNull(),
	width: doublePrecision().default(200).notNull(),
});

export const status = pgTable("status", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	state: taskstate().default('UNTOUCHED'),
	locked: boolean().default(true),
	progress: integer().default(0),
	complete: boolean().default(false),
	startedAt: timestamp("started_at", { precision: 3, mode: 'string' }).defaultNow(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
});

export const taskCompletion = pgTable("task_completion", {
	profileId: uuid("profile_id").notNull(),
	taskId: uuid("task_id").notNull(),
	completionTimestamp: timestamp("completion_timestamp", { withTimezone: true, mode: 'string' }).defaultNow(),
	score: integer(),
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "task_completion_profile_id_fkey"
		}),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [gameTasks.id],
			name: "task_completion_task_id_fkey"
		}),
	unique("task_completion_id_key").on(table.id),
]);

export const userTasks = pgTable("user_tasks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	taskId: uuid("task_id"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	statusId: uuid("status_id"),
	scoreId: uuid("score_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "user_tasks_profile_id_fkey"
		}),
	foreignKey({
			columns: [table.scoreId],
			foreignColumns: [scores.id],
			name: "user_tasks_score_id_fkey"
		}),
	foreignKey({
			columns: [table.statusId],
			foreignColumns: [status.id],
			name: "user_tasks_status_id_fkey"
		}),
	unique("user_tasks_user_id_task_id_key").on(table.userId, table.taskId),
]);

export const vendorRatings = pgTable("vendor_ratings", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "vendor_ratings_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	rating: doublePrecision().default(sql`'0'`),
});

export const visionBoards = pgTable("vision_boards", {
	id: text().default(gen_random_uuid()).primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	imgUrl: text("img_url"),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).defaultNow(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "vision_boards_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const visionLog = pgTable("vision_log", {
	id: text().primaryKey().notNull(),
	visionId: text("vision_id").notNull(),
	deviceId: text("device_id").notNull(),
	editedAt: timestamp("edited_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.visionId],
			foreignColumns: [visionBoards.id],
			name: "vision_log_vision_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workplaces = pgTable("workplaces", {
	workplaceLogo: text("workplace_logo"),
	workplaceAddress: jsonb("workplace_address"),
	workplaceDescription: text("workplace_description"),
	workplaceDomain: text("workplace_domain"),
	workplaceEmail: varchar("workplace_email", { length: 255 }),
	workplaceName: text("workplace_name"),
	id: uuid().defaultRandom().primaryKey().notNull(),
	type: text(),
	enabledAssessments: uuid("enabled_assessments").array().default(["3ac68f05-2ea9-4223-b139-d88373859379"]).notNull(),
}, (table) => [
	unique("workplaces_workplace_domain_key").on(table.workplaceDomain),
	unique("workplaces_workplace_email_key").on(table.workplaceEmail),
]);

export const config = pgTable("config", {
	enableTeamAccounts: boolean("enable_team_accounts").default(true).notNull(),
	enableAccountBilling: boolean("enable_account_billing").default(true).notNull(),
	enableTeamAccountBilling: boolean("enable_team_account_billing").default(true).notNull(),
	billingProvider: billingProvider("billing_provider").default('stripe').notNull(),
}, (table) => [
	pgPolicy("public config can be read by authenticated users", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
]);

export const accounts = pgTable("accounts", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	primaryOwnerUserId: uuid("primary_owner_user_id").default(sql`auth.uid()`).notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: text(),
	email: varchar({ length: 320 }),
	isPersonalAccount: boolean("is_personal_account").default(false).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	createdBy: uuid("created_by"),
	updatedBy: uuid("updated_by"),
	pictureUrl: varchar("picture_url", { length: 1000 }),
	publicData: jsonb("public_data").default({}).notNull(),
}, (table) => [
	index("ix_accounts_is_personal_account").using("btree", table.isPersonalAccount.asc().nullsLast().op("bool_ops")),
	index("ix_accounts_primary_owner_user_id").using("btree", table.primaryOwnerUserId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("unique_personal_account").using("btree", table.primaryOwnerUserId.asc().nullsLast().op("uuid_ops")).where(sql`(is_personal_account = true)`),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "accounts_created_by_fkey"
		}),
	foreignKey({
			columns: [table.primaryOwnerUserId],
			foreignColumns: [users.id],
			name: "accounts_primary_owner_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "accounts_updated_by_fkey"
		}),
	unique("accounts_slug_key").on(table.slug),
	unique("accounts_email_key").on(table.email),
	pgPolicy("delete_team_account", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(auth.uid() = primary_owner_user_id)` }),
	pgPolicy("restrict_mfa_accounts", { as: "restrictive", for: "all", to: ["authenticated"] }),
	pgPolicy("super_admins_access_accounts", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("accounts_self_update", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("accounts_read", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("create_org_account", { as: "permissive", for: "insert", to: ["authenticated"] }),
	check("accounts_slug_null_if_personal_account_true", sql`((is_personal_account = true) AND (slug IS NULL)) OR ((is_personal_account = false) AND (slug IS NOT NULL))`),
]);

export const roles = pgTable("roles", {
	name: varchar({ length: 50 }).primaryKey().notNull(),
	hierarchyLevel: integer("hierarchy_level").notNull(),
}, (table) => [
	unique("roles_hierarchy_level_key").on(table.hierarchyLevel),
	pgPolicy("roles_read", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	check("roles_hierarchy_level_check", sql`hierarchy_level > 0`),
]);

export const rolePermissions = pgTable("role_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "role_permissions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	role: varchar({ length: 50 }).notNull(),
	permission: appPermissions().notNull(),
}, (table) => [
	index("ix_role_permissions_role").using("btree", table.role.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.role],
			foreignColumns: [roles.name],
			name: "role_permissions_role_fkey"
		}),
	unique("role_permissions_role_permission_key").on(table.role, table.permission),
	pgPolicy("role_permissions_read", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("restrict_mfa_role_permissions", { as: "restrictive", for: "all", to: ["authenticated"] }),
	pgPolicy("super_admins_access_role_permissions", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const invitations = pgTable("invitations", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	accountId: uuid("account_id").notNull(),
	invitedBy: uuid("invited_by").notNull(),
	role: varchar({ length: 50 }).notNull(),
	inviteToken: varchar("invite_token", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`(CURRENT_TIMESTAMP + '7 days'::interval)`).notNull(),
}, (table) => [
	index("ix_invitations_account_id").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "invitations_account_id_fkey1"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.invitedBy],
			foreignColumns: [users.id],
			name: "invitations_invited_by_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.role],
			foreignColumns: [roles.name],
			name: "invitations_role_fkey"
		}),
	unique("invitations_email_account_id_key").on(table.email, table.accountId),
	unique("invitations_invite_token_key").on(table.inviteToken),
	pgPolicy("invitations_read_self", { as: "permissive", for: "select", to: ["authenticated"], using: sql`has_role_on_account(account_id)` }),
	pgPolicy("invitations_create_self", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("restrict_mfa_invitations", { as: "restrictive", for: "all", to: ["authenticated"] }),
	pgPolicy("super_admins_access_invitations", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("invitations_update", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("invitations_delete", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const billingCustomers = pgTable("billing_customers", {
	accountId: uuid("account_id").notNull(),
	id: serial().primaryKey().notNull(),
	email: text(),
	provider: billingProvider().notNull(),
	customerId: text("customer_id").notNull(),
}, (table) => [
	index("ix_billing_customers_account_id").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "billing_customers_account_id_fkey"
		}).onDelete("cascade"),
	unique("billing_customers_account_id_customer_id_provider_key").on(table.accountId, table.provider, table.customerId),
	pgPolicy("billing_customers_read_self", { as: "permissive", for: "select", to: ["authenticated"], using: sql`((account_id = ( SELECT auth.uid() AS uid)) OR has_role_on_account(account_id))` }),
]);

export const subscriptions = pgTable("subscriptions", {
	id: text().primaryKey().notNull(),
	accountId: uuid("account_id").notNull(),
	billingCustomerId: integer("billing_customer_id").notNull(),
	status: subscriptionStatus().notNull(),
	active: boolean().notNull(),
	billingProvider: billingProvider("billing_provider").notNull(),
	cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull(),
	currency: varchar({ length: 3 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	periodStartsAt: timestamp("period_starts_at", { withTimezone: true, mode: 'string' }).notNull(),
	periodEndsAt: timestamp("period_ends_at", { withTimezone: true, mode: 'string' }).notNull(),
	trialStartsAt: timestamp("trial_starts_at", { withTimezone: true, mode: 'string' }),
	trialEndsAt: timestamp("trial_ends_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("ix_subscriptions_account_id").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "subscriptions_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.billingCustomerId],
			foreignColumns: [billingCustomers.id],
			name: "subscriptions_billing_customer_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("restrict_mfa_subscriptions", { as: "restrictive", for: "all", to: ["authenticated"], using: sql`is_mfa_compliant()` }),
	pgPolicy("super_admins_access_subscriptions", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("subscriptions_read_self", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const subscriptionItems = pgTable("subscription_items", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	subscriptionId: text("subscription_id").notNull(),
	productId: varchar("product_id", { length: 255 }).notNull(),
	variantId: varchar("variant_id", { length: 255 }).notNull(),
	type: subscriptionItemType().notNull(),
	priceAmount: numeric("price_amount"),
	quantity: integer().default(1).notNull(),
	interval: varchar({ length: 255 }).notNull(),
	intervalCount: integer("interval_count").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("ix_subscription_items_subscription_id").using("btree", table.subscriptionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.subscriptionId],
			foreignColumns: [subscriptions.id],
			name: "subscription_items_subscription_id_fkey"
		}).onDelete("cascade"),
	unique("subscription_items_subscription_id_product_id_variant_id_key").on(table.subscriptionId, table.productId, table.variantId),
	pgPolicy("restrict_mfa_subscription_items", { as: "restrictive", for: "all", to: ["authenticated"], using: sql`is_mfa_compliant()` }),
	pgPolicy("super_admins_access_subscription_items", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("subscription_items_read_self", { as: "permissive", for: "select", to: ["authenticated"] }),
	check("subscription_items_interval_count_check", sql`interval_count > 0`),
]);

export const orders = pgTable("orders", {
	id: text().primaryKey().notNull(),
	accountId: uuid("account_id").notNull(),
	billingCustomerId: integer("billing_customer_id").notNull(),
	status: paymentStatus().notNull(),
	billingProvider: billingProvider("billing_provider").notNull(),
	totalAmount: numeric("total_amount").notNull(),
	currency: varchar({ length: 3 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("ix_orders_account_id").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "orders_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.billingCustomerId],
			foreignColumns: [billingCustomers.id],
			name: "orders_billing_customer_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("restrict_mfa_orders", { as: "restrictive", for: "all", to: ["authenticated"], using: sql`is_mfa_compliant()` }),
	pgPolicy("super_admins_access_orders", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("orders_read_self", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const orderItems = pgTable("order_items", {
	id: text().primaryKey().notNull(),
	orderId: text("order_id").notNull(),
	productId: text("product_id").notNull(),
	variantId: text("variant_id").notNull(),
	priceAmount: numeric("price_amount"),
	quantity: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("ix_order_items_order_id").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_fkey"
		}).onDelete("cascade"),
	unique("order_items_order_id_product_id_variant_id_key").on(table.orderId, table.productId, table.variantId),
	pgPolicy("restrict_mfa_order_items", { as: "restrictive", for: "all", to: ["authenticated"], using: sql`is_mfa_compliant()` }),
	pgPolicy("super_admins_access_order_items", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("order_items_read_self", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const accountUser = pgTable("account_user", {
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id").notNull(),
	accountRole: accountRole("account_role").notNull(),
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [workplaces.id],
			name: "account_user_account_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "account_user_user_id_fkey"
		}),
]);

export const notifications = pgTable("notifications", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "notifications_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	accountId: uuid("account_id").notNull(),
	type: notificationType().default('info').notNull(),
	body: varchar({ length: 5000 }).notNull(),
	link: varchar({ length: 255 }),
	channel: notificationChannel().default('in_app').notNull(),
	dismissed: boolean().default(false).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`(now() + '1 mon'::interval)`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_notifications_account_dismissed").using("btree", table.accountId.asc().nullsLast().op("timestamptz_ops"), table.dismissed.asc().nullsLast().op("uuid_ops"), table.expiresAt.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "notifications_account_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("restrict_mfa_notifications", { as: "restrictive", for: "all", to: ["authenticated"], using: sql`is_mfa_compliant()` }),
	pgPolicy("notifications_read_self", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("notifications_update_self", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const chats = pgTable("chats", {
	id: serial().primaryKey().notNull(),
	referenceId: varchar("reference_id", { length: 8 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	accountId: uuid("account_id").notNull(),
	settings: jsonb().default({}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("ix_chats_account_id").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "chats_account_id_fkey"
		}).onDelete("cascade"),
	unique("chats_reference_id_key").on(table.referenceId),
	pgPolicy("delete_chats", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`has_role_on_account(account_id)` }),
	pgPolicy("select_chats", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("insert_chats", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("update_chats", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const tasks = pgTable("tasks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 500 }).notNull(),
	description: varchar({ length: 50000 }),
	done: boolean().default(false).notNull(),
	accountId: uuid("account_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_tasks_account_id").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "tasks_account_id_fkey"
		}),
	pgPolicy("select_tasks", { as: "permissive", for: "select", to: ["authenticated"], using: sql`((account_id = ( SELECT auth.uid() AS uid)) OR has_role_on_account(account_id))` }),
	pgPolicy("insert_tasks", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("update_tasks", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("delete_tasks", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const chatMessages = pgTable("chat_messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: serial("chat_id").notNull(),
	accountId: uuid("account_id").notNull(),
	content: text().notNull(),
	role: chatRole().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("ix_chat_messages_chat_id").using("btree", table.chatId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "chat_messages_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "chat_messages_chat_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("select_chat_messages", { as: "permissive", for: "select", to: ["authenticated"], using: sql`has_role_on_account(account_id)` }),
	pgPolicy("delete_chat_messages", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const creditsUsage = pgTable("credits_usage", {
	id: serial().primaryKey().notNull(),
	accountId: uuid("account_id").notNull(),
	remainingCredits: integer("remaining_credits").default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "credits_usage_account_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("select_credits_usage", { as: "permissive", for: "select", to: ["authenticated"], using: sql`has_role_on_account(account_id)` }),
]);

export const plans = pgTable("plans", {
	variantId: varchar("variant_id", { length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	tokensQuota: integer("tokens_quota").notNull(),
}, (table) => [
	pgPolicy("select_plans", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
]);

export const nonces = pgTable("nonces", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clientToken: text("client_token").notNull(),
	nonce: text().notNull(),
	userId: uuid("user_id"),
	purpose: text().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
	revoked: boolean().default(false).notNull(),
	revokedReason: text("revoked_reason"),
	verificationAttempts: integer("verification_attempts").default(0).notNull(),
	lastVerificationAt: timestamp("last_verification_at", { withTimezone: true, mode: 'string' }),
	lastVerificationIp: inet("last_verification_ip"),
	lastVerificationUserAgent: text("last_verification_user_agent"),
	metadata: jsonb().default({}),
	scopes: text().array().default([""]),
}, (table) => [
	index("idx_nonces_status").using("btree", table.clientToken.asc().nullsLast().op("text_ops"), table.userId.asc().nullsLast().op("uuid_ops"), table.purpose.asc().nullsLast().op("timestamptz_ops"), table.expiresAt.asc().nullsLast().op("uuid_ops")).where(sql`((used_at IS NULL) AND (revoked = false))`),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "nonces_user_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can read their own nonces", { as: "permissive", for: "select", to: ["public"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
]);

export const accountsMemberships = pgTable("accounts_memberships", {
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id").notNull(),
	accountRole: varchar("account_role", { length: 50 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdBy: uuid("created_by"),
	updatedBy: uuid("updated_by"),
}, (table) => [
	index("ix_accounts_memberships_account_id").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	index("ix_accounts_memberships_account_role").using("btree", table.accountRole.asc().nullsLast().op("text_ops")),
	index("ix_accounts_memberships_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "accounts_memberships_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.accountRole],
			foreignColumns: [roles.name],
			name: "accounts_memberships_account_role_fkey"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "accounts_memberships_created_by_fkey"
		}),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "accounts_memberships_updated_by_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_memberships_user_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.accountId], name: "accounts_memberships_pkey"}),
	pgPolicy("restrict_mfa_accounts_memberships", { as: "restrictive", for: "all", to: ["authenticated"], using: sql`is_mfa_compliant()` }),
	pgPolicy("super_admins_access_accounts_memberships", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("accounts_memberships_read", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("accounts_memberships_delete", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);
export const userAccountWorkspace = pgView("user_account_workspace", {	id: uuid(),
	name: varchar({ length: 255 }),
	pictureUrl: varchar("picture_url", { length: 1000 }),
	subscriptionStatus: subscriptionStatus("subscription_status"),
}).with({"securityInvoker":true}).as(sql`SELECT accounts.id, accounts.name, accounts.picture_url, ( SELECT subscriptions.status FROM subscriptions WHERE subscriptions.account_id = accounts.id LIMIT 1) AS subscription_status FROM accounts WHERE accounts.primary_owner_user_id = (( SELECT auth.uid() AS uid)) AND accounts.is_personal_account = true LIMIT 1`);

export const userAccounts = pgView("user_accounts", {	id: uuid(),
	name: varchar({ length: 255 }),
	pictureUrl: varchar("picture_url", { length: 1000 }),
	slug: text(),
	role: varchar({ length: 50 }),
}).with({"securityInvoker":true}).as(sql`SELECT account.id, account.name, account.picture_url, account.slug, membership.account_role AS role FROM accounts account JOIN accounts_memberships membership ON account.id = membership.account_id WHERE membership.user_id = (( SELECT auth.uid() AS uid)) AND account.is_personal_account = false AND (account.id IN ( SELECT accounts_memberships.account_id FROM accounts_memberships WHERE accounts_memberships.user_id = (( SELECT auth.uid() AS uid))))`);
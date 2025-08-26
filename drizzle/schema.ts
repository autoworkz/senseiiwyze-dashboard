import { pgTable, text, timestamp, index, foreignKey, uuid, integer, jsonb, unique, boolean, varchar, numeric, bigint, uniqueIndex, smallint, doublePrecision, serial, char, date, pgPolicy, check, inet, json, primaryKey, pgView, pgEnum } from "drizzle-orm/pg-core"
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
export const roleStatus = pgEnum("role_status", ['admin', 'user', 'admin-executive', 'admin-manager'])
export const subscriptionItemType = pgEnum("subscription_item_type", ['flat', 'per_seat', 'metered'])
export const subscriptionStatus = pgEnum("subscription_status", ['active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused'])
export const taskstate = pgEnum("taskstate", ['UNTOUCHED', 'ONGOING', 'COMPLETED'])
export const tasktype = pgEnum("tasktype", ['GAME', 'QUIZ', 'FLASHCARD'])


export const baJwkss = pgTable("ba_jwkss", {
	id: text().primaryKey().notNull(),
	publicKey: text("public_key").notNull(),
	privateKey: text("private_key").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
});

export const baUsageSummary = pgTable("ba_usage_summary", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	month: text().notNull(),
	totalCredits: integer("total_credits").default(0).notNull(),
	assessmentsTaken: integer("assessments_taken").default(0).notNull(),
	reportsGenerated: integer("reports_generated").default(0).notNull(),
	aiInteractions: integer("ai_interactions").default(0).notNull(),
	apiCalls: integer("api_calls").default(0).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ba_usage_summary_user_month_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.month.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_usage_summary_user_id_fkey"
		}).onDelete("cascade"),
]);

export const userEmloyementStatus = pgTable("user_emloyement_status", {
	employmentStatus: text("employment_status"),
});

export const baCreditTransactions = pgTable("ba_credit_transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	type: text().notNull(),
	amount: integer().notNull(),
	balance: integer().notNull(),
	description: text(),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ba_credit_transactions_created_at_idx").using("btree", table.createdAt.desc().nullsFirst().op("timestamp_ops")),
	index("ba_credit_transactions_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	index("ba_credit_transactions_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_credit_transactions_user_id_fkey"
		}).onDelete("cascade"),
]);

export const baUsageTracking = pgTable("ba_usage_tracking", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	feature: text().notNull(),
	credits: integer().default(1).notNull(),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ba_usage_tracking_created_at_idx").using("btree", table.createdAt.desc().nullsFirst().op("timestamp_ops")),
	index("ba_usage_tracking_feature_idx").using("btree", table.feature.asc().nullsLast().op("text_ops")),
	index("ba_usage_tracking_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_usage_tracking_user_id_fkey"
		}).onDelete("cascade"),
]);

export const baCreditBalance = pgTable("ba_credit_balance", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	totalCredits: integer("total_credits").default(0).notNull(),
	usedCredits: integer("used_credits").default(0).notNull(),
	bonusCredits: integer("bonus_credits").default(0).notNull(),
	monthlyAllocation: integer("monthly_allocation").default(0).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_credit_balance_user_id_fkey"
		}).onDelete("cascade"),
	unique("ba_credit_balance_user_id_key").on(table.userId),
]);

export const baUsers = pgTable("ba_users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	role: text(),
	banned: boolean(),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires", { mode: 'string' }),
	isAnonymous: boolean("is_anonymous"),
	username: text(),
	displayUsername: text("display_username"),
	twoFactorEnabled: boolean("two_factor_enabled"),
	profileId: uuid("profile_id"),
}, (table) => [
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "ba_users_profile_id_fkey"
		}).onDelete("set null"),
	unique("ba_users_email_unique").on(table.email),
	unique("ba_users_username_unique").on(table.username),
]);

export const workplaceType = pgTable("workplace_type", {
	type: text(),
});

export const baVerifications = pgTable("ba_verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const baAccounts = pgTable("ba_accounts", {
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
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_accounts_user_id_ba_users_id_fk"
		}).onDelete("cascade"),
]);

export const baApikeys = pgTable("ba_apikeys", {
	id: text().primaryKey().notNull(),
	name: text(),
	start: text(),
	prefix: text(),
	key: text().notNull(),
	userId: text("user_id").notNull(),
	refillInterval: integer("refill_interval"),
	refillAmount: integer("refill_amount"),
	lastRefillAt: timestamp("last_refill_at", { mode: 'string' }),
	enabled: boolean().default(true),
	rateLimitEnabled: boolean("rate_limit_enabled").default(true),
	rateLimitTimeWindow: integer("rate_limit_time_window").default(86400000),
	rateLimitMax: integer("rate_limit_max").default(10),
	requestCount: integer("request_count"),
	remaining: integer(),
	lastRequest: timestamp("last_request", { mode: 'string' }),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	permissions: text(),
	metadata: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_apikeys_user_id_ba_users_id_fk"
		}).onDelete("cascade"),
]);

export const userEmloyementStatuss = pgTable("user_emloyement_statuss", {
	employmentStatus: text("employment_status"),
});

export const iwaReference = pgTable("iwa_reference", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	iwaId: varchar("iwa_id", { length: 20 }).primaryKey().notNull(),
	iwaTitle: varchar("iwa_title", { length: 150 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "iwa_reference_element_id_fkey"
		}),
]);

export const unspscReference = pgTable("unspsc_reference", {
	commodityCode: numeric("commodity_code", { precision: 8, scale:  0 }).primaryKey().notNull(),
	commodityTitle: varchar("commodity_title", { length: 150 }).notNull(),
	classCode: numeric("class_code", { precision: 8, scale:  0 }).notNull(),
	classTitle: varchar("class_title", { length: 150 }).notNull(),
	familyCode: numeric("family_code", { precision: 8, scale:  0 }).notNull(),
	familyTitle: varchar("family_title", { length: 150 }).notNull(),
	segmentCode: numeric("segment_code", { precision: 8, scale:  0 }).notNull(),
	segmentTitle: varchar("segment_title", { length: 150 }).notNull(),
});

export const baOrganizations = pgTable("ba_organizations", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text(),
	logo: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	metadata: text(),
}, (table) => [
	unique("ba_organizations_slug_unique").on(table.slug),
]);

export const scalesReference = pgTable("scales_reference", {
	scaleId: varchar("scale_id", { length: 3 }).primaryKey().notNull(),
	scaleName: varchar("scale_name", { length: 50 }).notNull(),
	minimum: numeric({ precision: 1, scale:  0 }).notNull(),
	maximum: numeric({ precision: 3, scale:  0 }).notNull(),
});

export const contentModelReference = pgTable("content_model_reference", {
	elementId: varchar("element_id", { length: 20 }).primaryKey().notNull(),
	elementName: varchar("element_name", { length: 150 }).notNull(),
	description: varchar({ length: 1500 }).notNull(),
});

export const baInvitations = pgTable("ba_invitations", {
	id: text().primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	email: text().notNull(),
	role: text(),
	status: text().default('pending').notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	inviterId: text("inviter_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.inviterId],
			foreignColumns: [baUsers.id],
			name: "ba_invitations_inviter_id_ba_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [baOrganizations.id],
			name: "ba_invitations_organization_id_ba_organizations_id_fk"
		}).onDelete("cascade"),
]);

export const dwaReference = pgTable("dwa_reference", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	iwaId: varchar("iwa_id", { length: 20 }).notNull(),
	dwaId: varchar("dwa_id", { length: 20 }).primaryKey().notNull(),
	dwaTitle: varchar("dwa_title", { length: 150 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "dwa_reference_element_id_fkey"
		}),
	foreignKey({
			columns: [table.iwaId],
			foreignColumns: [iwaReference.iwaId],
			name: "dwa_reference_iwa_id_fkey"
		}),
]);

export const levelScaleAnchors = pgTable("level_scale_anchors", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	anchorValue: numeric("anchor_value", { precision: 3, scale:  0 }).notNull(),
	anchorDescription: varchar("anchor_description", { length: 1000 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "level_scale_anchors_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "level_scale_anchors_scale_id_fkey"
		}),
]);

export const jobZoneReference = pgTable("job_zone_reference", {
	jobZone: numeric("job_zone", { precision: 1, scale:  0 }).primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	experience: varchar({ length: 300 }).notNull(),
	education: varchar({ length: 500 }).notNull(),
	jobTraining: varchar("job_training", { length: 300 }).notNull(),
	examples: varchar({ length: 500 }).notNull(),
	svpRange: varchar("svp_range", { length: 25 }).notNull(),
});

export const baMembers = pgTable("ba_members", {
	id: text().primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	userId: text("user_id").notNull(),
	role: text().default('member').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [baOrganizations.id],
			name: "ba_members_organization_id_ba_organizations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_members_user_id_ba_users_id_fk"
		}).onDelete("cascade"),
]);

export const baSessions = pgTable("ba_sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	activeOrganizationId: text("active_organization_id"),
	impersonatedBy: text("impersonated_by"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_sessions_user_id_ba_users_id_fk"
		}).onDelete("cascade"),
	unique("ba_sessions_token_unique").on(table.token),
]);

export const baSsoProviders = pgTable("ba_sso_providers", {
	id: text().primaryKey().notNull(),
	issuer: text().notNull(),
	oidcConfig: text("oidc_config"),
	samlConfig: text("saml_config"),
	userId: text("user_id"),
	providerId: text("provider_id").notNull(),
	organizationId: text("organization_id"),
	domain: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_sso_providers_user_id_ba_users_id_fk"
		}).onDelete("cascade"),
	unique("ba_sso_providers_provider_id_unique").on(table.providerId),
]);

export const baTwoFactors = pgTable("ba_two_factors", {
	id: text().primaryKey().notNull(),
	secret: text().notNull(),
	backupCodes: text("backup_codes").notNull(),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
			name: "ba_two_factors_user_id_ba_users_id_fk"
		}).onDelete("cascade"),
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

export const evaluations = pgTable("evaluations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	assessmentId: uuid("assessment_id"),
	results: jsonb().default({}),
	workplaceId: uuid("workplace_id").notNull(),
	isCompleted: boolean("is_completed").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
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

export const imageSearch = pgTable("image_search", {
	id: text().primaryKey().notNull(),
	searchTerm: text("search_term").notNull(),
	url: text().notNull(),
});

export const abilitiesToWorkContext = pgTable("abilities_to_work_context", {
	abilitiesElementId: varchar("abilities_element_id", { length: 20 }).notNull(),
	workContextElementId: varchar("work_context_element_id", { length: 20 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.abilitiesElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "abilities_to_work_context_abilities_element_id_fkey"
		}),
	foreignKey({
			columns: [table.workContextElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "abilities_to_work_context_work_context_element_id_fkey"
		}),
]);

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
	jobTitle: text("job_title"),
	isOnboarding: boolean("is_onboarding").default(true).notNull(),
}, (table) => [
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
	unique("task_completion_id_key").on(table.id),
]);

export const obstacles = pgTable("obstacles", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
	name: text(),
	visionId: text("vision_id"),
	goalId: text("goal_id"),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow(),
	isCompleted: boolean("is_completed").default(false),
});

export const sizes = pgTable("sizes", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
	height: doublePrecision().default(200).notNull(),
	width: doublePrecision().default(200).notNull(),
});

export const levelOnboarding = pgTable("level_onboarding", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	gameId: text("game_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	levelNo: bigint("level_no", { mode: "number" }).notNull(),
	onboardingGif: text("onboarding_gif"),
	onboardingText: text("onboarding_text"),
});

export const goals = pgTable("goals", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
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

export const status = pgTable("status", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	state: taskstate().default('UNTOUCHED'),
	locked: boolean().default(true),
	progress: integer().default(0),
	complete: boolean().default(false),
	startedAt: timestamp("started_at", { precision: 3, mode: 'string' }).defaultNow(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
});

export const interests = pgTable("interests", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "interests_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "interests_scale_id_fkey"
		}),
]);

export const educationTrainingExperience = pgTable("education_training_experience", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	category: numeric({ precision: 3, scale:  0 }),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	n: numeric({ precision: 4, scale:  0 }),
	standardError: numeric("standard_error", { precision: 7, scale:  4 }),
	lowerCiBound: numeric("lower_ci_bound", { precision: 7, scale:  4 }),
	upperCiBound: numeric("upper_ci_bound", { precision: 7, scale:  4 }),
	recommendSuppress: char("recommend_suppress", { length: 1 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "education_training_experience_element_id_fkey"
		}),
	foreignKey({
			columns: [table.elementId, table.scaleId, table.category],
			foreignColumns: [eteCategories.elementId, eteCategories.scaleId, eteCategories.category],
			name: "education_training_experience_element_id_scale_id_category_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "education_training_experience_scale_id_fkey"
		}),
]);

export const interestsIllusActivities = pgTable("interests_illus_activities", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	interestType: varchar("interest_type", { length: 20 }).notNull(),
	activity: varchar({ length: 150 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "interests_illus_activities_element_id_fkey"
		}),
]);

export const lcaInvitations = pgTable("lca_invitations", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	accountRole: accountRole("account_role").notNull(),
	accountId: uuid("account_id").notNull(),
	token: text().default(sql`generate_token(30)`).notNull(),
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

export const interestsIllusOccupations = pgTable("interests_illus_occupations", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	interestType: varchar("interest_type", { length: 20 }).notNull(),
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "interests_illus_occupations_element_id_fkey"
		}),
]);

export const jobZones = pgTable("job_zones", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	jobZone: numeric("job_zone", { precision: 1, scale:  0 }).notNull(),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.jobZone],
			foreignColumns: [jobZoneReference.jobZone],
			name: "job_zones_job_zone_fkey"
		}),
]);

export const knowledge = pgTable("knowledge", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	n: numeric({ precision: 4, scale:  0 }),
	standardError: numeric("standard_error", { precision: 7, scale:  4 }),
	lowerCiBound: numeric("lower_ci_bound", { precision: 7, scale:  4 }),
	upperCiBound: numeric("upper_ci_bound", { precision: 7, scale:  4 }),
	recommendSuppress: char("recommend_suppress", { length: 1 }),
	notRelevant: char("not_relevant", { length: 1 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "knowledge_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "knowledge_scale_id_fkey"
		}),
]);

export const riasecKeywords = pgTable("riasec_keywords", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	keyword: varchar({ length: 150 }).notNull(),
	keywordType: varchar("keyword_type", { length: 20 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "riasec_keywords_element_id_fkey"
		}),
]);

export const skills = pgTable("skills", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	n: numeric({ precision: 4, scale:  0 }),
	standardError: numeric("standard_error", { precision: 7, scale:  4 }),
	lowerCiBound: numeric("lower_ci_bound", { precision: 7, scale:  4 }),
	upperCiBound: numeric("upper_ci_bound", { precision: 7, scale:  4 }),
	recommendSuppress: char("recommend_suppress", { length: 1 }),
	notRelevant: char("not_relevant", { length: 1 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "skills_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "skills_scale_id_fkey"
		}),
]);

export const skillsToWorkActivities = pgTable("skills_to_work_activities", {
	skillsElementId: varchar("skills_element_id", { length: 20 }).notNull(),
	workActivitiesElementId: varchar("work_activities_element_id", { length: 20 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.skillsElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "skills_to_work_activities_skills_element_id_fkey"
		}),
	foreignKey({
			columns: [table.workActivitiesElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "skills_to_work_activities_work_activities_element_id_fkey"
		}),
]);

export const skillsToWorkContext = pgTable("skills_to_work_context", {
	skillsElementId: varchar("skills_element_id", { length: 20 }).notNull(),
	workContextElementId: varchar("work_context_element_id", { length: 20 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.skillsElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "skills_to_work_context_skills_element_id_fkey"
		}),
	foreignKey({
			columns: [table.workContextElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "skills_to_work_context_work_context_element_id_fkey"
		}),
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

export const surveyBookletLocations = pgTable("survey_booklet_locations", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	surveyItemNumber: varchar("survey_item_number", { length: 4 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "survey_booklet_locations_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "survey_booklet_locations_scale_id_fkey"
		}),
]);

export const taskRatings = pgTable("task_ratings", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	taskId: numeric("task_id", { precision: 8, scale:  0 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	category: numeric({ precision: 3, scale:  0 }),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	n: numeric({ precision: 4, scale:  0 }),
	standardError: numeric("standard_error", { precision: 7, scale:  4 }),
	lowerCiBound: numeric("lower_ci_bound", { precision: 7, scale:  4 }),
	upperCiBound: numeric("upper_ci_bound", { precision: 7, scale:  4 }),
	recommendSuppress: char("recommend_suppress", { length: 1 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.scaleId, table.category],
			foreignColumns: [taskCategories.scaleId, taskCategories.category],
			name: "task_ratings_scale_id_category_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "task_ratings_scale_id_fkey"
		}),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [taskStatements.taskId],
			name: "task_ratings_task_id_fkey"
		}),
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

export const tasksToDwas = pgTable("tasks_to_dwas", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	taskId: numeric("task_id", { precision: 8, scale:  0 }).notNull(),
	dwaId: varchar("dwa_id", { length: 20 }).notNull(),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.dwaId],
			foreignColumns: [dwaReference.dwaId],
			name: "tasks_to_dwas_dwa_id_fkey"
		}),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [taskStatements.taskId],
			name: "tasks_to_dwas_task_id_fkey"
		}),
]);

export const visionKeywords = pgTable("vision_keywords", {
	id: serial().primaryKey().notNull(),
	boardId: text("board_id"),
	keyword: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.boardId],
			foreignColumns: [visionBoards.id],
			name: "vision_keywords_board_id_fkey"
		}).onDelete("cascade"),
]);

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

export const workContext = pgTable("work_context", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	category: numeric({ precision: 3, scale:  0 }),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	n: numeric({ precision: 4, scale:  0 }),
	standardError: numeric("standard_error", { precision: 7, scale:  4 }),
	lowerCiBound: numeric("lower_ci_bound", { precision: 7, scale:  4 }),
	upperCiBound: numeric("upper_ci_bound", { precision: 7, scale:  4 }),
	recommendSuppress: char("recommend_suppress", { length: 1 }),
	notRelevant: char("not_relevant", { length: 1 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "work_context_element_id_fkey"
		}),
	foreignKey({
			columns: [table.elementId, table.scaleId, table.category],
			foreignColumns: [workContextCategories.elementId, workContextCategories.scaleId, workContextCategories.category],
			name: "work_context_element_id_scale_id_category_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "work_context_scale_id_fkey"
		}),
]);

export const abilities = pgTable("abilities", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	n: numeric({ precision: 4, scale:  0 }),
	standardError: numeric("standard_error", { precision: 7, scale:  4 }),
	lowerCiBound: numeric("lower_ci_bound", { precision: 7, scale:  4 }),
	upperCiBound: numeric("upper_ci_bound", { precision: 7, scale:  4 }),
	recommendSuppress: char("recommend_suppress", { length: 1 }),
	notRelevant: char("not_relevant", { length: 1 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "abilities_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "abilities_scale_id_fkey"
		}),
]);

export const abilitiesToWorkActivities = pgTable("abilities_to_work_activities", {
	abilitiesElementId: varchar("abilities_element_id", { length: 20 }).notNull(),
	workActivitiesElementId: varchar("work_activities_element_id", { length: 20 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.abilitiesElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "abilities_to_work_activities_abilities_element_id_fkey"
		}),
	foreignKey({
			columns: [table.workActivitiesElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "abilities_to_work_activities_work_activities_element_id_fkey"
		}),
]);

export const basicInterestsToRiasec = pgTable("basic_interests_to_riasec", {
	basicInterestsElementId: varchar("basic_interests_element_id", { length: 20 }).notNull(),
	riasecElementId: varchar("riasec_element_id", { length: 20 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.basicInterestsElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "basic_interests_to_riasec_basic_interests_element_id_fkey"
		}),
	foreignKey({
			columns: [table.riasecElementId],
			foreignColumns: [contentModelReference.elementId],
			name: "basic_interests_to_riasec_riasec_element_id_fkey"
		}),
]);

export const taskStatements = pgTable("task_statements", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	taskId: numeric("task_id", { precision: 8, scale:  0 }).primaryKey().notNull(),
	task: varchar({ length: 1000 }).notNull(),
	taskType: varchar("task_type", { length: 12 }),
	incumbentsResponding: numeric("incumbents_responding", { precision: 4, scale:  0 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
});

export const technologySkills = pgTable("technology_skills", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	example: varchar({ length: 150 }).notNull(),
	commodityCode: numeric("commodity_code", { precision: 8, scale:  0 }).notNull(),
	hotTechnology: char("hot_technology", { length: 1 }).notNull(),
	inDemand: char("in_demand", { length: 1 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.commodityCode],
			foreignColumns: [unspscReference.commodityCode],
			name: "technology_skills_commodity_code_fkey"
		}),
]);

export const toolsUsed = pgTable("tools_used", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	example: varchar({ length: 150 }).notNull(),
	commodityCode: numeric("commodity_code", { precision: 8, scale:  0 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.commodityCode],
			foreignColumns: [unspscReference.commodityCode],
			name: "tools_used_commodity_code_fkey"
		}),
]);

export const workActivities = pgTable("work_activities", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	n: numeric({ precision: 4, scale:  0 }),
	standardError: numeric("standard_error", { precision: 7, scale:  4 }),
	lowerCiBound: numeric("lower_ci_bound", { precision: 7, scale:  4 }),
	upperCiBound: numeric("upper_ci_bound", { precision: 7, scale:  4 }),
	recommendSuppress: char("recommend_suppress", { length: 1 }),
	notRelevant: char("not_relevant", { length: 1 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "work_activities_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "work_activities_scale_id_fkey"
		}),
]);

export const workStyles = pgTable("work_styles", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	n: numeric({ precision: 4, scale:  0 }),
	standardError: numeric("standard_error", { precision: 7, scale:  4 }),
	lowerCiBound: numeric("lower_ci_bound", { precision: 7, scale:  4 }),
	upperCiBound: numeric("upper_ci_bound", { precision: 7, scale:  4 }),
	recommendSuppress: char("recommend_suppress", { length: 1 }),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "work_styles_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "work_styles_scale_id_fkey"
		}),
]);

export const workValues = pgTable("work_values", {
	onetsocCode: char("onetsoc_code", { length: 10 }).notNull(),
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	dataValue: numeric("data_value", { precision: 5, scale:  2 }).notNull(),
	dateUpdated: date("date_updated").notNull(),
	domainSource: varchar("domain_source", { length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "work_values_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "work_values_scale_id_fkey"
		}),
]);

export const visionBoards = pgTable("vision_boards", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
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
});

export const visionJournalEntries = pgTable("vision_journal_entries", {
	id: serial().primaryKey().notNull(),
	boardId: text("board_id"),
	entryDate: date("entry_date").notNull(),
	content: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.boardId],
			foreignColumns: [visionBoards.id],
			name: "vision_journal_entries_board_id_fkey"
		}).onDelete("cascade"),
]);

export const visionFocusAreas = pgTable("vision_focus_areas", {
	id: serial().primaryKey().notNull(),
	boardId: text("board_id"),
	focusArea: text("focus_area").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.boardId],
			foreignColumns: [visionBoards.id],
			name: "vision_focus_areas_board_id_fkey"
		}).onDelete("cascade"),
]);

export const visionGoals = pgTable("vision_goals", {
	id: serial().primaryKey().notNull(),
	boardId: text("board_id"),
	goalText: text("goal_text").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.boardId],
			foreignColumns: [visionBoards.id],
			name: "vision_goals_board_id_fkey"
		}).onDelete("cascade"),
]);

export const tasks = pgTable("tasks", {
	id: uuid().default(sql`uuid_generate_v4()`).notNull(),
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

export const onboardingHistory = pgTable("onboarding_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	profileId: uuid("profile_id").notNull(),
	levelOnboardingId: uuid("level_onboarding_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.levelOnboardingId],
			foreignColumns: [levelOnboarding.id],
			name: "onboarding_history_level_onboarding_id_fkey"
		}),
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "onboarding_history_profile_id_fkey"
		}),
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
			foreignColumns: [baUsers.id],
			name: "accounts_created_by_fkey"
		}),
	foreignKey({
			columns: [table.primaryOwnerUserId],
			foreignColumns: [baUsers.id],
			name: "accounts_primary_owner_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [baUsers.id],
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

export const userCoreSkills = pgTable("user_core_skills", {
	id: integer().default(sql`nextval('user_skills_id_seq'::regclass)`).primaryKey().notNull(),
	userId: uuid("user_id"),
	category: text().notNull(),
	value: integer().notNull(),
}, (table) => [
	unique("core_skills_user_id_category_key").on(table.userId, table.category),
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

export const userSkills = pgTable("user_skills", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id"),
	category: text().notNull(),
	value: integer().notNull(),
	skillType: integer("skill_type"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "user_skills_user_id_fkey"
		}),
	unique("uniq_user_skill").on(table.userId, table.category),
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
			foreignColumns: [workplaces.id],
			name: "invitations_account_id_fkey"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "invitations_account_id_fkey1"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.invitedBy],
			foreignColumns: [baUsers.id],
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

export const userPrograms = pgTable("user_programs", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id"),
	assessmentId: uuid("assessment_id"),
	readiness: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.assessmentId],
			foreignColumns: [assessments.id],
			name: "user_programs_assessment_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "user_programs_user_id_fkey"
		}),
]);

export const personalityExams = pgTable("personality_exams", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id"),
	type: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "personality_exams_user_id_fkey"
		}),
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
			foreignColumns: [baUsers.id],
			name: "nonces_user_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can read their own nonces", { as: "permissive", for: "select", to: ["public"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
]);

export const examTraits = pgTable("exam_traits", {
	id: serial().primaryKey().notNull(),
	examId: integer("exam_id"),
	trait: text().notNull(),
	value: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.examId],
			foreignColumns: [personalityExams.id],
			name: "exam_traits_exam_id_fkey"
		}),
]);

export const examStrengths = pgTable("exam_strengths", {
	id: serial().primaryKey().notNull(),
	examId: integer("exam_id"),
	strength: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.examId],
			foreignColumns: [personalityExams.id],
			name: "exam_strengths_exam_id_fkey"
		}),
]);

export const examGrowthAreas = pgTable("exam_growth_areas", {
	id: serial().primaryKey().notNull(),
	examId: integer("exam_id"),
	area: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.examId],
			foreignColumns: [personalityExams.id],
			name: "exam_growth_areas_exam_id_fkey"
		}),
]);

export const userSkillDetails = pgTable("user_skill_details", {
	id: serial().primaryKey().notNull(),
	skillId: integer("skill_id"),
	subskill: text().notNull(),
	value: integer().notNull(),
	userId: text("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.skillId],
			foreignColumns: [userSkills.id],
			name: "user_skill_details_skill_id_fkey"
		}),
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

export const answers = pgTable("answers", {
	id: serial().primaryKey().notNull(),
	answeredAt: timestamp("answered_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	rating: integer().notNull(),
	questionId: integer("question_id").notNull(),
	userId: uuid("user_id").notNull(),
	response: jsonb().default({}),
	assessmentId: uuid("assessment_id"),
	evaluationId: uuid("evaluation_id"),
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
	unique("idx_unique_answers_for_eval").on(table.questionId, table.evaluationId),
]);

export const programSkillRequirements = pgTable("program_skill_requirements", {
	id: serial().primaryKey().notNull(),
	assessmentId: uuid("assessment_id"),
	skillKey: text("skill_key").notNull(),
	requiredScore: integer("required_score").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.assessmentId],
			foreignColumns: [assessments.id],
			name: "program_skill_requirements_assessment_id_fkey"
		}).onDelete("cascade"),
	unique("program_skill_requirements_assessment_id_skill_key_key").on(table.assessmentId, table.skillKey),
]);

export const constants = pgTable("constants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	key: text().notNull(),
	value: json(),
});

export const categories = pgTable("categories", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "categories_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: varchar(),
});

export const taskCategories = pgTable("task_categories", {
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	category: numeric({ precision: 3, scale:  0 }).notNull(),
	categoryDescription: varchar("category_description", { length: 1000 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "task_categories_scale_id_fkey"
		}),
	primaryKey({ columns: [table.scaleId, table.category], name: "task_categories_pkey"}),
]);

export const eteCategories = pgTable("ete_categories", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	category: numeric({ precision: 3, scale:  0 }).notNull(),
	categoryDescription: varchar("category_description", { length: 1000 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "ete_categories_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "ete_categories_scale_id_fkey"
		}),
	primaryKey({ columns: [table.elementId, table.scaleId, table.category], name: "ete_categories_pkey"}),
]);

export const workContextCategories = pgTable("work_context_categories", {
	elementId: varchar("element_id", { length: 20 }).notNull(),
	scaleId: varchar("scale_id", { length: 3 }).notNull(),
	category: numeric({ precision: 3, scale:  0 }).notNull(),
	categoryDescription: varchar("category_description", { length: 1000 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.elementId],
			foreignColumns: [contentModelReference.elementId],
			name: "work_context_categories_element_id_fkey"
		}),
	foreignKey({
			columns: [table.scaleId],
			foreignColumns: [scalesReference.scaleId],
			name: "work_context_categories_scale_id_fkey"
		}),
	primaryKey({ columns: [table.elementId, table.scaleId, table.category], name: "work_context_categories_pkey"}),
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
			foreignColumns: [baUsers.id],
			name: "accounts_memberships_created_by_fkey"
		}),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [baUsers.id],
			name: "accounts_memberships_updated_by_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [baUsers.id],
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
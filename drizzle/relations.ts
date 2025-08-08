import { relations } from "drizzle-orm/relations";
import { baUsers, baUsageSummary, baCreditTransactions, baUsageTracking, baCreditBalance, profiles, baAccounts, baApikeys, contentModelReference, iwaReference, baInvitations, baOrganizations, dwaReference, levelScaleAnchors, scalesReference, baMembers, baSessions, baSsoProviders, baTwoFactors, categories, activities, assessments, evaluations, workplaces, abilitiesToWorkContext, profilesCopy, taskCompletion, sizes, goals, visionBoards, questions, interests, educationTrainingExperience, eteCategories, interestsIllusActivities, lcaInvitations, interestsIllusOccupations, jobZoneReference, jobZones, knowledge, riasecKeywords, skills, skillsToWorkActivities, skillsToWorkContext, user, session, surveyBookletLocations, taskCategories, taskRatings, taskStatements, account, tasksToDwas, visionKeywords, gameTasks, workContext, workContextCategories, abilities, abilitiesToWorkActivities, basicInterestsToRiasec, unspscReference, technologySkills, toolsUsed, workActivities, workStyles, workValues, visionJournalEntries, visionFocusAreas, visionGoals, tasks, userTasks, scores, status, levelOnboarding, onboardingHistory, visionLog, usersInAuth, accounts, roles, rolePermissions, userSkills, invitations, billingCustomers, subscriptions, subscriptionItems, orders, orderItems, notifications, chats, chatMessages, creditsUsage, userPrograms, personalityExams, nonces, examTraits, examStrengths, examGrowthAreas, userSkillDetails, accountUser, gameInfo, activityProgress, answers, programSkillRequirements, accountsMemberships } from "./schema";

export const baUsageSummaryRelations = relations(baUsageSummary, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baUsageSummary.userId],
		references: [baUsers.id]
	}),
}));

export const baUsersRelations = relations(baUsers, ({one, many}) => ({
	baUsageSummaries: many(baUsageSummary),
	baCreditTransactions: many(baCreditTransactions),
	baUsageTrackings: many(baUsageTracking),
	baCreditBalances: many(baCreditBalance),
	profile: one(profiles, {
		fields: [baUsers.profileId],
		references: [profiles.id]
	}),
	baAccounts: many(baAccounts),
	baApikeys: many(baApikeys),
	baInvitations: many(baInvitations),
	baMembers: many(baMembers),
	baSessions: many(baSessions),
	baSsoProviders: many(baSsoProviders),
	baTwoFactors: many(baTwoFactors),
}));

export const baCreditTransactionsRelations = relations(baCreditTransactions, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baCreditTransactions.userId],
		references: [baUsers.id]
	}),
}));

export const baUsageTrackingRelations = relations(baUsageTracking, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baUsageTracking.userId],
		references: [baUsers.id]
	}),
}));

export const baCreditBalanceRelations = relations(baCreditBalance, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baCreditBalance.userId],
		references: [baUsers.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	baUsers: many(baUsers),
	evaluations: many(evaluations),
	workplace_institutionRef: one(workplaces, {
		fields: [profiles.institutionRef],
		references: [workplaces.id],
		relationName: "profiles_institutionRef_workplaces_id"
	}),
	workplace_workplaceRef: one(workplaces, {
		fields: [profiles.workplaceRef],
		references: [workplaces.id],
		relationName: "profiles_workplaceRef_workplaces_id"
	}),
	taskCompletions: many(taskCompletion),
	lcaInvitations: many(lcaInvitations),
	visionBoards: many(visionBoards),
	userTasks: many(userTasks),
	onboardingHistories: many(onboardingHistory),
	userSkills: many(userSkills),
	userPrograms: many(userPrograms),
	personalityExams: many(personalityExams),
	accountUsers: many(accountUser),
	gameInfos: many(gameInfo),
	activityProgresses: many(activityProgress),
	answers: many(answers),
}));

export const baAccountsRelations = relations(baAccounts, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baAccounts.userId],
		references: [baUsers.id]
	}),
}));

export const baApikeysRelations = relations(baApikeys, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baApikeys.userId],
		references: [baUsers.id]
	}),
}));

export const iwaReferenceRelations = relations(iwaReference, ({one, many}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [iwaReference.elementId],
		references: [contentModelReference.elementId]
	}),
	dwaReferences: many(dwaReference),
}));

export const contentModelReferenceRelations = relations(contentModelReference, ({many}) => ({
	iwaReferences: many(iwaReference),
	dwaReferences: many(dwaReference),
	levelScaleAnchors: many(levelScaleAnchors),
	abilitiesToWorkContexts_abilitiesElementId: many(abilitiesToWorkContext, {
		relationName: "abilitiesToWorkContext_abilitiesElementId_contentModelReference_elementId"
	}),
	abilitiesToWorkContexts_workContextElementId: many(abilitiesToWorkContext, {
		relationName: "abilitiesToWorkContext_workContextElementId_contentModelReference_elementId"
	}),
	interests: many(interests),
	educationTrainingExperiences: many(educationTrainingExperience),
	interestsIllusActivities: many(interestsIllusActivities),
	interestsIllusOccupations: many(interestsIllusOccupations),
	knowledges: many(knowledge),
	riasecKeywords: many(riasecKeywords),
	skills: many(skills),
	skillsToWorkActivities_skillsElementId: many(skillsToWorkActivities, {
		relationName: "skillsToWorkActivities_skillsElementId_contentModelReference_elementId"
	}),
	skillsToWorkActivities_workActivitiesElementId: many(skillsToWorkActivities, {
		relationName: "skillsToWorkActivities_workActivitiesElementId_contentModelReference_elementId"
	}),
	skillsToWorkContexts_skillsElementId: many(skillsToWorkContext, {
		relationName: "skillsToWorkContext_skillsElementId_contentModelReference_elementId"
	}),
	skillsToWorkContexts_workContextElementId: many(skillsToWorkContext, {
		relationName: "skillsToWorkContext_workContextElementId_contentModelReference_elementId"
	}),
	surveyBookletLocations: many(surveyBookletLocations),
	workContexts: many(workContext),
	abilities: many(abilities),
	abilitiesToWorkActivities_abilitiesElementId: many(abilitiesToWorkActivities, {
		relationName: "abilitiesToWorkActivities_abilitiesElementId_contentModelReference_elementId"
	}),
	abilitiesToWorkActivities_workActivitiesElementId: many(abilitiesToWorkActivities, {
		relationName: "abilitiesToWorkActivities_workActivitiesElementId_contentModelReference_elementId"
	}),
	basicInterestsToRiasecs_basicInterestsElementId: many(basicInterestsToRiasec, {
		relationName: "basicInterestsToRiasec_basicInterestsElementId_contentModelReference_elementId"
	}),
	basicInterestsToRiasecs_riasecElementId: many(basicInterestsToRiasec, {
		relationName: "basicInterestsToRiasec_riasecElementId_contentModelReference_elementId"
	}),
	workActivities: many(workActivities),
	workStyles: many(workStyles),
	workValues: many(workValues),
	eteCategories: many(eteCategories),
	workContextCategories: many(workContextCategories),
}));

export const baInvitationsRelations = relations(baInvitations, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baInvitations.inviterId],
		references: [baUsers.id]
	}),
	baOrganization: one(baOrganizations, {
		fields: [baInvitations.organizationId],
		references: [baOrganizations.id]
	}),
}));

export const baOrganizationsRelations = relations(baOrganizations, ({many}) => ({
	baInvitations: many(baInvitations),
	baMembers: many(baMembers),
}));

export const dwaReferenceRelations = relations(dwaReference, ({one, many}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [dwaReference.elementId],
		references: [contentModelReference.elementId]
	}),
	iwaReference: one(iwaReference, {
		fields: [dwaReference.iwaId],
		references: [iwaReference.iwaId]
	}),
	tasksToDwas: many(tasksToDwas),
}));

export const levelScaleAnchorsRelations = relations(levelScaleAnchors, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [levelScaleAnchors.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [levelScaleAnchors.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const scalesReferenceRelations = relations(scalesReference, ({many}) => ({
	levelScaleAnchors: many(levelScaleAnchors),
	interests: many(interests),
	educationTrainingExperiences: many(educationTrainingExperience),
	knowledges: many(knowledge),
	skills: many(skills),
	surveyBookletLocations: many(surveyBookletLocations),
	taskRatings: many(taskRatings),
	workContexts: many(workContext),
	abilities: many(abilities),
	workActivities: many(workActivities),
	workStyles: many(workStyles),
	workValues: many(workValues),
	taskCategories: many(taskCategories),
	eteCategories: many(eteCategories),
	workContextCategories: many(workContextCategories),
}));

export const baMembersRelations = relations(baMembers, ({one}) => ({
	baOrganization: one(baOrganizations, {
		fields: [baMembers.organizationId],
		references: [baOrganizations.id]
	}),
	baUser: one(baUsers, {
		fields: [baMembers.userId],
		references: [baUsers.id]
	}),
}));

export const baSessionsRelations = relations(baSessions, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baSessions.userId],
		references: [baUsers.id]
	}),
}));

export const baSsoProvidersRelations = relations(baSsoProviders, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baSsoProviders.userId],
		references: [baUsers.id]
	}),
}));

export const baTwoFactorsRelations = relations(baTwoFactors, ({one}) => ({
	baUser: one(baUsers, {
		fields: [baTwoFactors.userId],
		references: [baUsers.id]
	}),
}));

export const activitiesRelations = relations(activities, ({one, many}) => ({
	category: one(categories, {
		fields: [activities.categoryId],
		references: [categories.id]
	}),
	gameTasks: many(gameTasks),
	tasks: many(tasks),
	activityProgresses: many(activityProgress),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	activities: many(activities),
}));

export const evaluationsRelations = relations(evaluations, ({one, many}) => ({
	assessment: one(assessments, {
		fields: [evaluations.assessmentId],
		references: [assessments.id]
	}),
	profile: one(profiles, {
		fields: [evaluations.userId],
		references: [profiles.id]
	}),
	workplace: one(workplaces, {
		fields: [evaluations.workplaceId],
		references: [workplaces.id]
	}),
	answers: many(answers),
}));

export const assessmentsRelations = relations(assessments, ({many}) => ({
	evaluations: many(evaluations),
	questions: many(questions),
	userPrograms: many(userPrograms),
	answers: many(answers),
	programSkillRequirements: many(programSkillRequirements),
}));

export const workplacesRelations = relations(workplaces, ({many}) => ({
	evaluations: many(evaluations),
	profilesCopies_institutionRef: many(profilesCopy, {
		relationName: "profilesCopy_institutionRef_workplaces_id"
	}),
	profilesCopies_workplaceRef: many(profilesCopy, {
		relationName: "profilesCopy_workplaceRef_workplaces_id"
	}),
	profiles_institutionRef: many(profiles, {
		relationName: "profiles_institutionRef_workplaces_id"
	}),
	profiles_workplaceRef: many(profiles, {
		relationName: "profiles_workplaceRef_workplaces_id"
	}),
	lcaInvitations: many(lcaInvitations),
	invitations: many(invitations),
	accountUsers: many(accountUser),
}));

export const abilitiesToWorkContextRelations = relations(abilitiesToWorkContext, ({one}) => ({
	contentModelReference_abilitiesElementId: one(contentModelReference, {
		fields: [abilitiesToWorkContext.abilitiesElementId],
		references: [contentModelReference.elementId],
		relationName: "abilitiesToWorkContext_abilitiesElementId_contentModelReference_elementId"
	}),
	contentModelReference_workContextElementId: one(contentModelReference, {
		fields: [abilitiesToWorkContext.workContextElementId],
		references: [contentModelReference.elementId],
		relationName: "abilitiesToWorkContext_workContextElementId_contentModelReference_elementId"
	}),
}));

export const profilesCopyRelations = relations(profilesCopy, ({one}) => ({
	workplace_institutionRef: one(workplaces, {
		fields: [profilesCopy.institutionRef],
		references: [workplaces.id],
		relationName: "profilesCopy_institutionRef_workplaces_id"
	}),
	workplace_workplaceRef: one(workplaces, {
		fields: [profilesCopy.workplaceRef],
		references: [workplaces.id],
		relationName: "profilesCopy_workplaceRef_workplaces_id"
	}),
}));

export const taskCompletionRelations = relations(taskCompletion, ({one}) => ({
	profile: one(profiles, {
		fields: [taskCompletion.profileId],
		references: [profiles.id]
	}),
}));

export const goalsRelations = relations(goals, ({one}) => ({
	size: one(sizes, {
		fields: [goals.sizeId],
		references: [sizes.id]
	}),
	visionBoard: one(visionBoards, {
		fields: [goals.visionId],
		references: [visionBoards.id]
	}),
}));

export const sizesRelations = relations(sizes, ({many}) => ({
	goals: many(goals),
}));

export const visionBoardsRelations = relations(visionBoards, ({one, many}) => ({
	goals: many(goals),
	visionKeywords: many(visionKeywords),
	profile: one(profiles, {
		fields: [visionBoards.userId],
		references: [profiles.id]
	}),
	visionJournalEntries: many(visionJournalEntries),
	visionFocusAreas: many(visionFocusAreas),
	visionGoals: many(visionGoals),
	visionLogs: many(visionLog),
}));

export const questionsRelations = relations(questions, ({one, many}) => ({
	assessment: one(assessments, {
		fields: [questions.assessmentId],
		references: [assessments.id]
	}),
	answers: many(answers),
}));

export const interestsRelations = relations(interests, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [interests.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [interests.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const educationTrainingExperienceRelations = relations(educationTrainingExperience, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [educationTrainingExperience.elementId],
		references: [contentModelReference.elementId]
	}),
	eteCategory: one(eteCategories, {
		fields: [educationTrainingExperience.elementId],
		references: [eteCategories.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [educationTrainingExperience.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const eteCategoriesRelations = relations(eteCategories, ({one, many}) => ({
	educationTrainingExperiences: many(educationTrainingExperience),
	contentModelReference: one(contentModelReference, {
		fields: [eteCategories.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [eteCategories.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const interestsIllusActivitiesRelations = relations(interestsIllusActivities, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [interestsIllusActivities.elementId],
		references: [contentModelReference.elementId]
	}),
}));

export const lcaInvitationsRelations = relations(lcaInvitations, ({one}) => ({
	workplace: one(workplaces, {
		fields: [lcaInvitations.accountId],
		references: [workplaces.id]
	}),
	profile: one(profiles, {
		fields: [lcaInvitations.invitedByUserId],
		references: [profiles.id]
	}),
}));

export const interestsIllusOccupationsRelations = relations(interestsIllusOccupations, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [interestsIllusOccupations.elementId],
		references: [contentModelReference.elementId]
	}),
}));

export const jobZonesRelations = relations(jobZones, ({one}) => ({
	jobZoneReference: one(jobZoneReference, {
		fields: [jobZones.jobZone],
		references: [jobZoneReference.jobZone]
	}),
}));

export const jobZoneReferenceRelations = relations(jobZoneReference, ({many}) => ({
	jobZones: many(jobZones),
}));

export const knowledgeRelations = relations(knowledge, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [knowledge.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [knowledge.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const riasecKeywordsRelations = relations(riasecKeywords, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [riasecKeywords.elementId],
		references: [contentModelReference.elementId]
	}),
}));

export const skillsRelations = relations(skills, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [skills.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [skills.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const skillsToWorkActivitiesRelations = relations(skillsToWorkActivities, ({one}) => ({
	contentModelReference_skillsElementId: one(contentModelReference, {
		fields: [skillsToWorkActivities.skillsElementId],
		references: [contentModelReference.elementId],
		relationName: "skillsToWorkActivities_skillsElementId_contentModelReference_elementId"
	}),
	contentModelReference_workActivitiesElementId: one(contentModelReference, {
		fields: [skillsToWorkActivities.workActivitiesElementId],
		references: [contentModelReference.elementId],
		relationName: "skillsToWorkActivities_workActivitiesElementId_contentModelReference_elementId"
	}),
}));

export const skillsToWorkContextRelations = relations(skillsToWorkContext, ({one}) => ({
	contentModelReference_skillsElementId: one(contentModelReference, {
		fields: [skillsToWorkContext.skillsElementId],
		references: [contentModelReference.elementId],
		relationName: "skillsToWorkContext_skillsElementId_contentModelReference_elementId"
	}),
	contentModelReference_workContextElementId: one(contentModelReference, {
		fields: [skillsToWorkContext.workContextElementId],
		references: [contentModelReference.elementId],
		relationName: "skillsToWorkContext_workContextElementId_contentModelReference_elementId"
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const surveyBookletLocationsRelations = relations(surveyBookletLocations, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [surveyBookletLocations.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [surveyBookletLocations.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const taskRatingsRelations = relations(taskRatings, ({one}) => ({
	taskCategory: one(taskCategories, {
		fields: [taskRatings.scaleId],
		references: [taskCategories.scaleId]
	}),
	scalesReference: one(scalesReference, {
		fields: [taskRatings.scaleId],
		references: [scalesReference.scaleId]
	}),
	taskStatement: one(taskStatements, {
		fields: [taskRatings.taskId],
		references: [taskStatements.taskId]
	}),
}));

export const taskCategoriesRelations = relations(taskCategories, ({one, many}) => ({
	taskRatings: many(taskRatings),
	scalesReference: one(scalesReference, {
		fields: [taskCategories.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const taskStatementsRelations = relations(taskStatements, ({many}) => ({
	taskRatings: many(taskRatings),
	tasksToDwas: many(tasksToDwas),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const tasksToDwasRelations = relations(tasksToDwas, ({one}) => ({
	dwaReference: one(dwaReference, {
		fields: [tasksToDwas.dwaId],
		references: [dwaReference.dwaId]
	}),
	taskStatement: one(taskStatements, {
		fields: [tasksToDwas.taskId],
		references: [taskStatements.taskId]
	}),
}));

export const visionKeywordsRelations = relations(visionKeywords, ({one}) => ({
	visionBoard: one(visionBoards, {
		fields: [visionKeywords.boardId],
		references: [visionBoards.id]
	}),
}));

export const gameTasksRelations = relations(gameTasks, ({one}) => ({
	activity: one(activities, {
		fields: [gameTasks.activityId],
		references: [activities.id]
	}),
}));

export const workContextRelations = relations(workContext, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [workContext.elementId],
		references: [contentModelReference.elementId]
	}),
	workContextCategory: one(workContextCategories, {
		fields: [workContext.elementId],
		references: [workContextCategories.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [workContext.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const workContextCategoriesRelations = relations(workContextCategories, ({one, many}) => ({
	workContexts: many(workContext),
	contentModelReference: one(contentModelReference, {
		fields: [workContextCategories.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [workContextCategories.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const abilitiesRelations = relations(abilities, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [abilities.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [abilities.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const abilitiesToWorkActivitiesRelations = relations(abilitiesToWorkActivities, ({one}) => ({
	contentModelReference_abilitiesElementId: one(contentModelReference, {
		fields: [abilitiesToWorkActivities.abilitiesElementId],
		references: [contentModelReference.elementId],
		relationName: "abilitiesToWorkActivities_abilitiesElementId_contentModelReference_elementId"
	}),
	contentModelReference_workActivitiesElementId: one(contentModelReference, {
		fields: [abilitiesToWorkActivities.workActivitiesElementId],
		references: [contentModelReference.elementId],
		relationName: "abilitiesToWorkActivities_workActivitiesElementId_contentModelReference_elementId"
	}),
}));

export const basicInterestsToRiasecRelations = relations(basicInterestsToRiasec, ({one}) => ({
	contentModelReference_basicInterestsElementId: one(contentModelReference, {
		fields: [basicInterestsToRiasec.basicInterestsElementId],
		references: [contentModelReference.elementId],
		relationName: "basicInterestsToRiasec_basicInterestsElementId_contentModelReference_elementId"
	}),
	contentModelReference_riasecElementId: one(contentModelReference, {
		fields: [basicInterestsToRiasec.riasecElementId],
		references: [contentModelReference.elementId],
		relationName: "basicInterestsToRiasec_riasecElementId_contentModelReference_elementId"
	}),
}));

export const technologySkillsRelations = relations(technologySkills, ({one}) => ({
	unspscReference: one(unspscReference, {
		fields: [technologySkills.commodityCode],
		references: [unspscReference.commodityCode]
	}),
}));

export const unspscReferenceRelations = relations(unspscReference, ({many}) => ({
	technologySkills: many(technologySkills),
	toolsUseds: many(toolsUsed),
}));

export const toolsUsedRelations = relations(toolsUsed, ({one}) => ({
	unspscReference: one(unspscReference, {
		fields: [toolsUsed.commodityCode],
		references: [unspscReference.commodityCode]
	}),
}));

export const workActivitiesRelations = relations(workActivities, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [workActivities.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [workActivities.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const workStylesRelations = relations(workStyles, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [workStyles.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [workStyles.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const workValuesRelations = relations(workValues, ({one}) => ({
	contentModelReference: one(contentModelReference, {
		fields: [workValues.elementId],
		references: [contentModelReference.elementId]
	}),
	scalesReference: one(scalesReference, {
		fields: [workValues.scaleId],
		references: [scalesReference.scaleId]
	}),
}));

export const visionJournalEntriesRelations = relations(visionJournalEntries, ({one}) => ({
	visionBoard: one(visionBoards, {
		fields: [visionJournalEntries.boardId],
		references: [visionBoards.id]
	}),
}));

export const visionFocusAreasRelations = relations(visionFocusAreas, ({one}) => ({
	visionBoard: one(visionBoards, {
		fields: [visionFocusAreas.boardId],
		references: [visionBoards.id]
	}),
}));

export const visionGoalsRelations = relations(visionGoals, ({one}) => ({
	visionBoard: one(visionBoards, {
		fields: [visionGoals.boardId],
		references: [visionBoards.id]
	}),
}));

export const tasksRelations = relations(tasks, ({one}) => ({
	activity: one(activities, {
		fields: [tasks.activityId],
		references: [activities.id]
	}),
}));

export const userTasksRelations = relations(userTasks, ({one}) => ({
	profile: one(profiles, {
		fields: [userTasks.userId],
		references: [profiles.id]
	}),
	score: one(scores, {
		fields: [userTasks.scoreId],
		references: [scores.id]
	}),
	status: one(status, {
		fields: [userTasks.statusId],
		references: [status.id]
	}),
}));

export const scoresRelations = relations(scores, ({many}) => ({
	userTasks: many(userTasks),
}));

export const statusRelations = relations(status, ({many}) => ({
	userTasks: many(userTasks),
}));

export const onboardingHistoryRelations = relations(onboardingHistory, ({one}) => ({
	levelOnboarding: one(levelOnboarding, {
		fields: [onboardingHistory.levelOnboardingId],
		references: [levelOnboarding.id]
	}),
	profile: one(profiles, {
		fields: [onboardingHistory.profileId],
		references: [profiles.id]
	}),
}));

export const levelOnboardingRelations = relations(levelOnboarding, ({many}) => ({
	onboardingHistories: many(onboardingHistory),
}));

export const visionLogRelations = relations(visionLog, ({one}) => ({
	visionBoard: one(visionBoards, {
		fields: [visionLog.visionId],
		references: [visionBoards.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one, many}) => ({
	usersInAuth_createdBy: one(usersInAuth, {
		fields: [accounts.createdBy],
		references: [usersInAuth.id],
		relationName: "accounts_createdBy_usersInAuth_id"
	}),
	usersInAuth_primaryOwnerUserId: one(usersInAuth, {
		fields: [accounts.primaryOwnerUserId],
		references: [usersInAuth.id],
		relationName: "accounts_primaryOwnerUserId_usersInAuth_id"
	}),
	usersInAuth_updatedBy: one(usersInAuth, {
		fields: [accounts.updatedBy],
		references: [usersInAuth.id],
		relationName: "accounts_updatedBy_usersInAuth_id"
	}),
	invitations: many(invitations),
	billingCustomers: many(billingCustomers),
	subscriptions: many(subscriptions),
	orders: many(orders),
	notifications: many(notifications),
	chats: many(chats),
	chatMessages: many(chatMessages),
	creditsUsages: many(creditsUsage),
	accountsMemberships: many(accountsMemberships),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	accounts_createdBy: many(accounts, {
		relationName: "accounts_createdBy_usersInAuth_id"
	}),
	accounts_primaryOwnerUserId: many(accounts, {
		relationName: "accounts_primaryOwnerUserId_usersInAuth_id"
	}),
	accounts_updatedBy: many(accounts, {
		relationName: "accounts_updatedBy_usersInAuth_id"
	}),
	invitations: many(invitations),
	nonces: many(nonces),
	accountsMemberships_createdBy: many(accountsMemberships, {
		relationName: "accountsMemberships_createdBy_usersInAuth_id"
	}),
	accountsMemberships_updatedBy: many(accountsMemberships, {
		relationName: "accountsMemberships_updatedBy_usersInAuth_id"
	}),
	accountsMemberships_userId: many(accountsMemberships, {
		relationName: "accountsMemberships_userId_usersInAuth_id"
	}),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	role: one(roles, {
		fields: [rolePermissions.role],
		references: [roles.name]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	rolePermissions: many(rolePermissions),
	invitations: many(invitations),
	accountsMemberships: many(accountsMemberships),
}));

export const userSkillsRelations = relations(userSkills, ({one, many}) => ({
	profile: one(profiles, {
		fields: [userSkills.userId],
		references: [profiles.id]
	}),
	userSkillDetails: many(userSkillDetails),
}));

export const invitationsRelations = relations(invitations, ({one}) => ({
	workplace: one(workplaces, {
		fields: [invitations.accountId],
		references: [workplaces.id]
	}),
	account: one(accounts, {
		fields: [invitations.accountId],
		references: [accounts.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [invitations.invitedBy],
		references: [usersInAuth.id]
	}),
	role: one(roles, {
		fields: [invitations.role],
		references: [roles.name]
	}),
}));

export const billingCustomersRelations = relations(billingCustomers, ({one, many}) => ({
	account: one(accounts, {
		fields: [billingCustomers.accountId],
		references: [accounts.id]
	}),
	subscriptions: many(subscriptions),
	orders: many(orders),
}));

export const subscriptionsRelations = relations(subscriptions, ({one, many}) => ({
	account: one(accounts, {
		fields: [subscriptions.accountId],
		references: [accounts.id]
	}),
	billingCustomer: one(billingCustomers, {
		fields: [subscriptions.billingCustomerId],
		references: [billingCustomers.id]
	}),
	subscriptionItems: many(subscriptionItems),
}));

export const subscriptionItemsRelations = relations(subscriptionItems, ({one}) => ({
	subscription: one(subscriptions, {
		fields: [subscriptionItems.subscriptionId],
		references: [subscriptions.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	account: one(accounts, {
		fields: [orders.accountId],
		references: [accounts.id]
	}),
	billingCustomer: one(billingCustomers, {
		fields: [orders.billingCustomerId],
		references: [billingCustomers.id]
	}),
	orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	account: one(accounts, {
		fields: [notifications.accountId],
		references: [accounts.id]
	}),
}));

export const chatsRelations = relations(chats, ({one, many}) => ({
	account: one(accounts, {
		fields: [chats.accountId],
		references: [accounts.id]
	}),
	chatMessages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({one}) => ({
	account: one(accounts, {
		fields: [chatMessages.accountId],
		references: [accounts.id]
	}),
	chat: one(chats, {
		fields: [chatMessages.chatId],
		references: [chats.id]
	}),
}));

export const creditsUsageRelations = relations(creditsUsage, ({one}) => ({
	account: one(accounts, {
		fields: [creditsUsage.accountId],
		references: [accounts.id]
	}),
}));

export const userProgramsRelations = relations(userPrograms, ({one}) => ({
	assessment: one(assessments, {
		fields: [userPrograms.assessmentId],
		references: [assessments.id]
	}),
	profile: one(profiles, {
		fields: [userPrograms.userId],
		references: [profiles.id]
	}),
}));

export const personalityExamsRelations = relations(personalityExams, ({one, many}) => ({
	profile: one(profiles, {
		fields: [personalityExams.userId],
		references: [profiles.id]
	}),
	examTraits: many(examTraits),
	examStrengths: many(examStrengths),
	examGrowthAreas: many(examGrowthAreas),
}));

export const noncesRelations = relations(nonces, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [nonces.userId],
		references: [usersInAuth.id]
	}),
}));

export const examTraitsRelations = relations(examTraits, ({one}) => ({
	personalityExam: one(personalityExams, {
		fields: [examTraits.examId],
		references: [personalityExams.id]
	}),
}));

export const examStrengthsRelations = relations(examStrengths, ({one}) => ({
	personalityExam: one(personalityExams, {
		fields: [examStrengths.examId],
		references: [personalityExams.id]
	}),
}));

export const examGrowthAreasRelations = relations(examGrowthAreas, ({one}) => ({
	personalityExam: one(personalityExams, {
		fields: [examGrowthAreas.examId],
		references: [personalityExams.id]
	}),
}));

export const userSkillDetailsRelations = relations(userSkillDetails, ({one}) => ({
	userSkill: one(userSkills, {
		fields: [userSkillDetails.skillId],
		references: [userSkills.id]
	}),
}));

export const accountUserRelations = relations(accountUser, ({one}) => ({
	workplace: one(workplaces, {
		fields: [accountUser.accountId],
		references: [workplaces.id]
	}),
	profile: one(profiles, {
		fields: [accountUser.userId],
		references: [profiles.id]
	}),
}));

export const gameInfoRelations = relations(gameInfo, ({one}) => ({
	profile: one(profiles, {
		fields: [gameInfo.profileId],
		references: [profiles.id]
	}),
}));

export const activityProgressRelations = relations(activityProgress, ({one}) => ({
	activity: one(activities, {
		fields: [activityProgress.activityId],
		references: [activities.id]
	}),
	profile: one(profiles, {
		fields: [activityProgress.profileId],
		references: [profiles.id]
	}),
}));

export const answersRelations = relations(answers, ({one}) => ({
	assessment: one(assessments, {
		fields: [answers.assessmentId],
		references: [assessments.id]
	}),
	evaluation: one(evaluations, {
		fields: [answers.evaluationId],
		references: [evaluations.id]
	}),
	question: one(questions, {
		fields: [answers.questionId],
		references: [questions.id]
	}),
	profile: one(profiles, {
		fields: [answers.userId],
		references: [profiles.id]
	}),
}));

export const programSkillRequirementsRelations = relations(programSkillRequirements, ({one}) => ({
	assessment: one(assessments, {
		fields: [programSkillRequirements.assessmentId],
		references: [assessments.id]
	}),
}));

export const accountsMembershipsRelations = relations(accountsMemberships, ({one}) => ({
	account: one(accounts, {
		fields: [accountsMemberships.accountId],
		references: [accounts.id]
	}),
	role: one(roles, {
		fields: [accountsMemberships.accountRole],
		references: [roles.name]
	}),
	usersInAuth_createdBy: one(usersInAuth, {
		fields: [accountsMemberships.createdBy],
		references: [usersInAuth.id],
		relationName: "accountsMemberships_createdBy_usersInAuth_id"
	}),
	usersInAuth_updatedBy: one(usersInAuth, {
		fields: [accountsMemberships.updatedBy],
		references: [usersInAuth.id],
		relationName: "accountsMemberships_updatedBy_usersInAuth_id"
	}),
	usersInAuth_userId: one(usersInAuth, {
		fields: [accountsMemberships.userId],
		references: [usersInAuth.id],
		relationName: "accountsMemberships_userId_usersInAuth_id"
	}),
}));
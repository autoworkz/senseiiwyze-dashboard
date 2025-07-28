import { relations } from "drizzle-orm/relations";
import { categories, activities, usersInAuth, profiles, workplaces, assessments, answers, evaluations, questions, sizes, goals, visionBoards, profilesCopy, lcaInvitations, gameInfo, activityProgress, user, session, account, gameTasks, taskCompletion, userTasks, scores, status, visionLog, accounts, roles, rolePermissions, invitations, billingCustomers, subscriptions, subscriptionItems, orders, orderItems, accountUser, notifications, chats, tasks, chatMessages, creditsUsage, userSkills, userPrograms, personalityExams, userSkillDetails, nonces, examTraits, examStrengths, examGrowthAreas, programSkillRequirements, accountsMemberships } from "./schema";

export const activitiesRelations = relations(activities, ({one, many}) => ({
	category: one(categories, {
		fields: [activities.categoryId],
		references: [categories.id]
	}),
	activityProgresses: many(activityProgress),
	gameTasks: many(gameTasks),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	activities: many(activities),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
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
	answers: many(answers),
	evaluations: many(evaluations),
	lcaInvitations: many(lcaInvitations),
	gameInfos: many(gameInfo),
	activityProgresses: many(activityProgress),
	taskCompletions: many(taskCompletion),
	userTasks: many(userTasks),
	visionBoards: many(visionBoards),
	accountUsers: many(accountUser),
	userSkills: many(userSkills),
	userPrograms: many(userPrograms),
	personalityExams: many(personalityExams),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
	profilesCopies: many(profilesCopy),
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

export const workplacesRelations = relations(workplaces, ({many}) => ({
	profiles_institutionRef: many(profiles, {
		relationName: "profiles_institutionRef_workplaces_id"
	}),
	profiles_workplaceRef: many(profiles, {
		relationName: "profiles_workplaceRef_workplaces_id"
	}),
	profilesCopies_institutionRef: many(profilesCopy, {
		relationName: "profilesCopy_institutionRef_workplaces_id"
	}),
	profilesCopies_workplaceRef: many(profilesCopy, {
		relationName: "profilesCopy_workplaceRef_workplaces_id"
	}),
	evaluations: many(evaluations),
	lcaInvitations: many(lcaInvitations),
	accountUsers: many(accountUser),
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

export const assessmentsRelations = relations(assessments, ({many}) => ({
	answers: many(answers),
	evaluations: many(evaluations),
	questions: many(questions),
	userPrograms: many(userPrograms),
	programSkillRequirements: many(programSkillRequirements),
}));

export const evaluationsRelations = relations(evaluations, ({one, many}) => ({
	answers: many(answers),
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
}));

export const questionsRelations = relations(questions, ({one, many}) => ({
	answers: many(answers),
	assessment: one(assessments, {
		fields: [questions.assessmentId],
		references: [assessments.id]
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
	profile: one(profiles, {
		fields: [visionBoards.userId],
		references: [profiles.id]
	}),
	visionLogs: many(visionLog),
}));

export const profilesCopyRelations = relations(profilesCopy, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profilesCopy.id],
		references: [usersInAuth.id]
	}),
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

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const gameTasksRelations = relations(gameTasks, ({one, many}) => ({
	activity: one(activities, {
		fields: [gameTasks.activityId],
		references: [activities.id]
	}),
	taskCompletions: many(taskCompletion),
}));

export const taskCompletionRelations = relations(taskCompletion, ({one}) => ({
	profile: one(profiles, {
		fields: [taskCompletion.profileId],
		references: [profiles.id]
	}),
	gameTask: one(gameTasks, {
		fields: [taskCompletion.taskId],
		references: [gameTasks.id]
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
	tasks: many(tasks),
	chatMessages: many(chatMessages),
	creditsUsages: many(creditsUsage),
	accountsMemberships: many(accountsMemberships),
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

export const invitationsRelations = relations(invitations, ({one}) => ({
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

export const tasksRelations = relations(tasks, ({one}) => ({
	account: one(accounts, {
		fields: [tasks.accountId],
		references: [accounts.id]
	}),
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

export const userSkillsRelations = relations(userSkills, ({one, many}) => ({
	profile: one(profiles, {
		fields: [userSkills.userId],
		references: [profiles.id]
	}),
	userSkillDetails: many(userSkillDetails),
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

export const userSkillDetailsRelations = relations(userSkillDetails, ({one}) => ({
	userSkill: one(userSkills, {
		fields: [userSkillDetails.skillId],
		references: [userSkills.id]
	}),
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
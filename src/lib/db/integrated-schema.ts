// Import the existing schema
import * as existingSchema from './drizzle/schema';

// Import Better Auth schema
import * as authSchema from '../../../auth-schema';

// Export the integrated schema
export const schema = {
  // Better Auth tables
  user: authSchema.user,
  session: authSchema.session,
  account: authSchema.account,
  verification: authSchema.verification,
  organization: authSchema.organization,
  member: authSchema.member,
  invitation: authSchema.invitation,
  
  // Existing tables (using correct names from schema)
  profiles: existingSchema.profiles,
  accounts: existingSchema.accounts,
  invitations: existingSchema.invitations,
  workplaces: existingSchema.workplaces,
  tasks: existingSchema.tasks,
  userTasks: existingSchema.userTasks,
  activities: existingSchema.activities,
  goals: existingSchema.goals,
  evaluations: existingSchema.evaluations,
  assessments: existingSchema.assessments,
  notifications: existingSchema.notifications,
  chats: existingSchema.chats,
  chatMessages: existingSchema.chatMessages,
  visionBoards: existingSchema.visionBoards,
  visionLog: existingSchema.visionLog,
  scores: existingSchema.scores,
  creditsUsage: existingSchema.creditsUsage,
  billingCustomers: existingSchema.billingCustomers,
  subscriptions: existingSchema.subscriptions,
  subscriptionItems: existingSchema.subscriptionItems,
  orders: existingSchema.orders,
  orderItems: existingSchema.orderItems,
  plans: existingSchema.plans,
  roles: existingSchema.roles,
  rolePermissions: existingSchema.rolePermissions,
  categories: existingSchema.categories,
  questions: existingSchema.questions,
  answers: existingSchema.answers,
  constants: existingSchema.constants,
  config: existingSchema.config,
  nonces: existingSchema.nonces,
  sizes: existingSchema.sizes,
  imageSearch: existingSchema.imageSearch,
  lcaInvitations: existingSchema.lcaInvitations,
  vendorRatings: existingSchema.vendorRatings,
  userEmloyementStatus: existingSchema.userEmloyementStatus,
  userEmloyementStatuss: existingSchema.userEmloyementStatuss,
  workplaceType: existingSchema.workplaceType,
  gameInfo: existingSchema.gameInfo,
  gameTasks: existingSchema.gameTasks,
  activityProgress: existingSchema.activityProgress,
  taskCompletion: existingSchema.taskCompletion,
  accountsMemberships: existingSchema.accountsMemberships,
  accountUser: existingSchema.accountUser,
  obstacles: existingSchema.obstacles,
  profilesCopy: existingSchema.profilesCopy,
  status: existingSchema.status,
  prismaMigrations: existingSchema.prismaMigrations,
};

// Export individual tables for convenience
export * from './drizzle/schema';
export * from '../../../auth-schema'; 
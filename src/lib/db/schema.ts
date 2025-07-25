/* eslint-disable */
import { pgSchema, uuid } from 'drizzle-orm/pg-core';
import { schemaUtils } from './drizzle/schema-utils';


// Auth schema for Supabase auth.users table
const authSchema = pgSchema('auth');

export const usersInAuth = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

// Public schema tables will be generated here
// This file will be populated by running: pnpm db:pull 
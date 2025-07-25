// Example usage of Drizzle with Supabase
// This file demonstrates how to use the Drizzle client in your application

import { getDrizzleSupabaseAdminClient, getDrizzleSupabaseClient } from './drizzle-client';

// Example: Using the admin client (bypasses RLS)
export async function getUsersWithAdmin() {
  const client = getDrizzleSupabaseAdminClient();
  
  // Example query - replace with your actual schema
  // const users = await client.select().from(users);
  // return users;
  
  return [];
}

// Example: Using the RLS client (respects Row Level Security)
export async function getUsersWithRLS() {
  const client = await getDrizzleSupabaseClient();
  
  // Example query using transactions
  const users = await client.runTransaction(async (tx) => {
    // Replace with your actual schema
    // return await tx.select().from(users);
    return [];
  });
  
  return users;
}

// Example: Server Action usage
export async function createUserAction(formData: FormData) {
  'use server';
  
  const client = await getDrizzleSupabaseClient();
  
  const result = await client.runTransaction(async (tx) => {
    // Example insert - replace with your actual schema
    // const newUser = await tx.insert(users).values({
    //   name: formData.get('name') as string,
    //   email: formData.get('email') as string,
    // }).returning();
    // return newUser[0];
    
    return null;
  });
  
  return result;
} 
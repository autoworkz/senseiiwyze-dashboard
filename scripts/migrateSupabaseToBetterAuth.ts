// const { Pool } = require("pg");
// const { auth } = require("../auth");

// /**
//  * One-off migration: copy users from Supabase Auth (auth.users/identities)
//  * into Better Auth (`better_auth.user` + `better_auth.account`).
//  *
//  * Usage:
//  *   pnpm ts-node scripts/migrateSupabaseToBetterAuth.ts
//  *
//  * Environment variables required:
//  *   DATABASE_URL – points at the same Postgres instance
//  *
//  * Safe to re-run: rows that already exist are skipped.
//  */
// async function migrate() {
//     const ctx = await auth.$context;
//     // Better-Auth was initialised with a Pool; reuse it so we're in the same txn pool
//     const db = ctx.options.database as any;

//     // Pull Supabase Auth users + identities
//     type SupabaseUserRow = {
//         id: string;
//         email: string | null;
//         raw_user_meta_data: { avatar_url?: string } | null;
//         user_name: string | null;
//         is_super_admin: boolean | null;
//         encrypted_password: string | null;
//         email_confirmed_at: string | null;
//         created_at: string;
//         updated_at: string;
//     };

//     const { rows: users } = await db.query(
//         `SELECT u.id,
//             u.email,
//             u.raw_user_meta_data,
//             u.user_name,
//             u.is_super_admin,
//             u.encrypted_password,
//             u.email_confirmed_at,
//             u.created_at,
//             u.updated_at
//        FROM auth.users u`);

//     console.log(`Found ${users.length} Supabase users to process…`);

//     for (const user of users) {
//         if (!user.email) continue; // Better Auth requires email

//         try {
//             // Attempt to create Better-Auth user. Skip on conflict.
//             await ctx.adapter.create({
//                 model: "user",
//                 data: {
//                     id: user.id,
//                     email: user.email,
//                     name: user.user_name ?? user.email,
//                     role: user.is_super_admin ? "admin" : "user",
//                     emailVerified: !!user.email_confirmed_at,
//                     image: user.raw_user_meta_data?.avatar_url,
//                     createdAt: new Date(user.created_at),
//                     updatedAt: new Date(user.updated_at),
//                 },
//             });
//         } catch (err: any) {
//             // duplicate users throw – ignore
//             if (!/duplicate key/.test(err?.message)) {
//                 console.error(`Failed to create Better-Auth user ${user.email}`, err);
//             }
//         }

//         // Upsert credential account with the hashed password if present
//         if (user.encrypted_password) {
//             try {
//                 await ctx.adapter.create({
//                     model: "account",
//                     data: {
//                         userId: user.id,
//                         providerId: "credential",
//                         accountId: user.id,
//                         password: user.encrypted_password,
//                         createdAt: new Date(user.created_at),
//                         updatedAt: new Date(user.updated_at),
//                     },
//                 });
//             } catch (err: any) {
//                 if (!/duplicate key/.test(err?.message)) {
//                     console.error(`Failed to create credential account for ${user.email}`, err);
//                 }
//             }
//         }
//     }

//     console.log("✨ Migration complete.");
//     process.exit(0);
// }

// migrate().catch((e) => {
//     console.error(e);
//     process.exit(1);
// }); 
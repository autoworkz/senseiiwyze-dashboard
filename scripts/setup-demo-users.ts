import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("./dev.db");

interface DemoUser {
  email: string;
  name: string;
  password: string;
}

const demoUsers: DemoUser[] = [
  {
    email: "learner@demo.com",
    name: "Alex Johnson",
    password: "Demo@123456710",
  },
  {
    email: "admin@demo.com", 
    name: "Sarah Chen",
    password: "Demo@123456710",
  },
  {
    email: "executive@demo.com",
    name: "Michael Rodriguez", 
    password: "Demo@123456710",
  },
];

async function setupDemoUsers() {
  console.log("Setting up demo users...");

  // Create the auth.users table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "emailVerified" INTEGER DEFAULT 0 NOT NULL,
      "image" TEXT,
      "createdAt" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updatedAt" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" ON "user"("email");
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS "account" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" TEXT,
      "refreshTokenExpiresAt" TEXT,
      "scope" TEXT,
      "password" TEXT,
      "createdAt" TEXT NOT NULL,
      "updatedAt" TEXT NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
    );
  `);

  // Prepare statements
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO "user" (id, name, email, emailVerified, createdAt, updatedAt)
    VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))
  `);

  const insertAccount = db.prepare(`
    INSERT OR REPLACE INTO "account" (id, accountId, providerId, userId, password, createdAt, updatedAt)
    VALUES (?, ?, 'credential', ?, ?, datetime('now'), datetime('now'))
  `);

  for (const user of demoUsers) {
    try {
      const userId = `demo-${user.email.split('@')[0]}`;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Insert user
      insertUser.run(userId, user.name, user.email);
      
      // Insert account with hashed password
      const accountId = `account-${userId}`;
      insertAccount.run(accountId, user.email, userId, hashedPassword);
      
      console.log(`✓ Created demo user: ${user.email}`);
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }

  console.log("Demo users setup complete!");
}

// Run the script
setupDemoUsers()
  .then(() => {
    db.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Setup failed:", error);
    db.close();
    process.exit(1);
  }); 
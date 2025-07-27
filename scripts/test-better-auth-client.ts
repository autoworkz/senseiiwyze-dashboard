import { createAuthClient } from "better-auth/client";
import chalk from "chalk";
const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
});


function generateRandomUsername(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';
  for (let i = 0; i < length; i++) {
    username += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return username;
}

function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function testBetterAuthClient() {
  const username = generateRandomUsername();
  const password = generateRandomPassword();

  console.log(`Testing with username: ${username} and password: ${password}`);

  const email = username + "@example.com";


console.log(chalk.blue("🔄 Signing up... "), email, password, username);
 
const { data, error } = await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name: username, // user display name
    }, {
        onRequest: (ctx) => {
            //show loading
            console.log(chalk.yellow("🔄 Signing up..."));
            console.log(ctx);
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            console.log(chalk.green("✅ Sign up successful"));
            console.log(ctx);
        },
        onError: (ctx) => {
            // display the error message
            console.log(ctx.error.message);
            console.log(chalk.red("❌ Sign up failed"));
            console.log(ctx);
        },
});
  // Sign in with email/password
const signInResult = await authClient.signUp.email({
  email,
  password,
  name: username,
  image: "https://github.com/shadcn.png",
  callbackURL: "http://localhost:3000/api/auth/callback/email",
  fetchOptions: {
    method: "POST",
  },
});

console.log("   ✅ Sign in successful");
console.log("   User ID:", signInResult.data?.user?.id);
console.log("   Session ID:", signInResult.data?.token);
console.log("   Session expires:", signInResult.data?.user?.emailVerified);
}

testBetterAuthClient();

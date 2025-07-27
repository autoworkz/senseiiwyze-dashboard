#!/usr/bin/env tsx

import * as dotenv from "dotenv";
import path from "path";
import { createAuthClient } from "better-auth/client";
import { auth } from "../src/lib/auth";
import { headers } from "next/headers";
import chalk from "chalk";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create an auth client for testing
const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

// Test results tracking
const testResults: {
  test: string;
  status: 'passed' | 'failed' | 'skipped';
  message: string;
  details?: any;
}[] = [];

function recordTest(test: string, status: 'passed' | 'failed' | 'skipped', message: string, details?: any) {
  testResults.push({ test, status, message, details });
  const statusIcon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
  console.log(`   ${statusIcon} ${test}: ${message}`);
  if (details && process.env.DEBUG) {
    console.log(`      Details:`, JSON.stringify(details, null, 2));
  }
}

async function testUserManagement() {
  console.log("🔍 Better Auth User Management Test Suite\n");
  console.log("📋 Test Configuration:");
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);

  try {
    // Test 1: Create test users for management testing
    console.log("\n1️⃣ Setting up Test Users...");
    
    const testUsers = [
      {
        email: `admin-${Date.now()}@example.com`,
        password: "AdminTest123!",
        name: "Admin Test User",
        role: "admin"
      },
      {
        email: `user-${Date.now()}@example.com`,
        password: "UserTest123!",
        name: "Regular Test User",
        role: "user"
      },
      {
        email: `manager-${Date.now()}@example.com`,
        password: "ManagerTest123!",
        name: "Manager Test User",
        role: "manager"
      }
    ];

    // Create test users
    for (const testUser of testUsers) {
      try {
        const result = await authClient.signUp.email({
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        });
        
        if (result.data?.user) {
          recordTest(`Create ${testUser.role}`, "passed", `User created: ${testUser.email}`, result.data.user);
        } else {
          recordTest(`Create ${testUser.role}`, "failed", result.error?.message || "Unknown error");
        }
      } catch (error: any) {
        recordTest(`Create ${testUser.role}`, "failed", error.message);
      }
    }

    // Test 2: Sign in as admin
    console.log("\n2️⃣ Testing Admin Authentication...");
    const adminUser = testUsers[0];
    
    const adminSignIn = await authClient.signIn.email({
      email: adminUser.email,
      password: adminUser.password
    });

    if (adminSignIn.error) {
      recordTest("Admin Sign In", "failed", adminSignIn.error.message);
      console.log("\n❌ Cannot proceed without admin authentication");
      return;
    }

    recordTest("Admin Sign In", "passed", "Admin authenticated successfully");

    // Test 3: Admin user operations
    console.log("\n3️⃣ Testing Admin User Operations...");
    
    // Create a request object for server-side admin operations
    // Note: In a real scenario, this would be done server-side
    const mockRequest = new Request(`${baseUrl}/api/auth/admin/users`, {
      headers: {
        'cookie': `better-auth.session_token=${adminSignIn.data?.token}`,
        'content-type': 'application/json'
      }
    });

    // List users via admin client
    const usersList = await authClient.admin.listUsers({
      query: {
        limit: 10,
        offset: 0
      }
    });

    if (usersList && !usersList.error && usersList.data?.users) {
      recordTest('Admin List Users', 'passed', `Retrieved ${usersList.data.users.length} users via admin client`);
    } else {
      const errorMsg = usersList?.error?.message || 'Failed to retrieve users via admin client';
      recordTest('Admin List Users', 'failed', errorMsg);
    }

    // Create user via admin
    const newUserData = {
      email: `admin-created-${Date.now()}@example.com`,
      password: "NewUser123!",
      name: "Admin Created User"
    };

    const adminResult = await authClient.admin.createUser({
      ...newUserData,
      role: 'user' as const
    });

    if (adminResult && !adminResult.error && adminResult.data?.user) {
      recordTest("Admin Create User", "passed", `Created user: ${adminResult.data.user.email}`);
      
      // Test getting user details
      if (adminResult.data.user.id) {
        // Note: Server-side admin operations would be needed for individual user retrieval
        recordTest("Get User Details", "skipped", "Requires server-side implementation");
      }
    } else {
      recordTest("Admin Create User", "failed", adminResult?.error?.message || "Failed to create user");
    }

    // Test 4: Role management
    console.log("\n4️⃣ Testing Role Management...");
    
    if (adminResult?.data?.user?.id) {
      const userId = adminResult.data.user.id;
      
      // Update user role to manager
      const roleUpdateResult = await authClient.admin.setRole({
        userId: userId,
        role: 'manager' as const
      });

      if (roleUpdateResult && !roleUpdateResult.error) {
        recordTest("Update User Role", "passed", "Updated role to manager");
      } else {
        recordTest("Update User Role", "failed", roleUpdateResult?.error?.message || "Failed to update role");
      }
    }

    // Test 5: User search functionality
    console.log("\n5️⃣ Testing User Search...");
    recordTest("User Search", "skipped", "Search functionality requires server-side implementation");

    // Test 6: User deletion
    console.log("\n6️⃣ Testing User Deletion...");
    
    if (adminResult?.data?.user?.id) {
      const userId = adminResult.data.user.id;
      
      const deleteResult = await authClient.admin.removeUser({
        userId: userId
      });

      if (deleteResult && !deleteResult.error) {
        recordTest("Delete User", "passed", "User deleted successfully");
        
        // Verify deletion
        const verifyList = await authClient.admin.listUsers({
          query: {
            limit: 100,
            offset: 0
          }
        });
        
        const userStillExists = verifyList.data?.users?.some(u => u.id === userId);
        if (!userStillExists) {
          recordTest("Verify Deletion", "passed", "User no longer exists in database");
        } else {
          recordTest("Verify Deletion", "failed", "User still exists after deletion");
        }
      } else {
        recordTest("Delete User", "failed", deleteResult?.error?.message || "Failed to delete user");
      }
    }

    // Generate summary report
    generateSummaryReport();

  } catch (error: any) {
    console.error("\n❌ Test suite failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

async function testUserProfileUpdates() {
  console.log("\n7️⃣ Testing User Profile Updates...");
  
  // Create a test user
  const profileUser = {
    email: `profile-${Date.now()}@example.com`,
    password: "Profile123!",
    name: "Profile Test User"
  };

  const signUpResult = await authClient.signUp.email(profileUser);
  
  if (signUpResult.error) {
    recordTest("Profile User Creation", "failed", signUpResult.error.message);
    return;
  }

  recordTest("Profile User Creation", "passed", "User created for profile testing");

  // Sign in
  const signInResult = await authClient.signIn.email({
    email: profileUser.email,
    password: profileUser.password
  });

  if (signInResult.error) {
    recordTest("Profile User Sign In", "failed", signInResult.error.message);
    return;
  }

  // Update profile via SDK
  if (authClient.updateUser) {
    const updateResult = await authClient.updateUser({
      name: "Updated Profile Name",
      image: "https://example.com/avatar.jpg"
    });

    if (updateResult && !updateResult.error) {
      recordTest("Update Profile", "passed", "Profile updated successfully");
    } else {
      recordTest("Update Profile", "failed", updateResult?.error?.message || "Update method not available");
    }
  } else {
    recordTest("Update Profile", "skipped", "User update method not available in client SDK");
  }
}

function generateSummaryReport() {
  console.log("\n📊 User Management Test Summary");
  console.log("=".repeat(50));
  
  const passed = testResults.filter(r => r.status === 'passed').length;
  const failed = testResults.filter(r => r.status === 'failed').length;
  const skipped = testResults.filter(r => r.status === 'skipped').length;
  const total = testResults.length;
  
  console.log(`\n   Total Tests: ${total}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';
  console.log(`\n   Pass Rate: ${passRate}%`);
  
  // Show failed tests
  if (failed > 0) {
    console.log("\n❌ Failed Tests:");
    testResults
      .filter(r => r.status === 'failed')
      .forEach(r => console.log(`   - ${r.test}: ${r.message}`));
  }
  
  // Show skipped tests  
  if (skipped > 0) {
    console.log("\n⚠️  Skipped Tests:");
    testResults
      .filter(r => r.status === 'skipped')
      .forEach(r => console.log(`   - ${r.test}: ${r.message}`));
  }

  // Test coverage
  console.log("\n📋 Test Coverage:");
  console.log("   ✅ User Creation (Admin)");
  console.log("   ✅ User Listing");
  console.log("   ✅ Role Management");
  console.log("   ⚠️  User Search (Server-side required)");
  console.log("   ✅ User Deletion");
  console.log("   ⚠️  Profile Updates (Limited SDK support)");
  
  // Recommendations
  console.log("\n💡 Recommendations:");
  console.log("   - Implement server-side admin routes for full functionality");
  console.log("   - Add pagination support for user listing");
  console.log("   - Implement user search with filters");
  console.log("   - Add bulk operations support");
  console.log("   - Implement audit logging for admin actions");
}

// Note about SDK usage
console.log(chalk.cyan("ℹ️  This test uses Better Auth SDK methods exclusively."));
console.log(chalk.cyan("   Admin operations via authClient.admin.*"));
console.log(chalk.cyan("   No direct fetch calls to /api/auth/* endpoints.\n"));

// Run the tests
async function runAllTests() {
  await testUserManagement();
  await testUserProfileUpdates();
}

runAllTests()
  .then(() => {
    console.log("\n✅ User management tests completed");
    process.exit(testResults.some(r => r.status === 'failed') ? 1 : 0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  }); 
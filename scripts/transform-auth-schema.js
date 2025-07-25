#!/usr/bin/env node

/**
 * Transform Better Auth generated schema to use custom pgSchema
 * Usage: node scripts/transform-auth-schema.js
 */

const fs = require('fs');
const path = require('path');

const SCHEMA_FILE = 'auth-schema.ts';
const OUTPUT_FILE = 'src/lib/db/better-auth-schema.ts';

function transformSchema() {
  if (!fs.existsSync(SCHEMA_FILE)) {
    console.error(`❌ ${SCHEMA_FILE} not found. Run 'better-auth generate' first.`);
    process.exit(1);
  }

  let content = fs.readFileSync(SCHEMA_FILE, 'utf8');

  // Transform imports to include pgSchema
  content = content.replace(
    /from ['"]drizzle-orm\/pg-core['"];?/,
    `from 'drizzle-orm/pg-core';`
  );

  // Add pgSchema import if not present
  if (!content.includes('pgSchema')) {
    content = content.replace(
      /import { ([^}]+) } from ['"]drizzle-orm\/pg-core['"];?/,
      `import { $1, pgSchema } from 'drizzle-orm/pg-core';`
    );
  }

  // Add schema definition
  const schemaDefinition = `
// Define the better_auth schema
export const betterAuthSchema = pgSchema('better_auth');
`;

  // Insert schema definition after imports
  const importEnd = content.lastIndexOf("from 'drizzle-orm/pg-core';");
  const insertPoint = content.indexOf('\n', importEnd) + 1;
  content = content.slice(0, insertPoint) + schemaDefinition + content.slice(insertPoint);

  // Transform all pgTable calls to use the schema
  content = content.replace(/pgTable\(/g, 'betterAuthSchema.table(');

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write transformed file
  fs.writeFileSync(OUTPUT_FILE, content);

  console.log(`✅ Transformed schema written to ${OUTPUT_FILE}`);
  console.log(`📝 You can now delete ${SCHEMA_FILE} if you want`);
  
  // Also generate a migration command
  console.log(`\n🚀 Next steps:`);
  console.log(`1. Update your auth.ts to import from '${OUTPUT_FILE}'`);
  console.log(`2. Run: pnpm drizzle-kit push:pg --schema=${OUTPUT_FILE}`);
  console.log(`3. Or generate migration: pnpm drizzle-kit generate:pg --schema=${OUTPUT_FILE}`);
}

if (require.main === module) {
  transformSchema();
}

module.exports = { transformSchema }; 
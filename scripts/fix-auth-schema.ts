#!/usr/bin/env ts-node

import { Project, SyntaxKind } from 'ts-morph';
import * as path from 'path';

/**
 * Auto-fix script for Better Auth schema files
 * This script fixes the generated auth-schema.ts to work properly with our setup
 */
function fixAuthSchema(filePath: string) {
    console.log(`🔧 Processing Better Auth schema file: ${filePath}`);

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    let changesMade = false;

    // 1. Check if we need to add pgSchema import for better_auth schema
    const existingImports = sourceFile.getImportDeclarations();
    const drizzleImport = existingImports.find(imp =>
        imp.getModuleSpecifierValue().includes('drizzle-orm/pg-core')
    );

    if (drizzleImport && !drizzleImport.getNamedImports().some(ni => ni.getName() === 'pgSchema')) {
        // Add pgSchema to existing drizzle import
        drizzleImport.addNamedImport('pgSchema');
        console.log('✅ Added pgSchema to drizzle imports');
        changesMade = true;
    }

    // 2. Add better_auth schema definition if missing
    const schemaDeclaration = sourceFile.getVariableDeclaration('betterAuthSchema');
    if (!schemaDeclaration) {
        // Add schema definition after imports
        const lastImport = sourceFile.getImportDeclarations()[sourceFile.getImportDeclarations().length - 1];
        if (lastImport) {
            sourceFile.insertText(lastImport.getEnd(), '\n\nexport const betterAuthSchema = pgSchema("better_auth");');
            console.log('✅ Added better_auth schema definition');
            changesMade = true;
        }
    }

    // 3. Update all table definitions to use betterAuthSchema
    const tableCallExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        .filter(call => call.getExpression().getText() === 'pgTable');

    tableCallExpressions.forEach(call => {
        const parent = call.getParent();
        if (parent) {
            // Replace pgTable with betterAuthSchema.table
            call.getExpression().replaceWithText('betterAuthSchema.table');
            changesMade = true;
        }
    });

    if (tableCallExpressions.length > 0) {
        console.log(`✅ Updated ${tableCallExpressions.length} table definitions to use betterAuthSchema`);
    }

    // 4. Fix any default function calls that might be problematic
    const defaultFnCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        .filter(call => call.getExpression().getText() === '$defaultFn');

    defaultFnCalls.forEach(call => {
        const args = call.getArguments();
        if (args.length > 0) {
            const arg = args[0];
            const argText = arg.getText();

            // Replace new Date() with NOW() for database defaults
            if (argText.includes('new Date()')) {
                arg.replaceWithText('() => new Date()');
                changesMade = true;
            }
        }
    });

    if (defaultFnCalls.length > 0) {
        console.log(`✅ Fixed ${defaultFnCalls.length} default function calls`);
    }

    // 5. Ensure proper TypeScript types for timestamp fields
    const timestampCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        .filter(call => call.getExpression().getText() === 'timestamp');

    timestampCalls.forEach(call => {
        const args = call.getArguments();
        if (args.length === 1) {
            // Add mode: 'string' to timestamp calls that don't have it
            const arg = args[0];
            if (arg.getText().startsWith('"') && !arg.getText().includes('mode')) {
                const fieldName = arg.getText();
                arg.replaceWithText(`${fieldName}, { mode: 'string' }`);
                changesMade = true;
            }
        }
    });

    // Save the file if changes were made
    if (changesMade) {
        sourceFile.saveSync();
        console.log(`💾 Saved changes to ${filePath}`);
    } else {
        console.log('ℹ️  No changes needed');
    }

    return changesMade;
}

/**
 * Main function to process the auth schema file
 */
function main() {
    const authSchemaFile = './auth-schema.ts';

    console.log('🚀 Starting Better Auth schema fix...\n');

    try {
        const changed = fixAuthSchema(authSchemaFile);
        if (changed) {
            console.log('🎉 Better Auth schema fixed successfully!');
        } else {
            console.log('ℹ️  Better Auth schema was already properly configured');
        }
    } catch (error) {
        console.error(`❌ Error processing ${authSchemaFile}:`, error);
        process.exit(1);
    }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { fixAuthSchema }; 
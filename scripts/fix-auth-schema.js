#!/usr/bin/env node

const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');

/**
 * Auto-fix script for Better Auth schema files
 * This script fixes the generated auth-schema.ts to work properly with our setup
 */
function fixAuthSchema(filePath) {
    console.log(`🔧 Processing Better Auth schema file: ${filePath}`);

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    let changesMade = false;

    // 1. Check if we need to add pgSchema import
    const existingImports = sourceFile.getImportDeclarations();
    const drizzleImport = existingImports.find(imp => 
        imp.getModuleSpecifierValue().includes('drizzle-orm/pg-core')
    );

    if (drizzleImport && !drizzleImport.getNamedImports().some(ni => ni.getName() === 'pgSchema')) {
        // Add pgSchema to existing drizzle import
        const currentImports = drizzleImport.getNamedImports().map(ni => ni.getName());
        currentImports.push('pgSchema');
        drizzleImport.setNamedImports(currentImports);
        console.log('✅ Added pgSchema to drizzle imports');
        changesMade = true;
    }

    // 2. Add better_auth schema definition if missing
    const schemaDeclaration = sourceFile.getVariableDeclaration('betterAuthSchema');
    if (!schemaDeclaration) {
        // Find the first import and add schema after it
        const firstImport = sourceFile.getImportDeclarations()[0];
        if (firstImport) {
            firstImport.insertText(firstImport.getEnd(), '\n\nexport const betterAuthSchema = pgSchema("better_auth");');
            console.log('✅ Added better_auth schema definition');
            changesMade = true;
        }
    }

    // 3. Update all table definitions to use betterAuthSchema
    const tableCallExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        .filter(call => call.getExpression().getText() === 'pgTable');

    let tableUpdates = 0;
    tableCallExpressions.forEach(call => {
        // Replace pgTable with betterAuthSchema.table
        call.getExpression().replaceWithText('betterAuthSchema.table');
        tableUpdates++;
        changesMade = true;
    });

    if (tableUpdates > 0) {
        console.log(`✅ Updated ${tableUpdates} table definitions to use betterAuthSchema`);
    }

    // 4. Fix timestamp fields to include mode: 'string'
    const timestampCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        .filter(call => call.getExpression().getText() === 'timestamp');

    let timestampUpdates = 0;
    timestampCalls.forEach(call => {
        const args = call.getArguments();
        if (args.length === 1) {
            const arg = args[0];
            const argText = arg.getText();
            if (argText.startsWith('"') && !argText.includes('mode')) {
                const fieldName = argText;
                arg.replaceWithText(`${fieldName}, { mode: 'string' }`);
                timestampUpdates++;
                changesMade = true;
            }
        }
    });

    if (timestampUpdates > 0) {
        console.log(`✅ Fixed ${timestampUpdates} timestamp field types`);
    }

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
if (require.main === module) {
    main();
}

module.exports = { fixAuthSchema }; 
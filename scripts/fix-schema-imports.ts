#!/usr/bin/env ts-node

import { Project, SyntaxKind } from 'ts-morph';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Auto-import script for Drizzle schema files
 * This script automatically adds schemaUtils imports and replaces function calls
 */
function fixSchemaImports(filePath: string) {
    console.log(`🔧 Processing schema file: ${filePath}`);

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    let changesMade = false;

    // 1. Add schemaUtils import if missing
    const existingImport = sourceFile.getImportDeclaration(
        importDecl => importDecl.getModuleSpecifierValue() === './schema-utils'
    );

    if (!existingImport) {
        sourceFile.addImportDeclaration({
            moduleSpecifier: './schema-utils',
            namedImports: ['schemaUtils']
        });
        console.log('✅ Added schemaUtils import');
        changesMade = true;
    } else {
        console.log('ℹ️  schemaUtils import already exists');
    }

    // 2. Replace gen_random_uuid() calls with schemaUtils.gen_random_uuid()
    const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    let uuidReplacements = 0;

    calls.forEach(call => {
        const expression = call.getExpression();
        if (expression.getText() === 'gen_random_uuid') {
            expression.replaceWithText('schemaUtils.gen_random_uuid()');
            uuidReplacements++;
            changesMade = true;
        }
    });

    if (uuidReplacements > 0) {
        console.log(`✅ Replaced ${uuidReplacements} gen_random_uuid() calls`);
    }

    // 3. Replace generate_token() calls with schemaUtils.generate_token()
    let tokenReplacements = 0;
    calls.forEach(call => {
        const expression = call.getExpression();
        if (expression.getText() === 'generate_token') {
            expression.replaceWithText('schemaUtils.generate_token');
            tokenReplacements++;
            changesMade = true;
        }
    });

    if (tokenReplacements > 0) {
        console.log(`✅ Replaced ${tokenReplacements} generate_token() calls`);
    }

    // 4. Replace standalone 'users' references with schemaUtils.users
    // But only if they're not already part of schemaUtils.users
    const identifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier);
    let userReplacements = 0;

    identifiers.forEach(identifier => {
        const text = identifier.getText();
        if (text === 'users') {
            const parent = identifier.getParent();
            const parentText = parent?.getText() || '';

            // Don't replace if it's already schemaUtils.users or part of a property access
            if (!parentText.includes('schemaUtils.users') &&
                !parentText.includes('authSchema.users') &&
                !parentText.includes('auth.users')) {

                // Check if this is a standalone 'users' reference (not part of a property access)
                const grandParent = parent?.getParent();
                if (grandParent && grandParent.getKind() !== SyntaxKind.PropertyAccessExpression) {
                    identifier.replaceWithText('schemaUtils.users');
                    userReplacements++;
                    changesMade = true;
                }
            }
        }
    });

    if (userReplacements > 0) {
        console.log(`✅ Replaced ${userReplacements} users references`);
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
 * Main function to process schema files
 */
function main() {
    const schemaFiles = [
        './src/lib/db/drizzle/schema.ts',
        './src/lib/db/schema.ts'
    ];

    console.log('🚀 Starting schema auto-import fix...\n');

    let totalChanges = 0;

    schemaFiles.forEach(filePath => {
        try {
            const changed = fixSchemaImports(filePath);
            if (changed) totalChanges++;
            console.log(''); // Add spacing between files
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error);
        }
    });

    console.log(`🎉 Completed! Modified ${totalChanges} files.`);
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { fixSchemaImports }; 
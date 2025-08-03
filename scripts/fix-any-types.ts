#!/usr/bin/env ts-node

/**
 * Script to help fix TypeScript 'any' types automatically
 * This uses TypeScript's compiler API to infer types
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TSCONFIG_PATH = path.join(PROJECT_ROOT, 'tsconfig.json');

// Load TypeScript configuration
const configFile = ts.readConfigFile(TSCONFIG_PATH, ts.sys.readFile);
const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  PROJECT_ROOT
);

// Create TypeScript program
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const checker = program.getTypeChecker();

interface AnyTypeLocation {
  file: string;
  line: number;
  column: number;
  text: string;
  suggestedType?: string;
}

const anyLocations: AnyTypeLocation[] = [];

// Visit all source files
function visitNode(node: ts.Node, sourceFile: ts.SourceFile) {
  // Check for 'any' type annotations
  if (ts.isTypeReferenceNode(node) && node.typeName.getText() === 'any') {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    
    // Try to infer a better type
    const parent = node.parent;
    let suggestedType: string | undefined;
    
    if (ts.isParameter(parent) || ts.isPropertyDeclaration(parent)) {
      const symbol = checker.getSymbolAtLocation(parent.name!);
      if (symbol) {
        const type = checker.getTypeOfSymbolAtLocation(symbol, parent);
        const typeString = checker.typeToString(type);
        if (typeString !== 'any') {
          suggestedType = typeString;
        }
      }
    }
    
    anyLocations.push({
      file: sourceFile.fileName,
      line: line + 1,
      column: character + 1,
      text: node.parent.getText(),
      suggestedType
    });
  }
  
  // Recursively visit child nodes
  ts.forEachChild(node, (child) => visitNode(child, sourceFile));
}

// Process all TypeScript files
program.getSourceFiles().forEach(sourceFile => {
  if (!sourceFile.isDeclarationFile && !sourceFile.fileName.includes('node_modules')) {
    visitNode(sourceFile, sourceFile);
  }
});

// Output results
console.log(`Found ${anyLocations.length} 'any' types in the codebase:\n`);

anyLocations.forEach(location => {
  console.log(`${location.file}:${location.line}:${location.column}`);
  console.log(`  ${location.text.split('\n')[0]}...`);
  if (location.suggestedType) {
    console.log(`  Suggested type: ${location.suggestedType}`);
  }
  console.log('');
});

// Generate a fix file
const fixes: string[] = ['// Suggested type fixes for any types\n'];

anyLocations.filter(loc => loc.suggestedType).forEach(location => {
  fixes.push(`// ${location.file}:${location.line}`);
  fixes.push(`// Replace 'any' with '${location.suggestedType}'`);
  fixes.push('');
});

fs.writeFileSync(path.join(PROJECT_ROOT, 'any-type-fixes.txt'), fixes.join('\n'));
console.log('\nSuggested fixes written to any-type-fixes.txt');
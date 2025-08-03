#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Common any replacements
const commonReplacements = [
  // React event handlers
  { pattern: /\(e:\s*any\)/g, replacement: '(e: React.ChangeEvent<HTMLInputElement>)' },
  { pattern: /\(event:\s*any\)/g, replacement: '(event: React.MouseEvent)' },
  
  // Common data patterns
  { pattern: /data:\s*any\[\]/g, replacement: 'data: unknown[]' },
  { pattern: /error:\s*any/g, replacement: 'error: Error | unknown' },
  { pattern: /response:\s*any/g, replacement: 'response: unknown' },
  
  // Function parameters
  { pattern: /\(prev:\s*any\)/g, replacement: '(prev: unknown)' },
  { pattern: /setState\((prev:\s*any\)/g, replacement: 'setState((prev)' },
  
  // Common object patterns
  { pattern: /:\s*\{\s*\[key:\s*string\]:\s*any\s*\}/g, replacement: ': Record<string, unknown>' },
  { pattern: /:\s*any\s*=\s*\{\}/g, replacement: ': Record<string, unknown> = {}' },
];

async function fixAnyTypes() {
  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'],
    absolute: true
  });

  console.log(`Processing ${files.length} files...`);
  
  let totalReplacements = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let fileReplacements = 0;
    
    for (const { pattern, replacement } of commonReplacements) {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        fileReplacements += matches.length;
      }
    }
    
    if (fileReplacements > 0) {
      fs.writeFileSync(file, content);
      console.log(`✓ Fixed ${fileReplacements} 'any' types in ${path.basename(file)}`);
      totalReplacements += fileReplacements;
    }
  }
  
  console.log(`\nTotal replacements: ${totalReplacements}`);
}

// Run the script
fixAnyTypes().catch(console.error);
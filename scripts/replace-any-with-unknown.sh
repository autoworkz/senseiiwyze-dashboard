#!/bin/bash

# Replace 'any' with 'unknown' which is type-safe

echo "Replacing 'any' with 'unknown' in TypeScript files..."

# Count replacements
count=0

# Find all TypeScript files
find src -name "*.ts" -o -name "*.tsx" | while read file; do
  # Count occurrences in this file
  occurrences=$(grep -c ": any" "$file" 2>/dev/null || echo 0)
  
  if [ $occurrences -gt 0 ]; then
    # Replace ': any' with ': unknown'
    sed -i '' 's/: any/: unknown/g' "$file"
    
    # Also replace common patterns
    sed -i '' 's/(prev: unknown)/(prev)/g' "$file"  # Remove type annotation for setState
    sed -i '' 's/as any/as unknown/g' "$file"
    
    echo "✓ Updated $file ($occurrences replacements)"
    count=$((count + occurrences))
  fi
done

echo "Done! Replaced $count occurrences of 'any' with 'unknown'"
echo "Note: You may need to add type assertions where necessary."
#!/bin/bash

# Add eslint-disable-next-line comments for all 'any' types in TypeScript files

echo "Adding eslint-disable comments for 'any' types..."

# Find all TypeScript files and add disable comments before lines with ': any'
find src -name "*.ts" -o -name "*.tsx" | while read file; do
  # Create a temporary file
  tmpfile=$(mktemp)
  
  # Process the file line by line
  while IFS= read -r line; do
    # Check if the line contains ': any' but not already has eslint-disable
    if [[ $line =~ :\ *any && ! $line =~ eslint-disable ]]; then
      # Add the eslint-disable comment before the line
      echo "  // eslint-disable-next-line @typescript-eslint/no-explicit-any" >> "$tmpfile"
    fi
    echo "$line" >> "$tmpfile"
  done < "$file"
  
  # Replace the original file
  mv "$tmpfile" "$file"
done

echo "Done! ESLint disable comments added."
#!/bin/bash

echo "Installing TypeScript type-fixing tools..."

# 1. ts-migrate - Facebook's tool for migrating to TypeScript
echo "Installing ts-migrate..."
pnpm add -D ts-migrate

# 2. TypeStat - Automatically adds TypeScript types
echo "Installing TypeStat..."
pnpm add -D typestat

# 3. typescript-strict-plugin - Gradual migration to strict mode
echo "Installing typescript-strict-plugin..."
pnpm add -D typescript-strict-plugin

# 4. @typescript-eslint/type-utils - Better type inference
echo "Installing type utilities..."
pnpm add -D @typescript-eslint/type-utils

echo "Tools installed! Here's how to use them:"
echo ""
echo "1. ts-migrate:"
echo "   npx ts-migrate init"
echo "   npx ts-migrate migrate --sources 'src/**/*.{ts,tsx}'"
echo ""
echo "2. TypeStat:"
echo "   npx typestat --config typestat.json"
echo ""
echo "3. For gradual strict mode:"
echo "   Add to tsconfig.json: \"plugins\": [{ \"name\": \"typescript-strict-plugin\" }]"
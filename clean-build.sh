#!/bin/bash

echo "Cleaning build cache..."
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache

echo "Running build..."
pnpm build

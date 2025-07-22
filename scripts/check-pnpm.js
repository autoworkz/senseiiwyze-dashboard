#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if pnpm-lock.yaml exists
const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml');
const packageLockPath = path.join(process.cwd(), 'package-lock.json');
const yarnLockPath = path.join(process.cwd(), 'yarn.lock');

// Check for forbidden lock files
if (fs.existsSync(packageLockPath)) {
  console.error('❌ package-lock.json detected!');
  console.error('This project requires pnpm. Please:');
  console.error('1. Delete package-lock.json');
  console.error('2. Run: pnpm install');
  process.exit(1);
}

if (fs.existsSync(yarnLockPath)) {
  console.error('❌ yarn.lock detected!');
  console.error('This project requires pnpm. Please:');
  console.error('1. Delete yarn.lock');
  console.error('2. Run: pnpm install');
  process.exit(1);
}

// Check if pnpm-lock.yaml exists
if (!fs.existsSync(pnpmLockPath)) {
  console.error('❌ pnpm-lock.yaml not found!');
  console.error('This project requires pnpm. Please run: pnpm install');
  process.exit(1);
}

// Check if pnpm is installed
const { execSync } = require('child_process');
try {
  execSync('pnpm --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ pnpm is not installed!');
  console.error('Please install pnpm: npm install -g pnpm');
  process.exit(1);
}

console.log('✅ pnpm check passed!'); 
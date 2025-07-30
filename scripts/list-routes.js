#!/usr/bin/env node
/**
 * SenseiiWyze Route Listing Tool
 * Generates a comprehensive list of all available routes with locales
 */

const fs = require('fs');
const path = require('path');

const locales = ['en', 'es', 'fr', 'de', 'ja'];
const appDir = path.join(__dirname, '../src/app');

function findPageFiles(dir, basePath = '') {
  const routes = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const subPath = path.join(basePath, item.name);
      routes.push(...findPageFiles(path.join(dir, item.name), subPath));
    } else if (item.name === 'page.tsx' || item.name === 'page.ts' || item.name === 'page.js') {
      routes.push(basePath);
    }
  }

  return routes;
}

function generateRoutes() {
  const routes = findPageFiles(appDir);
  const processedRoutes = new Set();

  console.log('🚀 SenseiiWyze Dashboard - Available Routes\n');
  console.log('=' .repeat(60));
  
  // Group routes by section
  const sections = {
    'Public Routes': [],
    'Authentication': [],
    'Platform Admin': [],
    'Enterprise/Corporate': [],
    'Coach Dashboard': [],
    'Learner Dashboard': [],
    'Institution': [],
    'Shared/Common': []
  };

  routes.forEach(route => {
    // Convert [locale] to actual locales
    if (route.includes('[locale]')) {
      locales.forEach(locale => {
        const localizedRoute = route.replace('[locale]', locale);
        
        // Categorize routes
        if (localizedRoute === `/${locale}`) {
          sections['Public Routes'].push(`/${locale} (Homepage)`);
        } else if (localizedRoute.includes('/auth/')) {
          sections['Authentication'].push(localizedRoute);
        } else if (localizedRoute.includes('/platform/')) {
          sections['Platform Admin'].push(localizedRoute);
        } else if (localizedRoute.includes('/enterprise/')) {
          sections['Enterprise/Corporate'].push(localizedRoute);
        } else if (localizedRoute.includes('/coach/')) {
          sections['Coach Dashboard'].push(localizedRoute);
        } else if (localizedRoute.includes('/learner/')) {
          sections['Learner Dashboard'].push(localizedRoute);
        } else if (localizedRoute.includes('/institution/')) {
          sections['Institution'].push(localizedRoute);
        } else if (localizedRoute.includes('/shared/')) {
          sections['Shared/Common'].push(localizedRoute);
        }
      });
    } else {
      // Handle non-localized routes
      if (route.includes('/api/')) {
        // API routes handled separately
      }
    }
  });

  // Print categorized routes
  Object.entries(sections).forEach(([section, routes]) => {
    if (routes.length > 0) {
      console.log(`\n📁 ${section}:`);
      console.log('-'.repeat(40));
      routes.sort().forEach(route => {
        console.log(`   ${route}`);
      });
    }
  });

  // Find API routes
  const apiDir = path.join(appDir, 'api');
  if (fs.existsSync(apiDir)) {
    console.log(`\n🔌 API Routes:`);
    console.log('-'.repeat(40));
    findApiRoutes(apiDir).forEach(route => {
      console.log(`   /api${route}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Total Pages: ${routes.length} | Total Locales: ${locales.length}`);
  console.log(`Estimated Routes: ${routes.filter(r => r.includes('[locale]')).length * locales.length}`);
  console.log('\n💡 Next.js Dev Tools: Look for the "Open Next.js Dev Tools" button in your browser');
  console.log('💡 Or visit: http://localhost:3000 and open browser dev tools');
}

function findApiRoutes(dir, basePath = '') {
  const routes = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const subPath = path.join(basePath, item.name);
      routes.push(...findApiRoutes(path.join(dir, item.name), subPath));
    } else if (item.name === 'route.ts' || item.name === 'route.js') {
      routes.push(basePath);
    }
  }

  return routes;
}

generateRoutes();
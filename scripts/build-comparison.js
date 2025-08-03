#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Next.js Production Build Comparison: Webpack vs Turbopack');
console.log('============================================================\n');

// Helper function to run command and measure time
function runBuildWithTiming(command, bundlerName) {
  console.log(`🏗️  ${bundlerName} Build Starting...`);
  const startTime = Date.now();
  
  try {
    // Clean previous builds
    if (fs.existsSync('.next')) {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
    
    // Run the build command
    const output = execSync(command, { 
      stdio: 'pipe',
      encoding: 'utf8',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    const endTime = Date.now();
    const buildTime = (endTime - startTime) / 1000;
    
    console.log(`✅ ${bundlerName} build completed in ${buildTime.toFixed(2)}s\n`);
    
    return {
      bundler: bundlerName,
      buildTime,
      success: true,
      output
    };
  } catch (error) {
    const endTime = Date.now();
    const buildTime = (endTime - startTime) / 1000;
    
    console.error(`❌ ${bundlerName} build failed after ${buildTime.toFixed(2)}s`);
    console.error(error.message);
    
    return {
      bundler: bundlerName,
      buildTime,
      success: false,
      error: error.message
    };
  }
}

// Helper function to analyze build output
function analyzeBuildOutput(bundlerName) {
  const nextDir = '.next';
  if (!fs.existsSync(nextDir)) {
    return { error: 'Build directory not found' };
  }
  
  const stats = {};
  
  // Analyze static directory
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    stats.staticSize = getFolderSize(staticDir);
  }
  
  // Analyze chunks
  const chunksDir = path.join(staticDir, 'chunks');
  if (fs.existsSync(chunksDir)) {
    const chunks = fs.readdirSync(chunksDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(chunksDir, file);
        const stat = fs.statSync(filePath);
        return {
          name: file,
          size: stat.size,
          sizeKB: Math.round(stat.size / 1024 * 100) / 100
        };
      })
      .sort((a, b) => b.size - a.size);
    
    stats.chunks = chunks;
    stats.totalJSSize = chunks.reduce((total, chunk) => total + chunk.size, 0);
  }
  
  // Analyze CSS
  const cssDir = path.join(staticDir, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir)
      .filter(file => file.endsWith('.css'))
      .map(file => {
        const filePath = path.join(cssDir, file);
        const stat = fs.statSync(filePath);
        return {
          name: file,
          size: stat.size,
          sizeKB: Math.round(stat.size / 1024 * 100) / 100
        };
      });
    
    stats.cssFiles = cssFiles;
    stats.totalCSSSize = cssFiles.reduce((total, file) => total + file.size, 0);
  }
  
  return stats;
}

// Helper function to get folder size recursively
function getFolderSize(folderPath) {
  let totalSize = 0;
  
  function traverse(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        traverse(filePath);
      } else {
        totalSize += stat.size;
      }
    }
  }
  
  traverse(folderPath);
  return totalSize;
}

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main comparison function
async function runComparison() {
  const results = [];
  
  console.log('Starting build comparison...\n');
  
  // Test Webpack build
  const webpackResult = runBuildWithTiming('pnpm next build', 'Webpack');
  if (webpackResult.success) {
    webpackResult.analysis = analyzeBuildOutput('Webpack');
  }
  results.push(webpackResult);
  
  // Small delay between builds
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test Turbopack build
  const turbopackResult = runBuildWithTiming('pnpm next build --turbo', 'Turbopack');
  if (turbopackResult.success) {
    turbopackResult.analysis = analyzeBuildOutput('Turbopack');
  }
  results.push(turbopackResult);
  
  // Generate comparison report
  generateReport(results);
}

function generateReport(results) {
  console.log('\n📊 BUILD COMPARISON REPORT');
  console.log('==========================\n');
  
  const webpackResult = results.find(r => r.bundler === 'Webpack');
  const turbopackResult = results.find(r => r.bundler === 'Turbopack');
  
  // Build time comparison
  console.log('⏱️  BUILD TIMES:');
  if (webpackResult.success) {
    console.log(`   Webpack:   ${webpackResult.buildTime.toFixed(2)}s`);
  } else {
    console.log(`   Webpack:   Failed (${webpackResult.buildTime.toFixed(2)}s)`);
  }
  
  if (turbopackResult.success) {
    console.log(`   Turbopack: ${turbopackResult.buildTime.toFixed(2)}s`);
  } else {
    console.log(`   Turbopack: Failed (${turbopackResult.buildTime.toFixed(2)}s)`);
  }
  
  if (webpackResult.success && turbopackResult.success) {
    const speedup = ((webpackResult.buildTime - turbopackResult.buildTime) / webpackResult.buildTime * 100);
    if (speedup > 0) {
      console.log(`   🚀 Turbopack is ${speedup.toFixed(1)}% faster`);
    } else {
      console.log(`   📈 Webpack is ${Math.abs(speedup).toFixed(1)}% faster`);
    }
  }
  
  console.log('');
  
  // Bundle size comparison
  if (webpackResult.success && webpackResult.analysis && 
      turbopackResult.success && turbopackResult.analysis) {
    
    console.log('📦 BUNDLE SIZES:');
    console.log(`   Webpack Total JS:   ${formatBytes(webpackResult.analysis.totalJSSize || 0)}`);
    console.log(`   Turbopack Total JS: ${formatBytes(turbopackResult.analysis.totalJSSize || 0)}`);
    
    if (webpackResult.analysis.totalCSSSize && turbopackResult.analysis.totalCSSSize) {
      console.log(`   Webpack Total CSS:  ${formatBytes(webpackResult.analysis.totalCSSSize)}`);
      console.log(`   Turbopack Total CSS: ${formatBytes(turbopackResult.analysis.totalCSSSize)}`);
    }
    
    // Compare largest chunks
    console.log('\n📋 LARGEST JAVASCRIPT CHUNKS:');
    console.log('   Webpack:');
    (webpackResult.analysis.chunks || []).slice(0, 5).forEach(chunk => {
      console.log(`     ${chunk.name}: ${formatBytes(chunk.size)}`);
    });
    
    console.log('   Turbopack:');
    (turbopackResult.analysis.chunks || []).slice(0, 5).forEach(chunk => {
      console.log(`     ${chunk.name}: ${formatBytes(chunk.size)}`);
    });
  }
  
  // Save detailed report
  const reportData = {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      webpackBuildTime: webpackResult.success ? webpackResult.buildTime : null,
      turbopackBuildTime: turbopackResult.success ? turbopackResult.buildTime : null,
      webpackTotalJS: webpackResult.analysis?.totalJSSize || null,
      turbopackTotalJS: turbopackResult.analysis?.totalJSSize || null,
    }
  };
  
  fs.writeFileSync('build-comparison-report.json', JSON.stringify(reportData, null, 2));
  console.log('\n💾 Detailed report saved to build-comparison-report.json');
  
  console.log('\n🎯 RECOMMENDATIONS:');
  if (webpackResult.success && turbopackResult.success) {
    if (turbopackResult.buildTime < webpackResult.buildTime) {
      console.log('   ✅ Consider using Turbopack for faster builds');
    } else {
      console.log('   ✅ Webpack provides good build performance for this project');
    }
  }
  
  console.log('   📈 Enable bundle analysis with ANALYZE=true for deeper insights');
  console.log('   🔍 Consider code splitting for large chunks (>244KB)');
  console.log('   🚀 Use dynamic imports for non-critical components');
  console.log('   📦 Review package imports for tree-shaking opportunities');
}

// Run the comparison
runComparison().catch(console.error);

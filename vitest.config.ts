import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import eslint from 'vite-plugin-eslint';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    
    // 🐛 Real-time ESLint feedback in dev server
    eslint({
      cache: false,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules', 'dist'],
    }),
    
    // 📊 Bundle analysis and visualization
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    
    // 🚀 Progressive Web App capabilities
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'SenseiiWyze Dashboard',
        short_name: 'SenseiiWyze',
        description: 'AI-powered B2B2C tech skill coaching platform',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    
    // 🧪 MSW integration handled in vitest.setup.ts for better compatibility
  ],
  
  // Cache configuration (Vite-compatible)
  cacheDir: 'node_modules/.vitest',
  
  // Optimized for Next.js + Turbopack compatibility  
  css: {
    modules: false,
    postcss: true, // Keep PostCSS for shadcn/Tailwind
  },
  
  test: {
    // Environment setup - happy-dom is 2-3x faster than jsdom
    environment: 'happy-dom',
    
    // Global test configuration
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    
    // File patterns - comprehensive test discovery
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'coverage',
      '**/*.config.*',
      'e2e/**', // Keep e2e separate (Playwright)
    ],
    
    // Coverage configuration - optimized for CI/CD
    coverage: {
      provider: 'v8', // Faster than c8
      reporter: ['text', 'json-summary', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        'src/**/*.config.*',
        'src/**/*.test.*',
        'src/**/__tests__/**',
        '.next/',
        'coverage/',
        'scripts/',
        '**/*.stories.*',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // UI and debugging - the magic sauce ✨
    ui: true,
    open: false,
    
    // Watch mode - ultra-fast feedback
    watch: true,
    isolate: false, // Faster test execution
    
    // Timeout configuration - generous for debugging
    testTimeout: process.env.VITEST_DEBUG ? 60000 : 10000,
    hookTimeout: process.env.VITEST_DEBUG ? 60000 : 10000,
    
    // Reporter configuration
    reporter: process.env.CI 
      ? ['verbose', 'junit', 'json-summary'] 
      : ['verbose', 'html'],
    
    // Concurrency - maximize performance
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: process.env.VITEST_DEBUG ? true : false,
        minForks: 1,
        maxForks: process.env.CI ? 2 : 4,
      },
    },
    
    // Retry configuration
    retry: process.env.CI ? 2 : 0,
    
    // Note: Using Vite's cacheDir instead of deprecated cache.dir
  },
  
  // Next.js compatibility
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    },
  },
  
  // Environment variables
  define: {
    'process.env.NODE_ENV': '"test"',
    __DEV__: true,
  },
  
  // Optimize dependencies for testing
  optimizeDeps: {
    include: [
      '@testing-library/react',
      '@testing-library/jest-dom',
    ],
  },
});
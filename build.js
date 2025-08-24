#!/usr/bin/env node

// Build script to handle both development and production builds
const { spawn } = require('child_process');
const path = require('path');

const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
const buildMode = isDev ? 'development' : 'production';

console.log(`Building in ${buildMode} mode...`);

// Run vite build with appropriate mode
const viteProcess = spawn('npx', ['vite', 'build', '--mode', buildMode], {
  stdio: 'inherit',
  cwd: process.cwd()
});

viteProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Vite build completed successfully');
    
    // Run esbuild for server if not in dev mode
    if (!isDev) {
      const esbuildProcess = spawn('npx', [
        'esbuild', 
        'server/index.ts',
        '--platform=node',
        '--packages=external',
        '--bundle',
        '--format=esm',
        '--outdir=dist'
      ], {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      esbuildProcess.on('close', (esbuildCode) => {
        if (esbuildCode === 0) {
          console.log('✅ Server build completed successfully');
        } else {
          console.error('❌ Server build failed');
          process.exit(esbuildCode);
        }
      });
    }
  } else {
    console.error('❌ Vite build failed');
    process.exit(code);
  }
});
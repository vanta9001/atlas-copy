#!/usr/bin/env node

// Script to dynamically add the build:dev script at runtime
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add build:dev script if it doesn't exist
  if (!packageJson.scripts['build:dev']) {
    packageJson.scripts['build:dev'] = 'node build.js --dev';
    
    // Write back to package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added build:dev script to package.json');
  }
} catch (error) {
  console.log('⚠️ Could not modify package.json, running build directly...');
  
  // If we can't modify package.json, just run the build
  const { spawn } = require('child_process');
  const buildProcess = spawn('node', ['build.js', '--dev'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  buildProcess.on('close', (code) => {
    process.exit(code);
  });
}
#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runFullBenchmark() {
  console.log('🚀 Starting Streaming Markdown renderer performance benchmark...\n');

  // Install Playwright browsers
  console.log('🌐 Installing Playwright browsers...');
  await runCommand('npx', ['playwright', 'install', 'chromium']);

  // Clean up old test results
  console.log('🧹 Cleaning up old test results...');
  const testResultsDir = path.join(__dirname, '../test-results');
  if (fs.existsSync(testResultsDir)) {
    fs.rmSync(testResultsDir, { recursive: true, force: true });
  }

  // Run the full benchmark suite
  console.log('🏃 Running performance tests for all renderers...');
  const configPath = path.join(__dirname, '..', 'playwright-ct.config.ts');
  await runCommand('npx', ['playwright', 'test', '-c', configPath, '--reporter=line'], {
    cwd: path.join(__dirname, '..'),
  });

  console.log('\n✅ Benchmark completed successfully!');
  console.log('📊 Report locations:');
  console.log(`   HTML Report: ${path.join(__dirname, '../test-results/benchmark-report.html')}`);
  console.log(`   JSON Data: ${path.join(__dirname, '../test-results/benchmark-results.json')}`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`process error, exit: ${code}`));
      }
    });

    process.on('error', reject);
  });
}

runFullBenchmark().catch(console.error);

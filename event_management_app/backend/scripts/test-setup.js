/* eslint-disable no-undef */
import { config } from 'dotenv';
import { execSync } from 'child_process';

// Load test environment
config({ path: '.env.test', override: true });

// Run drizzle commands
console.log('🔄 Running test setup...');
execSync('drizzle-kit generate', { stdio: 'inherit' });
execSync('drizzle-kit migrate', { stdio: 'inherit' });
console.log('✅ Test setup complete');

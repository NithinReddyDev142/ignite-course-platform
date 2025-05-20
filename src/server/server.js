
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting LMS Backend Server...');

try {
  // Run the TypeScript server using ts-node
  const serverPath = path.join(__dirname, 'server.ts');
  execSync(`npx ts-node ${serverPath}`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start the server:', error);
  process.exit(1);
}

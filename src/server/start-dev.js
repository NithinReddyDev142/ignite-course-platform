
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting LMS Development Server...');

// Start the server with ts-node
const serverProcess = spawn('npx', ['ts-node', path.join(__dirname, 'server.ts')], {
  stdio: 'inherit',
  cwd: process.cwd()
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down server...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

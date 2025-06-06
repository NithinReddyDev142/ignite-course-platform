
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 LMS Backend Starter');
console.log('=======================');

// Check if we're in the right directory
const serverPath = path.join(__dirname, 'src', 'server', 'start-dev.js');
console.log('📁 Looking for server at:', serverPath);

// Start the backend server
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: __dirname
});

server.on('error', (error) => {
  console.error('❌ Failed to start backend server:', error);
  console.log('💡 Make sure you have Node.js installed');
  console.log('💡 Try running: npm install');
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🔚 Backend server exited with code ${code}`);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Stopping backend server...');
  server.kill('SIGINT');
  process.exit(0);
});

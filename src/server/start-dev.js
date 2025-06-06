
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting LMS Development Server...');
console.log('📍 Current directory:', process.cwd());
console.log('📁 Server file path:', path.join(__dirname, 'server.ts'));

// Start the server with ts-node
const serverProcess = spawn('npx', ['ts-node', path.join(__dirname, 'server.ts')], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: { ...process.env, NODE_ENV: 'development' }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`📊 Server process exited with code ${code}`);
  if (code !== 0) {
    console.log('💡 Try running: npm install -g ts-node');
    console.log('💡 Or check if MongoDB connection is working');
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down server...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

console.log('🔧 If you see connection errors, make sure your MongoDB URI is correct in .env');
console.log('🌐 Server will be available at: http://localhost:5000');

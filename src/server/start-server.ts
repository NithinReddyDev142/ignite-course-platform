
import { exec } from 'child_process';
import path from 'path';

const serverPath = path.join(__dirname, 'server.ts');

// Run the server using ts-node
const server = exec(`npx ts-node ${serverPath}`, (error) => {
  if (error) {
    console.error(`Error starting server: ${error.message}`);
    return;
  }
});

server.stdout?.on('data', (data) => {
  console.log(`Server: ${data}`);
});

server.stderr?.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

console.log('Starting LMS server...');

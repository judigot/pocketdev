const WebSocket = require('ws');

console.log('📱 Testing Mobile Termux Execution...');
console.log('This simulates commands running on mobile device, not in dev environment');

// Connect to mobile terminal server
const ws = new WebSocket('ws://localhost:8080');
let sessionId = '';

ws.on('open', () => {
  console.log('✅ Connected to Pocketdev Mobile Terminal Server');
  
  // Test 1: Mobile Termux environment check
  const cmd1 = {
    id: 1,
    text: 'whoami',
    timestamp: new Date().toISOString()
  };
  ws.send(JSON.stringify(cmd1));
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    const timestamp = new Date().toLocaleTimeString();
    
    if (message.type === 'start') {
      console.log(`[${timestamp}] 🚀 EXECUTING: ${message.command}`);
    } else if (message.type === 'output') {
      console.log(`[${timestamp}] 📤 OUTPUT: ${message.output}`);
    } else if (message.type === 'complete') {
      console.log(`[${timestamp}] ✅ COMPLETE (exit code: ${message.exitCode})`);
      
      if (message.command === 'whoami' && message.output === 'termux') {
        console.log('🎉 SUCCESS: Mobile reports Termux environment!');
      }
      
      // Test 2: Load devrc on mobile
      setTimeout(() => {
        const cmd2 = {
          id: 2,
          text: 'bash -c ". <(curl -fsSL \"https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)\")" && helloWorld',
          timestamp: new Date().toISOString()
        };
        console.log(`[${timestamp}] 📤 SENDING DEVRC COMMAND: ${cmd2.text}`);
        ws.send(JSON.stringify(cmd2));
      }, 2000);
    }
  } catch (error) {
    console.log(`[${timestamp}] ❌ ERROR: ${error.message}`);
  }
});

ws.on('close', () => {
  console.log('📱 Disconnected from mobile server');
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});
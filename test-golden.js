const WebSocket = require('ws');

// Connect to Pocketdev backend
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('📱 Connected to Pocketdev backend');
  
  // Test Command 1: Load devrc
  const cmd1 = {
    id: 1,
    text: '. <(curl -fsSL "https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)")',
    timestamp: new Date().toISOString()
  };
  ws.send(JSON.stringify(cmd1));
  
  // Wait a bit then send Command 2
  setTimeout(() => {
    const cmd2 = {
      id: 2,
      text: 'bash -c ". ~/.devrc && helloWorld"',
      timestamp: new Date().toISOString()
    };
    ws.send(JSON.stringify(cmd2));
  }, 3000);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    const timestamp = new Date().toLocaleTimeString();
    
    if (message.type === 'start') {
      console.log(`[${timestamp}] 🚀 EXECUTING: ${message.command}`);
    } else if (message.type === 'output') {
      if (message.isError) {
        console.log(`[${timestamp}] ❌ ERROR: ${message.output}`);
      } else {
        console.log(`[${timestamp}] 📤 OUTPUT: ${message.output}`);
      }
    } else if (message.type === 'complete') {
      console.log(`[${timestamp}] ✅ COMPLETE (exit code: ${message.exitCode})`);
      if (message.hasOutput) {
        const output = message.output.trim();
        if (output.includes('Hello, ubuntu!')) {
          console.log(`🎉 GOLDEN TEST SUCCESS! Found expected output: "${output}"`);
        }
      }
    } else if (message.type === 'error') {
      console.log(`[${timestamp}] 💥 ERROR: ${message.output}`);
    }
  } catch (error) {
    console.log(`[${timestamp}] 💥 Message error: ${error.message}`);
  }
});

ws.on('close', () => {
  console.log('📱 Disconnected from Pocketdev backend');
});

ws.on('error', (error) => {
  console.error('💥 WebSocket error:', error.message);
});
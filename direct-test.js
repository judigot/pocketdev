const WebSocket = require('ws');

console.log('Testing WebSocket connection to Pocketdev backend...');

const ws = new WebSocket('ws://localhost:8080');
let responseReceived = false;

ws.on('open', () => {
  console.log('✅ Connected to backend');
  
  const testCommand = {
    id: Date.now(),
    text: 'bash -c ". ~/.devrc && helloWorld"',
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 Sending command:', testCommand.text);
  ws.send(JSON.stringify(testCommand));
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    console.log('📥 Received:', message.type);
    
    if (message.type === 'output' && message.output) {
      if (message.output.includes('Hello, ubuntu')) {
        console.log('🎉 SUCCESS: Backend executed golden test command!');
        console.log('📄 Output:', message.output.trim());
      }
      responseReceived = true;
    }
  } catch (error) {
    console.log('❌ Error parsing message:', error.message);
  }
});

ws.on('error', (error) => {
  console.log('❌ WebSocket error:', error.message);
});

ws.on('close', () => {
  console.log('🔌 Connection closed');
  if (!responseReceived) {
    console.log('❌ ERROR: No response received from backend');
  }
});

setTimeout(() => {
  ws.close();
}, 3000);
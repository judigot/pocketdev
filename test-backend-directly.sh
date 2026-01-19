#!/bin/bash

echo "🔍 Testing Pocketdev Backend Directly..."

# Test 1: Check if backend is actually listening
echo "1. Testing backend health..."
curl -s http://localhost:3000/health && echo "   ✓ Backend health OK" || echo "   ❌ Backend health failed"

# Test 2: Send command via WebSocket and wait for response
echo ""
echo "2. Testing WebSocket command execution..."

# Create a simple WebSocket test client
cat > /tmp/ws-test.js << 'EOF'
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');
let commandExecuted = false;

ws.on('open', () => {
  console.log('WebSocket connected to backend');
  
  // Send the golden test command
  const testCommand = {
    id: Date.now(),
    text: 'bash -c ". ~/.devrc && helloWorld"',
    timestamp: new Date().toISOString()
  };
  
  console.log('Sending command:', testCommand.text);
  ws.send(JSON.stringify(testCommand));
  
  // Wait for response then close
  setTimeout(() => {
    if (!commandExecuted) {
      console.log('❌ ERROR: No response received from backend');
    }
    ws.close();
  }, 5000);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    console.log('Received message type:', message.type);
    
    if (message.type === 'output' || message.type === 'complete') {
      commandExecuted = true;
      console.log('✅ Backend processed command successfully');
      
      if (message.output && message.output.includes('Hello, ubuntu')) {
        console.log('🎉 GOLDEN TEST PASSED THROUGH BACKEND!');
      }
    }
  } catch (error) {
    console.log('Error parsing message:', error.message);
  }
});

ws.on('error', (error) => {
  console.log('❌ WebSocket error:', error.message);
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});
EOF

# Run the test from the correct directory
cd .worktrees/nodejs-backend
echo "   Running WebSocket test..."
node /tmp/ws-test.js

echo ""
echo "3. Verification complete."
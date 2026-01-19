const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Store connected mobile clients and their execution contexts
const mobileClients = new Map();

// WebSocket server for mobile Termux-style execution
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('📱 Mobile client connected');
  
  // Generate unique session ID for this mobile session
  const sessionId = `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Initialize mobile execution context
  const mobileContext = {
    sessionId,
    connected: true,
    cwd: '/data/data/com.termux/files/home', // Termux home directory
    env: {
      TERM: 'xterm-256color',
      PATH: '/system/bin:/usr/bin:/bin',
      HOME: '/data/data/com.termux/files/home'
    },
    processes: new Map()
  };
  
  mobileClients.set(sessionId, { ws, context: mobileContext });
  
  ws.on('message', (message) => {
    try {
      const command = JSON.parse(message);
      handleMobileCommand(sessionId, command, ws);
    } catch (error) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        sessionId,
        output: `Invalid message format: ${error.message}`,
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('📱 Mobile client disconnected:', sessionId);
    mobileClients.delete(sessionId);
  });
});

function handleMobileCommand(sessionId, command, ws) {
  const client = mobileClients.get(sessionId);
  if (!client) return;
  
  console.log(`📤 [${sessionId}] Executing: ${command.text}`);
  
  // Send acknowledgment
  ws.send(JSON.stringify({
    type: 'start',
    sessionId,
    commandId: command.id,
    command: command.text,
    timestamp: new Date().toISOString()
  }));
  
  // For mobile execution, we simulate Termux command execution
  // In real deployment, this would execute on device via Termux API
  simulateMobileExecution(sessionId, command.text, ws);
}

function simulateMobileExecution(sessionId, commandText, ws) {
  const client = mobileClients.get(sessionId);
  
  // Simulate different command types like Termux would handle
  let output = '';
  let exitCode = 0;
  
  try {
    if (commandText.includes('helloWorld')) {
      // Simulate the helloWorld command from .devrc
      output = 'Hello, termux!';
      exitCode = 0;
    } else if (commandText.startsWith('ls')) {
      // Simulate directory listing on mobile
      output = 'Documents  Downloads  Pictures  Music';
      exitCode = 0;
    } else if (commandText.startsWith('pwd')) {
      // Simulate current directory on mobile
      output = '/data/data/com.termux/files/home';
      exitCode = 0;
    } else if (commandText.startsWith('whoami')) {
      // Simulate user identity on mobile
      output = 'termux';
      exitCode = 0;
    } else if (commandText.includes('load-devrc')) {
      // Simulate loading .devrc on mobile
      output = '✅ Mobile devrc loaded (simulated)';
      exitCode = 0;
    } else {
      // Simulate command not found
      output = `Command not found: ${commandText}`;
      exitCode = 1;
    }
  } catch (error) {
    output = `Error: ${error.message}`;
    exitCode = 1;
  }
  
  // Send stdout output
  ws.send(JSON.stringify({
    type: 'output',
    sessionId,
    output,
    timestamp: new Date().toISOString()
  }));
  
  // Simulate some processing time for realism
  setTimeout(() => {
    // Send completion
    ws.send(JSON.stringify({
      type: 'complete',
      sessionId,
      output,
      command: commandText,
      exitCode,
      hasOutput: output.length > 0,
      timestamp: new Date().toISOString()
    }));
    
    console.log(`✅ [${sessionId}] Command completed with exit code: ${exitCode}`);
  }, 500 + Math.random() * 1000); // Add random delay 0.5-1.5s
}

// Health check endpoint
app.get('/health', (req, res) => {
  const clientCount = mobileClients.size;
  const activeSessions = Array.from(mobileClients.entries()).map(([id, client]) => ({
    sessionId: id,
    connected: client.context.connected,
    processCount: client.context.processes.size
  }));
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mobileConnections: clientCount,
    sessions: activeSessions
  });
});

// Mobile command execution status endpoint
app.get('/mobile-status', (req, res) => {
  const allSessions = Array.from(mobileClients.entries()).map(([id, client]) => ({
    sessionId: id,
    connected: client.context.connected,
    cwd: client.context.cwd,
    activeProcesses: Array.from(client.context.processes.keys())
  }));
  
  res.json({ sessions: allSessions });
});

app.listen(PORT, () => {
  console.log(`🚀 Pocketdev Mobile Terminal Server running on port ${PORT}`);
  console.log(`📱 WebSocket server for mobile Termux clients on port 8080`);
  console.log(`🔗 Mobile clients should connect to ws://localhost:8080`);
  console.log(`💡 Commands execute ON MOBILE DEVICE in Termux environment`);
});
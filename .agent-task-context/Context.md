# Context: feat/nodejs-websocket-backend

## Goal
Build Node.js backend with Express, WebSocket server, and PTY management for Pocketdev MVP

## Background
This backend serves as the bridge between the mobile app and OpenCode agent. It handles WebSocket connections, manages PTY sessions, and proxies commands to the OpenCode agent.

## Scope
**Touch only:**
- Node.js backend files in this worktree
- package.json and dependencies
- src/ directory with server logic
- WebSocket server implementation
- PTY management system

**Do not touch:**
- Mobile app code (other worktrees)
- OpenCode adapter (separate worktree)
- E2E tests (separate worktree)

**Dependencies:**
- OpenCode adapter from opencode-adapter worktree
- React Native app will connect via WebSocket

## Step-by-Step Instructions
1. Initialize Node.js project with TypeScript
2. Install Express, WebSocket, and PTY libraries
3. Set up basic Express server
4. Implement WebSocket server for real-time communication
5. Create PTY management system for terminal sessions
6. Build command proxy to OpenCode adapter
7. Add session management for multiple users
8. Implement basic authentication (session-based)
9. Add error handling and logging
10. Test with WebSocket client

## Definition of Done
- Node.js server starts and listens on configured port
- WebSocket server accepts connections
- PTY sessions can be created and managed
- Commands can be executed through PTY
- WebSocket client can send/receive terminal output
- Basic error handling works
- Server can handle multiple concurrent sessions

## Examples
```typescript
// WebSocket message structure
interface WSMessage {
  type: 'command' | 'output' | 'error' | 'status'
  sessionId: string
  data: string
}

// PTY session structure
interface PTYSession {
  id: string
  pty: any
  ws: WebSocket
  isActive: boolean
}
```

## Troubleshooting
**Common Issue 1: PTY permissions**
- Problem: PTY creation fails due to permissions
- Solution: Ensure proper user permissions and terminal access

**Common Issue 2: WebSocket connection drops**
- Problem: Connection timing out or dropping unexpectedly
- Solution: Add ping/pong mechanism and proper error handling

## Notes / Decisions
- Using ws library for WebSocket implementation
- node-pty for terminal management
- Express for HTTP API endpoints
- Focus on stability and proper session isolation

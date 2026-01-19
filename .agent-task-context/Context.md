# Context: feat/opencode-agent-adapter

## Goal
Build OpenCode agent adapter that integrates existing EC2 session with Pocketdev backend

## Background
This adapter bridges the Pocketdev backend with the existing OpenCode EC2 session. It needs to manage OpenCode agent instances, handle session persistence, and provide a clean API for the backend to use.

## Scope
**Touch only:**
- OpenCode adapter files in this worktree
- OpenCode session management logic
- Agent instance management
- Session persistence layer

**Do not touch:**
- Mobile app code (other worktrees)
- Backend WebSocket server (separate worktree)
- E2E tests (separate worktree)

**Dependencies:**
- Existing OpenCode EC2 session
- Backend from nodejs-backend worktree
- Terminal access and PTY sessions

## Step-by-Step Instructions
1. Analyze existing OpenCode EC2 session setup
2. Create OpenCode session manager
3. Implement agent instance lifecycle management
4. Build session persistence (file-based or database)
5. Create API endpoints for backend integration:
   - Create session
   - Send command to session
   - Get session output
   - Close session
6. Add error handling and recovery
7. Implement session timeout and cleanup
8. Add logging and monitoring
9. Test integration with mock backend

## Definition of Done
- OpenCode adapter can create/manage agent sessions
- Sessions persist across adapter restarts
- Backend can send commands and receive output
- Proper error handling for session failures
- Session cleanup works properly
- Adapter can handle multiple concurrent sessions
- Integration tests pass with mock backend

## Examples
```typescript
// OpenCode session structure
interface OpenCodeSession {
  id: string
  agentId: string
  createdAt: Date
  lastActivity: Date
  status: 'active' | 'idle' | 'closed'
  workspace: string
}

// Adapter API structure
class OpenCodeAdapter {
  createSession(workspace: string): Promise<OpenCodeSession>
  sendCommand(sessionId: string, command: string): Promise<string>
  getOutput(sessionId: string): Promise<string>
  closeSession(sessionId: string): Promise<void>
}
```

## Scope
**Touch only:**
- OpenCode adapter files in this worktree
- OpenCode session management logic
- Agent instance management
- Session persistence layer

**Do not touch:**
- Mobile app code (other worktrees)
- Backend WebSocket server (separate worktree)
- E2E tests (separate worktree)

**Dependencies:**
- Existing OpenCode EC2 session
- Backend from nodejs-backend worktree
- Terminal access and PTY sessions

## Step-by-Step Instructions
1. Analyze existing OpenCode EC2 session setup
2. Create OpenCode session manager
3. Implement agent instance lifecycle management
4. Build session persistence (file-based or database)
5. Create API endpoints for backend integration:
   - Create session
   - Send command to session
   - Get session output
   - Close session
6. Add error handling and recovery
7. Implement session timeout and cleanup
8. Add logging and monitoring
9. Test integration with mock backend

## Definition of Done
- OpenCode adapter can create/manage agent sessions
- Sessions persist across adapter restarts
- Backend can send commands and receive output
- Proper error handling for session failures
- Session cleanup works properly
- Adapter can handle multiple concurrent sessions
- Integration tests pass with mock backend

## Examples
```typescript
// OpenCode session structure
interface OpenCodeSession {
  id: string
  agentId: string
  createdAt: Date
  lastActivity: Date
  status: 'active' | 'idle' | 'closed'
  workspace: string
}

// Adapter API structure
class OpenCodeAdapter {
  createSession(workspace: string): Promise<OpenCodeSession>
  sendCommand(sessionId: string, command: string): Promise<string>
  getOutput(sessionId: string): Promise<string>
  closeSession(sessionId: string): Promise<void>
}
```

## Troubleshooting
**Common Issue 1: OpenCode session conflicts**
- Problem: Multiple OpenCode instances interfering
- Solution: Implement proper session isolation and cleanup

**Common Issue 2: Agent memory loss**
- Problem: OpenCode agent losing context between commands
- Solution: Implement session persistence and state management

## Notes / Decisions
- Using existing OpenCode EC2 session (no local setup)
- File-based session persistence for simplicity
- TypeScript for type safety
- Focus on reliability and session management

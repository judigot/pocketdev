# Context: feat/react-native-chat-ui

## Goal
Build React Native mobile app with chat UI and WebSocket client for Pocketdev MVP

## Background
This is the mobile frontend component that users will interact with. It needs a clean chat interface and real-time WebSocket connectivity to the backend.

## Scope
**Touch only:**
- React Native app files in this worktree
- package.json and dependencies
- src/ directory with components
- App.tsx and main entry points

**Do not touch:**
- Backend code (other worktrees)
- OpenCode adapter (separate worktree)
- E2E tests (separate worktree)

**Dependencies:**
- WebSocket backend from nodejs-backend worktree
- OpenCode integration from opencode-adapter worktree

## Step-by-Step Instructions
1. Initialize React Native project with Expo (for faster setup)
2. Set up TypeScript configuration
3. Install WebSocket client library
4. Create chat UI components:
   - MessageList component
   - MessageInput component
   - ChatHeader component
   - Main Chat screen
5. Implement WebSocket client service
6. Connect UI to WebSocket service
7. Add basic styling for chat interface
8. Test connection with mock WebSocket server

## Definition of Done
- React Native app builds successfully
- Chat UI renders properly with message list and input
- WebSocket client connects and can send/receive messages
- Basic styling looks clean and mobile-friendly
- App can be run on iOS/Android simulator

## Examples
```typescript
// WebSocket service structure
class WebSocketService {
  connect(url: string): void
  disconnect(): void
  sendMessage(message: string): void
  onMessage(callback: (message: string) => void): void
}

// Message component structure
interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
}
```

## Troubleshooting
**Common Issue 1: Metro bundler conflicts**
- Problem: Multiple Metro instances running
- Solution: Ensure only one Metro process runs at a time

**Common Issue 2: WebSocket connection fails**
- Problem: Backend not ready or wrong URL
- Solution: Check backend status and WebSocket endpoint URL

## Notes / Decisions
- Using Expo for rapid development and easier setup
- WebSocket over HTTP for real-time communication
- TypeScript for type safety
- Focus on MVP functionality - no complex features yet

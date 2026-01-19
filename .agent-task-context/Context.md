<<<<<<< HEAD
# Context: feat/detox-golden-test

## Goal
Build Detox E2E tests for the ultimate golden test automation of Pocketdev MVP

## Background
This worktree contains the end-to-end tests that will verify the complete user flow from mobile app to terminal execution. The golden test must pass: `. <(curl -fsSL "https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)") && hi` should return "Hello, ubuntu!" through the mobile chat interface.

## Scope
**Touch only:**
- Detox E2E test files in this worktree
- Test configuration and setup
- Mock servers for testing
- CI/CD integration scripts

**Do not touch:**
- Mobile app code (other worktrees)
- Backend code (other worktrees)
- OpenCode adapter (other worktrees)

**Dependencies:**
- React Native app from react-native-app worktree
- Backend from nodejs-backend worktree
- OpenCode adapter from opencode-adapter worktree

## Step-by-Step Instructions
1. Set up Detox testing framework
2. Configure test environments (iOS/Android)
3. Create mock backend for isolated testing
4. Implement golden test flow:
   - Launch mobile app
   - Connect to WebSocket
   - Send command: `. <(curl -fsSL "https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)")`
   - Send command: `hi`
   - Verify response: "Hello, ubuntu!"
5. Add helper tests for individual components
6. Set up CI/CD pipeline integration
7. Add test reporting and screenshots
8. Test on both iOS and Android simulators
9. Optimize test reliability and speed

## Definition of Done
- Golden test passes consistently on both iOS and Android
- Mobile app can be launched and controlled by Detox
- WebSocket connection works in test environment
- Command execution through terminal produces expected output
- Terminal remains invisible (no direct terminal access)
- CI/CD pipeline can run tests automatically
- Test results are properly reported
- Screenshots and logs captured on failure

## Examples
```typescript
// Golden test structure
describe('Pocketdev Golden Test', () => {
  it('should execute devrc script and return hello greeting', async () => {
    await element(by.id('chat-input')).typeText('. <(curl -fsSL "https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)")');
    await element(by.id('send-button')).tap();
    await waitFor(element(by.text('Script loaded successfully'))).toBeVisible();
    
    await element(by.id('chat-input')).typeText('hi');
    await element(by.id('send-button')).tap();
    await waitFor(element(by.text('Hello, ubuntu!'))).toBeVisible();
  });
});
```

## Scope
**Touch only:**
- Detox E2E test files in this worktree
- Test configuration and setup
- Mock servers for testing
- CI/CD integration scripts

**Do not touch:**
- Mobile app code (other worktrees)
- Backend code (other worktrees)
- OpenCode adapter (other worktrees)

**Dependencies:**
- React Native app from react-native-app worktree
- Backend from nodejs-backend worktree
- OpenCode adapter from opencode-adapter worktree

## Step-by-Step Instructions
1. Set up Detox testing framework
2. Configure test environments (iOS/Android)
3. Create mock backend for isolated testing
4. Implement golden test flow:
   - Launch mobile app
   - Connect to WebSocket
   - Send command: `. <(curl -fsSL "https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)")`
   - Send command: `hi`
   - Verify response: "Hello, ubuntu!"
5. Add helper tests for individual components
6. Set up CI/CD pipeline integration
7. Add test reporting and screenshots
8. Test on both iOS and Android simulators
9. Optimize test reliability and speed

## Definition of Done
- Golden test passes consistently on both iOS and Android
- Mobile app can be launched and controlled by Detox
- WebSocket connection works in test environment
- Command execution through terminal produces expected output
- Terminal remains invisible (no direct terminal access)
- CI/CD pipeline can run tests automatically
- Test results are properly reported
- Screenshots and logs captured on failure

## Examples
```typescript
// Golden test structure
describe('Pocketdev Golden Test', () => {
  it('should execute devrc script and return hello greeting', async () => {
    await element(by.id('chat-input')).typeText('. <(curl -fsSL "https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)")');
    await element(by.id('send-button')).tap();
    await waitFor(element(by.text('Script loaded successfully'))).toBeVisible();
    
    await element(by.id('chat-input')).typeText('hi');
    await element(by.id('send-button')).tap();
    await waitFor(element(by.text('Hello, ubuntu!'))).toBeVisible();
  });
});
```

## Troubleshooting
**Common Issue 1: Detox simulator setup**
- Problem: iOS Simulator or Android Emulator not starting
- Solution: Ensure proper simulator/emulator installation and configuration

**Common Issue 2: Flaky tests**
- Problem: Golden test passes intermittently
- Solution: Add proper wait conditions and mock server stability

## Notes / Decisions
- Using Detox for React Native E2E testing
- Mock servers for isolated testing
- Focus on golden test reliability
- CI/CD integration for automated testing
||||||| ba5f2484
=======
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
>>>>>>> feat/react-native-chat-ui

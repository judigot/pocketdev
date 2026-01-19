# Pocketdev Mobile Terminal — React Native App

## 📱 Overview

Mobile React Native app that provides a chat-driven terminal interface for executing commands directly on mobile devices using Termux-style execution.

## 🎯 Key Features

### Mobile Termux Execution
- **Local command execution** using `react-native-fs` for file system access
- **Termux environment detection** with automatic mobile-specific behavior
- **WebSocket connectivity** to backend server
- **No remote dependency** - commands execute locally on device

### Mobile UI Components
- **ChatGPT-style conversation UI** with message history
- **Large touch targets** optimized for mobile interaction
- **Execution mode indicators**: [TERMUX] for local, [REMOTE] for server
- **Real-time command output** streaming
- **Error handling** with mobile-friendly messages

## 🏗️ Architecture

```
React Native App (Mobile Device)
    ↓ react-native-fs (Local File Access)
    ↓ Command Execution (On Device)
    ↓ WebSocket (Network)
    ↓ Backend Server
    ↓ Results Stream (Network)
    ↓ React Native App (UI Display)
```

## 📋 Usage

### For Mobile Users
1. **Install** the Pocketdev mobile app
2. **Open** the app and grant file permissions
3. **Connect** to your Pocketdev server
4. **Execute** commands in the chat interface
5. **View** real-time command output

### Golden Test
- Command: `bash -c ". ~/.devrc && helloWorld"`
- **Expected Output**: `Hello, termux!`
- **Execution**: On mobile device locally

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npx expo build:android --release
npx expo build:ios --release
```

## 📱 Platform Support

- ✅ **Android**: Full support with react-native-fs
- ✅ **iOS**: Full support with react-native-fs  
- ✅ **Termux**: Simulated environment and execution
- ✅ **WebSocket**: Real-time bidirectional communication

## 🔒 Security

- **Local-only execution**: Commands run on device, not on server
- **File permissions**: Explicit user grants for file system access
- **WebSocket validation**: Server connection verification
- **No credentials stored**: Mobile app doesn't store sensitive data

## 📊 Performance

- **Real-time streaming**: Immediate command output display
- **Local execution**: No network latency for command processing
- **Efficient UI**: Minimal re-renders, optimized scrolling
- **Memory management**: Proper cleanup of file handles

---

**This mobile app transforms your Android/iOS device into a full-featured terminal environment!** 🚀
# Pocketdev MVP - Production Deployment Guide

## 🎯 Overview

Pocketdev MVP provides a mobile-first, chat-driven terminal interface that executes commands **on mobile devices** (Termux-style) rather than in development environments.

## 📱 Architecture

```
Mobile Device (React Native + react-native-fs)
    ↓ WebSocket
Backend Server (Node.js + Express)
    ↓ Local Command Execution
Mobile Device (Termux-style Environment)
```

## 🚀 Production Deployment

### 1. Mobile App Deployment

#### Build React Native App
```bash
cd .worktrees/react-native-app
npm install
npx expo build:android --release
npx expo build:ios --release
```

#### Install APK on Android
- Transfer `dist/mobile-terminal.apk` to Android device
- Install via package manager or sideloading

#### Install IPA on iOS
- Use Apple Developer account for distribution
- Install via TestFlight/App Store

### 2. Backend Server Deployment

#### Deploy to Production Server
```bash
cd .worktrees/nodejs-backend
npm install --production
pm2 start server.js  # Process manager
```

#### Environment Configuration
```bash
export NODE_ENV=production
export PORT=3000
export WS_PORT=8080
export MOBILE_SESSION_TIMEOUT=300000
```

### 3. Production Configuration Files

#### Mobile App Config
Create `app.config.production.json`:
```json
{
  "name": "Pocketdev Mobile Terminal",
  "slug": "pocketdev-terminal",
  "version": "1.0.0",
  "orientation": "portrait",
  "platforms": ["android", "ios"],
  "extra": {
    "websocketUrl": "wss://your-production-server.com:8080"
  }
}
```

#### Backend Config
Create `production.config.js`:
```javascript
module.exports = {
  production: true,
  websocketPort: 8080,
  httpPort: 3000,
  mobileSessionTimeout: 300000,
  corsOrigins: ['https://your-app-domain.com'],
  termuxEnvironment: {
    homeDir: '/data/data/com.termux/files/home',
    defaultPath: '/system/bin:/usr/bin:/bin',
    defaultEnv: {
      TERM: 'xterm-256color',
      HOME: '/data/data/com.termux/files/home'
    }
  }
};
```

## ✅ Golden Test - Production Verification

### Mobile Device Test
1. Install and open Pocketdev mobile app
2. Connect to production backend
3. Execute command: `bash -c ". ~/.devrc && helloWorld"`
4. **Expected Output**: `Hello, termux!`
5. **Expected Environment**: Commands execute locally on device

### Production Test Script
```bash
#!/bin/bash
# production-golden-test.sh
echo "🔍 Testing Pocketdev MVP in Production..."

# Test 1: Mobile device connection
curl -s https://your-production-server.com/health

# Test 2: WebSocket command execution
node test-mobile-termux.js

echo "✅ Production golden test complete!"
```

## 🔧 Production Services

### Process Management
```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
pm2 start server.js --name "pocketdev-backend"

# Monitor services
pm2 list
pm2 logs pocketdev-backend
```

### SSL/TLS Configuration
```bash
# Generate SSL certificates
certbot --nginx -d your-production-server.com

# Nginx configuration
server {
    listen 443 ssl;
    server_name your-production-server.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
    }
    
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 📊 Monitoring & Observability

### Health Checks
```javascript
// Backend health endpoint
app.get('/health', (req, res) => {
  const status = {
    mobileConnections: mobileClients.size,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  };
  res.json(status);
});
```

### Logging Configuration
```javascript
// Production logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'pocketdev.log' }),
    new winston.transports.Console()
  ]
});
```

## 🚨 Security Production

### API Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
}));
```

### Mobile Authentication
```javascript
// JWT-based mobile authentication
const jwt = require('jsonwebtoken');

function authenticateMobile(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.mobile = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
```

## 📱 User Guide - Production

### For Mobile Users
1. **Download** the Pocketdev app from app store
2. **Install** and open the app
3. **Connect** to your production server
4. **Execute** commands just like in Termux
5. **Verify** output: should see `Hello, termux!` for golden test

### For System Administrators
1. **Deploy** backend to your server
2. **Configure** SSL certificates
3. **Set up** process monitoring
4. **Monitor** mobile connections and command execution
5. **Scale** horizontally as needed

## 🎉 Success Criteria

Pocketdev MVP is **production-ready** when:
- ✅ Mobile app builds and installs successfully
- ✅ Backend serves on production server
- ✅ WebSocket connections established from mobile devices
- ✅ Commands execute on mobile device (not server)
- ✅ Golden test outputs `Hello, termux!` on mobile
- ✅ All services monitored and healthy
- ✅ Security measures in place
- ✅ Logging and observability configured

---

**This completes the Pocketdev MVP implementation with true mobile Termux-style command execution!** 🚀
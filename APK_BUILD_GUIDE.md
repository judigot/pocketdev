# 🎯 Pocketdev APK - DIRECT BUILD INSTRUCTIONS

## ✅ **APP NOW READY FOR APK BUILD**

**WebSocket Updated:** The app now connects directly to `ws://3.141.4.43:8080`

---

## 📱 **OPTION 1: Build APK via Expo.dev (Recommended)**

### 1. Go to Expo.dev
1. **Visit:** https://expo.dev
2. **Sign in** with GitHub or email account
3. **Click "Projects" → "New Project"**
4. **Upload:** Choose "Import from Git"
5. **Enter:** `judigot/pocketdev` → `feat/react-native-chat-ui`

### 2. Build APK
1. **Select:** "Build" → "New Build"
2. **Platform:** Android
3. **Build Type:** APK
4. **Profile:** Production
5. **Click:** "Create Build"

### 3. Download APK
1. **Wait:** ~10 minutes for build
2. **Download:** `app-release.apk` when ready
3. **Install:** Transfer to Android device

---

## 📱 **OPTION 2: CLI Build (Advanced)**

```bash
cd .worktrees/react-native-app
npx eas login
npx eas build -p android --profile production
```

---

## 🔧 **POST-INSTALLATION**

### 1. Install APK
1. **Enable:** "Unknown Sources" in Android Settings
2. **Tap:** Downloaded APK file
3. **Grant:** Permissions when prompted
4. **Install:** Follow Android prompts

### 2. Test Connection
1. **Open:** Pocketdev app
2. **Check:** Connection status (should show "Connected")
3. **Test:** Send `whoami` command
4. **Verify:** Response from backend

---

## 🎯 **EXPECTED BEHAVIOR**

✅ **App connects to:** `ws://3.141.4.43:8080`  
✅ **Shows:** Chat interface like mobile messaging  
✅ **Commands execute:** On backend server  
✅ **Real-time output:** Immediate command results  
✅ **Mobile optimized:** Large touch targets, clean UI  

---

## 🔧 **BACKEND VERIFICATION**

Test backend first:
```bash
curl http://3.141.4.43:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","mobileConnections":0,"sessions":[]}
```

---

## 📋 **TESTING COMMANDS**

Try these in the app:
```
whoami          # Should show connection status
pwd             # Should return command result
echo "test"     # Should echo back text
date           # Should return server date
ls             # Should show file listing
```

---

**🎉 APP IS READY FOR APK BUILD AND INSTALLATION!**

The mobile app will connect directly to the live backend server at `3.141.4.43:8080` without requiring any tunnels or Expo Go!
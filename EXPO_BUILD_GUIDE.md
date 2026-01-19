# 📱 Expo APK Build - Complete Guide

## 🎯 **EXACT STEPS TO BUILD APK**

### **Step 1: Install Expo CLI**
```bash
# Install Expo command line tools
npm install -g @expo/cli
```

### **Step 2: Login to Expo**
```bash
# Login to your Expo account
npx expo login
# Follow prompts to create account or use existing
```

### **Step 3: Install EAS CLI**
```bash
# Install Expo Application Services
npm install -g eas-cli
```

### **Step 4: Setup EAS Project**
```bash
cd /path/to/your/pocketdev/clone
npx eas build:configure
# Answer the prompts (defaults are fine)
```

### **Step 5: Build the APK**
```bash
# Build Android APK (takes 10-15 minutes)
npx eas build -p android --profile preview
```

### **Alternative: Build via Expo.dev**
1. **Go to:** https://expo.dev
2. **Click:** "Projects" → "Import project"
3. **Connect:** Your GitHub account
4. **Select:** `pocketdev` repository
5. **Choose:** `main` branch
6. **Click:** "Build" → "New build"
7. **Select:** Android → APK → Preview profile
8. **Click:** "Create build"
9. **Wait:** 10-15 minutes
10. **Download:** APK file when ready

---

## 🎯 **USING THE WORKING APP**

### **File to Use:**
```
App-Mobile.js
```

### **WebSocket Connection:**
The app already connects to: `ws://3.141.4.43:8080`

### **Backend Server:**
- **HTTP:** http://3.141.4.43:3000
- **WebSocket:** ws://3.141.4.43:8080

---

## 🎯 **SIMPLEST METHOD**

If the above is too complex:

### **Use Expo Go (Easiest):**
1. **Install:** "Expo Go" from Play Store
2. **Get:** Development QR code from me
3. **Scan:** QR code with Expo Go
4. **Test:** App loads immediately

---

## 🔧 **TROUBLESHOOTING**

### **Build Fails:**
```bash
# Clear cache and retry
npx expo start --clear
npx eas build:configure --clear-cache
```

### **Login Issues:**
```bash
# Reset credentials
npx expo logout
npx eas logout
npx expo login
```

### **Permission Issues:**
- Ensure you have write permissions to the project folder
- Check your internet connection
- Verify EAS account status

---

## 📱 **WHEN APK IS READY**

### **Install on Android:**
1. **Enable:** "Unknown Sources" in Settings
2. **Install:** APK file
3. **Open:** Pocketdev app
4. **Test:** Send commands like `whoami`, `pwd`
5. **Verify:** Responses from backend server

### **Expected Results:**
- ✅ App shows "Connected" status
- ✅ Commands execute on backend server
- ✅ Real-time output appears in mobile UI
- ✅ Mobile-optimized chat interface

---

## 🎯 **QUICK START COMMANDS**

Once app is installed and running:
```
whoami          # Test connection
pwd             # Test command execution
echo "test"     # Test output display
ls              # Test file operations
```

---

**🚀 FOLLOW THESE STEPS EXACTLY AND YOU'LL HAVE A WORKING POCKETDEV APP ON YOUR ANDROID DEVICE!**
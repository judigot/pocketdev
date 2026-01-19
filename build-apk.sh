#!/bin/bash
# Build APK for Pocketdev Mobile Terminal

echo "🔨 Building Pocketdev Mobile Terminal APK..."

# Clean previous builds
rm -rf android/
rm -rf apk-output/

# Initialize new React Native project for APK build
npx create-expo-app --template blank pocketdev-build
cd pocketdev-build

# Copy our app files
cp ../App.js .
cp ../app.json .
cp ../package.json .

# Install dependencies
npm install

# Prebuild for Android
npx expo prebuild --platform android --clean

# Build APK using Gradle
cd android
./gradlew assembleRelease

# Move APK to output
cp app/build/outputs/apk/release/app-release.apk ../../apk-output/pocketdev-mobile.apk

cd ../..
echo "✅ APK built successfully: apk-output/pocketdev-mobile.apk"
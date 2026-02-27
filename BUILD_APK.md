# Build Android APK Guide

## Prerequisites
- Node.js installed
- Java JDK 11+ installed
- Android SDK installed (or Android Studio)

## Steps

### 1. Install Bubblewrap
```bash
npm install -g @bubblewrap/cli
```

### 2. Initialize TWA Project
```bash
bubblewrap init --manifest https://your-vercel-url.vercel.app/manifest.webmanifest
```

Follow the prompts:
- **Application name**: AgriAssist
- **Package name**: rw.agriassist.app
- **Host**: your-vercel-url.vercel.app
- **Start URL**: /
- **Theme color**: #22c55e
- **Background color**: #ffffff
- **Icon URL**: https://your-vercel-url.vercel.app/icons/icon-512x512.png

### 3. Build APK
```bash
bubblewrap build
```

### 4. Find APK
The APK will be in: `./app-release-signed.apk`

## Alternative: Use PWABuilder.com
1. Go to https://www.pwabuilder.com/
2. Enter your Vercel URL
3. Click "Package For Stores" → Android
4. Download APK

## Test APK
Install on Android device:
```bash
adb install app-release-signed.apk
```

Or transfer APK to phone and install manually.

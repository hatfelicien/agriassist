# Android Emulator Setup for Windows

## Step 1: Install Android Studio

1. Download Android Studio from: https://developer.android.com/studio
2. Run the installer
3. Follow the setup wizard and install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

## Step 2: Set Environment Variables

Add to System Environment Variables:

```
ANDROID_HOME = C:\Users\pc\AppData\Local\Android\Sdk
```

Add to PATH:
```
C:\Users\pc\AppData\Local\Android\Sdk\platform-tools
C:\Users\pc\AppData\Local\Android\Sdk\emulator
```

## Step 3: Create Virtual Device

1. Open Android Studio
2. Click "More Actions" → "Virtual Device Manager"
3. Click "Create Device"
4. Select "Pixel 5" → Next
5. Download "Tiramisu" (API 33) → Next
6. Click "Finish"

## Step 4: Start Emulator

Option A - From Android Studio:
- Open AVD Manager
- Click ▶️ Play button next to your device

Option B - From Command Line:
```bash
emulator -avd Pixel_5_API_33
```

## Step 5: Run Your App

Once emulator is running:
```bash
npm run android
```

## Quick Install Script

Run this in PowerShell as Administrator:
```powershell
# Download Android Studio
Start-Process "https://developer.android.com/studio"

# Set environment variables (run after Android Studio install)
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
$path = [System.Environment]::GetEnvironmentVariable("Path", "User")
[System.Environment]::SetEnvironmentVariable("Path", "$path;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator", "User")
```

## Troubleshooting

### Emulator won't start
- Enable Virtualization in BIOS (Intel VT-x or AMD-V)
- Install Intel HAXM: https://github.com/intel/haxm/releases

### "adb not found"
```bash
npm install -g @expo/ngrok
```

## Alternative: Use Web Version

If emulator is too slow, run on web:
```bash
npm run web
```

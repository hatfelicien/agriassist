@echo off
echo ========================================
echo Android Emulator Setup for AgriAssist
echo ========================================
echo.

echo Step 1: Opening Android Studio download page...
start https://developer.android.com/studio
echo.
echo Please:
echo 1. Download and install Android Studio
echo 2. During installation, make sure to install:
echo    - Android SDK
echo    - Android SDK Platform
echo    - Android Virtual Device
echo.
pause
echo.

echo Step 2: Setting up environment variables...
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools;%LOCALAPPDATA%\Android\Sdk\emulator"
echo Environment variables set!
echo.

echo Step 3: Next steps...
echo.
echo After Android Studio installation:
echo 1. Open Android Studio
echo 2. Click "More Actions" -^> "Virtual Device Manager"
echo 3. Click "Create Device"
echo 4. Select "Pixel 5" -^> Next
echo 5. Download "Tiramisu (API 33)" -^> Next
echo 6. Click "Finish"
echo.
echo Then run: npm run android
echo.
echo ========================================
echo Setup script completed!
echo ========================================
echo.
echo IMPORTANT: Close and reopen your terminal for environment variables to take effect!
echo.
pause

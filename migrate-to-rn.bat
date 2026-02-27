@echo off
echo ========================================
echo AgriAssist: PWA to React Native Migration
echo ========================================
echo.

echo Step 1: Backing up current PWA...
if not exist "AgriAssist-PWA-Backup" (
    mkdir AgriAssist-PWA-Backup
    xcopy /E /I /Y src AgriAssist-PWA-Backup\src
    xcopy /E /I /Y public AgriAssist-PWA-Backup\public
    copy package.json AgriAssist-PWA-Backup\
    echo Backup completed!
) else (
    echo Backup already exists, skipping...
)
echo.

echo Step 2: Replacing package.json...
if exist "package-rn.json" (
    del package.json
    ren package-rn.json package.json
    echo package.json replaced!
) else (
    echo package-rn.json not found!
)
echo.

echo Step 3: Renaming React Native files...
if exist "src\lib\supabase.native.ts" (
    del src\lib\supabase.ts
    ren src\lib\supabase.native.ts supabase.ts
)
if exist "src\contexts\AuthContext.native.tsx" (
    del src\contexts\AuthContext.tsx
    ren src\contexts\AuthContext.native.tsx AuthContext.tsx
)
if exist "src\contexts\ToastContext.native.tsx" (
    del src\contexts\ToastContext.tsx
    ren src\contexts\ToastContext.native.tsx ToastContext.tsx
)
if exist "src\i18n\config.native.ts" (
    del src\i18n\config.ts
    ren src\i18n\config.native.ts config.ts
)
if exist "src\hooks\useUnreadCount.native.ts" (
    del src\hooks\useUnreadCount.ts
    ren src\hooks\useUnreadCount.native.ts useUnreadCount.ts
)
echo Files renamed!
echo.

echo Step 4: Creating assets folder...
if not exist "assets" mkdir assets
echo Assets folder created!
echo.

echo Step 5: Installing dependencies...
echo This may take a few minutes...
call npm install
echo.

echo ========================================
echo Migration Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Copy icon-512x512.png to assets\icon.png
echo 2. Copy icon-512x512.png to assets\splash.png
echo 3. Copy icon-512x512.png to assets\adaptive-icon.png
echo 4. Run: npm start
echo.
echo Read REACT_NATIVE_SETUP.md for detailed instructions
echo ========================================
pause

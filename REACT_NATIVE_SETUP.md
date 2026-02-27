# React Native Mobile App Setup Guide

## Overview
Your PWA has been converted to a React Native mobile app using Expo. This provides true native mobile apps for Android and iOS.

## Prerequisites
```bash
npm install -g expo-cli eas-cli
```

## Installation Steps

### 1. Backup Current PWA
```bash
mkdir AgriAssist-PWA-Backup
xcopy AgriAssist AgriAssist-PWA-Backup /E /I
```

### 2. Replace package.json
```bash
del package.json
ren package-rn.json package.json
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Update File Extensions
Rename these files to use React Native versions:
- `src/lib/supabase.native.ts` → `src/lib/supabase.ts`
- `src/contexts/AuthContext.native.tsx` → `src/contexts/AuthContext.tsx`
- `src/contexts/ToastContext.native.tsx` → `src/contexts/ToastContext.tsx`
- `src/i18n/config.native.ts` → `src/i18n/config.ts`
- `src/hooks/useUnreadCount.native.ts` → `src/hooks/useUnreadCount.ts`

### 5. Create Assets Folder
```bash
mkdir assets
```
Copy your icon from `public/icons/icon-512x512.png` to `assets/icon.png`
Copy for splash screen: `assets/splash.png`
Copy for adaptive icon: `assets/adaptive-icon.png`

## Running the App

### Development
```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

### Testing on Physical Device
1. Install "Expo Go" app from Play Store/App Store
2. Run `npm start`
3. Scan QR code with Expo Go

## Building for Production

### Android APK
```bash
# Configure EAS
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Android AAB (Play Store)
```bash
eas build --platform android --profile production
```

### iOS (Requires Mac + Apple Developer Account)
```bash
eas build --platform ios --profile production
```

## Key Differences from PWA

### ✅ Advantages
- **True Native App**: Runs natively on Android/iOS
- **Better Performance**: No browser overhead
- **Full Device Access**: Camera, GPS, sensors
- **App Store Distribution**: Google Play & Apple App Store
- **Offline by Default**: No service worker needed
- **Push Notifications**: Native notifications

### 📱 React Native Features Used
- **Navigation**: React Navigation (Stack Navigator)
- **Storage**: AsyncStorage (replaces localStorage)
- **Location**: expo-location
- **Speech**: expo-speech (text-to-speech)
- **Network**: @react-native-community/netinfo

### 🔄 Migration Changes
1. **Styling**: Tailwind CSS → React Native StyleSheet
2. **Components**: HTML elements → React Native components
   - `<div>` → `<View>`
   - `<p>` → `<Text>`
   - `<button>` → `<TouchableOpacity>`
   - `<input>` → `<TextInput>`
3. **Navigation**: React Router → React Navigation
4. **Storage**: localStorage → AsyncStorage
5. **Icons**: SVG → Emoji/Icon libraries

## File Structure
```
AgriAssist/
├── App.tsx                    # Main app entry
├── app.json                   # Expo configuration
├── assets/                    # App icons & splash
├── src/
│   ├── screens/              # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── WeatherScreen.tsx
│   │   ├── MarketScreen.tsx
│   │   ├── PestScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── OfficerDashboardScreen.tsx
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   └── i18n/                 # Translations
```

## Environment Variables
Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=https://wcwoezciqsxvmxkfrsyn.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## Features Preserved
✅ Kinyarwanda/English i18n
✅ Offline-first with AsyncStorage
✅ Supabase authentication
✅ Real-time chat
✅ Weather, Market, Pest data
✅ Officer dashboard
✅ Location services
✅ Audio support (expo-speech)

## Testing Checklist
- [ ] Login/Register flow
- [ ] Navigation between screens
- [ ] Weather data loading
- [ ] Market prices display
- [ ] Pest alerts
- [ ] Real-time chat
- [ ] Offline functionality
- [ ] Language switching
- [ ] Location permissions
- [ ] Push notifications

## Troubleshooting

### Metro Bundler Issues
```bash
npx expo start --clear
```

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
```

### iOS Build Fails (Mac)
```bash
cd ios
pod install
cd ..
```

## Next Steps
1. Test on physical Android device
2. Configure app signing for Play Store
3. Set up push notifications
4. Add app analytics
5. Submit to Google Play Store

## Support
- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- Supabase React Native: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native

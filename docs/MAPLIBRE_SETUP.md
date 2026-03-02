# MapLibre Setup - Cross-Platform Guide

## Overview

This project uses **MapLibre GL** for rendering maps on both iOS and Android. MapLibre requires **native module compilation**, which means you cannot use Expo Go. Instead, you need to build a **development client**.

---

## Quick Start (Recommended)

### Option 1: EAS Build (Cloud Build) - Works for Both Platforms

Build on Expo's cloud servers - **no local Android Studio or Xcode required**:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure EAS for your project (first time only)
eas build:configure

# Build development client for Android
eas build --profile development --platform android

# Build development client for iOS
eas build --profile development --platform ios

# Build for both platforms
eas build --profile development --platform all
```

**What happens:**
1. Expo builds your app in the cloud with MapLibre native modules included
2. You get an APK (Android) or IPA (iOS) to install
3. Maps render correctly with all features

**Download & Install:**
- **Android**: Download APK and install directly
- **iOS**: Follow EAS instructions to install via TestFlight or direct installation

---

### Option 2: Local Development Build

If you prefer building locally (requires Android Studio for Android, Xcode for iOS):

#### For Android:
```bash
# Generate native Android code
npx expo prebuild --platform android

# Build and run on Android device/emulator
npx expo run:android
```

#### For iOS (macOS only):
```bash
# Generate native iOS code
npx expo prebuild --platform ios

# Install pods
cd ios && pod install && cd ..

# Build and run on iOS simulator/device
npx expo run:ios
```

#### For Both Platforms:
```bash
# Generate both native folders
npx expo prebuild

# Build for Android
npx expo run:android

# Build for iOS (macOS only)
npx expo run:ios
```

**Note:** Native folders (`/android` and `/ios`) are git-ignored and regenerated as needed.

---

## Why MapLibre Needs Native Code

- **Expo Go** is a pre-built app that includes common packages
- **MapLibre** requires OpenGL native rendering code not included in Expo Go
- **Development Client** = Custom build of your app with all native dependencies

---

## Running Your Development Build

After building once (via EAS or locally):

```bash
# Start the development server
npm start

# Or explicitly start for development client
npm run start:dev-client
```

Then:
- **Android**: Press 'a' or scan QR code with development build app
- **iOS**: Press 'i' or scan QR code with development build app

---

## What's Included in This Project

### MapLibre Configuration

✅ **Installed**: `@maplibre/maplibre-react-native`  
✅ **Plugin**: Added to `app.json`  
✅ **Permissions**: Location access for both platforms  
✅ **Maps**: San Juan City boundary from GeoJSON data  

### Files

- [app.json](app.json) - Expo config with MapLibre plugin
- [app/_layout.tsx](app/_layout.tsx) - App initialization
- [app/map.tsx](app/map.tsx) - Full map screen with MapLibre
- [app/(tabs)/index.tsx](app/(tabs)/index.tsx) - Dashboard with live map preview
- [src/utils/mapUtils.ts](src/utils/mapUtils.ts) - GeoJSON utilities
- [src/constants/mapOutline.ts](src/constants/mapOutline.ts) - San Juan City data
- [src/constants/config.ts](src/constants/config.ts) - Map configuration

---

## Features Implemented

### Full Map Screen
- Interactive MapLibre map with OpenFreeMap tiles
- San Juan City boundary (21 barangay polygons)
- Custom markers for facilities (City Hall, Hospital, etc.)
- Map style toggle (Liberty / Positron)
- User location tracking
- Legend for location types

### Dashboard Map Preview
- Non-interactive map preview card
- Same city boundary rendering
- Tap to navigate to full map
- Optimized zoom level for preview

---

## Troubleshooting

### Error: "View config not found for MLRNCamera"

**Cause**: Running in Expo Go or old JavaScript bundle  
**Solution**: Build a development client (see Quick Start above)

### Error: "Native module not registered"

**Cause**: Native code not compiled  
**Solution**: 
```bash
# Clean and rebuild
npx expo prebuild --clean
npx expo run:android  # or run:ios
```

### Build Errors (Local Build)

**Android**: Ensure Android Studio and SDK are installed  
**iOS**: Ensure Xcode and CocoaPods are installed (macOS only)  
**Alternative**: Use EAS Build (works on any OS)

---

## Platform-Specific Notes

### Android
- Requires API 24+ (Android 7.0+)
- Permissions: Location, Phone (for emergency calls)
- APK can be installed on physical devices or emulators

### iOS
- Requires iOS 13.4+
- Location permissions configured in `Info.plist`
- Use TestFlight or direct install for physical devices
- Xcode required for local builds (macOS only)

---

## Development Workflow

### First-Time Setup
```bash
# Install dependencies
npm install

# Build development client (choose one):
eas build --profile development --platform android
# OR
npx expo run:android
```

### Daily Development
```bash
# Start dev server
npm start

# Open in your development build app
# Changes hot-reload automatically
```

### Before Deployment
```bash
# Test on both platforms
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```

---

## Additional Resources

- [MapLibre React Native Docs](https://github.com/maplibre/maplibre-react-native)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [OpenFreeMap Tiles](https://openfreemap.org/)

---

## Next Steps

1. **Build your first development client** (EAS recommended)
2. **Install on device/emulator**
3. **Run `npm start` to begin development**
4. **Maps will render with San Juan City boundaries**

✅ Cross-platform compatible  
✅ No native folder maintenance required  
✅ Automatic rebuilds when dependencies change

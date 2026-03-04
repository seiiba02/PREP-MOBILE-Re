# Quick Start Guide - PREP Mobile

## ⚡ Get Started in 2 Ways

### 🎯 **Fast Testing (Expo Go) - No Build Required**

Test the app immediately with most features working:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Scan QR code with Expo Go app
# ✅ Dashboard, Contacts, Alerts, Profile work
# ℹ️ Maps show placeholder (need dev build for full maps)
```

**What works in Expo Go:**
- ✅ Dashboard UI
- ✅ Emergency Contacts
- ✅ Alerts System  
- ✅ Training Resources
- ✅ Profile Management
- ⚠️ Maps (shows placeholder with build instructions)

---

### 🗺️ **Full Experience (Development Build) - Includes MapLibre**

To see interactive maps with San Juan City boundaries:

#### **Method A: EAS Build (Recommended - Works on Any OS)**

```bash
# Install EAS CLI globally (one-time)
npm install -g eas-cli

# Login to Expo
eas login

# Build for your platform
eas build --profile development --platform android   # For Android
eas build --profile development --platform ios       # For iOS
eas build --profile development --platform all       # For both
```

**Installation:**
- **Android**: Download APK and install
- **iOS**: Install via TestFlight or direct install

#### **Method B: Local Build**

**Android** (requires Android Studio):
```bash
npx expo run:android
```

**iOS** (requires macOS + Xcode):
```bash
npx expo run:ios
```

---

## 🎨 What You'll See

### In Expo Go (Quick Testing)
- Full app UI and navigation
- Map placeholders with "Build Development Client" instructions
- All non-map features fully functional

### In Development Build (Full Experience)
- Everything from Expo Go PLUS:
- ✅ **Interactive Maps** with OpenFreeMap tiles
- ✅ **San Juan City Boundaries** (21 barangay polygons)
- ✅ **Location Markers** (City Hall, Hospital, Evacuation Centers)
- ✅ **Live Map Preview** on dashboard
- ✅ **Map Style Toggle** (Liberty/Positron)

---

## 🔄 Daily Development Workflow

### If Using Expo Go (Testing Only)
```bash
npm start
# Scan QR with Expo Go
# Fast iteration, map placeholders shown
```

### If Using Development Build
```bash
npm start
# Scan QR with your development build app
# Full features including interactive maps
```

---

## 📱 Cross-Platform Testing

## 📱 Cross-Platform Testing

The app works on **both iOS and Android**:

| Feature | Android | iOS | Expo Go |
|---------|---------|-----|---------|
| Dashboard | ✅ | ✅ | ✅ |
| Contacts | ✅ | ✅ | ✅ |
| Alerts | ✅ | ✅ | ✅ |
| MapLibre Maps | ✅* | ✅* | ⚠️ (placeholder) |

*Requires development build

---

## 🆘 Common Questions

### Q: Why do I see "View config not found for MLRNCamera"?
**A:** You're running in Expo Go. MapLibre requires native code. The app now shows placeholders in Expo Go - build a development client for full maps.

### Q: Can I test without building?
**A:** Yes! Run `npm start` and use Expo Go. Most features work, maps show helpful placeholders.

### Q: How do I get the maps working?
**A:** Build a development client using EAS Build or local build (see Method A/B above).

### Q: Is MapLibre compatible with React Native?
**A:** **Yes!** MapLibre is fully compatible. It just needs native modules (not available in Expo Go).

### Q: Do I need to build for both platforms?
**A:** Only build for the platforms you want to test. Use `--platform all` for both.

---

## 🚀 Recommended Path

**For Quick Testing:**
```bash
npm start
# Use Expo Go - see everything except interactive maps
```

**For Full Experience:**
```bash
eas build --profile development --platform android
# Install APK - full MapLibre maps included
```

---

## 📚 More Resources

- **Full Setup**: [README.md](README.md)
- **MapLibre Details**: [MAPLIBRE_SETUP.md](MAPLIBRE_SETUP.md)
- **Expo Go vs Dev Build**: [Expo Docs](https://docs.expo.dev/develop/development-builds/introduction/)

---

**Ready to develop!**

```bash
# Test quickly in Expo Go
npm start

# Or build for full features
eas build --profile development --platform android
```

✅ **MapLibre IS compatible** with React Native  
✅ App works in **Expo Go** (with map placeholders)  
✅ Full maps in **Development Build**  
✅ **Cross-platform** iOS & Android support

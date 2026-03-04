# PREP Mobile

**PREP Mobile** is a cross-platform mobile application built with **React Native** and **Expo**. It is designed to provide residents of San Juan City with real-time emergency alerts, interactive maps for evacuation centers, and a comprehensive directory of emergency contacts.

---

## 🚀 Overview

This application serves as a central hub for disaster preparedness and emergency response. It leverages **MapLibre GL** for high-performance, open-source mapping without the need for proprietary API keys.

### Key Features

- 📱 **Interactive Dashboard**: Quick access to weather updates, nearest evacuation centers, and recent alerts.
- 🗺️ **Interactive Maps**: Full MapLibre integration featuring San Juan City's 21 barangay boundaries and markers for key infrastructure (City Hall, Fire Stations, Hospitals).
- 🚨 **Real-time Alerts**: Categorized alerts with severity levels to keep residents informed.
- ☎️ **Emergency Directory**: Organized contact information for District 1 and District 2 barangays with direct-call integration.
- 🆘 **SOS Emergency Feature**: Quick-access slider for immediate emergency assistance.
- 🎓 **Training Resources**: Educational materials and videos for disaster preparedness.

---

## 🛠️ Technology Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Maps**: [MapLibre GL](https://maplibre.org/)
- **UI Components**: Custom components with [Lucide React Native](https://lucide.dev/) and [Material Community Icons](https://icons.expo.fyi/)
- **State Management**: React Context API
- **Styling**: React Native StyleSheet

---

## 🏃 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/expo-go) app on your mobile device (for quick testing)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/PREP-MOBILE-Re.git
   cd PREP-MOBILE-Re
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

### 📱 Testing the App

- **Quick Test (Expo Go)**: Scan the QR code shown in your terminal. 
  *(Note: Interactive maps require a development build. Placeholders will be shown in Expo Go.)*
  
- **Full Features (Development Build)**: To use MapLibre features, you'll need to create a development build.
  ```bash
  npx expo run:android # For Android (requires Android Studio)
  npx expo run:ios     # For iOS (requires macOS and Xcode)
  ```
  Or use **EAS Build**:
  ```bash
  eas build --profile development --platform all
  ```

---

## 📁 Project Structure

```text
app/                  # Application screens (Expo Router)
├── (auth)/           # Authentication flows (Login, Register, OTP)
├── (tabs)/           # Main app navigation (Dashboard, Incident, Profile, Training)
│   └── contacts/     # Emergency directory
├── alerts.tsx        # Notification center
├── map.tsx           # Full interactive map
└── _layout.tsx       # Root configuration
src/
├── components/       # Reusable UI components
├── constants/        # App-wide constants (colors, map data, contacts)
├── contexts/         # React Contexts (Auth, Alerts)
├── hooks/            # Custom React hooks
└── utils/            # Helper functions
assets/               # Images, fonts, and local GeoJSON data
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Resources

- [Expo Documentation](https://docs.expo.dev/)
- [MapLibre GL Documentation](https://maplibre.org/maplibre-gl-js-docs/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

---

Developed for **San Juan City Emergency Preparedness**.

# PREP-MOBILE-Re
# PREP Mobile Application - Project Specification

> Emergency Preparedness Mobile Application for Barangay Residents in San Juan, Metro Manila

---

## 📱 Overview

**PREP Mobile** is a production-ready emergency preparedness application designed to help barangay residents stay informed and prepared during emergencies. The app provides real-time alerts, interactive maps, weather monitoring, educational resources, and quick access to emergency services.

### Target Users
- Barangay residents of San Juan, Metro Manila
- Local government units (LGUs)
- Emergency response teams

---

## 🛠 Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native with Expo SDK |
| **Language** | TypeScript (strict mode) |
| **Navigation** | Expo Router (file-based routing) |
| **State Management** | React Context API |
| **HTTP Client** | Axios with interceptors |
| **Push Notifications** | Expo Notifications |
| **Maps** | React Native Maps |
| **Video Player** | Expo AV |
| **Storage** | AsyncStorage |
| **Styling** | React Native StyleSheet |

---

## 📁 Folder Structure

```
PREP-MOBILE-Re/
├── app/                          # Expo Router screens (file-based routing)
│   ├── (auth)/                   # Authentication group
│   │   ├── _layout.tsx           # Auth layout wrapper
│   │   ├── login.tsx             # Login screen
│   │   ├── register.tsx          # Registration screen
│   │   ├── OTP.tsx               # OTP verification screen
│   │   └── residentQ.tsx         # Resident qualification screen
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home/Dashboard screen
│   │   ├── contacts/             # Contact Directory group
│   │   │   ├── _layout.tsx       # Contacts layout (Stack)
│   │   │   ├── index.tsx         # Contact Directory screen
│   │   │   ├── district-1.tsx    # District 1 barangay list
│   │   │   ├── district-2.tsx    # District 2 barangay list
│   │   │   └── [id].tsx          # Barangay details screen
│   │   ├── incident.tsx          # Incident Report screen
│   │   ├── training.tsx          # Training Resources screen
│   │   └── profile.tsx           # User Profile screen
│   ├── _layout.tsx               # Root layout with providers
│   ├── alerts.tsx                # Emergency Alerts screen
│   └── map.tsx                   # Interactive Map screen
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── SharedHeader.tsx      # Shared gradient header with logos
│   │   ├── SOSButton.tsx         # SOS emergency button
│   │   ├── SOSModal.tsx          # SOS modal with slider
│   │   ├── SOSSlider.tsx         # SOS slide-to-call slider
│   │   └── BarangayCard.tsx      # Barangay card component
│   ├── contexts/                 # React Context providers
│   │   ├── AuthContext.tsx       # Authentication state
│   │   └── AlertContext.tsx      # Alert state and unread count
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Auth context wrapper
│   │   └── useAlerts.ts          # Alerts fetching hook
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts              # All interfaces and types
│   └── constants/                # App constants
│       ├── colors.ts             # Color palette & spacing
│       ├── config.ts             # App configuration (map, API)
│       ├── barangays.ts          # District 1 & 2 barangay data
│       ├── emergency.ts          # Emergency number constant
│       └── emergencyContacts.ts  # Barangay emergency contacts
├── assets/                       # Static assets
│   ├── images/                   # Image files (logos, district photos)
│   └── videos/                   # Local video files
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── PROJECT_SPEC.md               # This file
```

---

## ✨ Features Specification

### 1. User Authentication
- **Contact number + password login**
- **Resident registration** with required fields:
  - Full name
  - Contact number (Philippine format: +63 or 09XX)
  - Barangay selection
  - Password (min 8 characters)
- **Session persistence** with AsyncStorage
- **Auto-logout** on token expiration

### 2. Interactive Map
- **Default view**: San Juan, Metro Manila coordinates
  - Latitude: `14.6019`
  - Longitude: `121.0355`
- **Features**:
  - Evacuation centers (custom markers)
  - Hospital locations
  - Fire stations
  - Police stations
  - User's current location
- **Mobile-optimized** with pinch-to-zoom and pan gestures

### 3. Emergency Alert System
- **Push notifications** via Expo Notifications
- **Alert types**:
  - 🔴 Critical (immediate danger)
  - 🟠 Warning (potential threat)
  - 🟡 Advisory (informational)
- **Alert card display** with:
  - Type indicator (color-coded)
  - Title and message
  - Timestamp
  - Read/unread status
- **Badge indicator** showing unread count
- **Mark as read** functionality

### 4. Weather Monitoring
- **Current conditions**:
  - Temperature (°C)
  - Humidity (%)
  - Wind speed (km/h)
  - Weather description
- **Visual indicators**:
  - Weather icons
  - Color-coded severity
- **Data refresh** on pull-to-refresh

### 5. Educational Resources
- **Video library** with categories:
  - Earthquake preparedness
  - Fire safety
  - Flood response
  - First aid basics
- **In-app video player** using Expo AV
- **Offline playback** support (future phase)

### 6. Emergency Contacts
- **One-tap call** functionality via `expo-linking`
- **Pre-configured contacts**:
  - National Emergency Hotline (911)
  - Philippine Red Cross (143)
  - Bureau of Fire Protection
  - Philippine National Police
  - Local barangay hall
  - Nearest hospital /clinic
- **Category icons** for quick identification

### 7. User Profile
- **View/Edit profile** information
- **Settings**:
  - Notification preferences
  - Theme toggle (light/dark)
- **Logout** functionality

### 8. Incident Report
- **GPS-aware incident feed** showing nearby incidents
  - Location placeholder for production (uses `expo-location`)
  - Static fallback: San Juan City, Metro Manila
- **Trend summary cards**:
  - Total incidents this month
  - Active incidents count
  - Resolved incidents count
- **Incident type breakdown**:
  - Visual bar chart by category (Fire, Flood, Vehicular, Medical, Structural, Power Outage)
  - Color-coded icons per type
- **Recent incidents feed**:
  - Card list with type badge, title, location, time ago
  - Severity-coded left accent (critical/warning/advisory)
  - Status pill (Active/Resolved)
- **Incident types**: `fire`, `flood`, `vehicular`, `medical`, `structural`, `power_outage`

### 9. SOS Emergency Feature
- **Slide-to-call** SOS button available on Contact Directory
- **Full-screen modal** with blurred background
- **Calls 911** via `Linking.openURL`
- **Cross-platform** support (iOS + Android)

---

## 🎨 Design System

### Colors

```typescript
export const colors = {
  // Primary palette
  primary: '#FF4D4D',      
  secondary: '#1B2560',    
  accent: '#F59E0B',      
  
  // Alert severity
  critical: '#DC2626',     // Red
  warning: '#F97316',      // Orange
  advisory: '#EAB308',     // Yellow
  info: '#3B82F6',         // Blue
  
  // Neutral
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  
  // Dark mode
  darkBackground: '#0F172A',
  darkSurface: '#1E293B',
  darkText: '#F8FAFC',
};
```

### Typography

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| H1 | 28px | Bold | 34px |
| H2 | 24px | SemiBold | 30px |
| H3 | 20px | SemiBold | 26px |
| Body | 16px | Regular | 24px |
| Caption | 14px | Regular | 20px |
| Small | 12px | Regular | 16px |

### Spacing Scale

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

---

## 📊 Type Definitions

```typescript
// User
interface User {
  id: string;
  fullName: string;
  contactNumber: string;
  barangay: string;
  createdAt: string;
  avatarUrl?: string;
}

// Authentication
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Alert
interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'advisory' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  expiresAt?: string;
}

// Emergency Contact
interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: 'police' | 'fire' | 'medical' | 'barangay' | 'hotline';
  icon: string;
  description?: string;
}

// Weather
interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: string;
}

// Video Resource
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  category: string;
}

// Map Location
interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'evacuation' | 'hospital' | 'fire_station' | 'police_station';
  address?: string;
  contactNumber?: string;
}

// Incident
interface Incident {
  id: string;
  title: string;
  type: 'fire' | 'flood' | 'vehicular' | 'medical' | 'structural' | 'power_outage';
  location: string;
  coordinates?: { latitude: number; longitude: number };
  timeAgo: string;
  status: 'active' | 'resolved';
  severity: 'critical' | 'warning' | 'advisory';
  reportedBy?: string;
  description?: string;
}
```

---

## 🔌 API Contracts

### Base Configuration
```
Base URL: https://api.prep-mobile.ph/v1
Content-Type: application/json
Authorization: Bearer <token>
```

### Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with contact number + password |
| POST | `/auth/register` | Register new resident |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/refresh` | Refresh access token |

#### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/alerts` | Get all alerts (paginated) |
| GET | `/alerts/:id` | Get single alert |
| PATCH | `/alerts/:id/read` | Mark alert as read |
| GET | `/alerts/unread/count` | Get unread count |

#### Weather
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/weather/current` | Get current weather |
| GET | `/weather/forecast` | Get 5-day forecast |

#### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update profile |
| PATCH | `/users/me/settings` | Update settings |

#### Incidents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/incidents` | Get nearby incidents (paginated) |
| GET | `/incidents/:id` | Get single incident details |
| POST | `/incidents` | Report a new incident |
| GET | `/incidents/trends` | Get incident trend summary |
| GET | `/incidents/types` | Get incident type breakdown |

---

## 📲 Push Notification Payload

```typescript
interface PushNotificationPayload {
  to: string;  // Expo push token
  title: string;
  body: string;
  data: {
    type: 'alert' | 'weather' | 'general';
    alertId?: string;
    severity?: 'critical' | 'warning' | 'advisory';
    route?: string;  // Deep link route
  };
  sound: 'default' | null;
  priority: 'high' | 'normal';
  badge?: number;
}
```

---

## ⚙️ Configuration Constants

### Map Configuration
```typescript
export const mapConfig = {
  initialRegion: {
    latitude: 14.6019,
    longitude: 121.0355,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0221,
  },
  zoomLevel: {
    min: 10,
    max: 18,
    default: 14,
  },
};
```

### Emergency Contacts (Default)
```typescript
export const emergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'National Emergency Hotline',
    number: '911',
    category: 'hotline',
    icon: 'phone-alert',
  },
  {
    id: '2',
    name: 'Philippine Red Cross',
    number: '143',
    category: 'medical',
    icon: 'hospital',
  },
  {
    id: '3',
    name: 'Bureau of Fire Protection',
    number: '(02) 8426-0219',
    category: 'fire',
    icon: 'fire-truck',
  },
  {
    id: '4',
    name: 'PNP Hotline',
    number: '117',
    category: 'police',
    icon: 'shield-check',
  },
  {
    id: '5',
    name: 'San Juan City Hall',
    number: '(02) 8727-0711',
    category: 'barangay',
    icon: 'city',
  },
];
```

---

## 🔒 Security Considerations

1. **Token Storage**: Use `expo-secure-store` for sensitive data
2. **API Communication**: HTTPS only
3. **Input Validation**: Server-side and client-side validation
4. **Password Hashing**: bcrypt on server
5. **Rate Limiting**: Prevent brute force on auth endpoints

---

## 📈 Future Enhancements (Phase 2+)

- [ ] Offline mode with local database
- [ ] Multi-language support (Filipino/English)
- [ ] Family member check-in feature
- [x] SOS beacon with GPS coordinates *(implemented as SOS Slider)*
- [ ] Community forums/chat
- [ ] Integration with NDRRMC alerts
- [ ] Live GPS-based incident proximity detection
- [ ] Incident reporting form (user-submitted reports)
- [ ] Push notifications for nearby incidents
- [x] Incident trend dashboard *(implemented with mock data)*

---

## 📝 Development Guidelines

### Commit Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation updates
style: Code style changes
refactor: Code refactoring
test: Add/update tests
chore: Maintenance tasks
```

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use descriptive variable names
- Add JSDoc comments for complex functions
- Keep components under 200 lines

---

*Last Updated: February 2026*

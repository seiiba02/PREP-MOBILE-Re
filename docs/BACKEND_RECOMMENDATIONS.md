# PREP Mobile - Backend Implementation Recommendations

> Generated: March 2, 2026  
> Based on analysis of current project progress and PROJECT_SPEC.md

---

## 🎯 Recommended Next Backend Implementations

### 1. Incident Reporting API (Highest Priority)

The spec marks incident reporting as a future enhancement, but the Incident tab is already built on the frontend. The backend needs:

**Endpoints to implement:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/incidents` | Paginated, GPS-filtered incident list |
| POST | `/incidents` | User-submitted incident reports |
| GET | `/incidents/{id}` | Single incident details |
| GET | `/incidents/trends` | Monthly trend summary |
| GET | `/incidents/types` | Incident type breakdown by category |

**Why first?** The mobile app already has the incident screen with trend cards, type breakdown, and feed — but the spec notes it uses **mock data**. This is the biggest gap between frontend and backend.

---

### 2. Push Notification Infrastructure

The spec defines push notification payloads and the `AlertContext` is already consuming alert data. Required:

- **Expo push token registration endpoint** — `POST /users/me/push-token`
- **Notification dispatch Job** — leverage `app/Jobs/` to send via Expo's push API
- **Alert broadcast Event/Listener** — wire `app/Events/` and `app/Listeners/` so that when an alert is created, it fans out push notifications to affected barangay residents
- **Badge count sync** — `GET /alerts/unread/count` should be real-time accurate

---

### 3. Weather Integration Service

The spec requires real-time weather for San Juan, Metro Manila. Implement:

- **Weather service** in `app/Services/` that wraps OpenWeatherMap or PAGASA API
- **Cache layer** — cache weather data for 15–30 minutes
- **Endpoints**: `GET /weather/current` and `GET /weather/forecast`

---

### 4. Geospatial Incident Proximity Queries

Since the incident feed is GPS-aware, add:

- A `coordinates` (lat/lng) column on the incidents table
- A spatial query scope using Haversine formula or MySQL spatial indexes
- Filter incidents by radius from the user's reported location

---

### 5. SOS Event Logging

The SOS slider is implemented on mobile, but the backend should **log SOS activations** for audit and dispatch:

- **Endpoint**: `POST /sos` with body `{ latitude, longitude, userId }`
- Triggers an Event → Listener pipeline to notify authorities

---

## 📋 Priority Order

| Priority | Feature | Effort | Impact | Status |
|----------|---------|--------|--------|--------|
| 🔴 1 | Incident CRUD + Trends API | Medium | High — replaces mock data | ⬜ Not Started |
| 🔴 2 | Push Notification dispatch | Medium | High — core emergency feature | ⬜ Not Started |
| 🟠 3 | Weather API integration | Low | Medium — cached external API | ⬜ Not Started |
| 🟠 4 | Geospatial incident queries | Medium | Medium — proximity filtering | ⬜ Not Started |
| 🟡 5 | SOS event logging + dispatch | Low | Medium — audit trail | ⬜ Not Started |

---

## 📝 Notes

- **Start with Incident CRUD** — it closes the largest frontend-to-backend gap and directly supports the already-built Incident tab, trend cards, and type breakdown charts.
- Update the `Status` column as each feature is completed.
- Refer to `PROJECT_SPEC.md` for full API contracts and type definitions.

---

*Last Updated: March 2, 2026*
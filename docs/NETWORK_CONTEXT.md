# NetworkContext — Connectivity Detection

## Overview

`src/contexts/NetworkContext.tsx` provides `isConnected: boolean | null` to the entire app via `NetworkProvider` (wrapped in `app/_layout.tsx`).

## Why Pure JS Probe?

Native connectivity modules (`expo-network`, `@react-native-community/netinfo`) caused runtime issues in this project environment (`Cannot find native module 'ExpoNetwork'`).

**Current solution:** Connectivity is detected with a pure JS HTTP probe (`fetch`) plus web `online/offline` events. This avoids native-module crashes and works in Expo Go and production builds.

---

## Behavior by Platform

| Scenario | Behavior |
|---|---|
| Native | Uses periodic HTTP probe to backend host (`fetch`) |
| Web | Uses `navigator.onLine` + `window.addEventListener('online'/'offline')` |

---

## Production / Deployment Notes

✅ **Keep the pure JS probe approach in production.** It is stable and avoids native-module dependency failures.

⚠️ **Accuracy caveat:** Probe reliability depends on the endpoint used.

### Before a production release:
1. Use a stable API probe endpoint (recommended: lightweight `/api/v1/health` route).
2. Prefer `GET` (or a guaranteed-supported `HEAD`) on that endpoint to avoid false offline results.
3. Consider increasing poll interval for production battery/network efficiency (e.g. `15-30s` instead of `10s`).
4. Verify on a production build that offline banner and skeleton loaders behave correctly.

---

## Files Involved

| File | Role |
|---|---|
| `src/contexts/NetworkContext.tsx` | Provider + pure JS connectivity probe logic |
| `src/hooks/useNetwork.ts` | Convenience re-export |
| `src/components/common/OfflineBanner.tsx` | Persistent red banner (all screens) |
| `src/components/common/OfflineEmptyState.tsx` | Empty state on Home, Incidents, Alerts |
| `app/_layout.tsx` | Wraps app with `NetworkProvider` (outermost) |
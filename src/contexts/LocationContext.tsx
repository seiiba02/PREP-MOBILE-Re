import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type * as ExpoLocation from 'expo-location';

// Expo-Go-safe lazy require — null when the native module is not compiled in.
let Location: typeof ExpoLocation | null = null;
try { Location = require('expo-location'); } catch { Location = null; }

// ── Types ─────────────────────────────────────────────────────────────────────

interface LocationContextValue {
    /** Last known GPS coords as [longitude, latitude] (MapLibre order), or null */
    userCoords: [number, number] | null;
    /** True while the initial GPS fix is being acquired */
    isLocating: boolean;
    /**
     * Called by MapLibreGL.UserLocation.onUpdate to feed live map-session
     * coords into the context (supplements the expo-location background fix).
     */
    updateCoords: (coords: [number, number]) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const LocationContext = createContext<LocationContextValue>({
    userCoords: null,
    isLocating: false,
    updateCoords: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
    // True when expo-location is available and we're waiting for the first fix
    const [isLocating, setIsLocating] = useState(Location !== null);
    const subscriptionRef = useRef<ExpoLocation.LocationSubscription | null>(null);

    // ── Acquire GPS via expo-location as soon as the app mounts ──────────
    // Works in production EAS builds. In Expo Go, Location is null so this
    // block is skipped entirely — coords will still arrive via MapLibre's
    // onUpdate once the map tab is opened.
    useEffect(() => {
        if (!Location) return;

        let cancelled = false;

        (async () => {
            try {
                const { status } = await Location!.requestForegroundPermissionsAsync();
                if (status !== Location!.PermissionStatus.GRANTED || cancelled) {
                    if (!cancelled) setIsLocating(false);
                    return;
                }

                // Quick initial fix so the card populates fast
                const initial = await Location!.getCurrentPositionAsync({
                    accuracy: Location!.Accuracy.Balanced,
                });
                if (!cancelled) {
                    setUserCoords([initial.coords.longitude, initial.coords.latitude]);
                    setIsLocating(false);
                }

                // Keep updating as user moves (10 m threshold)
                subscriptionRef.current = await Location!.watchPositionAsync(
                    { accuracy: Location!.Accuracy.High, distanceInterval: 10, timeInterval: 5000 },
                    (loc) => {
                        if (!cancelled) {
                            setUserCoords([loc.coords.longitude, loc.coords.latitude]);
                        }
                    },
                );
            } catch {
                // Silently ignore — MapLibre will still provide coords once map opens
                if (!cancelled) setIsLocating(false);
            }
        })();

        return () => {
            cancelled = true;
            subscriptionRef.current?.remove();
            subscriptionRef.current = null;
        };
    }, []);

    // ── Also accept coords pushed from MapLibre's onUpdate ───────────────
    const updateCoords = useCallback((coords: [number, number]) => {
        setUserCoords(coords);
    }, []);

    return (
        <LocationContext.Provider value={{ userCoords, isLocating, updateCoords }}>
            {children}
        </LocationContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/** Access the app-wide GPS position (sourced from expo-location or MapLibre). */
export function useUserLocation() {
    return useContext(LocationContext);
}
